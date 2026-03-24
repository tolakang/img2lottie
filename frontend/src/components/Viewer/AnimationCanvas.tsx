import { forwardRef } from 'react'
import clsx from 'clsx'

interface AnimationCanvasProps {
  backgroundColor: string
  className?: string
}

const AnimationCanvas = forwardRef<HTMLDivElement, AnimationCanvasProps>(
  ({ backgroundColor, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-200',
          className
        )}
        style={{ backgroundColor }}
      />
    )
  }
)

AnimationCanvas.displayName = 'AnimationCanvas'

export default AnimationCanvas
