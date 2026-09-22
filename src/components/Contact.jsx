export default function Contact({ contact, name }) {
  return (
    <div>
      <p className="text-lg max-w-xl opacity-90 mb-8">{contact.text}</p>
      <div className="flex flex-wrap gap-4">
        <a
          href={`mailto:${contact.email}`}
          className="font-mono text-xs uppercase tracking-wide px-5 py-3 rounded-full bg-accent text-white"
        >
          Email me
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-wide px-5 py-3 rounded-full border border-[var(--line)]"
        >
          LinkedIn
        </a>
        {contact.kilma && (
          <a
            href={contact.kilma}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-wide px-5 py-3 rounded-full border border-[var(--line)]"
          >
            Poetry (Kilma)
          </a>
        )}
      </div>
      <p className="mt-16 text-xs opacity-50 font-mono">
        Inspired by my hometown's weather 🏔️ · {name} © {new Date().getFullYear()}
      </p>
    </div>
  )
}
