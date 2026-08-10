import { useCallback, useEffect, useRef, useState } from 'react'

const COOLDOWN = 700 // ms — puțin peste TRANSITION din deck.jsx
const SWIPE = 40 // px minim pentru un swipe pe verticală

// Navigarea teancului: scroll, săgeți și swipe. Indexul și direcția stau în
// același state ca direcția să fie mereu calculată față de slide-ul curent.
export default function useDeckNav(count, enabled = true) {
  const [{ index, direction }, setState] = useState({ index: 0, direction: 0 })
  const lastMove = useRef(0)

  const go = useCallback(
    (dir) => {
      setState((s) => ({
        index: ((s.index + dir) % count + count) % count,
        direction: dir,
      }))
    },
    [count],
  )

  const goTo = useCallback((i) => {
    setState((s) => (i === s.index ? s : { index: i, direction: i > s.index ? 1 : -1 }))
  }, [])

  useEffect(() => {
    if (!enabled) return

    const throttled = (dir) => {
      const now = Date.now()
      if (now - lastMove.current < COOLDOWN) return
      lastMove.current = now
      go(dir)
    }

    const onWheel = (e) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 4) return
      throttled(e.deltaY > 0 ? 1 : -1)
    }

    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') throttled(1)
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') throttled(-1)
    }

    let startY = null
    const onTouchStart = (e) => {
      startY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (startY === null) return
      const dy = startY - e.touches[0].clientY
      if (Math.abs(dy) < SWIPE) return
      startY = null
      throttled(dy > 0 ? 1 : -1)
    }
    const onTouchEnd = () => {
      startY = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [go, enabled])

  return { active: index, direction, go, goTo }
}
