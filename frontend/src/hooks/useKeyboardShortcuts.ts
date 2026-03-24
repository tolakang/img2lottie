import { useEffect, useCallback } from 'react'

interface KeyboardShortcuts {
  onPlayPause?: () => void
  onStop?: () => void
  onNextFrame?: () => void
  onPrevFrame?: () => void
  onSpeedUp?: () => void
  onSpeedDown?: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault()
        shortcuts.onPlayPause?.()
        break
      case 'escape':
        e.preventDefault()
        shortcuts.onStop?.()
        break
      case 'arrowright':
        e.preventDefault()
        shortcuts.onNextFrame?.()
        break
      case 'arrowleft':
        e.preventDefault()
        shortcuts.onPrevFrame?.()
        break
      case 'arrowup':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          shortcuts.onSpeedUp?.()
        }
        break
      case 'arrowdown':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          shortcuts.onSpeedDown?.()
        }
        break
    }
  }, [shortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
