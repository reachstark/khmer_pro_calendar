import { ref, onMounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const canInstall = ref(false)
const isInstalled = ref(false)
const isInstallHelpOpen = ref(false)

export function usePwaInstall() {
  function checkStandalone() {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  }

  onMounted(() => {
    isInstalled.value = checkStandalone()

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      canInstall.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      canInstall.value = false
      deferredPrompt.value = null
    })
  })

  async function triggerInstall(): Promise<'accepted' | 'dismissed' | 'manual'> {
    if (deferredPrompt.value) {
      await deferredPrompt.value.prompt()
      const choice = await deferredPrompt.value.userChoice
      if (choice.outcome === 'accepted') {
        canInstall.value = false
        deferredPrompt.value = null
      }
      return choice.outcome
    } else {
      // Show manual install guidance
      isInstallHelpOpen.value = true
      return 'manual'
    }
  }

  return {
    canInstall,
    isInstalled,
    isInstallHelpOpen,
    triggerInstall,
  }
}
