import { createClient } from '@supabase/supabase-js'
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
