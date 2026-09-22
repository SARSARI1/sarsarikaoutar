export default function NewsTicker({ items }) {
  if (!items || items.length === 0) return null
  const loop = [...items, ...items]

  return (
    <div className="border-b border-[var(--line)] bg-[var(--accent)] text-white overflow-hidden">
      <div className="ticker-track flex gap-10 whitespace-nowrap font-mono text-xs py-2 px-6">
        {loop.map((n, i) => (
          <a
            key={i}
            href={n.link || '#news'}
            target={n.link ? '_blank' : undefined}
            rel="noreferrer"
            className="hover:underline opacity-95 shrink-0"
          >
            {n.date ? `${n.date} — ` : ''}
            {n.text}
          </a>
        ))}
      </div>
    </div>
  )
}
