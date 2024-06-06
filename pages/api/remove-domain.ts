import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { ParseResultType, parseDomain } from 'parse-domain'
import supabaseAdmin, { getUserFromRequest } from '~/lib/supabase-admin'

const schema = z.object({
  domain: z.string().min(1, 'Domain must not be empty'),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromRequest(req)
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

  const result = schema.safeParse(req.query)
  if (result.error) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      errors: result.error.flatten(),
    })
  }

  let domainName: string | undefined = undefined

  const parseResult = parseDomain(result.data.domain)
  if (parseResult.type === ParseResultType.Listed) {
    const { domain, topLevelDomains } = parseResult
    domainName = `${domain}.${topLevelDomains.join('.')}`
  }
  if (domainName === undefined) {
    return res.status(400).json({
      code: 'INVALID_DOMAIN',
    })
  }

  const wwwDomain = `www.${domainName}`
  const domains = [domainName, wwwDomain]

  const { error, count } = await supabaseAdmin
    .from('domain_names')
    .delete({ count: 'exact' })
    .in('domain_name', domains)
    .eq('user_id', user.id)

  if (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      error: error.message,
    })
  }

  if (count === domains.length) {
    // We have to remove the domains in order because of the redirect on the first domain
    await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${wwwDomain}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        },
        method: 'DELETE',
      }
    )
    await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domainName}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        },
        method: 'DELETE',
      }
    )
  }

  res.status(200).send({ status: 'SUCCESS' })
}
