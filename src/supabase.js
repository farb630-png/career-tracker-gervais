import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Export null when credentials are not configured — app checks for this
export const supabase = (url && key) ? createClient(url, key) : null
