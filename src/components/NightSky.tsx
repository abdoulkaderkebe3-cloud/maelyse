import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Champ d'étoiles peint en une seule couche CSS.
 *
 * Performance : la première version posait 70 éléments du DOM, chacun avec sa
 * propre animation. Ici, chaque couche est UN seul div dont le fond est une liste
 * de dégradés radiaux, et seule son opacité est animée. Trois nœuds au lieu de
 * soixante-dix, et l'opacité est le seul type d'animation que le compositeur du
 * navigateur traite sans repeindre.
 */
function useStarLayer(count: number, size: number, seed: number) {
  return useMemo(() => {
    // Générateur déterministe : le ciel est identique à chaque rendu.
    let value = seed
    const random = () => {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }

    const points: string[] = []
    for (let i = 0; i < count; i += 1) {
      const x = (random() * 100).toFixed(2)
      const y = (random() * 100).toFixed(2)
      points.push(
        `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,.9) 0%, transparent 100%)`,
      )
    }
    return points.join(', ')
  }, [count, size, seed])
}

export function NightSky() {
  const reduced = useReducedMotion()
  const near = useStarLayer(26, 2, 7)
  const mid = useStarLayer(22, 1.5, 91)
  const far = useStarLayer(20, 1, 613)

  const layers = [
    { image: near, duration: 4.2, delay: 0 },
    { image: mid, duration: 5.6, delay: 1.1 },
    { image: far, duration: 6.8, delay: 2.3 },
  ]

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Fond de nuit, peint une seule fois */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1b0b3a_0%,#0d0620_45%,#06030f_100%)]" />

      {/*
        Halos néon volontairement STATIQUES.
        Animer la taille d'un élément flouté force le navigateur à recalculer le flou
        à chaque image, ce qui est le calcul le plus coûteux de toute la page sur un
        téléphone d'entrée de gamme. Ici ils sont peints une fois et ne bougent plus.
      */}
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet/25 blur-[70px]" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-neon/20 blur-[80px]" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-aqua/15 blur-[70px]" />

      {/* Les étoiles, une couche par vitesse de scintillement */}
      {layers.map((layer) => (
        <motion.div
          key={layer.duration}
          className="absolute inset-0"
          style={{ backgroundImage: layer.image }}
          animate={reduced ? { opacity: 0.55 } : { opacity: [0.3, 0.85, 0.3] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: layer.duration,
                  delay: layer.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  )
}

/**
 * Boule à facettes suspendue, avec ses rayons de lumière.
 * Seules des rotations et des translations sont animées, jamais un flou.
 */
export function DiscoBall({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden="true" className={`relative flex flex-col items-center ${className}`}>
      {/* Fil de suspension */}
      <div className="h-10 w-px bg-gradient-to-b from-transparent to-silver/50 sm:h-14" />

      <motion.div
        className="relative"
        animate={reduced ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Rayons projetés par la boule. Rotation seule, aucun filtre. */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-45"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(217,70,239,.35) 12deg, transparent 24deg, transparent 60deg, rgba(34,211,238,.3) 72deg, transparent 84deg, transparent 130deg, rgba(139,92,246,.35) 142deg, transparent 154deg, transparent 200deg, rgba(255,215,110,.25) 212deg, transparent 224deg, transparent 300deg, rgba(217,70,239,.3) 312deg, transparent 324deg)',
            maskImage: 'radial-gradient(circle, transparent 14%, black 32%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 14%, black 32%, transparent 76%)',
          }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* La sphère */}
        <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-[0_0_40px_rgba(139,92,246,.55)] sm:h-20 sm:w-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#cfe9ff_14%,#a78bfa_42%,#5b21b6_72%,#1e0b3a_100%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(6,3,15,.45) 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, rgba(6,3,15,.45) 0 1px, transparent 1px 7px)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,.7)_0%,transparent_38%)]" />
        </div>
      </motion.div>
    </div>
  )
}
