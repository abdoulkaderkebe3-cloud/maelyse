import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { copy, party } from '../config'
import { useParty } from '../context/PartyContext'
import { Fireworks } from './Fireworks'
import { easeOutExpo } from './Reveal'

/**
 * Écran de victoire : les neuf étincelles ont été trouvées.
 *
 * C'est la récompense promise depuis la première trouvaille. Elle doit être
 * nettement plus grosse que tout ce qui précède, sinon l'enfant a l'impression
 * d'avoir cherché pour rien.
 */
export function Victory() {
  const { showVictory, closeVictory } = useParty()

  // Le fond ne défile pas pendant la récompense.
  useEffect(() => {
    if (!showVictory) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [showVictory])

  // Échap ferme, comme n'importe quelle fenêtre modale.
  useEffect(() => {
    if (!showVictory) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeVictory()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showVictory, closeVictory])

  return (
    <AnimatePresence>
      {showVictory && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          role="dialog"
          aria-modal="true"
          aria-label={copy.gameWonTitle}
        >
          <div className="absolute inset-0 bg-night/92" />
          <Fireworks />

          <motion.div
            className="relative w-full max-w-md rounded-card border border-gold/40 bg-surface/90 px-6 py-10 text-center shadow-[0_20px_70px_rgba(0,0,0,.6)]"
            initial={{ scale: 0.86, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 12, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
          >
            {/* Les neuf étincelles gagnées, alignées */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5">
              {Array.from({ length: party.age }, (_, index) => (
                <motion.svg
                  key={index}
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  initial={{ scale: 0, rotate: -60, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    delay: 0.35 + index * 0.075,
                    duration: 0.5,
                    ease: easeOutExpo,
                  }}
                >
                  <path
                    d="M12 2.6l2.1 6.1 6.4.2-5.1 3.9 1.8 6.2L12 15.3l-5.2 3.7 1.8-6.2-5.1-3.9 6.4-.2z"
                    fill="#ffd76e"
                  />
                </motion.svg>
              ))}
            </div>

            <h2 className="font-display text-3xl leading-tight text-gold sm:text-4xl">
              {copy.gameWonTitle}
            </h2>

            <p className="mx-auto mt-4 max-w-sm text-balance font-body text-base leading-relaxed text-ink">
              {copy.gameWonBody}
            </p>

            <p className="mt-6 font-display text-xl text-neon">{copy.gameWonSigned}</p>

            <button
              type="button"
              onClick={closeVictory}
              className="mt-8 min-h-[52px] w-full rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {copy.gameWonClose}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
