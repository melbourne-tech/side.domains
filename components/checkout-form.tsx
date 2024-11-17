import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useMemo } from 'react'
import supabase from '~/lib/supabase'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutFormProps {
  planType: 'MONTHLY' | 'LIFETIME'
}

const CheckoutForm = ({ planType }: CheckoutFormProps) => {
  const fetchClientSecret = useCallback(() => {
    return supabase.functions
      .invoke('stripe-checkout', { body: { planType } })
      .then(({ data }) => data?.clientSecret)
  }, [planType])

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={useMemo(
          () => ({
            fetchClientSecret,
          }),
          [fetchClientSecret]
        )}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm
