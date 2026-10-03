import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl =
  (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  import.meta.env?.VITE_SUPABASE_URL ||
  'https://wcthjlnbkwkhvxrcuwfx.supabase.co'

const supabaseKey =
  (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  ''

export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export default createClient
