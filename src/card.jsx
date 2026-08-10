import { useRef } from 'react'

export default function Card({ title, screenshot, background, dimmed = false, onOpen }) {
  const ref = useRef(null)

  // Cardurile din spate sunt aproape pe muchie, așa că le randăm ca o suprafață
  // plată — exact lamelele gri din design, fără costul imaginilor.
  if (dimmed) {
    return (
      <div className="h-full w-full rounded-[32px] bg-[#E8E8E9] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]" />
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Open ${title}`}
      // Dreptunghiul măsurat la click e punctul de plecare al animației de extindere.
      onClick={() => onOpen?.(ref.current.getBoundingClientRect())}
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-[32px] bg-[#E8E8E9] text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.28)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:shadow-[0_44px_80px_-24px_rgba(0,0,0,0.34)] active:-translate-y-1 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
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
        <img
          src={screenshot}
          alt={title}
          className="w-[79%] rounded-[3px] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="absolute bottom-10 left-10 text-[19px] font-medium tracking-[-0.01em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1">
        {title}
      </h3>
    </button>
  )
}
