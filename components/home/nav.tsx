import Link from 'next/link'
import useScroll from '~/lib/hooks/use-scroll'
import { cn } from '~/lib/utils'
import Logo from '../logo'
import { Button } from '../ui/button'

const HomeNav = () => {
  const scrolled = useScroll(80)

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
      })}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex h-14 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-6">
            <Link
              href="#pricing"
              className="hidden sm:flex rounded-md text-sm font-medium capitalize text-gray-800 transition-colors ease-out hover:text-black"
            >
              Pricing
            </Link>

            <Button asChild size="sm">
              <Link href="https://app.side.domains/sign-in">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeNav
