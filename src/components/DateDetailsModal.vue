<script setup lang="ts">
import { ref } from 'vue'
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

const { selectedDate, closeModal, selectPrevDay, selectNextDay } = useCalendarState()

const isCopied = ref(false)

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
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
  >
    <!-- Backdrop overlay -->
    <div
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      @click="closeModal"
    ></div>

    <!-- Modal Content: Bottom Sheet on Mobile, Centered Dialog on Desktop -->
    <div
      class="relative z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200 transition-colors"
    >
      <!-- Mobile Pull Bar Indicator -->
      <div class="sm:hidden flex justify-center mb-2">
        <div class="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
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

        <!-- The exact requested string with ត្រូវនឹង... on next line -->
        <div class="relative z-10 mt-2 space-y-1 select-all">
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
