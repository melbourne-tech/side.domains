import { PropsWithChildren } from 'react'
import { useSignOutMutation } from '~/lib/data/sign-out-mutation'
import { Button } from '../ui/button'

export type AppLayoutProps = {
  title: string
}

const AppLayout = ({ title, children }: PropsWithChildren<AppLayoutProps>) => {
  const { mutate: signOut, isLoading } = useSignOutMutation()

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 justify-between items-center px-4">
          <h1 className="font-medium">side.domains</h1>

          <Button
            variant="ghost"
            onClick={() => signOut()}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl w-full px-4">
        <h2 className="text-3xl font-bold tracking-tight py-6">{title}</h2>

        {children}
      </div>
    </div>
  )
}

export default AppLayout
