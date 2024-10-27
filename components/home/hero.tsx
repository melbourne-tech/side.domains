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

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your toolkit for side project domains
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Check availability, watch expiry dates, and sell unused domains.
            Everything you need to manage domains for your side projects.
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">
                Instant domain availability checks
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">
                Email alerts when domains expire
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <Checkmark />
              <span className="font-medium">
                For-sale pages with SSL included
              </span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild size="lg">
              <Link href="https://app.side.domains/sign-up">
                Try the Toolkit <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="relative overflow-hidden w-[48rem] h-[38rem] flex flex-col items-center justify-center">
                <img
                  src="/api/placeholder/800/600"
                  alt="Domain toolkit dashboard"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
