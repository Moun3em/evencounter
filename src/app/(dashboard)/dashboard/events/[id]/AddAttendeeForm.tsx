'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createId } from '@paralleldrive/cuid2'
import { UserPlus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AddAttendeeForm({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.phone && !form.email) {
      setError('Please provide a phone number or email address.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('attendees').insert({
      event_id: eventId,
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      card_token: createId(),
    })

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      setForm({ name: '', phone: '', email: '' })
      router.refresh()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1d27] rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        required
        placeholder="Full name *"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        className="input flex-1"
      />
      <input
        type="tel"
        placeholder="Phone (e.g. 876-555-0100)"
        value={form.phone}
        onChange={(e) => set('phone', e.target.value)}
        className="input flex-1"
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        className="input flex-1"
      />
      {error && <p className="text-sm text-[#ef4444] w-full">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1DB954] text-white text-sm font-semibold rounded-xl hover:bg-[#158A3E] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
        Add
      </button>
    </form>
  )
}
