import { useEffect, useRef, useState } from 'react'

function makeNoiseBuffer(ctx, seconds = 3) {
  const size = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function windLevel(season, mode) {
  const base = { winter: 0.05, autumn: 0.045, spring: 0.028, summer: 0.022 }[season] ?? 0.03
  return mode === 'night' ? base * 0.75 : base
}

// Schedules the sparse, organic layers on top of the wind bed: birdsong by day,
// crickets by night, a little water bubbling in spring/summer.
function scheduleAmbience(ctx, master, season, mode, timersRef) {
  const schedule = (fn, minMs, maxMs) => {
    const run = () => {
      fn()
      timersRef.current.push(setTimeout(run, minMs + Math.random() * (maxMs - minMs)))
    }
    timersRef.current.push(setTimeout(run, 400 + Math.random() * 800))
  }

  const chirp = (freqBase) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.connect(g)
    g.connect(master)
    const f = freqBase + Math.random() * 500
    osc.frequency.setValueAtTime(f, t)
    osc.frequency.exponentialRampToValueAtTime(f * 1.25, t + 0.08)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.045, t + 0.02)
    g.gain.linearRampToValueAtTime(0, t + 0.18)
    osc.start(t)
    osc.stop(t + 0.2)
  }

  const cricket = () => {
    const t0 = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const t = t0 + i * 0.09
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = 4200 + Math.random() * 300
      osc.connect(g)
      g.connect(master)
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.022, t + 0.01)
      g.gain.linearRampToValueAtTime(0, t + 0.05)
      osc.start(t)
      osc.stop(t + 0.06)
    }
  }

  if (mode === 'day') {
    const freqBase = season === 'winter' ? 1700 : season === 'summer' ? 2300 : 2000
    const [min, max] = season === 'winter' ? [4500, 10000] : [1800, 4500]
    schedule(() => chirp(freqBase), min, max)
  } else if (season !== 'winter') {
    const [min, max] = season === 'summer' ? [900, 2200] : [1800, 3500]
    schedule(cricket, min, max)
  }
}

export default function SoundScape({ season, mode }) {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef(null)
  const nodesRef = useRef({})
  const timersRef = useRef([])
  const userChoseRef = useRef(false) // true once the person has made an explicit choice
  const runningRef = useRef(false) // true the instant audio is actually running (checked synchronously)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const stopAll = () => {
    clearTimers()
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {})
      ctxRef.current = null
    }
    nodesRef.current = {}
    runningRef.current = false
  }

  useEffect(() => () => stopAll(), [])

  const start = () => {
    runningRef.current = true
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.4)

    const noise = ctx.createBufferSource()
    noise.buffer = makeNoiseBuffer(ctx, 3)
    noise.loop = true
    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'lowpass'
    windFilter.frequency.value = 500
    const windGain = ctx.createGain()
    windGain.gain.value = windLevel(season, mode)
    noise.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(master)
    noise.start()

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.07
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 150
    lfo.connect(lfoGain)
    lfoGain.connect(windFilter.frequency)
    lfo.start()

    nodesRef.current = { master, noise, lfo, windGain }
    scheduleAmbience(ctx, master, season, mode, timersRef)
    setEnabled(true)
  }

  const stopWithFade = () => {
    if (nodesRef.current.master && ctxRef.current) {
      nodesRef.current.master.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.8)
    }
    runningRef.current = false
    setTimeout(stopAll, 900)
    setEnabled(false)
  }

  const toggle = () => {
    userChoseRef.current = true
    if (runningRef.current) stopWithFade()
    else start()
  }

  // Browsers won't let audio start until the person has interacted with the page at
  // least once. This listens for that very first interaction (a click, key press,
  // scroll, or touch anywhere on the site) and starts the soundscape then — the
  // closest thing to "plays automatically" that's actually allowed to work.
  // runningRef is checked synchronously so clicking the sound button itself (which
  // also fires this listener) never starts two audio contexts.
  useEffect(() => {
    const tryAutoStart = () => {
      if (userChoseRef.current || runningRef.current) return
      userChoseRef.current = true
      start()
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    events.forEach((ev) => window.addEventListener(ev, tryAutoStart, { once: true, passive: true }))
    return () => events.forEach((ev) => window.removeEventListener(ev, tryAutoStart))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-tune the soundscape live if the season or day/night mode changes while playing.
  useEffect(() => {
    if (!enabled || !ctxRef.current) return
    clearTimers()
    if (nodesRef.current.windGain) {
      nodesRef.current.windGain.gain.linearRampToValueAtTime(
        windLevel(season, mode),
        ctxRef.current.currentTime + 1
      )
    }
    scheduleAmbience(ctxRef.current, nodesRef.current.master, season, mode, timersRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, mode])

  return (
    <button
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? 'Turn off gentle nature sounds' : 'Turn on gentle nature sounds'}
      className="sound-toggle text-lg"
    >
      {enabled ? '🔈' : '🔇'}
    </button>
  )
}
