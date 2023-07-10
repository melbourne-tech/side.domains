import * as React from 'react'

import { cn } from '~/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  before?: React.ReactNode
  after?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, before, after, ...props }, ref) => {
    return (
      <div className="flex h-10 w-full rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {before && (
          <span className="flex items-center h-full border-r border-input bg-gray-100 px-2 font-medium">
            {before}
          </span>
        )}

        <input
          type={type}
          className={cn(
            'h-full w-full px-3 py-2 rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />

        {after && (
          <span className="flex items-center h-full border-l border-input bg-gray-100 px-2 font-medium">
            {after}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
