<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Copy, Check, Share2, Mail, CalendarCheck, ExternalLink } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import AppLogo from '@/components/AppLogo.vue'
import { useCalendarState } from '@/composables/useCalendarState'

const { todayDetail } = useCalendarState()

const includeTodayDate = ref(false)
const isLinkCopied = ref(false)
const copyError = ref(false)
const canNativeShare = ref(false)
const currentOriginUrl = ref('https://khmer-pro-calendar.vercel.app')
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    currentOriginUrl.value = window.location.origin
  }
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    canNativeShare.value = true
  }
})

onUnmounted(() => {
  if (copyResetTimer) clearTimeout(copyResetTimer)
})

const displayHost = computed(() => currentOriginUrl.value.replace(/^https?:\/\//, ''))

const shareTitle = 'ប្រតិទិនខ្មែរ | Khmer Lunar Calendar'

const shareMessage = computed(() => {
  if (includeTodayDate.value) {
    return `${todayDetail.value.copyFormat} (${todayDetail.value.solarFullText}) • មើលប្រតិទិនចន្ទគតិខ្មែរ ថ្ងៃសីល និងបុណ្យជាតិនៅលើប្រតិទិនខ្មែរ:`
  }
  return 'សូមណែនាំ ប្រតិទិនចន្ទគតិខ្មែរ (Khmer Lunar Calendar) សម្រាប់មើលថ្ងៃសីល បុណ្យជាតិ និងឆ្នាំសត្វខ្មែរ:'
})

const fullClipboardPayload = computed(() =>
  includeTodayDate.value
    ? `${shareMessage.value} ${currentOriginUrl.value}`
    : currentOriginUrl.value,
)

const telegramShareHref = computed(
  () =>
    `https://t.me/share/url?url=${encodeURIComponent(currentOriginUrl.value)}&text=${encodeURIComponent(shareMessage.value)}`,
)

const facebookShareHref = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentOriginUrl.value)}`,
)

const xShareHref = computed(
  () =>
    `https://x.com/intent/post?url=${encodeURIComponent(currentOriginUrl.value)}&text=${encodeURIComponent(shareMessage.value)}`,
)

const emailShareHref = computed(
  () =>
    `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareMessage.value}\n${currentOriginUrl.value}`)}`,
)

async function handleCopyShare() {
  copyError.value = false
  const textToCopy = fullClipboardPayload.value

  try {
    await navigator.clipboard.writeText(textToCopy)
    triggerCopiedFeedback()
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = textToCopy
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) {
        triggerCopiedFeedback()
      } else {
        copyError.value = true
      }
    } catch {
      copyError.value = true
    }
  }
}

function triggerCopiedFeedback() {
  isLinkCopied.value = true
  confetti({
    particleCount: 24,
    spread: 48,
    origin: { y: 0.85 },
    colors: ['#F59E0B', '#FBBF24', '#10B981'],
  })
  if (copyResetTimer) clearTimeout(copyResetTimer)
  copyResetTimer = setTimeout(() => {
    isLinkCopied.value = false
  }, 2400)
}

async function handleNativeShare() {
  if (!canNativeShare.value) return
  try {
    await navigator.share({
      title: shareTitle,
      text: shareMessage.value,
      url: currentOriginUrl.value,
    })
  } catch {
    // User cancelled native share sheet
  }
}
</script>

<template>
  <section
    aria-labelledby="share-calendar-heading"
    class="relative overflow-hidden rounded-3xl border border-slate-200/95 bg-white p-4 sm:p-6 shadow-lg shadow-slate-900/5 dark:border-amber-500/35 dark:bg-slate-900 dark:shadow-[0_16px_42px_-12px_rgba(0,0,0,0.75)] dark:ring-1 dark:ring-amber-400/15"
  >
    <!-- Top Architectural Gold Accent Rule -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400 to-amber-600/80"
    ></div>

    <div class="lg:grid lg:grid-cols-12 lg:items-center lg:gap-7">
      <!-- Left / Top Band: Brand Identity + Invitation + Copy Link Bar -->
      <div class="lg:col-span-7 space-y-3.5 sm:space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-start sm:items-center gap-3 min-w-0">
            <div
              class="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-2xl shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40"
            >
              <AppLogo class="h-full w-full" />
            </div>
            <div class="min-w-0">
              <h2
                id="share-calendar-heading"
                class="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 dark:text-white leading-snug"
              >
                ចែករំលែកប្រតិទិនខ្មែរទៅកាន់មិត្តភក្តិ និងគ្រួសារ
              </h2>
              <p
                class="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed"
              >
                ជួយចែករំលែកគេហទំព័រមើលថ្ងៃសីល បុណ្យជាតិ និងចន្ទគតិខ្មែរ ដល់មនុស្សជាទីស្រឡាញ់របស់អ្នក
              </p>
            </div>
          </div>

          <!-- Tablet-only inline placement of Include Today toggle (sm to lg-1) -->
          <button
            type="button"
            role="switch"
            :aria-checked="includeTodayDate"
            @click="includeTodayDate = !includeTodayDate"
            class="hidden sm:inline-flex lg:hidden min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            :class="
              includeTodayDate
                ? 'border-amber-500 bg-amber-500/20 text-amber-950 dark:border-amber-400 dark:bg-amber-400/20 dark:text-amber-200'
                : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:bg-amber-500/20 dark:hover:text-amber-200'
            "
          >
            <CalendarCheck
              class="h-4 w-4 shrink-0"
              :class="
                includeTodayDate
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-amber-600 dark:text-amber-400'
              "
            />
            <span>ភ្ជាប់ថ្ងៃចន្ទគតិថ្ងៃនេះ</span>
          </button>
        </div>

        <!-- Copy Link Bar (Stacks on narrow phones, inline row from sm+) -->
        <div
          class="flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl border border-slate-200/95 bg-slate-50/90 p-2 dark:border-slate-700 dark:bg-slate-800/85"
        >
          <div class="flex min-h-11 flex-1 items-center gap-2.5 px-2.5 min-w-0">
            <span
              class="rounded-lg border border-amber-500/35 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/20 dark:text-amber-200 shrink-0"
            >
              តំណភ្ជាប់
            </span>
            <span
              class="select-all truncate text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100"
              :title="currentOriginUrl"
            >
              {{ displayHost }}
            </span>
          </div>

          <button
            type="button"
            @click="handleCopyShare"
            class="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            :class="
              isLinkCopied
                ? 'bg-emerald-500 text-slate-950 dark:bg-emerald-400 dark:text-slate-950'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300'
            "
          >
            <component :is="isLinkCopied ? Check : Copy" class="h-4 w-4 shrink-0" />
            <span>{{
              isLinkCopied
                ? 'ចម្លងរួចរាល់!'
                : includeTodayDate
                  ? 'ចម្លងសារ និងតំណភ្ជាប់'
                  : 'ចម្លងតំណភ្ជាប់'
            }}</span>
          </button>
        </div>

        <!-- Live Preview when "Include today's Khmer date" is active -->
        <div
          v-if="includeTodayDate"
          role="status"
          class="rounded-xl border border-amber-500/35 bg-amber-50/75 px-3 py-2 text-xs text-slate-800 dark:border-amber-400/35 dark:bg-amber-500/12 dark:text-slate-200 leading-relaxed"
        >
          <span class="font-bold text-amber-900 dark:text-amber-300">សារភ្ជាប់:</span>
          <span class="ml-1 font-medium">{{ shareMessage }}</span>
        </div>

        <!-- Clipboard fallback error alert -->
        <div
          v-if="copyError"
          role="alert"
          class="rounded-xl border border-red-400 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/60 dark:bg-red-950/60 dark:text-red-200"
        >
          កម្មវិធីរុករកមិនអនុញ្ញាតឱ្យចម្លងស្វ័យប្រវត្តិទេ។ សូមជ្រើសរើស និងចម្លងតំណភ្ជាប់ខាងលើដោយផ្ទាល់៖
          <span class="font-bold underline select-all">{{ currentOriginUrl }}</span>
        </div>
      </div>

      <!-- Right / Bottom Band: Share Options & Direct Social Channels -->
      <div
        class="mt-3.5 sm:mt-4 lg:mt-0 lg:col-span-5 lg:border-l lg:border-slate-200/90 lg:pl-7 dark:lg:border-slate-700/90 space-y-2.5"
      >
        <!-- Phone (< sm) & Desktop (>= lg) Include Today's Lunar Date Switch -->
        <button
          type="button"
          role="switch"
          :aria-checked="includeTodayDate"
          @click="includeTodayDate = !includeTodayDate"
          class="flex sm:hidden lg:flex w-full min-h-11 items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-left text-xs font-bold transition-colors active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          :class="
            includeTodayDate
              ? 'border-amber-500 bg-amber-500/20 text-amber-950 dark:border-amber-400 dark:bg-amber-400/20 dark:text-amber-200'
              : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:bg-amber-500/20 dark:hover:text-amber-200'
          "
        >
          <span class="inline-flex items-center gap-2 min-w-0">
            <CalendarCheck
              class="h-4 w-4 shrink-0"
              :class="
                includeTodayDate
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-amber-600 dark:text-amber-400'
              "
            />
            <span class="truncate">ភ្ជាប់កាលបរិច្ឆេទចន្ទគតិថ្ងៃនេះក្នុងសារ</span>
          </span>
          <span
            class="inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors"
            :class="includeTodayDate ? 'bg-amber-500 dark:bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'"
          >
            <span
              class="h-4 w-4 rounded-full bg-white shadow-xs transition-transform"
              :class="includeTodayDate ? 'translate-x-4' : 'translate-x-0'"
            ></span>
          </span>
        </button>

        <!-- Direct Channel Grid: 2 cols on Phone, 4 cols on Tablet, 2x2 on Desktop -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
          <!-- Telegram -->
          <a
            :href="telegramShareHref"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50/90 px-3 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
          >
            <span class="inline-flex items-center gap-2 min-w-0">
              <svg
                class="h-4 w-4 shrink-0 text-amber-600 transition-colors group-hover:text-slate-950 dark:text-amber-400 dark:group-hover:text-slate-950"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M21.94 4.66a1.5 1.5 0 0 0-1.64-.28L2.93 11.45a1.42 1.42 0 0 0 .09 2.67l4.42 1.45 1.72 5.23a1.3 1.3 0 0 0 2.18.49l2.53-2.55 4.53 3.34a1.48 1.48 0 0 0 2.32-.9l2.68-15.17a1.5 1.5 0 0 0-.46-1.35ZM9.2 14.8l9.16-7.79-7.43 9.15-.29 3.16-1.44-4.52Z"
                />
              </svg>
              <span class="truncate">Telegram</span>
            </span>
            <ExternalLink
              class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-slate-950"
            />
          </a>

          <!-- Facebook -->
          <a
            :href="facebookShareHref"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50/90 px-3 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
          >
            <span class="inline-flex items-center gap-2 min-w-0">
              <svg
                class="h-4 w-4 shrink-0 text-amber-600 transition-colors group-hover:text-slate-950 dark:text-amber-400 dark:group-hover:text-slate-950"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.87.25-1.46 1.5-1.46h1.6V4.26A21.6 21.6 0 0 0 14.27 4c-2.3 0-3.87 1.4-3.87 3.98v2.32H7.8v3h2.6V21h3.1Z"
                />
              </svg>
              <span class="truncate">Facebook</span>
            </span>
            <ExternalLink
              class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-slate-950"
            />
          </a>

          <!-- X (Twitter) -->
          <a
            :href="xShareHref"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50/90 px-3 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
          >
            <span class="inline-flex items-center gap-2 min-w-0">
              <svg
                class="h-3.5 w-3.5 shrink-0 text-amber-600 transition-colors group-hover:text-slate-950 dark:text-amber-400 dark:group-hover:text-slate-950"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <span class="truncate">X (Twitter)</span>
            </span>
            <ExternalLink
              class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-slate-950"
            />
          </a>

          <!-- Email -->
          <a
            :href="emailShareHref"
            class="group flex min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-300 bg-slate-50/90 px-3 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
          >
            <span class="inline-flex items-center gap-2 min-w-0">
              <Mail
                class="h-4 w-4 shrink-0 text-amber-600 transition-colors group-hover:text-slate-950 dark:text-amber-400 dark:group-hover:text-slate-950"
              />
              <span class="truncate">ផ្ញើអ៊ីមែល</span>
            </span>
            <ExternalLink
              class="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-slate-950"
            />
          </a>
        </div>

        <!-- Native Device Share Sheet Button (Rendered only when Web Share API is available) -->
        <button
          v-if="canNativeShare"
          type="button"
          @click="handleNativeShare"
          class="group flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-500/45 bg-amber-500/12 px-4 py-2.5 text-xs font-extrabold text-amber-950 transition-colors hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 dark:border-amber-400/45 dark:bg-amber-400/15 dark:text-amber-200 dark:hover:border-amber-400 dark:hover:bg-amber-400 dark:hover:text-slate-950"
        >
          <Share2
            class="h-4 w-4 shrink-0 text-amber-700 transition-colors group-hover:text-slate-950 dark:text-amber-300 dark:group-hover:text-slate-950"
          />
          <span>ចែករំលែកតាមកម្មវិធីលើឧបករណ៍ (More Apps)</span>
        </button>
      </div>
    </div>
  </section>
</template>
