import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useMemo } from 'react'
import { fetchAPI } from '~/lib/fetcher'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const PurchasePage = () => {
  const fetchClientSecret = useCallback(() => {
    return fetchAPI<{ clientSecret: string }>('/billing/checkout', 'POST').then(
      (data) => data.clientSecret
    )
  }, [])

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={useMemo(() => ({ fetchClientSecret }), [fetchClientSecret])}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default PurchasePage
