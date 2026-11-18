<script setup lang="ts">
import { computed } from 'vue'
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

function isJan01(day: KhmerDayDetail): boolean {
  return day.gregorian.month === 1 && day.gregorian.day === 1
}

function isValentinesDay(day: KhmerDayDetail): boolean {
  return day.gregorian.month === 2 && day.gregorian.day === 14
}

function isHalloweenDay(day: KhmerDayDetail): boolean {
  return day.gregorian.month === 10 && day.gregorian.day === 31
}
</script>

<template>
  <div class="relative w-full pb-5 -mb-5" style="overflow-x: clip; overflow-y: visible;">
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
                    ? day.isToday
                      ? 'border-sky-500 bg-sky-100/70 shadow-lg shadow-sky-500/20 ring-2 ring-sky-500 dark:border-sky-400 dark:bg-sky-950/50 dark:ring-sky-400'
                      : 'border-slate-800 bg-slate-100/80 shadow-lg shadow-slate-900/10 ring-2 ring-slate-800 dark:border-slate-200 dark:bg-slate-800/80 dark:ring-slate-200'
                    : // Is Today
                    day.isToday
                    ? 'border-sky-500 bg-sky-50/80 hover:bg-sky-50 shadow-md shadow-sky-500/15 ring-2 ring-sky-400/50 dark:border-sky-400/70 dark:bg-sky-950/35 dark:hover:bg-sky-950/45 dark:ring-sky-500/40'
                    : // Jan-01: Looping Fireworks Day Cell
                    isJan01(day)
                    ? 'border-amber-400/70 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/15 hover:bg-amber-100/50 dark:border-amber-400/50 dark:from-amber-950/30 dark:to-rose-950/20 shadow-xs ring-1 ring-amber-400/30'
                    : // Feb-14: Valentine's Cute Hearts Day Cell
                    isValentinesDay(day)
                    ? 'border-pink-300/80 bg-gradient-to-br from-pink-500/15 via-rose-400/10 to-pink-500/15 hover:bg-pink-100/50 dark:border-pink-400/50 dark:from-pink-950/30 dark:to-rose-950/20 shadow-xs ring-1 ring-pink-400/30'
                    : // Oct-31: Halloween Spooky Day Cell
                    isHalloweenDay(day)
                    ? 'border-orange-400/70 bg-gradient-to-br from-orange-500/15 via-purple-950/15 to-orange-500/15 hover:bg-orange-100/50 dark:border-purple-400/50 dark:from-orange-950/30 dark:to-purple-950/30 shadow-xs ring-1 ring-orange-400/30'
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
                          : isJan01(day)
                            ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                            : isValentinesDay(day)
                              ? 'text-pink-600 dark:text-pink-400 font-extrabold'
                              : isHalloweenDay(day)
                                ? 'text-orange-600 dark:text-orange-400 font-extrabold'
                                : day.gregorian.dayOfWeek === 0
                                  ? 'text-red-500 dark:text-red-400'
                                  : day.isToday
                                    ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                                    : 'text-slate-800 dark:text-slate-100',
                      ]"
                    >
                      {{ day.gregorian.day }}
                    </span>
                  </div>

                  <!-- Badges and Indicators -->
                  <div class="flex items-center gap-1">
                    <!-- Jan-01: Looping Fireworks Animation -->
                    <div
                      v-if="isJan01(day)"
                      class="relative flex items-center justify-center"
                      title="ចូលឆ្នាំសកល (Happy New Year)"
                    >
                      <span class="anim-firework-burst text-xs sm:text-sm inline-block select-none">🎆</span>
                      <span class="anim-firework-twinkle absolute -top-1.5 -right-1 text-[8px] sm:text-[9px] pointer-events-none select-none">✨</span>
                    </div>

                    <!-- Feb-14: Valentine's Cute Hearts Looping Animation -->
                    <div
                      v-else-if="isValentinesDay(day)"
                      class="relative flex items-center justify-center"
                      title="ទិវានៃក្ដីស្រឡាញ់ (Valentine’s Day)"
                    >
                      <span class="anim-heart-pulse text-xs sm:text-sm inline-block select-none">💖</span>
                      <span class="anim-heart-float-1 absolute -top-2 -right-1 text-[8px] pointer-events-none select-none">💕</span>
                      <span class="anim-heart-float-2 absolute -top-1 -left-1 text-[7px] pointer-events-none select-none">❤️</span>
                    </div>

                    <!-- Oct-31: Halloween Spooky Bats & Pumpkin Looping Animation -->
                    <div
                      v-else-if="isHalloweenDay(day)"
                      class="relative flex items-center justify-center"
                      title="ពិធីបុណ្យហាឡូវីន (Halloween)"
                    >
                      <span class="anim-bat-hover text-[11px] sm:text-xs inline-block select-none">🦇</span>
                      <span class="anim-pumpkin-glow text-xs sm:text-sm inline-block ml-0.5 select-none">🎃</span>
                    </div>

                    <!-- Today Badge -->
                    <span
                      v-if="day.isToday"
                      class="flex h-2 w-2 rounded-full bg-sky-500 ring-2 ring-sky-200 dark:ring-sky-900/60 animate-pulse"
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
                        : day.isToday
                          ? 'text-sky-700 dark:text-sky-300 font-bold'
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
                  <div v-else-if="day.isToday" class="hidden sm:block mt-1">
                    <span
                      class="inline-flex items-center gap-1 max-w-full truncate rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20"
                    >
                      <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                      <span>ថ្ងៃនេះ</span>
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
