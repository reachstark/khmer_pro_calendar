<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarState } from '@/composables/useCalendarState'
import { useCalendarSettings } from '@/composables/useCalendarSettings'

const { currentMonth } = useCalendarState()
const { enableSeasonsAnim } = useCalendarSettings()

// December has exclusive snowing animation
const isDecember = computed(() => currentMonth.value === 11)

// Cambodia Seasons:
// Rainy Season (រដូវវស្សា): May (4) to October (9)
// Dry Season (រដូវប្រាំង): November (10) to April (3)
const isRainySeason = computed(() => currentMonth.value >= 4 && currentMonth.value <= 9)
const isDrySeason = computed(() => !isDecember.value && (currentMonth.value <= 3 || currentMonth.value === 10))

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
</template>
