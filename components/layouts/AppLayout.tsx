import { CircleFadingArrowUp } from 'lucide-react'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { useSignOutMutation } from '~/lib/data/sign-out-mutation'
import { useUserDataQuery } from '~/lib/data/user-data-query'
import Logo from '../logo'
import { Button } from '../ui/button'
import Footer from '../footer'

export type AppLayoutProps = {
  showSignOut?: boolean
}

const AppLayout = ({
  children,
  showSignOut = true,
}: PropsWithChildren<AppLayoutProps>) => {
  const { isSuccess, data } = useUserDataQuery()
  const { mutate: signOut, isLoading } = useSignOutMutation()

  return (
    <div className="h-full flex flex-col">
      <div className="border-b">
        <div className="flex h-16 justify-between items-center px-4">
          <Logo />

          <div className="flex items-center gap-2">
            {isSuccess && data.isSubscribed && !data.isLifetime && (
              <Button asChild variant="secondary" size="sm">
                <Link href="/upgrade">
                  <CircleFadingArrowUp size={16} />
                  Upgrade to Lifetime
                </Link>
              </Button>
            )}

            {showSignOut && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4">{children}</main>

      <Footer />
    </div>
  )
}

export default AppLayout
