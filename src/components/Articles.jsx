export default function Articles({ items }) {
  const types = [...new Set(items.map((a) => a.type))]

  return (
    <div className="space-y-10">
      {types.map((type) => (
        <div key={type}>
          <h3 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">{type}</h3>
          <div className="space-y-4">
            {items
              .filter((a) => a.type === type)
              .map((a, i) => (
                <div
                  key={i}
                  className="card-hover p-5 rounded-xl border border-[var(--line)] bg-[var(--paper)]/50 transition-all flex gap-4 items-start"
                >
                  {a.image && (
                    <img src={a.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[var(--line)] img-safe" />
                  )}
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wide opacity-60 mb-1">{a.date}</p>
                    <h4 className="font-display text-lg mb-1">{a.title}</h4>
                    {a.venue && <p className="text-sm opacity-70 italic">{a.venue}</p>}
                    {a.authors && <p className="text-sm opacity-60 mt-1">{a.authors}</p>}
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[0.68rem] uppercase accent mt-3 inline-block link-arrow"
                      >
                        Read <span className="arrow">→</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
