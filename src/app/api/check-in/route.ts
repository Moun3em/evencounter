import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { token, eventId, scannerSession } = await req.json()

  if (!token || !eventId) {
    return NextResponse.json(
      { status: 'invalid', message: 'Missing token or eventId' },
      { status: 400 }
    )
  }

  const supabase = getSupabase()

  const { data: attendee } = await supabase
    .from('attendees')
    .select('id, name, event_id')
    .eq('card_token', token)
    .eq('event_id', eventId)
    .single<{ id: string; name: string; event_id: string }>()

  if (!attendee) {
    return NextResponse.json({ status: 'invalid', message: 'Card not found' })
  }

  const { data: existing } = await supabase
    .from('check_ins')
    .select('checked_in_at')
    .eq('attendee_id', attendee.id)
    .single<{ checked_in_at: string }>()

  if (existing) {
    return NextResponse.json({
      status: 'duplicate',
      name: attendee.name,
      checkedInAt: existing.checked_in_at,
    })
  }

  const { error } = await supabase.from('check_ins').insert({
    attendee_id: attendee.id,
    event_id: eventId,
    scanner_session: scannerSession ?? null,
  })

  if (error) {
    if (error.code === '23505') {
      const { data: existing2 } = await supabase
        .from('check_ins')
        .select('checked_in_at')
        .eq('attendee_id', attendee.id)
        .single<{ checked_in_at: string }>()

      return NextResponse.json({
        status: 'duplicate',
        name: attendee.name,
        checkedInAt: existing2?.checked_in_at ?? new Date().toISOString(),
      })
    }
    return NextResponse.json({ status: 'invalid', message: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ status: 'valid', name: attendee.name, message: 'Entry approved' })
}
