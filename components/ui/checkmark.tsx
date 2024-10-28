import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'

export interface CheckmarkProps extends React.HTMLAttributes<HTMLDivElement> {}

function Checkmark({ className, ...props }: CheckmarkProps) {
  return (
    <span
      className={cn(
        'bg-blue-400/75 rounded-full text-green-800 p-1',
        className
      )}
      {...props}
    >
      <CheckIcon size={20} />
    </span>
  )
}

export { Checkmark }
