'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Copy, ExternalLink } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/date'

interface Attendee {
  id: string
  name: string
  phone: string | null
  email: string | null
  cardToken: string
  checkedIn: boolean
  checkedInAt: string | null
}

export default function AttendeeList({
  attendees,
  appUrl,
}: {
  attendees: Attendee[]
  appUrl: string
}) {
  if (attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-[#1a1d27] rounded-xl border border-white/10 text-center">
        <Clock size={36} className="text-white/20 mb-3" />
        <p className="text-sm text-white/40">No attendees yet. Add one above.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {attendees.map((a) => (
        <AttendeeRow key={a.id} attendee={a} appUrl={appUrl} />
      ))}
    </ul>
  )
}

function AttendeeRow({ attendee, appUrl }: { attendee: Attendee; appUrl: string }) {
  const [copied, setCopied] = useState(false)
  const cardUrl = `${appUrl}/card/${attendee.cardToken}`

  async function copyLink() {
    await navigator.clipboard.writeText(cardUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <li className="flex items-center justify-between bg-[#1a1d27] border border-white/5 rounded-xl px-4 py-3 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
            attendee.checkedIn ? 'bg-[#1DB954]/20' : 'bg-white/5'
          }`}
        >
          <CheckCircle2
            size={15}
            className={attendee.checkedIn ? 'text-[#1DB954]' : 'text-white/20'}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{attendee.name}</p>
          <p className="text-xs text-white/40 truncate">
            {attendee.checkedIn && attendee.checkedInAt
              ? `Checked in ${formatDateTime(attendee.checkedInAt)}`
              : attendee.phone || attendee.email || ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href={cardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          title="View card"
        >
          <ExternalLink size={14} />
        </a>
        <button
          onClick={copyLink}
          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          title="Copy card link"
        >
          <Copy size={14} />
        </button>
        {copied && <span className="text-xs text-[#1DB954]">Copied!</span>}
      </div>
    </li>
  )
}
