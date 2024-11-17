import { CircleFadingArrowUp } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { useSignOutMutation } from '~/lib/data/sign-out-mutation'
import { useUserDataQuery } from '~/lib/data/user-data-query'
import Footer from '../footer'
import Logo from '../logo'
import { Button } from '../ui/button'

export type AppLayoutProps = {
  title: string
  showSignOut?: boolean
}

const AppLayout = ({
  title,
  children,
  showSignOut = true,
}: PropsWithChildren<AppLayoutProps>) => {
  const { isSuccess, data } = useUserDataQuery()
  const { mutate: signOut, isPending } = useSignOutMutation()

  return (
    <>
      <Head>
        <title>{title} | Side Domains</title>
      </Head>
      <div className="h-full flex flex-col">
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex h-16 justify-between items-center px-4">
            <Logo />

            <div className="flex items-center gap-2">
              {isSuccess && !data.isLifetime && (
                <Button
                  asChild
                  variant={data.isSubscribed ? 'secondary' : 'default'}
                  size="sm"
                >
                  <Link href="/upgrade">
                    <CircleFadingArrowUp size={16} />
                    {data.isSubscribed ? 'Upgrade to Lifetime' : 'Upgrade'}
                  </Link>
                </Button>
              )}

              {showSignOut && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  isLoading={isPending}
                  disabled={isPending}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-5xl w-full px-4">{children}</main>

        <Footer />
      </div>
    </>
  )
}

export default AppLayout
