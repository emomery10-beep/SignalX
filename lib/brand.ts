// AskBiz brand mark — single source of truth for generated icons & social cards.
//
// The mark is a "viewfinder → phone → lens" system: camera focus brackets frame a
// phone with a lens at its heart ("focus on your business"). At small sizes the
// phone/lens drop away and only the viewfinder + lens dot remain, so it stays sharp
// from a 1200px social card down to a 16px favicon.
//
// Colours match the live site: warm accent #C97A44 with a white foreground, exactly
// like the nav logo (white mark on a coral square).

export const BRAND = {
  ink: '#1A1410',
  acc: '#C97A44',
  paper: '#FFFFFF',
  cream: '#FBF5EA',
  muted: '#6B5B4E',
} as const

// Four camera focus brackets on a 0..64 canvas.
function brackets(sw: number, inset: number, arm: number, color: string): string {
  const a = inset
  const b = inset + arm
  const c = 64 - inset
  const d = 64 - inset - arm
  return `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">`
    + `<path d="M${a},${b} V${a} H${b}"/>`
    + `<path d="M${d},${a} H${c} V${b}"/>`
    + `<path d="M${a},${d} V${c} H${b}"/>`
    + `<path d="M${c},${d} V${c} H${d}"/>`
    + `</g>`
}

// Full mark on a rounded tile: viewfinder + phone + lens. For app icons / social.
export function markTileSVG(size: number, tile: string = BRAND.acc, fg: string = BRAND.paper): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">`
    + `<rect width="64" height="64" rx="14" fill="${tile}"/>`
    + brackets(4.5, 6, 12, fg)
    + `<rect x="23" y="15" width="18" height="34" rx="6" fill="${fg}"/>`
    + `<circle cx="32" cy="33" r="6" fill="none" stroke="${tile}" stroke-width="3.2"/>`
    + `<circle cx="32" cy="33" r="2.4" fill="${tile}"/>`
    + `</svg>`
}

// Reduced glyph on a rounded tile: viewfinder + lens dot only. For favicons.
export function glyphTileSVG(size: number, tile: string = BRAND.acc, fg: string = BRAND.paper): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">`
    + `<rect width="64" height="64" rx="14" fill="${tile}"/>`
    + brackets(5.5, 10, 12, fg)
    + `<circle cx="32" cy="32" r="5" fill="${fg}"/>`
    + `</svg>`
}

// data: URI that satori/resvg can rasterise inside an <img>. encodeURIComponent keeps
// this runtime-agnostic (no Buffer), so it works on the edge runtime.
export function toDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
