import { NextApiRequest, NextApiResponse } from 'next'
import supabaseAdmin from '~/lib/supabase-admin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { domain } = req.query

  if (typeof domain !== 'string') {
    return res.status(400).send('Domain must be a string')
  }

  if (domain.startsWith('www.')) {
    domain = domain.slice(4)
  }

  const { error } = await supabaseAdmin
    .from('domain_names')
    .select()
    .eq('domain_name', domain.toLowerCase())
    .single()
  if (error) {
    return res.status(404).send('Domain not found')
  }

  return res.status(200).send('ok')
}
