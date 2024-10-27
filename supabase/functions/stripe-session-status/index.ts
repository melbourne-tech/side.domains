import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { corsHeaders } from '../_lib/cors.ts'
import stripe from '../_lib/stripe.ts'

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

  const { sessionId } = await req.json()

  if (typeof sessionId !== 'string') {
    return new Response(null, { status: 400 })
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return new Response(JSON.stringify({ status: session.status }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
