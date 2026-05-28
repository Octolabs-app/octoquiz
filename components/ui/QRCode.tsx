'use client'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  label?: string
}

export default function QRCodeDisplay({ value, size = 180, label }: QRCodeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-2xl shadow-2xl">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#ffffff"
          fgColor="#0a0a14"
          level="M"
        />
      </div>
      {label && (
        <p className="text-white/50 text-sm text-center">{label}</p>
      )}
    </div>
  )
}
