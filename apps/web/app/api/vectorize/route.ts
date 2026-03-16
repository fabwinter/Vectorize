import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Simple edge detection using Sobel operator
function detectEdges(buffer: Buffer, width: number, height: number): Buffer {
  const data = new Uint8ClampedArray(buffer)
  const edges = new Uint8ClampedArray(width * height * 4)

  const Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
  const Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelGx = 0
      let pixelGy = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const intensity = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
          pixelGx += intensity * Gx[ky + 1][kx + 1]
          pixelGy += intensity * Gy[ky + 1][kx + 1]
        }
      }

      const magnitude = Math.sqrt(pixelGx * pixelGx + pixelGy * pixelGy)
      const intensity = Math.min(255, Math.round(magnitude))

      const idx = (y * width + x) * 4
      edges[idx] = intensity
      edges[idx + 1] = intensity
      edges[idx + 2] = intensity
      edges[idx + 3] = 255
    }
  }

  return Buffer.from(edges)
}

// Generate SVG from image
function generateSVGFromImage(
  buffer: Buffer,
  width: number,
  height: number,
  colorMode: string,
  detail: number,
  smoothness: number
): string {
  const edgeBuffer = detectEdges(buffer, width, height)

  const threshold = 100
  const thresholdBuffer = new Uint8ClampedArray(edgeBuffer)
  for (let i = 0; i < thresholdBuffer.length; i += 4) {
    const val = thresholdBuffer[i] > threshold ? 255 : 0
    thresholdBuffer[i] = val
    thresholdBuffer[i + 1] = val
    thresholdBuffer[i + 2] = val
  }

  const svgPaths: string[] = []
  
  // Create a simple border trace
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      if (thresholdBuffer[idx] > 128) {
        if (x % (11 - detail) === 0 && y % (11 - detail) === 0) {
          const r = Math.floor(Math.random() * 50) + 100
          svgPaths.push(`<circle cx="${x}" cy="${y}" r="${Math.max(1, smoothness / 2)}" fill="#333" opacity="0.6"/>`)
        }
      }
    }
  }

  // Generate SVG document
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    svg { background: white; }
  </style>
  <g>
    ${svgPaths.slice(0, Math.max(100, svgPaths.length)).join('\n    ')}
  </g>
</svg>`

  return svg
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const colorMode = (formData.get('colorMode') as string) || 'full'
    const detail = Number(formData.get('detail')) || 5
    const smoothness = Number(formData.get('smoothness')) || 3

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()

    const metadata = await sharp(buffer).metadata()
    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
    }

    let processBuffer = Buffer.from(buffer)
    if (metadata.width > 2000 || metadata.height > 2000) {
      processBuffer = await sharp(buffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(result => result.data)
    } else {
      processBuffer = await sharp(buffer)
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(result => result.data)
    }

    const svg = generateSVGFromImage(
      processBuffer,
      metadata.width,
      metadata.height,
      colorMode,
      detail,
      smoothness
    )

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Vectorization error:', error)
    return NextResponse.json(
      { error: 'Vectorization failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
