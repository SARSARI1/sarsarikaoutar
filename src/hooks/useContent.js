import { useState, useEffect, useCallback } from 'react'
import defaultContent from '../data/content.json'

const STORAGE_KEY = 'portfolioContent'

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useContent() {
  const [data, setData] = useState(() => loadStored() || defaultContent)
  const [hasLocalEdits, setHasLocalEdits] = useState(() => !!loadStored())

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setData(loadStored() || defaultContent)
        setHasLocalEdits(!!loadStored())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((next) => {
    setData(next)
    setHasLocalEdits(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (err) {
      console.error('Could not save to browser storage:', err)
    }
  }, [])

  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setData(defaultContent)
    setHasLocalEdits(false)
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [data])

  const importJson = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result)
            save(parsed)
            resolve(parsed)
          } catch (err) {
            reject(err)
          }
        }
        reader.onerror = reject
        reader.readAsText(file)
      }),
    [save]
  )

  return { data, save, resetToDefault, exportJson, importJson, hasLocalEdits }
}
