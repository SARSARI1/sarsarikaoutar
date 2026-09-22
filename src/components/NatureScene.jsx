const TREE = {
  winter: { canopy: 'transparent', trunk: '#5C4A3A', snow: true },
  spring: { canopy: '#8FBF7E', trunk: '#6B5744', blossom: '#F3C6D6' },
  summer: { canopy: '#3F6E63', trunk: '#5C4A3A' },
  autumn: { canopy: '#B5651D', trunk: '#5C4A3A', falling: '#C98A2E' },
}

const RIVER = {
  day: { base: 'rgba(74,111,165,0.35)', shine: 'rgba(255,255,255,0.55)' },
  night: { base: 'rgba(60,77,92,0.45)', shine: 'rgba(230,236,245,0.4)' },
}

export default function NatureScene({ season = 'summer', mode = 'day' }) {
  const tree = TREE[season] || TREE.summer
  const river = RIVER[mode] || RIVER.day

  return (
    <div className="nature-scene" aria-hidden="true">
      {/* Bird by day, shooting star by night */}
      {mode === 'day' ? (
        <span className="bird-fly" style={{ color: 'var(--ridge-3)' }}>﹀</span>
      ) : (
        <span className="shooting-star" />
      )}

      {/* Little tree, bottom-left */}
      <svg
        viewBox="0 0 80 90"
        className="absolute left-6 sm:left-12 bottom-0 h-full"
        style={{ width: 60 }}
      >
        <rect x="36" y="55" width="6" height="30" fill={tree.trunk} />
        {tree.canopy !== 'transparent' && <circle cx="39" cy="45" r="26" fill={tree.canopy} />}
        {tree.blossom && (
          <>
            <circle cx="26" cy="38" r="3" fill={tree.blossom} />
            <circle cx="50" cy="32" r="3" fill={tree.blossom} />
            <circle cx="42" cy="55" r="3" fill={tree.blossom} />
          </>
        )}
        {tree.snow && (
          <>
            <ellipse cx="30" cy="42" rx="10" ry="5" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="50" cy="38" rx="8" ry="4" fill="rgba(255,255,255,0.4)" />
          </>
        )}
        {tree.falling && (
          <>
            <circle cx="15" cy="60" r="2" fill={tree.falling} opacity="0.8" />
            <circle cx="60" cy="70" r="2" fill={tree.falling} opacity="0.6" />
          </>
        )}
      </svg>

      {/* River ribbon */}
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="nature-river" style={{ height: 40 }}>
        <path d="M0,20 Q150,0 300,20 T600,20 T900,20 T1200,20 L1200,40 L0,40 Z" fill={river.base} />
        <path
          d="M0,20 Q150,0 300,20 T600,20 T900,20 T1200,20"
          fill="none"
          stroke={river.shine}
          strokeWidth="1.5"
          strokeDasharray="6 8"
          className="river-shimmer"
        />
      </svg>
    </div>
  )
}
