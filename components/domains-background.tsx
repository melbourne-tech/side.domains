import { useMemo } from 'react'
import InfiniteDomainScroller from './infinite-domain-scroller'

export type DomainsBackgroundProps = {
  domainName: string
}

const OFFSET = 50

const DomainsBackground = ({ domainName }: DomainsBackgroundProps) => {
  const elements = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => (
        <InfiniteDomainScroller
          key={i}
          domainName={domainName}
          index={i - OFFSET}
        />
      )),
    [domainName]
  )

  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0 bg-slate-300">
      {elements}
    </div>
  )
}

export default DomainsBackground
