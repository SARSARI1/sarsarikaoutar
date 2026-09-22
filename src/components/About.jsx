import TimelineCard from './TimelineCard.jsx'
import Gallery from './Gallery.jsx'

export default function About({ about }) {
  return (
    <div className="grid md:grid-cols-2 gap-14">
      <div>
        <p className="text-lg opacity-90 leading-relaxed">{about.intro}</p>
        <div className="mt-8 p-6 rounded-xl border border-[var(--line)] bg-[var(--paper)]/50 card-hover">
          <p className="font-display text-lg mb-2">{about.philosophyTitle}</p>
          <p className="opacity-80 text-sm leading-relaxed">{about.philosophy}</p>
          {about.philosophyPhoto && <Gallery photos={[about.philosophyPhoto]} />}
        </div>
      </div>
      <TimelineCard items={about.timeline.map((t) => ({ ...t, date: t.years, description: t.text }))} />
    </div>
  )
}
