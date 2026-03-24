import { useCallback, useState } from 'react'
import clsx from 'clsx'

interface ImageUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  multiple?: boolean
}

const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

export default function ImageUploader({ onFileSelect, accept = 'image/*', multiple = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && SUPPORTED_FORMATS.some(f => file.type.startsWith(f.split('/')[0]) || file.type === f)) {
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    }
  }, [onFileSelect])

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          ) : (
            <>
              <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">Drop your images here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse • JPEG, WebP, PNG, SVG, and Animated SVG supported
              </p>
            </>
          )}
        </label>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Supported: PNG, JPG, WebP, SVG, Animated SVG
      </p>
    </div>
  )
}
