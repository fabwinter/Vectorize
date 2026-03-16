'use client'

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import SVGViewer from '@/components/SVGViewer'
import ControlPanel from '@/components/ControlPanel'

export default function Workspace() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [svgOutput, setSvgOutput] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  
  // Controls
  const [colorMode, setColorMode] = useState<'full' | 'mono' | 'limited'>('full')
  const [detail, setDetail] = useState(5)
  const [smoothness, setSmoothness] = useState(3)
  const [paletteSize, setPaletteSize] = useState(16)

  const handleImageUpload = async (file: File, dataUrl: string) => {
    setOriginalImage(dataUrl)
    setSvgOutput(null)
    setFileName(file.name)
    setError(null)
    
    await vectorizeImage(file)
  }

  const vectorizeImage = async (file: File) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)

    try {
      setProcessingProgress(30)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('colorMode', colorMode)
      formData.append('detail', String(detail))
      formData.append('smoothness', String(smoothness))
      formData.append('paletteSize', String(paletteSize))

      setProcessingProgress(60)
      
      const response = await fetch('/api/vectorize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Vectorization failed')
      }

      setProcessingProgress(90)
      
      const svg = await response.text()
      setSvgOutput(svg)
      
      setProcessingProgress(100)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Vectorization error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReVectorize = () => {
    if (originalImage && fileName) {
      const blob = new Blob([originalImage], { type: 'image/png' })
      const file = new File([blob], fileName, { type: 'image/png' })
      vectorizeImage(file)
    }
  }

  const handleDownloadSVG = () => {
    if (!svgOutput) return
    
    const element = document.createElement('a')
    const file = new Blob([svgOutput], { type: 'image/svg+xml' })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName.split('.')[0]}.svg`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h9v9H3V3zm10 0h8v8h-8V3zm0 10h8v8h-8v-8zM3 14h9v8H3v-8z" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vectorizer</h1>
          </div>
          <a href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <UploadZone 
              onImageUpload={handleImageUpload}
              disabled={isProcessing}
              preview={originalImage}
            />

            {/* Error Display */}
            {error && (
              <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">⚠️ Error</p>
                <p className="text-red-600 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-blue-700 dark:text-blue-300">Processing...</p>
                  <span className="text-sm text-blue-600 dark:text-blue-200">{processingProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* SVG Output */}
            {svgOutput && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Result</h3>
                  <SVGViewer svgContent={svgOutput} />
                </div>
                <button
                  onClick={handleDownloadSVG}
                  className="btn-primary w-full"
                >
                  ⬇️ Download SVG
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-1">
            <ControlPanel
              colorMode={colorMode}
              detail={detail}
              smoothness={smoothness}
              paletteSize={paletteSize}
              onColorModeChange={setColorMode}
              onDetailChange={setDetail}
              onSmoothnessChange={setSmoothness}
              onPaletteSizeChange={setPaletteSize}
              onReVectorize={handleReVectorize}
              isProcessing={isProcessing}
              hasImage={originalImage !== null}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
