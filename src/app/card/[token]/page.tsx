import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from '@/lib/utils/date'
import { MapPin, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import QRCard from './QRCard'

interface Props {
  params: Promise<{ token: string }>
}

export default async function CardPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  interface AttendeeWithJoins {
    id: string
    name: string
    card_token: string
    events: { id: string; name: string; date: string; venue: string | null; status: string } | null
    check_ins: { id: string; checked_in_at: string }[]
  }

  const { data: attendeeRaw } = await supabase
    .from('attendees')
    .select('id, name, card_token, events(id, name, date, venue, status), check_ins(id, checked_in_at)')
    .eq('card_token', token)
    .single()

  const attendee = attendeeRaw as unknown as AttendeeWithJoins | null
  if (!attendee || !attendee.events) notFound()

  const event = attendee.events
  const checkedIn = attendee.check_ins?.length > 0
  const checkedInAt = attendee.check_ins?.[0]?.checked_in_at

  return (
    <div className="card-page min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header stripe */}
          <div className="bg-[#0f1117] px-6 pt-6 pb-8">
            <p className="text-[#1DB954] text-xs font-bold tracking-widest uppercase mb-1">
              EvenCounter
            </p>
            <h1 className="text-white text-xl font-bold leading-snug">{event.name}</h1>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Attendee name */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Attendee</p>
              <p className="text-2xl font-bold text-gray-900 truncate">{attendee.name}</p>
            </div>

            {/* Event details */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={15} className="text-[#1DB954] shrink-0" />
                {format(event.date)}
              </div>
              {event.venue && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={15} className="text-[#1DB954] shrink-0" />
                  {event.venue}
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex justify-center py-2">
              <QRCard token={token} />
            </div>

            {/* Status */}
            {checkedIn ? (
              <div className="flex items-center gap-2 bg-[#d4f7e2] text-[#158a3e] rounded-xl px-4 py-3 text-sm font-semibold">
                <CheckCircle2 size={18} />
                Checked in{checkedInAt ? ` · ${new Date(checkedInAt).toLocaleTimeString('en-JM', { hour: '2-digit', minute: '2-digit' })}` : ''}
              </div>
            ) : event.status === 'closed' ? (
              <div className="flex items-center gap-2 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 text-sm font-semibold">
                <XCircle size={18} />
                Event closed
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 text-gray-600 rounded-xl px-4 py-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shrink-0" />
                Present this card at the gate
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by EvenCounter · Do not share this link
        </p>
      </div>
    </div>
  )
}
