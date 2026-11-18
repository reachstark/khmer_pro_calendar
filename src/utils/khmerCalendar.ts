import {
  fromGregorian,
  fromDate,
  format,
  getNewYear,
  constants,
  MoonPhase,
  type KhmerConversionResult,
} from '@thyrith/momentkh'

export interface KhmerDayDetail {
  gregorian: {
    year: number
    month: number // 1-12
    day: number // 1-31
    dayOfWeek: number // 0 (Sun) - 6 (Sat)
    isoDateString: string // YYYY-MM-DD
  }
  khmer: {
    day: number
    dayKhmerNum: string
    moonPhase: MoonPhase
    moonPhaseName: string // 'កើត' | 'រោច'
    monthIndex: number
    monthName: string // 'មិគសិរ', 'បុស្ស', ...
    beYear: number
    beYearKhmerNum: string
    jsYear: number
    jsYearKhmerNum: string
    animalYear: number
    animalYearName: string // 'ជូត', 'ឆ្លូវ', ...
    animalYearEmoji: string
    sak: number
    sakName: string // 'ឯកស័ក', ...
    dayOfWeek: number
    dayOfWeekName: string // 'អាទិត្យ', ...
    solarMonthName: string // 'មករា', ...
    solarDayKhmerNum: string
    solarYearKhmerNum: string
  }
  isHolyDay: boolean // ថ្ងៃសីល
  holyDayType?: 'waxing_8' | 'full_moon' | 'waning_8' | 'new_moon' // ៨កើត, ១៥កើត, ៨រោច, ដាច់ខែ
  holyDayLabel?: string
  holiday?: HolidayEvent
  fullKhmerFormat: string
  lunarFullText: string
  solarFullText: string
  copyFormat: string
  formattedShortKhmer: string
}

export interface HolidayEvent {
  id: string
  titleKh: string
  titleEn: string
  type: 'public_holiday' | 'observance' | 'traditional'
  descriptionKh: string
  descriptionEn: string
  isOffDay: boolean // ឈប់សម្រាកការងារផ្លូវការ
  imageUrl?: string // High-resolution holiday banner image
}

// Convert western digits to Khmer numerals
export function toKhmerNumber(num: number | string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => khmerDigits[parseInt(digit, 10)] ?? digit)
}

// Khmer Day Names (0: Sunday to 6: Saturday)
export const KHMER_WEEKDAYS = [
  { id: 0, kh: 'អាទិត្យ', en: 'Sunday', shortKh: 'អា', shortEn: 'Sun' },
  { id: 1, kh: 'ចន្ទ', en: 'Monday', shortKh: 'ច', shortEn: 'Mon' },
  { id: 2, kh: 'អង្គារ', en: 'Tuesday', shortKh: 'អ', shortEn: 'Tue' },
  { id: 3, kh: 'ពុធ', en: 'Wednesday', shortKh: 'ព', shortEn: 'Wed' },
  { id: 4, kh: 'ព្រហស្បតិ៍', en: 'Thursday', shortKh: 'ព្រ', shortEn: 'Thu' },
  { id: 5, kh: 'សុក្រ', en: 'Friday', shortKh: 'សុ', shortEn: 'Fri' },
  { id: 6, kh: 'សៅរ៍', en: 'Saturday', shortKh: 'ស', shortEn: 'Sat' },
]

// Solar Month Names
export const KHMER_SOLAR_MONTHS = [
  { index: 0, kh: 'មករា', en: 'January', days: 31 },
  { index: 1, kh: 'កុម្ភៈ', en: 'February', days: 28 },
  { index: 2, kh: 'មីនា', en: 'March', days: 31 },
  { index: 3, kh: 'មេសា', en: 'April', days: 30 },
  { index: 4, kh: 'ឧសភា', en: 'May', days: 31 },
  { index: 5, kh: 'មិថុនា', en: 'June', days: 30 },
  { index: 6, kh: 'កក្កដា', en: 'July', days: 31 },
  { index: 7, kh: 'សីហា', en: 'August', days: 31 },
  { index: 8, kh: 'កញ្ញា', en: 'September', days: 30 },
  { index: 9, kh: 'តុលា', en: 'October', days: 31 },
  { index: 10, kh: 'វិច្ឆិកា', en: 'November', days: 30 },
  { index: 11, kh: 'ធ្នូ', en: 'December', days: 31 },
]

// Normalize lunar month spelling for display (e.g. កត្ដិក -> កត្តិក)
export function normalizeKhmerMonthName(monthName: string): string {
  if (monthName === 'កត្ដិក') return 'កត្តិក'
  return monthName
}

/**
 * Check if given date is a Buddhist Holy Day (ថ្ងៃសីល)
 */
export function getHolyDayInfo(
  year: number,
  month: number,
  day: number,
  khmerInfo: KhmerConversionResult['khmer']
): { isHolyDay: boolean; type?: 'waxing_8' | 'full_moon' | 'waning_8' | 'new_moon'; label?: string } {
  // 1. 8th day of waxing moon (៨កើត)
  if (khmerInfo.day === 8 && khmerInfo.moonPhase === MoonPhase.Waxing) {
    return { isHolyDay: true, type: 'waxing_8', label: 'ថ្ងៃសីល ៨កើត' }
  }

  // 2. 15th day of waxing moon (១៥កើត) -> Full Moon (ពេញបូណ៌មី)
  if (khmerInfo.day === 15 && khmerInfo.moonPhase === MoonPhase.Waxing) {
    return { isHolyDay: true, type: 'full_moon', label: 'ថ្ងៃសីល ១៥កើត (ពេញបូណ៌មី)' }
  }

  // 3. 8th day of waning moon (៨រោច)
  if (khmerInfo.day === 8 && khmerInfo.moonPhase === MoonPhase.Waning) {
    return { isHolyDay: true, type: 'waning_8', label: 'ថ្ងៃសីល ៨រោច' }
  }

  // 4. End of lunar month (ដាច់ខែ): either 15 waning or 14 waning when next day is 1 waxing
  if (khmerInfo.moonPhase === MoonPhase.Waning) {
    if (khmerInfo.day === 15) {
      return { isHolyDay: true, type: 'new_moon', label: 'ថ្ងៃសីល ១៥រោច (ដាច់ខែ)' }
    }
    if (khmerInfo.day === 14) {
      // Check next day
      const nextDate = new Date(year, month - 1, day + 1)
      const nextKhmer = fromDate(nextDate)
      if (nextKhmer.khmer.moonPhase === MoonPhase.Waxing && nextKhmer.khmer.day === 1) {
        return { isHolyDay: true, type: 'new_moon', label: 'ថ្ងៃសីល ១៤រោច (ដាច់ខែ)' }
      }
    }
  }

  return { isHolyDay: false }
}

/**
 * Get Cambodian National Holidays and Observances for a given Gregorian date
 */
export function getCambodiaHoliday(
  year: number,
  month: number,
  day: number,
  khmerInfo: KhmerConversionResult['khmer']
): HolidayEvent | undefined {
  // --- Fixed Solar Holidays ---
  if (month === 1 && day === 1) {
    return {
      id: 'solar-new-year',
      titleKh: 'ទិវាចូលឆ្នាំសកល',
      titleEn: 'International New Year Day',
      type: 'public_holiday',
      descriptionKh: 'ការប្រារព្ធពិធីឆ្លងឆ្នាំសកលទូទាំងពិភពលោក',
      descriptionEn: 'Celebration of the first day of the Gregorian New Year',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_solar_new_year.jpg',
    }
  }

  if (month === 1 && day === 7) {
    return {
      id: 'victory-day',
      titleKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
      titleEn: 'Victory Day over Genocide',
      type: 'public_holiday',
      descriptionKh: 'រំលឹកដល់ទិវាជ័យជម្នះថ្ងៃ ៧ មករា ឆ្នាំ ១៩៧៩',
      descriptionEn: 'Commemoration of the fall of the Khmer Rouge regime in 1979',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_victory_day.jpg',
    }
  }

  if (month === 3 && day === 8) {
    return {
      id: 'womens-day',
      titleKh: 'ទិវាអន្តរជាតិនារី',
      titleEn: "International Women's Rights Day",
      type: 'public_holiday',
      descriptionKh: 'អបអរសាទរសិទ្ធិ និងសមភាពស្ត្រីទូទាំងពិភពលោក',
      descriptionEn: 'Global celebration of social, economic, cultural, and political achievements of women',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_womens_day.jpg',
    }
  }

  if (month === 5 && day === 1) {
    return {
      id: 'labour-day',
      titleKh: 'ទិវាពលកម្មអន្តរជាតិ',
      titleEn: 'International Labour Day',
      type: 'public_holiday',
      descriptionKh: 'ទិវាសាមគ្គីភាព និងសិទ្ធិរបស់កម្មករនិយោជិតអន្តរជាតិ',
      descriptionEn: 'International workers and labour rights day',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_labour_day.jpg',
    }
  }

  if (month === 5 && day === 14) {
    return {
      id: 'king-birthday',
      titleKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ',
      titleEn: "King Norodom Sihamoni's Birthday",
      type: 'public_holiday',
      descriptionKh: 'ព្រះរាជពិធីចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី',
      descriptionEn: 'Official birthday celebration of His Majesty King Norodom Sihamoni',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_king_birthday.jpg',
    }
  }

  if (month === 5 && day === 20) {
    return {
      id: 'remembrance-day',
      titleKh: 'ទិវាជាតិនៃការចងចាំ',
      titleEn: 'National Day of Remembrance',
      type: 'public_holiday',
      descriptionKh: 'គោរពវិញ្ញាណក្ខន្ធជនរងគ្រោះក្នុងរបបកម្ពុជាប្រជាធិបតេយ្យ',
      descriptionEn: 'Commemoration of victims of the Cambodian genocide',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_remembrance_day.jpg',
    }
  }

  if (month === 6 && day === 18) {
    return {
      id: 'queen-mother-birthday',
      titleKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចម៉ែ',
      titleEn: "Queen Mother Norodom Monineath Sihanouk's Birthday",
      type: 'public_holiday',
      descriptionKh: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ ព្រះវររាជមាតាជាតិខ្មែរ',
      descriptionEn: 'Official birthday of Her Majesty Queen Mother Norodom Monineath Sihanouk',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_queen_mother_birthday.jpg',
    }
  }

  if (month === 9 && day === 24) {
    return {
      id: 'constitutional-day',
      titleKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
      titleEn: 'Constitutional Day',
      type: 'public_holiday',
      descriptionKh: 'រំលឹកដល់ការប្រកាសឱ្យប្រើរដ្ឋធម្មនុញ្ញឆ្នាំ ១៩៩៣',
      descriptionEn: 'Celebration of the signing of the Cambodian Constitution in 1993',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_constitutional_day.jpg',
    }
  }

  if (month === 10 && day === 15) {
    return {
      id: 'king-father-commemoration',
      titleKh: 'ទិវាគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ',
      titleEn: 'Commemoration Day of King Father Norodom Sihanouk',
      type: 'public_holiday',
      descriptionKh: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណា ព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ',
      descriptionEn: 'Memorial day honoring King Father Norodom Sihanouk',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_king_father_commemoration.jpg',
    }
  }

  if (month === 10 && day === 29) {
    return {
      id: 'coronation-day',
      titleKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ ព្រះមហាក្សត្រ',
      titleEn: "King's Coronation Day",
      type: 'public_holiday',
      descriptionKh: 'រំលឹកខួបនៃការឡើងគ្រងរាជសម្បត្តិរបស់ ព្រះករុណា ព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី',
      descriptionEn: 'Coronation anniversary of His Majesty King Norodom Sihamoni',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_coronation_day.jpg',
    }
  }

  if (month === 11 && day === 9) {
    return {
      id: 'independence-day',
      titleKh: 'ទិវាបុណ្យឯករាជ្យជាតិ',
      titleEn: 'National Independence Day',
      type: 'public_holiday',
      descriptionKh: 'ខួបនៃការទទួលបានឯករាជ្យពេញលេញពីសាធារណរដ្ឋបារាំង ឆ្នាំ ១៩៥៣',
      descriptionEn: 'Celebration of Cambodia gaining full independence from France in 1953',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_independence_day.jpg',
    }
  }

  // --- Khmer New Year (Solar Calculated via astronomical algorithm) ---
  const ny = getNewYear(year)
  if (ny && ny.month === month) {
    if (day === ny.day) {
      return {
        id: 'kny-day-1',
        titleKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី (មហាសង្ក្រាន្ត)',
        titleEn: 'Khmer New Year (Moha Songkran)',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃដំបូងនៃពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ ទេវតាឆ្នាំថ្មីចុះមកគ្រប់គ្រងផែនដី',
        descriptionEn: 'First day of Khmer New Year welcoming the new year Angel (Devada)',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_khmer_new_year.jpg',
      }
    }
    if (day === ny.day + 1) {
      return {
        id: 'kny-day-2',
        titleKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី (វារៈវ័នបត)',
        titleEn: 'Khmer New Year (Virak Vanabat)',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃទីពីរនៃពិធីបុណ្យចូលឆ្នាំថ្មី ធ្វើបុណ្យដាក់បាត្រ និងចែកទានដល់ជនក្រីក្រ',
        descriptionEn: 'Second day of Khmer New Year, day of giving gifts to parents and elders',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_khmer_new_year.jpg',
      }
    }
    if (day === ny.day + 2) {
      return {
        id: 'kny-day-3',
        titleKh: 'ពិធីបុណ្យចូលឆ្នាំថ្មី (វារៈឡើងស័ក)',
        titleEn: 'Khmer New Year (Virak Loeng Sak)',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃឡើងស័កថ្មី ស្រង់ព្រះពុទ្ធរូប ងូតទឹកជូនមាតាបិតា និងពូនភ្នំខ្សាច់',
        descriptionEn: 'Final day of Khmer New Year, washing Buddha statues and seeking blessings',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_khmer_new_year.jpg',
      }
    }
  }

  // --- Dynamic Lunar Holidays ---

  // 1. Meak Bochea (បុណ្យមាឃបូជា) - 15 waxing Meak (ខែមាឃ index 2)
  if (khmerInfo.monthIndex === 2 && khmerInfo.day === 15 && khmerInfo.moonPhase === MoonPhase.Waxing) {
    return {
      id: 'meak-bochea',
      titleKh: 'បុណ្យមាឃបូជា',
      titleEn: 'Meak Bochea Day',
      type: 'public_holiday',
      descriptionKh: 'រំលឹកដល់ការជួបជុំសាវ័ក ១.២៥០ អង្គដោយមិនបានណាត់ និងការប្រកាសឱវាទបាតិមោក្ខ',
      descriptionEn: 'Commemorates Buddha declaring the fundamental principles of Buddhism',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_meak_bochea.jpg',
    }
  }

  // 2. Visak Bochea (បុណ្យវិសាខបូជា) - 15 waxing Pisakh (ខែពិសាខ index 5)
  if (khmerInfo.monthIndex === 5 && khmerInfo.day === 15 && khmerInfo.moonPhase === MoonPhase.Waxing) {
    return {
      id: 'visak-bochea',
      titleKh: 'បុណ្យវិសាខបូជា',
      titleEn: 'Visak Bochea Day',
      type: 'public_holiday',
      descriptionKh: 'រំលឹកដល់ព្រឹត្តិការណ៍សំខាន់ ៣ របស់ព្រះសម្មាសម្ពុទ្ធ៖ ប្រសូត ត្រាស់ដឹង និងបរិនិព្វាន',
      descriptionEn: 'The most sacred Buddhist day commemorating the Birth, Enlightenment, and Nirvana of Buddha',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_visak_bochea.jpg',
    }
  }

  // 3. Royal Ploughing Ceremony (ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល) - 4 waning Pisakh (ខែពិសាខ index 5)
  if (khmerInfo.monthIndex === 5 && khmerInfo.day === 4 && khmerInfo.moonPhase === MoonPhase.Waning) {
    return {
      id: 'royal-ploughing',
      titleKh: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
      titleEn: 'Royal Ploughing Ceremony',
      type: 'public_holiday',
      descriptionKh: 'ព្រះរាជពិធីប្រពៃណីប្រកាសចាប់ផ្តើមរដូវបង្កបង្កើនផល និងទស្សន៍ទាយភោគផលកសិកម្មតាមរយៈគោឧសភរាជ',
      descriptionEn: 'Ancient royal ceremony marking the beginning of the rice-planting season',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_royal_ploughing.jpg',
    }
  }

  // 4. Pchum Ben Festival (ពិធីបុណ្យភ្ជុំបិណ្ឌ)
  // Kan Ben 1 to 14: 1 to 14 waning Phatrabot (ភទ្របទ index 9)
  if (khmerInfo.monthIndex === 9 && khmerInfo.moonPhase === MoonPhase.Waning) {
    if (khmerInfo.day === 14) {
      return {
        id: 'pchum-ben-day-1',
        titleKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (កាន់បិណ្ឌទី១៤)',
        titleEn: 'Pchum Ben Festival (Day 1)',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃទីមួយនៃថ្ងៃឈប់សម្រាកផ្លូវការបុណ្យភ្ជុំបិណ្ឌ',
        descriptionEn: 'First official holiday day of the Pchum Ben ancestral festival',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_pchum_ben.jpg',
      }
    }
    if (khmerInfo.day === 15) {
      return {
        id: 'pchum-ben-day-2',
        titleKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌធំ',
        titleEn: 'Pchum Ben Day',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃបុណ្យភ្ជុំបិណ្ឌធំ ឧទ្ទិសកុសលជូនបុព្វការីជន និងញាតិកាលទាំង ៧ សន្តាន',
        descriptionEn: 'Main Pchum Ben Day honoring ancestors and making offerings at pagodas',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_pchum_ben.jpg',
      }
    }
    if (khmerInfo.day >= 1 && khmerInfo.day <= 13) {
      return {
        id: `kan-ben-${khmerInfo.day}`,
        titleKh: `ពិធីបុណ្យកាន់បិណ្ឌ (បិណ្ឌ ${toKhmerNumber(khmerInfo.day)})`,
        titleEn: `Kan Ben Day ${khmerInfo.day}`,
        type: 'traditional',
        descriptionKh: `វេនកាន់បិណ្ឌទី ${toKhmerNumber(khmerInfo.day)} នៃពិធីបុណ្យភ្ជុំបិណ្ឌ`,
        descriptionEn: `Kan Ben observation day ${khmerInfo.day}`,
        isOffDay: false,
      }
    }
  }

  // Day after Pchum Ben (1 waxing Assoch / អស្សុជ index 10)
  if (khmerInfo.monthIndex === 10 && khmerInfo.day === 1 && khmerInfo.moonPhase === MoonPhase.Waxing) {
    return {
      id: 'pchum-ben-day-3',
      titleKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃបញ្ចប់)',
      titleEn: 'Pchum Ben Festival (Day 3)',
      type: 'public_holiday',
      descriptionKh: 'ថ្ងៃចុងក្រោយនៃពិធីបុណ្យភ្ជុំបិណ្ឌ ជូនដំណើរដូនតាត្រឡប់ទៅវិញ',
      descriptionEn: 'Final official holiday of Pchum Ben festival',
      isOffDay: true,
      imageUrl: '/images/holidays/holiday_pchum_ben.jpg',
    }
  }

  // 5. Water, Moon & Floating Lantern Festival (ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក)
  // 14, 15 waxing Kattik (កត្តិក index 11) and 1 waning Kattik
  if (khmerInfo.monthIndex === 11) {
    if (khmerInfo.day === 14 && khmerInfo.moonPhase === MoonPhase.Waxing) {
      return {
        id: 'water-festival-1',
        titleKh: 'ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃទី១)',
        titleEn: 'Water Festival (Day 1 - Opening Boat Races)',
        type: 'public_holiday',
        descriptionKh: 'បើកការប្រណាំងទូកង និងការបណ្តែតប្រទីបអបអរសាទរ',
        descriptionEn: 'First day of Water Festival, dragon boat races opening ceremonies',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_water_festival.jpg',
      }
    }
    if (khmerInfo.day === 15 && khmerInfo.moonPhase === MoonPhase.Waxing) {
      return {
        id: 'water-festival-2',
        titleKh: 'បុណ្យអុំទូក សំពះព្រះខែ និងអកអំបុក',
        titleEn: 'Water Festival, Sampeas Preah Khe & Ok Ambok',
        type: 'public_holiday',
        descriptionKh: 'ថ្ងៃពេញបូណ៌មីសំពះព្រះខែ អកអំបុក និងបណ្តែតប្រទីបដ៏មហោឡារិក',
        descriptionEn: 'Main Water Festival day: Full moon salutation, flattened rice eating, and illuminated flotillas',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_water_festival.jpg',
      }
    }
    if (khmerInfo.day === 1 && khmerInfo.moonPhase === MoonPhase.Waning) {
      return {
        id: 'water-festival-3',
        titleKh: 'ព្រះរាជពិធីបុណ្យអុំទូក (ថ្ងៃផ្តាច់ព្រ័ត្រ)',
        titleEn: 'Water Festival (Final Races & Closing)',
        type: 'public_holiday',
        descriptionKh: 'ការប្រណាំងទូកផ្តាច់ព្រ័ត្រ កាត់ព្រ័ត្រ និងការប្រគល់រង្វាន់ជ័យលាភី',
        descriptionEn: 'Final boat races and festive closing ceremonies',
        isOffDay: true,
      imageUrl: '/images/holidays/holiday_water_festival.jpg',
      }
    }
  }

  return undefined
}

/**
 * Format exact full Khmer Date string matching:
 * "ថ្ងៃពុធ ៩កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០, ត្រូវនឹងថ្ងៃទី១៨ ខែវិច្ឆិកា ឆ្នាំ២០២៦"
 */
export function formatExactKhmerDateString(
  khmerInfo: KhmerConversionResult['khmer'],
  gregorian: { year: number; month: number; day: number; dayOfWeek: number }
): string {
  const weekday = khmerInfo.dayOfWeekName.startsWith('ថ្ងៃ')
    ? khmerInfo.dayOfWeekName
    : `ថ្ងៃ${khmerInfo.dayOfWeekName}`
  const lunarDay = `${toKhmerNumber(khmerInfo.day)}${khmerInfo.moonPhaseName}`
  const lunarMonth = `ខែ${normalizeKhmerMonthName(khmerInfo.monthName)}`
  const animalYear = `ឆ្នាំ${khmerInfo.animalYearName}`
  const sak = khmerInfo.sakName
  const beYear = `ពុទ្ធសករាជ ${toKhmerNumber(khmerInfo.beYear)}`

  const solarDay = toKhmerNumber(gregorian.day)
  const solarMonth = KHMER_SOLAR_MONTHS[gregorian.month - 1]?.kh || ''
  const solarYear = toKhmerNumber(gregorian.year)

  return `${weekday} ${lunarDay} ${lunarMonth} ${animalYear} ${sak} ${beYear}\nត្រូវនឹងថ្ងៃទី${solarDay} ខែ${solarMonth} ឆ្នាំ${solarYear}`
}

/**
 * Format copy Khmer date string strictly as requested:
 * "ថ្ងៃពុធ ៩កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០"
 */
export function formatCopyKhmerDateString(
  khmerInfo: KhmerConversionResult['khmer']
): string {
  const weekday = khmerInfo.dayOfWeekName.startsWith('ថ្ងៃ')
    ? khmerInfo.dayOfWeekName
    : `ថ្ងៃ${khmerInfo.dayOfWeekName}`
  const lunarDay = `${toKhmerNumber(khmerInfo.day)}${khmerInfo.moonPhaseName}`
  const lunarMonth = `ខែ${normalizeKhmerMonthName(khmerInfo.monthName)}`
  const animalYear = `ឆ្នាំ${khmerInfo.animalYearName}`
  const sak = khmerInfo.sakName
  const beYear = `ព.ស.${toKhmerNumber(khmerInfo.beYear)}`

  return `${weekday} ${lunarDay} ${lunarMonth} ${animalYear} ${sak} ${beYear}`
}

/**
 * Full details for any Gregorian Date
 */
export function getKhmerDayDetail(date: Date): KhmerDayDetail {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const converted = fromGregorian(year, month, day)
  const k = converted.khmer
  const g = converted.gregorian

  const holyInfo = getHolyDayInfo(year, month, day, k)
  const holiday = getCambodiaHoliday(year, month, day, k)

  const fullFormat = formatExactKhmerDateString(k, {
    year: g.year,
    month: g.month,
    day: g.day,
    dayOfWeek: g.dayOfWeek,
  })

  const weekday = k.dayOfWeekName.startsWith('ថ្ងៃ')
    ? k.dayOfWeekName
    : `ថ្ងៃ${k.dayOfWeekName}`
  const lunarDay = `${toKhmerNumber(k.day)}${k.moonPhaseName}`
  const lunarMonth = `ខែ${normalizeKhmerMonthName(k.monthName)}`
  const animalYear = `ឆ្នាំ${k.animalYearName}`
  const sak = k.sakName
  const beYear = `ពុទ្ធសករាជ ${toKhmerNumber(k.beYear)}`

  const solarDay = toKhmerNumber(g.day)
  const solarMonthKh = KHMER_SOLAR_MONTHS[g.month - 1]?.kh || ''
  const solarYear = toKhmerNumber(g.year)

  const lunarFullText = `${weekday} ${lunarDay} ${lunarMonth} ${animalYear} ${sak} ${beYear}`
  const solarFullText = `ត្រូវនឹងថ្ងៃទី${solarDay} ខែ${solarMonthKh} ឆ្នាំ${solarYear}`
  const copyFormat = formatCopyKhmerDateString(k)

  return {
    gregorian: {
      year: g.year,
      month: g.month,
      day: g.day,
      dayOfWeek: g.dayOfWeek,
      isoDateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    },
    khmer: {
      day: k.day,
      dayKhmerNum: toKhmerNumber(k.day),
      moonPhase: k.moonPhase,
      moonPhaseName: k.moonPhaseName,
      monthIndex: k.monthIndex,
      monthName: normalizeKhmerMonthName(k.monthName),
      beYear: k.beYear,
      beYearKhmerNum: toKhmerNumber(k.beYear),
      jsYear: k.jsYear,
      jsYearKhmerNum: toKhmerNumber(k.jsYear),
      animalYear: k.animalYear,
      animalYearName: k.animalYearName,
      animalYearEmoji: constants.AnimalYearEmojis[k.animalYear] || '✨',
      sak: k.sak,
      sakName: k.sakName,
      dayOfWeek: k.dayOfWeek,
      dayOfWeekName: k.dayOfWeekName,
      solarMonthName: solarMonthKh,
      solarDayKhmerNum: toKhmerNumber(g.day),
      solarYearKhmerNum: toKhmerNumber(g.year),
    },
    isHolyDay: holyInfo.isHolyDay,
    holyDayType: holyInfo.type,
    holyDayLabel: holyInfo.label,
    holiday,
    fullKhmerFormat: fullFormat,
    lunarFullText,
    solarFullText,
    copyFormat,
    formattedShortKhmer: `${toKhmerNumber(k.day)}${k.moonPhaseName} ${normalizeKhmerMonthName(k.monthName)}`,
  }
}

/**
 * Get ISO Week Number
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export interface CalendarGridWeek {
  weekNumber: number
  days: (KhmerDayDetail & { isCurrentMonth: boolean; isToday: boolean })[]
}

/**
 * Generate full month grid for given year and month (0-11)
 * Takes startOfWeek: 0 (Sun), 1 (Mon), or 6 (Sat)
 */
export function generateMonthCalendar(
  year: number,
  monthIndex: number, // 0-11
  startOfWeek: number = 0
): CalendarGridWeek[] {
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDate = today.getDate()

  const firstDayOfMonth = new Date(year, monthIndex, 1)
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0)
  const totalDaysInMonth = lastDayOfMonth.getDate()

  // Find day of week of first day (0-6)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Leading days from previous month
  let leadingDaysCount = (firstDayOfWeek - startOfWeek + 7) % 7

  const weeks: CalendarGridWeek[] = []
  let currentWeekDays: (KhmerDayDetail & { isCurrentMonth: boolean; isToday: boolean })[] = []

  // Add leading days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate()
  for (let i = leadingDaysCount - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i)
    const detail = getKhmerDayDetail(d)
    const isToday =
      d.getFullYear() === todayYear &&
      d.getMonth() === todayMonth &&
      d.getDate() === todayDate
    currentWeekDays.push({ ...detail, isCurrentMonth: false, isToday })
  }

  // Add days of current month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const d = new Date(year, monthIndex, day)
    const detail = getKhmerDayDetail(d)
    const isToday =
      year === todayYear && monthIndex === todayMonth && day === todayDate
    currentWeekDays.push({ ...detail, isCurrentMonth: true, isToday })

    if (currentWeekDays.length === 7) {
      const midWeekDate = new Date(year, monthIndex, day - 3)
      weeks.push({
        weekNumber: getISOWeekNumber(midWeekDate),
        days: currentWeekDays,
      })
      currentWeekDays = []
    }
  }

  // Add trailing days from next month
  if (currentWeekDays.length > 0) {
    let nextMonthDay = 1
    while (currentWeekDays.length < 7) {
      const d = new Date(year, monthIndex + 1, nextMonthDay++)
      const detail = getKhmerDayDetail(d)
      const isToday =
        d.getFullYear() === todayYear &&
        d.getMonth() === todayMonth &&
        d.getDate() === todayDate
      currentWeekDays.push({ ...detail, isCurrentMonth: false, isToday })
    }
    const midWeekDate = new Date(year, monthIndex, totalDaysInMonth)
    weeks.push({
      weekNumber: getISOWeekNumber(midWeekDate),
      days: currentWeekDays,
    })
  }

  return weeks
}

/**
 * Get all holidays & ថ្ងៃសីល for a given year & month (0-11)
 */
export function getMonthHolidaysAndEvents(year: number, monthIndex: number): {
  holidays: KhmerDayDetail[]
  holyDays: KhmerDayDetail[]
} {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const holidays: KhmerDayDetail[] = []
  const holyDays: KhmerDayDetail[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day)
    const detail = getKhmerDayDetail(d)
    if (detail.holiday) {
      holidays.push(detail)
    }
    if (detail.isHolyDay) {
      holyDays.push(detail)
    }
  }

  return { holidays, holyDays }
}
