import { PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface BlurOverlayProps {
  isBlurred: boolean
  title: string
  buttonText: string
  className?: string
  onClick: () => void
  isLoading?: boolean
}

export const BlurOverlay = ({
  isBlurred,
  title,
  buttonText,
  onClick,
  isLoading,
  children,
}: PropsWithChildren<BlurOverlayProps>) => {
  return (
    <div className="relative overflow-hidden">
      {/* Content Container */}
      <div
        className={cn(
          'transition-all duration-500 ease-in-out',
          isBlurred && 'pointer-events-none scale-90'
        )}
      >
        {children}
      </div>

      {/* Blur Overlay Container */}
      <div
        className={cn(
          'absolute inset-0',
          'flex flex-col items-center justify-center gap-4',
          'transition-all duration-500 ease-in-out',
          isBlurred ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Scaled blur background */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />

        {/* Content */}
        <p className="relative z-10 font-medium">{title}</p>
        <Button
          onClick={onClick}
          className="relative z-10"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
