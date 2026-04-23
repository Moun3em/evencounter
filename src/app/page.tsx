import Link from 'next/link'
import { QrCode, Users, ScanLine, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0f1117] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-6xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight text-[#1DB954]">EvenCounter</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold bg-[#1DB954] text-white rounded-lg hover:bg-[#158A3E] transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="px-3 py-1 text-xs font-semibold bg-[#1DB954]/20 text-[#1DB954] rounded-full mb-6 tracking-wide uppercase">
          Built for Jamaican events
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Every entry, <span className="text-[#1DB954]">counted.</span>
        </h1>
        <p className="text-lg text-white/60 mb-8 max-w-xl leading-relaxed">
          Issue digital QR cards to your guests in minutes. Scan at the gate, see who&apos;s in,
          and stop double-entry — no hardware, no app install.
        </p>
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DB954] text-white font-semibold rounded-xl hover:bg-[#158A3E] transition-colors text-base w-full sm:w-auto"
        >
          Start your first event <ArrowRight size={18} />
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <QrCode size={24} />,
              title: 'Digital cards',
              desc: 'Unique QR cards sent via link — no printing.',
            },
            {
              icon: <ScanLine size={24} />,
              title: 'Gate scanning',
              desc: 'Staff scan from any smartphone browser.',
            },
            {
              icon: <BarChart3 size={24} />,
              title: 'Live count',
              desc: 'Real-time headcount as guests arrive.',
            },
            {
              icon: <Users size={24} />,
              title: 'No duplicates',
              desc: 'Each card is single-use. Zero double-entry.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#1a1d27] rounded-xl p-5 border border-white/5 hover:border-[#1DB954]/30 transition-colors"
            >
              <div className="text-[#1DB954] mb-3">{icon}</div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="px-6 py-12 max-w-2xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Everything you need at the gate</h2>
        <ul className="text-left inline-flex flex-col gap-3">
          {[
            'Create an event in under 2 minutes',
            'Add guests manually or by CSV (coming soon)',
            'Share card links via WhatsApp',
            'Scan QR codes — no app, no hardware',
            'Watch the live headcount on your phone',
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-white/70">
              <CheckCircle2 size={18} className="text-[#1DB954] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/30">
        © {new Date().getFullYear()} EvenCounter · Built for Jamaica · By Monipathos
      </footer>
    </main>
  )
}
