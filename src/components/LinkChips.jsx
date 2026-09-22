const ICONS = {
  video: '▶',
  website: '🔗',
  paper: '📄',
  github: '⌥',
  default: '↗',
}

export default function LinkChips({ links }) {
  if (!links || links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="link-chip font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 rounded-full border border-[var(--line)] inline-flex items-center gap-1.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
        >
          <span>{ICONS[link.type] || ICONS.default}</span>
          {link.label}
        </a>
      ))}
    </div>
  )
}
