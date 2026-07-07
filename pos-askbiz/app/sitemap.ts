// app/sitemap.ts
// pos.askbiz.co is a staff-facing POS app (login-gated) — only the small set
// of genuinely public pages belong here. Everything else (dashboard, sell,
// inventory, factory, logistics, repair, restaurant, retail, salon, billing,
// refunds, payment-success) requires an authenticated session and is kept
// out of the sitemap + disallowed in robots.ts.

export const revalidate = 0

import type { MetadataRoute } from "next";

const base = "https://pos.askbiz.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    { url: base,                       lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/preview`,          lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/changelog`,        lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/privacy`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,            lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/cookies`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
