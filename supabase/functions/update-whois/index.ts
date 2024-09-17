import { createClient } from '@supabase/supabase-js'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { domain as lookupWhois } from 'whoiser'
import { getObjectWithMostKeys } from '../_lib/utils.ts'

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

  const whoisData = getObjectWithMostKeys<{ [key: string]: unknown }>(
    await lookupWhois(data.domain_name)
  )

  const expiresAt =
    whoisData['Expiry Date'] ||
    whoisData['Expiration Date'] ||
    whoisData['Registry Expiry Date'] ||
    whoisData['Registrar Registration Expiration Date'] ||
    whoisData['Registrar Expiration Date'] ||
    whoisData['Expiry'] ||
    whoisData['Expires']

  await supabaseClient
    .from('domain_names')
    .update({ whois_data: whoisData, expires_at: expiresAt })
    .eq('id', id)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
