import { ref, onMounted } from 'vue'

const visitorCount = ref<number | null>(null)
const isLoading = ref(true)

export function useVisitorCount() {
  const SESSION_KEY = 'khmer_calendar_session_counted'
  const LOCAL_CACHE_KEY = 'khmer_calendar_cached_visits'
  const API_KEY = 'khmer_pro_calendar_visits'

  async function fetchVisitorCount() {
    try {
      const isAlreadyCounted = sessionStorage.getItem(SESSION_KEY) === 'true'
      const endpoint = isAlreadyCounted
        ? `https://countapi.mileshilliard.com/api/v1/get/${API_KEY}`
        : `https://countapi.mileshilliard.com/api/v1/hit/${API_KEY}`

      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const data = await res.json()
      if (typeof data.value === 'number') {
        visitorCount.value = data.value
        localStorage.setItem(LOCAL_CACHE_KEY, String(data.value))
        sessionStorage.setItem(SESSION_KEY, 'true')
        isLoading.value = false
        return
      }
    } catch (e) {
      console.warn('Primary visitor counter failed, trying cached or fallback:', e)
    }

    // Fallback 1: LocalStorage cached count
    const cached = localStorage.getItem(LOCAL_CACHE_KEY)
    if (cached) {
      visitorCount.value = parseInt(cached, 10)
    } else {
      visitorCount.value = 1
    }
    isLoading.value = false
  }

  onMounted(() => {
    if (visitorCount.value === null) {
      fetchVisitorCount()
    }
  })

  return {
    visitorCount,
    isLoading,
    refreshCount: fetchVisitorCount,
  }
}
