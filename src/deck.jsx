import { useEffect, useRef, useState } from 'react'
import Card from './card'

const CARD_W = 440
const CARD_H = 460
const PERSPECTIVE = 3125
export const TRANSITION = 620 // ms

// Teancul din design: slide-urile inactive stau aproape pe muchie și se
// „răsfiră" spre privitor pe măsură ce se depărtează de centru — de aceea
// lamela a doua e mai lată decât prima. y/z sunt în planul nerotit, rot e
// înclinarea pe X (marginea dinspre exterior vine spre cameră).
// Al treilea nivel nu se randează; e doar de unde intră lamela exterioară.
const LAYERS = [
  { y: 473, z: -632, rot: 85.6 }, // |d| === 1 → lamelă de ~78px
  { y: 503, z: -173, rot: 87 }, // |d| === 2 → lamelă de ~40px, mai lată
  { y: 520, z: 60, rot: 88 }, // |d| === 3 → în afara ecranului
]

// d > 0 = sub cardul activ, d < 0 = deasupra.
function transformFor(d) {
  if (d === 0) return 'none'
  const layer = LAYERS[Math.min(Math.abs(d), LAYERS.length) - 1]
  const s = Math.sign(d)
  return `translateY(${s * layer.y}px) translateZ(${layer.z}px) rotateX(${s * layer.rot}deg)`
}

export default function Deck({ projects, active, direction, onOpen, scale = 1, depth = 2 }) {
  const n = projects.length
  const [outgoing, setOutgoing] = useState(null)
  const previous = useRef(active)

  // Cardul precedent rămâne montat cât durează rotirea, ca să se stingă peste
  // lamela gri care merge pe exact același drum.
  useEffect(() => {
    if (previous.current === active) return
    const from = previous.current
    previous.current = active
    setOutgoing({ index: from, direction })
    const timer = setTimeout(() => setOutgoing(null), TRANSITION)
    return () => clearTimeout(timer)
  }, [active, direction])

  const slots = []
  for (let d = -depth; d <= depth; d++) {
    slots.push({ d, index: ((active + d) % n + n) % n })
  }

  return (
    // Wrapper separat pentru intrarea în pagină: `perspective` trebuie să
    // rămână pe un element fără transform propriu.
    <div
      className="anim-deck shrink-0"
      style={{ animationDelay: '180ms', width: CARD_W * scale, height: CARD_H * scale }}
    >
      <div
        className="relative"
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: '50% 50%',
        }}
      >
        {slots.map(({ d, index }) => (
          // Fiecare slot pleacă din poziția vecinului: tot teancul se rotește,
          // nu doar cardul din mijloc. Cheia include `active` ca animația să
          // repornească la fiecare pas.
          <div
            key={`${d}-${active}`}
            className="absolute inset-0"
            style={{
              transform: transformFor(d),
              zIndex: d === 0 ? 10 : Math.abs(d),
              '--deck-from': transformFor(d + direction),
              animation: direction ? `deck-in ${TRANSITION}ms var(--ease-out-soft)` : undefined,
            }}
            aria-hidden={d !== 0}
          >
            <Card
              {...projects[index]}
              dimmed={d !== 0}
              onOpen={d === 0 ? (rect) => onOpen?.(index, rect) : undefined}
            />
          </div>
        ))}

        {outgoing && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 8,
              '--deck-to': transformFor(-outgoing.direction),
              animation: `deck-out ${TRANSITION}ms var(--ease-out-soft) forwards`,
            }}
            aria-hidden="true"
          >
            <div
              className="h-full w-full"
              style={{ animation: `card-fade ${TRANSITION * 0.55}ms ease forwards` }}
            >
              <Card {...projects[outgoing.index]} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
