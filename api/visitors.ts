const VERCEL_VISITS_COUNT_ENDPOINT = 'https://api.vercel.com/v1/query/web-analytics/visits/count'

interface VercelVisitsCountResponse {
  version: number
  query?: Record<string, unknown>
  data?: {
    pageviews?: number
    visitors?: number
  }
}

export async function GET(request: Request): Promise<Response> {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID
  const teamSlug = process.env.VERCEL_TEAM_SLUG
  const defaultFilter = process.env.VERCEL_ANALYTICS_FILTER

  if (!token || !projectId) {
    return Response.json(
      {
        error:
          'Vercel Web Analytics API is not configured (missing VERCEL_TOKEN or VERCEL_PROJECT_ID).',
      },
      { status: 503 },
    )
  }

  const reqUrl = new URL(request.url)
  const filter = reqUrl.searchParams.get('filter') || defaultFilter || ''

  const params = new URLSearchParams()
  params.set('projectId', projectId)

  // Include teamId or slug only for team projects; omit both for personal account projects
  if (teamId) {
    params.set('teamId', teamId)
  } else if (teamSlug) {
    params.set('slug', teamSlug)
  }

  if (filter) {
    params.set('filter', filter)
  }

  const upstreamUrl = `${VERCEL_VISITS_COUNT_ENDPOINT}?${params.toString()}`

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!upstreamRes.ok) {
      const errorText = await upstreamRes.text().catch(() => '')
      return Response.json(
        {
          error: 'Failed to query Vercel Web Analytics API.',
          status: upstreamRes.status,
          details: errorText.slice(0, 300),
        },
        { status: upstreamRes.status >= 500 ? 502 : upstreamRes.status },
      )
    }

    const payload = (await upstreamRes.json()) as VercelVisitsCountResponse
    const visitors = typeof payload.data?.visitors === 'number' ? payload.data.visitors : 0
    const pageviews = typeof payload.data?.pageviews === 'number' ? payload.data.pageviews : 0

    return Response.json(
      {
        visitors,
        pageviews,
      },
      {
        status: 200,
        headers: {
          // Cache at the Vercel Edge for 5 minutes, serve stale up to 10 minutes while revalidating
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    )
  } catch (err) {
    return Response.json(
      {
        error: 'Unexpected error while querying Vercel Web Analytics API.',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    )
  }
}
