import { ref, type Ref } from 'vue'

export interface SwipeNavigationOptions {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  disabled?: Ref<boolean>
  threshold?: number
  maxVerticalRatio?: number
  maxDurationMs?: number
}

export function useSwipeNavigation(options: SwipeNavigationOptions) {
  const threshold = options.threshold ?? 50
  const maxVerticalRatio = options.maxVerticalRatio ?? 0.7
  const maxDurationMs = options.maxDurationMs ?? 800

  const swipeOffsetX = ref(0)
  const isSwiping = ref(false)

  let startX = 0
  let startY = 0
  let startTime = 0
  let tracking = false
  let directionLock: 'horizontal' | 'vertical' | null = null

  function resetSwipe() {
    tracking = false
    directionLock = null
    isSwiping.value = false
    swipeOffsetX.value = 0
  }

  function onTouchStart(e: TouchEvent) {
    if (options.disabled?.value) return
    if (e.touches.length !== 1) {
      resetSwipe()
      return
    }
    const touch = e.touches[0]
    if (!touch) return

    startX = touch.clientX
    startY = touch.clientY
    startTime = Date.now()
    tracking = true
    directionLock = null
    swipeOffsetX.value = 0
    isSwiping.value = false
  }

  function onTouchMove(e: TouchEvent) {
    if (!tracking || options.disabled?.value) return
    if (e.touches.length !== 1) {
      resetSwipe()
      return
    }
    const touch = e.touches[0]
    if (!touch) return

    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    // Determine gesture intent after a tiny dead-zone (10px)
    if (directionLock === null) {
      if (absX < 10 && absY < 10) return
      directionLock = absX > absY * 1.2 ? 'horizontal' : 'vertical'
    }

    if (directionLock === 'vertical') {
      // Allow native vertical scrolling uninterrupted
      resetSwipe()
      return
    }

    // Subtle damped rubber-band horizontal feedback (clamped to ±32px)
    isSwiping.value = true
    const damped = Math.sign(dx) * Math.min(32, absX * 0.25)
    swipeOffsetX.value = damped
  }

  function onTouchEnd(e: TouchEvent) {
    if (!tracking || options.disabled?.value) {
      resetSwipe()
      return
    }

    const touch = e.changedTouches[0]
    if (!touch) {
      resetSwipe()
      return
    }

    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    const dt = Date.now() - startTime
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    resetSwipe()

    if (absX >= threshold && absY <= absX * maxVerticalRatio && dt <= maxDurationMs) {
      if (dx < 0) {
        options.onSwipeLeft()
      } else {
        options.onSwipeRight()
      }
    }
  }

  function onTouchCancel() {
    resetSwipe()
  }

  return {
    swipeOffsetX,
    isSwiping,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  }
}
