import { useEffect, useRef } from 'react'

const COUNT = 1100
const GOLDEN = Math.PI * (3 - Math.sqrt(5)) // unghiul de aur, pentru distribuție uniformă

// Sferă de particule pe canvas — fără dependințe și fără assets externe.
export default function ParticleSphere({ size = 240, onTravel }) {
  const canvasRef = useRef(null)
  const boost = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = size * dpr
    canvas.height = size * dpr

    // Puncte pe o spirală Fibonacci: acoperire egală, fără aglomerări la poli.
    const points = []
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = i * GOLDEN
      points.push([Math.cos(theta) * r, y, Math.sin(theta) * r])
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.44
    const tilt = 0.32
    const ct = Math.cos(tilt)
    const st = Math.sin(tilt)

    let spin = 0.6
    let last = performance.now()
    let frame

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      spin += (0.13 + boost.current) * dt
      boost.current *= 0.95

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cs = Math.cos(spin)
      const sn = Math.sin(spin)

      for (const [x0, y0, z0] of points) {
        const x1 = x0 * cs + z0 * sn
        const z1 = z0 * cs - x0 * sn
        const y1 = y0 * ct - z1 * st
        const z2 = y0 * st + z1 * ct

        const depth = (z2 + 1) / 2 // 0 = în spate, 1 = spre privitor
        ctx.globalAlpha = 0.1 + depth * depth * 0.6
        ctx.fillStyle = '#6F6F76'
        ctx.beginPath()
        ctx.arc(cx + x1 * radius, cy + y1 * radius, (0.5 + depth * 0.9) * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!still) frame = requestAnimationFrame(draw)
    }

    draw(last)
    return () => cancelAnimationFrame(frame)
  }, [size])

  return (
    <button
      type="button"
      aria-label="Spin the globe"
      onClick={() => {
        boost.current = 3.2
        onTravel?.()
      }}
      className="block cursor-pointer rounded-full transition-transform duration-500 ease-[var(--ease-out-soft)] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </button>
  )
}
