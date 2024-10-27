import { useRouter } from 'next/router'
import { useState } from 'react'
import AppLayout from '~/components/layouts/AppLayout'
import { Button } from '~/components/ui/button'
import { useSessionStatusQuery } from '~/lib/data/stripe-session-status-query'
import { useUserDataQuery } from '~/lib/data/user-data-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { NextPageWithLayout } from '~/lib/types'

const UpgradePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { data: status, isSuccess: isSessionStatusSuccess } =
    useSessionStatusQuery(router.query.session_id as string | undefined)
  const { refetch } = useUserDataQuery()

  const isDone = isSessionStatusSuccess && status === 'complete'

  const [isRefetching, setIsRefetching] = useState(false)

  async function onClick() {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)

    router.push('/')
  }

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight py-6">
        Thanks for your purchase!
      </h2>

      <Button
        disabled={!isDone || isRefetching}
        isLoading={!isDone || isRefetching}
        onClick={onClick}
      >
        Go to Dashboard
      </Button>
    </>
  )
}

UpgradePage.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default withAuth(UpgradePage)
