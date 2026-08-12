import { useEffect, useLayoutEffect, useRef } from 'react'
import { Shrink } from 'lucide-react'
import Media from './media'

export const DURATION = 600 // ms — Hero așteaptă atât înainte să demonteze

// Pe ecran lat panoul stă în dreapta, cu butonul lângă el; pe ecran îngust
// acoperă tot, iar butonul intră în colțul lui.
function metrics() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const wide = vw >= 1024
  const margin = wide ? 24 : 12
  const btn = vw >= 640 ? 72 : 56
  const gap = wide ? 28 : 16
  const width = wide ? Math.min(920, Math.round(vw * 0.52)) : vw - margin * 2

  return {
    wide,
    btn,
    top: margin,
    left: vw - margin - width,
    width,
    height: vh - margin * 2,
    buttonTop: wide ? margin : margin + gap,
    buttonLeft: wide ? vw - margin - width - gap - btn : vw - margin - gap - btn,
  }
}

const geometry = [
  `top ${DURATION}ms var(--ease-out-soft)`,
  `left ${DURATION}ms var(--ease-out-soft)`,
  `width ${DURATION}ms var(--ease-out-soft)`,
  `height ${DURATION}ms var(--ease-out-soft)`,
]

// La ieșire panoul se stinge spre final, ca să apară cardul de dedesubt în loc
// de un dreptunghi negru care se micșorează singur.
const PANEL_OPEN = [...geometry, 'opacity 200ms ease'].join(', ')
const PANEL_CLOSE = [...geometry, 'opacity 320ms ease 240ms'].join(', ')

export default function ProjectView({ project, origin, closing, meta, onClose }) {
  const panel = useRef(null)
  const content = useRef(null)
  const follow = useRef(null)
  const button = useRef(null)

  // Scriem geometria direct în DOM: un `requestAnimationFrame` nu rulează dacă
  // tab-ul e în fundal, iar un reflow forțat pornește tranziția de fiecare dată.
  const apply = (mode) => {
    const open = mode === 'open'
    const m = metrics()
    const rect = open ? m : origin

    panel.current.style.transition =
      mode === 'start' ? 'none' : open ? PANEL_OPEN : PANEL_CLOSE
    panel.current.style.top = `${rect.top}px`
    panel.current.style.left = `${rect.left}px`
    panel.current.style.width = `${rect.width}px`
    panel.current.style.height = `${rect.height}px`
    panel.current.style.opacity = mode === 'close' ? '0' : '1'

    content.current.style.transition = mode === 'start' ? 'none' : ''
    content.current.style.opacity = open ? '1' : '0'
    content.current.style.transform = open ? 'scale(1)' : 'scale(0.92)'

    follow.current.style.top = `${m.buttonTop}px`
    follow.current.style.left = `${m.buttonLeft}px`

    button.current.style.transition = mode === 'start' ? 'none' : ''
    button.current.style.opacity = open ? '1' : '0'
    button.current.style.transform = open ? 'scale(1)' : 'scale(0.85)'
    button.current.style.pointerEvents = open ? 'auto' : 'none'
  }

  useLayoutEffect(() => {
    apply('start') // punctul de plecare, fără animație
    void panel.current.offsetHeight // forțează recalcularea stilului
    apply('open') // ...și abia acum pornește tranziția
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (closing) apply('close')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing])

  // Butonul urmărește cursorul pe verticală, în limitele panoului.
  useEffect(() => {
    const onMove = (e) => {
      const m = metrics()
      if (!m.wide) return
      const offset = Math.min(Math.max(e.clientY - m.top - m.btn / 2, 0), m.height - m.btn)
      follow.current.style.transform = `translateY(${offset}px)`
    }
    const onResize = () => {
      if (closing) return
      follow.current.style.transform = 'none'
      apply('open')
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
    }
  })

  const wide = metrics().wide

  return (
    <>
      {/* Wrapper-ul face urmărirea cursorului, butonul face apariția — separate
          ca întârzierea de la deschidere să nu frâneze și mișcarea după mouse. */}
      <div ref={follow} className="fixed z-50 transition-transform duration-[550ms] ease-out">
        <button
          ref={button}
          type="button"
          aria-label="Close project"
          onClick={onClose}
          className="group flex h-[var(--btn)] w-[var(--btn)] items-center justify-center rounded-[calc(var(--btn)*0.28)] bg-white text-[#111111] transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
          style={{ transitionDelay: closing ? '0ms' : '260ms' }}
        >
          <span className="transition-transform duration-300 ease-[var(--ease-back)] group-hover:scale-110">
            <Shrink size={21} strokeWidth={1.6} />
          </span>
        </button>
      </div>

      <div
        ref={panel}
        className="fixed z-40 overflow-hidden rounded-[24px] bg-[#0D0D0D] lg:rounded-[32px]"
      >
        <div
          ref={content}
          className="flex h-full flex-col transition-[opacity,transform] duration-[520ms] ease-[var(--ease-out-soft)]"
          style={{ transitionDelay: closing ? '0ms' : '180ms' }}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center p-6">
            <Media
              src={project.detail}
              video={project.video}
              alt={project.title}
              // Se mulează pe raportul sursei: cele late umplu lățimea, cele
              // înalte umplu înălțimea, fără cutie pătrată în jur.
              className={`rounded-[20px] object-contain lg:rounded-[28px] ${
                wide ? 'max-h-[86%] max-w-[86%]' : 'max-h-full max-w-full'
              }`}
            />
          </div>

          {/* Pe ecran îngust panoul acoperă tot, deci titlul intră în el. */}
          {!wide && meta && <div className="px-6 pb-8 sm:px-8">{meta}</div>}
        </div>
      </div>
    </>
  )
}
