const CODE_LINES = [
  [{ t: 'A little note for you 🤍🤍', c: '#F3A6C8' }],
  [
    { t: 'if', c: '#7FB0E8' },
    { t: '(', c: '#E8E6F0' },
    { t: 'youCameThatMuchFar', c: '#8FD9A8' },
    { t: '()) {', c: '#E8E6F0' },
  ],
  [
    { t: '  printf', c: '#8FD9A8' },
    { t: '(', c: '#E8E6F0' },
    { t: '"Beautiful human being, Thanks for stopping by …\\n"', c: '#F5C97B' },
    { t: ');', c: '#E8E6F0' },
  ],
  [
    { t: '  printf', c: '#8FD9A8' },
    { t: '(', c: '#E8E6F0' },
    { t: '"Be happy & Have a nice day 💖"', c: '#F5C97B' },
    { t: ');', c: '#E8E6F0' },
  ],
  [{ t: '}', c: '#E8E6F0' }],
]

export default function ClosingNote({ photo, feedbackText, feedbackEmail }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl overflow-hidden shadow-2xl card-hover" style={{ background: '#1E1B2E' }}>
        <div className="flex gap-2 px-4 py-3" style={{ background: '#141225' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#F28B82' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#F5C97B' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#8FD9A8' }} />
        </div>
        <div className="font-mono text-[13px] sm:text-sm p-6 leading-relaxed overflow-x-auto" style={{ color: '#E8E6F0' }}>
          {CODE_LINES.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line.map((tok, j) => (
                <span key={j} style={{ color: tok.c }}>
                  {tok.t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        {photo && (
          <img
            src={photo}
            alt=""
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 img-safe border-4"
            style={{ borderColor: '#F5F2EC' }}
          />
        )}
        {feedbackText && <p className="opacity-80 mb-4">{feedbackText}</p>}
        {feedbackEmail && (
          <a
            href={`mailto:${feedbackEmail}`}
            className="font-mono text-xs uppercase tracking-wide px-5 py-3 rounded-full bg-accent text-white inline-block btn-live"
          >
            Send feedback 👩‍💻
          </a>
        )}
      </div>
    </div>
  )
}
