import { NextRequest } from 'next/server'
import { ParseResultType, parseDomain } from 'parse-domain'
import * as z from 'zod'
import supabaseAdmin, { getUserFromRequest } from '~/lib/supabase-admin'

const schema = z.object({
  domainName: z.string().min(1, 'Domain must not be empty'),
})

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return new Response(
      JSON.stringify({
        code: 'NOT_AUTHENTICATED',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const body = await request.json()

  const result = await schema.safeParseAsync(body)
  if (!result.success) {
    return new Response(
      JSON.stringify({
        code: 'VALIDATION_ERROR',
        errors: result.error.flatten(),
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const { domainName: rawDomainName } = result.data

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
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json;',
    },
  })
}
