import { useState } from 'react'
import clsx from 'clsx'

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]

interface SpeedControlProps {
  currentSpeed: number
  onSpeedChange: (speed: number) => void
}

export default function SpeedControl({ currentSpeed, onSpeedChange }: SpeedControlProps) {
  const [showFpsControl, setShowFpsControl] = useState(false)
  const [customFps, setCustomFps] = useState(30)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Speed:</span>
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        {SPEEDS.map((speed) => (
          <button
            key={speed}
            onClick={() => {
              onSpeedChange(speed)
              setShowFpsControl(false)
            }}
            className={clsx(
              'px-2 py-1 text-xs font-medium rounded transition-colors',
              !showFpsControl && currentSpeed === speed
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {speed}x
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowFpsControl(!showFpsControl)}
        className={clsx(
          'px-2 py-1 text-xs font-medium rounded transition-colors',
          showFpsControl
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent bg-secondary'
        )}
      >
        FPS
      </button>

      {showFpsControl && (
        <div className="flex items-center gap-2 bg-secondary rounded-lg p-2">
          <input
            type="range"
            min={1}
            max={100}
            value={customFps}
            onChange={(e) => {
              const fps = parseInt(e.target.value, 10)
              setCustomFps(fps)
            }}
            className="w-24 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="number"
            min={1}
            max={100}
            value={customFps}
            onChange={(e) => {
              const fps = Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1))
              setCustomFps(fps)
              onSpeedChange(fps / 30)
            }}
            className="w-12 px-1 py-0.5 text-xs bg-muted border border-input rounded text-center"
          />
          <span className="text-xs text-muted-foreground">fps</span>
          <button
            onClick={() => {
              onSpeedChange(customFps / 30)
            }}
            className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
