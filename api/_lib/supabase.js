import { createClient } from '@supabase/supabase-js'

// Server-only. SUPABASE_SERVICE_ROLE_KEY must never be imported from
// anything that ships to the browser — this file only ever runs inside
// /api serverless functions, never from src/.
let client = null

export function getSupabaseAdmin() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the server environment (.env locally, project env vars in production).'
    )
  }

  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}
