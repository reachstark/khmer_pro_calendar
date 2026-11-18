<script setup lang="ts">
import { computed } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import { toKhmerNumber } from '@/utils/khmerCalendar'

const {
  currentMonthTheme,
  currentYear,
  prevMonth,
  nextMonth,
  monthHolidays,
  isHolidaysDrawerOpen,
} = useCalendarState()

const holidayCount = computed(() => monthHolidays.value.holidays.length)
const holyDayCount = computed(() => monthHolidays.value.holyDays.length)

function handleOpenHolidays() {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    isHolidaysDrawerOpen.value = true
  } else {
    const sidebar = document.getElementById('desktop-holidays-sidebar')
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-500"
    :class="[
      currentMonthTheme.accentBorder,
      currentMonthTheme.glowShadow,
      'bg-gradient-to-r ' + currentMonthTheme.gradientHeader,
    ]"
  >
    <!-- Background Image Artwork representing the Cambodia month -->
    <div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <img
        :src="currentMonthTheme.imageUrl"
        :alt="currentMonthTheme.themeTitleKh"
        class="w-full h-full object-cover object-center transition-all duration-700 ease-out"
        loading="eager"
      />
      <!-- Ambient Theme Gradient Tint Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-r transition-colors duration-500 opacity-60 mix-blend-multiply"
        :class="currentMonthTheme.gradientHeader"
      ></div>
      <!-- Vignette and Contrast Scrim for Text Legibility -->
      <div class="absolute inset-0 bg-slate-950/35"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
    </div>

    <!-- Soft radial glow overlay -->
    <div
      class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/20 blur-3xl pointer-events-none"
    ></div>

    <div class="relative z-10 flex flex-col justify-between p-4 sm:p-6 text-white min-h-[140px] sm:min-h-[175px]">
      <!-- Top Row: Month Navigation & Title -->
      <div class="flex items-center justify-between">
        <!-- Navigation Prev Button -->
        <button
          type="button"
          @click="prevMonth"
          class="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/30 active:scale-90 transition-all border border-white/20 shadow-md"
          title="ខែមុន (Previous Month) [Arrow Left]"
        >
          <ChevronLeft class="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <!-- Center Month Identification -->
        <div class="text-center px-2">
          <div class="flex items-center justify-center gap-2">
            <span class="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold tracking-wide border border-white/30">
              ខែចន្ទគតិ: {{ currentMonthTheme.lunarSpanKh }}
            </span>
          </div>

          <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md mt-1">
            {{ currentMonthTheme.khmerName }}
            <span class="text-lg sm:text-2xl font-light opacity-90 ml-1">
              {{ currentMonthTheme.englishName }}
            </span>
            <span class="text-lg sm:text-2xl font-bold opacity-95 ml-2 font-mono">
              {{ currentYear }}
            </span>
          </h2>
        </div>

        <!-- Navigation Next Button -->
        <button
          type="button"
          @click="nextMonth"
          class="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md hover:bg-white/30 active:scale-90 transition-all border border-white/20 shadow-md"
          title="ខែបន្ទាប់ (Next Month) [Arrow Right]"
        >
          <ChevronRight class="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <!-- Bottom Row: Month Cultural Theme & Holiday Pill -->
      <div class="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-t border-white/15 pt-3">
        <!-- Cultural Theme Note for this Month -->
        <div class="max-w-xl">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
            <Sparkles class="h-3.5 w-3.5" />
            <span>{{ currentMonthTheme.themeTitleKh }}</span>
          </div>
          <p class="text-[11px] sm:text-xs text-white/85 line-clamp-2 mt-0.5 font-normal">
            {{ currentMonthTheme.culturalNoteKh }}
          </p>
        </div>

        <!-- Month Holidays & Buddhist days badge -->
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <!-- Holiday badge -->
          <button
            type="button"
            @click="handleOpenHolidays"
            class="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-semibold hover:bg-white/30 border border-white/25 transition-colors shadow-sm"
          >
            <CalendarDays class="h-3.5 w-3.5 text-red-200" />
            <span>បុណ្យជាតិ: {{ toKhmerNumber(holidayCount) }}</span>
          </button>

          <!-- Buddhist Holy Days badge -->
          <button
            type="button"
            @click="handleOpenHolidays"
            class="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-semibold hover:bg-white/30 border border-white/25 transition-colors shadow-sm"
          >
            <img src="/icons/holy_day.png" alt="" class="h-3.5 w-3.5 object-contain" />
            <span>ថ្ងៃសីល: {{ toKhmerNumber(holyDayCount) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
