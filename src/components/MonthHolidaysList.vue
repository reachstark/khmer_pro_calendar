<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CalendarDays,
  Moon,
  Sparkles,
  ChevronRight,
  X,
  Filter,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import { toKhmerNumber, type KhmerDayDetail } from '@/utils/khmerCalendar'

const {
  currentMonthTheme,
  currentYear,
  monthHolidays,
  selectDate,
  isHolidaysDrawerOpen,
} = useCalendarState()

type FilterType = 'all' | 'holidays' | 'holyDays'
const activeFilter = ref<FilterType>('all')

const filteredList = computed(() => {
  const { holidays, holyDays } = monthHolidays.value

  if (activeFilter.value === 'holidays') {
    return holidays
  }
  if (activeFilter.value === 'holyDays') {
    return holyDays
  }

  // Merge and sort chronologically by day
  const combined = [...holidays]
  for (const h of holyDays) {
    if (!combined.some((item) => item.gregorian.day === h.gregorian.day)) {
      combined.push(h)
    }
  }
  return combined.sort((a, b) => a.gregorian.day - b.gregorian.day)
})

function handleSelect(item: KhmerDayDetail) {
  selectDate(item)
  isHolidaysDrawerOpen.value = false
}
</script>

<template>
  <div class="flex flex-col h-full rounded-3xl border border-slate-200/90 bg-white/90 p-4 shadow-xl shadow-slate-200/50 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none backdrop-blur-md transition-colors">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <CalendarDays class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">
            បុណ្យជាតិ & ថ្ងៃសីល
          </h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">
            ខែ{{ currentMonthTheme.khmerName }} {{ currentYear }}
          </p>
        </div>
      </div>

      <!-- Close button on mobile drawer -->
      <button
        v-if="isHolidaysDrawerOpen"
        type="button"
        @click="isHolidaysDrawerOpen = false"
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 lg:hidden"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-1 my-3 rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/60 text-xs font-semibold">
      <button
        type="button"
        @click="activeFilter = 'all'"
        class="flex-1 rounded-xl py-1.5 text-center transition-all"
        :class="
          activeFilter === 'all'
            ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        "
      >
        ទាំងអស់ ({{ monthHolidays.holidays.length + monthHolidays.holyDays.length }})
      </button>

      <button
        type="button"
        @click="activeFilter = 'holidays'"
        class="flex-1 rounded-xl py-1.5 text-center transition-all"
        :class="
          activeFilter === 'holidays'
            ? 'bg-white shadow-sm text-red-600 dark:bg-slate-700 dark:text-red-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        "
      >
        បុណ្យជាតិ ({{ monthHolidays.holidays.length }})
      </button>

      <button
        type="button"
        @click="activeFilter = 'holyDays'"
        class="flex-1 rounded-xl py-1.5 text-center transition-all"
        :class="
          activeFilter === 'holyDays'
            ? 'bg-white shadow-sm text-amber-600 dark:bg-slate-700 dark:text-amber-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        "
      >
        ថ្ងៃសីល ({{ monthHolidays.holyDays.length }})
      </button>
    </div>

    <!-- Events List Container -->
    <div class="flex-1 overflow-y-auto space-y-2 px-1 py-1 max-h-[380px] lg:max-h-[500px]">
      <div v-if="filteredList.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
        <Sparkles class="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
        <p class="text-xs text-slate-500 dark:text-slate-400">
          មិនមានព្រឺត្តការណ៍ក្នុងខែនេះទេ
        </p>
      </div>

      <button
        v-for="item in filteredList"
        :key="item.gregorian.isoDateString"
        type="button"
        @click="handleSelect(item)"
        class="group flex w-full items-center justify-between rounded-2xl sm:rounded-3xl border p-3 sm:p-3.5 text-left transition-all duration-150 hover:shadow-md cursor-pointer"
        :class="[
          item.holiday && item.holiday.isOffDay
            ? 'border-red-100/90 bg-[#fef7f7] hover:bg-red-50 hover:border-red-200 dark:border-slate-800 dark:bg-[#121826] dark:hover:bg-[#182032] dark:hover:border-slate-700'
            : item.holiday
              ? 'border-blue-100/90 bg-[#f6f9fe] hover:bg-blue-50 hover:border-blue-200 dark:border-slate-800 dark:bg-[#121826] dark:hover:bg-[#182032] dark:hover:border-slate-700'
              : 'border-amber-100/80 bg-[#fffdf7] hover:bg-amber-50/70 hover:border-amber-200 dark:border-slate-800 dark:bg-[#121826] dark:hover:bg-[#182032] dark:hover:border-slate-700',
        ]"
      >
        <div class="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 mr-2">
          <!-- Date Badge Column (Squircle with Latin Numeral + Khmer Weekday) -->
          <div
            class="flex flex-col items-center justify-center rounded-2xl w-12 h-12 sm:w-13 sm:h-13 shrink-0 text-center shadow-xs transition-transform group-hover:scale-105"
            :class="
              item.holiday && item.holiday.isOffDay
                ? 'bg-red-500 text-white'
                : item.isHolyDay
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-500 text-white'
            "
          >
            <span class="text-base sm:text-lg font-bold leading-none font-sans tracking-tight">
              {{ item.gregorian.day }}
            </span>
            <span class="text-[10px] sm:text-[11px] font-semibold leading-none mt-1 opacity-95">
              {{ item.khmer.dayOfWeekName }}
            </span>
          </div>

          <!-- Description Column -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {{ item.holiday ? item.holiday.titleKh : item.holyDayLabel }}
              </h4>

              <!-- Tag for official off-day -->
              <span
                v-if="item.holiday && item.holiday.isOffDay"
                class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400"
              >
                ឈប់សម្រាក
              </span>
            </div>

            <!-- Lunar Date Subtext -->
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
              {{ item.formattedShortKhmer }} • {{ item.khmer.animalYearName }}
            </p>
          </div>
        </div>

        <ChevronRight class="h-4.5 w-4.5 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all shrink-0" />
      </button>
    </div>
  </div>
</template>
