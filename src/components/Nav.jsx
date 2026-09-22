import { useTimeOfDay } from '../context/TimeContext.jsx'
import { useSeason } from '../context/SeasonContext.jsx'
import VisitorCounter from './VisitorCounter.jsx'
import SoundScape from './SoundScape.jsx'

const LINKS = [
  ['About', '#about'],
  ['Research', '#research'],
  ['Experience', '#experience'],
  ['Activities', '#activities'],
  ['Certifications', '#certifications'],
  ['Contact', '#contact'],
]

export default function Nav({ profile }) {
  const { mode, toggle } = useTimeOfDay()
  const { season } = useSeason()

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--bg)]/80 border-b border-[var(--line)]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        <a href="#top" className="logo-mark font-mono text-lg font-medium tracking-tight shrink-0">
          <span className="accent">&lt;</span>{profile.initials}<span className="accent">/&gt;</span>
        </a>
        <nav className="hidden md:flex gap-6 font-mono text-[0.78rem] uppercase tracking-wide">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="nav-link" style={{ opacity: 0.8 }}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          {profile.visitorCounterPath && (
            <span className="hidden sm:inline-flex">
              <VisitorCounter path={profile.visitorCounterPath} />
            </span>
          )}
          <button
            onClick={toggle}
            aria-label="Toggle day / night mode"
            title={mode === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
            className="mode-toggle text-lg"
          >
            {mode === 'day' ? '🌙' : '☀️'}
          </button>
          <SoundScape season={season} mode={mode} />
          <a
            href={profile.cvUrl}
            className="font-mono text-xs uppercase tracking-wide border border-[var(--line)] rounded-full px-4 py-2 hover:border-[var(--accent)] hover:accent transition-colors btn-live"
          >
            CV
          </a>
        </div>
      </div>
    </header>
  )
}
