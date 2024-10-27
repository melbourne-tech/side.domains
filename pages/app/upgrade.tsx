import CheckoutForm from '~/components/checkout-form'
import AppLayout from '~/components/layouts/AppLayout'
import { withAuth } from '~/lib/hocs/with-auth'
import { withPurchased } from '~/lib/hocs/with-purchased'
import { NextPageWithLayout } from '~/lib/types'

const UpgradePage: NextPageWithLayout = () => {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight py-6">
        Upgrade to Lifetime
      </h2>

      <CheckoutForm planType="LIFETIME" />
    </>
  )
}

UpgradePage.getLayout = (page) => <AppLayout>{page}</AppLayout>

export default withAuth(withPurchased(UpgradePage))
