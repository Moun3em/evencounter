'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#1DB954]">
            EvenCounter
          </Link>
          <p className="mt-2 text-white/50 text-sm">Sign in to manage your events</p>
        </div>

        <div className="bg-[#1a1d27] rounded-2xl p-6 border border-white/10">
          {sent ? (
            <div className="text-center py-4">
              <Mail size={40} className="text-[#1DB954] mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">Check your inbox</h2>
              <p className="text-white/50 text-sm">
                We sent a magic link to <strong className="text-white">{email}</strong>.
                <br />
                Click the link to sign in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-[#1DB954] hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0f1117] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-sm"
                />
              </div>

              {error && <p className="text-sm text-[#ef4444]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1DB954] text-white font-semibold rounded-lg hover:bg-[#158A3E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
