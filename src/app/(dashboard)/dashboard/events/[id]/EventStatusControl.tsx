'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Status = 'draft' | 'active' | 'closed'

const transitions: Record<Status, { next: Status; label: string; className: string } | null> = {
  draft: { next: 'active', label: 'Activate event', className: 'bg-[#1DB954] hover:bg-[#158A3E] text-white' },
  active: { next: 'closed', label: 'Close event', className: 'bg-white/10 hover:bg-white/20 text-white/70' },
  closed: null,
}

export default function EventStatusControl({
  eventId,
  currentStatus,
}: {
  eventId: string
  currentStatus: Status
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const transition = transitions[currentStatus]

  if (!transition) return null

  async function handleTransition() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('events').update({ status: transition!.next }).eq('id', eventId)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleTransition}
      disabled={loading}
      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shrink-0 ${transition.className}`}
    >
      {loading ? 'Updating...' : transition.label}
    </button>
  )
}
