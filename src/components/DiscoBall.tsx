import { motion, useReducedMotion } from 'motion/react'

/**
 * Boule à facettes suspendue, avec ses rayons de lumière.
 * Seules des rotations et des translations sont animées, jamais un flou :
 * ce sont les deux seules choses que le navigateur déplace sans repeindre.
 */
export function DiscoBall({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden="true" className={`relative flex flex-col items-center ${className}`}>
      {/* Fil de suspension */}
      <div className="h-10 w-px bg-gradient-to-b from-transparent to-silver/50 sm:h-14" />

      <motion.div
        className="relative"
        animate={reduced ? undefined : { y: [0, 6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Rayons projetés par la boule */}
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
        <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-[0_0_45px_rgba(139,92,246,.6)] sm:h-20 sm:w-20">
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
