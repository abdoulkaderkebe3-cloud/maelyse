import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

type Colour = { light: string; main: string; dark: string }
type Star = { x: number; y: number; r: number; phase: number; speed: number }
type Balloon = {
  x: number
  y: number
  r: number
  sprite: HTMLCanvasElement
  drift: number
  speed: number
  sway: number
}

/**
 * Chaque ballon a trois teintes : le reflet, la couleur pleine, et le côté à
 * l'ombre. Les teintes restent sombres volontairement : un ballon passe derrière
 * le texte, et un aplat clair ferait tomber le contraste sous le seuil lisible.
 */
const BALLOON_COLOURS: Colour[] = [
  { light: '#e879f9', main: '#86198f', dark: '#3b0764' },
  { light: '#a78bfa', main: '#4c1d95', dark: '#2e1065' },
  { light: '#67e8f9', main: '#0e7490', dark: '#083344' },
  { light: '#fde68a', main: '#d97706', dark: '#78350f' },
  { light: '#fb7185', main: '#9d174d', dark: '#500724' },
]

/** 30 images par seconde suffisent pour un décor qui dérive lentement. */
const FRAME_MS = 33

/**
 * Dessine un ballon UNE fois dans son propre petit canvas.
 *
 * C'est le cœur de l'optimisation : la première version recréait un dégradé
 * radial et retraçait trois chemins par ballon à chaque image. Ici chaque ballon
 * est peint une seule fois, puis simplement recopié, ce qui ne coûte plus qu'une
 * copie de pixels.
 */
function makeBalloonSprite(r: number, colour: Colour): HTMLCanvasElement {
  const width = r * 2.2
  const height = r * 4.4
  const sprite = document.createElement('canvas')
  sprite.width = Math.ceil(width)
  sprite.height = Math.ceil(height)

  const ctx = sprite.getContext('2d')!
  const cx = width / 2
  const cy = r * 1.15

  // Ficelle
  ctx.beginPath()
  ctx.moveTo(cx, cy + r * 1.25)
  ctx.quadraticCurveTo(cx + 5, cy + r * 2, cx, cy + r * 2.9)
  ctx.strokeStyle = 'rgba(214, 222, 235, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Corps
  const gradient = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.42, r * 0.05, cx, cy, r * 1.05)
  gradient.addColorStop(0, colour.light)
  gradient.addColorStop(0.32, colour.main)
  gradient.addColorStop(1, colour.dark)
  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 0.85, r * 1.05, 0, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Reflet : c'est lui qui fait lire la forme comme un ballon
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.3, cy - r * 0.42, r * 0.16, r * 0.24, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fill()

  // Nœud
  ctx.beginPath()
  ctx.moveTo(cx - 3.5, cy + r * 1.02)
  ctx.lineTo(cx + 3.5, cy + r * 1.02)
  ctx.lineTo(cx, cy + r * 1.3)
  ctx.closePath()
  ctx.fillStyle = colour.dark
  ctx.fill()

  return sprite
}

/**
 * Décor de fond : ciel étoilé et ballons qui montent, dans un seul canvas.
 *
 * Quatre choses tiennent le coût bas, toutes ajoutées APRÈS mesure au navigateur
 * avec le processeur ralenti six fois, où la première version tombait à 4 images
 * par seconde au défilement :
 * 1. chaque ballon est une image pré-dessinée, simplement recopiée ;
 * 2. le canvas est en un pixel par point CSS, pas en haute densité ;
 * 3. le dessin est plafonné à 30 images par seconde ;
 * 4. la boucle s'arrête quand l'onglet passe en arrière-plan.
 */
export function Sky() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let stars: Star[] = []
    let balloons: Balloon[] = []

    function build() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = Math.floor(width)
      canvas!.height = Math.floor(height)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`

      const starCount = Math.min(60, Math.round((width * height) / 11000))
      stars = Array.from({ length: starCount }, () => ({
        x: Math.round(Math.random() * width),
        y: Math.round(Math.random() * height),
        r: Math.random() * 1.5 + 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.4,
      }))

      const balloonCount = width < 600 ? 6 : 9
      balloons = Array.from({ length: balloonCount }, (_, index) => {
        const r = Math.random() * 12 + 13
        const colour = BALLOON_COLOURS[Math.floor(Math.random() * BALLOON_COLOURS.length)]
        return {
          x: Math.random() * width,
          // Répartis dès le départ sur toute la hauteur : la première version
          // les plaçait tous très en dessous de l'écran, il fallait attendre
          // des minutes avant d'en voir un seul.
          y: -80 + ((index + Math.random()) / balloonCount) * (height + 220),
          r,
          sprite: makeBalloonSprite(r, colour),
          drift: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.35 + 0.28,
          sway: Math.random() * 18 + 10,
        }
      })
    }

    function paint(time: number) {
      context!.clearRect(0, 0, width, height)

      for (const star of stars) {
        context!.globalAlpha =
          0.42 + 0.5 * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase))
        context!.beginPath()
        context!.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        context!.fillStyle = '#ffffff'
        context!.fill()
      }

      context!.globalAlpha = 0.72
      for (const balloon of balloons) {
        balloon.y -= balloon.speed
        if (balloon.y < -balloon.r * 3) {
          balloon.y = height + balloon.r * 3
          balloon.x = Math.random() * width
        }
        const x = balloon.x + Math.sin(time * 0.0004 + balloon.drift) * balloon.sway
        context!.drawImage(
          balloon.sprite,
          Math.round(x - balloon.r * 1.1),
          Math.round(balloon.y - balloon.r * 1.15),
        )
      }
      context!.globalAlpha = 1
    }

    let frame = 0
    let running = true
    let last = 0

    function loop(time: number) {
      if (!running) return
      if (time - last >= FRAME_MS) {
        last = time
        paint(time)
      }
      frame = window.requestAnimationFrame(loop)
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        window.cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = window.requestAnimationFrame(loop)
      }
    }

    let resizeTimer = 0
    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(build, 250)
    }

    build()
    window.addEventListener('resize', onResize)

    if (reduced) {
      // Une seule image fixe : le ciel existe, rien ne bouge.
      paint(0)
      return () => {
        window.clearTimeout(resizeTimer)
        window.removeEventListener('resize', onResize)
      }
    }

    frame = window.requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/*
        Fond de nuit et halos.
        `will-change: transform` les isole sur leur propre couche : sans ça, le
        navigateur recalculait ces flous de 70 à 80 pixels à chaque image dessinée
        par le canvas voisin, ce qui écroulait le défilement.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1b0b3a_0%,#0d0620_45%,#06030f_100%)]" />
      <div
        className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet/25 blur-[70px]"
        style={{ willChange: 'transform' }}
      />
      <div
        className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-neon/20 blur-[80px]"
        style={{ willChange: 'transform' }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-aqua/15 blur-[70px]"
        style={{ willChange: 'transform' }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
