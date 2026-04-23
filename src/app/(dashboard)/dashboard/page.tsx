import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, CalendarDays, ChevronRight } from 'lucide-react'
import { format } from '@/lib/utils/date'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('owner_id', user!.id)
    .single<{ id: string; name: string }>()

  const { data: events } = await supabase
    .from('events')
    .select('id, name, date, venue, status, capacity')
    .eq('org_id', org?.id ?? '')
    .order('date', { ascending: false })
    .returns<{ id: string; name: string; date: string; venue: string | null; status: string; capacity: number | null }[]>()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your events</h1>
          <p className="text-sm text-white/40 mt-1">{org?.name}</p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white text-sm font-semibold rounded-xl hover:bg-[#158A3E] transition-colors"
        >
          <Plus size={16} />
          New event
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <CalendarDays size={48} className="text-white/20 mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No events yet</h2>
          <p className="text-sm text-white/40 mb-6">
            Create your first event to start issuing digital cards.
          </p>
          <Link
            href="/dashboard/events/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] text-white text-sm font-semibold rounded-xl hover:bg-[#158A3E] transition-colors"
          >
            <Plus size={16} />
            Create event
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/dashboard/events/${event.id}`}
                className="flex items-center justify-between bg-[#1a1d27] hover:bg-[#22263a] border border-white/5 rounded-xl px-5 py-4 transition-colors group"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white group-hover:text-[#1DB954] transition-colors">
                    {event.name}
                  </span>
                  <span className="text-sm text-white/40 flex items-center gap-2">
                    <CalendarDays size={13} />
                    {format(event.date)}
                    {event.venue && ` · ${event.venue}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={event.status} />
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-white/10 text-white/50' },
    active: { label: 'Active', className: 'bg-[#1DB954]/20 text-[#1DB954]' },
    closed: { label: 'Closed', className: 'bg-white/5 text-white/30' },
  }
  const { label, className } = map[status] ?? map.draft
  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
      {label}
    </span>
  )
}
