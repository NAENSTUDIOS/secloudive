import { createServerClient } from '@supabase/ssr'

const supabaseUrl =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL)) ||
  'https://wcthjlnbkwkhvxrcuwfx.supabase.co'

const supabaseKey =
  (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)) ||
  ''

export const createClient = (request, responseFactory) => {
  let supabaseResponse = responseFactory ? responseFactory() : null

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll ? request.cookies.getAll() : []
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            if (request?.cookies?.set) request.cookies.set(name, value)
          })
          if (supabaseResponse && supabaseResponse.cookies?.set) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          }
        },
      },
    }
  )

  return { supabase, supabaseResponse }
}

export default createClient
