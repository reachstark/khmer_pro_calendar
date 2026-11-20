import { ref, onMounted } from 'vue'

const visitorCount = ref<number | null>(null)
const pageviewsCount = ref<number | null>(null)
const isLoading = ref(true)
let hasFetched = false

interface VisitorsApiResponse {
  visitors?: number
  pageviews?: number
}

export function useVisitorCount() {
  const LOCAL_CACHE_KEY = 'khmer_calendar_cached_visits'
  const LOCAL_PAGEVIEWS_CACHE_KEY = 'khmer_calendar_cached_pageviews'

  async function fetchVisitorCount() {
    isLoading.value = true
    try {
      // Query our Vercel Serverless Function which proxies Vercel Web Analytics REST API
      // (GET https://api.vercel.com/v1/query/web-analytics/visits/count)
      const res = await fetch('/api/visitors', {
        headers: {
          Accept: 'application/json',
        },
      })

      const contentType = res.headers.get('content-type') || ''
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`HTTP error ${res.status}`)
      }

      const data = (await res.json()) as VisitorsApiResponse
      if (typeof data.visitors === 'number') {
        visitorCount.value = data.visitors
        localStorage.setItem(LOCAL_CACHE_KEY, String(data.visitors))

        if (typeof data.pageviews === 'number') {
          pageviewsCount.value = data.pageviews
          localStorage.setItem(LOCAL_PAGEVIEWS_CACHE_KEY, String(data.pageviews))
        }

        isLoading.value = false
        return
      }
    } catch (e) {
      console.warn('Vercel Web Analytics visitor query unavailable, trying cached value:', e)
    }

    // Graceful fallback: LocalStorage cached count (e.g., offline or local dev without Vercel CLI)
    const cached = localStorage.getItem(LOCAL_CACHE_KEY)
    if (cached !== null) {
      const parsed = parseInt(cached, 10)
      if (!Number.isNaN(parsed)) {
        visitorCount.value = parsed
      }
    }

    const cachedPageviews = localStorage.getItem(LOCAL_PAGEVIEWS_CACHE_KEY)
    if (cachedPageviews !== null) {
      const parsed = parseInt(cachedPageviews, 10)
      if (!Number.isNaN(parsed)) {
        pageviewsCount.value = parsed
      }
    }

    isLoading.value = false
  }

  onMounted(() => {
    if (!hasFetched) {
      hasFetched = true
      fetchVisitorCount()
    }
  })

  return {
    visitorCount,
    pageviewsCount,
    isLoading,
    refreshCount: fetchVisitorCount,
  }
}
