import { useCallback, useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Check, DeviceMobile, WarningCircle } from '@phosphor-icons/react'

interface Props {
  /** World slug to open on the phone. */
  slug: string
  /** Human-friendly room name, shown in the modal. */
  roomName: string
  open: boolean
  onClose: () => void
}

/**
 * Build the deep link the Snaproom mobile app handles:
 *   snaproom://room?slug=<slug>&host=<host>
 * `host` is this dev server's host so the phone can reach the web viewer.
 */
function buildDeepLink(slug: string, host: string): string {
  return `snaproom://room?slug=${encodeURIComponent(slug)}&host=${encodeURIComponent(host)}`
}

function isUnreachableHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0'
  )
}

/**
 * Modal shown once a world has finished generating. Renders a QR code that,
 * when scanned, opens the room in the Snaproom mobile app for an AR walk-through.
 */
export function ArQrModal({ slug, roomName, open, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const host = typeof window !== 'undefined' ? window.location.host : ''
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const deepLink = useMemo(() => buildDeepLink(slug, host), [slug, host])
  const unreachable = isUnreachableHost(hostname)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(deepLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be unavailable on insecure origins — link is still visible.
    }
  }, [deepLink])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0E121C] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <DeviceMobile size={18} className="text-cyan-300" />
            <h3 className="font-semibold text-white">View in AR</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-4 px-5 py-6">
          <p className="text-center text-sm text-white/60">
            Scan this code with your phone to walk through{' '}
            <span className="font-medium text-white/90">{roomName}</span> in
            augmented reality.
          </p>

          {/* QR — light card so any scanner can read it. */}
          <div className="rounded-xl bg-white p-4">
            <QRCodeSVG
              value={deepLink}
              size={208}
              level="M"
              marginSize={0}
              bgColor="#ffffff"
              fgColor="#05070D"
            />
          </div>

          {unreachable ? (
            <div className="flex gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              <WarningCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                You're on <span className="font-mono">{host}</span>, which a
                phone can't reach. Reopen Snaproom using your computer's
                network address (e.g. <span className="font-mono">192.168.x.x:5173</span>)
                so the QR works.
              </span>
            </div>
          ) : (
            <p className="text-center text-xs text-white/40">
              Make sure your phone is on the same Wi-Fi network as this computer.
            </p>
          )}

          {/* Copyable link */}
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <span className="truncate font-mono text-xs text-white/55">
              {deepLink}
            </span>
            {copied ? (
              <Check size={16} className="flex-shrink-0 text-cyan-300" />
            ) : (
              <Copy size={16} className="flex-shrink-0 text-white/50" />
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-3">
          <p className="text-center text-[11px] text-white/35">
            Opens in the Snaproom app · no account needed
          </p>
        </div>
      </div>
    </div>
  )
}
