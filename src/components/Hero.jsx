import Particles from './Particles.jsx'
import MountainDivider from './MountainDivider.jsx'
import WeatherOverlay from './WeatherOverlay.jsx'
import { getPoeticLine } from '../lib/poetry.js'

export default function Hero({ profile, tagline, season, seasonMeta, mode }) {
  const poeticLine = getPoeticLine(season, mode)
  return (
    <section id="top" className="relative overflow-hidden">
      <WeatherOverlay season={season} mode={mode} />
      <Particles season={season} />
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start gap-10">
          <div className="hero-rise flex-1 min-w-0">
            <p className="section-label mb-6">{seasonMeta.emoji} {poeticLine}</p>
            <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-3xl text-live inline-block">
              {profile.name}
            </h1>
            <p className="mt-5 font-mono text-sm sm:text-base uppercase tracking-wide opacity-70 max-w-xl">
              {profile.roles.join(' · ')}
            </p>
            <p className="mt-8 font-display text-xl sm:text-2xl italic max-w-2xl" style={{ color: 'var(--accent)' }}>
              "{tagline}"
            </p>
            <p className="mt-6 text-sm opacity-70 max-w-lg">{profile.location}</p>
            {profile.motto && (
              <p className="mt-3 font-mono text-xs uppercase tracking-wide opacity-60 max-w-lg">✦ {profile.motto}</p>
            )}
          </div>
          {profile.photo && (
            <div className="shrink-0">
              <img
                src={profile.photo}
                alt={profile.name}
                className="hero-photo img-safe w-40 h-40 sm:w-56 sm:h-56 object-cover border-4"
                style={{ borderColor: '#F5F2EC', boxShadow: '0 20px 40px -20px rgba(31,36,33,0.4)' }}
              />
            </div>
          )}
        </div>
      </div>
      <MountainDivider height={140} />
    </section>
  )
}
