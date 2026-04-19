import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET /api/availability - returns available days (0-6)
// PATCH /api/availability - admin only, update available days
export async function GET() {
  const { data, error } = await (getSupabaseAdmin()
    .from('availability' as any)
    .select('available_days')
    .single() as any)

  if (error || !data) {
    // Return default if not set: all days
    return NextResponse.json({ available_days: [0, 1, 2, 3, 4, 5, 6] })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')?.value

  if (adminAuth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { available_days } = await req.json()

  if (!Array.isArray(available_days) || available_days.length === 0) {
    return NextResponse.json({ error: 'Invalid available_days' }, { status: 400 })
  }

  // Upsert: update if exists, insert if not
  const { data, error } = await (getSupabaseAdmin()
    .from('availability' as any)
    .upsert({ id: 1, available_days } as any, { onConflict: 'id' })
    .select()
    .single() as any)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
