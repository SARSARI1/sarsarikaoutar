export default function VisitorCounter({ path }) {
  if (!path) return null
  const src = `https://api.visitorbadge.io/api/visitors?path=${encodeURIComponent(
    path
  )}&label=Visitors&labelColor=%231F2421&countColor=%234A6FA5&style=flat`

  return (
    <div className="inline-flex items-center">
      <img src={src} alt="Visitor count" className="h-5 rounded" loading="lazy" />
    </div>
  )
}
