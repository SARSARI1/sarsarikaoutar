import { useState } from 'react'
import Gallery from './Gallery.jsx'
import LinkChips from './LinkChips.jsx'
import CertModal from './CertModal.jsx'

export default function TimelineCard({ items }) {
  const safeItems = Array.isArray(items) ? items : []
  const [openCert, setOpenCert] = useState(null)

  if (safeItems.length === 0) {
    return <p className="opacity-50 text-sm">Nothing here yet.</p>
  }

  return (
    <>
      <ol className="relative">
        {safeItems.map((item, i) => (
          <li key={i} className="relative pl-8 pb-12 last:pb-0 timeline-item">
            {i !== safeItems.length - 1 && <span className="trail-line absolute left-[4px] top-3 bottom-0" />}
            <span className="trail-dot absolute left-0 top-1.5" />

            <div className="flex items-start gap-3">
              {item.logo && (
                <img
                  src={item.logo}
                  alt=""
                  className="w-11 h-11 rounded-lg object-contain img-safe border border-[var(--line)] p-1 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl mb-1.5">{item.title}</h3>
              </div>
            </div>

            <p className="opacity-80 max-w-2xl mt-1">{item.description}</p>

            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[0.68rem] uppercase tracking-wide px-2.5 py-1 rounded-full border border-[var(--line)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {item.certification && (
              <button
                onClick={() => setOpenCert(item.certification)}
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 rounded-full bg-accent text-white cert-badge"
              >
                🎓 {item.certification.title}
              </button>
            )}

            {item.date && (
              <p className="font-mono text-[0.7rem] uppercase tracking-wide opacity-50 mt-3">— {item.date}</p>
            )}

            <LinkChips links={item.links} />
            <Gallery photos={item.photos} />
          </li>
        ))}
      </ol>
      {openCert && <CertModal cert={openCert} onClose={() => setOpenCert(null)} />}
    </>
  )
}
