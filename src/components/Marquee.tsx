import { motion } from 'motion/react'
import { useAnimateInView } from '../hooks/useAnimateInView'
import { invitation } from '../data/invitation'

/**
 * Bandeau défilant sous le hero.
 *
 * Deux copies identiques du texte se suivent et l'ensemble glisse de la moitié
 * de sa largeur : quand la première copie sort, la seconde est exactement à sa
 * place, la boucle est donc invisible. Une seule propriété animée, `transform`,
 * que le navigateur traite sans repeindre.
 */
export function Marquee() {
  const { ref, animate } = useAnimateInView<HTMLDivElement>()
  const reduced = !animate
  const text = invitation.copy.marquee

  const line = (
    <span className="flex shrink-0 items-center whitespace-nowrap">
      {Array.from({ length: 4 }, (_, index) => (
        <span key={index} className="flex items-center">
          <span className="px-6 font-display text-lg text-ink/90 sm:text-2xl">{text}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
      ))}
    </span>
  )

  return (
    <div
      ref={ref}
      className="relative flex w-full overflow-hidden border-y border-line/70 bg-surface/40 py-3"
      // Les bords s'estompent au lieu d'être coupés net.
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <motion.div
        className="flex"
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {line}
        <span aria-hidden="true" className="flex">
          {line}
        </span>
      </motion.div>
    </div>
  )
}
