'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    capacity: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!org) { setError('Organisation not found.'); setLoading(false); return }

    const { data: event, error: insertError } = await supabase
      .from('events')
      .insert({
        org_id: org.id,
        name: form.name,
        date: form.date,
        venue: form.venue || null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        status: 'draft',
        scan_pin: generatePin(),
      })
      .select('id')
      .single()

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      router.push(`/dashboard/events/${event.id}`)
    }
  }

  return (
    <div className="max-w-lg">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to events
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Create event</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-[#1a1d27] rounded-2xl p-6 border border-white/10">
        <Field label="Event name *" htmlFor="name">
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Dancehall Fete 2026"
            className="input"
          />
        </Field>

        <Field label="Date *" htmlFor="date">
          <input
            id="date"
            type="date"
            required
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Venue" htmlFor="venue">
          <input
            id="venue"
            type="text"
            value={form.venue}
            onChange={(e) => set('venue', e.target.value)}
            placeholder="e.g. National Arena, Kingston"
            className="input"
          />
        </Field>

        <Field label="Capacity (optional)" htmlFor="capacity">
          <input
            id="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            placeholder="e.g. 500"
            className="input"
          />
        </Field>

        {error && <p className="text-sm text-[#ef4444]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#1DB954] text-white font-semibold rounded-xl hover:bg-[#158A3E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Creating...' : 'Create event'}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-white/70 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
