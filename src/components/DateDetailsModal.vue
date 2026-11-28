<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Share2,
} from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { useCalendarState } from '@/composables/useCalendarState'
import { toKhmerNumber } from '@/utils/khmerCalendar'
import { getKhmerZodiacByIndex } from '@/utils/khmerZodiac'
import { getNewYear } from '@thyrith/momentkh'
import knyRumduolAsset from '@/assets/kny_rumduol.png'
import knyStarLanternAsset from '@/assets/kny_star_lantern.png'

const { selectedDate, closeModal, selectPrevDay, selectNextDay } = useCalendarState()

const isCopied = ref(false)

// Mobile draggable bottom sheet state
const sheetEl = ref<HTMLElement | null>(null)
const dragOffsetY = ref(0)
const isDragging = ref(false)
let touchStartY = 0
let touchStartX = 0
let lastTouchY = 0
let lastTouchTime = 0
let dragVelocity = 0

function handleTouchStart(e: TouchEvent) {
  if (typeof window !== 'undefined' && window.innerWidth >= 640) return
  const touch = e.touches[0]
  if (!touch) return

  // Don't drag if body is scrolled down
  if (sheetEl.value && sheetEl.value.scrollTop > 5) return

  touchStartY = touch.clientY
  touchStartX = touch.clientX
  lastTouchY = touch.clientY
  lastTouchTime = Date.now()
  dragVelocity = 0
  isDragging.value = false
}

function handleTouchMove(e: TouchEvent) {
  if (typeof window !== 'undefined' && window.innerWidth >= 640) return
  const touch = e.touches[0]
  if (!touch) return

  const deltaY = touch.clientY - touchStartY
  const deltaX = Math.abs(touch.clientX - touchStartX)

  // Only start drag if scrolled to top and moving downward
  if (sheetEl.value && sheetEl.value.scrollTop > 0) return

  if (deltaY > 6 && deltaY > deltaX) {
    isDragging.value = true
    if (e.cancelable) e.preventDefault()

    dragOffsetY.value = deltaY

    const now = Date.now()
    const dt = now - lastTouchTime
    if (dt > 0) {
      dragVelocity = (touch.clientY - lastTouchY) / dt
    }
    lastTouchY = touch.clientY
    lastTouchTime = now
  }
}

function handleTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  // Dismiss if dragged down > 80px or fast flick downwards
  if (dragOffsetY.value > 80 || dragVelocity > 0.4) {
    dragOffsetY.value = 500
    setTimeout(() => {
      closeModal()
      dragOffsetY.value = 0
    }, 180)
  } else {
    // Snap back
    dragOffsetY.value = 0
  }
}

// Special Festive Date Checks
const isJan01 = computed(() => {
  if (!selectedDate.value) return false
  return selectedDate.value.gregorian.month === 1 && selectedDate.value.gregorian.day === 1
})

const isCNY = computed(() => {
  if (!selectedDate.value) return false
  return selectedDate.value.holiday?.id.startsWith('cny-')
})

const isValentines = computed(() => {
  if (!selectedDate.value) return false
  return selectedDate.value.gregorian.month === 2 && selectedDate.value.gregorian.day === 14
})

const isHalloween = computed(() => {
  if (!selectedDate.value) return false
  return selectedDate.value.gregorian.month === 10 && selectedDate.value.gregorian.day === 31
})

const isChristmas = computed(() => {
  if (!selectedDate.value) return false
  return (
    selectedDate.value.gregorian.month === 12 &&
    (selectedDate.value.gregorian.day === 24 || selectedDate.value.gregorian.day === 25)
  )
})

const isKhmerNewYear = computed(() => {
  if (!selectedDate.value) return false
  if (selectedDate.value.holiday?.id.startsWith('kny-')) return true
  const ny = getNewYear(selectedDate.value.gregorian.year)
  if (!ny) return false
  return (
    selectedDate.value.gregorian.month === ny.month &&
    selectedDate.value.gregorian.day >= ny.day &&
    selectedDate.value.gregorian.day <= ny.day + 2
  )
})

const selectedZodiac = computed(() => {
  if (!selectedDate.value) return null
  return getKhmerZodiacByIndex(selectedDate.value.khmer.animalYear)
})

const selectedYearSongkranTime = computed(() => {
  if (!selectedDate.value) return ''
  const ny = getNewYear(selectedDate.value.gregorian.year)
  if (!ny) return ''
  return `${toKhmerNumber(String(ny.hour).padStart(2, '0'))}:${toKhmerNumber(String(ny.minute).padStart(2, '0'))}`
})

function copyKhmerDate() {
  if (!selectedDate.value) return
  const textToCopy = selectedDate.value.copyFormat

  navigator.clipboard.writeText(textToCopy).then(() => {
    isCopied.value = true
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
    })
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  })
}

function shareDate() {
  if (!selectedDate.value || !navigator.share) {
    copyKhmerDate()
    return
  }
  navigator
    .share({
      title: 'កាលបរិច្ឆេទខ្មែរ - Khmer Lunar Calendar',
      text: selectedDate.value.copyFormat,
    })
    .catch(() => {
      copyKhmerDate()
    })
}
</script>

<template>
  <div
    v-if="selectedDate"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] sm:p-4"
  >
    <!-- Backdrop overlay with dynamic drag opacity -->
    <div
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      :style="{
        opacity: dragOffsetY > 0 ? Math.max(0.1, 1 - dragOffsetY / 350) : undefined,
      }"
      @click="closeModal"
    ></div>

    <!-- Modal Content: Bottom Sheet on Mobile, Centered Dialog on Desktop -->
    <div
      ref="sheetEl"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      :style="{
        transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
        transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      }"
      class="relative z-10 w-full max-w-2xl max-h-[90dvh] sm:max-h-[85dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 duration-200 transition-colors"
    >
      <!-- Mobile Pull Bar Indicator (Draggable Handle) -->
      <div
        class="sm:hidden flex justify-center py-2 -mt-2 -mx-4 mb-1 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <div
          class="h-1.5 rounded-full transition-all duration-150"
          :class="isDragging ? 'w-16 bg-amber-500' : 'w-12 bg-slate-300 dark:bg-slate-700'"
        ></div>
      </div>

      <!-- Header: Controls & Close -->
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800"
      >
        <!-- Day Navigation (Prev / Next) -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="selectPrevDay"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="ថ្ងៃមុន (Previous Day)"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button
            type="button"
            @click="selectNextDay"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            title="ថ្ងៃបន្ទាប់ (Next Day)"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
          <span class="text-xs text-slate-400 font-medium ml-1">
            {{ selectedDate.gregorian.isoDateString }}
          </span>
        </div>

        <!-- Action buttons: Share & Close -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="shareDate"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors sm:hidden"
            title="ចែករំលែក (Share)"
          >
            <Share2 class="h-4 w-4" />
          </button>

          <button
            type="button"
            @click="closeModal"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            title="បិទ (Close)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Main Highlight Banner: Full Khmer Calendar Date String (Animated Gradients) -->
      <div
        class="relative mt-4 overflow-hidden rounded-2xl border border-amber-500/40 p-4 sm:p-5 shadow-lg shadow-amber-500/10 bg-gradient-to-r from-amber-500/25 via-orange-500/20 via-rose-500/15 via-teal-500/15 to-amber-500/25 animate-gradient dark:border-amber-500/50 dark:from-amber-500/30 dark:via-orange-500/25 dark:via-purple-500/20 dark:to-amber-500/30"
      >
        <!-- Ambient moving glow accents -->
        <div
          class="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-400/25 blur-2xl"
        ></div>
        <div
          class="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-orange-400/25 blur-2xl"
        ></div>

        <div class="relative z-10 flex items-center justify-between gap-2 mb-1.5">
          <span
            class="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider"
          >
            <Sparkles class="h-3.5 w-3.5" />
            ព័ត៌មានលម្អិតកាលបរិច្ឆេទ
          </span>

          <!-- Prominent Copy Button -->
          <button
            type="button"
            @click="copyKhmerDate"
            class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            :class="
              isCopied
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
            "
          >
            <component :is="isCopied ? Check : Copy" class="h-3.5 w-3.5" />
            <span>{{ isCopied ? 'បានចម្លងរួចរាល់!' : 'ចម្លងកាលបរិច្ឆេទ' }}</span>
          </button>
        </div>

        <!-- The exact requested string with ត្រូវនឹង... on next line (range-selectable) -->
        <div
          class="relative z-10 mt-2 space-y-1 select-text cursor-text selection:bg-amber-300 selection:text-slate-950 dark:selection:bg-amber-400 dark:selection:text-slate-950"
        >
          <p class="text-base sm:text-lg font-bold leading-relaxed text-slate-900 dark:text-white">
            {{ selectedDate.lunarFullText }}
          </p>
          <p
            class="text-sm sm:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {{ selectedDate.solarFullText }}
          </p>
        </div>
      </div>

      <!-- Special Celebratory Holiday UI Decorations -->
      <!-- 1. Jan-01: International New Year Celebration Decor -->
      <div
        v-if="isJan01"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-rose-500/25 p-4 shadow-lg shadow-amber-500/15 dark:border-amber-400/50 dark:from-amber-950/50 dark:via-yellow-950/40 dark:to-rose-950/50 animate-gradient"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl border border-amber-400/50 shadow-inner"
          >
            🎆
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300"
              >
                ឆ្លងឆ្នាំសកល • Happy New Year
              </span>
              <span
                class="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-200"
              >
                {{ selectedDate.gregorian.year }}
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              រីករាយទិវាចូលឆ្នាំសកល {{ toKhmerNumber(selectedDate.gregorian.year) }}! 🎉
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              សូមជូនពរឆ្នាំថ្មីពោរពេញដោយសុខភាពល្អ សុភមង្គល និងជោគជ័យគ្រប់ភារកិច្ច!
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Chinese New Year Celebration Decor -->
      <div
        v-else-if="isCNY"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-red-500/60 bg-gradient-to-r from-red-600/25 via-amber-500/20 to-red-600/25 p-4 shadow-lg shadow-red-500/15 dark:border-red-500/50 dark:from-red-950/50 dark:via-amber-950/40 dark:to-red-950/50 animate-gradient"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 text-2xl border border-red-400/50 shadow-inner"
          >
            🧧
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300"
              >
                ពិធីបុណ្យចូលឆ្នាំចិន • Chinese New Year
              </span>
              <span
                class="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:text-red-200"
              >
                恭喜发财
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              រីករាយពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីចិន! 🏮
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              ហេង ហេង សំណាងល្អ សិរីសួស្តី វិបុលសុខ និងសម្បូរសប្បាយពេញមួយឆ្នាំ!
            </p>
          </div>
        </div>
      </div>

      <!-- 3. Valentine's Day Celebration Decor (Feb 14) -->
      <div
        v-else-if="isValentines"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-pink-400/60 bg-gradient-to-r from-pink-500/25 via-rose-500/20 to-pink-500/25 p-4 shadow-lg shadow-pink-500/15 dark:border-pink-400/50 dark:from-pink-950/50 dark:via-rose-950/40 dark:to-pink-950/50 animate-gradient"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-500/20 text-2xl border border-pink-400/50 shadow-inner"
          >
            💖
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300"
              >
                ទិវានៃក្ដីស្រឡាញ់ • Valentine's Day
              </span>
              <span
                class="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-800 dark:text-pink-200"
              >
                ១៤ កុម្ភៈ
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              រីករាយទិវានៃក្ដីស្រឡាញ់! 💕🌹
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              អបអរសាទរក្ដីស្រឡាញ់ មិត្តភាពដ៏បរិសុទ្ធ និងការចែករំលែកសេចក្ដីល្អចំពោះមនុស្សជាទីស្រឡាញ់
              និងមាតាបិតា!
            </p>
          </div>
        </div>
      </div>

      <!-- 4. Halloween Celebration Decor (Oct 31) -->
      <div
        v-else-if="isHalloween"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-orange-500/60 bg-gradient-to-r from-orange-500/25 via-purple-600/25 to-orange-500/25 p-4 shadow-lg shadow-orange-500/15 dark:border-orange-500/50 dark:from-orange-950/50 dark:via-purple-950/50 dark:to-orange-950/50 animate-gradient"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl border border-orange-400/50 shadow-inner"
          >
            🎃
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300"
              >
                ពិធីបុណ្យហាឡូវីន • Halloween
              </span>
              <span
                class="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-800 dark:text-orange-200"
              >
                Trick or Treat
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              រីករាយរាត្រីបុណ្យហាឡូវីន! 🦇👻
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              រាត្រីនៃការកម្សាន្ត ការតុបតែងលម្អម៉ូដប្លែកៗ ពាក់ម៉ាស់កំប្លែង និងការចែករំលែកស្ករគ្រាប់!
            </p>
          </div>
        </div>
      </div>

      <!-- 5. Khmer New Year Celebration Decor (Moha Songkran / Choul Chnam Thmey) -->
      <div
        v-else-if="isKhmerNewYear"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-amber-400/70 bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-orange-500/25 p-4 shadow-lg shadow-amber-500/20 dark:border-amber-400/55 dark:from-amber-950/60 dark:via-yellow-950/45 dark:to-orange-950/55 animate-gradient"
      >
        <!-- Decorative Rumduol & Star Lantern Accents -->
        <img
          :src="knyStarLanternAsset"
          alt=""
          class="pointer-events-none select-none absolute -right-1 -top-1 h-12 w-12 opacity-30 anim-kny-lantern-sway"
        />
        <div class="relative z-10 flex items-center gap-3">
          <div
            class="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 p-1.5 border border-amber-400/60 shadow-inner"
          >
            <img
              :src="knyRumduolAsset"
              alt="ផ្ការំដួល"
              class="h-full w-full object-contain anim-kny-rumduol-bloom"
            />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300"
              >
                ចូលឆ្នាំថ្មីប្រពៃណីជាតិ • Khmer New Year
              </span>
              <span
                v-if="selectedYearSongkranTime"
                class="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200 border border-amber-400/40"
              >
                មហាសង្ក្រាន្ត {{ selectedYearSongkranTime }}
              </span>
            </div>
            <h4 class="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              សួស្តីឆ្នាំថ្មី ឆ្នាំ{{ selectedDate.khmer.animalYearName }}
              {{ selectedDate.khmer.sakName }}!
            </h4>
            <p class="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
              សូមទេវតាឆ្នាំថ្មីប្រទានពរជ័យ សិរីមង្គល វិបុលសុខ មហាប្រសើរ និងជោគជ័យគ្រប់ប្រការ!
            </p>
          </div>
        </div>
      </div>

      <!-- 6. Christmas Celebration Decor (Dec 24 / 25) -->
      <div
        v-else-if="isChristmas"
        class="mt-3.5 relative overflow-hidden rounded-2xl border border-emerald-500/60 bg-gradient-to-r from-emerald-600/25 via-red-500/25 to-emerald-600/25 p-4 shadow-lg shadow-emerald-500/15 dark:border-emerald-500/50 dark:from-emerald-950/50 dark:via-red-950/50 dark:to-emerald-950/50 animate-gradient"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl border border-emerald-400/50 shadow-inner"
          >
            🎄
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300"
              >
                បុណ្យណូអែល • Christmas Celebration
              </span>
              <span
                class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-200"
              >
                Merry Christmas
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white">
              រីករាយពិធីបុណ្យគ្រីស្ទម៉ាស់! 🎅🎁❄️
            </h4>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              សូមឱ្យពិធីបុណ្យណូអែលនាំមកនូវសន្តិភាព សេចក្តីស្រឡាញ់ ភាពកក់ក្តៅ
              និងស្នាមញញឹមដល់គ្រប់ក្រុមគ្រួសារ!
            </p>
          </div>
        </div>
      </div>

      <!-- Holiday Banner (if holiday exists) -->
      <div
        v-if="selectedDate.holiday"
        class="mt-4 overflow-hidden rounded-2xl sm:rounded-3xl border shadow-md transition-all"
        :class="
          selectedDate.holiday.isOffDay
            ? 'border-red-500/30 bg-red-500/5 dark:border-red-500/40 dark:bg-red-950/20'
            : 'border-blue-500/30 bg-blue-500/5 dark:border-blue-500/40 dark:bg-blue-950/20'
        "
      >
        <!-- Rich Banner Image -->
        <div
          v-if="selectedDate.holiday.imageUrl"
          class="relative h-32 sm:h-44 w-full overflow-hidden"
        >
          <img
            :src="selectedDate.holiday.imageUrl"
            :alt="selectedDate.holiday.titleKh"
            class="h-full w-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          <!-- Contrast scrim overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-black/25"
          ></div>

          <!-- Official Holiday / Observance Badge on Image -->
          <div class="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
            <span
              class="rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md"
              :class="selectedDate.holiday.isOffDay ? 'bg-red-600/90' : 'bg-blue-600/90'"
            >
              {{ selectedDate.holiday.isOffDay ? 'ឈប់សម្រាកផ្លូវការ' : 'ពិធីប្រពៃណី / ទិវាជាតិ' }}
            </span>
          </div>

          <!-- Bottom Title overlay on Image -->
          <div
            class="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 text-white"
          >
            <h3 class="text-base sm:text-xl font-bold leading-tight drop-shadow-md">
              {{ selectedDate.holiday.titleKh }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-xs mt-0.5">
              {{ selectedDate.holiday.titleEn }}
            </p>
          </div>
        </div>

        <!-- Description & Details -->
        <div class="p-3.5 sm:p-4">
          <!-- Fallback header if image doesn't load -->
          <div
            v-if="!selectedDate.holiday.imageUrl"
            class="flex items-center justify-between gap-2 mb-2"
          >
            <div>
              <h3
                class="text-sm sm:text-base font-bold leading-tight text-slate-900 dark:text-white"
              >
                {{ selectedDate.holiday.titleKh }}
              </h3>
              <p class="text-xs opacity-75 font-medium">
                {{ selectedDate.holiday.titleEn }}
              </p>
            </div>
            <span
              class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              :class="selectedDate.holiday.isOffDay ? 'bg-red-600' : 'bg-blue-600'"
            >
              {{ selectedDate.holiday.isOffDay ? 'ឈប់សម្រាកផ្លូវការ' : 'ពិធីប្រពៃណី/ទិវាជាតិ' }}
            </span>
          </div>

          <p class="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {{ selectedDate.holiday.descriptionKh }}
          </p>
        </div>
      </div>

      <!-- Holy Day Banner (ថ្ងៃសីល) -->
      <div
        v-if="selectedDate.isHolyDay"
        class="mt-3 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/15 p-3 sm:p-3.5 text-amber-900 dark:text-amber-200"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 p-1.5 shadow-xs"
          >
            <img src="/icons/holy_day.png" alt="ថ្ងៃសីល" class="h-full w-full object-contain" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ selectedDate.holyDayLabel }}
            </h4>
            <p class="text-xs text-amber-700 dark:text-amber-300 font-medium">
              ថ្ងៃសីលឧបោសថ គួរធ្វើបុណ្យទាន រក្សាសីល និងចម្រើនមេត្តាភាវនា
            </p>
          </div>
        </div>

        <span
          class="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1"
        >
          <img src="/icons/holy_day.png" alt="" class="h-3.5 w-3.5 object-contain" />
          <span>ថ្ងៃសីល</span>
        </span>
      </div>

      <!-- Zodiac Animal of the Year Highlight Showcase -->
      <div
        v-if="selectedZodiac"
        class="mt-4 relative overflow-hidden rounded-2xl border border-amber-400/45 bg-gradient-to-br p-3.5 shadow-sm dark:border-amber-500/35"
        :class="selectedZodiac.accentGradient"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400/75 bg-slate-950 shadow-md shadow-amber-500/20"
          >
            <img
              :src="selectedZodiac.imageUrl"
              :alt="`ឆ្នាំ${selectedZodiac.nameKh}`"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300"
              >
                ឆ្នាំសត្វប្រចាំកាលបរិច្ឆេទនេះ • Khmer Zodiac
              </span>
              <span
                class="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                :class="selectedZodiac.badgeClasses"
              >
                {{ selectedZodiac.elementKh }} • {{ selectedZodiac.elementEn }}
              </span>
            </div>

            <h4 class="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              ឆ្នាំ{{ selectedDate.khmer.animalYearName }} {{ selectedDate.khmer.sakName }}
              {{ selectedDate.khmer.animalYearEmoji }}
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                (Year of the {{ selectedZodiac.nameEn }})
              </span>
            </h4>

            <p class="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ selectedZodiac.traitKh }}
            </p>
          </div>
        </div>
      </div>

      <!-- Detailed Metrics Grid -->
      <div
        class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-slate-800 dark:text-slate-200"
      >
        <!-- 1. Day of Week -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5"> ថ្ងៃនៃសប្តាហ៍ </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {{ selectedDate.khmer.dayOfWeekName }}
          </span>
        </div>

        <!-- 2. Moon Phase & Count -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5">
            ដំណាក់ព្រះចន្ទ
          </span>
          <div class="flex items-center gap-1.5">
            <span
              class="text-sm sm:text-base font-bold"
              :class="
                selectedDate.khmer.moonPhase === 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              "
            >
              {{ toKhmerNumber(selectedDate.khmer.day) }}{{ selectedDate.khmer.moonPhaseName }}
            </span>
            <span class="text-xs text-slate-400">
              ({{ selectedDate.khmer.moonPhase === 0 ? 'ខ្នើត' : 'រនោច' }})
            </span>
          </div>
        </div>

        <!-- 3. Lunar Month -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5"> ខែចន្ទគតិ </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ខែ{{ selectedDate.khmer.monthName }}
          </span>
        </div>

        <!-- 4. Animal Year (ឆ្នាំសត្វ) -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5">
            ឆ្នាំសត្វ & ស័ក
          </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ឆ្នាំ{{ selectedDate.khmer.animalYearName }} {{ selectedDate.khmer.sakName }}
            {{ selectedDate.khmer.animalYearEmoji }}
          </span>
        </div>

        <!-- 5. Buddhist Era (ពុទ្ធសករាជ) -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5">
            ពុទ្ធសករាជ (BE)
          </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ព.ស. {{ selectedDate.khmer.beYearKhmerNum }}
          </span>
        </div>

        <!-- 6. Jolak Sakaraj (ចុល្លសករាជ) -->
        <div
          class="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <span class="text-[11px] font-semibold text-slate-400 block mb-0.5">
            ចុល្លសករាជ (JS)
          </span>
          <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            ច.ស. {{ selectedDate.khmer.jsYearKhmerNum }}
          </span>
        </div>
      </div>

      <!-- Solar Date Conversion Footer -->
      <div
        class="mt-4 flex items-center justify-between rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300"
      >
        <span class="flex items-center gap-1.5 font-medium">
          <Calendar class="h-3.5 w-3.5 text-amber-500" />
          <span
            >សុរិយគតិ: ថ្ងៃទី{{ selectedDate.khmer.solarDayKhmerNum }} ខែ{{
              selectedDate.khmer.solarMonthName
            }}
            ឆ្នាំ{{ selectedDate.khmer.solarYearKhmerNum }}</span
          >
        </span>
        <span class="font-mono text-slate-400">
          {{ selectedDate.gregorian.isoDateString }}
        </span>
      </div>
    </div>
  </div>
</template>
