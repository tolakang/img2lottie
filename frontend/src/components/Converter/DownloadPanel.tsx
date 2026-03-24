import clsx from 'clsx'

interface DownloadPanelProps {
  onDownloadJson: () => void
  onDownloadGif: () => void
  onDownloadMp4: () => void
  disabled?: boolean
  isConverting?: boolean
}

export default function DownloadPanel({
  onDownloadJson,
  onDownloadGif,
  onDownloadMp4,
  disabled = false,
  isConverting = false,
}: DownloadPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <h3 className="text-sm font-semibold">Download</h3>
      
      <button
        onClick={onDownloadJson}
        disabled={disabled || isConverting}
        className={clsx(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          disabled || isConverting
            ? 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download JSON
      </button>

      <button
        onClick={onDownloadGif}
        disabled={disabled || isConverting}
        className={clsx(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          disabled || isConverting
            ? 'bg-secondary text-secondary-foreground/50 cursor-not-allowed'
            : 'bg-secondary text-secondary-foreground hover:bg-accent'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Download GIF
      </button>

      <button
        onClick={onDownloadMp4}
        disabled={disabled || isConverting}
        className={clsx(
          'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          disabled || isConverting
            ? 'bg-secondary text-secondary-foreground/50 cursor-not-allowed'
            : 'bg-secondary text-secondary-foreground hover:bg-accent'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Download MP4
      </button>
    </div>
  )
}
