import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Checkmark } from '~/components/ui/checkmark'

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your toolkit for side project domains
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get notified when your dream domain expires, create simple sales
            pages for your unused domains, and easily track whois information.
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">Email Domain expiry alerts</span>
            </div>

            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">
                For sale pages for your unused domains
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">Easy Whois lookup & tracking</span>
            </div>

            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">Open source</span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg">
              <Link href="https://app.side.domains/">
                Get started <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
