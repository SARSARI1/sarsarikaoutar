import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const go = useCallback(
    (delta) => {
      const next = (index + delta + photos.length) % photos.length
      onNavigate(next)
    },
    [index, photos.length, onNavigate]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Lock page scroll while open, and restore it on close.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const nodeRef = useRef(null)

  const content = (
    <div
      ref={nodeRef}
      className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 animate-fadein"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-xl flex items-center justify-center backdrop-blur-sm transition-colors"
      >
        ✕
      </button>

      <div className="relative w-full max-w-4xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {photos.length > 1 && (
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-1 sm:-left-16 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            ‹
          </button>
        )}
        <img
          src={photos[index]}
          alt=""
          className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl img-safe"
        />
        {photos.length > 1 && (
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-1 sm:-right-16 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            ›
          </button>
        )}
      </div>

      {photos.length > 1 && (
        <>
          <p className="font-mono text-xs text-white/60 mt-4">
            {index + 1} / {photos.length}
          </p>
          <div className="flex gap-2 mt-3 max-w-full overflow-x-auto px-4" onClick={(e) => e.stopPropagation()}>
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => onNavigate(i)}
                className="shrink-0 rounded-lg overflow-hidden border-2 transition-all img-safe"
                style={{ borderColor: i === index ? 'white' : 'transparent', opacity: i === index ? 1 : 0.5 }}
              >
                <img src={p} alt="" className="w-14 h-14 object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )

  // Rendered via a portal straight into <body>, so it's genuinely fixed to the
  // viewport instead of being trapped inside a parent that has a CSS transform
  // (like this site's scroll-reveal sections) — that trap was the root cause of
  // the oversized scroll area and the close/prev/next buttons being misplaced.
  return createPortal(content, document.body)
}
