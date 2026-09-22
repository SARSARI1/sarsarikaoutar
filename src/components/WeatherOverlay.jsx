import NightSky from './NightSky.jsx'

export default function WeatherOverlay({ season, mode = 'day' }) {
  if (mode === 'night') return <NightSky />

  if (season === 'summer') {
    return (
      <div aria-hidden="true" className="weather-overlay">
        <div className="sun-glow" />
        <div className="sun-rays" />
      </div>
    )
  }
  if (season === 'winter') {
    return (
      <div aria-hidden="true" className="weather-overlay">
        <div className="fog-layer fog-1" />
        <div className="fog-layer fog-2" />
      </div>
    )
  }
  if (season === 'spring') {
    return (
      <div aria-hidden="true" className="weather-overlay rain-field">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.6 + Math.random() * 0.6}s`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>
    )
  }
  if (season === 'autumn') {
    return (
      <div aria-hidden="true" className="weather-overlay">
        <div className="gust-tint" />
      </div>
    )
  }
  return null
}
