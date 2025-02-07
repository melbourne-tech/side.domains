import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from '@supabase/supabase-js'
import { ParseResultType, parseDomain } from 'https://esm.sh/parse-domain@8.2.2'
import { getUserFromRequest } from '../_lib/auth.ts'
import { corsHeaders } from '../_lib/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(null, { status: 405, headers: corsHeaders })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const user = await getUserFromRequest(req)
  if (!user) {
    return new Response(
      JSON.stringify({
        code: 'NOT_AUTHENTICATED',
      }),
      {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const [
    { data: userData, error: userDataError },
    { count, error: domainNameCountError },
    body,
  ] = await Promise.all([
    supabaseAdmin
      .from('user_data')
      .select('is_subscribed')
      .eq('user_id', user.id)
      .single(),
    supabaseAdmin
      .from('domain_names')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    req.json(),
  ] as const)

  if (userDataError || domainNameCountError) {
    return new Response(
      JSON.stringify({
        code: 'ERROR_RETRIEVING_USER_DATA',
        message: userDataError?.message || domainNameCountError?.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const isSubscribed = userData?.is_subscribed
  if (!isSubscribed && (count ?? 0) >= 1) {
    return new Response(
      JSON.stringify({
        code: 'DOMAIN_LIMIT_REACHED',
        message:
          'Domain limit reached. Please upgrade your subscription to add more domains.',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  if (
    !(
      typeof body === 'object' &&
      body !== null &&
      'domainName' in body &&
      typeof body['domainName'] === 'string' &&
      body['domainName'].trim().length > 0
    )
  ) {
    return new Response(
      JSON.stringify({
        code: 'VALIDATION_ERROR',
        message: 'Domain must not be empty',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const rawDomainName = body['domainName'].trim()

  let domainName: string | undefined = undefined

  const parseResult = parseDomain(rawDomainName)
  if (parseResult.type === ParseResultType.Listed) {
    const { domain, topLevelDomains } = parseResult
    domainName = `${domain}.${topLevelDomains.join('.')}`.toLowerCase()
  }
  if (domainName === undefined) {
    return new Response(
      JSON.stringify({
        code: 'INVALID_DOMAIN',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('domain_names')
    .insert({
      domain_name: domainName,
      user_id: user.id,
    })
    .select('id')
    .single()

  if (error) {
    return new Response(
      JSON.stringify({
        code: 'INSERT_ERROR',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return new Response(JSON.stringify(data), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json;',
    },
  })
})
