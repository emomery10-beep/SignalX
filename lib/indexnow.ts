// IndexNow — notifies Bing, Yandex, Naver, Seznam, and Yep the moment a page
// publishes, instead of waiting for their own recrawl schedule to notice the
// sitemap changed. Google does not support IndexNow (confirmed July 2026) —
// there is no equivalent programmatic "index this now" mechanism for Google;
// Search Console's URL Inspection → Request Indexing is UI-only and
// deliberately rate-limited, with no public API for it.
//
// Replaces the previous pingSitemapServices() (google.com/ping and
// bing.com/ping) — both endpoints are long dead: Google's returned 404 since
// end of 2023, Bing's returned 410 since 2021/2022. That function looked like
// it worked but silently did nothing.
//
// Key verification: the key below must also exist verbatim at
// https://askbiz.co/{key}.txt (public/e93116c0ffb6ae77417d6896177ec6c1.txt) —
// that's how IndexNow confirms the submitter owns the host. Not a secret;
// it's served publicly by design, so a plain constant is fine here.
const INDEXNOW_KEY = 'e93116c0ffb6ae77417d6896177ec6c1'
const INDEXNOW_HOST = 'askbiz.co'

export async function notifyIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })
  } catch {
    // Best-effort notification — never block or fail a publish over this.
  }
}
