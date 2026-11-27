import { getKhmerDayDetail, toKhmerNumber, type KhmerDayDetail } from '@/utils/khmerCalendar'
import { KHMER_ZODIAC_LIST, type KhmerZodiacInfo } from '@/utils/khmerZodiac'

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'] as const

export function toArabicNumber(input: string): string {
  return Array.from(input)
    .map((ch) => {
      const idx = KHMER_DIGITS.indexOf(ch as (typeof KHMER_DIGITS)[number])
      return idx !== -1 ? String(idx) : ch
    })
    .join('')
}

export interface DateSpanResult {
  isReversed: boolean
  years: number
  months: number
  days: number
  totalDays: number
  workdays: number
  weekendDays: number
  publicHolidaysOff: number
  holidayNames: string[]
}

function parseLocalIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null
  const y = Number(match[1])
  const m = Number(match[2])
  const d = Number(match[3])
  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null
  }
  return date
}

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function diffYearsMonthsDays(
  start: Date,
  end: Date,
): { years: number; months: number; days: number } {
  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate()
    days += prevMonthLastDay
    months -= 1
  }

  if (months < 0) {
    months += 12
    years -= 1
  }

  return { years, months, days }
}

export function calculateDateSpan(
  startIso: string,
  endIso: string,
  includeEndDate = false,
):
  | { ok: true; data: DateSpanResult }
  | { ok: false; reason: 'empty' | 'invalid' | 'range_too_large' } {
  if (!startIso.trim() || !endIso.trim()) {
    return { ok: false, reason: 'empty' }
  }

  const rawStart = parseLocalIsoDate(startIso)
  const rawEnd = parseLocalIsoDate(endIso)
  if (!rawStart || !rawEnd) {
    return { ok: false, reason: 'invalid' }
  }

  const isReversed = rawStart.getTime() > rawEnd.getTime()
  const start = isReversed ? rawEnd : rawStart
  const baseEnd = isReversed ? rawStart : rawEnd

  const effectiveEnd = includeEndDate
    ? new Date(baseEnd.getFullYear(), baseEnd.getMonth(), baseEnd.getDate() + 1)
    : baseEnd

  const msPerDay = 1000 * 60 * 60 * 24
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const endUtc = Date.UTC(
    effectiveEnd.getFullYear(),
    effectiveEnd.getMonth(),
    effectiveEnd.getDate(),
  )
  const totalDays = Math.round((endUtc - startUtc) / msPerDay)

  // Cap day-by-day holiday scan to 50 years (18,265 days) for instant responsiveness
  if (totalDays > 18265) {
    return { ok: false, reason: 'range_too_large' }
  }

  const ymd = diffYearsMonthsDays(start, effectiveEnd)

  let workdays = 0
  let weekendDays = 0
  let publicHolidaysOff = 0
  const holidayNames: string[] = []

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  for (let i = 0; i < totalDays; i++) {
    const dow = cursor.getDay()
    const isWeekend = dow === 0 || dow === 6
    const detail = getKhmerDayDetail(cursor)
    const isOffHoliday = Boolean(detail.holiday?.isOffDay)

    if (isOffHoliday && detail.holiday) {
      publicHolidaysOff++
      if (holidayNames.length < 6 && !holidayNames.includes(detail.holiday.titleKh)) {
        holidayNames.push(detail.holiday.titleKh)
      }
    }

    if (isWeekend) {
      weekendDays++
    } else if (!isOffHoliday) {
      workdays++
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  return {
    ok: true,
    data: {
      isReversed,
      years: ymd.years,
      months: ymd.months,
      days: ymd.days,
      totalDays,
      workdays,
      weekendDays,
      publicHolidaysOff,
      holidayNames,
    },
  }
}

export interface AgeLookupResult {
  years: number
  months: number
  days: number
  totalDaysLived: number
  daysUntilNextBirthday: number
  isBirthdayToday: boolean
  birthDetail: KhmerDayDetail
  zodiac: KhmerZodiacInfo
}

export function calculateAgeAndKhmerBirth(
  birthIso: string,
  referenceDate: Date = new Date(),
):
  { ok: true; data: AgeLookupResult } | { ok: false; reason: 'empty' | 'invalid' | 'future_date' } {
  if (!birthIso.trim()) {
    return { ok: false, reason: 'empty' }
  }

  const birth = parseLocalIsoDate(birthIso)
  if (!birth) {
    return { ok: false, reason: 'invalid' }
  }

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )

  if (birth.getTime() > today.getTime()) {
    return { ok: false, reason: 'future_date' }
  }

  const ymd = diffYearsMonthsDays(birth, today)
  const birthUtc = Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate())
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const totalDaysLived = Math.round((todayUtc - birthUtc) / (1000 * 60 * 60 * 24))

  // Next solar birthday (handle Feb 29 on non-leap years as Feb 28)
  function getBirthdayInYear(targetYear: number): Date {
    const month = birth!.getMonth()
    const day = birth!.getDate()
    if (month === 1 && day === 29) {
      const test = new Date(targetYear, 1, 29)
      if (test.getMonth() !== 1) {
        return new Date(targetYear, 1, 28)
      }
      return test
    }
    return new Date(targetYear, month, day)
  }

  let nextBirthday = getBirthdayInYear(today.getFullYear())
  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday = getBirthdayInYear(today.getFullYear() + 1)
  }

  const nextUtc = Date.UTC(
    nextBirthday.getFullYear(),
    nextBirthday.getMonth(),
    nextBirthday.getDate(),
  )
  const daysUntilNextBirthday = Math.round((nextUtc - todayUtc) / (1000 * 60 * 60 * 24))
  const isBirthdayToday = daysUntilNextBirthday === 0

  const birthDetail = getKhmerDayDetail(birth)
  const zodiac = KHMER_ZODIAC_LIST[birthDetail.khmer.animalYear] ?? KHMER_ZODIAC_LIST[0]!

  return {
    ok: true,
    data: {
      years: ymd.years,
      months: ymd.months,
      days: ymd.days,
      totalDaysLived,
      daysUntilNextBirthday,
      isBirthdayToday,
      birthDetail,
      zodiac,
    },
  }
}

export type KhmerEraType = 'ad' | 'be' | 'js' | 'ms'

export interface EraConversionResult {
  ad: number
  bePreVisak: number
  bePostVisak: number
  js: number
  ms: number
  adKh: string
  bePostVisakKh: string
  jsKh: string
  msKh: string
}

export function convertKhmerEras(
  rawYearInput: string,
  sourceEra: KhmerEraType,
): { ok: true; data: EraConversionResult } | { ok: false; reason: 'empty' | 'invalid' } {
  const normalized = toArabicNumber(rawYearInput).trim()
  if (normalized.length === 0) {
    return { ok: false, reason: 'empty' }
  }

  if (!/^-?\d+$/.test(normalized)) {
    return { ok: false, reason: 'invalid' }
  }

  const value = Number(normalized)
  if (!Number.isSafeInteger(value)) {
    return { ok: false, reason: 'invalid' }
  }

  let ad: number
  switch (sourceEra) {
    case 'ad':
      ad = value
      break
    case 'be':
      ad = value - 544
      break
    case 'js':
      ad = value + 638
      break
    case 'ms':
      ad = value + 78
      break
  }

  if (ad < 1 || ad > 9999) {
    return { ok: false, reason: 'invalid' }
  }

  const bePreVisak = ad + 543
  const bePostVisak = ad + 544
  const js = ad - 638
  const ms = ad - 78

  return {
    ok: true,
    data: {
      ad,
      bePreVisak,
      bePostVisak,
      js,
      ms,
      adKh: toKhmerNumber(ad),
      bePostVisakKh: toKhmerNumber(bePostVisak),
      jsKh: toKhmerNumber(js),
      msKh: toKhmerNumber(ms),
    },
  }
}
