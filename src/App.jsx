import { useEffect, useState, lazy, Suspense } from 'react'
import { useSeason } from './context/SeasonContext.jsx'
import { useTimeOfDay } from './context/TimeContext.jsx'
import { useContent } from './hooks/useContent.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import NewsTicker from './components/NewsTicker.jsx'
import News from './components/News.jsx'
import Section from './components/Section.jsx'
import About from './components/About.jsx'
import TimelineCard from './components/TimelineCard.jsx'
import Skills from './components/Skills.jsx'
import Certifications from './components/Certifications.jsx'
import Articles from './components/Articles.jsx'
import Contact from './components/Contact.jsx'
import MountainDivider from './components/MountainDivider.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import NatureScene from './components/NatureScene.jsx'
import ClosingNote from './components/ClosingNote.jsx'

// The admin dashboard is only ever imported in local dev (`npm run dev`).
// import.meta.env.DEV is replaced with a hard `false` at production build time,
// so Vite/Rollup drops this dynamic import (and the whole admin/ folder) from
// the production bundle entirely — it's not shipped to GitHub Pages at all.
const Admin = import.meta.env.DEV ? lazy(() => import('./admin/Admin.jsx')) : null

function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useRoute()
  const { season, meta } = useSeason()
  const { mode } = useTimeOfDay()
  const content = useContent()

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season)
  }, [season])

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  if (import.meta.env.DEV && hash.startsWith('#/admin')) {
    return (
      <Suspense fallback={null}>
        <Admin content={content} />
      </Suspense>
    )
  }

  const {
    profile,
    news = [],
    about,
    research = [],
    experience = [],
    activities = [],
    skills,
    certifications = [],
    articles = [],
    contact,
    closingNote,
  } = content.data

  return (
    <div className="font-body">
      <CursorTrail season={season} />
      <Nav profile={profile} />
      {news.length > 0 && <NewsTicker items={news} />}
      <Hero profile={profile} tagline={profile.tagline} season={season} seasonMeta={meta} mode={mode} />

      <Section id="about" label="01 · About" title="About me" tone>
        <About about={about} />
      </Section>

      <MountainDivider flip />
      <NatureScene season={season} mode={mode} />

      <Section id="research" label="02 · Research & Teaching" title="What I work on now">
        <TimelineCard items={research} />
      </Section>

      <Section id="experience" label="03 · Experience" title="Where I've worked" subtitle="Most recent first." tone>
        <TimelineCard items={experience} />
      </Section>

      <Section id="activities" label="04 · Activities" title="Leadership & entrepreneurship">
        <TimelineCard items={activities} />
      </Section>

      <MountainDivider flip />
      <NatureScene season={season} mode={mode} />

      {articles.length > 0 && (
        <Section id="articles" label="05 · Publications" title="Articles & publications" tone>
          <Articles items={articles} />
        </Section>
      )}

      <Section id="skills" label="06 · Skills" title="Languages & tools">
        <Skills skills={skills} />
      </Section>

      <Section id="certifications" label="07 · Certifications" title="Certificates" subtitle="Click any card to view the certificate itself, right here." tone>
        <Certifications items={certifications} />
      </Section>

      {news.length > 0 && (
        <Section id="news" label="08 · Latest" title="News & updates">
          <News items={news} />
        </Section>
      )}

      <MountainDivider flip />
      <NatureScene season={season} mode={mode} />

      <Section id="contact" label="09 · Contact" title={contact.heading} tone>
        <Contact contact={contact} name={profile.name} />
      </Section>

      {closingNote && (
        <Section id="note" label="✦" title="One more thing">
          <ClosingNote
            photo={closingNote.photo}
            feedbackText={closingNote.feedbackText}
            feedbackEmail={closingNote.feedbackEmail || profile.email}
          />
        </Section>
      )}

      {import.meta.env.DEV && (
        <a
          href="#/admin"
          className="fixed bottom-5 right-5 font-mono text-[0.65rem] uppercase tracking-wide opacity-30 hover:opacity-80 transition-opacity"
        >
          admin (local only)
        </a>
      )}
    </div>
  )
}
