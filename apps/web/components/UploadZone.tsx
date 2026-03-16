'use client'

import { useState } from 'react'

interface UploadZoneProps {
  onImageUpload: (file: File, dataUrl: string) => void
  disabled?: boolean
  preview?: string | null
}

export default function UploadZone({ onImageUpload, disabled, preview }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onImageUpload(file, dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="card p-0 overflow-hidden">
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-auto object-cover max-h-96" />
          <label htmlFor="file-input" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-white font-semibold">Change Image</span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={disabled}
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDragLeave}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed transition-all duration-200 p-12 text-center min-h-96 flex flex-col items-center justify-center ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Drag and drop your image</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">or click to browse</p>
          <label className="btn-primary">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={disabled}
              className="hidden"
            />
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">Supported formats: PNG, JPG, GIF, WebP (max 5MB)</p>
        </div>
      )}
    </div>
  )
}
