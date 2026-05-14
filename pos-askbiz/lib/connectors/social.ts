// ============================================================
// Social Commerce Connectors
// TikTok Shop · Instagram Shopping · Pinterest
// Token-based (user pastes access token from platform dashboard)
// ============================================================

// ── TikTok Shop ───────────────────────────────────────────────
// Uses TikTok Shop Partner API
// Token obtained from: TikTok Shop Partner Center > Apps > Access Token

export async function fetchTikTokShopOrders(
  accessToken: string,
  shopId: string,
  daysBack = 30
): Promise<Record<string, unknown>[]> {
  const since = Math.floor((Date.now() - daysBack * 24 * 60 * 60 * 1000) / 1000)
  const until = Math.floor(Date.now() / 1000)

  try {
    const res = await fetch(
      `https://open-api.tiktokglobalshop.com/order/202309/orders/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
        },
        body: JSON.stringify({
          order_status: 'COMPLETED',
          create_time_ge: since,
          create_time_lt: until,
          page_size: 100,
        }),
      }
    )
    if (!res.ok) throw new Error(`TikTok orders failed: ${res.status}`)
    const data = await res.json()
    return data?.data?.order_list || []
  } catch {
    return []
  }
}

export async function fetchTikTokShopProducts(
  accessToken: string
): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `https://open-api.tiktokglobalshop.com/product/202309/products/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
        },
        body: JSON.stringify({ page_size: 100, status: 'ACTIVATE' }),
      }
    )
    if (!res.ok) throw new Error(`TikTok products failed: ${res.status}`)
    const data = await res.json()
    return data?.data?.products || []
  } catch {
    return []
  }
}

export async function fetchTikTokShopAnalytics(
  accessToken: string,
  daysBack = 30
): Promise<Record<string, unknown>[]> {
  // TikTok Shop video performance analytics
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  try {
    const res = await fetch(
      `https://open-api.tiktokglobalshop.com/analytics/202309/product_performance`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tts-access-token': accessToken,
        },
        body: JSON.stringify({ start_date: startDate, end_date: endDate, page_size: 100 }),
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.data?.list || []
  } catch {
    return []
  }
}

// ── Instagram Shopping (Meta Graph API) ──────────────────────
// Token obtained from: Meta Business Suite > Settings > Business Assets > Apps
// Requires: instagram_basic, catalog_management, instagram_shopping_tag_products

export async function fetchInstagramProducts(
  accessToken: string,
  catalogId: string
): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${catalogId}/products?fields=id,name,price,currency,availability,image_url,product_type&limit=100&access_token=${accessToken}`
    )
    if (!res.ok) throw new Error(`Instagram products failed: ${res.status}`)
    const data = await res.json()
    return data?.data || []
  } catch {
    return []
  }
}

export async function fetchInstagramInsights(
  accessToken: string,
  igUserId: string,
  daysBack = 30
): Promise<Record<string, unknown>[]> {
  // Instagram media insights — reach, saves, product_clicks
  try {
    const mediaRes = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}/media?fields=id,media_type,timestamp,like_count,comments_count&limit=50&access_token=${accessToken}`
    )
    if (!mediaRes.ok) return []
    const mediaData = await mediaRes.json()
    const posts = mediaData?.data || []

    // Fetch insights per post
    const insights = await Promise.all(
      posts.slice(0, 20).map(async (post: Record<string, unknown>) => {
        try {
          const insightRes = await fetch(
            `https://graph.facebook.com/v18.0/${post.id}/insights?metric=reach,saved,impressions,profile_visits&access_token=${accessToken}`
          )
          if (!insightRes.ok) return { ...post, insights: {} }
          const insightData = await insightRes.json()
          const metrics: Record<string, number> = {}
          for (const item of insightData?.data || []) {
            metrics[item.name] = item.values?.[0]?.value || 0
          }
          return { ...post, ...metrics }
        } catch {
          return post
        }
      })
    )
    return insights
  } catch {
    return []
  }
}

export async function fetchInstagramShoppingOrders(
  accessToken: string,
  catalogId: string
): Promise<Record<string, unknown>[]> {
  // Instagram Commerce Orders via Meta Commerce API
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${catalogId}/orders?fields=id,order_status,created_time,items,estimated_payment_details&limit=100&access_token=${accessToken}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.data || []
  } catch {
    return []
  }
}

// ── Pinterest ─────────────────────────────────────────────────
// Token obtained from: Pinterest Business > Apps > Generate Access Token
// Requires: boards:read, pins:read, user_accounts:read, catalogs:read

export async function fetchPinterestCatalogItems(
  accessToken: string
): Promise<Record<string, unknown>[]> {
  try {
    const res = await fetch(
      `https://api.pinterest.com/v5/catalogs/items?page_size=100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!res.ok) throw new Error(`Pinterest catalog failed: ${res.status}`)
    const data = await res.json()
    return data?.items || []
  } catch {
    return []
  }
}

export async function fetchPinterestAnalytics(
  accessToken: string,
  daysBack = 30
): Promise<Record<string, unknown>[]> {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  try {
    const res = await fetch(
      `https://api.pinterest.com/v5/user_account/analytics?start_date=${startDate}&end_date=${endDate}&metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data?.all?.daily_metrics || []
  } catch {
    return []
  }
}

export async function fetchPinterestPinAnalytics(
  accessToken: string,
  daysBack = 30
): Promise<Record<string, unknown>[]> {
  // Fetch pins with engagement data
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  try {
    // Get pins first
    const pinsRes = await fetch(
      `https://api.pinterest.com/v5/pins?page_size=50`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    )
    if (!pinsRes.ok) return []
    const pinsData = await pinsRes.json()
    const pins = pinsData?.items || []

    // Get analytics per pin
    const pinAnalytics = await Promise.all(
      pins.slice(0, 20).map(async (pin: Record<string, unknown>) => {
        try {
          const analyticsRes = await fetch(
            `https://api.pinterest.com/v5/pins/${pin.id}/analytics?start_date=${startDate}&end_date=${endDate}&metric_types=IMPRESSION,SAVE,PIN_CLICK,OUTBOUND_CLICK`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          )
          if (!analyticsRes.ok) return pin
          const analyticsData = await analyticsRes.json()
          const metrics = analyticsData?.all?.summary_metrics || {}
          return {
            ...pin,
            impressions: metrics.IMPRESSION || 0,
            saves:       metrics.SAVE || 0,
            pin_clicks:  metrics.PIN_CLICK || 0,
            outbound_clicks: metrics.OUTBOUND_CLICK || 0,
          }
        } catch {
          return pin
        }
      })
    )
    return pinAnalytics
  } catch {
    return []
  }
}
