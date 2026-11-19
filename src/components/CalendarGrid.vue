<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import {
  KHMER_WEEKDAYS,
  CHINESE_NEW_YEAR_MAP,
  toKhmerNumber,
  type KhmerDayDetail,
} from '@/utils/khmerCalendar'
import { getNewYear } from '@thyrith/momentkh'

const {
  currentYear,
  currentMonth,
  calendarWeeks,
  navDirection,
  selectedDate,
  selectDate,
} = useCalendarState()

const { startOfWeek, showWeekNumbers } = useCalendarSettings()

const orderedWeekdays = computed(() => {
  const list = [...KHMER_WEEKDAYS]
  const startIndex = list.findIndex((w) => w.id === startOfWeek.value)
  if (startIndex === -1) return list
  return [...list.slice(startIndex), ...list.slice(0, startIndex)]
})

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

function isChristmasDay(day: KhmerDayDetail): boolean {
  return (
    day.holiday?.id === 'christmas-day' ||
    (day.gregorian.month === 12 && day.gregorian.day === 25)
  )
}

function isChineseNewYear(day: KhmerDayDetail): boolean {
  if (day.holiday?.id.startsWith('cny-')) return true
  const cny = CHINESE_NEW_YEAR_MAP[day.gregorian.year]
  if (!cny) return false
  return day.gregorian.month === cny.month && day.gregorian.day === cny.day
}

function isKhmerNewYear(day: KhmerDayDetail): boolean {
  if (day.holiday?.id.startsWith('kny-')) return true
  const ny = getNewYear(day.gregorian.year)
  if (!ny) return false
  return (
    day.gregorian.month === ny.month &&
    day.gregorian.day >= ny.day &&
    day.gregorian.day <= ny.day + 2
  )
}

function isSpecialDate(day: KhmerDayDetail): boolean {
  return (
    isJan01(day) ||
    isValentinesDay(day) ||
    isHalloweenDay(day) ||
    isChristmasDay(day) ||
    isChineseNewYear(day) ||
    isKhmerNewYear(day)
  )
}
</script>

<template>
  <div class="relative w-full pb-5 -mb-5" style="overflow-x: clip; overflow-y: visible;">
    <Transition :name="navDirection === 'left' ? 'slide-left' : 'slide-right'" mode="out-in">
      <div :key="monthKey" class="w-full">
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
            <div
              v-if="showWeekNumbers"
              class="flex items-center justify-center rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-2"
              title="Week Number"
            >
              W
            </div>
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
                class="group relative flex flex-col justify-between rounded-2xl p-1 sm:p-2.5 min-h-[64px] sm:min-h-[88px] text-left border transition-all duration-200 outline-none active:scale-[0.98] overflow-hidden"
                :class="[
                  !day.isCurrentMonth
                    ? 'border-transparent bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 opacity-40 hover:opacity-75'
                    : isCellSelected(day)
                    ? day.isToday
                      ? 'border-sky-500 bg-sky-100/70 shadow-lg shadow-sky-500/20 ring-2 ring-sky-500 dark:border-sky-400 dark:bg-sky-950/50 dark:ring-sky-400'
                      : 'border-slate-800 bg-slate-100/80 shadow-lg shadow-slate-900/10 ring-2 ring-slate-800 dark:border-slate-200 dark:bg-slate-800/80 dark:ring-slate-200'
                    : day.isToday
                    ? 'border-sky-500 bg-sky-50/80 hover:bg-sky-50 shadow-md shadow-sky-500/15 ring-2 ring-sky-400/50 dark:border-sky-400/70 dark:bg-sky-950/35 dark:hover:bg-sky-950/45 dark:ring-sky-500/40'
                    : isJan01(day)
                    ? 'border-amber-400/70 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/15 hover:from-amber-500/25 hover:to-rose-500/20 dark:border-amber-400/50 dark:from-amber-950/30 dark:to-rose-950/20 shadow-xs ring-1 ring-amber-400/30'
                    : isValentinesDay(day)
                    ? 'border-pink-300/80 bg-gradient-to-br from-pink-500/15 via-rose-400/10 to-pink-500/15 hover:from-pink-500/25 hover:to-rose-400/20 dark:border-pink-400/50 dark:from-pink-950/30 dark:to-rose-950/20 shadow-xs ring-1 ring-pink-400/30'
                    : isHalloweenDay(day)
                    ? 'border-orange-400/70 bg-gradient-to-br from-orange-500/15 via-purple-950/15 to-orange-500/15 hover:from-orange-500/25 hover:to-purple-900/20 dark:border-purple-400/50 dark:from-orange-950/30 dark:to-purple-950/30 shadow-xs ring-1 ring-orange-400/30'
                    : isChristmasDay(day)
                    ? 'border-green-400/70 bg-gradient-to-br from-green-500/15 via-red-500/10 to-green-500/15 hover:from-green-500/25 hover:to-red-500/20 dark:border-green-400/50 dark:from-green-950/30 dark:to-red-950/20 shadow-xs ring-1 ring-green-400/30'
                    : isChineseNewYear(day)
                    ? 'border-red-400/70 bg-gradient-to-br from-red-500/15 via-amber-500/10 to-red-500/15 hover:from-red-500/25 hover:to-amber-500/20 dark:border-red-400/50 dark:from-red-950/30 dark:to-amber-950/20 shadow-xs ring-1 ring-red-400/30'
                    : isKhmerNewYear(day)
                    ? 'border-amber-400/70 bg-gradient-to-br from-amber-500/18 via-orange-500/12 to-amber-500/18 hover:from-amber-500/28 hover:to-orange-500/22 dark:border-amber-400/50 dark:from-amber-950/35 dark:to-orange-950/25 shadow-xs ring-1 ring-amber-400/30'
                    : day.holiday && day.holiday.isOffDay
                    ? 'border-red-200 bg-red-50/50 hover:bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/40'
                    : day.isHolyDay
                    ? 'border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/80 dark:border-amber-900/30 dark:bg-amber-950/20 dark:hover:bg-amber-950/40'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100/80 dark:border-slate-800/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/80',
                ]"
              >
                <!-- Special Date Background Decorations (SVG-based, behind content) -->

                <!-- Jan-01: Animated golden firework starburst background -->
                <div
                  v-if="isJan01(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <svg class="absolute -right-2 -bottom-2 w-14 h-14 sm:w-20 sm:h-20 anim-firework-starburst opacity-30 dark:opacity-25" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="3" fill="#F59E0B" class="anim-firework-core"/>
                    <line x1="40" y1="40" x2="40" y2="8" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" class="anim-ray" style="--ray-angle: 0deg"/>
                    <line x1="40" y1="40" x2="62" y2="14" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round" class="anim-ray" style="--ray-angle: 45deg"/>
                    <line x1="40" y1="40" x2="72" y2="40" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" class="anim-ray" style="--ray-angle: 90deg"/>
                    <line x1="40" y1="40" x2="62" y2="66" stroke="#EC4899" stroke-width="1.2" stroke-linecap="round" class="anim-ray" style="--ray-angle: 135deg"/>
                    <line x1="40" y1="40" x2="40" y2="72" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" class="anim-ray" style="--ray-angle: 180deg"/>
                    <line x1="40" y1="40" x2="18" y2="66" stroke="#8B5CF6" stroke-width="1.2" stroke-linecap="round" class="anim-ray" style="--ray-angle: 225deg"/>
                    <line x1="40" y1="40" x2="8" y2="40" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" class="anim-ray" style="--ray-angle: 270deg"/>
                    <line x1="40" y1="40" x2="18" y2="14" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round" class="anim-ray" style="--ray-angle: 315deg"/>
                    <circle cx="40" cy="10" r="2" fill="#FBBF24" class="anim-sparkle-dot" style="--sparkle-delay: 0s"/>
                    <circle cx="68" cy="20" r="1.5" fill="#F43F5E" class="anim-sparkle-dot" style="--sparkle-delay: 0.3s"/>
                    <circle cx="68" cy="60" r="1.5" fill="#A855F7" class="anim-sparkle-dot" style="--sparkle-delay: 0.6s"/>
                    <circle cx="12" cy="60" r="1.5" fill="#38BDF8" class="anim-sparkle-dot" style="--sparkle-delay: 0.9s"/>
                    <circle cx="12" cy="20" r="2" fill="#34D399" class="anim-sparkle-dot" style="--sparkle-delay: 1.2s"/>
                  </svg>
                </div>

                <!-- Valentine: Floating hearts SVG background -->
                <div
                  v-if="isValentinesDay(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <svg class="absolute -right-1 -bottom-1 w-12 h-12 sm:w-16 sm:h-16 opacity-25 dark:opacity-20" viewBox="0 0 60 60" fill="none">
                    <path d="M30 52 C30 52 6 36 6 20 C6 12 12 6 20 6 C24 6 28 9 30 12 C32 9 36 6 40 6 C48 6 54 12 54 20 C54 36 30 52 30 52Z" fill="#EC4899" class="anim-heart-bg-pulse"/>
                  </svg>
                  <svg class="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 opacity-20 dark:opacity-15 anim-heart-float-bg" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21 C12 21 2.5 14.5 2.5 8.5 C2.5 5.5 5 3 8 3 C9.7 3 11.2 4 12 5 C12.8 4 14.3 3 16 3 C19 3 21.5 5.5 21.5 8.5 C21.5 14.5 12 21 12 21Z" fill="#F472B6"/>
                  </svg>
                </div>

                <!-- Halloween: Spooky purple mist background -->
                <div
                  v-if="isHalloweenDay(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <div class="absolute -right-3 -bottom-3 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tl from-orange-500/20 via-purple-600/15 to-transparent anim-spooky-glow"></div>
                  <svg class="absolute right-0 bottom-0 w-10 h-8 sm:w-14 sm:h-10 opacity-30 dark:opacity-25" viewBox="0 0 50 36" fill="none">
                    <ellipse cx="25" cy="22" rx="12" ry="10" fill="#F97316" class="anim-pumpkin-bg"/>
                    <path d="M25 12 C25 12 24 8 25 6 C26 8 25 12 25 12Z" fill="#16A34A"/>
                    <path d="M20 20 L22 18 L24 20" stroke="#1E1B4B" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                    <path d="M26 20 L28 18 L30 20" stroke="#1E1B4B" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                    <path d="M22 26 Q25 29 28 26" stroke="#1E1B4B" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                  </svg>
                </div>

                <!-- Christmas: Tree and ornament SVG background -->
                <div
                  v-if="isChristmasDay(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <svg class="absolute -right-1 -bottom-2 w-12 h-14 sm:w-16 sm:h-18 opacity-30 dark:opacity-25" viewBox="0 0 50 60" fill="none">
                    <polygon points="25,6 10,26 40,26" fill="#16A34A" class="anim-tree-shimmer"/>
                    <polygon points="25,16 6,40 44,40" fill="#15803D" class="anim-tree-shimmer" style="animation-delay: 0.5s"/>
                    <polygon points="25,28 2,52 48,52" fill="#166534" class="anim-tree-shimmer" style="animation-delay: 1s"/>
                    <rect x="21" y="52" width="8" height="6" rx="1" fill="#92400E"/>
                    <circle cx="25" cy="8" r="2.5" fill="#FBBF24" class="anim-star-top"/>
                    <circle cx="20" cy="22" r="1.8" fill="#EF4444" class="anim-ornament" style="--orn-delay: 0s"/>
                    <circle cx="30" cy="22" r="1.5" fill="#3B82F6" class="anim-ornament" style="--orn-delay: 0.4s"/>
                    <circle cx="15" cy="35" r="1.8" fill="#FBBF24" class="anim-ornament" style="--orn-delay: 0.8s"/>
                    <circle cx="35" cy="35" r="1.5" fill="#A855F7" class="anim-ornament" style="--orn-delay: 1.2s"/>
                    <circle cx="25" cy="44" r="1.8" fill="#EF4444" class="anim-ornament" style="--orn-delay: 1.6s"/>
                  </svg>
                </div>

                <!-- Chinese New Year: Lantern SVG background -->
                <div
                  v-if="isChineseNewYear(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <svg class="absolute -right-1 -top-1 w-10 h-14 sm:w-14 sm:h-18 opacity-30 dark:opacity-25" viewBox="0 0 40 56" fill="none">
                    <line x1="20" y1="0" x2="20" y2="10" stroke="#B91C1C" stroke-width="1.5"/>
                    <rect x="14" y="8" width="12" height="4" rx="1.5" fill="#F59E0B"/>
                    <ellipse cx="20" cy="28" rx="12" ry="16" fill="#DC2626" class="anim-lantern-glow"/>
                    <line x1="12" y1="22" x2="28" y2="22" stroke="#FBBF24" stroke-width="1" opacity="0.6"/>
                    <line x1="10" y1="28" x2="30" y2="28" stroke="#FBBF24" stroke-width="1" opacity="0.6"/>
                    <line x1="12" y1="34" x2="28" y2="34" stroke="#FBBF24" stroke-width="1" opacity="0.6"/>
                    <rect x="14" y="42" width="12" height="4" rx="1.5" fill="#F59E0B"/>
                    <line x1="16" y1="46" x2="14" y2="54" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" class="anim-tassel"/>
                    <line x1="20" y1="46" x2="20" y2="55" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" class="anim-tassel" style="animation-delay: 0.2s"/>
                    <line x1="24" y1="46" x2="26" y2="54" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" class="anim-tassel" style="animation-delay: 0.4s"/>
                  </svg>
                </div>

                <!-- Khmer New Year: Angkor Wat silhouette + water splash SVG background -->
                <div
                  v-if="isKhmerNewYear(day) && day.isCurrentMonth"
                  class="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <svg class="absolute -right-2 -bottom-1 w-16 h-10 sm:w-20 sm:h-14 opacity-25 dark:opacity-20" viewBox="0 0 80 48" fill="none">
                    <rect x="0" y="40" width="80" height="8" rx="2" fill="#D97706" opacity="0.4"/>
                    <rect x="34" y="10" width="12" height="30" fill="#B45309"/>
                    <polygon points="40,2 32,14 48,14" fill="#D97706"/>
                    <rect x="14" y="20" width="10" height="20" fill="#B45309"/>
                    <polygon points="19,14 12,22 26,22" fill="#D97706"/>
                    <rect x="56" y="20" width="10" height="20" fill="#B45309"/>
                    <polygon points="61,14 54,22 68,22" fill="#D97706"/>
                    <rect x="4" y="28" width="8" height="12" fill="#92400E"/>
                    <polygon points="8,22 2,30 14,30" fill="#B45309"/>
                    <rect x="68" y="28" width="8" height="12" fill="#92400E"/>
                    <polygon points="72,22 66,30 78,30" fill="#B45309"/>
                  </svg>
                  <!-- Water drops -->
                  <svg class="absolute left-1 top-1 w-6 h-8 sm:w-8 sm:h-10 opacity-20 dark:opacity-15" viewBox="0 0 24 32" fill="none">
                    <path d="M12 2 C12 2 4 14 4 20 C4 24.4 7.6 28 12 28 C16.4 28 20 24.4 20 20 C20 14 12 2 12 2Z" fill="#38BDF8" class="anim-water-drop"/>
                  </svg>
                </div>

                <!-- Top Row: Gregorian Day Number + Indicators -->
                <div class="relative z-10 flex items-start justify-between w-full">
                  <div class="flex items-baseline gap-1">
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
                                : isChristmasDay(day)
                                  ? 'text-green-700 dark:text-green-400 font-extrabold'
                                  : isChineseNewYear(day)
                                    ? 'text-red-600 dark:text-red-400 font-extrabold'
                                    : isKhmerNewYear(day)
                                      ? 'text-amber-700 dark:text-amber-400 font-extrabold'
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

                    <!-- Jan-01: SVG Firework Starburst -->
                    <div
                      v-if="isJan01(day)"
                      class="relative flex items-center justify-center"
                      title="ចូលឆ្នាំសកល (Happy New Year)"
                    >
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 anim-firework-icon" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="2.5" fill="#F59E0B"/>
                        <line x1="12" y1="12" x2="12" y2="2" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="22" y2="12" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="12" y2="22" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="2" y2="12" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="19" y2="5" stroke="#EF4444" stroke-width="1.2" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="19" y2="19" stroke="#EC4899" stroke-width="1.2" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="5" y2="19" stroke="#8B5CF6" stroke-width="1.2" stroke-linecap="round"/>
                        <line x1="12" y1="12" x2="5" y2="5" stroke="#38BDF8" stroke-width="1.2" stroke-linecap="round"/>
                        <circle cx="12" cy="3" r="1" fill="#FBBF24" class="anim-sparkle-dot" style="--sparkle-delay: 0s"/>
                        <circle cx="21" cy="12" r="1" fill="#F43F5E" class="anim-sparkle-dot" style="--sparkle-delay: 0.5s"/>
                        <circle cx="12" cy="21" r="1" fill="#A855F7" class="anim-sparkle-dot" style="--sparkle-delay: 1s"/>
                        <circle cx="3" cy="12" r="1" fill="#38BDF8" class="anim-sparkle-dot" style="--sparkle-delay: 1.5s"/>
                      </svg>
                    </div>

                    <!-- Feb-14: SVG Heart with pulse -->
                    <div
                      v-else-if="isValentinesDay(day)"
                      class="relative flex items-center justify-center"
                      title="ទិវានៃក្ដីស្រឡាញ់ (Valentine's Day)"
                    >
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 anim-heart-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#EC4899"/>
                      </svg>
                      <svg class="absolute -top-1 -right-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 anim-mini-heart-1" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14l-1-0.9C3.6 10.2 1.3 8.1 1.3 5.7 1.3 3.6 3 2 5 2c1.2 0 2.3.5 3 1.4C8.7 2.5 9.8 2 11 2c2 0 3.7 1.6 3.7 3.7 0 2.4-2.3 4.5-5.7 7.4L8 14z" fill="#F472B6"/>
                      </svg>
                      <svg class="absolute -bottom-0.5 -left-1 h-2 w-2 sm:h-2.5 sm:w-2.5 anim-mini-heart-2" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14l-1-0.9C3.6 10.2 1.3 8.1 1.3 5.7 1.3 3.6 3 2 5 2c1.2 0 2.3.5 3 1.4C8.7 2.5 9.8 2 11 2c2 0 3.7 1.6 3.7 3.7 0 2.4-2.3 4.5-5.7 7.4L8 14z" fill="#FB7185"/>
                      </svg>
                    </div>

                    <!-- Oct-31: SVG Bat + Pumpkin -->
                    <div
                      v-else-if="isHalloweenDay(day)"
                      class="relative flex items-center justify-center"
                      title="ពិធីបុណ្យហាឡូវីន (Halloween)"
                    >
                      <svg class="h-4.5 w-4.5 sm:h-5 sm:w-5 anim-bat-fly" viewBox="0 0 24 20" fill="none">
                        <path d="M12 8 C12 8 8 4 2 2 C4 6 6 8 8 10 C6 10 4 12 2 14 C8 12 10 10 12 12 C14 10 16 12 22 14 C20 12 18 10 16 10 C18 8 20 6 22 2 C16 4 12 8 12 8Z" fill="#6D28D9" class="anim-bat-wings"/>
                        <circle cx="10" cy="8" r="1" fill="#FBBF24"/>
                        <circle cx="14" cy="8" r="1" fill="#FBBF24"/>
                      </svg>
                    </div>

                    <!-- Dec-25: SVG Christmas ornament -->
                    <div
                      v-else-if="isChristmasDay(day)"
                      class="relative flex items-center justify-center"
                      title="គ្រីស្ទម៉ាស់ (Christmas)"
                    >
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 anim-ornament-swing" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="0" x2="12" y2="6" stroke="#9CA3AF" stroke-width="1.5"/>
                        <rect x="10" y="5" width="4" height="3" rx="1" fill="#D4AF37"/>
                        <circle cx="12" cy="15" r="7" fill="#EF4444" class="anim-ornament-shine"/>
                        <ellipse cx="10" cy="13" rx="2" ry="3" fill="white" opacity="0.25" transform="rotate(-20 10 13)"/>
                        <circle cx="12" cy="2" r="1.5" fill="#16A34A"/>
                      </svg>
                    </div>

                    <!-- Chinese New Year: SVG Red envelope -->
                    <div
                      v-else-if="isChineseNewYear(day)"
                      class="relative flex items-center justify-center"
                      title="ចូលឆ្នាំចិន (Chinese New Year)"
                    >
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 anim-envelope-bounce" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="3" width="16" height="20" rx="2" fill="#DC2626"/>
                        <path d="M4 10 L12 15 L20 10" fill="#B91C1C"/>
                        <circle cx="12" cy="14" r="4" fill="#FBBF24" stroke="#F59E0B" stroke-width="0.5"/>
                        <text x="12" y="16" text-anchor="middle" font-size="5" font-weight="bold" fill="#B91C1C">福</text>
                      </svg>
                    </div>

                    <!-- Khmer New Year: SVG Water splash / traditional symbol -->
                    <div
                      v-else-if="isKhmerNewYear(day)"
                      class="relative flex items-center justify-center"
                      title="ចូលឆ្នាំថ្មី (Khmer New Year)"
                    >
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 anim-water-splash" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2 C12 2 5 12 5 17 C5 20.9 8.1 24 12 24 C15.9 24 19 20.9 19 17 C19 12 12 2 12 2Z" fill="#38BDF8" class="anim-water-fill"/>
                        <ellipse cx="9" cy="15" rx="1.5" ry="3" fill="white" opacity="0.3" transform="rotate(-15 9 15)"/>
                        <circle cx="8" cy="6" r="1.5" fill="#38BDF8" opacity="0.5" class="anim-side-drop" style="--drop-delay: 0s"/>
                        <circle cx="17" cy="8" r="1.2" fill="#38BDF8" opacity="0.4" class="anim-side-drop" style="--drop-delay: 0.3s"/>
                        <circle cx="6" cy="10" r="1" fill="#38BDF8" opacity="0.3" class="anim-side-drop" style="--drop-delay: 0.6s"/>
                      </svg>
                    </div>

                    <!-- Today Badge -->
                    <span
                      v-if="day.isToday"
                      class="flex h-2 w-2 rounded-full bg-sky-500 ring-2 ring-sky-200 dark:ring-sky-900/60 animate-pulse"
                      title="ថ្ងៃនេះ (Today)"
                    ></span>

                    <!-- Buddhist Holy Day Indicator -->
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

                    <!-- Holiday Red Dot Indicator (Hidden on Special Dates to keep header uncluttered next to animated SVG badge) -->
                    <span
                      v-if="day.holiday && !isSpecialDate(day)"
                      class="flex h-2 w-2 rounded-full"
                      :class="day.holiday.isOffDay ? 'bg-red-500' : 'bg-blue-500'"
                      :title="day.holiday.titleKh"
                    ></span>
                  </div>
                </div>

                <!-- Middle / Bottom Row: Khmer Lunar Date -->
                <div class="relative z-10 w-full mt-1">
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
                    <span v-if="day.khmer.day === 15 && day.khmer.moonPhase === 0">
                      ១៥កើត (ពេញ)
                    </span>
                    <span v-else-if="day.holyDayType === 'new_moon'">
                      {{ toKhmerNumber(day.khmer.day) }}រោច (ដាច់)
                    </span>
                    <span v-else>
                      {{ toKhmerNumber(day.khmer.day) }}{{ day.khmer.moonPhaseName }}
                    </span>
                  </div>

                  <!-- Holiday / Holy Day pill with Thematic Special Date Styling -->
                  <div v-if="day.holiday" class="hidden sm:block mt-1">
                    <span
                      class="inline-block max-w-full truncate rounded-md px-1.5 py-0.5 text-[9px] font-bold"
                      :class="[
                        isJan01(day)
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-400/50 font-extrabold'
                          : isValentinesDay(day)
                            ? 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-400/40 font-extrabold'
                            : isChristmasDay(day)
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-400/40 font-extrabold'
                              : isChineseNewYear(day)
                                ? 'bg-red-500/20 text-red-700 dark:text-red-300 border border-amber-400/50 font-extrabold'
                                : isKhmerNewYear(day)
                                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-400/50 font-extrabold'
                                  : day.holiday.isOffDay
                                    ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20'
                                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20',
                      ]"
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
