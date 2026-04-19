import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin_auth')?.value

  if (adminAuth === process.env.ADMIN_PASSWORD) {
    const { data, error } = await getSupabaseAdmin()
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (!date) return NextResponse.json({ error: 'date param required' }, { status: 400 })
  const { data, error } = await getSupabaseAdmin()
    .from('bookings')
    .select('time')
    .eq('date', date)
    .neq('status', 'rejected')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookedTimes: data.map(r => r.time) })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, whatsapp_number, notes, date, time } = body

  if (!name || !phone || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: existing } = await getSupabaseAdmin()
    .from('bookings')
    .select('id')
    .eq('date', date)
    .eq('time', time)
    .neq('status', 'rejected')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('bookings')
    .insert({
      name, email, phone,
      whatsapp_number: whatsapp_number || phone,
      notes,
      date,
      time,
      service: 'Financial Planning',
      status: 'pending'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
