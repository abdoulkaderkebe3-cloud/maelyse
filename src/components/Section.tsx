import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type Props = {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

/** Bloc de page avec apparition au défilement, espacement et titre homogènes. */
export function Section({ id, title, children, className = '' }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-2xl scroll-mt-6 px-5 py-14 sm:py-20 ${className}`}
    >
      {title && (
        <h2 className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl">
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  )
}
