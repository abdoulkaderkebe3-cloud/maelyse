import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur'

type Props = {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
  /** Distance parcourue à l'apparition, en pixels. */
  distance?: number
}

/** Courbe d'accélération commune à tout le site : démarrage franc, arrivée douce. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const

function hiddenState(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { opacity: 0, y: distance }
    case 'down':
      return { opacity: 0, y: -distance }
    case 'left':
      return { opacity: 0, x: distance }
    case 'right':
      return { opacity: 0, x: -distance }
    case 'scale':
      return { opacity: 0, scale: 0.92 }
    case 'blur':
      return { opacity: 0, filter: 'blur(12px)', y: distance / 2 }
  }
}

function visibleState(direction: Direction) {
  return direction === 'blur'
    ? { opacity: 1, filter: 'blur(0px)', y: 0 }
    : { opacity: 1, y: 0, x: 0, scale: 1 }
}

/**
 * Apparition au défilement, déclenchée une seule fois.
 * Sous prefers-reduced-motion, le contenu est rendu tel quel, sans transition.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 28,
  className = '',
}: Props) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={hiddenState(direction, distance)}
      whileInView={visibleState(direction)}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}

/** Conteneur qui fait apparaître ses enfants les uns après les autres. */
export function Stagger({
  children,
  className = '',
  gap = 0.09,
  delay = 0.05,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

/** Enfant d'un Stagger. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
}
