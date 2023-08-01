import { NextResponse } from 'next/server'
import { z } from 'zod'
import NewOfferEmailTemplate from '~/emails/new-offer'
import resend from '~/emails/resend'
import supabaseAdmin from '~/lib/supabase-admin'

const schema = z.object({
  domainName: z.string().min(1, 'Domain name must not be empty'),
  email: z.string().email(),
  offer: z.number().min(1, 'Offer must be at least $1'),
  message: z.string().nullable(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { domainName, email, message, offer } = schema.parse(body)

    const { data: domainInfo, error: domainInfoError } = await supabaseAdmin
      .from('domain_names')
      .select()
      .eq('domain_name', domainName)
      .single()
    if (domainInfoError) throw domainInfoError

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.admin.getUserById(domainInfo.user_id)
    if (userError) throw userError
    if (!user) throw new Error('User not found')
    if (!user.email) throw new Error('User email not found')

    await resend.emails.send({
      from: 'side.domains Offer Notification <offers@side.domains>',
      to: [user.email],
      reply_to: email,
      subject: `Offer for ${domainName}`,
      react: (
        <NewOfferEmailTemplate
          offer={offer}
          from={email}
          message={message ?? undefined}
        />
      ),
    })

    return NextResponse.json({ sent: true })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
