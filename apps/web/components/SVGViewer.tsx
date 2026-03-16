'use client'

import { useState } from 'react'

interface SVGViewerProps {
  svgContent: string
}

export default function SVGViewer({ svgContent }: SVGViewerProps) {
  const [zoom, setZoom] = useState(100)

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev + 10 : prev - 10
      return Math.max(50, Math.min(200, newZoom))
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
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-auto max-h-96 flex items-center justify-center">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="inline-block"
          />
        </div>
      </div>
    </div>
  )
}
