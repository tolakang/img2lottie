import { useState, useCallback } from 'react'
import { useLottiePlayer } from '../hooks/useLottiePlayer'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { sampleAnimations, SampleAnimationKey } from '../lib/sampleAnimations'
import {
  AnimationCanvas,
  PlaybackControls,
  SpeedControl,
  FrameNavigator,
  BackgroundToggle,
  MetadataPanel,
  FileUploader,
} from '../components/Viewer'

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]

export default function ViewerPage() {
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e')
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    containerRef,
    state,
    loadAnimation,
    togglePlay,
    stop,
    toggleLoop,
    setSpeed,
    prevFrame,
    nextFrame,
    goToFrame,
  } = useLottiePlayer()

  const handleSpeedUp = useCallback(() => {
    const currentIndex = SPEEDS.indexOf(state.speed)
    if (currentIndex < SPEEDS.length - 1) {
      setSpeed(SPEEDS[currentIndex + 1])
    }
  }, [state.speed, setSpeed])

  const handleSpeedDown = useCallback(() => {
    const currentIndex = SPEEDS.indexOf(state.speed)
    if (currentIndex > 0) {
      setSpeed(SPEEDS[currentIndex - 1])
    }
  }, [state.speed, setSpeed])

  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onStop: stop,
    onNextFrame: nextFrame,
    onPrevFrame: prevFrame,
    onSpeedUp: handleSpeedUp,
    onSpeedDown: handleSpeedDown,
  })

  const handleFileSelect = useCallback((file: File) => {
    setError(null)

    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)

        if (!json.layers || !json.w || !json.h) {
          setError('Invalid Lottie JSON file')
          return
        }

        setAnimationData(json)
        loadAnimation(json)
      } catch {
        setError('Failed to parse JSON file')
      }
    }
    reader.readAsText(file)
  }, [loadAnimation])

  const handleLoadSample = useCallback((key: SampleAnimationKey) => {
    setError(null)
    const sample = sampleAnimations[key]
    setAnimationData(sample)
    loadAnimation(sample)
  }, [loadAnimation])

  const handleDownload = useCallback(() => {
    if (!animationData) return

    const blob = new Blob([JSON.stringify(animationData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'animation.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [animationData])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Lottie Viewer
        </h1>
        <p className="text-lg text-muted-foreground">
          Preview your Lottie animations. Upload, play, and analyze your Lottie JSON files with our high-performance viewer.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload</h2>
              <span className="text-sm text-muted-foreground">JSON files only</span>
            </div>
            <FileUploader
              onFileSelect={handleFileSelect}
              accept=".json"
              label="Upload a Lottie JSON file"
              sublabel="Drop Lottie JSON here or click to browse • JSON files only"
            />
            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              <BackgroundToggle
                currentBackground={backgroundColor}
                onBackgroundChange={setBackgroundColor}
              />
            </div>
            
            {animationData ? (
              <div className="space-y-4">
                <AnimationCanvas
                  ref={containerRef}
                  backgroundColor={backgroundColor}
                  className="max-w-lg mx-auto"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted rounded-lg">
                  <PlaybackControls
                    isPlaying={state.isPlaying}
                    isLooping={state.isLooping}
                    onPlayPause={togglePlay}
                    onStop={stop}
                    onToggleLoop={toggleLoop}
                  />

                  <FrameNavigator
                    currentFrame={state.currentFrame}
                    totalFrames={state.totalFrames}
                    onPrevFrame={prevFrame}
                    onNextFrame={nextFrame}
                    onGoToFrame={goToFrame}
                  />

                  <SpeedControl
                    currentSpeed={state.speed}
                    onSpeedChange={setSpeed}
                  />
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Keyboard: Space = Play/Pause • ← → = Frame • ↑ ↓ = Speed • Esc = Stop
                </div>
              </div>
            ) : (
              <div 
                className="aspect-square max-w-lg mx-auto rounded-lg flex items-center justify-center"
                style={{ backgroundColor }}
              >
                <div className="text-center text-muted-foreground">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No animation loaded</p>
                  <p className="text-sm mt-2">Upload a Lottie JSON file to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <MetadataPanel metadata={state.metadata} />

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Actions</h3>
            <button
              onClick={handleDownload}
              disabled={!animationData}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download JSON
            </button>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Sample Animations</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(sampleAnimations) as SampleAnimationKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleLoadSample(key)}
                  className="px-3 py-2 text-xs bg-secondary hover:bg-accent rounded-lg transition-colors capitalize"
                >
                  {sampleAnimations[key].nm}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Keyboard Shortcuts</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><kbd className="px-1 py-0.5 bg-muted rounded">Space</kbd> Play/Pause</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded">←</kbd> <kbd className="px-1 py-0.5 bg-muted rounded">→</kbd> Frame step</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-muted rounded">↓</kbd> Speed</li>
              <li><kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> Stop</li>
            </ul>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold mb-3">Performance Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Keep animations under 5MB for optimal performance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Limit layers to reduce rendering complexity
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Expressions may impact performance on some devices
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
