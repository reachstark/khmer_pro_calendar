<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import batAnimationData from '@/assets/lottie/halloween_bat.json'

const props = withDefaults(
  defineProps<{
    elevated?: boolean
  }>(),
  {
    elevated: false,
  },
)

// ============================================================================
// Ultra-Optimized Lottie Sprite-Sheet Engine
// ============================================================================
// Instead of spawning 8 separate Lottie instances (each rasterizing 1024x1024
// vectors 60 times/sec), we use ONE temporary offscreen Lottie canvas to bake
// 24 frames of the wing-flap cycle into two compact 960x640 sprite sheets
// (Light + Dark mode), then IMMEDIATELY destroy the Lottie instance.
// Runtime cost: 1 single 2D canvas + 8 GPU drawImage() blits (< 0.15ms/frame).
// ============================================================================

const FRAME_SIZE = 160
const FRAME_COUNT = 24
const SHEET_COLS = 6
const SHEET_ROWS = 4 // 6 * 4 = 24 frames
const SHEET_W = FRAME_SIZE * SHEET_COLS // 960px
const SHEET_H = FRAME_SIZE * SHEET_ROWS // 640px

// Module-level cached sprite sheets so revisiting Halloween costs 0ms & 0 re-bakes
let cachedLightSheet: HTMLCanvasElement | null = null
let cachedDarkSheet: HTMLCanvasElement | null = null

interface BatEntity {
  x: number
  baseY: number
  direction: 1 | -1 // 1 = left -> right, -1 = right -> left
  size: number
  speed: number // px per second
  waveAmp: number
  waveFreq: number
  wavePhase: number
  flapPhase: number
  flapFps: number
  opacity: number
}

function bakeBatSpriteSheets(): { light: HTMLCanvasElement; dark: HTMLCanvasElement } | null {
  if (cachedLightSheet && cachedDarkSheet) {
    return { light: cachedLightSheet, dark: cachedDarkSheet }
  }
  if (typeof document === 'undefined') return null

  const lightSheet = document.createElement('canvas')
  lightSheet.width = SHEET_W
  lightSheet.height = SHEET_H
  const lightCtx = lightSheet.getContext('2d')

  const darkSheet = document.createElement('canvas')
  darkSheet.width = SHEET_W
  darkSheet.height = SHEET_H
  const darkCtx = darkSheet.getContext('2d')

  if (!lightCtx || !darkCtx) return null

  // Temporary hidden offscreen container at 160x160 (41x fewer pixels than 1024x1024)
  const tempHost = document.createElement('div')
  tempHost.style.cssText =
    'position:fixed;left:-9999px;top:-9999px;width:160px;height:160px;pointer-events:none;opacity:0;overflow:hidden;'
  document.body.appendChild(tempHost)

  // Dedicated tiny scratch canvas to style each dark-mode frame once during bake
  const tintCanvas = document.createElement('canvas')
  tintCanvas.width = FRAME_SIZE
  tintCanvas.height = FRAME_SIZE
  const tintCtx = tintCanvas.getContext('2d')

  let tempAnim: ReturnType<typeof lottie.loadAnimation> | null = null

  try {
    // Deep clone so lottie-web never mutates the imported JSON singleton
    const clonedData = JSON.parse(JSON.stringify(batAnimationData))
    const totalFrames = typeof clonedData.op === 'number' ? clonedData.op : 49

    tempAnim = lottie.loadAnimation({
      container: tempHost,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      animationData: clonedData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true,
      },
    })

    const sourceCanvas = tempHost.querySelector('canvas')
    if (!sourceCanvas) return null

    for (let i = 0; i < FRAME_COUNT; i++) {
      const frameIndex = (i / FRAME_COUNT) * totalFrames
      tempAnim.goToAndStop(frameIndex, true)

      const col = i % SHEET_COLS
      const row = Math.floor(i / SHEET_COLS)
      const dx = col * FRAME_SIZE
      const dy = row * FRAME_SIZE

      // 1. Light mode frame: crisp dark silhouette directly from Lottie
      lightCtx.clearRect(dx, dy, FRAME_SIZE, FRAME_SIZE)
      lightCtx.drawImage(
        sourceCanvas,
        0,
        0,
        sourceCanvas.width,
        sourceCanvas.height,
        dx,
        dy,
        FRAME_SIZE,
        FRAME_SIZE,
      )

      // 2. Dark mode frame: spooky violet-indigo silhouette with soft moonlit rim glow
      if (tintCtx) {
        tintCtx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE)
        tintCtx.globalCompositeOperation = 'source-over'
        tintCtx.drawImage(
          sourceCanvas,
          0,
          0,
          sourceCanvas.width,
          sourceCanvas.height,
          0,
          0,
          FRAME_SIZE,
          FRAME_SIZE,
        )
        // Tint pure black silhouette to deep spooky indigo so it has presence on slate-950
        tintCtx.globalCompositeOperation = 'source-atop'
        tintCtx.fillStyle = '#312e81'
        tintCtx.fillRect(0, 0, FRAME_SIZE, FRAME_SIZE)
        tintCtx.globalCompositeOperation = 'source-over'

        darkCtx.save()
        darkCtx.clearRect(dx, dy, FRAME_SIZE, FRAME_SIZE)
        darkCtx.shadowColor = 'rgba(192, 132, 252, 0.92)'
        darkCtx.shadowBlur = 10
        darkCtx.drawImage(tintCanvas, dx, dy)
        darkCtx.restore()
      }
    }

    cachedLightSheet = lightSheet
    cachedDarkSheet = darkSheet
    return { light: lightSheet, dark: darkSheet }
  } catch (err) {
    console.error('Failed to bake Halloween bat Lottie sprite sheet:', err)
    return null
  } finally {
    // Destroy temporary Lottie instance immediately: 0 ongoing Lottie runtime overhead
    if (tempAnim) {
      try {
        tempAnim.destroy()
      } catch {
        // ignore
      }
    }
    tempHost.remove()
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId: number | null = null
let lastTimestamp = 0
let viewportW = 0
let viewportH = 0
let isDarkTheme = false
let prefersReducedMotion = false
let bats: BatEntity[] = []
let themeObserver: MutationObserver | null = null

function createBats(w: number, h: number): BatEntity[] {
  // Strictly <= 10 bats: 8 on desktop/tablet (4 left->right, 4 right->left), 6 on mobile (3 + 3)
  const count = w < 768 ? 6 : 8
  const presets = [
    {
      yRatio: 0.12,
      sizeDesktop: 78,
      sizeMobile: 56,
      speed: 125,
      amp: 24,
      freq: 1.7,
      opacity: 0.92,
    },
    { yRatio: 0.24, sizeDesktop: 56, sizeMobile: 42, speed: 92, amp: 18, freq: 2.1, opacity: 0.72 },
    {
      yRatio: 0.37,
      sizeDesktop: 88,
      sizeMobile: 62,
      speed: 145,
      amp: 30,
      freq: 1.4,
      opacity: 0.95,
    },
    { yRatio: 0.51, sizeDesktop: 64, sizeMobile: 48, speed: 108, amp: 22, freq: 1.9, opacity: 0.8 },
    {
      yRatio: 0.65,
      sizeDesktop: 74,
      sizeMobile: 54,
      speed: 132,
      amp: 26,
      freq: 1.6,
      opacity: 0.88,
    },
    { yRatio: 0.78, sizeDesktop: 52, sizeMobile: 40, speed: 88, amp: 16, freq: 2.3, opacity: 0.68 },
    {
      yRatio: 0.18,
      sizeDesktop: 68,
      sizeMobile: 50,
      speed: 118,
      amp: 20,
      freq: 1.8,
      opacity: 0.84,
    },
    {
      yRatio: 0.58,
      sizeDesktop: 60,
      sizeMobile: 45,
      speed: 100,
      amp: 25,
      freq: 2.0,
      opacity: 0.76,
    },
  ]

  const isMobile = w < 768
  const result: BatEntity[] = []

  for (let i = 0; i < count; i++) {
    const p = presets[i % presets.length]!
    // Alternate directions evenly: half fly left -> right (+1), half fly right -> left (-1)
    const direction: 1 | -1 = i % 2 === 0 ? 1 : -1
    const size = isMobile ? p.sizeMobile : p.sizeDesktop
    const speedScale = prefersReducedMotion ? 0.45 : isMobile ? 0.75 : 1

    // Stagger starting positions so some bats are immediately visible while others enter shortly
    const laneProgress = ((i * 0.27 + 0.08) % 1.15) - 0.1
    const startX = direction === 1 ? laneProgress * w : (1 - laneProgress) * w

    result.push({
      x: startX,
      baseY: Math.max(48, Math.min(h - 72, p.yRatio * h)),
      direction,
      size,
      speed: p.speed * speedScale,
      waveAmp: p.amp,
      waveFreq: p.freq,
      wavePhase: i * 1.35,
      flapPhase: (i * 3.7) % FRAME_COUNT,
      flapFps: prefersReducedMotion ? 16 : 24 + (i % 4) * 2.5,
      opacity: p.opacity,
    })
  }

  return result
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas || typeof window === 'undefined') return

  viewportW = window.innerWidth
  viewportH = window.innerHeight
  // Cap DPR at 2 to keep GPU fill-rate ultra-light on high-DPI mobile screens
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.floor(viewportW * dpr)
  canvas.height = Math.floor(viewportH * dpr)
  canvas.style.width = `${viewportW}px`
  canvas.style.height = `${viewportH}px`

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  if (bats.length === 0) {
    bats = createBats(viewportW, viewportH)
  }
}

function updateThemeFlag() {
  if (typeof document !== 'undefined') {
    isDarkTheme = document.documentElement.classList.contains('dark')
  }
}

function renderLoop(timestamp: number) {
  const canvas = canvasRef.value
  const sheets =
    cachedLightSheet && cachedDarkSheet ? { light: cachedLightSheet, dark: cachedDarkSheet } : null

  if (!canvas || !sheets) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (lastTimestamp === 0) {
    lastTimestamp = timestamp
  }
  // Clamp dt to max 50ms so returning from a suspended tab never teleports bats abruptly
  const dt = Math.min(0.05, Math.max(0, (timestamp - lastTimestamp) / 1000))
  lastTimestamp = timestamp

  const elapsedSec = timestamp / 1000
  const sheet = isDarkTheme ? sheets.dark : sheets.light

  ctx.clearRect(0, 0, viewportW, viewportH)

  for (let i = 0; i < bats.length; i++) {
    const bat = bats[i]!

    // Advance horizontal flight & wing-flap frame
    bat.x += bat.direction * bat.speed * dt
    bat.flapPhase = (bat.flapPhase + bat.flapFps * dt) % FRAME_COUNT

    // Wrap smoothly around opposite screen edge with gently varied altitude
    const margin = bat.size * 1.15
    if (bat.direction === 1 && bat.x > viewportW + margin) {
      bat.x = -margin
      bat.baseY = Math.max(
        48,
        Math.min(viewportH - 72, ((bat.baseY + viewportH * 0.23) % (viewportH * 0.78)) + 48),
      )
    } else if (bat.direction === -1 && bat.x < -margin) {
      bat.x = viewportW + margin
      bat.baseY = Math.max(
        48,
        Math.min(viewportH - 72, ((bat.baseY + viewportH * 0.29) % (viewportH * 0.78)) + 48),
      )
    }

    const waveAngle = elapsedSec * bat.waveFreq + bat.wavePhase
    const currentY = bat.baseY + Math.sin(waveAngle) * bat.waveAmp
    // Subtle organic flight pitch following vertical velocity
    const vy = Math.cos(waveAngle) * bat.waveAmp * bat.waveFreq
    const tilt = Math.max(-0.22, Math.min(0.22, (vy / bat.speed) * 0.4))

    const frameIdx = Math.floor(bat.flapPhase) % FRAME_COUNT
    const sx = (frameIdx % SHEET_COLS) * FRAME_SIZE
    const sy = Math.floor(frameIdx / SHEET_COLS) * FRAME_SIZE

    ctx.save()
    ctx.globalAlpha = bat.opacity
    ctx.translate(bat.x, currentY)
    // Flip horizontally for bats flying right -> left so both directions look natural
    if (bat.direction === -1) {
      ctx.scale(-1, 1)
      ctx.rotate(-tilt)
    } else {
      ctx.rotate(tilt)
    }

    const half = bat.size / 2
    ctx.drawImage(sheet, sx, sy, FRAME_SIZE, FRAME_SIZE, -half, -half, bat.size, bat.size)
    ctx.restore()
  }

  rafId = window.requestAnimationFrame(renderLoop)
}

function startLoop() {
  if (rafId !== null || typeof window === 'undefined') return
  lastTimestamp = 0
  rafId = window.requestAnimationFrame(renderLoop)
}

function stopLoop() {
  if (rafId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTimestamp = 0
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopLoop()
  } else {
    startLoop()
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  updateThemeFlag()

  // Observe light/dark theme toggles on <html>
  themeObserver = new MutationObserver(updateThemeFlag)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  const sheets = bakeBatSpriteSheets()
  if (!sheets) return

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)

  if (!document.hidden) {
    startLoop()
  }
})

onUnmounted(() => {
  stopLoop()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeCanvas)
  }
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
  }
  bats = []
})
</script>

<template>
  <Teleport to="body">
    <canvas
      ref="canvasRef"
      class="pointer-events-none fixed inset-0 select-none"
      :class="props.elevated ? 'z-[55]' : 'z-20'"
      aria-hidden="true"
    ></canvas>
  </Teleport>
</template>
