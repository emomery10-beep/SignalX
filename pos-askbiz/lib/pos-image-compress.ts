// Shared photo compression — was duplicated 3x across logistics screens
// (intake/collect/page.tsx) and missing entirely in factory/capture, whose
// uncompressed camera captures would blow through IndexedDB quota fast once
// queued offline. This is the logistics implementation ported verbatim
// (it's the most robust of the duplicates — has the iOS Safari
// "black/empty canvas" workaround via createImageBitmap), extended to also
// accept an HTMLCanvasElement directly for factory's camera-capture path.
'use client'

function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload  = () => resolve(String(r.result))
    r.onerror = () => reject(r.error || new Error('Could not read file'))
    r.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload  = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode image'))
    img.src = src
  })
}

function drawToJpeg(src: CanvasImageSource, w: number, h: number, quality: number): string | null {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, w); canvas.height = Math.max(1, h)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

export interface CompressOpts {
  maxEdge?: number
  quality?: number
}

// Downscale + re-encode to JPEG so uploads/queued writes stay well under
// serverless body limits and IndexedDB quota (phone photos are 3–8 MB;
// this yields ~150–500 KB). Accepts a File/Blob (camera/gallery input) or
// an already-drawn HTMLCanvasElement (e.g. factory's capture() canvas) —
// the canvas path skips straight to a scaled re-draw since there's no
// encoded source to decode.
export async function compressImageToDataUrl(
  input: File | Blob | HTMLCanvasElement,
  opts?: CompressOpts,
): Promise<string> {
  const maxEdge = opts?.maxEdge ?? 1600
  const quality = opts?.quality ?? 0.82

  if (input instanceof HTMLCanvasElement) {
    const scale = Math.min(1, maxEdge / Math.max(input.width, input.height))
    const out = drawToJpeg(input, Math.round(input.width * scale), Math.round(input.height * scale), quality)
    return out || input.toDataURL('image/jpeg', quality)
  }

  // Path 1 — createImageBitmap (robust on iOS for large camera photos)
  if (typeof createImageBitmap === 'function') {
    try {
      const probe = await createImageBitmap(input)
      const scale = Math.min(1, maxEdge / Math.max(probe.width, probe.height))
      const w = Math.round(probe.width * scale)
      const h = Math.round(probe.height * scale)
      let bmp = probe
      try {
        // Re-decode at target size where supported (Safari ignores options but still works)
        bmp = await createImageBitmap(input, { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' } as any)
      } catch { /* keep probe */ }
      const out = drawToJpeg(bmp, w, h, quality)
      probe.close?.(); if (bmp !== probe) bmp.close?.()
      if (out && out.length > 'data:image/jpeg;base64,'.length + 100) return out
    } catch { /* fall through */ }
  }

  // Path 2 — <img> + canvas fallback
  const original = await fileToDataUrl(input)
  try {
    const img = await loadImage(original)
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
    const out = drawToJpeg(img, Math.round(img.width * scale), Math.round(img.height * scale), quality)
    if (out && out.length > 'data:image/jpeg;base64,'.length + 100) return out
  } catch { /* fall through */ }

  return original // undecodable format — caller still size-guards
}

export function approxDataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(',')
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl
  return Math.floor(b64.length * 0.75)
}
