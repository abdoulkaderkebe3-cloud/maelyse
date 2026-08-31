import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo } from './Reveal'

type Props = {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

/** Titre révélé mot par mot, chaque mot montant depuis sa ligne de base. */
function AnimatedTitle({ title }: { title: string }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <h2 className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl">{title}</h2>
    )
  }

  return (
    <motion.h2
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl"
    >
      {title.split(' ').map((word, index) => (
        // Le débordement caché fait glisser le mot depuis sous sa propre ligne.
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.7, ease: easeOutExpo } },
            }}
          >
            {word}
            {' '}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

/** Bloc de page : espacement homogène et titre animé. */
export function Section({ id, title, children, className = '' }: Props) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-2xl scroll-mt-6 px-5 py-14 sm:py-20 ${className}`}
    >
      {title && <AnimatedTitle title={title} />}
      {children}
    </section>
  )
}
