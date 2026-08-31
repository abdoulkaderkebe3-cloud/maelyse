import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { easeOutExpo } from './Reveal'

type Props = {
  id?: string
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Titre révélé lettre par lettre, chaque lettre montant depuis sa ligne de base.
 * Le découpage se fait d'abord par mot, pour que le retour à la ligne reste correct,
 * puis par lettre à l'intérieur de chaque mot.
 */
function AnimatedTitle({ title }: { title: string }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <h2 className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl">{title}</h2>
  }

  let position = 0

  return (
    <motion.h2
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
      className="mb-8 text-center font-display text-2xl text-ink sm:text-3xl"
      aria-label={title}
    >
      {title.split(' ').map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} aria-hidden="true" className="inline-block">
          {word.split('').map((letter, letterIndex) => {
            position += 1
            return (
              <span
                key={`${letter}-${letterIndex}-${position}`}
                className="inline-block overflow-hidden pb-1 align-bottom"
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: '110%' },
                    show: { y: '0%', transition: { duration: 0.6, ease: easeOutExpo } },
                  }}
                >
                  {letter}
                </motion.span>
              </span>
            )
          })}
          {/* Espace insécable pour ne pas coller les mots entre eux */}
          <span className="inline-block">&nbsp;</span>
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
