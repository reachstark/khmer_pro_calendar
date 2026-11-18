<script setup lang="ts">
import { computed } from 'vue'
import {
  Calendar,
  Search,
  CalendarDays,
  Settings,
  Sparkles,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import { toKhmerNumber } from '@/utils/khmerCalendar'

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
    class="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-slate-200/80 bg-white/85 px-3 py-2 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-900/85 transition-colors"
  >
    <div class="mx-auto flex max-w-md items-center justify-around">
      <!-- 1. Month / Calendar View -->
      <button
        type="button"
        @click="isHolidaysDrawerOpen = false; isSearchOpen = false; isSettingsOpen = false"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 text-amber-600 dark:text-amber-400 font-bold active:scale-95 transition-transform"
      >
        <Calendar class="h-5 w-5" />
        <span class="text-[10px] leading-none">ប្រតិទិន</span>
      </button>

      <!-- 2. Today Button with date number badge -->
      <button
        type="button"
        @click="goToToday"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <div class="relative">
          <Sparkles class="h-5 w-5 text-amber-500" />
          <span
            class="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-extrabold text-white"
          >
            {{ todayDetail.gregorian.day }}
          </span>
        </div>
        <span class="text-[10px] leading-none font-semibold">ថ្ងៃនេះ</span>
      </button>

      <!-- 3. Holidays Sheet Trigger with count badge -->
      <button
        type="button"
        @click="isHolidaysDrawerOpen = true"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <div class="relative">
          <CalendarDays class="h-5 w-5 text-red-500" />
          <span
            v-if="holidayCount > 0"
            class="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-extrabold text-white"
          >
            {{ holidayCount }}
          </span>
        </div>
        <span class="text-[10px] leading-none font-semibold">បុណ្យជាតិ</span>
      </button>

      <!-- 4. Search and Find Date -->
      <button
        type="button"
        @click="isSearchOpen = true"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <Search class="h-5 w-5" />
        <span class="text-[10px] leading-none font-semibold">ស្វែងរក</span>
      </button>

      <!-- 5. Settings -->
      <button
        type="button"
        @click="isSettingsOpen = true"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 active:scale-95 transition-transform"
      >
        <Settings class="h-5 w-5" />
        <span class="text-[10px] leading-none font-semibold">កំណត់</span>
      </button>
    </div>
  </nav>
</template>
