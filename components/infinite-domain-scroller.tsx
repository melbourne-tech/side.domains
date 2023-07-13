import { useMemo } from 'react'

export type InfiniteDomainScrollerProps = {
  domainName: string
  index?: number
}

const HEIGHT = 80

const InfiniteDomainScroller = ({
  domainName,
  index = 0,
}: InfiniteDomainScrollerProps) => {
  const elements = useMemo(
    () =>
      Array.from({ length: 20 })
        .map(() => domainName)
        .join(' • '),
    [domainName]
  )

  return (
    <div
      className="relative w-[200vw] flex items-center overflow-hidden rotate-[-45deg] bg-slate-100 text-gray-700 text-2xl font-medium select-none shadow-lg"
      style={{
        height: HEIGHT,
        top: index * HEIGHT * 0.35,
        left: index * HEIGHT * 0.35,
      }}
    >
      <div className="flex absolute">
        <div className="flex whitespace-nowrap animate-infinite-scrolling">
          {elements}&nbsp;&bull;&nbsp;
        </div>
        <div className="flex whitespace-nowrap animate-infinite-scrolling">
          {elements}&nbsp;&bull;&nbsp;
        </div>
        <div className="flex whitespace-nowrap animate-infinite-scrolling">
          {elements}&nbsp;&bull;&nbsp;
        </div>
      </div>
    </div>
  )
}

export default InfiniteDomainScroller
