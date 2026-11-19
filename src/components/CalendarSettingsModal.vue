<script setup lang="ts">
import type { Component } from 'vue'
import {
  X,
  Settings,
  Sun,
  Moon,
  Monitor,
  Type,
  Calendar,
  Layers,
  Eye,
  CloudRain,
  Sparkles,
  Snowflake,
  Heart,
  Gift,
  FlaskConical,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import {
  useCalendarSettings,
  type AppTheme,
  type FontSizeScale,
  type FontFamilyOption,
} from '@/composables/useCalendarSettings'
import { useVisitorCount } from '@/composables/useVisitorCount'

const { isSettingsOpen } = useCalendarState()
const { visitorCount } = useVisitorCount()
const {
  theme,
  setTheme,
  startOfWeek,
  setStartOfWeek,
  showWeekNumbers,
  toggleWeekNumbers,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  enableSeasonsAnim,
  toggleSeasonsAnim,
  previewCountdown,
  togglePreviewCountdown,
  previewDecember,
  togglePreviewDecember,
  previewValentine,
  togglePreviewValentine,
  previewCNY,
  togglePreviewCNY,
} = useCalendarSettings()

const themeOptions: { id: AppTheme; labelKh: string; labelEn: string; icon: Component }[] = [
  { id: 'light', labelKh: 'ពន្លឺ', labelEn: 'Light', icon: Sun },
  { id: 'dark', labelKh: 'ងងឹត', labelEn: 'Dark', icon: Moon },
  { id: 'system', labelKh: 'តាមប្រព័ន្ធ', labelEn: 'System', icon: Monitor },
]

const startDayOptions = [
  { id: 0, labelKh: 'ថ្ងៃអាទិត្យ', labelEn: 'Sunday' },
  { id: 1, labelKh: 'ថ្ងៃចន្ទ', labelEn: 'Monday' },
  { id: 6, labelKh: 'ថ្ងៃសៅរ៍', labelEn: 'Saturday' },
]

const fontSizeOptions: { id: FontSizeScale; labelKh: string; scale: string }[] = [
  { id: 'sm', labelKh: 'តូច (Small)', scale: '14px' },
  { id: 'md', labelKh: 'មធ្យម (Normal)', scale: '16px' },
  { id: 'lg', labelKh: 'ធំ (Large)', scale: '18px' },
  { id: 'xl', labelKh: 'ធំខ្លាំង (Extra Large)', scale: '20px' },
]

const fontFamilyOptions: {
  id: FontFamilyOption
  nameKh: string
  nameEn: string
  fontClass: string
}[] = [
  {
    id: 'google-sans',
    nameKh: 'Google Sans & Kantumruy Pro',
    nameEn: 'Default (លំនាំដើម)',
    fontClass: 'font-preview-google-sans',
  },
  {
    id: 'kantumruy',
    nameKh: 'Kantumruy Pro',
    nameEn: 'កន្ត្រុំរុយ ប្រូ',
    fontClass: 'font-preview-kantumruy',
  },
  {
    id: 'siemreap',
    nameKh: 'Khmer OS Siemreap',
    nameEn: 'សៀមរាប',
    fontClass: 'font-preview-siemreap',
  },
  { id: 'moul', nameKh: 'Moul Light', nameEn: 'មូល ឡាយថ៍', fontClass: 'font-preview-moul' },
]
</script>

<template>
  <div v-if="isSettingsOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
    <!-- Backdrop overlay -->
    <div
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      @click="isSettingsOpen = false"
    ></div>

    <!-- Settings Dialog -->
    <div
      class="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"
          >
            <Settings class="h-4 w-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              ការកំណត់ប្រតិទិន
            </h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Customize theme, start day, fonts & week numbers
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="isSettingsOpen = false"
          class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-4 space-y-5">
        <!-- 1. Theme Option (Light / Dark / Follow System) -->
        <div>
          <label
            class="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2"
          >
            <Sun class="h-4 w-4 text-amber-500" />
            <span>ស្បែកពណ៌ (Theme)</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in themeOptions"
              :key="opt.id"
              type="button"
              @click="setTheme(opt.id)"
              class="flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-2.5 sm:p-3 text-center transition-all"
              :class="
                theme === opt.id
                  ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              "
            >
              <component :is="opt.icon" class="h-5 w-5" />
              <div>
                <p class="text-xs font-bold leading-tight">{{ opt.labelKh }}</p>
                <p class="text-[10px] opacity-75 font-normal">{{ opt.labelEn }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 2. Start of the week day customization -->
        <div>
          <label
            class="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2"
          >
            <Calendar class="h-4 w-4 text-blue-500" />
            <span>ថ្ងៃចាប់ផ្តើមសប្តាហ៍ (Start of the week)</span>
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="opt in startDayOptions"
              :key="opt.id"
              type="button"
              @click="setStartOfWeek(opt.id)"
              class="rounded-2xl border p-2.5 text-center transition-all"
              :class="
                startOfWeek === opt.id
                  ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              "
            >
              <p class="text-xs font-bold leading-tight">{{ opt.labelKh }}</p>
              <p class="text-[10px] opacity-75 font-normal">{{ opt.labelEn }}</p>
            </button>
          </div>
        </div>

        <!-- 3. Show / Hide Week Number -->
        <div
          class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400"
            >
              <Layers class="h-4 w-4" />
            </div>
            <div>
              <p class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                បង្ហាញលេខសប្តាហ៍ (Show Week Numbers)
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                បង្ហាញលេខរៀងសប្តាហ៍ (W1 - W52) លើប្រតិទិន
              </p>
            </div>
          </div>

          <!-- Switch Toggle -->
          <button
            type="button"
            @click="toggleWeekNumbers"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="showWeekNumbers ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="showWeekNumbers ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- 4. Font Family Selector -->
        <div>
          <label
            class="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2"
          >
            <Type class="h-4 w-4 text-purple-500" />
            <span>ពុម្ពអក្សរ (Font Family)</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in fontFamilyOptions"
              :key="opt.id"
              type="button"
              @click="setFontFamily(opt.id)"
              class="flex flex-col items-start justify-center rounded-2xl border p-2.5 sm:p-3 text-left transition-all"
              :class="[
                fontFamily === opt.id
                  ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800',
                opt.fontClass,
              ]"
            >
              <span class="text-xs sm:text-sm font-bold leading-tight">{{ opt.nameKh }}</span>
              <span class="text-[10px] opacity-75 font-normal mt-0.5">{{ opt.nameEn }}</span>
            </button>
          </div>
        </div>

        <!-- 5. Font Size Customizations -->
        <div>
          <label
            class="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2"
          >
            <Type class="h-4 w-4 text-emerald-500" />
            <span>ទំហំអក្សរទូទៅ (Font Size)</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="opt in fontSizeOptions"
              :key="opt.id"
              type="button"
              @click="setFontSize(opt.id)"
              class="rounded-2xl border p-2.5 text-center transition-all"
              :class="
                fontSize === opt.id
                  ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              "
            >
              <p class="text-xs font-bold leading-tight">{{ opt.labelKh }}</p>
              <p class="text-[10px] opacity-75 font-normal">{{ opt.scale }}</p>
            </button>
          </div>

          <!-- Live Font Preview -->
          <div
            class="mt-2.5 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/30"
          >
            <p class="text-slate-700 dark:text-slate-200 font-bold">គំរូអក្សរដែលបានជ្រើសរើស</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ថ្ងៃពុធ ៩កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០
            </p>
          </div>
        </div>

        <!-- 6. Cambodia Seasons Animation Toggle (Rainy & Dry) -->
        <div
          class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
            >
              <CloudRain class="h-4 w-4" />
            </div>
            <div>
              <p class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                ចលនារដូវកាលកម្ពុជា (Cambodia Seasons Animation)
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                បង្ហាញចលនាភ្លៀងធ្លាក់ក្នុងរដូវវស្សា (ឧសភា-តុលា) និងពន្លឺថ្ងៃរំហើយក្នុងរដូវប្រាំង
                (វិច្ឆិកា-មេសា)
              </p>
            </div>
          </div>

          <!-- Switch Toggle -->
          <button
            type="button"
            @click="toggleSeasonsAnim"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="enableSeasonsAnim ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="enableSeasonsAnim ? 'translate-x-5' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- 7. Festive & Demo Previews (LocalStorage Keys) -->
        <div
          class="rounded-2xl border border-amber-300/60 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-3.5 space-y-3"
        >
          <div
            class="flex items-center gap-2 pb-2 border-b border-amber-200/60 dark:border-amber-500/20"
          >
            <FlaskConical class="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              សាកល្បងមុខងារបុណ្យទាន (Demo Festive Previews)
            </p>
          </div>

          <!-- Preview 1: New Year Countdown (1 Week) -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Sparkles class="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  រាប់ថយក្រោយឆ្លងឆ្នាំ (New Year Countdown 1 Week)
                </p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  khmer_calendar_preview_countdown
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="togglePreviewCountdown"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="previewCountdown ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="previewCountdown ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <!-- Preview 2: December Snow, Snowman & Trees -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Snowflake class="h-4 w-4 text-sky-500 shrink-0" />
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ធ្លាក់ព្រិល មនុស្សព្រិល & ដើមណូអែល (December Snow & Decor)
                </p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  khmer_calendar_preview_december
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="togglePreviewDecember"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="previewDecember ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="previewDecember ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <!-- Preview 3: Valentine Falling Hearts -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Heart class="h-4 w-4 text-rose-500 shrink-0" />
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ធ្លាក់បេះដូង ថ្ងៃនៃក្តីស្រលាញ់ (Valentine Falling Hearts)
                </p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  khmer_calendar_preview_valentine
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="togglePreviewValentine"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="previewValentine ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="previewValentine ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>

          <!-- Preview 4: CNY Falling Red Envelopes -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Gift class="h-4 w-4 text-red-500 shrink-0" />
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ធ្លាក់អាំងប៉ាវ ចូលឆ្នាំចិន (CNY Falling Red Envelopes)
                </p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  khmer_calendar_preview_cny
                </p>
              </div>
            </div>
            <button
              type="button"
              @click="togglePreviewCNY"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="previewCNY ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'"
            >
              <span
                class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="previewCNY ? 'translate-x-4' : 'translate-x-0'"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Button -->
      <button
        type="button"
        @click="isSettingsOpen = false"
        class="mt-6 w-full rounded-2xl bg-amber-500 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
      >
        រក្សាទុក
      </button>

      <!-- Attribution & Visitor Counter -->
      <div
        class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500"
      >
        <div
          v-if="visitorCount !== null"
          class="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 font-medium text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
        >
          <Eye class="h-3.5 w-3.5 text-amber-500" />
          <span>អ្នកប្រើប្រាស់:</span>
          <span class="font-bold text-slate-800 dark:text-slate-100 font-mono">{{
            visitorCount.toLocaleString()
          }}</span>
        </div>
        <p>
          Made by <span class="font-bold text-slate-700 dark:text-slate-300">Le Boritheareach</span>
        </p>
      </div>
    </div>
  </div>
</template>
