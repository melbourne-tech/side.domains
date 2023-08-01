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

    const userId = customData?.user_id

    switch (eventName) {
      case 'order_created':
        const { data, error: userDataGetError } = await supabaseAdmin
          .from('user_data')
          .select('data')
          .eq('user_id', userId)
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
          .eq('user_id', userId)

        if (userDataSetError) {
          return new Response('Error updating user data', {
            status: 400,
          })
        }

        break
      case 'order_refunded':
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
