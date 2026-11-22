<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { Sparkles, Copy, Check, Eye } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import CalendarHeader from '@/components/CalendarHeader.vue'
import MonthBannerCard from '@/components/MonthBannerCard.vue'
import NewYearCountdown from '@/components/NewYearCountdown.vue'
import CalendarGrid from '@/components/CalendarGrid.vue'
import MonthHolidaysList from '@/components/MonthHolidaysList.vue'
import DateDetailsModal from '@/components/DateDetailsModal.vue'
import SearchDateModal from '@/components/SearchDateModal.vue'
import CalendarSettingsModal from '@/components/CalendarSettingsModal.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import SeasonAnimation from '@/components/SeasonAnimation.vue'
import ZodiacYearCard from '@/components/ZodiacYearCard.vue'
import { inject } from '@vercel/analytics'

import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { useVisitorCount } from '@/composables/useVisitorCount'
import { usePwaInstall } from '@/composables/usePwaInstall'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'

const {
  todayDetail,
  prevMonth,
  nextMonth,
  goToToday,
  isSearchOpen,
  isSettingsOpen,
  isHolidaysDrawerOpen,
  selectedDate,
  selectDate,
  selectPrevDay,
  selectNextDay,
} = useCalendarState()

useCalendarSettings() // Initializes theme, font scale, start of week
const { visitorCount } = useVisitorCount()
const { isInstallHelpOpen } = usePwaInstall()

const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)

// Prevent mouse background scrolling when any modal dialog or mobile drawer is open
const isAnyModalOpen = computed(() => {
  const isDrawerActive = isHolidaysDrawerOpen.value && !isDesktop.value
  return Boolean(
    isSearchOpen.value ||
    isSettingsOpen.value ||
    isDrawerActive ||
    selectedDate.value ||
    isInstallHelpOpen.value,
  )
})

// Touch Swipe Navigation (Swipe Left -> Next Month, Swipe Right -> Previous Month)
const {
  swipeOffsetX,
  isSwiping,
  onTouchStart: handleCalendarTouchStart,
  onTouchMove: handleCalendarTouchMove,
  onTouchEnd: handleCalendarTouchEnd,
  onTouchCancel: handleCalendarTouchCancel,
} = useSwipeNavigation({
  onSwipeLeft: nextMonth,
  onSwipeRight: prevMonth,
  disabled: isAnyModalOpen,
})

watch(
  isAnyModalOpen,
  (open) => {
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.removeProperty('overflow')
        document.documentElement.style.removeProperty('overflow')
      }
    }
  },
  { immediate: true },
)

const isTodayCopied = ref(false)

function copyTodayDate() {
  navigator.clipboard.writeText(todayDetail.value.copyFormat).then(() => {
    isTodayCopied.value = true
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#3B82F6'],
    })
    setTimeout(() => {
      isTodayCopied.value = false
    }, 2500)
  })
}

// Global Keyboard Navigation
function handleKeyDown(e: KeyboardEvent) {
  // Ignore if user is currently typing in an input or select
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName || '')) {
    return
  }

  // If DateDetailsModal is open, do NOT navigate months with arrow keys!
  // Instead, Left/Right arrow keys navigate days within the modal.
  if (selectedDate.value) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      selectPrevDay()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      selectNextDay()
    } else if (e.key === 'Escape') {
      selectedDate.value = null
    }
    return
  }

  // If any other modal/drawer is open, ignore navigation keys
  if (isAnyModalOpen.value) {
    if (e.key === 'Escape') {
      isSearchOpen.value = false
      isSettingsOpen.value = false
      isHolidaysDrawerOpen.value = false
      isInstallHelpOpen.value = false
    }
    return
  }

  if (e.key === 'ArrowLeft') {
    prevMonth()
  } else if (e.key === 'ArrowRight') {
    nextMonth()
  } else if (e.key === 't' || e.key === 'T') {
    goToToday()
  } else if (e.key === 's' || e.key === '/') {
    e.preventDefault()
    isSearchOpen.value = true
  } else if (e.key === 'Escape') {
    selectedDate.value = null
    isSearchOpen.value = false
    isSettingsOpen.value = false
    isHolidaysDrawerOpen.value = false
    isInstallHelpOpen.value = false
  }
}

function handleResize() {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value && isHolidaysDrawerOpen.value) {
    isHolidaysDrawerOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)
  // Initialize Vercel Web Analytics
  inject({ framework: 'vue' })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
  if (typeof document !== 'undefined') {
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow')
  }
})
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300"
  >
    <!-- Seasonal & Exclusive December Snow Atmosphere -->
    <SeasonAnimation />

    <!-- Top Sticky Header Bar -->
    <CalendarHeader />

    <!-- Main Responsive Body Layout (Safe-Area Aware for Notch/Cutout Displays) -->
    <main
      class="flex-1 w-full max-w-7xl mx-auto py-3 sm:py-6 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:px-6 pb-6 lg:pb-8"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <!-- Main Column (Left/Center on Desktop) with Touch Swipe Navigation -->
        <div
          class="lg:col-span-8 flex flex-col gap-4 sm:gap-5 touch-pan-y"
          :class="{ 'transition-transform duration-200 ease-out': !isSwiping }"
          :style="swipeOffsetX !== 0 ? { transform: `translateX(${swipeOffsetX}px)` } : undefined"
          @touchstart.passive="handleCalendarTouchStart"
          @touchmove.passive="handleCalendarTouchMove"
          @touchend.passive="handleCalendarTouchEnd"
          @touchcancel.passive="handleCalendarTouchCancel"
        >
          <!-- Month Banner Card (Cambodia Month Artwork & Color Theme) -->
          <MonthBannerCard />

          <!-- New Year Countdown Timer (Visible 1 week before New Year's Eve) -->
          <NewYearCountdown />

          <!-- Calendar Matrix Grid (Animated Month Transitions) -->
          <CalendarGrid />
        </div>

        <!-- Sidebar Column (Right on Desktop) -->
        <div class="lg:col-span-4 flex flex-col gap-4 sm:gap-5">
          <!-- Today's Live Khmer Lunar Date Card (Desktop Quick Widget) -->
          <div
            class="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 p-4 sm:p-5 shadow-lg shadow-sky-500/5 dark:from-sky-500/15 dark:to-blue-500/10 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <span
                class="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider"
              >
                <Sparkles class="h-3.5 w-3.5" />
                កាលបរិច្ឆេទថ្ងៃនេះ
              </span>

              <!-- Quick copy button -->
              <button
                type="button"
                @click="copyTodayDate"
                class="flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold text-sky-800 dark:text-sky-300 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 transition-all active:scale-95"
                title="ចម្លងថ្ងៃនេះ (Copy Today)"
              >
                <component :is="isTodayCopied ? Check : Copy" class="h-3 w-3" />
                <span>{{ isTodayCopied ? 'ចម្លងរួច' : 'ចម្លង' }}</span>
              </button>
            </div>

            <div class="space-y-0.5 select-all">
              <p
                class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed"
              >
                {{ todayDetail.lunarFullText }}
              </p>
              <p
                class="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {{ todayDetail.solarFullText }}
              </p>
            </div>

            <!-- Quick Day Badge Row -->
            <div
              class="mt-3 flex items-center justify-between pt-2.5 border-t border-sky-500/20 text-[11px] text-sky-900 dark:text-sky-200"
            >
              <span class="font-semibold">
                {{ todayDetail.khmer.animalYearName }} {{ todayDetail.khmer.animalYearEmoji }} •
                {{ todayDetail.khmer.sakName }}
              </span>
              <button
                type="button"
                @click="selectDate(todayDetail)"
                class="text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                មើលលម្អិត &rarr;
              </button>
            </div>
          </div>

          <!-- Zodiac Animal of the Year Highlight Card (Main Screen) -->
          <ZodiacYearCard />

          <!-- Cambodian Holidays & Events List for Current Month (Desktop view) -->
          <div id="desktop-holidays-sidebar" class="hidden lg:flex flex-1 flex-col min-h-0">
            <MonthHolidaysList />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Attribution & Live Visitor Counter (Safe-Area Aware) -->
    <footer
      class="w-full border-t border-slate-200/80 bg-white/40 pt-3.5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:py-3 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] text-center text-xs text-slate-500 dark:border-slate-800/80 dark:bg-slate-900/40 dark:text-slate-400 backdrop-blur-sm"
    >
      <div
        class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 sm:gap-4 font-medium"
      >
        <div class="flex items-center gap-1.5">
          <span>Made by</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">Le Boritheareach</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span>ប្រតិទិនចន្ទគតិខ្មែរ</span>
        </div>

        <span class="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

        <!-- Live Visitor Counter Badge -->
        <div
          v-if="visitorCount !== null"
          class="flex items-center gap-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
          title="ចំនួនអ្អ្នកប្រើប្រាស់សរុប"
        >
          <Eye class="h-3.5 w-3.5 text-amber-500" />
          <span>អ្នកប្រើប្រាស់:</span>
          <span class="font-bold font-mono text-slate-800 dark:text-slate-100">{{
            visitorCount.toLocaleString()
          }}</span>
        </div>
      </div>
    </footer>

    <!-- Mobile Drawer for Holidays & Events (when opened on mobile) -->
    <div
      v-if="isHolidaysDrawerOpen"
      class="fixed inset-0 z-50 flex items-end lg:hidden"
      @click.self="isHolidaysDrawerOpen = false"
    >
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="isHolidaysDrawerOpen = false"
      ></div>
      <div
        class="relative z-10 w-full max-h-[85dvh] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom duration-200"
      >
        <MonthHolidaysList />
      </div>
    </div>

    <!-- Modals -->
    <!-- 1. Date Details Modal with Khmer Calendar & Copy Button -->
    <DateDetailsModal />

    <!-- 2. Search and Find Date Modal -->
    <SearchDateModal />

    <!-- 3. Calendar Settings Modal (Theme, Start of Week, Week Number, Font Size) -->
    <CalendarSettingsModal />

    <!-- Mobile Bottom Floating Navigation Dock -->
    <MobileBottomNav />
  </div>
</template>
