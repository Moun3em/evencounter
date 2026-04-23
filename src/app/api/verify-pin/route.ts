import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { eventId, pin } = await req.json()

  if (!eventId || !pin) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data: event } = await supabase
    .from('events')
    .select('scan_pin')
    .eq('id', eventId)
    .single<{ scan_pin: string }>()

  if (!event || event.scan_pin !== pin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
