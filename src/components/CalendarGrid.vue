<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sparkles } from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { KHMER_WEEKDAYS, toKhmerNumber, type KhmerDayDetail } from '@/utils/khmerCalendar'

const {
  currentYear,
  currentMonth,
  calendarWeeks,
  navDirection,
  selectedDate,
  selectDate,
  currentMonthTheme,
} = useCalendarState()

const { startOfWeek, showWeekNumbers } = useCalendarSettings()

// Reorder weekdays according to startOfWeek
const orderedWeekdays = computed(() => {
  const list = [...KHMER_WEEKDAYS]
  const startIndex = list.findIndex((w) => w.id === startOfWeek.value)
  if (startIndex === -1) return list
  return [...list.slice(startIndex), ...list.slice(0, startIndex)]
})

// Unique key for the month transition
const monthKey = computed(() => `${currentYear.value}-${currentMonth.value}`)

function isCellSelected(day: KhmerDayDetail): boolean {
  if (!selectedDate.value) return false
  return selectedDate.value.gregorian.isoDateString === day.gregorian.isoDateString
}
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <Transition :name="navDirection === 'left' ? 'slide-left' : 'slide-right'" mode="out-in">
      <div :key="monthKey" class="w-full">
        <!-- Calendar Matrix Container -->
        <div
          class="rounded-3xl border border-slate-200/90 bg-white/90 p-2 sm:p-4 shadow-xl shadow-slate-200/50 dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none backdrop-blur-md transition-colors"
        >
          <!-- Weekday Headers -->
          <div
            class="grid gap-1 mb-2 text-center"
            :style="{
              gridTemplateColumns: showWeekNumbers
                ? 'minmax(28px, 36px) repeat(7, minmax(0, 1fr))'
                : 'repeat(7, minmax(0, 1fr))',
            }"
          >
            <!-- Optional Week Number Header Column -->
            <div
              v-if="showWeekNumbers"
              class="flex items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-2"
              title="Week Number"
            >
              W
            </div>

            <!-- Day Names -->
            <div
              v-for="weekday in orderedWeekdays"
              :key="weekday.id"
              class="flex flex-col items-center justify-center py-1.5 sm:py-2.5 rounded-xl transition-colors"
              :class="
                weekday.id === 0
                  ? 'bg-red-500/5 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                  : weekday.id === 6
                    ? 'bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 font-semibold'
              "
            >
              <span class="text-xs sm:text-sm font-bold tracking-tight">
                {{ weekday.shortKh }}
              </span>
              <span class="text-[10px] sm:text-[11px] font-normal opacity-70 hidden sm:inline">
                {{ weekday.shortEn }}
              </span>
            </div>
          </div>

          <!-- Weeks Grid -->
          <div class="space-y-1 sm:space-y-1.5">
            <div
              v-for="week in calendarWeeks"
              :key="week.weekNumber"
              class="grid gap-1 sm:gap-1.5"
              :style="{
                gridTemplateColumns: showWeekNumbers
                  ? 'minmax(28px, 36px) repeat(7, minmax(0, 1fr))'
                  : 'repeat(7, minmax(0, 1fr))',
              }"
            >
              <!-- Week Number Cell -->
              <div
                v-if="showWeekNumbers"
                class="flex items-center justify-center rounded-2xl bg-slate-100/40 dark:bg-slate-800/30 text-[10px] sm:text-xs font-bold font-mono text-slate-400 dark:text-slate-500 select-none"
              >
                {{ week.weekNumber }}
              </div>

              <!-- Day Cells -->
              <button
                v-for="day in week.days"
                :key="day.gregorian.isoDateString"
                type="button"
                @click="selectDate(day)"
                class="group relative flex flex-col justify-between rounded-2xl p-1 sm:p-2.5 min-h-[64px] sm:min-h-[88px] text-left border transition-all duration-200 outline-none active:scale-[0.98]"
                :class="[
                  // Out of current month
                  !day.isCurrentMonth
                    ? 'border-transparent bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 opacity-40 hover:opacity-75'
                    : // Is Selected Date
                    isCellSelected(day)
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500 dark:bg-amber-500/15'
                    : // Is Today
                    day.isToday
                    ? 'border-amber-400 bg-amber-50/80 shadow-md shadow-amber-500/10 dark:border-amber-500/60 dark:bg-amber-500/10 ring-1 ring-amber-400/50'
                    : // Has Holiday
                    day.holiday && day.holiday.isOffDay
                    ? 'border-red-200 bg-red-50/50 hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/40'
                    : // Holy day
                    day.isHolyDay
                    ? 'border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/80 dark:border-amber-900/30 dark:bg-amber-950/20 dark:hover:bg-amber-950/40'
                    : // Normal cell
                      'border-slate-100 bg-slate-50/40 hover:bg-slate-100/80 dark:border-slate-800/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/80',
                ]"
              >
                <!-- Top Row: Gregorian Day Number + Indicators -->
                <div class="flex items-start justify-between w-full">
                  <div class="flex items-baseline gap-1">
                    <!-- Gregorian Day (Google Sans typography) -->
                    <span
                      class="text-sm sm:text-lg font-bold leading-none tracking-tight font-sans"
                      :class="[
                        day.holiday && day.holiday.isOffDay
                          ? 'text-red-600 dark:text-red-400 font-extrabold'
                          : day.gregorian.dayOfWeek === 0
                            ? 'text-red-500 dark:text-red-400'
                            : day.isToday
                              ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                              : 'text-slate-800 dark:text-slate-100',
                      ]"
                    >
                      {{ day.gregorian.day }}
                    </span>
                  </div>

                  <!-- Badges and Indicators -->
                  <div class="flex items-center gap-1">
                    <!-- Today Badge -->
                    <span
                      v-if="day.isToday"
                      class="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"
                      title="ថ្ងៃនេះ (Today)"
                    ></span>

                    <!-- Buddhist Holy Day (ថ្ងៃសីល) Indicator -->
                    <span
                      v-if="day.isHolyDay"
                      class="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500/15 p-0.5 border border-amber-500/30 shadow-xs"
                      :title="day.holyDayLabel"
                    >
                      <img
                        src="/icons/holy_day.png"
                        alt="ថ្ងៃសីល"
                        class="h-full w-full object-contain"
                      />
                    </span>

                    <!-- Holiday Red Dot Indicator -->
                    <span
                      v-if="day.holiday"
                      class="flex h-2 w-2 rounded-full"
                      :class="day.holiday.isOffDay ? 'bg-red-500' : 'bg-blue-500'"
                      :title="day.holiday.titleKh"
                    ></span>
                  </div>
                </div>

                <!-- Middle / Bottom Row: Khmer Lunar Date Representation -->
                <div class="w-full mt-1">
                  <!-- Lunar Day text (e.g. ៩កើត, ៨រោច, ពេញបូណ៌មី) -->
                  <div
                    class="text-[10px] sm:text-xs font-semibold leading-tight truncate"
                    :class="[
                      day.isHolyDay
                        ? 'text-amber-700 dark:text-amber-300 font-bold'
                        : day.khmer.moonPhase === 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-indigo-700 dark:text-indigo-300',
                    ]"
                  >
                    <!-- Full moon highlight -->
                    <span v-if="day.khmer.day === 15 && day.khmer.moonPhase === 0">
                      ១៥កើត (ពេញ)
                    </span>
                    <!-- New moon / End of month highlight -->
                    <span v-else-if="day.holyDayType === 'new_moon'">
                      {{ toKhmerNumber(day.khmer.day) }}រោច (ដាច់)
                    </span>
                    <span v-else>
                      {{ toKhmerNumber(day.khmer.day) }}{{ day.khmer.moonPhaseName }}
                    </span>
                  </div>

                  <!-- Holiday / Holy Day pill on desktop (shown if space permits) -->
                  <div v-if="day.holiday" class="hidden sm:block mt-1">
                    <span
                      class="inline-block max-w-full truncate rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                      :class="
                        day.holiday.isOffDay
                          ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20'
                          : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                      "
                    >
                      {{ day.holiday.titleKh }}
                    </span>
                  </div>
                  <div v-else-if="day.isHolyDay" class="hidden sm:block mt-1">
                    <span
                      class="inline-flex items-center gap-1 max-w-full truncate rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20"
                    >
                      <img
                        src="/icons/holy_day.png"
                        alt=""
                        class="h-2.5 w-2.5 shrink-0 object-contain"
                      />
                      <span class="truncate">{{ day.holyDayLabel }}</span>
                    </span>
                  </div>
                  <!-- Lunar month name in small font if start of lunar month -->
                  <div
                    v-else-if="day.khmer.day === 1 && day.khmer.moonPhase === 0"
                    class="hidden sm:block mt-1"
                  >
                    <span
                      class="inline-block max-w-full truncate rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300"
                    >
                      ខែ{{ day.khmer.monthName }}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
