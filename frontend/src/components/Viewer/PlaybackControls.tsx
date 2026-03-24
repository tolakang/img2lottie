import clsx from 'clsx'

interface PlaybackControlsProps {
  isPlaying: boolean
  isLooping: boolean
  onPlayPause: () => void
  onStop: () => void
  onToggleLoop: () => void
}

export default function PlaybackControls({
  isPlaying,
  isLooping,
  onPlayPause,
  onStop,
  onToggleLoop,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPlayPause}
        className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={onStop}
        className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Stop"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="1" />
        </svg>
      </button>

      <button
        onClick={onToggleLoop}
        className={clsx(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
          isLooping
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-accent'
        )}
        aria-label={isLooping ? 'Disable loop' : 'Enable loop'}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}
