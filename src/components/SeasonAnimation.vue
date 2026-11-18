<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { X, Sparkles } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'
import { toKhmerNumber } from '@/utils/khmerCalendar'

const { currentMonth, currentYear } = useCalendarState()
const { enableSeasonsAnim } = useCalendarSettings()

// December has exclusive snowing animation
const isDecember = computed(() => currentMonth.value === 11)

// January New Year Celebration & Fireworks
const showNewYearBanner = ref(false)
let bannerTimer: ReturnType<typeof setTimeout> | null = null
let wave1Timer: ReturnType<typeof setTimeout> | null = null
let wave2Timer: ReturnType<typeof setTimeout> | null = null

function triggerJanuaryFireworks() {
  showNewYearBanner.value = true
  if (bannerTimer) clearTimeout(bannerTimer)
  if (wave1Timer) clearTimeout(wave1Timer)
  if (wave2Timer) clearTimeout(wave2Timer)

  // Stage 1: Central fireworks burst
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

  // Stage 2: Left and right fireworks cannons (350ms)
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

  // Stage 3: High golden sparkles raining down (850ms)
  wave2Timer = setTimeout(() => {
    confetti({
      particleCount: 70,
      spread: 100,
      origin: { x: 0.5, y: 0.35 },
      zIndex: 120,
      colors: ['#FBBF24', '#F59E0B', '#FDE047', '#38BDF8'],
    })
  }, 850)

  // Auto-dismiss banner after 5.5 seconds
  bannerTimer = setTimeout(() => {
    showNewYearBanner.value = false
  }, 5500)
}

function dismissBanner() {
  showNewYearBanner.value = false
  if (bannerTimer) clearTimeout(bannerTimer)
}

// Watch for viewing January (entry)
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

// Cambodia Seasons:
// Rainy Season (រដូវវស្សា): May (4) to October (9)
// Dry Season (រដូវប្រាំង): November (10) to April (3)
const isRainySeason = computed(() => currentMonth.value >= 4 && currentMonth.value <= 9)
const isDrySeason = computed(
  () => !isDecember.value && (currentMonth.value <= 3 || currentMonth.value === 10),
)

// Generate static deterministic particles for performance
const snowflakes = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: `${(i * 3.125 + (i % 5) * 2.5) % 98}%`,
  size: `${5 + (i % 6) * 2}px`,
  duration: `${4 + (i % 5) * 1.5}s`,
  delay: `${(i * 0.28) % 4}s`,
  opacity: 0.4 + (i % 5) * 0.12,
}))

const raindrops = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: `${(i * 2.77 + (i % 7) * 3) % 99}%`,
  height: `${14 + (i % 6) * 5}px`,
  duration: `${0.9 + (i % 4) * 0.25}s`,
  delay: `${(i * 0.12) % 2}s`,
  opacity: 0.35 + (i % 4) * 0.1,
}))

const dryParticles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 4.16 + (i % 6) * 3) % 98}%`,
  size: `${4 + (i % 5) * 2}px`,
  duration: `${7 + (i % 4) * 2}s`,
  delay: `${(i * 0.35) % 5}s`,
  opacity: 0.3 + (i % 4) * 0.1,
}))
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
    <!-- 1. Exclusive December Snowing Animation -->
    <template v-if="isDecember">
      <div
        v-for="flake in snowflakes"
        :key="'snow-' + flake.id"
        class="absolute rounded-full bg-white dark:bg-sky-100 shadow-xs"
        :style="{
          left: flake.left,
          top: '-20px',
          width: flake.size,
          height: flake.size,
          opacity: flake.opacity,
          animation: `snowfall ${flake.duration} linear infinite`,
          animationDelay: flake.delay,
        }"
      ></div>
    </template>

    <!-- 2. Cambodia Seasonal Animations (Rainy & Dry) -->
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

  <!-- 3. January Happy New Year Floating Celebration Banner (Teleported to body with z-[60] so it NEVER appears behind the top bar) -->
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
        v-if="showNewYearBanner && currentMonth === 0"
        class="pointer-events-auto fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 sm:gap-3.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-slate-900/95 text-white shadow-2xl shadow-amber-500/40 border border-amber-400/60 backdrop-blur-xl animate-in fade-in"
      >
        <span class="text-xl sm:text-2xl animate-bounce select-none">🎆</span>
        <div class="text-center sm:text-left">
          <div
            class="text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-300 via-rose-300 to-yellow-200 bg-clip-text text-transparent"
          >
            រីករាយឆ្នាំថ្មី {{ toKhmerNumber(currentYear) }}!
          </div>
          <div class="text-[10px] sm:text-xs font-semibold text-slate-200">
            Happy New Year {{ currentYear }}!
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
