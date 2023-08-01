import Link from 'next/link'
import useScroll from '~/lib/hooks/use-scroll'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'

const HomeNav = () => {
  const scrolled = useScroll(80)

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
      })}
    >
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="flex h-14 items-center justify-between">
          <Link href="/">side.domains</Link>

          <div className="hidden items-center space-x-6 sm:flex">
            <Link
              href="#pricing"
              className="rounded-md text-sm font-medium capitalize text-gray-800 transition-colors ease-out hover:text-black"
            >
              Pricing
            </Link>

            <Button asChild size="sm">
              <Link href="https://app.side.domains/sign-in">
                Sign In / Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNav
