const CONFIG = {
  winter: { glyph: '❄', count: 18, color: '#EAF2F8', animation: 'fall-drift', minDur: 10, maxDur: 20 },
  spring: { glyph: '✿', count: 12, color: '#F3C6D6', animation: 'fall-drift', minDur: 12, maxDur: 22 },
  summer: { glyph: '·', count: 14, color: '#FFE9B8', animation: 'shimmer-rise', minDur: 4, maxDur: 8 },
  autumn: { glyph: '🍂', count: 12, color: '#C98A2E', animation: 'fall-drift', minDur: 9, maxDur: 18 },
}

export default function Particles({ season }) {
  const cfg = CONFIG[season] || CONFIG.winter
  const items = Array.from({ length: cfg.count })

  return (
    <div className="particle-field">
      {items.map((_, i) => {
        const left = Math.random() * 100
        const size = 8 + Math.random() * 14
        const duration = cfg.minDur + Math.random() * (cfg.maxDur - cfg.minDur)
        const delay = Math.random() * duration
        const drift = (Math.random() - 0.5) * 80
        return (
          <span
            key={i}
            className="particle"
            style={{
              left: `${left}%`,
              fontSize: size,
              color: cfg.color,
              opacity: 0.7,
              animation: `${cfg.animation} ${duration}s linear ${-delay}s infinite`,
              '--drift': `${drift}px`,
            }}
          >
            {cfg.glyph}
          </span>
        )
      })}
    </div>
  )
}
