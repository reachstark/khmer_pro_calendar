import { ref, watch, onMounted } from 'vue'

export type AppTheme = 'light' | 'dark' | 'system'
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl'
export type FontFamilyOption = 'google-sans' | 'kantumruy' | 'siemreap' | 'moul'

const THEME_STORAGE_KEY = 'khmer_calendar_theme'
const START_OF_WEEK_KEY = 'khmer_calendar_start_of_week'
const SHOW_WEEK_NUM_KEY = 'khmer_calendar_show_week_num'
const FONT_SIZE_KEY = 'khmer_calendar_font_size'
const FONT_FAMILY_KEY = 'khmer_calendar_font_family'
const SEASONS_ANIM_KEY = 'khmer_calendar_seasons_anim'

// Global reactive states so all components share the exact same instance
const theme = ref<AppTheme>('system')
const startOfWeek = ref<number>(0) // 0: Sunday, 1: Monday, 6: Saturday
const showWeekNumbers = ref<boolean>(true)
const fontSize = ref<FontSizeScale>('md')
const fontFamily = ref<FontFamilyOption>('google-sans')
const enableSeasonsAnim = ref<boolean>(true)

const fontSizeValues: Record<FontSizeScale, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
}

let isInitialized = false

export function useCalendarSettings() {
  function applyTheme(targetTheme: AppTheme) {
    const isDark =
      targetTheme === 'dark' ||
      (targetTheme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function applyFontSize(size: FontSizeScale) {
    const px = fontSizeValues[size] || '16px'
    document.documentElement.style.setProperty('--app-font-size', px)
  }

  function applyFontFamily(family: FontFamilyOption) {
    const fontMap: Record<FontFamilyOption, string> = {
      'google-sans': "'Google Sans', 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      'kantumruy': "'Kantumruy Pro', sans-serif",
      'siemreap': "'Siemreap', 'Khmer OS Siemreap', sans-serif",
      'moul': "'Moul', 'Moul Light', 'Khmer OS Moul', cursive, sans-serif",
    }
    const selectedFont = fontMap[family] || fontMap['google-sans']
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-family', selectedFont)
      if (document.body) {
        document.body.style.setProperty('--app-font-family', selectedFont)
      }
      const fontClasses = [
        'font-theme-google-sans',
        'font-theme-kantumruy',
        'font-theme-siemreap',
        'font-theme-moul',
      ]
      fontClasses.forEach((cls) => document.documentElement.classList.remove(cls))
      document.documentElement.classList.add(`font-theme-${family}`)
    }
  }

  function init() {
    if (isInitialized) return
    isInitialized = true

    // Load theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme
    }

    // Load start of week
    const savedStartOfWeek = localStorage.getItem(START_OF_WEEK_KEY)
    if (savedStartOfWeek !== null) {
      const parsed = parseInt(savedStartOfWeek, 10)
      if (!isNaN(parsed) && [0, 1, 6].includes(parsed)) {
        startOfWeek.value = parsed
      }
    }

    // Load show week numbers
    const savedShowWeekNum = localStorage.getItem(SHOW_WEEK_NUM_KEY)
    if (savedShowWeekNum !== null) {
      showWeekNumbers.value = savedShowWeekNum === 'true'
    }

    // Load font size
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSizeScale | null
    if (savedFontSize && ['sm', 'md', 'lg', 'xl'].includes(savedFontSize)) {
      fontSize.value = savedFontSize
    }

    // Load font family
    const savedFontFamily = localStorage.getItem(FONT_FAMILY_KEY) as FontFamilyOption | null
    if (savedFontFamily && ['google-sans', 'kantumruy', 'siemreap', 'moul'].includes(savedFontFamily)) {
      fontFamily.value = savedFontFamily
    }

    // Load seasons animation toggle
    const savedSeasons = localStorage.getItem(SEASONS_ANIM_KEY)
    if (savedSeasons !== null) {
      enableSeasonsAnim.value = savedSeasons === 'true'
    }

    applyTheme(theme.value)
    applyFontSize(fontSize.value)
    applyFontFamily(fontFamily.value)

    // Watch system color scheme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (theme.value === 'system') {
          applyTheme('system')
        }
      })
    }
  }

  // Watchers to persist & apply changes
  watch(theme, (newTheme) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  })

  watch(startOfWeek, (newDay) => {
    localStorage.setItem(START_OF_WEEK_KEY, newDay.toString())
  })

  watch(showWeekNumbers, (show) => {
    localStorage.setItem(SHOW_WEEK_NUM_KEY, show.toString())
  })

  watch(fontSize, (newSize) => {
    localStorage.setItem(FONT_SIZE_KEY, newSize)
    applyFontSize(newSize)
  })

  watch(fontFamily, (newFamily) => {
    localStorage.setItem(FONT_FAMILY_KEY, newFamily)
    applyFontFamily(newFamily)
  })

  watch(enableSeasonsAnim, (enable) => {
    localStorage.setItem(SEASONS_ANIM_KEY, enable.toString())
  })

  onMounted(() => {
    init()
  })

  return {
    theme,
    startOfWeek,
    showWeekNumbers,
    fontSize,
    fontFamily,
    enableSeasonsAnim,
    setTheme: (t: AppTheme) => (theme.value = t),
    setStartOfWeek: (d: number) => (startOfWeek.value = d),
    toggleWeekNumbers: () => (showWeekNumbers.value = !showWeekNumbers.value),
    setFontSize: (s: FontSizeScale) => (fontSize.value = s),
    setFontFamily: (f: FontFamilyOption) => {
      fontFamily.value = f
      applyFontFamily(f)
    },
    toggleSeasonsAnim: () => (enableSeasonsAnim.value = !enableSeasonsAnim.value),
    init,
  }
}
