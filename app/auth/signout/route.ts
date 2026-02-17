import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
    const supabase = createClient()

    // Check if we have a session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    return NextResponse.redirect(new URL('/login', req.url), {
        status: 302,
    })
}
