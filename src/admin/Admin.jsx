import { useState } from 'react'
import { useSeason } from '../context/SeasonContext.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

function Field({ label, value, onChange, textarea, mono, hint }) {
  return (
    <label className="block mb-4">
      <span className="block font-mono text-[0.7rem] uppercase tracking-wide opacity-60 mb-1.5">{label}</span>
      {textarea ? (
        <textarea
          className={`w-full rounded-lg border border-[var(--line)] p-3 bg-white ${mono ? 'font-mono text-sm' : ''}`}
          rows={4}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={`w-full rounded-lg border border-[var(--line)] p-3 bg-white ${mono ? 'font-mono text-sm' : ''}`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <span className="block text-xs opacity-50 mt-1">{hint}</span>}
    </label>
  )
}

function Card({ title, children, onRemove, onMoveUp, onMoveDown }) {
  return (
    <div className="border border-[var(--line)] rounded-xl p-5 mb-4 bg-white relative">
      <div className="flex items-center justify-between gap-3 mb-3">
        {title ? (
          <p className="font-mono text-[0.7rem] uppercase tracking-wide opacity-50">{title}</p>
        ) : (
          <span />
        )}
        {(onMoveUp || onMoveDown || onRemove) && (
          <div className="flex gap-1 items-center shrink-0">
            {onMoveUp && (
              <button
                type="button"
                onClick={onMoveUp}
                title="Move up"
                className="font-mono text-sm w-7 h-7 flex items-center justify-center rounded-md border border-[var(--line)] opacity-70 hover:opacity-100 hover:bg-black/5"
              >
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                type="button"
                onClick={onMoveDown}
                title="Move down"
                className="font-mono text-sm w-7 h-7 flex items-center justify-center rounded-md border border-[var(--line)] opacity-70 hover:opacity-100 hover:bg-black/5"
              >
                ↓
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="font-mono text-[0.65rem] uppercase text-red-600 ml-1 px-2 py-1 rounded-md hover:bg-red-50"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

// --- Sub-editor: links (label / url / type) attached to a timeline item ---
function LinksEditor({ links = [], onChange }) {
  const update = (i, key, value) => {
    const next = links.slice()
    next[i] = { ...next[i], [key]: value }
    onChange(next)
  }
  const remove = (i) => onChange(links.filter((_, idx) => idx !== i))
  const add = () => onChange([...links, { label: '', url: '', type: 'website' }])

  return (
    <div className="mb-4">
      <span className="block font-mono text-[0.7rem] uppercase tracking-wide opacity-60 mb-2">
        Links (video, website, paper...)
      </span>
      {links.map((l, i) => (
        <div key={i} className="flex flex-wrap gap-2 mb-2 items-center">
          <input
            className="rounded-lg border border-[var(--line)] p-2 bg-white text-sm flex-1 min-w-[100px]"
            placeholder="Label, e.g. YouTube talk"
            value={l.label}
            onChange={(e) => update(i, 'label', e.target.value)}
          />
          <input
            className="rounded-lg border border-[var(--line)] p-2 bg-white text-sm flex-[2] min-w-[160px]"
            placeholder="https://..."
            value={l.url}
            onChange={(e) => update(i, 'url', e.target.value)}
          />
          <select
            className="rounded-lg border border-[var(--line)] p-2 bg-white text-sm"
            value={l.type}
            onChange={(e) => update(i, 'type', e.target.value)}
          >
            <option value="website">Website</option>
            <option value="video">Video</option>
            <option value="paper">Paper</option>
            <option value="github">GitHub</option>
          </select>
          <button onClick={() => remove(i)} className="text-red-600 font-mono text-xs">✕</button>
        </div>
      ))}
      <button onClick={add} className="font-mono text-[0.68rem] uppercase px-3 py-1.5 rounded-full border border-[var(--line)]">
        + Add link
      </button>
    </div>
  )
}

// --- Sub-editor: photo album, one URL per line ---
function PhotosEditor({ photos = [], onChange }) {
  return (
    <Field
      label="Photo album (one image URL per line, add as many as you want)"
      textarea
      value={photos.join('\n')}
      onChange={(v) => onChange(v.split('\n').map((s) => s.trim()).filter(Boolean))}
      hint="Put files in /public/images and reference them like /images/myphoto.jpg, or paste any image URL."
    />
  )
}

// --- Sub-editor: linked certification badge ---
function CertificationEditor({ certification, onChange }) {
  const value = certification || { title: '', issuer: '', driveUrl: '' }
  const set = (key, v) => {
    const next = { ...value, [key]: v }
    onChange(next.title ? next : null)
  }
  return (
    <div className="mb-4 p-3 rounded-lg border border-dashed border-[var(--line)]">
      <span className="block font-mono text-[0.7rem] uppercase tracking-wide opacity-60 mb-2">
        Related certification (optional — leave title empty for none)
      </span>
      <Field label="Certificate title" value={value.title} onChange={(v) => set('title', v)} />
      <Field label="Issuer" value={value.issuer} onChange={(v) => set('issuer', v)} />
      <Field label="Google Drive link (or leave for pdfUrl)" value={value.driveUrl} onChange={(v) => set('driveUrl', v)} />
    </div>
  )
}

// Generic editor for an array of timeline objects (experience/research/activities)
function ListEditor({ items, setItems, fields, newItem, label }) {
  const safeItems = Array.isArray(items) ? items : []
  const update = (i, key, value) => {
    const next = safeItems.slice()
    next[i] = { ...next[i], [key]: value }
    setItems(next)
  }
  const remove = (i) => setItems(safeItems.filter((_, idx) => idx !== i))
  const add = () => setItems([typeof newItem === 'function' ? newItem() : newItem, ...safeItems]) // newest goes to top
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= safeItems.length) return
    const next = safeItems.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }

  return (
    <div>
      <p className="text-xs opacity-50 mb-3">New entries are added to the top (most recent first). Use ↑ / ↓ to reorder.</p>
      {safeItems.map((item, i) => (
        <Card
          key={i}
          title={`${label} #${i + 1}`}
          onRemove={() => remove(i)}
          onMoveUp={i > 0 ? () => move(i, -1) : null}
          onMoveDown={i < safeItems.length - 1 ? () => move(i, 1) : null}
        >
          {fields.map((f) => {
            if (f.type === 'tags') {
              return (
                <Field
                  key={f.key}
                  label={`${f.label} (comma separated)`}
                  value={(item[f.key] || []).join(', ')}
                  onChange={(v) => update(i, f.key, v.split(',').map((s) => s.trim()).filter(Boolean))}
                />
              )
            }
            if (f.type === 'links') {
              return <LinksEditor key={f.key} links={item[f.key]} onChange={(v) => update(i, f.key, v)} />
            }
            if (f.type === 'photos') {
              return <PhotosEditor key={f.key} photos={item[f.key]} onChange={(v) => update(i, f.key, v)} />
            }
            if (f.type === 'certification') {
              return (
                <CertificationEditor key={f.key} certification={item[f.key]} onChange={(v) => update(i, f.key, v)} />
              )
            }
            return (
              <Field
                key={f.key}
                label={f.label}
                value={item[f.key]}
                onChange={(v) => update(i, f.key, v)}
                textarea={f.textarea}
                hint={f.hint}
                mono={f.mono}
              />
            )
          })}
        </Card>
      ))}
      <button
        onClick={add}
        className="font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-full border border-[var(--line)] hover:border-[var(--accent)]"
      >
        + Add {label}
      </button>
    </div>
  )
}

function TagListEditor({ items, setItems, label }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    if (!draft.trim()) return
    setItems([...items, draft.trim()])
    setDraft('')
  }
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i))
  return (
    <div className="mb-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-wide opacity-60 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((t, i) => (
          <span key={i} className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--line)] flex items-center gap-2 bg-white">
            {t}
            <button onClick={() => remove(i)} className="text-red-600">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="rounded-lg border border-[var(--line)] p-2 bg-white text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={`Add to ${label.toLowerCase()}...`}
        />
        <button onClick={add} className="font-mono text-xs uppercase px-3 rounded-lg border border-[var(--line)]">
          Add
        </button>
      </div>
    </div>
  )
}

const TIMELINE_FIELDS = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'description', label: 'Description', textarea: true },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'logo', label: 'Logo image (small, e.g. company logo)', hint: 'Put in /public/images and reference like /images/logo.png. Different from the photo album below.' },
  { key: 'photos', label: 'Photos', type: 'photos' },
  { key: 'links', label: 'Links', type: 'links' },
  { key: 'certification', label: 'Certification', type: 'certification' },
]

const NEW_TIMELINE_ITEM = () => ({ title: '', date: '', description: '', tags: [], logo: '', photos: [], links: [], certification: null })

const TABS = ['Profile', 'News', 'About', 'Research', 'Experience', 'Activities', 'Articles', 'Skills', 'Certifications', 'Contact', 'Closing Note']

export default function Admin({ content }) {
  const { data, save, resetToDefault, exportJson, importJson, hasLocalEdits } = content
  const { season, setSeason, clearOverride, isOverridden, all } = useSeason()
  const [tab, setTab] = useState('Profile')

  const set = (path, value) => {
    const next = structuredClone(data)
    let obj = next
    for (let i = 0; i < path.length - 1; i++) {
      if (obj[path[i]] == null) obj[path[i]] = {}
      obj = obj[path[i]]
    }
    obj[path[path.length - 1]] = value
    save(next)
  }

  const setList = (key, items) => {
    const next = structuredClone(data)
    next[key] = items
    save(next)
  }

  const news = data.news || []
  const articles = data.articles || []

  return (
    <div
      className="min-h-screen font-body"
      style={{
        '--bg': '#EFF1EA',
        '--ink': '#1F2421',
        '--paper': '#FFFFFF',
        '--line': 'rgba(31, 36, 33, 0.12)',
        '--accent': '#4A6FA5',
        background: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-3xl">Admin dashboard</h1>
          <a href="#/" className="font-mono text-xs uppercase accent">← Back to site</a>
        </div>
        <p className="opacity-60 text-sm mb-6">
          Edits save to this browser automatically. Export the JSON file when you're happy with it and
          drop it into <code className="font-mono">src/data/content.json</code> to make the changes permanent.
        </p>

        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl border border-[var(--line)] bg-white items-center">
          <span className="font-mono text-xs uppercase opacity-60">{hasLocalEdits ? 'Unsaved-to-file edits present' : 'Showing default content'}</span>
          <button onClick={exportJson} className="font-mono text-xs uppercase px-3 py-1.5 rounded-full bg-accent text-white">
            Export JSON
          </button>
          <label className="font-mono text-xs uppercase px-3 py-1.5 rounded-full border border-[var(--line)] cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files[0] && importJson(e.target.files[0])} />
          </label>
          <button onClick={resetToDefault} className="font-mono text-xs uppercase px-3 py-1.5 rounded-full border border-[var(--line)] text-red-600">
            Reset to default
          </button>
          <span className="w-px h-5 bg-[var(--line)] mx-1" />
          <span className="font-mono text-xs uppercase opacity-60">Preview season:</span>
          {all.map((s) => (
            <button
              key={s.key}
              onClick={() => setSeason(s.key)}
              className="font-mono text-xs px-2.5 py-1 rounded-full border season-btn"
              style={{ borderColor: 'var(--line)', background: season === s.key ? 'var(--accent)' : 'white', color: season === s.key ? 'white' : 'inherit' }}
            >
              {s.emoji}
            </button>
          ))}
          {isOverridden && (
            <button onClick={clearOverride} className="font-mono text-xs uppercase underline opacity-60">
              use real date
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-mono text-xs uppercase px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'var(--line)', background: tab === t ? 'var(--accent)' : 'transparent', color: tab === t ? 'white' : 'inherit' }}
            >
              {t}
            </button>
          ))}
        </div>

        <ErrorBoundary hint="Open your browser's DevTools console (F12 → Console) for the exact error — it usually points to one entry with a missing or malformed field. You can also try Reset to default, then Import JSON with a known-good file.">
        {tab === 'Profile' && (
          <Card>
            <Field label="Name" value={data.profile.name} onChange={(v) => set(['profile', 'name'], v)} />
            <Field label="Initials (nav logo)" value={data.profile.initials} onChange={(v) => set(['profile', 'initials'], v)} />
            <Field label="Roles (comma separated)" value={data.profile.roles.join(', ')} onChange={(v) => set(['profile', 'roles'], v.split(',').map((s) => s.trim()).filter(Boolean))} />
            <Field label="Tagline" value={data.profile.tagline} onChange={(v) => set(['profile', 'tagline'], v)} textarea />
            <Field label="Motto" value={data.profile.motto} onChange={(v) => set(['profile', 'motto'], v)} />
            <Field label="Location" value={data.profile.location} onChange={(v) => set(['profile', 'location'], v)} />
            <Field label="Email" value={data.profile.email} onChange={(v) => set(['profile', 'email'], v)} />
            <Field label="LinkedIn URL" value={data.profile.linkedin} onChange={(v) => set(['profile', 'linkedin'], v)} />
            <Field label="CV file path (put file in /public)" value={data.profile.cvUrl} onChange={(v) => set(['profile', 'cvUrl'], v)} mono />
            <Field label="Profile photo (put file in /public/images)" value={data.profile.photo} onChange={(v) => set(['profile', 'photo'], v)} mono hint="e.g. /images/me.jpg — shown next to your intro in the hero." />
            <Field label="Visitor counter path" value={data.profile.visitorCounterPath} onChange={(v) => set(['profile', 'visitorCounterPath'], v)} mono hint="Usually your site's domain, e.g. sarsari1.github.io — used to track a visitor count badge in the nav." />
          </Card>
        )}

        {tab === 'News' && (
          <ListEditor
            items={news}
            setItems={(items) => setList('news', items)}
            fields={[
              { key: 'date', label: 'Date' },
              { key: 'text', label: 'Update text', textarea: true },
              { key: 'link', label: 'Link (optional)' },
              { key: 'image', label: 'Image (optional, put in /public/images)', mono: true },
            ]}
            newItem={{ date: '', text: '', link: '', image: '' }}
            label="News item"
          />
        )}

        {tab === 'About' && (
          <Card>
            <Field label="Intro paragraph" value={data.about.intro} onChange={(v) => set(['about', 'intro'], v)} textarea />
            <Field label="Philosophy title" value={data.about.philosophyTitle} onChange={(v) => set(['about', 'philosophyTitle'], v)} />
            <Field label="Philosophy text" value={data.about.philosophy} onChange={(v) => set(['about', 'philosophy'], v)} textarea />
            <Field label="Philosophy photo (put file in /public/images)" value={data.about.philosophyPhoto} onChange={(v) => set(['about', 'philosophyPhoto'], v)} mono hint="Shown right under the philosophy text." />
            <p className="font-mono text-[0.7rem] uppercase tracking-wide opacity-60 my-3">Journey timeline</p>
            <ListEditor
              items={data.about.timeline}
              setItems={(items) => set(['about', 'timeline'], items)}
              fields={[
                { key: 'years', label: 'Years' },
                { key: 'title', label: 'Title' },
                { key: 'text', label: 'Text', textarea: true },
                { key: 'photos', label: 'Photos', type: 'photos' },
              ]}
              newItem={{ years: '', title: '', text: '', photos: [] }}
              label="Timeline entry"
            />
          </Card>
        )}

        {tab === 'Research' && (
          <ListEditor
            items={data.research}
            setItems={(items) => setList('research', items)}
            fields={TIMELINE_FIELDS}
            newItem={NEW_TIMELINE_ITEM}
            label="Research item"
          />
        )}

        {tab === 'Experience' && (
          <ListEditor
            items={data.experience}
            setItems={(items) => setList('experience', items)}
            fields={TIMELINE_FIELDS}
            newItem={NEW_TIMELINE_ITEM}
            label="Experience item"
          />
        )}

        {tab === 'Activities' && (
          <ListEditor
            items={data.activities}
            setItems={(items) => setList('activities', items)}
            fields={TIMELINE_FIELDS}
            newItem={NEW_TIMELINE_ITEM}
            label="Activity"
          />
        )}

        {tab === 'Articles' && (
          <ListEditor
            items={articles}
            setItems={(items) => setList('articles', items)}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'type', label: 'Type (e.g. Conference Paper, Journal Article, Book Chapter, Review)' },
              { key: 'venue', label: 'Venue / journal / conference name' },
              { key: 'date', label: 'Date' },
              { key: 'authors', label: 'Authors' },
              { key: 'link', label: 'Link' },
              { key: 'image', label: 'Cover image (optional, put in /public/images)', mono: true },
            ]}
            newItem={{ title: '', type: '', venue: '', date: '', authors: '', link: '', image: '' }}
            label="Publication"
          />
        )}

        {tab === 'Skills' && (
          <Card>
            <TagListEditor items={data.skills.languages} setItems={(v) => set(['skills', 'languages'], v)} label="Human languages" />
            <TagListEditor items={data.skills.programming} setItems={(v) => set(['skills', 'programming'], v)} label="Programming languages" />
            <TagListEditor items={data.skills.frameworks} setItems={(v) => set(['skills', 'frameworks'], v)} label="Frameworks" />
          </Card>
        )}

        {tab === 'Certifications' && (
          <ListEditor
            items={data.certifications}
            setItems={(items) => setList('certifications', items)}
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'issuer', label: 'Issuer' },
              { key: 'category', label: 'Category' },
              { key: 'driveUrl', label: 'Google Drive share link' },
              { key: 'pdfUrl', label: 'Local PDF path instead (e.g. /certs/name.pdf)' },
              { key: 'image', label: 'Card thumbnail image (optional, put in /public/images)', mono: true },
            ]}
            newItem={{ title: '', issuer: '', category: '', driveUrl: '', pdfUrl: '', image: '' }}
            label="Certificate"
          />
        )}

        {tab === 'Contact' && (
          <Card>
            <Field label="Heading" value={data.contact.heading} onChange={(v) => set(['contact', 'heading'], v)} />
            <Field label="Text" value={data.contact.text} onChange={(v) => set(['contact', 'text'], v)} textarea />
            <Field label="Email" value={data.contact.email} onChange={(v) => set(['contact', 'email'], v)} />
            <Field label="LinkedIn" value={data.contact.linkedin} onChange={(v) => set(['contact', 'linkedin'], v)} />
            <Field label="Kilma (or remove)" value={data.contact.kilma} onChange={(v) => set(['contact', 'kilma'], v)} />
          </Card>
        )}

        {tab === 'Closing Note' && (
          <Card>
            <p className="text-xs opacity-50 mb-4">
              This shows right at the end of the site, below Contact — a little terminal-style
              note, plus a spot for a photo and a feedback prompt. The code snippet itself is
              fixed in the design; these fields control the photo and feedback text around it.
            </p>
            <Field
              label="Photo (put file in /public/images)"
              value={data.closingNote?.photo}
              onChange={(v) => set(['closingNote', 'photo'], v)}
              mono
              hint="Shown as a small circular photo under the note."
            />
            <Field
              label="Feedback prompt text"
              value={data.closingNote?.feedbackText}
              onChange={(v) => set(['closingNote', 'feedbackText'], v)}
              textarea
            />
            <Field
              label="Feedback email (leave empty to use your main contact email)"
              value={data.closingNote?.feedbackEmail}
              onChange={(v) => set(['closingNote', 'feedbackEmail'], v)}
            />
          </Card>
        )}
        </ErrorBoundary>
      </div>
    </div>
  )
}
