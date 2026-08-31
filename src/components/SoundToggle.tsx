import { motion, useReducedMotion } from 'motion/react'
import { copy } from '../config'
import { useParty } from '../context/PartyContext'

/**
 * Bouton du son, en haut à gauche.
 *
 * Volontairement toujours visible et jamais caché dans un menu : de la musique
 * qui démarre sans qu'on sache comment l'arrêter, c'est la façon la plus rapide
 * de faire fermer un lien.
 */
export function SoundToggle() {
  const { muted, toggleMuted } = useParty()
  const reduced = useReducedMotion()

  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-label={muted ? copy.soundOn : copy.soundOff}
      aria-pressed={!muted}
      className="fixed left-3 top-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-night/90 text-aqua shadow-[0_4px_20px_rgba(0,0,0,.5)] transition-colors duration-200 hover:border-aqua/60"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" strokeLinejoin="round" />
        {muted ? (
          <>
            <path d="m16.5 9.5 4 5" strokeLinecap="round" />
            <path d="m20.5 9.5-4 5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Les ondes pulsent doucement quand le son est actif. */}
            <motion.path
              d="M16 9.6a4 4 0 0 1 0 4.8"
              strokeLinecap="round"
              animate={reduced ? undefined : { opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M18.7 7.4a7.5 7.5 0 0 1 0 9.2"
              strokeLinecap="round"
              animate={reduced ? undefined : { opacity: [0.25, 0.9, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </>
        )}
      </svg>
    </button>
  )
}
