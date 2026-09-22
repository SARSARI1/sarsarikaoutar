export default function News({ items }) {
  return (
    <div className="space-y-5">
      {items.map((n, i) => (
        <a
          key={i}
          href={n.link || undefined}
          target={n.link ? '_blank' : undefined}
          rel="noreferrer"
          className={`flex gap-4 items-start p-4 rounded-xl border border-[var(--line)] card-hover transition-all ${n.link ? 'hover:border-[var(--accent)] cursor-pointer' : ''}`}
        >
          {n.image && (
            <img src={n.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[var(--line)] img-safe" />
          )}
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-wide accent mb-1">{n.date}</p>
            <p className="opacity-90">{n.text}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
