import { createClient } from '@supabase/supabase-js'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 })
  }

  const { id } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    }
  )

  const { data } = await supabaseClient
    .from('domain_names')
    .select()
    .eq('id', id)
    .maybeSingle()

  if (!data) {
    return new Response(null, { status: 404 })
  }

  const whoisResponse = await fetch(
    `https://whois.side.domains/${data.domain_name}`
  )
  const whoisFullData = await whoisResponse.json()
  const whoisData = whoisFullData?.data

  const expiresAt = whoisData?.domain?.expiration_date ?? null

  const status =
    whoisFullData?.success === true
      ? 'registered'
      : whoisResponse.status === 404
      ? 'available'
      : 'unknown'

  await supabaseClient
    .from('domain_names')
    .update({ whois_data: whoisData, expires_at: expiresAt, status })
    .eq('id', id)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
