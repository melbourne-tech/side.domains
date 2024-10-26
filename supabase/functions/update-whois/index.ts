import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_lib/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(null, { status: 405, headers: corsHeaders })
  }

  const { id } = await req.json()
  if (typeof id !== 'string') {
    return new Response(null, { status: 400, headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    }
  )

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Fetch the domain name with the user context
  const { data } = await supabaseClient
    .from('domain_names')
    .select()
    .eq('id', id)
    .maybeSingle()

  if (!data) {
    return new Response(null, { status: 404, headers: corsHeaders })
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

  const { error } = await supabaseAdmin
    .from('domain_names')
    .update({
      whois_data: whoisData,
      expires_at: expiresAt,
      status,
      whois_updated_at: 'now()',
    })
    .eq('id', id)

  if (error) {
    console.error('error updating domain name:', error)
    return new Response(null, { status: 500, headers: corsHeaders })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
