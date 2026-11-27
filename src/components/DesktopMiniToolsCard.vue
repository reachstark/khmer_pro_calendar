<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Component } from 'vue'
import {
  Wrench,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Languages,
  CalendarRange,
  Cake,
  Hash,
  Copy,
  Check,
  X,
  ArrowLeftRight,
  Calendar,
} from 'lucide-vue-next'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { useCalendarState } from '@/composables/useCalendarState'
import { toKhmerNumber } from '@/utils/khmerCalendar'
import {
  numberToText,
  hasDecimalPartDetected,
  type NumberLocale,
  type EnglishCapitalization,
} from '@/utils/numberToText'
import {
  calculateDateSpan,
  calculateAgeAndKhmerBirth,
  convertKhmerEras,
  toArabicNumber,
  formatIsoDate,
  type KhmerEraType,
} from '@/utils/miniTools'

type ToolId = 'all' | 'number-to-text' | 'date-span' | 'age-lookup' | 'era-numerals'

const { enableMiniTools } = useCalendarSettings()
const { isSearchOpen, isSettingsOpen, selectedDate, goToDate } = useCalendarState()

const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false)
const isExpanded = ref(false)
const activeTool = ref<ToolId>('all')
const lastUsedTool = ref<Exclude<ToolId, 'all'> | null>(null)
const copiedKey = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

const secondaryTools: {
  id: Exclude<ToolId, 'all' | 'number-to-text'>
  titleKh: string
  titleEn: string
  descKh: string
  icon: Component
}[] = [
  {
    id: 'date-span',
    titleKh: 'គណនាគម្លាតថ្ងៃ និងថ្ងៃធ្វើការ',
    titleEn: 'Date Difference & Workdays',
    descKh: 'រាប់ចំនួនថ្ងៃសរុប ថ្ងៃធ្វើការ និងថ្ងៃបុណ្យឈប់សម្រាក',
    icon: CalendarRange,
  },
  {
    id: 'age-lookup',
    titleKh: 'គណនាអាយុ និងថ្ងៃកំណើតខ្មែរ',
    titleEn: 'Age & Khmer Lunar Birth',
    descKh: 'មើលអាយុពិតប្រាកដ ថ្ងៃចន្ទគតិ និងឆ្នាំសត្វខ្មែរ',
    icon: Cake,
  },
  {
    id: 'era-numerals',
    titleKh: 'បំប្លែងសករាជ និងតួលេខខ្មែរ',
    titleEn: 'Era & Khmer Numerals',
    descKh: 'បំប្លែង ព.ស. / គ.ស. / ច.ស. / ម.ស. និងលេខ ០-៩',
    icon: Hash,
  },
]

const quickTabs: { id: Exclude<ToolId, 'all'>; shortKh: string; icon: Component }[] = [
  { id: 'number-to-text', shortKh: 'លេខជាអក្សរ', icon: Languages },
  { id: 'date-span', shortKh: 'គម្លាតថ្ងៃ', icon: CalendarRange },
  { id: 'age-lookup', shortKh: 'អាយុ', icon: Cake },
  { id: 'era-numerals', shortKh: 'សករាជ', icon: Hash },
]

function openTool(id: Exclude<ToolId, 'all'>) {
  activeTool.value = id
  lastUsedTool.value = id
  isExpanded.value = true
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function copyText(text: string, key: string) {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    copiedKey.value = key
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copiedKey.value = null
    }, 2000)
  })
}

const collapsedSubtitle = computed(() => {
  if (!lastUsedTool.value) return '៤ មុខងារ • ចុចដើម្បីបើកប្រើ'
  const found = quickTabs.find((t) => t.id === lastUsedTool.value)
  return found ? `កំពុងប្រើ: ${found.shortKh}` : '៤ មុខងារ • ចុចដើម្បីបើកប្រើ'
})

// ============================================================================
// Tool 1: Number to Text State
// ============================================================================
const numInput = ref('')
const numLocale = ref<NumberLocale>('km')
const numUseRiel = ref(false)
const numCapitalization = ref<EnglishCapitalization>('capitalizeEach')

const numberSamplePresets = [
  { label: '១៥,០០០', value: '១៥,០០០' },
  { label: '1,250,000', value: '1,250,000' },
  { label: '2026', value: '2026' },
  { label: '1,050.25', value: '1,050.25' },
]

const capOptions: { id: EnglishCapitalization; label: string }[] = [
  { id: 'capitalizeEach', label: 'Title Case' },
  { id: 'none', label: 'lowercase' },
  { id: 'uppercase', label: 'UPPERCASE' },
]

const livePreviewExample = computed(() => numberToText('12,500', { locale: 'km', useRiel: true }))

const convertedNumberText = computed(() =>
  numberToText(numInput.value, {
    locale: numLocale.value,
    useRiel: numUseRiel.value,
    capitalization: numCapitalization.value,
  }),
)

const showKhmerDecimalHint = computed(
  () => numLocale.value === 'km' && hasDecimalPartDetected(numInput.value),
)

// ============================================================================
// Tool 2: Date Difference & Workdays State
// ============================================================================
const now = new Date()
const spanStart = ref(formatIsoDate(now))
const spanEnd = ref(formatIsoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)))
const includeEndDate = ref(true)

const dateSpanOutcome = computed(() =>
  calculateDateSpan(spanStart.value, spanEnd.value, includeEndDate.value),
)

function setSpanPreset(preset: 'this-month' | 'this-year' | 'today') {
  const current = new Date()
  if (preset === 'today') {
    const iso = formatIsoDate(current)
    spanStart.value = iso
    spanEnd.value = iso
  } else if (preset === 'this-month') {
    spanStart.value = formatIsoDate(new Date(current.getFullYear(), current.getMonth(), 1))
    spanEnd.value = formatIsoDate(new Date(current.getFullYear(), current.getMonth() + 1, 0))
  } else {
    spanStart.value = formatIsoDate(new Date(current.getFullYear(), 0, 1))
    spanEnd.value = formatIsoDate(new Date(current.getFullYear(), 11, 31))
  }
}

function swapSpanDates() {
  const tmp = spanStart.value
  spanStart.value = spanEnd.value
  spanEnd.value = tmp
}

const dateSpanCopySummary = computed(() => {
  if (!dateSpanOutcome.value.ok) return ''
  const d = dateSpanOutcome.value.data
  return `គម្លាតថ្ងៃសរុប: ${toKhmerNumber(d.totalDays)} ថ្ងៃ (${toKhmerNumber(d.years)} ឆ្នាំ ${toKhmerNumber(d.months)} ខែ ${toKhmerNumber(d.days)} ថ្ងៃ) | ថ្ងៃធ្វើការ: ${toKhmerNumber(d.workdays)} ថ្ងៃ | ចុងសប្តាហ៍: ${toKhmerNumber(d.weekendDays)} ថ្ងៃ | ថ្ងៃបុណ្យឈប់សម្រាក: ${toKhmerNumber(d.publicHolidaysOff)} ថ្ងៃ`
})

// ============================================================================
// Tool 3: Age & Khmer Birth Day Lookup State
// ============================================================================
const birthIsoInput = ref('')

const ageOutcome = computed(() => calculateAgeAndKhmerBirth(birthIsoInput.value))

const ageCopySummary = computed(() => {
  if (!ageOutcome.value.ok) return ''
  const d = ageOutcome.value.data
  return `អាយុ: ${toKhmerNumber(d.years)} ឆ្នាំ ${toKhmerNumber(d.months)} ខែ ${toKhmerNumber(d.days)} ថ្ងៃ | កំណើតចន្ទគតិ: ${d.birthDetail.lunarFullText} (${d.birthDetail.solarFullText})`
})

function jumpToBirthDateOnCalendar() {
  if (!ageOutcome.value.ok) return
  const g = ageOutcome.value.data.birthDetail.gregorian
  goToDate(g.year, g.month - 1)
}

// ============================================================================
// Tool 4: Khmer Era & Numeral Converter State
// ============================================================================
const eraSourceType = ref<KhmerEraType>('ad')
const eraYearInput = ref(String(new Date().getFullYear()))
const numeralTextInput = ref('')

const eraOptions: { id: KhmerEraType; shortKh: string; labelEn: string }[] = [
  { id: 'ad', shortKh: 'គ.ស.', labelEn: 'AD' },
  { id: 'be', shortKh: 'ព.ស.', labelEn: 'BE' },
  { id: 'js', shortKh: 'ច.ស.', labelEn: 'JS' },
  { id: 'ms', shortKh: 'ម.ស.', labelEn: 'MS' },
]

const eraOutcome = computed(() => convertKhmerEras(eraYearInput.value, eraSourceType.value))

const numeralKhmerOutput = computed(() => toKhmerNumber(toArabicNumber(numeralTextInput.value)))
const numeralArabicOutput = computed(() => toArabicNumber(numeralTextInput.value))

// ============================================================================
// Desktop Viewport & Escape Key Handling
// ============================================================================
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024
  if (!isDesktop.value && isExpanded.value) {
    isExpanded.value = false
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isExpanded.value) {
    if (isSearchOpen.value || isSettingsOpen.value || selectedDate.value) return
    isExpanded.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  if (copyTimer) clearTimeout(copyTimer)
})
</script>

<template>
  <aside
    v-if="enableMiniTools && isDesktop"
    aria-label="ឧបករណ៍ជំនួយ (Desktop Mini Tools)"
    class="fixed bottom-5 left-5 z-40 hidden lg:block"
  >
    <!-- Collapsed Launcher Bar -->
    <button
      v-if="!isExpanded"
      type="button"
      @click="toggleExpand"
      :aria-expanded="false"
      class="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-left shadow-xl shadow-slate-900/12 transition-colors hover:border-amber-500/70 hover:bg-amber-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-black/50 dark:hover:border-amber-400/60 dark:hover:bg-slate-800/90"
    >
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
      >
        <Wrench class="h-4 w-4" />
      </div>
      <div class="min-w-0 pr-1">
        <p class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
          ឧបករណ៍ជំនួយ
        </p>
        <p class="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
          {{ collapsedSubtitle }}
        </p>
      </div>
      <div
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-amber-500 group-hover:text-slate-950 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-amber-500 dark:group-hover:text-slate-950"
      >
        <ChevronUp class="h-4 w-4" />
      </div>
    </button>

    <!-- Expanded Mini Tools Card -->
    <section
      v-else
      class="flex w-[24.5rem] xl:w-[26rem] max-h-[min(37rem,calc(100vh-5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-black/60"
    >
      <!-- Card Header -->
      <div
        class="flex items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <button
            v-if="activeTool !== 'all'"
            type="button"
            @click="activeTool = 'all'"
            class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:border-amber-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-amber-400"
            title="ត្រឡប់ទៅបញ្ជីឧបករណ៍ទាំងអស់ (All Mini Tools)"
          >
            <ArrowLeft class="h-3.5 w-3.5" />
            <span>ទាំងអស់</span>
          </button>
          <div
            v-else
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
          >
            <Wrench class="h-4 w-4" />
          </div>

          <div class="min-w-0">
            <h2 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
              ឧបករណ៍ជំនួយ
            </h2>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 truncate">
              {{
                activeTool === 'all'
                  ? 'ជ្រើសរើសមុខងារដើម្បីប្រើប្រាស់ផ្ទាល់'
                  : 'Mini Tools Workspace'
              }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="toggleExpand"
          aria-label="បង្រួមផ្ទាំងឧបករណ៍ (Collapse Mini Tools)"
          title="បង្រួម (Esc)"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ChevronDown class="h-4 w-4" />
        </button>
      </div>

      <!-- Quick Switcher Strip when inside a specific tool -->
      <div
        v-if="activeTool !== 'all'"
        role="tablist"
        aria-label="ជ្រើសរើសឧបករណ៍ជំនួយ"
        class="grid grid-cols-4 gap-1 border-b border-slate-200/80 bg-slate-100/70 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-950/60"
      >
        <button
          v-for="tab in quickTabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTool === tab.id"
          @click="openTool(tab.id)"
          class="flex items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
          :class="
            activeTool === tab.id
              ? 'bg-amber-500 text-slate-950 shadow-2xs'
              : 'text-slate-700 hover:bg-white/80 dark:text-slate-300 dark:hover:bg-slate-800'
          "
        >
          <component :is="tab.icon" class="h-3.5 w-3.5 shrink-0" />
          <span class="truncate">{{ tab.shortKh }}</span>
        </button>
      </div>

      <!-- Scrollable Workspace Body -->
      <div class="flex-1 overflow-y-auto p-3.5 space-y-3">
        <!-- ================================================================
             VIEW 0: ALL MINI TOOLS DIRECTORY (Asymmetric Hierarchy)
             ================================================================ -->
        <template v-if="activeTool === 'all'">
          <!-- Flagship Tool Feature: Number to Text -->
          <button
            type="button"
            @click="openTool('number-to-text')"
            class="group w-full rounded-xl border border-amber-500/40 bg-amber-50/70 p-3.5 text-left transition-colors hover:border-amber-500 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-amber-500/35 dark:bg-amber-950/25 dark:hover:border-amber-400 dark:hover:bg-amber-950/40"
          >
            <div class="flex items-start justify-between gap-2.5">
              <div class="flex items-center gap-2.5">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950"
                >
                  <Languages class="h-4 w-4" />
                </div>
                <div>
                  <h3 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    បំប្លែងលេខជាអក្សរ • Number to Text
                  </h3>
                  <p class="text-[11px] font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    អានចំនួនលេខជាអក្សរខ្មែរ និងអង់គ្លេស ព្រមទាំងឯកតារៀល (៛)
                  </p>
                </div>
              </div>
            </div>

            <div
              class="mt-2.5 rounded-lg border border-amber-500/25 bg-white/90 px-2.5 py-1.5 text-[11px] text-slate-700 dark:border-amber-500/20 dark:bg-slate-900/80 dark:text-slate-300"
            >
              <span class="font-semibold text-amber-800 dark:text-amber-300">ឧ. ១២,៥០០ ៛ :</span>
              <span class="ml-1 font-bold text-slate-900 dark:text-white">{{
                livePreviewExample
              }}</span>
            </div>
          </button>

          <!-- Supporting Tools Compact List -->
          <div
            class="divide-y divide-slate-200/80 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-800/30"
          >
            <button
              v-for="tool in secondaryTools"
              :key="tool.id"
              type="button"
              @click="openTool(tool.id)"
              class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-amber-500 dark:hover:bg-slate-800/80"
            >
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <component :is="tool.icon" class="h-4 w-4" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {{ tool.titleKh }}
                </p>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  {{ tool.descKh }}
                </p>
              </div>
            </button>
          </div>
        </template>

        <!-- ================================================================
             TOOL 1: NUMBER TO TEXT CONVERTER
             ================================================================ -->
        <template v-else-if="activeTool === 'number-to-text'">
          <div>
            <label
              for="mini-tool-num-input"
              class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              បញ្ចូលតួលេខ (០-៩ ឬ 0-9)
            </label>
            <div class="relative">
              <input
                id="mini-tool-num-input"
                v-model="numInput"
                type="text"
                inputmode="decimal"
                placeholder="ឧ. 12,500 ឬ ១២៥០០ ឬ 99.50"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 pr-9 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800"
              />
              <button
                v-if="numInput.length > 0"
                type="button"
                @click="numInput = ''"
                aria-label="សម្អាតតួលេខ (Clear input)"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-amber-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Sample Presets -->
            <div class="mt-2 flex flex-wrap items-center gap-1.5">
              <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-400"
                >គំរូ:</span
              >
              <button
                v-for="sample in numberSamplePresets"
                :key="sample.value"
                type="button"
                @click="numInput = sample.value"
                class="rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:border-amber-500 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-400"
              >
                {{ sample.label }}
              </button>
            </div>
          </div>

          <!-- Locale & Riel Currency Controls -->
          <div class="flex items-center justify-between gap-2">
            <div
              class="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800 flex-1"
            >
              <button
                type="button"
                @click="numLocale = 'km'"
                class="rounded-lg py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
                :class="
                  numLocale === 'km'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-700 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700'
                "
              >
                ភាសាខ្មែរ (KM)
              </button>
              <button
                type="button"
                @click="numLocale = 'en'"
                class="rounded-lg py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
                :class="
                  numLocale === 'en'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-700 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700'
                "
              >
                English (EN)
              </button>
            </div>

            <button
              type="button"
              role="switch"
              :aria-checked="numUseRiel"
              @click="numUseRiel = !numUseRiel"
              class="rounded-xl border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500 shrink-0"
              :class="
                numUseRiel
                  ? 'border-amber-500 bg-amber-500/20 text-amber-900 dark:text-amber-200'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              "
            >
              + រៀល (៛)
            </button>
          </div>

          <!-- English Capitalization Controls -->
          <div v-if="numLocale === 'en'">
            <span class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
              ទម្រង់អក្សរអង់គ្លេស (Capitalization)
            </span>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="cap in capOptions"
                :key="cap.id"
                type="button"
                @click="numCapitalization = cap.id"
                class="rounded-lg border py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
                :class="
                  numCapitalization === cap.id
                    ? 'border-amber-500 bg-amber-500/20 text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                "
              >
                {{ cap.label }}
              </button>
            </div>
          </div>

          <!-- Khmer Decimal Note -->
          <p
            v-if="showKhmerDecimalHint"
            class="rounded-lg border border-amber-400/40 bg-amber-50/80 px-2.5 py-1.5 text-[11px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-200"
          >
            ទម្រង់ភាសាខ្មែរគណនាផ្នែកចំនួនគត់ខាងមុខក្បៀស។ ប្តូរទៅ English សម្រាប់អានផ្នែកទសភាគ។
          </p>

          <!-- Output State Box (Empty / Error / Valid Result) -->
          <div
            v-if="numInput.trim().length === 0 || convertedNumberText.length === 0"
            class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3.5 text-center dark:border-slate-700 dark:bg-slate-800/40"
          >
            <p class="text-xs font-medium text-slate-600 dark:text-slate-400">
              បញ្ចូលតួលេខខាងលើ ឬចុចលើតួលេខគំរូ ដើម្បីបង្ហាញលទ្ធផលជាអក្សរ។
            </p>
          </div>

          <div
            v-else-if="convertedNumberText === 'ERROR'"
            role="alert"
            class="rounded-xl border border-red-300 bg-red-50 p-3 dark:border-red-800/70 dark:bg-red-950/40"
          >
            <p class="text-xs font-bold text-red-800 dark:text-red-300">
              ចំនួនលេខធំហួសដែនកំណត់ (លើសពី ១៩ ខ្ទង់)
            </p>
            <p class="text-[11px] text-red-700 dark:text-red-300/90 mt-0.5">
              សូមបញ្ចូលចំនួនគត់មិនលើសពី 9,223,372,036,854,775,807។
            </p>
          </div>

          <div
            v-else
            class="rounded-xl border border-amber-500/35 bg-amber-50/60 p-3 dark:border-amber-500/30 dark:bg-slate-800/80"
          >
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                លទ្ធផលជាអក្សរ
              </span>
              <button
                type="button"
                @click="copyText(convertedNumberText, 'num-text')"
                class="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
              >
                <component :is="copiedKey === 'num-text' ? Check : Copy" class="h-3 w-3" />
                <span>{{ copiedKey === 'num-text' ? 'ចម្លងរួច' : 'ចម្លងអក្សរ' }}</span>
              </button>
            </div>
            <p
              class="select-all text-sm font-bold leading-relaxed text-slate-900 dark:text-slate-100 break-words"
            >
              {{ convertedNumberText }}
            </p>
          </div>
        </template>

        <!-- ================================================================
             TOOL 2: DATE DIFFERENCE & WORKDAYS
             ================================================================ -->
        <template v-else-if="activeTool === 'date-span'">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label
                for="mini-span-start"
                class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                ថ្ងៃចាប់ផ្តើម (Start)
              </label>
              <input
                id="mini-span-start"
                v-model="spanStart"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label
                for="mini-span-end"
                class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1"
              >
                ថ្ងៃបញ្ចប់ (End)
              </label>
              <input
                id="mini-span-end"
                v-model="spanEnd"
                type="date"
                min="1900-01-01"
                max="2100-12-31"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-1.5">
            <div class="flex flex-wrap items-center gap-1">
              <button
                type="button"
                @click="setSpanPreset('this-month')"
                class="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ខែនេះ
              </button>
              <button
                type="button"
                @click="setSpanPreset('this-year')"
                class="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ឆ្នាំនេះ
              </button>
              <button
                type="button"
                @click="swapSpanDates"
                class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                title="ប្តូរថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់"
              >
                <ArrowLeftRight class="h-3 w-3" />
                <span>ប្តូរ</span>
              </button>
            </div>

            <button
              type="button"
              role="switch"
              :aria-checked="includeEndDate"
              @click="includeEndDate = !includeEndDate"
              class="rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
              :class="
                includeEndDate
                  ? 'border-amber-500 bg-amber-500/20 text-amber-900 dark:text-amber-200'
                  : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              "
            >
              រាប់ទាំងថ្ងៃបញ្ចប់
            </button>
          </div>

          <div
            v-if="!dateSpanOutcome.ok && dateSpanOutcome.reason === 'empty'"
            class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3.5 text-center dark:border-slate-700 dark:bg-slate-800/40"
          >
            <p class="text-xs font-medium text-slate-600 dark:text-slate-400">
              ជ្រើសរើសថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់ ដើម្បីគណនាចំនួនថ្ងៃ និងថ្ងៃធ្វើការ។
            </p>
          </div>

          <div
            v-else-if="!dateSpanOutcome.ok"
            role="alert"
            class="rounded-xl border border-red-300 bg-red-50 p-3 dark:border-red-800/70 dark:bg-red-950/40"
          >
            <p class="text-xs font-bold text-red-800 dark:text-red-300">
              {{
                dateSpanOutcome.reason === 'range_too_large'
                  ? 'គម្លាតឆ្នាំធំពេក (លើសពី ៥០ ឆ្នាំ)'
                  : 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ'
              }}
            </p>
            <p class="text-[11px] text-red-700 dark:text-red-300/90 mt-0.5">
              សូមជ្រើសរើសចន្លោះកាលបរិច្ឆេទមិនលើសពី ៥០ ឆ្នាំ (ឆ្នាំ ១៩០០ ដល់ ២១០០)។
            </p>
          </div>

          <div
            v-else
            class="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-sm font-extrabold text-slate-900 dark:text-white">
                  សរុប {{ toKhmerNumber(dateSpanOutcome.data.totalDays) }} ថ្ងៃ
                </p>
                <p class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {{ toKhmerNumber(dateSpanOutcome.data.years) }} ឆ្នាំ
                  {{ toKhmerNumber(dateSpanOutcome.data.months) }} ខែ
                  {{ toKhmerNumber(dateSpanOutcome.data.days) }} ថ្ងៃ
                </p>
              </div>
              <button
                type="button"
                @click="copyText(dateSpanCopySummary, 'date-span')"
                class="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
              >
                <component :is="copiedKey === 'date-span' ? Check : Copy" class="h-3 w-3" />
                <span>{{ copiedKey === 'date-span' ? 'ចម្លងរួច' : 'ចម្លង' }}</span>
              </button>
            </div>

            <div class="grid grid-cols-3 gap-1.5 text-center">
              <div
                class="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  {{ toKhmerNumber(dateSpanOutcome.data.workdays) }}
                </p>
                <p class="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  ថ្ងៃធ្វើការសុទ្ធ
                </p>
              </div>
              <div
                class="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  {{ toKhmerNumber(dateSpanOutcome.data.weekendDays) }}
                </p>
                <p class="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  សៅរ៍ និងអាទិត្យ
                </p>
              </div>
              <div
                class="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <p class="text-xs font-extrabold text-amber-800 dark:text-amber-300">
                  {{ toKhmerNumber(dateSpanOutcome.data.publicHolidaysOff) }}
                </p>
                <p class="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  បុណ្យឈប់សម្រាក
                </p>
              </div>
            </div>

            <div
              v-if="dateSpanOutcome.data.holidayNames.length > 0"
              class="border-t border-slate-200/80 pt-2 dark:border-slate-700/80"
            >
              <p class="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                ថ្ងៃឈប់សម្រាកផ្លូវការក្នុងចន្លោះនេះ:
              </p>
              <p class="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {{ dateSpanOutcome.data.holidayNames.join(' • ') }}
              </p>
            </div>
          </div>
        </template>

        <!-- ================================================================
             TOOL 3: AGE & KHMER LUNAR BIRTH LOOKUP
             ================================================================ -->
        <template v-else-if="activeTool === 'age-lookup'">
          <div>
            <label
              for="mini-birth-date"
              class="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
            >
              ជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត (សុរិយគតិ)
            </label>
            <div class="flex items-center gap-2">
              <input
                id="mini-birth-date"
                v-model="birthIsoInput"
                type="date"
                min="1900-01-01"
                :max="formatIsoDate(new Date())"
                class="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                v-if="birthIsoInput"
                type="button"
                @click="birthIsoInput = ''"
                class="rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                សម្អាត
              </button>
            </div>
          </div>

          <div
            v-if="!ageOutcome.ok && ageOutcome.reason === 'empty'"
            class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center dark:border-slate-700 dark:bg-slate-800/40"
          >
            <p class="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              បញ្ចូលថ្ងៃខែឆ្នាំកំណើតរបស់អ្នក ដើម្បីគណនាអាយុពិតប្រាកដ ថ្ងៃកំណើតតាមចន្ទគតិខ្មែរ
              និងឆ្នាំសត្វ។
            </p>
          </div>

          <div
            v-else-if="!ageOutcome.ok"
            role="alert"
            class="rounded-xl border border-red-300 bg-red-50 p-3 dark:border-red-800/70 dark:bg-red-950/40"
          >
            <p class="text-xs font-bold text-red-800 dark:text-red-300">
              {{
                ageOutcome.reason === 'future_date'
                  ? 'ថ្ងៃកំណើតមិនអាចលើសពីថ្ងៃបច្ចុប្បន្នបានទេ'
                  : 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ'
              }}
            </p>
            <p class="text-[11px] text-red-700 dark:text-red-300/90 mt-0.5">
              សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើតចន្លោះឆ្នាំ ១៩០០ រហូតដល់ថ្ងៃនេះ។
            </p>
          </div>

          <div
            v-else
            class="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div class="flex items-center justify-between gap-2">
              <div>
                <p class="text-sm font-extrabold text-slate-900 dark:text-white">
                  {{ toKhmerNumber(ageOutcome.data.years) }} ឆ្នាំ
                  {{ toKhmerNumber(ageOutcome.data.months) }} ខែ
                  {{ toKhmerNumber(ageOutcome.data.days) }} ថ្ងៃ
                </p>
                <p class="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  រស់នៅសរុប {{ toKhmerNumber(ageOutcome.data.totalDaysLived.toLocaleString()) }}
                  ថ្ងៃ
                </p>
              </div>

              <span
                class="rounded-lg border border-amber-500/40 bg-amber-500/15 px-2 py-1 text-[11px] font-bold text-amber-900 dark:text-amber-200"
              >
                {{
                  ageOutcome.data.isBirthdayToday
                    ? 'រីករាយថ្ងៃខួបកំណើត!'
                    : `ខួបបន្ទាប់: ${toKhmerNumber(ageOutcome.data.daysUntilNextBirthday)} ថ្ងៃទៀត`
                }}
              </span>
            </div>

            <!-- Zodiac & Lunar Birth Card -->
            <div
              class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
            >
              <img
                :src="ageOutcome.data.zodiac.imageUrl"
                :alt="`ឆ្នាំ${ageOutcome.data.zodiac.nameKh}`"
                class="h-12 w-12 shrink-0 rounded-xl object-cover border border-amber-400/60"
              />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">
                  ឆ្នាំ{{ ageOutcome.data.zodiac.nameKh }} ({{ ageOutcome.data.zodiac.nameEn }}) •
                  {{ ageOutcome.data.zodiac.elementKh }}
                </p>
                <p
                  class="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-snug mt-0.5"
                >
                  {{ ageOutcome.data.birthDetail.lunarFullText }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                @click="jumpToBirthDateOnCalendar"
                class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-800 hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <Calendar class="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>មើលថ្ងៃកំណើតលើប្រតិទិន</span>
              </button>

              <button
                type="button"
                @click="copyText(ageCopySummary, 'age-copy')"
                class="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-slate-950 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-500"
              >
                <component :is="copiedKey === 'age-copy' ? Check : Copy" class="h-3 w-3" />
                <span>{{ copiedKey === 'age-copy' ? 'ចម្លងរួច' : 'ចម្លង' }}</span>
              </button>
            </div>
          </div>
        </template>

        <!-- ================================================================
             TOOL 4: KHMER ERA & NUMERAL CONVERTER
             ================================================================ -->
        <template v-else-if="activeTool === 'era-numerals'">
          <!-- Part A: Khmer Era Converter -->
          <div class="space-y-2">
            <label
              for="mini-era-year"
              class="block text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              បំប្លែងឆ្នាំសករាជ (ព.ស. / គ.ស. / ច.ស. / ម.ស.)
            </label>
            <div class="flex items-center gap-1.5">
              <div
                class="grid grid-cols-4 gap-0.5 rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800"
              >
                <button
                  v-for="era in eraOptions"
                  :key="era.id"
                  type="button"
                  @click="eraSourceType = era.id"
                  class="rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-amber-500"
                  :class="
                    eraSourceType === era.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-700 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700'
                  "
                >
                  {{ era.shortKh }}
                </button>
              </div>

              <input
                id="mini-era-year"
                v-model="eraYearInput"
                type="text"
                inputmode="numeric"
                placeholder="ឧ. 2026"
                class="w-28 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div
              v-if="!eraOutcome.ok && eraOutcome.reason === 'empty'"
              class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-2.5 text-center dark:border-slate-700 dark:bg-slate-800/40"
            >
              <p class="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                បញ្ចូលឆ្នាំ ដើម្បីគណនាសករាជទាំង ៤។
              </p>
            </div>

            <div
              v-else-if="!eraOutcome.ok"
              role="alert"
              class="rounded-xl border border-red-300 bg-red-50 p-2.5 dark:border-red-800/70 dark:bg-red-950/40"
            >
              <p class="text-[11px] font-bold text-red-800 dark:text-red-300">
                សូមបញ្ចូលឆ្នាំត្រឹមត្រូវ (គ.ស. ១ ដល់ ៩៩៩៩)។
              </p>
            </div>

            <div v-else class="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                @click="copyText(`ព.ស. ${eraOutcome.data.bePostVisakKh}`, 'era-be')"
                class="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-800 dark:bg-slate-800/70"
                title="ចុចដើម្បីចម្លង ព.ស."
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >ពុទ្ធសករាជ (ព.ស.)</span
                  >
                  <Check
                    v-if="copiedKey === 'era-be'"
                    class="h-3 w-3 text-amber-700 dark:text-amber-300"
                  />
                </div>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {{ eraOutcome.data.bePostVisakKh }} ({{ eraOutcome.data.bePostVisak }})
                </p>
                <p class="text-[10px] text-slate-600 dark:text-slate-400">
                  មុនពិសាខបូជា: {{ toKhmerNumber(eraOutcome.data.bePreVisak) }}
                </p>
              </button>

              <button
                type="button"
                @click="copyText(`គ.ស. ${eraOutcome.data.adKh}`, 'era-ad')"
                class="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-800 dark:bg-slate-800/70"
                title="ចុចដើម្បីចម្លង គ.ស."
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >គ្រិស្តសករាជ (គ.ស.)</span
                  >
                  <Check
                    v-if="copiedKey === 'era-ad'"
                    class="h-3 w-3 text-amber-700 dark:text-amber-300"
                  />
                </div>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {{ eraOutcome.data.adKh }} ({{ eraOutcome.data.ad }})
                </p>
                <p class="text-[10px] text-slate-600 dark:text-slate-400">សកល (Gregorian)</p>
              </button>

              <button
                type="button"
                @click="copyText(`ច.ស. ${eraOutcome.data.jsKh}`, 'era-js')"
                class="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-800 dark:bg-slate-800/70"
                title="ចុចដើម្បីចម្លង ច.ស."
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >ចុល្លសករាជ (ច.ស.)</span
                  >
                  <Check
                    v-if="copiedKey === 'era-js'"
                    class="h-3 w-3 text-amber-700 dark:text-amber-300"
                  />
                </div>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {{ eraOutcome.data.jsKh }} ({{ eraOutcome.data.js }})
                </p>
              </button>

              <button
                type="button"
                @click="copyText(`ម.ស. ${eraOutcome.data.msKh}`, 'era-ms')"
                class="rounded-xl border border-slate-200 bg-slate-50 p-2 text-left hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-800 dark:bg-slate-800/70"
                title="ចុចដើម្បីចម្លង ម.ស."
              >
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >មហាសករាជ (ម.ស.)</span
                  >
                  <Check
                    v-if="copiedKey === 'era-ms'"
                    class="h-3 w-3 text-amber-700 dark:text-amber-300"
                  />
                </div>
                <p class="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {{ eraOutcome.data.msKh }} ({{ eraOutcome.data.ms }})
                </p>
              </button>
            </div>
          </div>

          <!-- Part B: Khmer <-> Arabic Digit Converter -->
          <div class="border-t border-slate-200 pt-2.5 space-y-2 dark:border-slate-800">
            <label
              for="mini-numeral-text"
              class="block text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              បំប្លែងតួលេខខ្មែរ និងលេខសកល (០-៩ / 0-9)
            </label>
            <input
              id="mini-numeral-text"
              v-model="numeralTextInput"
              type="text"
              placeholder="វាយលេខ ឬឃ្លា ឧ. ថ្ងៃទី 27 ខែ 11 ឆ្នាំ 2026"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div
              v-if="numeralTextInput.trim().length === 0"
              class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-2.5 text-center dark:border-slate-700 dark:bg-slate-800/40"
            >
              <p class="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                វាយអត្ថបទ ឬតួលេខខាងលើ ដើម្បីបំប្លែងទៅមករវាងលេខខ្មែរ និងលេខសកល។
              </p>
            </div>

            <div v-else class="space-y-1.5">
              <div
                class="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-800/70"
              >
                <div class="min-w-0">
                  <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >លេខខ្មែរ (០-៩)</span
                  >
                  <p class="text-xs font-bold text-slate-900 dark:text-white break-all">
                    {{ numeralKhmerOutput }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="copyText(numeralKhmerOutput, 'num-kh')"
                  class="shrink-0 rounded-lg bg-amber-500 px-2 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-amber-500"
                >
                  {{ copiedKey === 'num-kh' ? 'ចម្លងរួច' : 'ចម្លង' }}
                </button>
              </div>

              <div
                class="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-800/70"
              >
                <div class="min-w-0">
                  <span class="block text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >លេខសកល (0-9)</span
                  >
                  <p class="text-xs font-bold text-slate-900 dark:text-white break-all">
                    {{ numeralArabicOutput }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="copyText(numeralArabicOutput, 'num-ar')"
                  class="shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold text-slate-800 hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {{ copiedKey === 'num-ar' ? 'ចម្លងរួច' : 'ចម្លង' }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </aside>
</template>
