export default function MountainDivider({ flip = false, height = 120 }) {
  return (
    <div
      aria-hidden="true"
      className="mountain-divider w-full overflow-hidden leading-none"
      style={{ height, transform: flip ? 'scaleY(-1)' : 'none' }}
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polygon
          points="0,200 0,120 180,60 340,130 520,40 700,110 900,30 1080,100 1200,70 1200,200"
          fill="var(--ridge-1)"
        />
        <polygon
          points="0,200 0,150 220,90 400,150 600,80 820,150 1000,90 1200,140 1200,200"
          fill="var(--ridge-2)"
        />
        <polygon
          points="0,200 0,180 260,130 480,180 660,120 880,180 1080,130 1200,170 1200,200"
          fill="var(--ridge-3)"
        />
      </svg>
    </div>
  )
}
