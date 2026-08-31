import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { copy } from '../config'
import { useParty } from '../context/PartyContext'
import { easeOutExpo } from './Reveal'

/**
 * Compteur d'étincelles, en haut à droite.
 *
 * Il n'apparaît qu'à partir de la première étincelle trouvée : avant, il n'y
 * aurait rien à compter et il ne ferait qu'encombrer l'écran. Dès qu'il
 * apparaît, il devient l'objectif visible, et c'est lui qui donne envie de
 * continuer à chercher.
 */
export function SparkCounter() {
  const { count, total, won } = useParty()
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.9 }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
          className="fixed right-3 top-3 z-40 flex items-center gap-2 rounded-full border border-gold/40 bg-night/90 px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,.5)]"
          aria-label={`${copy.sparkCounterAria}: ${count} / ${total}`}
        >
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            animate={reduced ? undefined : { rotate: [0, 12, -12, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M12 2.6l2.1 6.1 6.4.2-5.1 3.9 1.8 6.2L12 15.3l-5.2 3.7 1.8-6.2-5.1-3.9 6.4-.2z"
              fill={won ? '#ffd76e' : '#ffd76e'}
              opacity={won ? 1 : 0.85}
            />
          </motion.svg>

          <span className="font-body text-sm tabular-nums text-ink" aria-hidden="true">
            {/* Le chiffre bascule à chaque trouvaille : la récompense se voit. */}
            <span className="relative inline-block h-4 w-3 overflow-hidden align-middle">
              <AnimatePresence initial={false}>
                <motion.span
                  key={count}
                  className="absolute inset-0 flex items-center justify-center font-semibold text-gold"
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-110%' }}
                  transition={{ duration: 0.32, ease: easeOutExpo }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-muted">/{total}</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
