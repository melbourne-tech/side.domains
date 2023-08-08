import crypto from 'crypto'
import { listAllSubscriptions } from 'lemonsqueezy.ts'
import { NextRequest } from 'next/server'
import supabaseAdmin from '~/lib/supabase-admin'

type LemonSqueezySubscription = Awaited<
  ReturnType<typeof listAllSubscriptions>
>['data'][number]

type EventName = 'order_created' | 'order_refunded'

type Payload = {
  meta: {
    test_mode: boolean
    event_name: EventName
    custom_data?: {
      user_id?: string
    }
  }
  data: LemonSqueezySubscription
}

async function handleOrderCreated(
  userId: string | undefined,
  subscription: LemonSqueezySubscription
) {
  let _userId = userId

  if (!_userId) {
    const email = subscription.attributes.user_email
    // lookup user by email
    const { data } = await supabaseAdmin
      .from('user_data')
      .select('user_id')
      .eq('email', email)
      .maybeSingle()
    if (data?.user_id) {
      _userId = data.user_id
    } else {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: false,
      })
      if (error) {
        return new Response('Error creating user', {
          status: 400,
        })
      }

      _userId = data.user.id
    }
  }

  const { data, error: userDataGetError } = await supabaseAdmin
    .from('user_data')
    .select('data')
    .eq('user_id', _userId)
    .single()
  if (userDataGetError) {
    return new Response('Error fetching user data', {
      status: 400,
    })
  }
  const existingData = data?.data

  const { error: userDataSetError } = await supabaseAdmin
    .from('user_data')
    .update({
      data: {
        ...(typeof existingData === 'object' && existingData),
        has_purchased: true,
      },
    })
    .eq('user_id', _userId)

  if (userDataSetError) {
    return new Response('Error updating user data', {
      status: 400,
    })
  }
}

async function handleOrderRefunded(subscription: LemonSqueezySubscription) {
  const { data, error: userDataGetError } = await supabaseAdmin
    .from('user_data')
    .select('user_id,data')
    .eq('email', subscription.attributes.user_email)
    .single()
  if (userDataGetError) {
    return new Response('Error fetching user data', {
      status: 400,
    })
  }
  const existingData = data.data

  const { error: userDataSetError } = await supabaseAdmin
    .from('user_data')
    .update({
      data: {
        ...(typeof existingData === 'object' && existingData),
        has_purchased: false,
      },
    })
    .eq('user_id', data.user_id)

  if (userDataSetError) {
    return new Response('Error updating user data', {
      status: 400,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text()
    const hmac = crypto.createHmac(
      'sha256',
      process.env.LEMON_SQUEEZY_WEBHOOK_SIGNING_SECRET ?? ''
    )
    const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8')
    const signature = Buffer.from(
      request.headers.get('x-signature') as string,
      'utf8'
    )

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature.', {
        status: 400,
      })
    }

    const payload = JSON.parse(text)

    const {
      meta: { event_name: eventName, custom_data: customData },
      data: subscription,
    } = payload as Payload

    switch (eventName) {
      case 'order_created':
        const errorResponse1 = await handleOrderCreated(
          customData?.user_id,
          subscription
        )
        if (errorResponse1) {
          return errorResponse1
        }

        break
      case 'order_refunded':
        const errorResponse2 = await handleOrderRefunded(subscription)
        if (errorResponse2) {
          return errorResponse2
        }
        break
      default:
        throw new Error(`🤷‍♀️ Unhandled event: ${eventName}`)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      })
    }

    return new Response('Webhook error', {
      status: 400,
    })
  }

  return new Response(null, {
    status: 200,
  })
}
