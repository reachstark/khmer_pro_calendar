<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Calendar,
  Search,
  Sun,
  Moon,
  Monitor,
  Settings,
  Sparkles,
  Layers,
  ChevronDown,
  Menu,
  X,
  Download,
  Check,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { usePwaInstall } from '@/composables/usePwaInstall'
import { KHMER_SOLAR_MONTHS, toKhmerNumber } from '@/utils/khmerCalendar'

const {
  currentYear,
  currentMonth,
  todayDetail,
  goToToday,
  isSearchOpen,
  isSettingsOpen,
  isHolidaysDrawerOpen,
  monthHolidays,
} = useCalendarState()

const { theme, setTheme, showWeekNumbers, toggleWeekNumbers } = useCalendarSettings()
const { canInstall, isInstalled, isInstallHelpOpen, triggerInstall } = usePwaInstall()

const isMonthDropdownOpen = ref(false)
const isYearDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKey)
})

// Generate list of selectable years (e.g., 1900 to 2100)
const yearsList = computed(() => {
  const years: number[] = []
  const start = currentYear.value - 20
  const end = currentYear.value + 20
  for (let y = start; y <= end; y++) {
    years.push(y)
  }
  return years
})

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
  return (
    currentYear.value === now.getFullYear() &&
    currentMonth.value === now.getMonth()
  )
})
</script>

<template>
  <header
    class="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3">
      <!-- App Brand & Title -->
      <div class="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <div
          class="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 shadow-md shadow-orange-500/20 text-white transform active:scale-95 transition-transform"
        >
          <Sparkles class="h-4.5 w-4.5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <h1 class="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              ប្រតិទិនខ្មែរ
            </h1>
            <span
              class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-white shadow-xs"
            >
              BETA
            </span>
            <span
              class="hidden md:inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20"
            >
              ចន្ទគតិ-សុរិយគតិ
            </span>
          </div>
          <p class="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
            Khmer Lunar Calendar
          </p>
        </div>
      </div>

      <!-- Center Month / Year Quick Dropdown Selector -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Month Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="isMonthDropdownOpen = !isMonthDropdownOpen"
            class="flex items-center gap-1 sm:gap-1.5 rounded-xl px-2 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{{ KHMER_SOLAR_MONTHS[currentMonth]?.kh || '' }}</span>
            <span class="text-slate-400 text-xs hidden md:inline font-normal">({{ KHMER_SOLAR_MONTHS[currentMonth]?.en || '' }})</span>
            <ChevronDown class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
          </button>

          <div
            v-if="isMonthDropdownOpen"
            @click="isMonthDropdownOpen = false"
            class="fixed inset-0 z-40"
          ></div>

          <div
            v-if="isMonthDropdownOpen"
            class="absolute left-1/2 -translate-x-1/2 mt-1.5 z-50 w-72 sm:w-80 p-2 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="m in KHMER_SOLAR_MONTHS"
                :key="m.index"
                type="button"
                @click="currentMonth = m.index; isMonthDropdownOpen = false"
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

        <span class="text-slate-300 dark:text-slate-700">/</span>

        <!-- Year Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="isYearDropdownOpen = !isYearDropdownOpen"
            class="flex items-center gap-1 rounded-xl px-2 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{{ currentYear }}</span>
            <ChevronDown class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-60" />
          </button>

          <div
            v-if="isYearDropdownOpen"
            @click="isYearDropdownOpen = false"
            class="fixed inset-0 z-40"
          ></div>

          <div
            v-if="isYearDropdownOpen"
            class="absolute left-1/2 -translate-x-1/2 mt-1.5 z-50 w-64 sm:w-72 max-h-72 overflow-y-auto p-2 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="y in yearsList"
                :key="y"
                type="button"
                @click="currentYear = y; isYearDropdownOpen = false"
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
      </div>

      <!-- Right Action Controls (Desktop Only: hidden on mobile) -->
      <div class="hidden sm:flex items-center gap-1.5 sm:gap-2">
        <!-- Install as App Button (Desktop) -->
        <button
          type="button"
          @click="triggerInstall"
          class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 transition-all shadow-2xs active:scale-95"
          title="ដំឡើងជាកម្មវិធី (Install as App)"
        >
          <Download class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
          <span>ដំឡើងជា App</span>
        </button>

        <!-- Navigate to Today Button -->
        <button
          type="button"
          @click="goToToday"
          class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold shadow-sm transition-all active:scale-95"
          :class="
            isCurrentMonthToday
              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
          "
          title="Navigate to Today (ថ្ងៃនេះ)"
        >
          <Calendar class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>ថ្ងៃនេះ</span>
          <span class="rounded-md bg-white/20 dark:bg-white/10 px-1.5 py-0.5 text-xs font-bold font-mono">
            {{ todayDetail.gregorian.day }}
          </span>
        </button>

        <!-- Search and Find Date Button -->
        <button
          type="button"
          @click="isSearchOpen = true"
          class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="ស្វែងរកកាលបរិច្ឆេទ (Search & Find Date)"
        >
          <Search class="h-4 w-4" />
        </button>

        <!-- Week Number Toggle (Desktop) -->
        <button
          type="button"
          @click="toggleWeekNumbers"
          class="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          :class="
            showWeekNumbers
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
          "
          title="បង្ហាញ/លាក់ លេខសប្តាហ៍ (Show/Hide Week Numbers)"
        >
          <Layers class="h-4 w-4" />
        </button>

        <!-- Theme Switcher Button -->
        <button
          type="button"
          @click="cycleTheme"
          class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          :title="`Theme: ${theme}`"
        >
          <component :is="themeIcon" class="h-4 w-4" />
        </button>

        <!-- Settings Button -->
        <button
          type="button"
          @click="isSettingsOpen = true"
          class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          title="ការកំណត់ (Settings)"
        >
          <Settings class="h-4 w-4" />
        </button>
      </div>

      <!-- Mobile Right: ONE MENU BUTTON ONLY (Fix Mobile Top Bar Overflow) -->
      <div class="flex items-center sm:hidden">
        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="ម៉ឺនុយទូរស័ព្ទ (Mobile Menu)"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-4.5 w-4.5" />
          <X v-else class="h-4.5 w-4.5" />
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Quick Menu Popover -->
    <div
      v-if="isMobileMenuOpen"
      class="sm:hidden border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-xl dark:border-slate-800 dark:bg-slate-900/95 animate-in slide-in-from-top-2 duration-150 backdrop-blur-md"
    >
      <div class="flex flex-col gap-2.5">
        <!-- Theme & Week Number Quick Row -->
        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            ផ្ទៃពណ៌កម្មវិធី (Theme)
          </span>
          <button
            type="button"
            @click="cycleTheme"
            class="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <component :is="themeIcon" class="h-3.5 w-3.5 text-amber-500" />
            <span class="capitalize">{{ theme }}</span>
          </button>
        </div>

        <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            លេខសប្តាហ៍ (Week Numbers)
          </span>
          <button
            type="button"
            @click="toggleWeekNumbers"
            class="flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-colors"
            :class="
              showWeekNumbers
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            "
          >
            <span>{{ showWeekNumbers ? 'បង្ហាញ' : 'លាក់' }}</span>
          </button>
        </div>

        <!-- PWA Install option for mobile -->
        <button
          type="button"
          @click="triggerInstall(); isMobileMenuOpen = false"
          class="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2 px-3 text-xs font-bold text-white shadow-xs"
        >
          <Download class="h-4 w-4" />
          <span>ដំឡើងជាកម្មវិធី App</span>
        </button>
      </div>
    </div>

    <!-- PWA Install Guidance Dialog (When browser doesn't auto-prompt) -->
    <Teleport to="body">
      <div
        v-if="isInstallHelpOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
        @click.self="isInstallHelpOpen = false"
      >
        <div
          class="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-center animate-in zoom-in-95 duration-150"
        >
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-3">
            <Download class="h-6 w-6" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            របៀបដំឡើងកម្មវិធី (Install as App)
          </h3>
          <p class="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
            • <strong>លើ Chrome / Edge:</strong> ចុចលើរូបតំណាង <strong>Install</strong> (រូបកុំព្យូទ័រ/ព្រួញចុះក្រោម) នៅខាងស្តាំនៃរបារអាសយដ្ឋាន (Address Bar)។<br><br>
            • <strong>លើ Safari (iPhone/iPad):</strong> ចុចប៊ូតុង <strong>Share</strong> រួចជ្រើសរើស <strong>"Add to Home Screen"</strong>។
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
