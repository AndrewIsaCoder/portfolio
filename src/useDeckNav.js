import { useCallback, useEffect, useRef, useState } from 'react'

const COOLDOWN = 700 // ms — puțin peste TRANSITION din deck.jsx
const SWIPE = 45 // px minim pentru un swipe

// Navigarea teancului: scroll, săgeți și swipe. Indexul și direcția stau în
// același state ca direcția să fie mereu calculată față de slide-ul curent.
//
// `lockPage` = pagina nu se derulează (layout pe două coloane, `h-screen`).
// Doar atunci putem fura rotița și swipe-ul vertical; altfel ar bloca scroll-ul
// paginii, așa că pe mobil în picioare rămâne doar swipe-ul orizontal.
export default function useDeckNav(count, enabled = true, lockPage = true) {
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
      if (!lockPage) return // pagina trebuie să se poată derula normal
      e.preventDefault()
      if (Math.abs(e.deltaY) < 4) return
      throttled(e.deltaY > 0 ? 1 : -1)
    }

    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') throttled(1)
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') throttled(-1)
    }

    let start = null
    const onTouchStart = (e) => {
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const onTouchMove = (e) => {
      if (!start) return
      const dx = start.x - e.touches[0].clientX
      const dy = start.y - e.touches[0].clientY

      // Axa dominantă decide: pe orizontală navigăm mereu, pe verticală doar
      // când pagina oricum nu se derulează.
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) < SWIPE) return
        start = null
        throttled(dx > 0 ? 1 : -1) // deget spre stânga = proiectul următor
      } else {
        if (!lockPage || Math.abs(dy) < SWIPE) return
        start = null
        throttled(dy > 0 ? 1 : -1)
      }
    }
    const onTouchEnd = () => {
      start = null
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
  }, [go, enabled, lockPage])

  return { active: index, direction, go, goTo }
}
