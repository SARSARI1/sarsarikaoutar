import Reveal from './Reveal.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { useSeason } from '../context/SeasonContext.jsx'

export default function Section({ id, label, title, subtitle, children, tone = false }) {
  const { meta } = useSeason()
  return (
    <section id={id} className={`relative py-20 ${tone ? 'bg-[var(--paper)]/40' : ''}`}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <p className="section-label mb-3">
            {label} <span aria-hidden="true">{meta.emoji}</span>
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mb-3 text-live inline-block">{title}</h2>
          {subtitle && <p className="opacity-70 max-w-xl mb-10">{subtitle}</p>}
          {!subtitle && <div className="mb-10" />}
        </Reveal>
        <Reveal>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Reveal>
      </div>
    </section>
  )
}
