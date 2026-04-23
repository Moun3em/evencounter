import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScanLine, Users, Key } from 'lucide-react'
import { format } from '@/lib/utils/date'
import AddAttendeeForm from './AddAttendeeForm'
import AttendeeList from './AttendeeList'
import LiveCounter from './LiveCounter'
import EventStatusControl from './EventStatusControl'
import type { EventStatus } from '@/lib/db/types'

interface EventRow {
  id: string
  org_id: string
  name: string
  date: string
  venue: string | null
  capacity: number | null
  status: EventStatus
  scan_pin: string
  created_at: string
  organizations: { owner_id: string }
}

interface AttendeeRow {
  id: string
  name: string
  phone: string | null
  email: string | null
  card_token: string
  check_ins: { id: string; checked_in_at: string }[]
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: eventRaw } = await supabase
    .from('events')
    .select('*, organizations!inner(owner_id)')
    .eq('id', id)
    .single()

  const event = eventRaw as unknown as EventRow | null

  if (!event || event.organizations.owner_id !== user.id) {
    notFound()
  }

  const { data: attendeesRaw } = await supabase
    .from('attendees')
    .select('id, name, phone, email, card_token, check_ins(id, checked_in_at)')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  const attendees = (attendeesRaw as unknown as AttendeeRow[]) ?? []

  const checkedInCount = attendees.filter((a) => a.check_ins?.length > 0).length
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const scanUrl = `${appUrl}/scan/${id}`

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        All events
      </Link>

      {/* Event header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{event.name}</h1>
          <p className="text-sm text-white/40 mt-1">
            {format(event.date)}
            {event.venue && ` · ${event.venue}`}
          </p>
        </div>
        <EventStatusControl eventId={id} currentStatus={event.status} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <LiveCounter
          eventId={id}
          initialCount={checkedInCount}
          total={attendees?.length ?? 0}
          capacity={event.capacity}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Invited"
          value={String(attendees?.length ?? 0)}
        />
        {event.capacity && (
          <StatCard
            icon={<Users size={18} />}
            label="Capacity"
            value={String(event.capacity)}
          />
        )}
      </div>

      {/* Scan gate link */}
      <div className="bg-[#1a1d27] rounded-xl p-4 border border-white/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <ScanLine size={20} className="text-[#1DB954] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Gate scan page</p>
            <p className="text-xs text-white/40 mt-0.5">Share this link with your gate staff</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs bg-[#0f1117] px-3 py-1.5 rounded-lg text-white/50">
            <Key size={12} />
            PIN: <span className="font-mono font-bold text-white">{event.scan_pin}</span>
          </span>
          <CopyButton value={scanUrl} label="Copy scan link" />
        </div>
      </div>

      {/* Add attendee */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Add attendee</h2>
        <AddAttendeeForm eventId={id} />
      </section>

      {/* Attendee list */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Attendees ({attendees.length})
        </h2>
        <AttendeeList
          attendees={attendees.map((a) => ({
            id: a.id,
            name: a.name,
            phone: a.phone,
            email: a.email,
            cardToken: a.card_token,
            checkedIn: (a.check_ins?.length ?? 0) > 0,
            checkedInAt: a.check_ins?.[0]?.checked_in_at ?? null,
          }))}
          appUrl={appUrl}
        />
      </section>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-[#1a1d27] rounded-xl p-4 border border-white/10">
      <div className="text-white/40 mb-1">{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </div>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      data-copy={value}
      className="text-xs px-3 py-1.5 bg-[#1DB954]/20 text-[#1DB954] rounded-lg hover:bg-[#1DB954]/30 transition-colors font-medium copy-btn"
    >
      {label}
    </button>
  )
}
