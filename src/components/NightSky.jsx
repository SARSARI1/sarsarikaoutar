export default function NightSky() {
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: Math.random() * 90,
    left: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
  }))

  return (
    <div aria-hidden="true" className="weather-overlay">
      <div className="moon-glow" />
      <div className="moon-disc" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
