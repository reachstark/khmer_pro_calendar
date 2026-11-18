<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sparkles, ChevronDown, ChevronUp, X } from 'lucide-vue-next'
import { toKhmerNumber } from '@/utils/khmerCalendar'

const isCollapsed = ref(false)
const isDismissed = ref(false)

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Check if preview mode is enabled via query parameter or localStorage for testing/demo
const isPreviewMode = computed(() => {
  if (typeof window === 'undefined') return false
  return (
    new URLSearchParams(window.location.search).get('previewCountdown') === 'true' ||
    localStorage.getItem('khmer_calendar_preview_countdown') === 'true'
  )
})

// Target Year for New Year's Day (Jan 1, 00:00:00)
const targetYear = computed(() => {
  const currentRealYear = now.value.getFullYear()
  // If it is Jan 1, target is today's year for celebration
  if (now.value.getMonth() === 0 && now.value.getDate() === 1) {
    return currentRealYear
  }
  return currentRealYear + 1
})

const targetDate = computed(() => {
  return new Date(targetYear.value, 0, 1, 0, 0, 0, 0)
})

// Live time remaining until New Year (Jan 1, 00:00:00)
const timeRemaining = computed(() => {
  // If preview mode is forced for testing while outside the 15-day window, provide a sample 15-day progression
  if (isPreviewMode.value) {
    const rawDiff = targetDate.value.getTime() - now.value.getTime()
    const rawDays = Math.floor(rawDiff / (1000 * 60 * 60 * 24))
    if (rawDays > 15) {
      return {
        isCelebration: false,
        days: 15,
        hours: 12,
        minutes: 30,
        seconds: 45,
      }
    }
  }

  // Jan 1 New Year Day celebration
  if (now.value.getMonth() === 0 && now.value.getDate() === 1) {
    return {
      isCelebration: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const diff = targetDate.value.getTime() - now.value.getTime()

  if (diff <= 0) {
    return {
      isCelebration: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return {
    isCelebration: false,
    days,
    hours,
    minutes,
    seconds,
  }
})

// Feature displays ONLY when exactly 15 days or fewer remain until New Year
// (e.g. from Dec 16 countdown down to Dec 31/Jan 1).
// Since current date is 18-Nov-2026 (~43 days away), it remains completely hidden.
const isCountdownActive = computed(() => {
  if (isDismissed.value) return false
  if (isPreviewMode.value) return true

  // Active on Jan 1 (New Year's Day)
  if (now.value.getMonth() === 0 && now.value.getDate() === 1) {
    return true
  }

  const diff = targetDate.value.getTime() - now.value.getTime()
  if (diff <= 0) return false

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  // Starts counting down 15 days until New Year's Eve / New Year
  return days <= 15
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2 scale-98"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-98"
  >
    <div v-if="isCountdownActive" class="w-full">
      <!-- 1. Expanded Festive Mode -->
      <div
        v-if="!isCollapsed"
        class="relative overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-rose-500/15 via-purple-900/20 to-amber-500/15 p-3.5 sm:p-5 shadow-lg shadow-amber-500/10 dark:border-amber-400/40 dark:from-amber-950/50 dark:via-purple-950/40 dark:to-amber-950/50 backdrop-blur-md animate-gradient"
      >
        <!-- Background Ambient Glow -->
        <div
          class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/25 blur-2xl"
        ></div>
        <div
          class="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-rose-400/20 blur-2xl"
        ></div>

        <!-- Header: Title & Actions -->
        <div class="relative z-10 flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-400/40 shadow-xs"
            >
              <Sparkles class="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span
                  class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300"
                >
                  រាប់ថយក្រោយឆ្លងឆ្នាំ • New Year Countdown
                </span>
                <span
                  class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200"
                >
                  {{ targetYear }}
                </span>
              </div>
              <h3
                class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight"
              >
                ស្វាគមន៍ឆ្នាំថ្មី {{ toKhmerNumber(targetYear) }} (Happy New Year {{ targetYear }}) 🎆
              </h3>
            </div>
          </div>

          <!-- Controls: Minimize / Dismiss -->
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="isCollapsed = true"
              class="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
              title="បង្រួម (Collapse)"
            >
              <ChevronUp class="h-4 w-4" />
            </button>
            <button
              type="button"
              @click="isDismissed = true"
              class="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
              title="បិទ (Dismiss)"
            >
              <X class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <!-- 4 Live Timer Grid Cards (Optimized for Mobile & Desktop) -->
        <div class="relative z-10 grid grid-cols-4 gap-2 sm:gap-3">
          <!-- 1. Days -->
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-2 sm:p-3 shadow-md backdrop-blur-md"
          >
            <span
              class="text-xl sm:text-3xl font-extrabold font-mono tracking-tight text-amber-600 dark:text-amber-400"
            >
              {{ String(timeRemaining.days).padStart(2, '0') }}
            </span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5"
            >
              {{ toKhmerNumber(timeRemaining.days) }} ថ្ងៃ
            </span>
            <span class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-medium">Days</span>
          </div>

          <!-- 2. Hours -->
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-2 sm:p-3 shadow-md backdrop-blur-md"
          >
            <span
              class="text-xl sm:text-3xl font-extrabold font-mono tracking-tight text-rose-600 dark:text-rose-400"
            >
              {{ String(timeRemaining.hours).padStart(2, '0') }}
            </span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5"
            >
              {{ toKhmerNumber(timeRemaining.hours) }} ម៉ោង
            </span>
            <span class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-medium">Hours</span>
          </div>

          <!-- 3. Minutes -->
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-2 sm:p-3 shadow-md backdrop-blur-md"
          >
            <span
              class="text-xl sm:text-3xl font-extrabold font-mono tracking-tight text-sky-600 dark:text-sky-400"
            >
              {{ String(timeRemaining.minutes).padStart(2, '0') }}
            </span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5"
            >
              {{ toKhmerNumber(timeRemaining.minutes) }} នាទី
            </span>
            <span class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-medium">Mins</span>
          </div>

          <!-- 4. Seconds -->
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-2 sm:p-3 shadow-md backdrop-blur-md"
          >
            <span
              class="text-xl sm:text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-emerald-400"
            >
              {{ String(timeRemaining.seconds).padStart(2, '0') }}
            </span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5"
            >
              {{ toKhmerNumber(timeRemaining.seconds) }} វិនាទី
            </span>
            <span class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-medium">Secs</span>
          </div>
        </div>
      </div>

      <!-- 2. Compact Collapsed Bar Mode -->
      <div
        v-else
        class="relative flex items-center justify-between rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-purple-900/20 px-3.5 py-2 shadow-md dark:border-amber-400/30 dark:from-amber-950/60 dark:to-purple-950/50 backdrop-blur-md"
      >
        <div
          class="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
        >
          <span class="text-base select-none">🎆</span>
          <span>រាប់ថយក្រោយឆ្លងឆ្នាំ {{ toKhmerNumber(targetYear) }}:</span>
          <span class="font-mono text-amber-600 dark:text-amber-400">
            {{ timeRemaining.days }}ថ្ងៃ {{ String(timeRemaining.hours).padStart(2, '0') }}:{{
              String(timeRemaining.minutes).padStart(2, '0')
            }}:{{ String(timeRemaining.seconds).padStart(2, '0') }}
          </span>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="isCollapsed = false"
            class="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
          >
            <span>ពង្រីក</span>
            <ChevronDown class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            @click="isDismissed = true"
            class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            title="បិទ (Dismiss)"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
