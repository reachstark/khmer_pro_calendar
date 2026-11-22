<script setup lang="ts">
import { computed, ref } from 'vue'
import { Sparkles, Calendar, X, ArrowRight, Star } from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import {
  KHMER_ZODIAC_LIST,
  getViewedYearZodiacSummary,
  type KhmerZodiacInfo,
} from '@/utils/khmerZodiac'

const { currentYear, currentMonth, goToDate } = useCalendarState()

const isZodiacModalOpen = ref(false)
const inspectedZodiac = ref<KhmerZodiacInfo | null>(null)

const yearSummary = computed(() =>
  getViewedYearZodiacSummary(currentYear.value, currentMonth.value),
)

const activeModalZodiac = computed(() => inspectedZodiac.value ?? yearSummary.value.zodiac)

function openZodiacExplorer() {
  inspectedZodiac.value = yearSummary.value.zodiac
  isZodiacModalOpen.value = true
}

function jumpToKhmerNewYear() {
  isZodiacModalOpen.value = false
  goToDate(currentYear.value, 3, yearSummary.value.knyStartDay)
}
</script>

<template>
  <!-- Main Screen Zodiac Animal of the Year Highlight Card -->
  <div
    class="group relative overflow-hidden rounded-3xl border border-amber-400/45 bg-gradient-to-br p-4 sm:p-5 shadow-lg shadow-amber-500/10 dark:border-amber-400/35 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/15"
    :class="yearSummary.zodiac.accentGradient"
  >
    <!-- Subtle Khmer Royal Gold Radial Glow -->
    <div
      class="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-500/15"
    ></div>
    <div
      class="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-indigo-500/15 blur-2xl"
    ></div>

    <!-- Header Strip -->
    <div class="relative z-10 flex items-center justify-between gap-2 mb-3">
      <span
        class="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300"
      >
        <Sparkles class="h-3.5 w-3.5 text-amber-500" />
        <span>ឆ្នាំសត្វប្រចាំឆ្នាំ • Zodiac Year</span>
      </span>
      <span
        class="rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm"
        :class="yearSummary.zodiac.badgeClasses"
      >
        ព.ស. {{ yearSummary.beYearKh }}
      </span>
    </div>

    <!-- Main Visual + Details Row -->
    <div class="relative z-10 flex items-center gap-3.5 sm:gap-4">
      <!-- Generated Khmer Royal Zodiac Medallion -->
      <button
        type="button"
        @click="openZodiacExplorer"
        class="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-slate-900 shadow-lg shadow-amber-500/25 ring-2 ring-amber-300/25 transition-transform duration-300 group-hover:scale-[1.03] active:scale-95 focus:outline-none"
        :title="`ឆ្នាំ${yearSummary.zodiac.nameKh} (${yearSummary.zodiac.nameEn})`"
      >
        <img
          :src="yearSummary.zodiac.imageUrl"
          :alt="`ឆ្នាំ${yearSummary.zodiac.nameKh} - Year of the ${yearSummary.zodiac.nameEn}`"
          class="h-full w-full object-cover anim-zodiac-float"
          loading="eager"
        />
      </button>

      <!-- Zodiac Identity & Blessings -->
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3
            class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight"
          >
            ឆ្នាំ{{ yearSummary.zodiac.nameKh }} {{ yearSummary.zodiac.emoji }}
          </h3>
          <span class="text-xs font-bold text-amber-700 dark:text-amber-300">
            {{ yearSummary.sakName }}
          </span>
        </div>

        <p class="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
          Year of the {{ yearSummary.zodiac.nameEn }} • {{ yearSummary.zodiac.elementKh }}
        </p>

        <p
          class="text-[11px] text-slate-600 dark:text-slate-300/90 mt-1.5 line-clamp-2 leading-relaxed"
        >
          {{ yearSummary.zodiac.traitKh }}
        </p>
      </div>
    </div>

    <!-- Bottom Action Row: KNY Date Shortcut & 12-Zodiac Modal Trigger -->
    <div
      class="relative z-10 mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-amber-500/20 pt-2.5 text-[11px]"
    >
      <button
        type="button"
        @click="jumpToKhmerNewYear"
        class="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-2.5 py-1 font-bold text-amber-900 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-200 dark:hover:bg-amber-500/30 border border-amber-400/35 transition-all active:scale-95"
      >
        <Calendar class="h-3 w-3 text-amber-600 dark:text-amber-400" />
        <span>ចូលឆ្នាំខ្មែរ: {{ yearSummary.knyDateRangeKh }}</span>
      </button>

      <button
        type="button"
        @click="openZodiacExplorer"
        class="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200 hover:underline transition-colors"
      >
        <span>មើលឆ្នាំសត្វទាំង ១២</span>
        <ArrowRight class="h-3 w-3" />
      </button>
    </div>
  </div>

  <!-- 12 Khmer Zodiac Animals Explorer Modal -->
  <Teleport to="body">
    <div
      v-if="isZodiacModalOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 safe-px"
    >
      <div
        class="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        @click="isZodiacModalOpen = false"
      ></div>

      <div
        class="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-amber-400/35 bg-white p-4 sm:p-6 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:pb-6 shadow-2xl dark:border-amber-500/30 dark:bg-slate-900 modal-fade-enter-active"
      >
        <!-- Drag bar on mobile -->
        <div class="sm:hidden flex justify-center mb-3">
          <div class="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        <!-- Modal Header -->
        <div
          class="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800"
        >
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"
            >
              <Star class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                ឆ្នាំសត្វខ្មែរទាំង ១២ • Khmer Zodiac
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                ឆ្នាំ {{ yearSummary.gregorianYearKh }} • ព.ស. {{ yearSummary.beYearKh }} •
                {{ yearSummary.sakName }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="isZodiacModalOpen = false"
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            title="បិទ (Close)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Featured Selected Zodiac Spotlight -->
        <div
          class="mt-4 relative overflow-hidden rounded-2xl border border-amber-400/50 bg-gradient-to-br p-4 shadow-md"
          :class="activeModalZodiac.accentGradient"
        >
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div
              class="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-slate-950 shadow-xl shadow-amber-500/25"
            >
              <img
                :src="activeModalZodiac.imageUrl"
                :alt="`ឆ្នាំ${activeModalZodiac.nameKh}`"
                class="h-full w-full object-cover"
              />
            </div>

            <div class="text-center sm:text-left flex-1">
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span
                  v-if="activeModalZodiac.index === yearSummary.zodiac.index"
                  class="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs"
                >
                  ឆ្នាំសត្វបច្ចុប្បន្ន ({{ yearSummary.gregorianYear }})
                </span>
                <span
                  class="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                  :class="activeModalZodiac.badgeClasses"
                >
                  {{ activeModalZodiac.elementKh }} • {{ activeModalZodiac.elementEn }}
                </span>
              </div>

              <h4 class="mt-1.5 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                ឆ្នាំ{{ activeModalZodiac.nameKh }} {{ activeModalZodiac.emoji }}
                <span class="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  ({{ activeModalZodiac.nameEn }})
                </span>
              </h4>

              <p class="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {{ activeModalZodiac.traitKh }}
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                {{ activeModalZodiac.traitEn }}
              </p>
              <p class="mt-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                ✨ {{ activeModalZodiac.blessingKh }}
              </p>
            </div>
          </div>
        </div>

        <!-- Moha Songkran Info Strip for Current Viewed Year -->
        <div
          class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-500/10 border border-amber-400/30 px-3.5 py-2.5 text-xs"
        >
          <div>
            <span class="font-bold text-amber-900 dark:text-amber-200">
              មហាសង្ក្រាន្ត {{ yearSummary.gregorianYearKh }}:
            </span>
            <span class="ml-1 text-slate-700 dark:text-slate-200 font-semibold">
              {{ yearSummary.knyDateRangeKh }} (ម៉ោង {{ yearSummary.knyTimeKh }})
            </span>
          </div>
          <button
            type="button"
            @click="jumpToKhmerNewYear"
            class="rounded-xl bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600 active:scale-95 transition-all"
          >
            ទៅកាន់ថ្ងៃចូលឆ្នាំ →
          </button>
        </div>

        <!-- 12 Zodiac Animals Interactive Grid -->
        <div class="mt-4">
          <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            ជ្រើសរើសឆ្នាំសត្វដើម្បីមើលព័ត៌មានលម្អិត (Select any of the 12 Zodiac Animals):
          </p>
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
            <button
              v-for="item in KHMER_ZODIAC_LIST"
              :key="item.index"
              type="button"
              @click="inspectedZodiac = item"
              class="flex flex-col items-center rounded-2xl border p-1.5 transition-all active:scale-95"
              :class="
                activeModalZodiac.index === item.index
                  ? 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-400/50 shadow-sm'
                  : item.index === yearSummary.zodiac.index
                    ? 'border-amber-400/60 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800'
              "
            >
              <img
                :src="item.imageUrl"
                :alt="item.nameKh"
                class="h-10 w-10 rounded-xl object-cover bg-slate-900"
                loading="lazy"
              />
              <span
                class="mt-1 text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight"
              >
                {{ item.nameKh }}
              </span>
              <span class="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                {{ item.nameEn }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
