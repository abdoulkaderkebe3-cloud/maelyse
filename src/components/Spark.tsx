import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { copy } from '../config'
import { useParty } from '../context/PartyContext'

/**
 * Une étincelle cachée.
 *
 * C'est la brique du jeu : neuf de ces objets sont dispersés dans la page.
 * Chacune est discrète mais repérable, scintille doucement, et éclate en
 * particules quand on la touche.
 *
 * Volontairement : la zone tactile fait 44 px alors que le point visible en fait
 * 10. Un enfant qui vise à peu près trouve quand même, ce qui évite la
 * frustration de « je l'ai vue mais je n'arrive pas à la toucher ».
 */

const PARTICLES = [
  { x: 26, y: -22 },
  { x: -28, y: -16 },
  { x: 20, y: 24 },
  { x: -22, y: 26 },
  { x: 34, y: 4 },
  { x: -34, y: -4 },
  { x: 4, y: -34 },
  { x: -6, y: 34 },
]

export function Spark({ id, className = '' }: { id: string; className?: string }) {
  const { found, collect } = useParty()
  const reduced = useReducedMotion()
  const [bursting, setBursting] = useState(false)
  const timerRef = useRef(0)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  // Déjà trouvée lors d'une visite précédente : elle ne revient pas.
  if (found.includes(id) && !bursting) return null

  function handleClick() {
    if (bursting) return
    setBursting(true)
    collect(id)
    // L'étincelle disparaît une fois son éclat terminé.
    //
    // Attention au piège : une première version attendait `onExitComplete` de
    // l'AnimatePresence pour remettre `bursting` à faux. C'était circulaire,
    // la sortie ne pouvait pas se déclencher tant que `bursting` était vrai,
    // et les étincelles ramassées restaient éternellement à l'écran.
    timerRef.current = window.setTimeout(() => setBursting(false), 700)
  }

  return (
    <span className={`pointer-events-none absolute z-20 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={copy.sparkAria}
        className="pointer-events-auto relative flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <AnimatePresence>
          {!bursting && (
            <motion.span
              key="glint"
              aria-hidden="true"
              className="absolute h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(255,215,110,.95)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                reduced
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0.7, 1.25, 0.7], opacity: [0.55, 1, 0.55] }
              }
              exit={{ scale: 2.4, opacity: 0 }}
              transition={
                reduced
                  ? { duration: 0.2 }
                  : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          )}
        </AnimatePresence>

        {/* Halo léger, pour qu'on la repère du coin de l'oeil */}
        {!bursting && !reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute h-8 w-8 rounded-full bg-gold/25 blur-md"
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* L'éclat au moment où on la touche */}
        <AnimatePresence>
          {bursting && !reduced && (
            <>
              {PARTICLES.map((particle, index) => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="absolute h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,110,.9)]"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
              <motion.span
                aria-hidden="true"
                className="absolute rounded-full border-2 border-gold"
                initial={{ width: 8, height: 8, opacity: 0.9 }}
                animate={{ width: 74, height: 74, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </>
          )}
        </AnimatePresence>
      </button>
    </span>
  )
}
