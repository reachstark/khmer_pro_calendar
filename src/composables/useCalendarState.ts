import { ref, computed } from 'vue'
import {
  generateMonthCalendar,
  getMonthHolidaysAndEvents,
  getKhmerDayDetail,
  type KhmerDayDetail,
  type CalendarGridWeek,
} from '@/utils/khmerCalendar'
import { getMonthTheme, type MonthTheme } from '@/utils/monthThemes'
import { useCalendarSettings } from './useCalendarSettings'

// Initialize to today's date
const now = new Date()
const currentYear = ref<number>(now.getFullYear())
const currentMonth = ref<number>(now.getMonth()) // 0-11
const navDirection = ref<'left' | 'right'>('left')
const selectedDate = ref<KhmerDayDetail | null>(null)
const isSearchOpen = ref<boolean>(false)
const isSettingsOpen = ref<boolean>(false)
const isHolidaysDrawerOpen = ref<boolean>(false)

export function useCalendarState() {
  const { startOfWeek } = useCalendarSettings()

  const todayDetail = computed(() => getKhmerDayDetail(new Date()))

  const currentMonthTheme = computed<MonthTheme>(() => {
    return getMonthTheme(currentMonth.value)
  })

  const calendarWeeks = computed<CalendarGridWeek[]>(() => {
    return generateMonthCalendar(
      currentYear.value,
      currentMonth.value,
      startOfWeek.value
    )
  })

  const monthHolidays = computed(() => {
    return getMonthHolidaysAndEvents(currentYear.value, currentMonth.value)
  })

  function nextMonth() {
    navDirection.value = 'left'
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }

  function prevMonth() {
    navDirection.value = 'right'
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }

  function setMonth(m: number) {
    if (m === currentMonth.value) return
    navDirection.value = m > currentMonth.value ? 'left' : 'right'
    currentMonth.value = m
  }

  function setYear(y: number) {
    if (y === currentYear.value) return
    navDirection.value = y > currentYear.value ? 'left' : 'right'
    currentYear.value = y
  }

  function goToToday() {
    const today = new Date()
    const targetYear = today.getFullYear()
    const targetMonth = today.getMonth()

    const isAlreadyAtTodayMonth =
      currentYear.value === targetYear && currentMonth.value === targetMonth

    if (
      targetYear > currentYear.value ||
      (targetYear === currentYear.value && targetMonth > currentMonth.value)
    ) {
      navDirection.value = 'left'
    } else if (
      targetYear < currentYear.value ||
      (targetYear === currentYear.value && targetMonth < currentMonth.value)
    ) {
      navDirection.value = 'right'
    }

    currentYear.value = targetYear
    currentMonth.value = targetMonth

    // If user is already viewing today's month, open the modal dialog menu
    // Otherwise, only animate to current month and do not open modal dialog
    if (isAlreadyAtTodayMonth) {
      selectedDate.value = getKhmerDayDetail(today)
    } else {
      selectedDate.value = null
    }
  }

  function goToDate(year: number, monthIndex: number, day?: number) {
    const isForward =
      year > currentYear.value ||
      (year === currentYear.value && monthIndex > currentMonth.value)
    navDirection.value = isForward ? 'left' : 'right'

    currentYear.value = year
    currentMonth.value = monthIndex

    if (day !== undefined) {
      const targetDate = new Date(year, monthIndex, day)
      selectedDate.value = getKhmerDayDetail(targetDate)
    }
  }

  function selectDate(dateDetail: KhmerDayDetail) {
    selectedDate.value = dateDetail
  }

  function closeModal() {
    selectedDate.value = null
  }

  function selectPrevDay() {
    if (!selectedDate.value) return
    const g = selectedDate.value.gregorian
    const prev = new Date(g.year, g.month - 1, g.day - 1)
    if (prev.getMonth() !== currentMonth.value || prev.getFullYear() !== currentYear.value) {
      currentYear.value = prev.getFullYear()
      currentMonth.value = prev.getMonth()
      navDirection.value = 'right'
    }
    selectedDate.value = getKhmerDayDetail(prev)
  }

  function selectNextDay() {
    if (!selectedDate.value) return
    const g = selectedDate.value.gregorian
    const next = new Date(g.year, g.month - 1, g.day + 1)
    if (next.getMonth() !== currentMonth.value || next.getFullYear() !== currentYear.value) {
      currentYear.value = next.getFullYear()
      currentMonth.value = next.getMonth()
      navDirection.value = 'left'
    }
    selectedDate.value = getKhmerDayDetail(next)
  }

  return {
    currentYear,
    currentMonth,
    navDirection,
    selectedDate,
    todayDetail,
    currentMonthTheme,
    calendarWeeks,
    monthHolidays,
    isSearchOpen,
    isSettingsOpen,
    isHolidaysDrawerOpen,
    nextMonth,
    prevMonth,
    setMonth,
    setYear,
    goToToday,
    goToDate,
    selectDate,
    closeModal,
    selectPrevDay,
    selectNextDay,
  }
}
