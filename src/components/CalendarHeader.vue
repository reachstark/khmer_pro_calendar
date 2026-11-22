<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Calendar,
  Search,
  Sun,
  Moon,
  Monitor,
  Settings,
  Layers,
  ChevronDown,
  Menu,
  X,
  Download,
} from 'lucide-vue-next'
import AppLogo from '@/components/AppLogo.vue'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { usePwaInstall } from '@/composables/usePwaInstall'
import { KHMER_SOLAR_MONTHS } from '@/utils/khmerCalendar'
import { getViewedYearZodiacSummary } from '@/utils/khmerZodiac'

const { currentYear, currentMonth, todayDetail, goToToday, isSearchOpen, isSettingsOpen } =
  useCalendarState()

const { theme, setTheme, showWeekNumbers, toggleWeekNumbers } = useCalendarSettings()
const { isInstallHelpOpen, triggerInstall } = usePwaInstall()

const isMonthDropdownOpen = ref(false)
const isYearDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Flutter SliverAppBar-inspired mobile scroll-collapse state (with hysteresis to prevent jitter)
const isSliverCollapsed = ref(false)
const isScrolledUnder = ref(false)
let scrollRaf: number | null = null

function updateSliverState() {
  scrollRaf = null
  if (typeof window === 'undefined') return
  const y = window.scrollY || window.pageYOffset || 0
  isScrolledUnder.value = y > 6

  if (window.innerWidth >= 1024) {
    isSliverCollapsed.value = false
    return
  }

  // Hysteresis thresholds: collapse past 52px, re-expand below 16px (zero bounce/jitter)
  if (!isSliverCollapsed.value && y > 52) {
    isSliverCollapsed.value = true
  } else if (isSliverCollapsed.value && y < 16) {
    isSliverCollapsed.value = false
  }
}

function handleScroll() {
  if (scrollRaf !== null) return
  scrollRaf = window.requestAnimationFrame(updateSliverState)
}

function handleGlobalKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isMonthDropdownOpen.value = false
    isYearDropdownOpen.value = false
    isMobileMenuOpen.value = false
    isInstallHelpOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKey)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
  updateSliverState()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKey)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  if (scrollRaf !== null) {
    window.cancelAnimationFrame(scrollRaf)
  }
})

// Generate list of selectable years
const yearsList = computed(() => {
  const years: number[] = []
  const start = currentYear.value - 20
  const end = currentYear.value + 20
  for (let y = start; y <= end; y++) {
    years.push(y)
  }
  return years
})

const yearZodiac = computed(() => getViewedYearZodiacSummary(currentYear.value, currentMonth.value))

function cycleTheme() {
  if (theme.value === 'light') setTheme('dark')
  else if (theme.value === 'dark') setTheme('system')
  else setTheme('light')
}

const themeIcon = computed(() => {
  if (theme.value === 'light') return Sun
  if (theme.value === 'dark') return Moon
  return Monitor
})

const isCurrentMonthToday = computed(() => {
  const now = new Date()
  return currentYear.value === now.getFullYear() && currentMonth.value === now.getMonth()
})

function selectMonth(monthIndex: number) {
  currentMonth.value = monthIndex
  isMonthDropdownOpen.value = false
}

function selectYear(year: number) {
  currentYear.value = year
  isYearDropdownOpen.value = false
}

function handleMobileInstall() {
  triggerInstall()
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-30 w-full border-b pt-[env(safe-area-inset-top,0px)] transition-all duration-300"
    :class="
      isScrolledUnder
        ? 'border-slate-200/90 bg-white/92 shadow-md shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/92 dark:shadow-black/30'
        : 'border-slate-200/70 bg-gradient-to-b from-amber-500/8 via-white/90 to-white/85 backdrop-blur-md dark:border-slate-800/70 dark:from-amber-500/10 dark:via-slate-900/90 dark:to-slate-900/85'
    "
  >
    <!-- ================================================================
         MOBILE SLIVER APP BAR (< lg): Flutter SliverAppBar Pinned + Flexible
         ================================================================ -->
    <div
      class="lg:hidden pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))]"
    >
      <!-- Flexible Space Area (Expands at top, smoothly collapses when scrolling down) -->
      <div
        class="sliver-flexible overflow-hidden transition-all duration-300 ease-out"
        :class="
          isSliverCollapsed
            ? 'grid-rows-[0fr] opacity-0 -translate-y-2 pointer-events-none'
            : 'grid-rows-[1fr] opacity-100 translate-y-0'
        "
      >
        <div class="min-h-0">
          <div class="flex items-center justify-between gap-2 pt-2.5 pb-1.5">
            <!-- Expanded Mobile Brand + Subtitle -->
            <div class="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                @click="goToToday"
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md shadow-amber-500/25 active:scale-95 transition-transform focus:outline-none"
                title="ប្រតិទិនខ្មែរ (Khmer Lunar Calendar)"
              >
                <AppLogo class="h-full w-full" />
              </button>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <h1
                    class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate"
                  >
                    ប្រតិទិនខ្មែរ
                  </h1>
                  <span
                    class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-white shadow-xs shrink-0"
                  >
                    BETA
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                  ចន្ទគតិ-សុរិយគតិ • Khmer Lunar Calendar
                </p>
              </div>
            </div>

            <!-- Right Controls: Zodiac Year Pill + Theme + Menu -->
            <div class="flex items-center gap-1.5 shrink-0">
              <div
                class="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 pl-1 pr-2 py-0.5 dark:bg-amber-500/15"
                :title="`ឆ្នាំ${yearZodiac.zodiac.nameKh} ${yearZodiac.sakName} ព.ស.${yearZodiac.beYearKh}`"
              >
                <img
                  :src="yearZodiac.zodiac.imageUrl"
                  :alt="yearZodiac.zodiac.nameKh"
                  class="h-5 w-5 rounded-full object-cover ring-1 ring-amber-400/60"
                />
                <span class="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  {{ yearZodiac.zodiac.nameKh }}
                </span>
              </div>

              <button
                type="button"
                @click="cycleTheme"
                class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-200 active:scale-95 transition-all"
                title="ប្តូរផ្ទៃពណ៌ (Theme)"
              >
                <component :is="themeIcon" class="h-4 w-4 text-amber-500" />
              </button>

              <button
                type="button"
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-200 active:scale-95 transition-all"
                aria-label="Toggle Menu"
              >
                <component :is="isMobileMenuOpen ? X : Menu" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pinned Toolbar Row (Always stays pinned like SliverAppBar pinned toolbar!) -->
      <div
        class="flex items-center justify-between gap-2 transition-all duration-300"
        :class="isSliverCollapsed ? 'py-2' : 'pt-0.5 pb-2'"
      >
        <!-- Compact Brand (Smoothly slides/fades in on the left when collapsed) -->
        <div
          class="flex items-center gap-1.5 overflow-hidden transition-all duration-300"
          :class="
            isSliverCollapsed
              ? 'max-w-[130px] opacity-100 translate-x-0'
              : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none'
          "
        >
          <button
            type="button"
            @click="goToToday"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl shadow-xs active:scale-95 transition-transform"
            title="ប្រតិទិនខ្មែរ"
          >
            <AppLogo class="h-full w-full" />
          </button>
          <span class="text-xs font-extrabold text-slate-900 dark:text-white truncate">
            ប្រតិទិនខ្មែរ
          </span>
        </div>

        <!-- Center / Expanded Month & Year Quick Selector Pill -->
        <div
          class="flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/80 px-1.5 py-0.5 dark:border-slate-700/80 dark:bg-slate-800/80 transition-all duration-300"
          :class="isSliverCollapsed ? 'mx-auto' : 'flex-1 justify-between'"
        >
          <div class="flex items-center gap-0.5">
            <!-- Mobile Month Dropdown -->
            <div class="relative">
              <button
                type="button"
                @click="isMonthDropdownOpen = !isMonthDropdownOpen"
                class="flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 hover:bg-white/80 dark:text-slate-100 dark:hover:bg-slate-700/80 transition-colors"
              >
                <span>{{ KHMER_SOLAR_MONTHS[currentMonth]?.kh || '' }}</span>
                <span
                  v-if="!isSliverCollapsed"
                  class="text-[11px] font-medium text-slate-400 dark:text-slate-400"
                >
                  {{ KHMER_SOLAR_MONTHS[currentMonth]?.en || '' }}
                </span>
                <ChevronDown class="h-3 w-3 opacity-60" />
              </button>
            </div>

            <span class="text-slate-300 dark:text-slate-600 text-xs">/</span>

            <!-- Mobile Year Dropdown -->
            <div class="relative">
              <button
                type="button"
                @click="isYearDropdownOpen = !isYearDropdownOpen"
                class="flex items-center gap-0.5 rounded-xl px-2 py-1 text-xs font-extrabold text-slate-800 hover:bg-white/80 dark:text-slate-100 dark:hover:bg-slate-700/80 transition-colors font-mono"
              >
                <span>{{ currentYear }}</span>
                <ChevronDown class="h-3 w-3 opacity-60" />
              </button>
            </div>
          </div>

          <!-- Quick Today Chip inside Expanded Toolbar -->
          <button
            v-if="!isSliverCollapsed"
            type="button"
            @click="goToToday"
            class="flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95"
            :class="
              isCurrentMonthToday
                ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/25'
                : 'bg-white text-slate-700 shadow-2xs dark:bg-slate-700 dark:text-slate-100'
            "
          >
            <Calendar class="h-3 w-3" />
            <span>ថ្ងៃនេះ</span>
          </button>
        </div>

        <!-- Compact Menu Button (Appears on right when collapsed) -->
        <div
          class="flex items-center overflow-hidden transition-all duration-300"
          :class="
            isSliverCollapsed
              ? 'max-w-[40px] opacity-100 translate-x-0'
              : 'max-w-0 opacity-0 translate-x-2 pointer-events-none'
          "
        >
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 active:scale-95"
            aria-label="Toggle Menu"
          >
            <component :is="isMobileMenuOpen ? X : Menu" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================================
         DESKTOP HEADER (>= lg): Full Classic Toolbar
         ================================================================ -->
    <div class="hidden lg:flex mx-auto max-w-7xl items-center justify-between px-6 py-3">
      <!-- App Brand & Title -->
      <div class="flex items-center gap-3.5 shrink-0">
        <button
          type="button"
          @click="goToToday"
          class="flex h-11 w-11 items-center justify-center rounded-2xl shadow-md shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-transform focus:outline-none"
          title="ប្រតិទិនខ្មែរ (Khmer Lunar Calendar)"
        >
          <AppLogo class="h-full w-full" />
        </button>
        <div>
          <div class="flex items-center gap-1.5">
            <h1 class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              ប្រតិទិនខ្មែរ
            </h1>
            <span
              class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-xs"
            >
              BETA
            </span>
            <span
              class="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20"
            >
              ចន្ទគតិ-សុរិយគតិ
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Khmer Lunar Calendar • ឆ្នាំ{{ yearZodiac.zodiac.nameKh }} {{ yearZodiac.zodiac.emoji }}
          </p>
        </div>
      </div>

      <!-- Center Month / Year Quick Dropdown Selector -->
      <div class="flex items-center gap-2">
        <!-- Month Dropdown Trigger -->
        <div class="relative">
          <button
            type="button"
            @click="isMonthDropdownOpen = !isMonthDropdownOpen"
            class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{{ KHMER_SOLAR_MONTHS[currentMonth]?.kh || '' }}</span>
            <span class="text-slate-400 text-xs font-normal"
              >({{ KHMER_SOLAR_MONTHS[currentMonth]?.en || '' }})</span
            >
            <ChevronDown class="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>

        <span class="text-slate-300 dark:text-slate-700">/</span>

        <!-- Year Dropdown Trigger -->
        <div class="relative">
          <button
            type="button"
            @click="isYearDropdownOpen = !isYearDropdownOpen"
            class="flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{{ currentYear }}</span>
            <ChevronDown class="h-3.5 w-3.5 opacity-60" />
          </button>
        </div>
      </div>

      <!-- Right Action Controls (Desktop) -->
      <div class="flex items-center gap-2">
        <!-- Install as App Button (Desktop) -->
        <button
          type="button"
          @click="triggerInstall"
          class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 transition-all shadow-2xs active:scale-95"
          title="ដំឡើងជាកម្មវិធី (Install as App)"
        >
          <Download class="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>ដំឡើងជា App</span>
        </button>

        <!-- Today Button -->
        <button
          type="button"
          @click="goToToday"
          class="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all active:scale-95"
          :class="
            isCurrentMonthToday
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 hover:bg-sky-600'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
          "
          title="ទៅកាន់ថ្ងៃនេះ (Today) [T]"
        >
          <Calendar class="h-4 w-4" />
          <span>ថ្ងៃនេះ</span>
          <span
            class="rounded-md bg-white/20 dark:bg-white/10 px-1.5 py-0.5 text-xs font-bold font-mono"
          >
            {{ todayDetail.gregorian.day }}
          </span>
        </button>

        <!-- Search Button -->
        <button
          type="button"
          @click="isSearchOpen = true"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title="ស្វែងរកថ្ងៃ & ពិធីបុណ្យ (Search) [S]"
        >
          <Search class="h-5 w-5" />
        </button>

        <!-- Toggle Week Numbers Button -->
        <button
          type="button"
          @click="toggleWeekNumbers"
          class="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
          :class="
            showWeekNumbers
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          "
          title="បង្ហាញ / លាក់ លេខសប្តាហ៍ (Week Numbers)"
        >
          <Layers class="h-5 w-5" />
        </button>

        <!-- Theme Switcher Button -->
        <button
          type="button"
          @click="cycleTheme"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          :title="`ផ្ទៃពណ៌: ${theme} (Switch Theme)`"
        >
          <component :is="themeIcon" class="h-5 w-5" />
        </button>

        <!-- Settings Modal Trigger -->
        <button
          type="button"
          @click="isSettingsOpen = true"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title="ការកំណត់ (Settings)"
        >
          <Settings class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Shared Month Picker Popover (Works cleanly for both Mobile SliverAppBar & Desktop) -->
    <Teleport to="body">
      <div
        v-if="isMonthDropdownOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[calc(5.25rem+env(safe-area-inset-top,0px))] lg:pt-16 px-3"
      >
        <div
          @click="isMonthDropdownOpen = false"
          class="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px]"
        ></div>
        <div
          class="relative z-10 w-72 sm:w-80 p-2.5 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="m in KHMER_SOLAR_MONTHS"
              :key="m.index"
              type="button"
              @click="selectMonth(m.index)"
              class="flex flex-col items-center justify-center rounded-xl p-2 text-center transition-colors"
              :class="
                currentMonth === m.index
                  ? 'bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/20'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60'
              "
            >
              <span class="text-xs sm:text-sm font-bold leading-tight">{{ m.kh }}</span>
              <span class="text-[10px] opacity-75 font-normal mt-0.5">{{ m.en }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Shared Year Picker Popover (Works cleanly for both Mobile SliverAppBar & Desktop) -->
    <Teleport to="body">
      <div
        v-if="isYearDropdownOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[calc(5.25rem+env(safe-area-inset-top,0px))] lg:pt-16 px-3"
      >
        <div
          @click="isYearDropdownOpen = false"
          class="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px]"
        ></div>
        <div
          class="relative z-10 w-64 sm:w-72 max-h-72 overflow-y-auto p-2.5 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="y in yearsList"
              :key="y"
              type="button"
              @click="selectYear(y)"
              class="flex items-center justify-center rounded-xl py-2 px-1 text-xs sm:text-sm font-semibold transition-colors"
              :class="
                currentYear === y
                  ? 'bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/20'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60'
              "
            >
              <span>{{ y }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Mobile Dropdown Menu (Safe-Area Aware) -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden border-t border-slate-200/80 bg-white/95 py-3 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 shadow-xl animate-in slide-in-from-top-2 duration-150"
    >
      <div class="flex flex-col gap-2.5">
        <div
          class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800"
        >
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            ផ្ទៃពណ៌កម្មវិធី (Theme)
          </span>
          <button
            type="button"
            @click="cycleTheme"
            class="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <component :is="themeIcon" class="h-3.5 w-3.5 text-amber-500" />
            <span class="capitalize">{{ theme }}</span>
          </button>
        </div>

        <div
          class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800"
        >
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            លេខសប្តាហ៍ (Week Numbers)
          </span>
          <button
            type="button"
            @click="toggleWeekNumbers"
            class="rounded-lg px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              showWeekNumbers
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            "
          >
            {{ showWeekNumbers ? 'បង្ហាញ (ON)' : 'លាក់ (OFF)' }}
          </button>
        </div>

        <!-- PWA Install option for mobile -->
        <button
          type="button"
          @click="handleMobileInstall"
          class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 px-3 text-xs font-bold text-white shadow-xs active:scale-98 transition-transform"
        >
          <Download class="h-4 w-4" />
          <span>ដំឡើងជាកម្មវិធី App</span>
        </button>
      </div>
    </div>

    <!-- PWA Install Guidance Dialog (Safe-Area Aware) -->
    <Teleport to="body">
      <div
        v-if="isInstallHelpOpen"
        class="fixed inset-0 z-50 flex items-center justify-center pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
        @click.self="isInstallHelpOpen = false"
      >
        <div
          class="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center animate-in zoom-in-95 duration-150"
        >
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-amber-500/20 mb-3"
          >
            <AppLogo class="h-full w-full" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            របៀបដំឡើងកម្មវិធី (Install as App)
          </h3>
          <p class="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
            • <strong>លើ Chrome / Edge:</strong> ចុចលើរូបតំណាង
            <strong>Install</strong> (រូបកុំព្យូទ័រ/ព្រួញចុះក្រោម) នៅខាងស្តាំនៃរបារអាសយដ្ឋាន
            (Address Bar)។<br /><br />
            • <strong>លើ Safari (iPhone/iPad):</strong> ចុចប៊ូតុង <strong>Share</strong> រួចជ្រើសរើស
            <strong>"Add to Home Screen"</strong>។
          </p>
          <button
            type="button"
            @click="isInstallHelpOpen = false"
            class="mt-5 w-full rounded-2xl bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
          >
            យល់ព្រម
          </button>
        </div>
      </div>
    </Teleport>
  </header>
</template>
