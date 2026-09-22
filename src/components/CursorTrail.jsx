import { useEffect, useRef } from 'react'

const GLYPH = { winter: '❄', spring: '✿', summer: '✦', autumn: '🍂' }
const COLOR = { winter: '#8FB4D9', spring: '#D98CA3', summer: '#C98A2E', autumn: '#A85C32' }

export default function CursorTrail({ season }) {
  const lastSpawn = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (reduce || touch) return

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastSpawn.current < 90) return
      lastSpawn.current = now

      const el = document.createElement('span')
      el.textContent = GLYPH[season] || '✦'
      el.className = 'cursor-particle'
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.color = COLOR[season] || '#4A6FA5'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 900)
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [season])

  return null
}
