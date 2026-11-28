<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Copy, Check, Calendar, ChevronRight } from 'lucide-vue-next'
import { MoonPhase } from '@thyrith/momentkh'
import confetti from 'canvas-confetti'
import { useCalendarState } from '@/composables/useCalendarState'

const { todayDetail, goToToday, selectDate } = useCalendarState()

const isTodayCopied = ref(false)
const isLeafBouncing = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null
let bounceTimer: ReturnType<typeof setTimeout> | null = null

// Traditional Cambodian 7 Colors of the Week (ក្បួនពណ៌ប្រចាំថ្ងៃទាំង ៧)
const KHMER_WEEKDAY_COLORS: Record<number, { nameKh: string; nameEn: string; swatchHex: string }> =
  {
    0: { nameKh: 'ក្រហម', nameEn: 'Ruby Red', swatchHex: '#EF4444' },
    1: { nameKh: 'លឿងទុំ', nameEn: 'Golden Amber', swatchHex: '#F59E0B' },
    2: { nameKh: 'ស្វាយ', nameEn: 'Royal Violet', swatchHex: '#8B5CF6' },
    3: { nameKh: 'ស៊ីលៀប', nameEn: 'Silky Olive', swatchHex: '#84CC16' },
    4: { nameKh: 'បៃតង', nameEn: 'Emerald Green', swatchHex: '#10B981' },
    5: { nameKh: 'ខៀវ', nameEn: 'Celestial Blue', swatchHex: '#0EA5E9' },
    6: { nameKh: 'ព្រីងទុំ', nameEn: 'Deep Plum', swatchHex: '#9333EA' },
  }

const traditionalDayColor = computed(
  () =>
    KHMER_WEEKDAY_COLORS[todayDetail.value.gregorian.dayOfWeek] ?? {
      nameKh: 'មាស',
      nameEn: 'Gold',
      swatchHex: '#F59E0B',
    },
)

// Compute live SVG moon phase path (r = 8, center = 10,10) from lunar day (1..15) & waxing/waning
const moonLitPath = computed(() => {
  const day = Math.min(15, Math.max(1, todayDetail.value.khmer.day))
  const isWaxing = todayDetail.value.khmer.moonPhase === MoonPhase.Waxing
  const r = 8

  if (isWaxing && day >= 15) {
    // Full moon
    return `M 10 ${10 - r} A ${r} ${r} 0 1 1 10 ${10 + r} A ${r} ${r} 0 1 1 10 ${10 - r} Z`
  }
  if (!isWaxing && day >= 14) {
    // End of waning month (thin crescent / dark moon)
    return ''
  }

  const illumination = isWaxing ? day / 15 : (15 - day) / 15
  const rx = Math.max(0.4, Math.abs(1 - 2 * illumination) * r)

  if (isWaxing) {
    // Right limb illuminated
    const sweepInner = illumination > 0.5 ? 1 : 0
    return `M 10 ${10 - r} A ${r} ${r} 0 0 1 10 ${10 + r} A ${rx.toFixed(2)} ${r} 0 0 ${sweepInner} 10 ${10 - r} Z`
  } else {
    // Left limb illuminated
    const sweepInner = illumination > 0.5 ? 0 : 1
    return `M 10 ${10 - r} A ${r} ${r} 0 0 0 10 ${10 + r} A ${rx.toFixed(2)} ${r} 0 0 ${sweepInner} 10 ${10 - r} Z`
  }
})

function copyTodayDate() {
  navigator.clipboard.writeText(todayDetail.value.copyFormat).then(() => {
    isTodayCopied.value = true
    confetti({
      particleCount: 30,
      spread: 52,
      origin: { y: 0.78 },
      colors: ['#F59E0B', '#0EA5E9', '#10B981'],
    })
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      isTodayCopied.value = false
    }, 2400)
  })
}

function handleTearOffClick() {
  isLeafBouncing.value = true
  if (bounceTimer) clearTimeout(bounceTimer)
  bounceTimer = setTimeout(() => {
    isLeafBouncing.value = false
  }, 260)
  goToToday()
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
  if (bounceTimer) clearTimeout(bounceTimer)
})
</script>

<template>
  <section
    aria-label="កាលបរិច្ឆេទថ្ងៃនេះ (Today's Khmer Lunar Date)"
    class="relative overflow-hidden rounded-3xl border border-sky-400/45 bg-gradient-to-br from-sky-50 via-white to-amber-50/55 p-4 sm:p-5 shadow-lg shadow-sky-500/8 dark:border-sky-400/35 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/50 dark:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.7)]"
  >
    <!-- Top Bar: Lunar Phase Pill + One-Click Copy -->
    <div class="flex items-center justify-between gap-2 mb-3.5">
      <div class="flex flex-wrap items-center gap-1.5 min-w-0">
        <!-- Live Lunar Moon SVG + Title -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/12 px-2.5 py-1 text-[11px] font-extrabold text-sky-900 dark:border-sky-400/35 dark:bg-sky-400/15 dark:text-sky-200"
        >
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle
              cx="10"
              cy="10"
              r="8"
              class="fill-slate-800 stroke-amber-400/80 dark:fill-slate-950 dark:stroke-amber-300/80"
              stroke-width="1.4"
            />
            <path v-if="moonLitPath" :d="moonLitPath" fill="#FBBF24" />
          </svg>
          <span>TODAY</span>
        </span>

        <!-- Optional Holy Day / Public Holiday Live Chip -->
        <span
          v-if="todayDetail.isHolyDay"
          class="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/20 dark:text-amber-200"
        >
          ថ្ងៃសីល
        </span>
        <span
          v-else-if="todayDetail.holiday"
          class="inline-flex items-center rounded-full border border-rose-500/35 bg-rose-500/12 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:border-rose-400/40 dark:bg-rose-400/20 dark:text-rose-200 truncate max-w-36"
        >
          {{ todayDetail.holiday.titleKh }}
        </span>
      </div>

      <!-- Quick Copy Full Date Button -->
      <button
        type="button"
        @click="copyTodayDate"
        class="inline-flex min-h-11 lg:min-h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 lg:px-3 py-2 lg:py-1.5 text-xs lg:text-[11px] font-extrabold transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        :class="
          isTodayCopied
            ? 'border-emerald-500 bg-emerald-500 text-slate-950 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950'
            : 'border-sky-500/35 bg-sky-500 text-slate-950 hover:bg-amber-500 hover:border-amber-500 dark:border-sky-400/50 dark:bg-sky-400 dark:text-slate-950 dark:hover:border-amber-400 dark:hover:bg-amber-400'
        "
        title="ចម្លងកាលបរិច្ឆេទថ្ងៃនេះ (Copy Today)"
      >
        <component :is="isTodayCopied ? Check : Copy" class="h-3.5 w-3.5 shrink-0" />
        <span>{{ isTodayCopied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>

    <!-- Main Body: Playful Tear-Off Desk Calendar Sheet + Range-Selectable Date Well -->
    <div class="flex items-stretch gap-3 sm:gap-3.5">
      <!-- Interactive Tear-Off Calendar Page -->
      <button
        type="button"
        @click="handleTearOffClick"
        title="ចុចដើម្បីលោតទៅថ្ងៃនេះលើប្រតិទិន (Jump to Today)"
        class="group/leaf relative flex w-[4.5rem] sm:w-20 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-300/90 bg-white text-center shadow-md shadow-slate-900/10 transition-transform duration-200 hover:-rotate-2 hover:-translate-y-0.5 hover:border-amber-500 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/50 dark:hover:border-amber-400"
        :class="isLeafBouncing ? 'scale-95 -rotate-3' : ''"
      >
        <!-- Twin Metallic Binding Rings -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute top-1 left-3.5 h-2 w-1.5 rounded-full bg-amber-200 ring-1 ring-amber-700/40"
        ></span>
        <span
          aria-hidden="true"
          class="pointer-events-none absolute top-1 right-3.5 h-2 w-1.5 rounded-full bg-amber-200 ring-1 ring-amber-700/40"
        ></span>

        <!-- Calendar Sheet Month Header -->
        <span
          class="block w-full bg-gradient-to-r from-sky-600 to-blue-600 pt-2.5 pb-1 text-[10px] font-extrabold text-white transition-colors group-hover/leaf:from-amber-500 group-hover/leaf:to-orange-500 group-hover/leaf:text-slate-950"
        >
          ខែ{{ todayDetail.khmer.solarMonthName }}
        </span>

        <!-- Big Day Number -->
        <span
          class="flex flex-1 flex-col items-center justify-center px-1 py-1.5 bg-white dark:bg-slate-800"
        >
          <span
            class="text-2xl sm:text-[26px] font-black leading-none tracking-tight text-slate-900 dark:text-white"
          >
            {{ todayDetail.gregorian.day }}
          </span>
          <span
            class="mt-1 text-[10px] font-bold text-sky-700 transition-colors group-hover/leaf:text-amber-700 dark:text-sky-300 dark:group-hover/leaf:text-amber-300"
          >
            ថ្ងៃ{{ todayDetail.khmer.dayOfWeekName }}
          </span>
        </span>

        <!-- Playful Folded Paper Corner -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute bottom-0 right-0 h-3 w-3 rounded-tl-md border-t border-l border-slate-300 bg-slate-100 transition-all group-hover/leaf:h-4 group-hover/leaf:w-4 group-hover/leaf:border-amber-400 group-hover/leaf:bg-amber-100 dark:border-slate-500 dark:bg-slate-700 dark:group-hover/leaf:border-amber-400 dark:group-hover/leaf:bg-amber-400/30"
        ></span>
      </button>

      <!-- Natural Range-Selectable Date Text Well (select-text, NOT select-all) -->
      <div
        data-testid="today-selectable-well"
        class="flex flex-1 min-w-0 flex-col justify-center rounded-2xl border border-sky-500/20 bg-white/95 px-3.5 py-2.5 select-text cursor-text dark:border-slate-700 dark:bg-slate-800/90"
      >
        <p
          data-testid="today-lunar-text"
          class="select-text cursor-text selection:bg-amber-300 selection:text-slate-950 dark:selection:bg-amber-400 dark:selection:text-slate-950 text-xs sm:text-[13.5px] font-bold text-slate-900 dark:text-white leading-relaxed"
        >
          {{ todayDetail.lunarFullText }}
        </p>
        <p
          data-testid="today-solar-text"
          class="select-text cursor-text selection:bg-amber-300 selection:text-slate-950 dark:selection:bg-amber-400 dark:selection:text-slate-950 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mt-1"
        >
          {{ todayDetail.solarFullText }}
        </p>
      </div>
    </div>

    <!-- Footer Bar: Traditional Khmer Day Color + Zodiac Sak + Open Details -->
    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sky-500/20 pt-2.5 text-[11px] dark:border-slate-700/90"
    >
      <div class="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-200">
        <!-- Traditional Khmer Color of the Day Swatch -->
        <span
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/90 px-2 py-0.5 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          :title="`ពណ៌សំលៀកបំពាក់ប្រចាំថ្ងៃតាមក្បួនប្រពៃណីខ្មែរ: ពណ៌${traditionalDayColor.nameKh} (${traditionalDayColor.nameEn})`"
        >
          <span
            aria-hidden="true"
            class="h-2.5 w-2.5 rounded-full ring-1 ring-black/15 dark:ring-white/25 shrink-0"
            :style="{ backgroundColor: traditionalDayColor.swatchHex }"
          ></span>
          <span>ពណ៌ប្រចាំថ្ងៃ: {{ traditionalDayColor.nameKh }}</span>
        </span>

        <span class="font-semibold text-slate-600 dark:text-slate-300">
          ឆ្នាំ{{ todayDetail.khmer.animalYearName }} • {{ todayDetail.khmer.sakName }}
        </span>
      </div>

      <button
        type="button"
        @click="selectDate(todayDetail)"
        class="group inline-flex min-h-11 lg:min-h-8 items-center gap-1 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 lg:px-2.5 py-2 lg:py-1 font-bold text-sky-900 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-sky-400/35 dark:bg-sky-400/15 dark:text-sky-200 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
      >
        <Calendar
          class="h-3 w-3 text-sky-700 transition-colors group-hover:text-slate-950 dark:text-sky-300 dark:group-hover:text-slate-950"
        />
        <span>Details</span>
        <ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  </section>
</template>
