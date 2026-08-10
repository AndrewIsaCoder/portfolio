import { useCallback, useEffect, useRef, useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'
import Dots from './dots'
import Deck from './deck'
import OrbitGlobe from './orbitGlobe'
import ActionBar, { Btn } from './actionBar'
import ProjectView, { DURATION } from './projectView'
import projects from './projects'
import useDeckNav from './useDeckNav'
import useViewport from './useViewport'
import { name, role, about, chat } from './content'

const LEAVE = 240 // ms — trebuie să corespundă cu `.anim-leave` din index.css

const HEADING = 'anim-rise text-[34px] leading-[1.05] tracking-[-0.03em] sm:text-[40px] lg:text-5xl'
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

// Paragrafe cu fragmente accentuate + lista de mai jos, ca în design.
function PanelBody({ data }) {
  return (
    <div className="anim-rise">
      {data.paragraphs.map((segments, i) => (
        <p
          key={i}
          className={`max-w-[560px] text-[20px] leading-[1.32] tracking-[-0.02em] text-[#A5A5AA] sm:text-[24px] lg:max-w-[700px] lg:text-[30px] ${
            i ? 'mt-5 lg:mt-7' : ''
          }`}
        >
          {segments.map((s, j) => (
            <span key={j} className={s.strong ? 'text-[#111111]' : undefined}>
              {s.t}
            </span>
          ))}
        </p>
      ))}

      <p className="mt-8 text-[13px] font-medium tracking-[-0.01em] text-[#111111] lg:mt-12">
        {data.listTitle}
      </p>

      <ul className="mt-3 lg:mt-4">
        {data.list.map((item) => (
          <li
            key={item.label}
            className="text-[17px] leading-[1.5] tracking-[-0.02em] text-[#111111] lg:text-[21px]"
          >
            {item.label} <span className="text-[#A5A5AA]">({item.note})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Hero() {
  const [panel, setPanel] = useState(null) // 'about' | 'chat' | null
  const [lastPanel, setLastPanel] = useState('about') // reține textul cât timp iese
  const [project, setProject] = useState(null) // { index, origin }
  const [inProject, setInProject] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [closing, setClosing] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const timer = useRef(null)

  const { w, h } = useViewport()
  const wide = w >= 1024

  // Pe ecran îngust pagina se poate derula, deci nu mai furăm scroll-ul.
  const { active, direction, goTo } = useDeckNav(
    projects.length,
    wide && project === null && panel === null,
  )

  // Teancul e o construcție 3D în pixeli, deci îl scalăm întreg în loc să-i
  // recalculăm geometria la fiecare breakpoint.
  const scale = wide
    ? clamp(Math.min((w - 48) / 1278, h / 950), 0.55, 1)
    : clamp(Math.min((w - 40) / 460, (h * 0.5) / 480), 0.4, 0.92)
  const depth = w >= 1024 ? 2 : w >= 768 ? 1 : 0

  const openPanel = useCallback((next) => {
    setLastPanel(next) // textul rămâne cel corect și în timp ce panoul iese
    setPanel(next)
  }, [])

  // Doar trecerea hero ↔ proiect schimbă coloana, deci doar ea are ieșire.
  const swapColumn = useCallback((apply) => {
    clearTimeout(timer.current)
    setLeaving(true)
    timer.current = setTimeout(() => {
      apply()
      setLeaving(false)
    }, LEAVE)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const openProject = useCallback(
    (index, origin) => {
      setProject({ index, origin })
      setClosing(false)
      setShowInfo(false)
      setPanel(null)
      swapColumn(() => setInProject(true))
    },
    [swapColumn],
  )

  const closeProject = useCallback(() => {
    setClosing(true)
    setTimeout(() => setProject(null), DURATION)
    swapColumn(() => setInProject(false))
  }, [swapColumn])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (project) closeProject()
      else if (panel) setPanel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel, project, closeProject])

  const current = inProject && project ? projects[project.index] : null

  // Același bloc apare fie în coloana din stânga (ecran lat), fie în panou.
  const projectMeta = (dark) =>
    current && (
      <>
        <h1 className={`${HEADING} font-medium ${dark ? 'text-white' : 'text-[#111111]'}`}>
          {current.title}
        </h1>
        <p
          className={`${HEADING} font-light ${dark ? 'text-white/50' : 'text-[#A5A5AA]'}`}
          style={{ animationDelay: '70ms' }}
        >
          {current.subtitle}
        </p>

        {showInfo && (
          <p
            className={`anim-rise mt-8 max-w-[520px] text-[18px] leading-[1.45] tracking-[-0.01em] lg:mt-12 lg:text-[22px] ${
              dark ? 'text-white/60' : 'text-[#6E6E73]'
            }`}
          >
            {current.description}
          </p>
        )}

        <div className={showInfo ? 'mt-8 lg:mt-12' : 'mt-10 lg:mt-60'}>
          <div className="flex gap-2">
            <Btn
              label={showInfo ? 'Hide details' : 'Details'}
              delay={150}
              onClick={() => setShowInfo((v) => !v)}
            >
              <Info size={21} strokeWidth={1.6} />
            </Btn>
            <Btn href={current.url} label="Open live site" delay={205}>
              <ExternalLink size={21} strokeWidth={1.6} />
            </Btn>
          </div>
        </div>
      </>
    )

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F2F2F2] lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-[1278px] flex-col items-center justify-center gap-8 px-5 py-12 sm:px-6 lg:h-full lg:min-h-0 lg:flex-row lg:justify-between lg:gap-6 lg:py-0">
        {/* Pe ecran scund panoul poate depăși înălțimea; coloana se derulează
            singură, fiindcă `main` are overflow ascuns pentru lamelele teancului. */}
        <div
          className={`relative z-30 flex w-full flex-col lg:max-h-full lg:w-auto lg:overflow-y-auto lg:py-2 lg:pr-4 ${
            leaving ? 'anim-leave' : ''
          }`}
        >
          {current && wide ? (
            projectMeta(false)
          ) : (
            <>
              <h1 className={`${HEADING} font-medium text-[#111111]`}>{name}</h1>
              <p
                className={`${HEADING} font-light text-[#A5A5AA]`}
                style={{ animationDelay: '70ms' }}
              >
                {role}
              </p>

              <div className="mt-10 lg:mt-20">
                <ActionBar
                  panel={panel}
                  lastPanel={lastPanel}
                  onOpen={openPanel}
                  onClose={() => setPanel(null)}
                  delay={150}
                />
              </div>

              {/* Conținutul panoului își animează înălțimea, deci coloana urcă
                  lin în loc să sară. Închis, nu ocupă niciun pixel. */}
              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[var(--ease-out-soft)] ${
                  panel ? 'mt-10 grid-rows-[1fr] opacity-100 lg:mt-14' : 'mt-0 grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!panel}
              >
                <div className="overflow-hidden">
                  <PanelBody key={lastPanel} data={lastPanel === 'about' ? about : chat} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Teancul și globul ocupă același loc și fac schimb prin fade. */}
        <div
          className="relative shrink-0"
          style={{ width: 440 * scale, height: 460 * scale }}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out-soft)] ${
              panel ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            <Deck
              projects={projects}
              active={active}
              direction={direction}
              onOpen={openProject}
              scale={scale}
              depth={depth}
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out-soft)] ${
              panel ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!panel}
          >
            <OrbitGlobe scale={scale} />
          </div>
        </div>
      </div>

      <Dots
        total={projects.length}
        active={active}
        onSelect={goTo}
        hidden={project !== null || panel !== null}
      />

      {project && (
        <ProjectView
          project={projects[project.index]}
          origin={project.origin}
          closing={closing}
          meta={projectMeta(true)}
          onClose={closeProject}
        />
      )}
    </main>
  )
}
