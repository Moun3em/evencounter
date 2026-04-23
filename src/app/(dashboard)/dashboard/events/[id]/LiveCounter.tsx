'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users } from 'lucide-react'

interface Props {
  eventId: string
  initialCount: number
  total: number
  capacity: number | null
}

export default function LiveCounter({ eventId, initialCount, total, capacity }: Props) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`checkins-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'check_ins', filter: `event_id=eq.${eventId}` },
        () => setCount((c) => c + 1)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [eventId])

  const atCapacity = capacity != null && count >= capacity

  return (
    <div
      className={`bg-[#1a1d27] rounded-xl p-4 border ${atCapacity ? 'border-[#f59e0b]' : 'border-white/10'} col-span-2 sm:col-span-1`}
    >
      <div className={`mb-1 ${atCapacity ? 'text-[#f59e0b]' : 'text-[#1DB954]'}`}>
        <Users size={18} />
      </div>
      <p className={`text-3xl font-extrabold ${atCapacity ? 'text-[#f59e0b]' : 'text-[#1DB954]'}`}>
        {count}
      </p>
      <p className="text-xs text-white/40 mt-0.5">
        {atCapacity ? 'AT CAPACITY' : `Checked in of ${total}`}
      </p>
    </div>
  )
}
