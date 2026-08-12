import { useRef } from 'react'
import Media from './media'

export default function Card({ title, screenshot, video, background, dimmed = false, onOpen }) {
  const ref = useRef(null)

  // Cardurile din spate sunt aproape pe muchie, așa că le randăm ca o suprafață
  // plată — exact lamelele gri din design, fără costul imaginilor. Fără umbră:
  // la 85° `box-shadow` se deformează odată cu elementul și iese o pată alungită.
  if (dimmed) {
    return <div className="h-full w-full rounded-[32px] bg-[#E5E5E8]" />
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Open ${title}`}
      // Dreptunghiul măsurat la click e punctul de plecare al animației de extindere.
      onClick={() => onOpen?.(ref.current.getBoundingClientRect())}
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-[32px] bg-[#E5E5E8] text-left transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 active:-translate-y-1 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
    >
      {background && (
        <img
          src={background}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
        />
      )}

      <div className="relative flex h-full items-center justify-center">
        <Media
          src={screenshot}
          video={video}
          alt={title}
          className="w-[79%] rounded-[3px] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="absolute bottom-10 left-10 text-[19px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1">
        {title}
      </h3>
    </button>
  )
}
