'use client'

interface ControlPanelProps {
  colorMode: 'full' | 'mono' | 'limited'
  detail: number
  smoothness: number
  paletteSize: number
  onColorModeChange: (mode: 'full' | 'mono' | 'limited') => void
  onDetailChange: (value: number) => void
  onSmoothnessChange: (value: number) => void
  onPaletteSizeChange: (value: number) => void
  onReVectorize: () => void
  isProcessing: boolean
  hasImage: boolean
}

export default function ControlPanel({
  colorMode,
  detail,
  smoothness,
  paletteSize,
  onColorModeChange,
  onDetailChange,
  onSmoothnessChange,
  onPaletteSizeChange,
  onReVectorize,
  isProcessing,
  hasImage,
}: ControlPanelProps) {
  return (
    <div className="card sticky top-24 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Settings</h3>
      </div>

      {/* Color Mode */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Color Mode</label>
        <div className="space-y-2">
          {[
            { value: 'full' as const, label: 'Full Color' },
            { value: 'limited' as const, label: 'Limited Palette' },
            { value: 'mono' as const, label: 'Monochrome' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="colorMode"
                value={option.value}
                checked={colorMode === option.value}
                onChange={() => onColorModeChange(option.value)}
                disabled={isProcessing}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Detail Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Detail</label>
          <span className="text-sm font-semibold text-primary-500">{detail}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={detail}
          onChange={(e) => onDetailChange(Number(e.target.value))}
          disabled={isProcessing}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Higher = more detail</p>
      </div>

      {/* Smoothness Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Smoothness</label>
          <span className="text-sm font-semibold text-primary-500">{smoothness}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={smoothness}
          onChange={(e) => onSmoothnessChange(Number(e.target.value))}
          disabled={isProcessing}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Higher = smoother curves</p>
      </div>

      {/* Palette Size */}
      {colorMode === 'limited' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Palette Size</label>
            <span className="text-sm font-semibold text-primary-500">{paletteSize}</span>
          </div>
          <input
            type="range"
            min="2"
            max="256"
            step="2"
            value={paletteSize}
            onChange={(e) => onPaletteSizeChange(Number(e.target.value))}
            disabled={isProcessing}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Number of colors to use</p>
        </div>
      )}

      {/* Re-vectorize Button */}
      <button
        onClick={onReVectorize}
        disabled={!hasImage || isProcessing}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          hasImage && !isProcessing
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
        }`}
      >
        {isProcessing ? '⏳ Processing...' : '🔄 Re-vectorize'}
      </button>

      {/* Info Box */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="space-y-1">
          <li>• Increase detail for complex images</li>
          <li>• Use smoothness to reduce noise</li>
          <li>• Monochrome works best for logos</li>
          <li>• Adjust and re-vectorize as needed</li>
        </ul>
      </div>
    </div>
  )
}
