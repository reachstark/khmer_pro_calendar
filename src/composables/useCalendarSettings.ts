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

// LocalStorage demo preview keys
export const PREVIEW_COUNTDOWN_KEY = 'khmer_calendar_preview_countdown'
export const PREVIEW_DECEMBER_KEY = 'khmer_calendar_preview_december'
export const PREVIEW_VALENTINE_KEY = 'khmer_calendar_preview_valentine'
export const PREVIEW_CNY_KEY = 'khmer_calendar_preview_cny'
export const PREVIEW_HALLOWEEN_KEY = 'khmer_calendar_preview_halloween'

// Global reactive states so all components share the exact same instance
const theme = ref<AppTheme>('system')
const startOfWeek = ref<number>(0) // 0: Sunday, 1: Monday, 6: Saturday
const showWeekNumbers = ref<boolean>(true)
const fontSize = ref<FontSizeScale>('md')
const fontFamily = ref<FontFamilyOption>('google-sans')
const enableSeasonsAnim = ref<boolean>(true)

// Demo preview states for festive features
const previewCountdown = ref<boolean>(false)
const previewDecember = ref<boolean>(false)
const previewValentine = ref<boolean>(false)
const previewCNY = ref<boolean>(false)
const previewHalloween = ref<boolean>(false)

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
      'google-sans':
        "'Google Sans', 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, sans-serif",
      kantumruy: "'Kantumruy Pro', sans-serif",
      siemreap: "'Siemreap', 'Khmer OS Siemreap', sans-serif",
      moul: "'Moul', 'Moul Light', 'Khmer OS Moul', cursive, sans-serif",
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
      fontClasses.forEach((cls) => {
        document.documentElement.classList.remove(cls)
        if (document.body) {
          document.body.classList.remove(cls)
        }
      })
      document.documentElement.classList.add(`font-theme-${family}`)
      if (document.body) {
        document.body.classList.add(`font-theme-${family}`)
      }
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
    if (
      savedFontFamily &&
      ['google-sans', 'kantumruy', 'siemreap', 'moul'].includes(savedFontFamily)
    ) {
      fontFamily.value = savedFontFamily
    }

    // Load seasons animation toggle
    const savedSeasons = localStorage.getItem(SEASONS_ANIM_KEY)
    if (savedSeasons !== null) {
      enableSeasonsAnim.value = savedSeasons === 'true'
    }

    // Load demo / preview flags from localStorage or URL query parameters
    const urlParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

    previewCountdown.value =
      urlParams?.get('previewCountdown') === 'true' ||
      localStorage.getItem(PREVIEW_COUNTDOWN_KEY) === 'true'

    previewDecember.value =
      urlParams?.get('previewDecember') === 'true' ||
      urlParams?.get('previewSnow') === 'true' ||
      localStorage.getItem(PREVIEW_DECEMBER_KEY) === 'true'

    previewValentine.value =
      urlParams?.get('previewValentine') === 'true' ||
      urlParams?.get('previewHearts') === 'true' ||
      localStorage.getItem(PREVIEW_VALENTINE_KEY) === 'true'

    previewCNY.value =
      urlParams?.get('previewCNY') === 'true' ||
      urlParams?.get('previewHongbao') === 'true' ||
      localStorage.getItem(PREVIEW_CNY_KEY) === 'true'

    previewHalloween.value =
      urlParams?.get('previewHalloween') === 'true' ||
      urlParams?.get('previewBats') === 'true' ||
      localStorage.getItem(PREVIEW_HALLOWEEN_KEY) === 'true'

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

  watch(previewCountdown, (val) => {
    localStorage.setItem(PREVIEW_COUNTDOWN_KEY, val.toString())
  })

  watch(previewDecember, (val) => {
    localStorage.setItem(PREVIEW_DECEMBER_KEY, val.toString())
  })

  watch(previewValentine, (val) => {
    localStorage.setItem(PREVIEW_VALENTINE_KEY, val.toString())
  })

  watch(previewCNY, (val) => {
    localStorage.setItem(PREVIEW_CNY_KEY, val.toString())
  })

  watch(previewHalloween, (val) => {
    localStorage.setItem(PREVIEW_HALLOWEEN_KEY, val.toString())
  })

  onMounted(() => {
    init()

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === PREVIEW_COUNTDOWN_KEY) {
          previewCountdown.value = e.newValue === 'true'
        } else if (e.key === PREVIEW_DECEMBER_KEY) {
          previewDecember.value = e.newValue === 'true'
        } else if (e.key === PREVIEW_VALENTINE_KEY) {
          previewValentine.value = e.newValue === 'true'
        } else if (e.key === PREVIEW_CNY_KEY) {
          previewCNY.value = e.newValue === 'true'
        } else if (e.key === PREVIEW_HALLOWEEN_KEY) {
          previewHalloween.value = e.newValue === 'true'
        }
      })
    }
  })

  return {
    theme,
    startOfWeek,
    showWeekNumbers,
    fontSize,
    fontFamily,
    enableSeasonsAnim,
    previewCountdown,
    previewDecember,
    previewValentine,
    previewCNY,
    previewHalloween,
    setTheme: (t: AppTheme) => (theme.value = t),
    setStartOfWeek: (d: number) => (startOfWeek.value = d),
    toggleWeekNumbers: () => (showWeekNumbers.value = !showWeekNumbers.value),
    setFontSize: (s: FontSizeScale) => (fontSize.value = s),
    setFontFamily: (f: FontFamilyOption) => {
      fontFamily.value = f
      applyFontFamily(f)
    },
    toggleSeasonsAnim: () => (enableSeasonsAnim.value = !enableSeasonsAnim.value),
    togglePreviewCountdown: () => (previewCountdown.value = !previewCountdown.value),
    togglePreviewDecember: () => (previewDecember.value = !previewDecember.value),
    togglePreviewValentine: () => (previewValentine.value = !previewValentine.value),
    togglePreviewCNY: () => (previewCNY.value = !previewCNY.value),
    togglePreviewHalloween: () => (previewHalloween.value = !previewHalloween.value),
    init,
  }
}
