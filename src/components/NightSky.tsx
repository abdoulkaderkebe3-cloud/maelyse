import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/** Étoiles fixes, tirées une seule fois pour ne pas scintiller au re-rendu. */
function useStars(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 3,
      })),
    [count],
  )
}

/**
 * Décor de fond : ciel de nuit, halos néon et boule à facettes.
 * Purement décoratif, donc invisible pour les lecteurs d'écran.
 * Tout est en transform/opacity, et se fige sous prefers-reduced-motion.
 */
export function NightSky() {
  const stars = useStars(70)
  const reduced = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Fond dégradé, du noir profond au violet nuit */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1b0b3a_0%,#0d0620_45%,#06030f_100%)]" />

      {/* Halos néon. Le violet ne porte jamais de texte, seulement de la lumière. */}
      <motion.div
        className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-violet/25 blur-[90px]"
        animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-28 h-96 w-96 rounded-full bg-neon/20 blur-[110px]"
        animate={reduced ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-aqua/15 blur-[100px]"
        animate={reduced ? undefined : { scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Étoiles */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animation: reduced
              ? undefined
              : `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            opacity: reduced ? 0.5 : undefined,
          }}
        />
      ))}
    </div>
  )
}

/** Boule à facettes suspendue, avec ses rayons de lumière. */
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
        {/* Rayons projetés par la boule */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[2px]"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(217,70,239,.35) 12deg, transparent 24deg, transparent 60deg, rgba(34,211,238,.3) 72deg, transparent 84deg, transparent 130deg, rgba(139,92,246,.35) 142deg, transparent 154deg, transparent 200deg, rgba(255,215,110,.25) 212deg, transparent 224deg, transparent 300deg, rgba(217,70,239,.3) 312deg, transparent 324deg)',
            maskImage: 'radial-gradient(circle, transparent 12%, black 30%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 12%, black 30%, transparent 78%)',
          }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* La sphère */}
        <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-[0_0_40px_rgba(139,92,246,.55)] sm:h-20 sm:w-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#cfe9ff_14%,#a78bfa_42%,#5b21b6_72%,#1e0b3a_100%)]" />
          {/* Facettes */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(6,3,15,.45) 0 1px, transparent 1px 7px), repeating-linear-gradient(90deg, rgba(6,3,15,.45) 0 1px, transparent 1px 7px)',
            }}
            animate={reduced ? undefined : { backgroundPositionX: ['0px', '14px'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Reflet */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,.7)_0%,transparent_38%)]" />
        </div>
      </motion.div>
    </div>
  )
}
