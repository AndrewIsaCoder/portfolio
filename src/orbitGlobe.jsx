import { Atom, Braces, Smartphone, Database, GitBranch, Code, Cpu, Boxes } from 'lucide-react'
import ParticleSphere from './particleSphere'

// Inelele orbitează, iar cutia iconiței se rotește invers cu aceeași durată, ca
// să rămână dreaptă. Iconițele sunt din lucide — fără assets externe.
const RINGS = [
  { size: 300, duration: 26, start: -50, icons: [Atom, Braces, Smartphone] },
  { size: 384, duration: 34, start: 30, icons: [Database, GitBranch] },
  { size: 468, duration: 44, start: -20, icons: [Code, Cpu, Boxes] },
]

const CHIP = 40

export default function OrbitGlobe({ width = 440, height = 460, scale = 1, label = 'Click to travel' }) {
  return (
    <div style={{ width: width * scale, height: height * scale }}>
      <div
        className="relative"
        style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}
      >
        {RINGS.map((ring, index) => {
          const clockwise = index % 2 === 0
          const orbit = clockwise ? 'orbit-cw' : 'orbit-ccw'
          const counter = clockwise ? 'counter-cw' : 'counter-ccw'

          return (
            <div
              key={ring.size}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DFDFE2]"
              style={{ width: ring.size, height: ring.size }}
            >
              {ring.icons.map((Icon, i) => {
                const angle = ring.start + (i * 360) / ring.icons.length
                return (
                  <div
                    key={i}
                    className="absolute left-1/2 top-0 h-1/2 origin-bottom"
                    style={{
                      width: CHIP,
                      marginLeft: -CHIP / 2,
                      '--start-angle': `${angle}deg`,
                      animation: `${orbit} ${ring.duration}s linear infinite`,
                    }}
                  >
                    <div
                      className="grid place-items-center rounded-full border border-[#E6E6E9] bg-white"
                      style={{
                        width: CHIP,
                        height: CHIP,
                        marginTop: -CHIP / 2,
                        '--counter-offset': `${-angle}deg`,
                        animation: `${counter} ${ring.duration}s linear infinite`,
                      }}
                    >
                      <Icon size={17} strokeWidth={1.6} className="text-[#55555C]" />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ParticleSphere size={210} />
        </div>

        <p className="absolute inset-x-0 bottom-2 text-center text-[13px] tracking-[-0.01em] text-[#A5A5AA]">
          {label}
        </p>
      </div>
    </div>
  )
}
