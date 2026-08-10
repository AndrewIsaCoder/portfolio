import { useEffect, useState } from 'react'

// Dimensiunile ferestrei, pentru deciziile care nu se pot lua din CSS
// (scalarea teancului 3D și geometria panoului de proiect).
export default function useViewport() {
  const [size, setSize] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }))

  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight })

    // ResizeObserver prinde și cazurile în care `resize` nu ajunge (tab în
    // fundal, bară de adrese care se ascunde pe mobil, zoom).
    const observer = new ResizeObserver(read)
    observer.observe(document.documentElement)
    window.addEventListener('resize', read)
    window.addEventListener('orientationchange', read)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', read)
      window.removeEventListener('orientationchange', read)
    }
  }, [])

  return size
}
