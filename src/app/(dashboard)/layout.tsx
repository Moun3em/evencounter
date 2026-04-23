import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, CalendarDays } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#1DB954] font-bold text-lg">
          <CalendarDays size={20} />
          EvenCounter
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40 hidden sm:block">{user.email}</span>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">{children}</main>
    </div>
  )
}
