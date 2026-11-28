<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { Eye } from 'lucide-vue-next'
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
import TodayCalendarCard from '@/components/TodayCalendarCard.vue'
import DesktopMiniToolsCard from '@/components/DesktopMiniToolsCard.vue'
import ShareCalendarBanner from '@/components/ShareCalendarBanner.vue'
import { inject } from '@vercel/analytics'

import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { useVisitorCount } from '@/composables/useVisitorCount'
import { usePwaInstall } from '@/composables/usePwaInstall'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'

const {
  prevMonth,
  nextMonth,
  goToToday,
  isSearchOpen,
  isSettingsOpen,
  isHolidaysDrawerOpen,
  selectedDate,
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
          <!-- Playful Tear-Off Today Khmer Lunar Date Card -->
          <TodayCalendarCard />

          <!-- Zodiac Animal of the Year Highlight Card (Main Screen) -->
          <ZodiacYearCard />

          <!-- Cambodian Holidays & Events List for Current Month (Desktop view) -->
          <div id="desktop-holidays-sidebar" class="hidden lg:flex flex-1 flex-col min-h-0">
            <MonthHolidaysList />
          </div>
        </div>
      </div>

      <!-- Share Website with Friends Banner (Bottom of Calendar UI) -->
      <ShareCalendarBanner class="mt-5 sm:mt-6 lg:mt-7" />
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

    <!-- Desktop-Exclusive Sticky Bottom-Left Expandable Mini Tools Card -->
    <DesktopMiniToolsCard />

    <!-- Mobile Bottom Floating Navigation Dock -->
    <MobileBottomNav />
  </div>
</template>
