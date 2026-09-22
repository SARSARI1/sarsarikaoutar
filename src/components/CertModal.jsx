import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { driveEmbedUrl } from '../lib/drive.js'

export default function CertModal({ cert, onClose }) {
  const embedSrc = useMemo(() => cert.pdfUrl || driveEmbedUrl(cert.driveUrl), [cert])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 animate-fadein"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="rounded-2xl overflow-hidden w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
        style={{ background: 'var(--bg)', color: 'var(--ink)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-[var(--line)]">
          <div>
            <h3 className="font-display text-xl">{cert.title}</h3>
            {cert.issuer && <p className="text-sm opacity-60">{cert.issuer}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-black/5 shrink-0"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 bg-stone-100">
          {embedSrc ? (
            <iframe title={cert.title} src={embedSrc} className="w-full h-full min-h-[60vh]" />
          ) : (
            <p className="p-8">No preview available for this certificate yet.</p>
          )}
        </div>
        {cert.driveUrl && (
          <div className="p-4 border-t border-[var(--line)] text-right">
            <a href={cert.driveUrl} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase accent">
              Open original ↗
            </a>
          </div>
        )}
      </div>
    </div>
  )

  // Portal straight to <body> — same fix as the photo Lightbox, so this modal is
  // truly fixed to the screen instead of trapped inside a transformed ancestor.
  return createPortal(content, document.body)
}
