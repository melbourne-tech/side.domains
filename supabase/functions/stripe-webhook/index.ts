import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import stripe from '../_lib/stripe.ts'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

async function updateUserSubscriptionStatus(
  userId: string,
  data: {
    stripeSubscriptionId?: string | null
    isSubscribed: boolean
    stripeCustomerId?: string | null
  }
) {
  const { error } = await supabaseAdmin
    .from('user_data')
    .update({
      is_subscribed: data.isSubscribed,
      ...(data.stripeSubscriptionId !== undefined && {
        stripe_subscription_id: data.stripeSubscriptionId,
      }),
      ...(data.stripeCustomerId !== undefined && {
        stripe_customer_id: data.stripeCustomerId,
      }),
    })
    .eq('user_id', userId)

  if (error) throw error
}

async function handleWebhookEvent(event: Stripe.Event) {
  const { type, data } = event

  switch (type) {
    case 'checkout.session.completed': {
      const session = data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const customerId = session.customer as string

      if (!userId) {
        throw new Error('No user_id in session metadata')
      }

      if (session.mode === 'payment') {
        const { data: userData, error: userError } = await supabaseAdmin
          .from('user_data')
          .select('stripe_subscription_id')
          .eq('user_id', userId)
          .maybeSingle()

        if (userError) throw userError

        // If user has an existing subscription, cancel it
        if (userData?.stripe_subscription_id) {
          try {
            await stripe.subscriptions.update(userData.stripe_subscription_id, {
              metadata: {
                reason_code: 'cancelled_due_to_upgrade',
              },
            })
            await stripe.subscriptions.cancel(userData.stripe_subscription_id, {
              cancellation_details: {
                comment: 'Cancelled due to upgrading to lifetime',
              },
            })
          } catch (error) {
            console.error('Error cancelling subscription:', error)
            // Continue with the process even if cancellation fails
          }
        }

        await updateUserSubscriptionStatus(userId, {
          stripeSubscriptionId: null,
          isSubscribed: true,
          stripeCustomerId: customerId,
        })
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = data.object as Stripe.Subscription
      const userId = subscription.metadata.user_id
      const reason_code = subscription.metadata.reason_code

      if (!userId) {
        throw new Error('No user_id in subscription metadata')
      }

      if (reason_code === 'cancelled_due_to_upgrade') {
        // Skip this event as we've already handled it in checkout.session.completed
        break
      }

      const isSubscribed =
        subscription.status === 'active' || subscription.status === 'trialing'

      await updateUserSubscriptionStatus(userId, {
        stripeSubscriptionId: subscription.id,
        isSubscribed,
        stripeCustomerId: subscription.customer as string,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = data.object as Stripe.Subscription
      const userId = subscription.metadata.user_id
      const reason_code = subscription.metadata.reason_code

      if (!userId) {
        throw new Error('No user_id in subscription metadata')
      }

      if (reason_code === 'cancelled_due_to_upgrade') {
        // Skip this event as we've already handled it in checkout.session.completed
        break
      }

      await updateUserSubscriptionStatus(userId, {
        stripeSubscriptionId: null,
        isSubscribed: false,
        // Don't clear customer ID as they might resubscribe
      })
      break
    }
  }
}

Deno.serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  const body = await req.text()

  let receivedEvent: Stripe.Event
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined
    )
  } catch (err) {
    if (err instanceof stripe.errors.StripeError) {
      return new Response(`Stripe Error: ${err.message}`, {
        status: err.statusCode || 400,
      })
    }

    console.error('Unexpected error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }

  const requestOptions: Stripe.RequestOptions =
    receivedEvent.request && receivedEvent.request.idempotency_key
      ? {
          idempotencyKey: receivedEvent.request.idempotency_key,
        }
      : {}

  let retrievedEvent: Stripe.Event
  try {
    retrievedEvent = await stripe.events.retrieve(
      receivedEvent.id,
      requestOptions
    )
  } catch (err) {
    if (err instanceof stripe.errors.StripeError) {
      return new Response(`Stripe Error: ${err.message}`, {
        status: err.statusCode || 400,
      })
    }

    console.error('Unexpected error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }

  try {
    await handleWebhookEvent(retrievedEvent)
  } catch (error) {
    console.error('Error handling webhook event:', error)
    return new Response('Internal Server Error', { status: 500 })
  }

  return new Response(JSON.stringify(retrievedEvent), { status: 200 })
})
