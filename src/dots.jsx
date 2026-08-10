export default function Dots({ total = 3, active = 0, onSelect, hidden = false }) {
  return (
    // Sub 1440px nu mai e loc lângă coloana de conținut, deci punctele trec
    // orizontal, jos. Offset-ul se calculează din marginea rămasă, ca să nu
    // ajungă niciodată peste teanc.
    <div
      className={`anim-fade fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-row items-center gap-1 transition-opacity duration-300 min-[1440px]:bottom-auto min-[1440px]:left-auto min-[1440px]:right-[calc((100vw-1278px)/6)] min-[1440px]:top-1/2 min-[1440px]:translate-x-0 min-[1440px]:-translate-y-1/2 min-[1440px]:flex-col ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to project ${i + 1}`}
          aria-current={i === active}
          onClick={() => onSelect?.(i)}
          className="group grid h-4 w-4 place-items-center"
        >
          <span
            className={`rounded-full transition-all duration-300 ease-[var(--ease-out-soft)] ${
              i === active
                ? 'h-2 w-2 bg-[#111111]'
                : 'h-[5px] w-[5px] bg-[#C8C8CB] group-hover:h-2 group-hover:w-2 group-hover:bg-[#8A8A8F]'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
