import { useState } from 'react'
import CertModal from './CertModal.jsx'

export default function Certifications({ items }) {
  const [active, setActive] = useState(null)
  const categories = [...new Set(items.map((c) => c.category))]

  return (
    <>
      {categories.map((cat) => (
        <div key={cat} className="mb-10 last:mb-0">
          <h3 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">{cat}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {items
              .filter((c) => c.category === cat)
              .map((cert, i) => (
                <button
                  key={i}
                  onClick={() => setActive(cert)}
                  className="card-hover text-left p-5 rounded-xl border border-[var(--line)] hover:border-[var(--accent)] transition-all bg-[var(--paper)]/50 flex gap-4 items-start"
                >
                  {cert.image && (
                    <img src={cert.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 border border-[var(--line)] img-safe" />
                  )}
                  <div>
                    <p className="font-display text-lg mb-1">{cert.title}</p>
                    <p className="text-sm opacity-60">{cert.issuer}</p>
                    <span className="font-mono text-[0.68rem] uppercase accent mt-3 inline-flex items-center gap-1 link-arrow">
                      View certificate <span className="arrow">→</span>
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
      {active && <CertModal cert={active} onClose={() => setActive(null)} />}
    </>
  )
}
