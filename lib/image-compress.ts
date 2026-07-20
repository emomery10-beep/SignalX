// Client-side logo downscale for the business-spotlight upload — ported
// from pos-askbiz/lib/pos-image-compress.ts (root app and pos-askbiz are
// separate deployments with no shared package, so this is intentionally
// duplicated rather than imported). Trimmed to the <img>+canvas path only;
// logos come from a file picker, not a live camera capture, so the
// createImageBitmap iOS-camera workaround in the POS version isn't needed
// here. maxEdge is much smaller since this renders at 64–96px, not a
// full-bleed product photo.
'use client'

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error || new Error('Could not read file'))
    r.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode image'))
    img.src = src
  })
}

export async function compressLogoToDataUrl(file: File | Blob, maxEdge = 480, quality = 0.85): Promise<string> {
  const original = await fileToDataUrl(file)
  try {
    const img = await loadImage(original)
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * scale))
    canvas.height = Math.max(1, Math.round(img.height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) return original
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const out = canvas.toDataURL('image/jpeg', quality)
    return out.length > 'data:image/jpeg;base64,'.length + 100 ? out : original
  } catch {
    return original // undecodable format — caller still size-guards server-side
  }
}
