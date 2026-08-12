import { User, MessageCircle, Mail, ChevronLeft, X } from 'lucide-react'
import { LinkedIn } from './brandIcons'
import { email, links } from './content'

const STEP = 55 // ms între butoane, ca rândul să intre în cascadă

// Mărimea butonului și pasul rândului vin din --btn / --pitch (index.css), ca
// poziționarea absolută de mai jos să rămână corectă la orice breakpoint.
const BASE =
  'group anim-pop flex h-[var(--btn)] w-[var(--btn)] items-center justify-center transition-[transform,background-color,border-radius,color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]'
const WHITE = `${BASE} rounded-[calc(var(--btn)*0.28)] bg-white text-[#111111]`
const DARK = `${BASE} rounded-full bg-[#111111] text-white`

export function Icon({ children }) {
  return (
    <span className="transition-transform duration-300 ease-[var(--ease-back)] group-hover:scale-110">
      {children}
    </span>
  )
}

// Butoanele sunt fie <button>, fie <a>, dar arată și se animă la fel.
export function Btn({ href, label, dark, delay = 0, onClick, children }) {
  const props = {
    'aria-label': label,
    className: dark ? DARK : WHITE,
    style: { animationDelay: `${delay}ms` },
  }

  if (href) {
    const external = !href.startsWith('mailto:')
    return (
      <a href={href} {...props} {...(external && { target: '_blank', rel: 'noreferrer' })}>
        <Icon>{children}</Icon>
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} {...props}>
      <Icon>{children}</Icon>
    </button>
  )
}

export default function ActionBar({ panel, lastPanel, onOpen, onClose, delay = 0 }) {
  const isAbout = panel === 'about'
  const isChat = panel === 'chat'
  const show = panel !== null

  // Butonul negru e sursa din care ies social-urile. Cât timp se retrag, panel e
  // deja null, așa că folosim ultimul panou ca să se întoarcă în butonul corect.
  const source = (panel ?? lastPanel) === 'chat' ? 1 : 0

  const socials = [
    {
      key: 'mail',
      label: 'Email',
      href: `mailto:${email}`,
      icon: <Mail size={21} strokeWidth={1.6} />,
    },
    { key: 'in', label: 'LinkedIn', href: links.linkedin, icon: <LinkedIn /> },
  ]

  return (
    // Cele două butoane stau mereu pe loc; social-urile sunt poziționate absolut,
    // ca să nu ocupe spațiu cât sunt ascunse și să nu miște nimic din rând.
    <div className="relative flex gap-2">
      <Btn
        label={isAbout ? 'Back' : 'About'}
        dark={isAbout}
        delay={delay}
        onClick={isAbout ? onClose : () => onOpen('about')}
      >
        {isAbout ? (
          <ChevronLeft size={22} strokeWidth={1.75} />
        ) : (
          <User size={21} strokeWidth={1.6} />
        )}
      </Btn>

      <Btn
        label={isChat ? 'Close' : 'Contact'}
        dark={isChat}
        delay={delay + STEP}
        onClick={isChat ? onClose : () => onOpen('chat')}
      >
        {isChat ? <X size={22} strokeWidth={1.75} /> : <MessageCircle size={21} strokeWidth={1.6} />}
      </Btn>

      {socials.map((s, i) => {
        const slot = 2 + i
        return (
          <div
            key={s.key}
            className="absolute top-0 transition-[opacity,transform] duration-[480ms] ease-[var(--ease-back)]"
            style={{
              left: `calc(var(--pitch) * ${slot})`,
              opacity: show ? 1 : 0,
              // Pornesc din dreptul butonului negru și alunecă în poziția lor.
              transform: show
                ? 'none'
                : `translateX(calc(var(--pitch) * ${-(slot - source)})) scale(0.55)`,
              transitionDelay: `${show ? i * STEP : (socials.length - 1 - i) * 40}ms`,
              pointerEvents: show ? 'auto' : 'none',
            }}
            aria-hidden={!show}
          >
            <Btn href={s.href} label={s.label} delay={delay}>
              {s.icon}
            </Btn>
          </div>
        )
      })}
    </div>
  )
}
