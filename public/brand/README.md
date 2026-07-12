# AskBiz brand assets

The AskBiz mark is a **viewfinder → phone → lens** system: camera focus brackets
frame a phone with a lens at its heart — "focus on your business". It's a responsive
system: at small sizes the phone and lens drop away and only the **viewfinder + lens
dot** remain, so the mark stays sharp from a social card down to a 16px favicon.

## Palette

| Token   | Hex       | Use                                    |
| ------- | --------- | -------------------------------------- |
| Accent  | `#C97A44` | Brand accent / tile (matches the site) |
| Ink     | `#1A1410` | Foreground on light backgrounds        |
| Paper   | `#FFFFFF` | Foreground on the accent tile          |
| Cream   | `#FBF5EA` | Warm light background (social cards)    |

## Files

| File                          | What it is                                             |
| ----------------------------- | ------------------------------------------------------ |
| `askbiz-mark.svg`             | Full mark (viewfinder + phone + lens), transparent bg  |
| `askbiz-glyph.svg`            | Reduced glyph (viewfinder + dot) on the accent tile    |
| `askbiz-logo-horizontal.svg`  | Horizontal lockup: mark tile + wordmark                |

## Where it's wired in

These source files are the reference. The versions the site actually serves are:

- **Favicon** — `app/icon.svg` (App Router convention)
- **Apple touch icon** — `app/apple-icon.tsx` (generated 180×180 PNG via `next/og`)
- **PWA icons** — `app/icons/icon-192.png` + `icon-512.png` route handlers, referenced by `public/manifest.json`
- **Social cards** — `app/opengraph-image.tsx` + `app/twitter-image.tsx` (1200×630)
- **Site logo (`public/logo.svg`)** — horizontal lockup, also the `Organization` schema logo
- **Nav / footer / mockups** — the `Logo` component in `components/layout/LandingClient.tsx`

All generated icons draw from the single source of truth in `lib/brand.ts`.

To change the mark, edit `lib/brand.ts` (drives every generated raster) and the static
SVGs here + `app/icon.svg` (drive the vector assets).
