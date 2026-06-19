// Append UTM parameters to a URL so GA4 can attribute the click to a real
// source/medium instead of marking it "(unlabeled)". Used by share buttons —
// when a visitor follows a shared link back to the site, the UTMs identify
// where it came from (especially WhatsApp / copied links, which strip the
// referrer and otherwise show as direct/unlabeled traffic).
export function withUtm(
  url: string,
  source: string,
  medium = 'social',
  campaign = 'content_share',
): string {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', source)
    u.searchParams.set('utm_medium', medium)
    u.searchParams.set('utm_campaign', campaign)
    return u.toString()
  } catch {
    // relative or malformed URL — append manually
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`
  }
}
