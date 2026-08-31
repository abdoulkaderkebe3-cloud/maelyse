import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/** Filet de lumière en haut de page, qui se remplit au fil du défilement. */
export function ScrollProgress() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-gradient-to-r from-aqua via-violet to-neon"
    />
  )
}
