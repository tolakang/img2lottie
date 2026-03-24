interface FrameNavigatorProps {
  currentFrame: number
  totalFrames: number
  onPrevFrame: () => void
  onNextFrame: () => void
  onGoToFrame: (frame: number) => void
}

export default function FrameNavigator({
  currentFrame,
  totalFrames,
  onPrevFrame,
  onNextFrame,
  onGoToFrame,
}: FrameNavigatorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrevFrame}
        className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Previous frame"
        disabled={currentFrame <= 0}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={totalFrames - 1}
          value={currentFrame}
          onChange={(e) => {
            const frame = parseInt(e.target.value, 10)
            if (!isNaN(frame) && frame >= 0 && frame < totalFrames) {
              onGoToFrame(frame)
            }
          }}
          className="w-16 px-2 py-1 text-sm bg-secondary border border-input rounded text-center"
        />
        <span className="text-sm text-muted-foreground">/ {totalFrames}</span>
      </div>

      <button
        onClick={onNextFrame}
        className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Next frame"
        disabled={currentFrame >= totalFrames - 1}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
