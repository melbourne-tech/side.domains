import { NextRequest } from 'next/server'
import * as z from 'zod'
import supabaseAdmin, { getUserFromRequest } from '~/lib/supabase-admin'
import { ParseResultType, parseDomain } from 'parse-domain'

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
    domainName = `${domain}.${topLevelDomains.join('.')}`
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

  await supabaseAdmin.from('domain_names').insert([
    {
      domain_name: domainName,
      user_id: user.id,
    },
    {
      domain_name: `www.${domainName}`,
      user_id: user.id,
    },
  ])

  // We have to add the domains in order because of the redirect on the second domain
  const apexResponse = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      body: JSON.stringify({
        name: domainName,
      }),
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )

  const wwwResponse = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=${process.env.VERCEL_TEAM_ID}`,
    {
      body: JSON.stringify({
        name: `www.${domainName}`,
        redirect: domainName,
        redirectStatusCode: 308,
      }),
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )

  const apexData = await apexResponse.json()
  const wwwData = await wwwResponse.json()

  return new Response(
    JSON.stringify({
      apex: {
        domainName: apexData.name,
        verificationRecords: apexData.verification,
      },
      www: {
        domainName: wwwData.name,
        verificationRecords: wwwData.verification,
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json;',
      },
    }
  )
}
