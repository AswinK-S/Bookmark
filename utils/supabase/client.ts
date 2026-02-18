import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    if (typeof document === 'undefined') return []
                    return document.cookie.split('; ').map(cookie => {
                        const [name, ...rest] = cookie.split('=')
                        return { name, value: rest.join('=') }
                    })
                },
                setAll(cookies) {
                    if (typeof document === 'undefined') return
                    cookies.forEach(({ name, value, options }) => {
                        document.cookie = `${name}=${value}; path=/; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.sameSite ? `samesite=${options.sameSite};` : 'samesite=lax;'}`
                    })
                }
            }
        }
    )
}