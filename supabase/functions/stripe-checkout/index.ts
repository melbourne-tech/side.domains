import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from '@supabase/supabase-js'
import { getUserFromRequest } from '../_lib/auth.ts'
import { corsHeaders } from '../_lib/cors.ts'
import stripe from '../_lib/stripe.ts'

// Initialize Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const PLANS = {
  MONTHLY: Deno.env.get('STRIPE_MONTHLY_PRICE_ID')!,
  LIFETIME: Deno.env.get('STRIPE_LIFETIME_PRICE_ID')!,
} as const

type PlanType = keyof typeof PLANS

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(null, {
      headers: corsHeaders,
      status: 405,
    })
  }

  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Get plan type from request body
    const { planType } = (await req.json()) as { planType: PlanType }
    if (!planType || !PLANS[planType]) {
      return new Response(JSON.stringify({ error: 'Invalid plan type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Get or create customer
    const { data: userData, error: userError } = await supabase
      .from('user_data')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (userError) {
      throw userError
    }

    let customerId = userData.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Update user with new customer ID
      const { error: updateError } = await supabase
        .from('user_data')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)

      if (updateError) {
        throw updateError
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: PLANS[planType],
          quantity: 1,
        },
      ],
      mode: planType === 'MONTHLY' ? 'subscription' : 'payment',
      ...(planType === 'MONTHLY' && {
        subscription_data: {
          metadata: {
            user_id: user.id,
          },
        },
      }),
      ui_mode: 'embedded',
      return_url: `${Deno.env.get(
        'NEXT_PUBLIC_APP_URL'
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        user_id: user.id,
      },
      saved_payment_method_options: {
        allow_redisplay_filters: ['limited'],
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        name: 'auto',
        address: 'auto',
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Checkout error:', err)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
