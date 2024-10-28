import { cn } from '~/lib/utils'

interface OrDividerProps {
  text?: string
  className?: string
}

const OrDivider = ({ text = 'or', className }: OrDividerProps) => {
  return (
    <div className={cn('relative w-full my-4', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 text-gray-500 bg-white">{text}</span>
      </div>
    </div>
  )
}

export default OrDivider
