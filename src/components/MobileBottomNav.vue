<script setup lang="ts">
import { computed } from 'vue'
import {
  Search,
  CalendarDays,
  Settings,
  Sparkles,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'

const {
  todayDetail,
  goToToday,
  isSearchOpen,
  isSettingsOpen,
  isHolidaysDrawerOpen,
  monthHolidays,
} = useCalendarState()

const holidayCount = computed(() => monthHolidays.value.holidays.length)
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-slate-200/80 bg-white/90 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors shadow-lg"
  >
    <div class="mx-auto flex max-w-md items-center justify-between">
      <!-- 1. Today (ថ្ងៃនេះ) -->
      <button
        type="button"
        @click="goToToday"
        class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1 px-1 text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 active:scale-95 transition-transform"
      >
        <div class="relative">
          <Sparkles class="h-5 w-5 text-sky-500" />
          <span
            class="absolute -top-1 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[8px] font-extrabold text-white shadow-xs font-mono"
          >
            {{ todayDetail.gregorian.day }}
          </span>
        </div>
        <span class="text-[10px] leading-tight font-semibold">ថ្ងៃនេះ</span>
      </button>

      <!-- 2. National Holidays & Events (បុណ្យជាតិ & ព្រឹត្តិការណ៍) -->
      <button
        type="button"
        @click="isHolidaysDrawerOpen = true"
        class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1 px-1 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <div class="relative">
          <CalendarDays class="h-5 w-5 text-red-500" />
          <span
            v-if="holidayCount > 0"
            class="absolute -top-1 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-extrabold text-white shadow-xs font-mono"
          >
            {{ holidayCount }}
          </span>
        </div>
        <span class="text-[10px] leading-tight font-semibold truncate max-w-[85px] sm:max-w-none text-center">
          បុណ្យជាតិ & ព្រឹត្តិការណ៍
        </span>
      </button>

      <!-- 3. Search (ស្វែងរក) -->
      <button
        type="button"
        @click="isSearchOpen = true"
        class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1 px-1 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <Search class="h-5 w-5 text-slate-600 dark:text-slate-300" />
        <span class="text-[10px] leading-tight font-semibold">ស្វែងរក</span>
      </button>

      <!-- 4. Settings (ការកំណត់) -->
      <button
        type="button"
        @click="isSettingsOpen = true"
        class="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1 px-1 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <Settings class="h-5 w-5 text-slate-600 dark:text-slate-300" />
        <span class="text-[10px] leading-tight font-semibold">ការកំណត់</span>
      </button>
    </div>
  </nav>
</template>
