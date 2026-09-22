function Group({ title, items }) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-wide opacity-60 mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)]/50"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills({ skills }) {
  return (
    <div className="grid sm:grid-cols-3 gap-8">
      <Group title="Human Languages" items={skills.languages} />
      <Group title="Programming Languages" items={skills.programming} />
      <Group title="Frameworks" items={skills.frameworks} />
    </div>
  )
}
