'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRCard({ token }: { token: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const cardUrl = `${appUrl}/card/${token}`

  return (
    <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <QRCodeSVG
        value={cardUrl}
        size={200}
        level="H"
        includeMargin={false}
        fgColor="#0f1117"
      />
    </div>
  )
}
