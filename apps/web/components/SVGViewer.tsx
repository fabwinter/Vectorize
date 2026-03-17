'use client'

import { useState, useEffect, useRef } from 'react'

interface SVGViewerProps {
  svgContent: string
}

export default function SVGViewer({ svgContent }: SVGViewerProps) {
  const [zoom, setZoom] = useState(100)
  const imgRef = useRef<HTMLImageElement>(null)
  const [objectUrl, setObjectUrl] = useState<string>('')

  useEffect(() => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [svgContent])

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 25 : prev - 25
      return Math.max(25, Math.min(400, newZoom))
    })
  }

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => handleZoom('out')}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          −
        </button>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 w-12 text-center">{zoom}%</span>
        <button
          onClick={() => handleZoom('in')}
          className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          +
        </button>
      </div>

      {/* SVG Display */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-auto"
        style={{ maxHeight: '70vh' }}
      >
        {objectUrl && (
          <img
            ref={imgRef}
            src={objectUrl}
            alt="Vectorized output"
            style={{
              width: zoom === 100 ? '100%' : `${zoom}%`,
              height: 'auto',
              display: 'block',
              minWidth: zoom > 100 ? `${zoom}%` : undefined,
            }}
          />
        )}
      </div>
    </div>
  )
}
