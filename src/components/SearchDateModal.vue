<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  X,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-vue-next'
import { useCalendarState } from '@/composables/useCalendarState'
import {
  KHMER_SOLAR_MONTHS,
  getKhmerDayDetail,
  toKhmerNumber,
  type KhmerDayDetail,
} from '@/utils/khmerCalendar'

const {
  currentYear,
  isSearchOpen,
  goToDate,
} = useCalendarState()

const searchQuery = ref('')
const pickYear = ref(currentYear.value)
const pickMonth = ref(new Date().getMonth()) // 0-11
const pickDay = ref(new Date().getDate())

// Searchable Cambodian holidays across the target year
const targetYearEvents = computed(() => {
  const list: KhmerDayDetail[] = []
  const y = pickYear.value

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d)
      const detail = getKhmerDayDetail(date)
      if (detail.holiday || detail.isHolyDay) {
        list.push(detail)
      }
    }
  }
  return list
})

// Filtered search results
const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []

  return targetYearEvents.value.filter((item) => {
    const khHoliday = item.holiday?.titleKh.toLowerCase() || ''
    const enHoliday = item.holiday?.titleEn.toLowerCase() || ''
    const holyLabel = item.holyDayLabel?.toLowerCase() || ''
    const fullText = item.fullKhmerFormat.toLowerCase()

    return (
      khHoliday.includes(q) ||
      enHoliday.includes(q) ||
      holyLabel.includes(q) ||
      fullText.includes(q)
    )
  })
})

function jumpToPickedDate() {
  goToDate(pickYear.value, pickMonth.value, pickDay.value)
  isSearchOpen.value = false
}

function handleSelectEvent(item: KhmerDayDetail) {
  goToDate(
    item.gregorian.year,
    item.gregorian.month - 1,
    item.gregorian.day
  )
  isSearchOpen.value = false
}

const quickQueries = [
  { label: 'ចូលឆ្នាំខ្មែរ', query: 'ចូលឆ្នាំ' },
  { label: 'បុណ្យអុំទូក', query: 'អុំទូក' },
  { label: 'ភ្ជុំបិណ្ឌ', query: 'ភ្ជុំបិណ្ឌ' },
  { label: 'វិសាខបូជា', query: 'វិសាខបូជា' },
  { label: 'មាឃបូជា', query: 'មាឃបូជា' },
  { label: 'ឯករាជ្យជាតិ', query: 'ឯករាជ្យ' },
  { label: 'ថ្ងៃសីល', query: 'សីល' },
]
</script>

<template>
  <div v-if="isSearchOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
    <!-- Backdrop overlay -->
    <div
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      @click="isSearchOpen = false"
    ></div>

    <!-- Search Dialog -->
    <div
      class="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Search class="h-4 w-4" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              ស្វែងរក & ទៅកាន់កាលបរិច្ឆេទ
            </h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Search holidays, events, or jump to any date
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="isSearchOpen = false"
          class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Section 1: Search by Holiday / Keyword -->
      <div class="mt-4">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          ស្វែងរកតាមឈ្មោះបុណ្យ ឬពាក្យគន្លឹះ
        </label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ឧ. ចូលឆ្នាំ, អុំទូក, ភ្ជុំបិណ្ឌ, សីល, Independence..."
            class="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 pl-10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-amber-500 dark:focus:bg-slate-800 transition-colors"
          />
          <Search class="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>

        <!-- Quick filter chips -->
        <div class="mt-2 flex flex-wrap gap-1.5">
          <button
            v-for="chip in quickQueries"
            :key="chip.query"
            type="button"
            @click="searchQuery = chip.query"
            class="rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-colors"
            :class="
              searchQuery === chip.query
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            "
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <!-- Search Results Area -->
      <div v-if="searchQuery.trim()" class="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <h4 class="text-xs font-bold text-slate-500 mb-2">
          លទ្ធផលស្វែងរក ({{ searchResults.length }})
        </h4>

        <div v-if="searchResults.length === 0" class="py-6 text-center text-xs text-slate-400">
          រកមិនឃើញលទ្ធផលសម្រាប់ "{{ searchQuery }}"
        </div>

        <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            v-for="res in searchResults"
            :key="res.gregorian.isoDateString"
            type="button"
            @click="handleSelectEvent(res)"
            class="flex w-full items-center justify-between rounded-xl border border-slate-200/70 p-2.5 text-left hover:border-amber-500 hover:bg-amber-50/50 dark:border-slate-800 dark:hover:bg-slate-800/80 transition-all"
          >
            <div>
              <p class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {{ res.holiday ? res.holiday.titleKh : res.holyDayLabel }}
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                {{ res.fullKhmerFormat }}
              </p>
            </div>
            <ArrowRight class="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      <!-- Section 2: Jump directly to Date -->
      <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
        <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          ជ្រើសរើសថ្ងៃ ខែ ឆ្នាំ ដោយផ្ទាល់
        </label>

        <div class="grid grid-cols-3 gap-2">
          <!-- Day -->
          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">ថ្ងៃ (Day)</label>
            <select
              v-model.number="pickDay"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option v-for="d in 31" :key="d" :value="d">
                {{ d }}
              </option>
            </select>
          </div>

          <!-- Month -->
          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">ខែ (Month)</label>
            <select
              v-model.number="pickMonth"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option
                v-for="m in KHMER_SOLAR_MONTHS"
                :key="m.index"
                :value="m.index"
              >
                {{ m.kh }}
              </option>
            </select>
          </div>

          <!-- Year -->
          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">ឆ្នាំ (Year)</label>
            <input
              v-model.number="pickYear"
              type="number"
              min="1900"
              max="2100"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="button"
          @click="jumpToPickedDate"
          class="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
        >
          <Calendar class="h-4 w-4" />
          <span>ទៅកាន់កាលបរិច្ឆេទនេះ</span>
        </button>
      </div>
    </div>
  </div>
</template>
