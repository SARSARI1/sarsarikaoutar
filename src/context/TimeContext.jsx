import { createContext, useContext, useState, useMemo } from 'react'

export function getTimeOfDay(date = new Date()) {
  const h = date.getHours()
  return h >= 6 && h < 19 ? 'day' : 'night'
}

const TimeContext = createContext(null)

export function TimeProvider({ children }) {
  const auto = getTimeOfDay()
  // Not persisted on purpose: every fresh page load adapts to the real time of day,
  // so it can never get "stuck" on whatever mode was last picked in a previous visit.
  const [override, setOverrideState] = useState(null)

  const setMode = (m) => setOverrideState(m)
  const clearOverride = () => setOverrideState(null)

  const mode = override || auto
  const toggle = () => setMode(mode === 'day' ? 'night' : 'day')

  const value = useMemo(
    () => ({ mode, auto, isOverridden: !!override, setMode, clearOverride, toggle }),
    [mode, override] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>
}

export function useTimeOfDay() {
  const ctx = useContext(TimeContext)
  if (!ctx) throw new Error('useTimeOfDay must be used inside <TimeProvider>')
  return ctx
}
