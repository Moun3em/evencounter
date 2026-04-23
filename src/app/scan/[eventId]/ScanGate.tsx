'use client'

import { useState, useRef, useEffect } from 'react'
import { ScanLine, Loader2, CheckCircle2, XCircle, AlertTriangle, Key } from 'lucide-react'

type ScanResult =
  | { status: 'valid'; name: string; message: string }
  | { status: 'duplicate'; name: string; checkedInAt: string }
  | { status: 'invalid'; message: string }
  | null

export default function ScanGate({ eventId }: { eventId: string }) {
  const [pin, setPin] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult>(null)
  const [scannerReady, setScannerReady] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrRef = useRef<unknown>(null)

  async function verifyPin(e: React.FormEvent) {
    e.preventDefault()
    setPinError('')
    const res = await fetch(`/api/verify-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, pin }),
    })
    if (res.ok) {
      setAuthenticated(true)
    } else {
      setPinError('Incorrect PIN. Try again.')
    }
  }

  useEffect(() => {
    if (!authenticated || !scannerRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scanner: { start: (...args: any[]) => Promise<void>; stop: () => Promise<void> } | null = null

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader')
      html5QrRef.current = scanner
      setScannerReady(true)

      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          if (scanning) return
          setScanning(true)

          // Extract token from URL or use raw value
          let token = decodedText
          try {
            const url = new URL(decodedText)
            const parts = url.pathname.split('/')
            token = parts[parts.length - 1]
          } catch {}

          const res = await fetch('/api/check-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, eventId, scannerSession: sessionName }),
          })
          const data = await res.json()
          setResult(data)
          setScanning(false)

          setTimeout(() => setResult(null), 3000)
        },
        () => {}
      ).catch(() => {
        setScannerReady(false)
      })
    })

    return () => {
      if (scanner) {
        try { scanner.stop() } catch {}
      }
    }
  }, [authenticated, eventId, sessionName, scanning])

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <ScanLine size={40} className="text-[#1DB954] mx-auto mb-3" />
            <h1 className="text-xl font-bold text-white">Gate Scanner</h1>
            <p className="text-sm text-white/40 mt-1">Enter the event PIN to begin</p>
          </div>
          <form onSubmit={verifyPin} className="bg-[#1a1d27] rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Your name (optional)</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. Barry at Gate 1"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Event PIN *</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="6-digit PIN"
                className="input text-center text-2xl tracking-widest font-mono"
              />
            </div>
            {pinError && <p className="text-sm text-[#ef4444]">{pinError}</p>}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3 bg-[#1DB954] text-white font-semibold rounded-xl hover:bg-[#158A3E] transition-colors"
            >
              <Key size={16} />
              Enter scan mode
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-start px-4 pt-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <ScanLine size={28} className="text-[#1DB954] mx-auto mb-2" />
          <h1 className="text-lg font-bold text-white">Scan mode active</h1>
          {sessionName && <p className="text-sm text-white/40">{sessionName}</p>}
        </div>

        {/* QR Scanner */}
        <div className="rounded-2xl overflow-hidden bg-black relative">
          <div id="qr-reader" ref={scannerRef} className="w-full" style={{ minHeight: 300 }} />
          {!scannerReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Loader2 size={32} className="text-[#1DB954] animate-spin" />
            </div>
          )}
        </div>

        <p className="text-center text-xs text-white/30 mt-4">
          Point camera at attendee&apos;s QR code
        </p>

        {/* Scan result overlay */}
        {result && <ScanResultBanner result={result} />}
      </div>
    </div>
  )
}

function ScanResultBanner({ result }: { result: NonNullable<ScanResult> }) {
  if (result.status === 'valid') {
    return (
      <div className="mt-4 bg-[#1DB954] rounded-2xl p-5 text-center animate-pulse-once">
        <CheckCircle2 size={36} className="mx-auto mb-2 text-white" />
        <p className="text-white font-bold text-xl">{result.name}</p>
        <p className="text-white/80 text-sm mt-1">Entry approved ✓</p>
      </div>
    )
  }
  if (result.status === 'duplicate') {
    return (
      <div className="mt-4 bg-[#f59e0b] rounded-2xl p-5 text-center">
        <AlertTriangle size={36} className="mx-auto mb-2 text-white" />
        <p className="text-white font-bold text-xl">{result.name}</p>
        <p className="text-white/80 text-sm mt-1">
          Already checked in at{' '}
          {new Date(result.checkedInAt).toLocaleTimeString('en-JM', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    )
  }
  return (
    <div className="mt-4 bg-[#ef4444] rounded-2xl p-5 text-center">
      <XCircle size={36} className="mx-auto mb-2 text-white" />
      <p className="text-white font-bold text-xl">Invalid card</p>
      <p className="text-white/80 text-sm mt-1">This QR code is not recognised</p>
    </div>
  )
}
