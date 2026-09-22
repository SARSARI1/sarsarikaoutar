import { createContext, useContext, useState, useMemo } from 'react'

// Meteorological seasons, Northern Hemisphere (Morocco).
export function getSeason(date = new Date()) {
  const m = date.getMonth() // 0 = Jan
  if (m === 11 || m === 0 || m === 1) return 'winter'
  if (m >= 2 && m <= 4) return 'spring'
  if (m >= 5 && m <= 7) return 'summer'
  return 'autumn'
}

const SEASON_META = {
  winter: { label: 'Winter', emoji: '❄️', line: 'Snow on the Atlas peaks.' },
  spring: { label: 'Spring', emoji: '🌸', line: 'The foothills are green again.' },
  summer: { label: 'Summer', emoji: '☀️', line: 'Long light over dry stone.' },
  autumn: { label: 'Autumn', emoji: '🍂', line: 'Golden hour, most of the day.' },
}

const SeasonContext = createContext(null)

export function SeasonProvider({ children }) {
  const auto = getSeason()
  // Not persisted on purpose: every fresh page load shows today's real season by
  // default. A preview override (e.g. from the admin dashboard) only lasts for the
  // current session, so it can never get "stuck" showing the wrong season later.
  const [override, setOverrideState] = useState(null)

  const setSeason = (key) => setOverrideState(key)
  const clearOverride = () => setOverrideState(null)

  const season = override || auto

  const value = useMemo(
    () => ({
      season,
      auto,
      meta: SEASON_META[season],
      isOverridden: !!override,
      setSeason,
      clearOverride,
      all: Object.keys(SEASON_META).map((key) => ({ key, ...SEASON_META[key] })),
    }),
    [season, override] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}

export function useSeason() {
  const ctx = useContext(SeasonContext)
  if (!ctx) throw new Error('useSeason must be used inside <SeasonProvider>')
  return ctx
}
