import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

type ColorMode = 'full' | 'mono' | 'limited'

interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, '0')
}

function rgbaToHex(color: Rgba): string {
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

function luminance(color: Rgba): number {
  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b
}

function quantizeChannel(value: number, levels: number): number {
  if (levels <= 1) return value
  const band = 255 / (levels - 1)
  return Math.round(Math.round(value / band) * band)
}

function quantizeColor(color: Rgba, colorMode: ColorMode, paletteSize: number): Rgba {
  if (colorMode === 'mono') {
    const lum = luminance(color) >= 128 ? 255 : 0
    return { r: lum, g: lum, b: lum, a: color.a }
  }

  if (colorMode === 'limited') {
    const levels = clamp(Math.round(Math.cbrt(clamp(paletteSize, 2, 256))), 2, 8)
    return {
      r: quantizeChannel(color.r, levels),
      g: quantizeChannel(color.g, levels),
      b: quantizeChannel(color.b, levels),
      a: color.a,
    }
  }

  return color
}

function buildPixelSvg(
  raw: Buffer,
  width: number,
  height: number,
  detail: number,
  smoothness: number,
  colorMode: ColorMode,
  paletteSize: number
): string {
  const block = clamp(12 - detail, 1, 10)
  const rows = Math.ceil(height / block)
  const cols = Math.ceil(width / block)
  const svgRects: string[] = []

  for (let row = 0; row < rows; row++) {
    const y = row * block
    let col = 0

    while (col < cols) {
      const x = col * block
      const idx = ((Math.min(y, height - 1) * width) + Math.min(x, width - 1)) * 4
      const base: Rgba = {
        r: raw[idx],
        g: raw[idx + 1],
        b: raw[idx + 2],
        a: raw[idx + 3],
      }

      const quantized = quantizeColor(base, colorMode, paletteSize)

      if (quantized.a < 12) {
        col += 1
        continue
      }

      let span = 1
      while (col + span < cols) {
        const nextX = (col + span) * block
        const nextIdx = ((Math.min(y, height - 1) * width) + Math.min(nextX, width - 1)) * 4
        const next: Rgba = {
          r: raw[nextIdx],
          g: raw[nextIdx + 1],
          b: raw[nextIdx + 2],
          a: raw[nextIdx + 3],
        }
        const nextQuantized = quantizeColor(next, colorMode, paletteSize)

        if (
          nextQuantized.r !== quantized.r ||
          nextQuantized.g !== quantized.g ||
          nextQuantized.b !== quantized.b ||
          Math.abs(nextQuantized.a - quantized.a) > 24
        ) {
          break
        }
        span += 1
      }

      const rectWidth = Math.min(width - x, span * block)
      const rectHeight = Math.min(height - y, block)
      const opacity = Number((quantized.a / 255).toFixed(3))
      const radius = smoothness >= 7 ? 1 : 0

      svgRects.push(
        `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${rgbaToHex(quantized)}" fill-opacity="${opacity}"${
          radius ? ` rx="${radius}" ry="${radius}"` : ''
        }/>`
      )

      col += span
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="geometricPrecision">\n  ${svgRects.join(
    '\n  '
  )}\n</svg>`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const colorMode = ((formData.get('colorMode') as string) || 'full') as ColorMode
    const detail = clamp(Number(formData.get('detail')) || 5, 1, 10)
    const smoothness = clamp(Number(formData.get('smoothness')) || 3, 1, 10)
    const paletteSize = clamp(Number(formData.get('paletteSize')) || 16, 2, 256)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer())

    const sigma = clamp(0.3 + ((smoothness - 1) / 9) * 2.7, 0.3, 3)

    const normalized = sharp(inputBuffer)
      .ensureAlpha()
      .blur(sigma)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })

    const { data, info } = await normalized.raw().toBuffer({ resolveWithObject: true })

    const svg = buildPixelSvg(data, info.width, info.height, detail, smoothness, colorMode, paletteSize)

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Vectorization error:', error)
    return NextResponse.json(
      {
        error: `Vectorization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    )
  }
}
