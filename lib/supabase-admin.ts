import { createClient } from '@supabase/supabase-js'
import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or key')
}

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  global: { fetch },
  auth: {
    persistSession: typeof window !== 'undefined',
  },
})

export default supabaseAdmin

export async function getUserFromRequest(
  request: NextRequest | NextApiRequest
) {
  let token: string | undefined

  if (typeof request.headers.get === 'function') {
    token = request.headers.get('Authorization')?.replace('Bearer ', '')
  } else {
    token = request.headers['authorization']?.replace('Bearer ', '')
  }
  if (!token) return null

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) return null

  return user
}
