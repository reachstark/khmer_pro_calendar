<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { toKhmerNumber, CHINESE_NEW_YEAR_MAP } from '@/utils/khmerCalendar'
import snowflakeAsset from '@/assets/snowflake.png'
import snowmanAsset from '@/assets/snowman.png'
import christmasTreeAsset from '@/assets/christmas_tree.png'
import heartAsset from '@/assets/heart.png'
import redEnvelopeAsset from '@/assets/red_envelope.png'

const { currentMonth, currentYear } = useCalendarState()
const { enableSeasonsAnim, previewDecember, previewValentine, previewCNY } = useCalendarSettings()

const now = ref(new Date())

// December has exclusive snowing animation + snowman + Christmas trees
const isDecember = computed(() => currentMonth.value === 11)
const isDecemberActive = computed(() => isDecember.value || previewDecember.value)

// Valentine's Day falling hearts (Feb 14 or preview)
const isRealValentineToday = computed(
  () => now.value.getMonth() === 1 && now.value.getDate() === 14,
)
const isValentineActive = computed(() => isRealValentineToday.value || previewValentine.value)

// Chinese New Year falling red envelopes (CNY days: Eve to Day 3 or preview)
function isDateInChineseNewYear(date: Date): boolean {
  const year = date.getFullYear()
  const cny = CHINESE_NEW_YEAR_MAP[year]
  if (!cny) return false
  const day1Date = new Date(year, cny.month - 1, cny.day)
  const currentDate = new Date(year, date.getMonth(), date.getDate())
  const diffDays = Math.round((currentDate.getTime() - day1Date.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= -1 && diffDays <= 2
}

const isCNYActive = computed(() => isDateInChineseNewYear(now.value) || previewCNY.value)

// January New Year Celebration & Fireworks
const isJanuary = computed(() => currentMonth.value === 0)
const formattedKhmerYear = computed(() => toKhmerNumber(currentYear.value))
const gregorianYear = computed(() => currentYear.value)

const showNewYearBanner = ref(false)
let bannerTimer: ReturnType<typeof setTimeout> | null = null
let wave1Timer: ReturnType<typeof setTimeout> | null = null
let wave2Timer: ReturnType<typeof setTimeout> | null = null

function triggerJanuaryFireworks() {
  showNewYearBanner.value = true
  if (bannerTimer) clearTimeout(bannerTimer)
  if (wave1Timer) clearTimeout(wave1Timer)
  if (wave2Timer) clearTimeout(wave2Timer)

  const count = 180
  const defaults = { origin: { y: 0.65 }, zIndex: 120 }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#FFD700', '#FFA500', '#FF4500'],
  })
  fire(0.2, {
    spread: 60,
    colors: ['#38BDF8', '#818CF8', '#C084FC'],
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#34D399', '#F43F5E', '#FBBF24'],
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FDE047', '#A855F7', '#EC4899'],
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#FFFFFF', '#67E8F9', '#F472B6'],
  })

  wave1Timer = setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.6 },
      zIndex: 120,
      colors: ['#FFD700', '#F43F5E', '#38BDF8', '#4ADE80'],
    })
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.6 },
      zIndex: 120,
      colors: ['#FFD700', '#F43F5E', '#38BDF8', '#A855F7'],
    })
  }, 350)

  wave2Timer = setTimeout(() => {
    confetti({
      particleCount: 70,
      spread: 100,
      origin: { x: 0.5, y: 0.35 },
      zIndex: 120,
      colors: ['#FBBF24', '#F59E0B', '#FDE047', '#38BDF8'],
    })
  }, 850)

  bannerTimer = setTimeout(() => {
    showNewYearBanner.value = false
  }, 5500)
}

function dismissBanner() {
  showNewYearBanner.value = false
  if (bannerTimer) clearTimeout(bannerTimer)
}

watch(
  [() => currentMonth.value, () => currentYear.value],
  ([m]) => {
    if (m === 0) {
      triggerJanuaryFireworks()
    } else {
      showNewYearBanner.value = false
      if (bannerTimer) clearTimeout(bannerTimer)
      if (wave1Timer) clearTimeout(wave1Timer)
      if (wave2Timer) clearTimeout(wave2Timer)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (bannerTimer) clearTimeout(bannerTimer)
  if (wave1Timer) clearTimeout(wave1Timer)
  if (wave2Timer) clearTimeout(wave2Timer)
})

// Cambodia Seasons
const isRainySeason = computed(() => currentMonth.value >= 4 && currentMonth.value <= 9)
const isDrySeason = computed(
  () => !isDecember.value && (currentMonth.value <= 3 || currentMonth.value === 10),
)

// Falling snowflakes using the custom snowflake asset:
const snowflakes = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  left: `${Number(((i * 2.38 + (i % 7) * 3.4) % 98).toFixed(2))}%`,
  size: 15 + (i % 7) * 3.5, // 15px to 36px for natural depth
  duration: `${Number((5.5 + (i % 6) * 1.5).toFixed(1))}s`, // 5.5s to 13s
  delay: `${Number(((i * 0.26) % 6).toFixed(2))}s`, // 0s to 6s
  opacity: Number((0.75 + (i % 4) * 0.07).toFixed(2)), // 0.75 to 0.96
  wobbleDuration: `${Number((2.5 + (i % 5) * 0.5).toFixed(1))}s`, // 2.5s to 4.5s
}))

const raindrops = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: `${Number(((i * 2.77 + (i % 7) * 3) % 99).toFixed(2))}%`,
  height: `${14 + (i % 6) * 5}px`,
  duration: `${Number((0.9 + (i % 4) * 0.25).toFixed(2))}s`,
  delay: `${Number(((i * 0.12) % 2).toFixed(2))}s`,
  opacity: Number((0.35 + (i % 4) * 0.1).toFixed(2)),
}))

const dryParticles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${Number(((i * 4.16 + (i % 6) * 3) % 98).toFixed(2))}%`,
  size: `${4 + (i % 5) * 2}px`,
  duration: `${7 + (i % 4) * 2}s`,
  delay: `${Number(((i * 0.35) % 5).toFixed(2))}s`,
  opacity: Number((0.3 + (i % 4) * 0.1).toFixed(2)),
}))

// Valentine's Day falling hearts:
const hearts = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: `${Number(((i * 2.78 + (i % 7) * 3.8) % 98).toFixed(2))}%`,
  size: 18 + (i % 6) * 3.5, // 18px to 35.5px
  duration: `${Number((5.6 + (i % 5) * 1.3).toFixed(1))}s`, // 5.6s to 10.8s
  delay: `${Number(((i * 0.28) % 6).toFixed(2))}s`, // 0s to 6s
  opacity: Number((0.78 + (i % 4) * 0.06).toFixed(2)), // 0.78 to 0.96
  flutterDuration: `${Number((2.4 + (i % 4) * 0.5).toFixed(1))}s`,
}))

// Chinese New Year falling red envelopes (Hongbao):
const envelopes = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: `${Number(((i * 3.12 + (i % 6) * 3.6) % 98).toFixed(2))}%`,
  width: 24 + (i % 5) * 4, // 24px to 40px
  duration: `${Number((6.5 + (i % 6) * 1.2).toFixed(1))}s`, // 6.5s to 12.5s
  delay: `${Number(((i * 0.32) % 6).toFixed(2))}s`, // 0s to 6s
  opacity: Number((0.82 + (i % 4) * 0.05).toFixed(2)), // 0.82 to 0.97
  swayDuration: `${Number((2.8 + (i % 4) * 0.6).toFixed(1))}s`,
}))
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
    <!-- 1. December Snowing Animation (Falling Snowflakes, Snowman & Christmas Trees) -->
    <template v-if="isDecemberActive">
      <div
        v-for="flake in snowflakes"
        :key="'snow-' + flake.id"
        class="absolute select-none pointer-events-none"
        :style="{
          left: flake.left,
          top: '-40px',
          width: flake.size + 'px',
          height: flake.size + 'px',
          opacity: flake.opacity,
          animation: `snowfall ${flake.duration} linear infinite`,
          animationDelay: flake.delay,
        }"
      >
        <img
          :src="snowflakeAsset"
          alt=""
          class="w-full h-full object-contain snow-flake-shadow select-none pointer-events-none"
          :style="{
            animation: `snow-wobble ${flake.wobbleDuration} ease-in-out infinite`,
            animationDelay: flake.delay,
          }"
        />
      </div>

      <!-- 2. Sticky Piles of Snow at the Bottom with Snowman & Christmas Trees (Desktop) -->
      <div
        class="fixed bottom-0 left-0 right-0 h-36 xl:h-44 pointer-events-none z-20 select-none hidden lg:block overflow-hidden"
      >
        <!-- Festive Snowman on Left Snowbank -->
        <div
          class="absolute left-6 xl:left-14 bottom-1 z-30 pointer-events-none select-none anim-snowman-idle drop-shadow-md"
        >
          <img
            :src="snowmanAsset"
            alt="Snowman"
            class="h-20 xl:h-24 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        <!-- Secondary Small Christmas Tree on Left Snowbank -->
        <div
          class="absolute left-24 xl:left-36 bottom-2 z-20 pointer-events-none select-none anim-tree-sway opacity-90 drop-shadow-sm"
        >
          <img
            :src="christmasTreeAsset"
            alt="Christmas Tree"
            class="h-14 xl:h-18 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        <!-- Festive Decorated Christmas Tree on Right Snowbank -->
        <div
          class="absolute right-6 xl:right-14 bottom-1 z-30 pointer-events-none select-none anim-tree-sway drop-shadow-lg"
        >
          <img
            :src="christmasTreeAsset"
            alt="Christmas Tree"
            class="h-24 xl:h-30 w-auto object-contain select-none pointer-events-none anim-tree-glow"
          />
        </div>

        <svg
          class="absolute bottom-0 left-0 right-0 w-full h-14 xl:h-18 anim-snow-pile"
          viewBox="0 0 1440 68"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="snow-grad-back-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85" />
              <stop offset="60%" stop-color="#E0F2FE" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#BAE6FD" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="snow-grad-mid-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
              <stop offset="50%" stop-color="#F0F9FF" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#E0F2FE" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="snow-grad-front-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
              <stop offset="40%" stop-color="#F8FAFC" stop-opacity="1" />
              <stop offset="100%" stop-color="#E2E8F0" stop-opacity="1" />
            </linearGradient>

            <linearGradient id="snow-grad-back-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.6" />
              <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#0F172A" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="snow-grad-front-dark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
              <stop offset="35%" stop-color="#E0F2FE" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98" />
            </linearGradient>

            <filter id="snow-edge-shadow" x="-5%" y="-15%" width="110%" height="130%">
              <feDropShadow
                dx="0"
                dy="-3"
                stdDeviation="4"
                flood-color="#0284c7"
                flood-opacity="0.25"
              />
            </filter>
          </defs>

          <!-- Layer 1: Back Undulating Snow Hills -->
          <path
            d="M0 68 L0 26 Q90 10 200 24 Q320 40 450 18 Q560 2 680 20 Q800 38 930 16 Q1040 0 1170 18 Q1300 36 1440 20 L1440 68 Z"
            class="snow-drift-back opacity-70"
          />

          <!-- Layer 2: Mid Puffy Snowdrifts -->
          <path
            d="M0 68 L0 32 Q120 16 260 28 Q390 40 520 22 Q650 6 780 25 Q910 42 1050 20 Q1190 4 1320 22 Q1380 28 1440 24 L1440 68 Z"
            class="snow-drift-mid opacity-85"
            style="filter: url(#snow-edge-shadow)"
          />

          <!-- Layer 3: Front Crisp Sticky Snowbanks -->
          <path
            d="M0 68 L0 38 Q80 20 180 32 Q280 44 380 26 Q490 10 600 28 Q720 44 840 22 Q960 6 1080 26 Q1200 44 1320 24 Q1380 16 1440 28 L1440 68 Z"
            class="snow-drift-front"
          />

          <!-- Glistening Snow Sparkles on the Peaks -->
          <g class="anim-snow-sparkle" style="--sparkle-delay: 0s">
            <polygon
              points="180,24 182,29 187,31 182,33 180,38 178,33 173,31 178,29"
              fill="#38BDF8"
            />
            <circle cx="180" cy="31" r="1.5" fill="#FFFFFF" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 0.8s">
            <polygon
              points="600,20 602,25 607,27 602,29 600,34 598,29 593,27 598,25"
              fill="#FBBF24"
            />
            <circle cx="600" cy="27" r="1.5" fill="#FFFFFF" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 1.5s">
            <polygon
              points="960,18 962,23 967,25 962,27 960,32 958,27 953,25 958,23"
              fill="#38BDF8"
            />
            <circle cx="960" cy="25" r="1.5" fill="#FFFFFF" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 0.4s">
            <polygon
              points="1320,16 1322,21 1327,23 1322,25 1320,30 1318,25 1313,23 1318,21"
              fill="#FBBF24"
            />
            <circle cx="1320" cy="23" r="1.5" fill="#FFFFFF" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 1.2s">
            <polygon
              points="380,20 382,24 386,26 382,28 380,32 378,28 374,26 378,24"
              fill="#38BDF8"
            />
            <circle cx="380" cy="26" r="1.2" fill="#FFFFFF" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 1.9s">
            <polygon
              points="840,16 842,20 846,22 842,24 840,28 838,24 834,22 838,20"
              fill="#F472B6"
            />
            <circle cx="840" cy="22" r="1.2" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      <!-- 3. Sticky Piles of Snow on Mobile with Snowman & Christmas Tree -->
      <div
        class="fixed bottom-[54px] sm:bottom-[60px] left-0 right-0 h-16 sm:h-20 pointer-events-none z-30 select-none lg:hidden overflow-hidden"
      >
        <!-- Mobile Snowman on Left edge of snow pile -->
        <div
          class="absolute left-2.5 bottom-0 z-30 pointer-events-none select-none anim-snowman-idle drop-shadow-sm"
        >
          <img
            :src="snowmanAsset"
            alt="Snowman"
            class="h-9 sm:h-11 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        <!-- Mobile Christmas Tree on Right edge of snow pile -->
        <div
          class="absolute right-2.5 bottom-0 z-30 pointer-events-none select-none anim-tree-sway drop-shadow-sm"
        >
          <img
            :src="christmasTreeAsset"
            alt="Christmas Tree"
            class="h-10 sm:h-12 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        <svg
          class="absolute bottom-0 left-0 right-0 w-full h-7 sm:h-9"
          viewBox="0 0 390 32"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 32 L0 14 Q30 4 65 12 Q100 20 135 8 Q170 2 205 10 Q245 20 285 6 Q320 0 355 10 Q375 16 390 12 L390 32 Z"
            class="fill-white dark:fill-slate-900 opacity-90"
            style="filter: drop-shadow(0 -2px 4px rgba(56, 189, 248, 0.35))"
          />
          <path
            d="M0 32 L0 18 Q35 10 70 16 Q110 22 145 12 Q180 6 220 14 Q260 22 295 10 Q335 4 370 14 Q380 16 390 16 L390 32 Z"
            class="fill-white dark:fill-sky-950 opacity-95"
          />
          <g class="anim-snow-sparkle" style="--sparkle-delay: 0.3s">
            <polygon points="70,10 71,13 74,14 71,15 70,18 69,15 66,14 69,13" fill="#38BDF8" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 1.1s">
            <polygon points="210,6 211,9 214,10 211,11 210,14 209,11 206,10 209,9" fill="#FBBF24" />
          </g>
          <g class="anim-snow-sparkle" style="--sparkle-delay: 1.7s">
            <polygon points="325,4 326,7 329,8 326,9 325,12 324,9 321,8 324,7" fill="#38BDF8" />
          </g>
        </svg>
      </div>
    </template>

    <!-- 2. Valentine's Day Falling Hearts Animation -->
    <template v-if="isValentineActive">
      <div
        v-for="heart in hearts"
        :key="'heart-' + heart.id"
        class="absolute select-none pointer-events-none"
        :style="{
          left: heart.left,
          top: '-40px',
          width: heart.size + 'px',
          height: heart.size + 'px',
          opacity: heart.opacity,
          animation: `heart-fall ${heart.duration} linear infinite`,
          animationDelay: heart.delay,
        }"
      >
        <img
          :src="heartAsset"
          alt=""
          class="w-full h-full object-contain heart-shadow select-none pointer-events-none"
          :style="{
            animation: `heart-flutter ${heart.flutterDuration} ease-in-out infinite`,
            animationDelay: heart.delay,
          }"
        />
      </div>
    </template>

    <!-- 3. Chinese New Year Falling Red Envelopes (Hongbao) Animation -->
    <template v-if="isCNYActive">
      <div
        v-for="env in envelopes"
        :key="'env-' + env.id"
        class="absolute select-none pointer-events-none"
        :style="{
          left: env.left,
          top: '-50px',
          width: env.width + 'px',
          height: env.width * 1.5 + 'px',
          opacity: env.opacity,
          animation: `envelope-fall ${env.duration} linear infinite`,
          animationDelay: env.delay,
        }"
      >
        <img
          :src="redEnvelopeAsset"
          alt=""
          class="w-full h-full object-contain envelope-shadow select-none pointer-events-none"
          :style="{
            animation: `envelope-sway ${env.swayDuration} ease-in-out infinite`,
            animationDelay: env.delay,
          }"
        />
      </div>
    </template>

    <!-- 4. Cambodia Seasonal Animations (Rainy & Dry) -->
    <template v-if="enableSeasonsAnim">
      <!-- Rainy Season: May - Oct (រដូវវស្សា) -->
      <template v-if="isRainySeason">
        <div
          v-for="drop in raindrops"
          :key="'rain-' + drop.id"
          class="absolute w-[1.5px] rounded-full bg-gradient-to-b from-cyan-300/30 via-blue-400/50 to-cyan-200/70 dark:from-cyan-400/30 dark:to-blue-300/60"
          :style="{
            left: drop.left,
            top: '-50px',
            height: drop.height,
            opacity: drop.opacity,
            animation: `rain-fall ${drop.duration} linear infinite`,
            animationDelay: drop.delay,
          }"
        ></div>
      </template>

      <!-- Dry Season: Nov - Apr (រដូវប្រាំង) except December -->
      <template v-else-if="isDrySeason">
        <div
          v-for="p in dryParticles"
          :key="'dry-' + p.id"
          class="absolute rounded-full bg-gradient-to-tr from-amber-300/60 to-yellow-200/80 shadow-xs blur-[0.5px]"
          :style="{
            left: p.left,
            bottom: '-40px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `dry-float ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }"
        ></div>
      </template>
    </template>
  </div>

  <!-- 5. January Happy New Year Floating Celebration Banner -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform -translate-y-12 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform -translate-y-12 opacity-0 scale-95"
    >
      <div
        v-if="showNewYearBanner && isJanuary"
        class="pointer-events-auto fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 sm:gap-3.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-slate-900/95 text-white shadow-2xl shadow-amber-500/40 border border-amber-400/60 backdrop-blur-xl animate-in fade-in"
      >
        <span class="text-xl sm:text-2xl animate-bounce select-none">🎆</span>
        <div class="text-center sm:text-left">
          <div
            class="text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-300 via-rose-300 to-yellow-200 bg-clip-text text-transparent"
          >
            រីករាយឆ្នាំថ្មី {{ formattedKhmerYear }}!
          </div>
          <div class="text-[10px] sm:text-xs font-semibold text-slate-200">
            Happy New Year {{ gregorianYear }}!
          </div>
        </div>
        <span class="text-lg sm:text-xl select-none">🎉</span>
        <button
          type="button"
          @click="dismissBanner"
          class="ml-1 -mr-1 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="បិទ (Close)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
