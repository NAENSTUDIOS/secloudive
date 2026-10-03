import { createServerClient } from '@supabase/ssr'

const supabaseUrl =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL)) ||
  'https://wcthjlnbkwkhvxrcuwfx.supabase.co'

const supabaseKey =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)) ||
  ''

export const createClient = (cookieStore) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll ? cookieStore.getAll() : []
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (cookieStore?.set) {
                cookieStore.set(name, value, options)
              }
            })
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}

export default createClient
