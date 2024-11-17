import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppLayout from '~/components/layouts/AppLayout'
import { Button } from '~/components/ui/button'
import { useSessionStatusQuery } from '~/lib/data/stripe-session-status-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { getQueryClient } from '~/lib/query-client'
import { NextPageWithLayout } from '~/lib/types'

const UpgradePage: NextPageWithLayout = () => {
  const queryClient = getQueryClient()

  const router = useRouter()
  const { data: status, isSuccess: isSessionStatusSuccess } =
    useSessionStatusQuery(router.query.session_id as string | undefined)

  const isDone = isSessionStatusSuccess && status === 'complete'

  useEffect(() => {
    if (isDone) {
      queryClient
        .invalidateQueries({ queryKey: ['user-data'], refetchType: 'all' })
        .then(() => {
          toast.success('Your subscription has been updated.')
          router.push('/')
        })
    }
  }, [isDone, queryClient, router])

  const [isRefetching, setIsRefetching] = useState(false)

  async function onClick() {
    setIsRefetching(true)
    await queryClient.invalidateQueries({
      queryKey: ['user-data'],
      refetchType: 'all',
    })
    setIsRefetching(false)

    router.push('/')
  }

  return (
    <div className="flex flex-col items-start gap-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Thanks for your purchase!
      </h2>

      <p className="text-gray-600">
        We&apos;re upgrading your account. You will be redirected to the home
        page in a few seconds.
      </p>

      <Button
        disabled={!isDone || isRefetching}
        isLoading={!isDone || isRefetching}
        onClick={onClick}
      >
        Click here if you are not redirected
      </Button>
    </div>
  )
}

UpgradePage.getLayout = (page) => (
  <AppLayout title="Thanks for your purchase">{page}</AppLayout>
)

export default withAuth(UpgradePage)
