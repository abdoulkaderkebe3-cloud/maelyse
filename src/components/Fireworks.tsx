import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { palette } from '../config'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  colour: string
  size: number
}

type Rocket = { x: number; y: number; vy: number; target: number; colour: string }

const COLOURS = [palette.gold, palette.neon, palette.violet, palette.aqua, '#ffffff']

/**
 * Feu d'artifice du final.
 *
 * Monté uniquement pendant l'écran de victoire, jamais avant : c'est de loin
 * l'animation la plus coûteuse du site, elle ne doit exister que le temps où
 * elle sert.
 *
 * Trois garde-fous : le nombre de particules est plafonné, le canvas est en un
 * pixel par point CSS, et rien ne démarre si l'utilisateur a demandé moins
 * d'animations.
 */
export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const particles: Particle[] = []
    const rockets: Rocket[] = []
    const MAX_PARTICLES = 380

    function launch() {
      if (rockets.length > 3) return
      rockets.push({
        x: width * (0.15 + Math.random() * 0.7),
        y: height + 10,
        vy: -(height / 78) * (0.85 + Math.random() * 0.3),
        target: height * (0.16 + Math.random() * 0.28),
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      })
    }

    function explode(x: number, y: number, colour: string) {
      const count = Math.min(46, MAX_PARTICLES - particles.length)
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2
        const speed = 1.6 + Math.random() * 3.4
        const maxLife = 52 + Math.random() * 34
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          // Une particule sur cinq est blanche : ça fait scintiller l'ensemble.
          colour: Math.random() < 0.2 ? '#ffffff' : colour,
          size: 1.4 + Math.random() * 1.8,
        })
      }
    }

    let frame = 0
    let sinceLaunch = 0
    let running = true

    function draw() {
      if (!running) return

      // Effacement partiel : les particules laissent une traînée courte.
      ctx!.globalCompositeOperation = 'destination-out'
      ctx!.fillStyle = 'rgba(0,0,0,0.22)'
      ctx!.fillRect(0, 0, width, height)
      ctx!.globalCompositeOperation = 'lighter'

      sinceLaunch += 1
      if (sinceLaunch > 26) {
        sinceLaunch = 0
        launch()
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i]
        rocket.y += rocket.vy
        rocket.vy += 0.06

        ctx!.beginPath()
        ctx!.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = rocket.colour
        ctx!.fill()

        if (rocket.y <= rocket.target || rocket.vy >= 0) {
          explode(rocket.x, rocket.y, rocket.colour)
          rockets.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.055
        p.vx *= 0.985
        p.vy *= 0.985
        p.life -= 1

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx!.globalAlpha = Math.max(0, p.life / p.maxLife)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.colour
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
      ctx!.globalCompositeOperation = 'source-over'
      frame = window.requestAnimationFrame(draw)
    }

    function onResize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
    }

    // Trois départs immédiats : l'écran ne doit pas rester vide une seconde.
    launch()
    window.setTimeout(launch, 260)
    window.setTimeout(launch, 520)

    frame = window.requestAnimationFrame(draw)
    window.addEventListener('resize', onResize)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
