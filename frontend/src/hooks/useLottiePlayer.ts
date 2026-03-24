import { useRef, useState, useEffect, useCallback } from 'react'
import lottie, { AnimationItem } from 'lottie-web'

export interface LottieState {
  isPlaying: boolean
  isLooping: boolean
  currentFrame: number
  totalFrames: number
  speed: number
  duration: number
  metadata: LottieMetadata | null
}

export interface LottieMetadata {
  name: string
  width: number
  height: number
  frameRate: number
  layerCount: number
  assetCount: number
  fileSize: number
  hasExpressions: boolean
  hasMasks: boolean
  hasMattes: boolean
}

export function useLottiePlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const [state, setState] = useState<LottieState>({
    isPlaying: false,
    isLooping: true,
    currentFrame: 0,
    totalFrames: 0,
    speed: 1,
    duration: 0,
    metadata: null,
  })

  const extractMetadata = useCallback((animationData: any): LottieMetadata => {
    const layers = animationData.layers || []
    const assets = animationData.assets || []

    return {
      name: animationData.name || 'Untitled',
      width: animationData.w || 0,
      height: animationData.h || 0,
      frameRate: animationData.fr || 30,
      layerCount: layers.length,
      assetCount: assets.length,
      fileSize: JSON.stringify(animationData).length,
      hasExpressions: layers.some((l: any) => l.ef && l.ef.length > 0),
      hasMasks: layers.some((l: any) => l.masks && l.masks.length > 0),
      hasMattes: layers.some((l: any) => l.tt === 1 || l.tt === 2),
    }
  }, [])

  const loadAnimation = useCallback((animationData: object) => {
    if (animationRef.current) {
      animationRef.current.destroy()
    }

    const metadata = extractMetadata(animationData)

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData,
    })

    animationRef.current.addEventListener('enterFrame', () => {
      if (animationRef.current) {
        setState(prev => ({
          ...prev,
          currentFrame: Math.floor(animationRef.current!.currentFrame),
        }))
      }
    })

    animationRef.current.addEventListener('config_ready', () => {
      if (animationRef.current) {
        setState(prev => ({
          ...prev,
          totalFrames: animationRef.current!.totalFrames,
          duration: animationRef.current!.getDuration(),
          metadata,
        }))
      }
    })

    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentFrame: 0,
      totalFrames: animationRef.current!.totalFrames,
      duration: animationRef.current!.getDuration(),
      metadata,
    }))
  }, [extractMetadata])

  const play = useCallback(() => {
    animationRef.current?.play()
    setState(prev => ({ ...prev, isPlaying: true }))
  }, [])

  const pause = useCallback(() => {
    animationRef.current?.pause()
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  const stop = useCallback(() => {
    animationRef.current?.stop()
    setState(prev => ({ ...prev, isPlaying: false, currentFrame: 0 }))
  }, [])

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, play, pause])

  const toggleLoop = useCallback(() => {
    if (animationRef.current) {
      const newLoop = !state.isLooping
      animationRef.current.loop = newLoop
      setState(prev => ({ ...prev, isLooping: newLoop }))
    }
  }, [state.isLooping])

  const setSpeed = useCallback((speed: number) => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed)
      setState(prev => ({ ...prev, speed }))
    }
  }, [])

  const goToFrame = useCallback((frame: number) => {
    if (animationRef.current) {
      animationRef.current.goToAndStop(frame, true)
      setState(prev => ({ ...prev, currentFrame: frame, isPlaying: false }))
    }
  }, [])

  const nextFrame = useCallback(() => {
    if (animationRef.current) {
      const next = Math.min(state.currentFrame + 1, state.totalFrames - 1)
      goToFrame(next)
    }
  }, [state.currentFrame, state.totalFrames, goToFrame])

  const prevFrame = useCallback(() => {
    if (animationRef.current) {
      const prev = Math.max(state.currentFrame - 1, 0)
      goToFrame(prev)
    }
  }, [state.currentFrame, goToFrame])

  const destroy = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.destroy()
      animationRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      destroy()
    }
  }, [destroy])

  return {
    containerRef,
    state,
    loadAnimation,
    play,
    pause,
    stop,
    togglePlay,
    toggleLoop,
    setSpeed,
    goToFrame,
    nextFrame,
    prevFrame,
    destroy,
  }
}
