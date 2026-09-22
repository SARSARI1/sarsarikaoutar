import { useState } from 'react'
import Lightbox from './Lightbox.jsx'

export default function Gallery({ photos }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (!photos || photos.length === 0) return null

  const visible = photos.slice(0, 4)
  const extra = photos.length - visible.length

  return (
    <div className="mt-4">
      <div className="flex gap-2 flex-wrap">
        {visible.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
            className="relative w-16 h-16 rounded-lg overflow-hidden border border-[var(--line)] img-zoom img-safe"
          >
            <img src={p} alt="" className="w-full h-full object-cover transition-transform duration-300" />
            {i === 3 && extra > 0 && (
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-mono text-xs">
                +{extra}
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          setIndex(0)
          setOpen(true)
        }}
        className="font-mono text-[0.65rem] uppercase accent mt-2 inline-block"
      >
        Browse album ({photos.length}) →
      </button>
      {open && (
        <Lightbox photos={photos} index={index} onClose={() => setOpen(false)} onNavigate={setIndex} />
      )}
    </div>
  )
}
