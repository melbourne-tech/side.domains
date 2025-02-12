import CheckoutForm from '~/components/checkout-form'
import AppLayout from '~/components/layouts/AppLayout'
import PurchasePlans from '~/components/purchase-plans'
import { useUserDataQuery } from '~/lib/data/user-data-query'
import { withAuth } from '~/lib/hocs/with-auth'
import { NextPageWithLayout } from '~/lib/types'

const UpgradePage: NextPageWithLayout = () => {
  const { data } = useUserDataQuery()

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight py-6">Upgrade</h2>

      {!data?.isSubscribed ? (
        <PurchasePlans />
      ) : !data.isLifetime ? (
        <CheckoutForm planType="LIFETIME" />
      ) : (
        <div className="text-center">
          <p>You already have a lifetime subscription.</p>
        </div>
      )}
    </>
  )
}

UpgradePage.getLayout = (page) => <AppLayout title="Upgrade">{page}</AppLayout>

export default withAuth(UpgradePage)
