import { useEffect, useState } from 'react'

// Redă clipul proiectului dacă există; altfel arată imaginea. La
// `prefers-reduced-motion` rămâne pe imagine, care e și poster-ul clipului.
export default function Media({ src, video, alt, className }) {
  const [still, setStill] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setStill(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  if (video && !still) {
    return (
      <video
        className={className}
        src={video}
        poster={src}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
      />
    )
  }

  return <img className={className} src={src} alt={alt} />
}
