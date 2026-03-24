import clsx from 'clsx'

const BACKGROUNDS = [
  { label: 'Dark', value: '#1a1a2e' },
  { label: 'Light', value: '#f5f5f5' },
  { label: 'Transparent', value: 'transparent' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Green', value: '#22c55e' },
]

interface BackgroundToggleProps {
  currentBackground: string
  onBackgroundChange: (color: string) => void
}

export default function BackgroundToggle({ currentBackground, onBackgroundChange }: BackgroundToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">BG:</span>
      <div className="flex items-center gap-1">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.value}
            onClick={() => onBackgroundChange(bg.value)}
            className={clsx(
              'w-6 h-6 rounded border-2 transition-all',
              currentBackground === bg.value ? 'border-primary scale-110' : 'border-transparent'
            )}
            style={{
              backgroundColor: bg.value === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px' : bg.value,
            }}
            aria-label={`${bg.label} background`}
            title={bg.label}
          />
        ))}
      </div>
    </div>
  )
}
