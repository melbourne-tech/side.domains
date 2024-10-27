import { createClient } from '@supabase/supabase-js'

export async function getUserFromRequest(
  request: Request
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) return null

  return user
}
