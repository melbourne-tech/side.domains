import { NextRequest } from 'next/server'
import stripe from '~/lib/stripe'
import { getUserFromRequest } from '~/lib/supabase-admin'

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)

  const session = await stripe.checkout.sessions.create({
    customer_email: user?.email ?? undefined,
    line_items: [
      {
        price: 'price_1PauV2RrzJN5t3FoKxYaCqOD',
        quantity: 1,
      },
    ],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}?session_id={CHECKOUT_SESSION_ID}`,
  })

  return new Response(
    JSON.stringify({
      clientSecret: session.client_secret,
    }),
    {
      headers: {
        'Content-Type': 'application/json;',
      },
    }
  )
}
