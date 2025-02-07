import { createClient } from '@supabase/supabase-js'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import React from 'react'
import { Resend } from 'resend'
import StatusChangeNotificationEmail from './_email/StatusChangeNotificationEmail.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 })
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  if (!serviceRoleKey || !token || token !== serviceRoleKey) {
    return new Response(null, { status: 401 })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { new_status, previous_status, domain_name_id } = await req.json()

  const { data } = await supabaseAdmin
    .from('domain_names')
    .select('domain_name,updated_at,user_id')
    .eq('id', domain_name_id)
    .maybeSingle()

  if (!data) {
    return new Response(null, { status: 404 })
  }

  const { domain_name, updated_at, user_id } = data

  const { data: userData, error: userError } = await supabaseAdmin
    .from('user_data')
    .select('email')
    .eq('user_id', user_id)
    .single()

  if (userError) {
    console.error('error fetching user data:', userError)
    return new Response(null, { status: 500 })
  }

  const { error } = await resend.emails.send({
    from: 'side.domains Notifications <notifications@side.domains>',
    to: userData.email,
    subject: `Status update for ${data.domain_name}: ${previous_status} → ${new_status}`,
    react: (
      <StatusChangeNotificationEmail
        domain_name={domain_name}
        previous_status={previous_status}
        new_status={new_status}
        updated_at={updated_at}
      />
    ),
  })

  if (error) {
    console.error('error sending email:', error)
    return new Response(null, { status: 500 })
  }

  return new Response(JSON.stringify({ sent: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
