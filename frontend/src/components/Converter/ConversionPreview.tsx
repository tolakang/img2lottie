import { forwardRef } from 'react'
import clsx from 'clsx'

interface ConversionPreviewProps {
  backgroundColor: string
  className?: string
}

const ConversionPreview = forwardRef<HTMLDivElement, ConversionPreviewProps>(
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

ConversionPreview.displayName = 'ConversionPreview'

export default ConversionPreview
