import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { invitation } from '../data/invitation'
import { easeOutExpo } from './Reveal'

const { copy } = invitation

type Props = { onOpened: () => void }

/**
 * Enveloppe d'accueil : premier écran, avant l'invitation elle-même.
 *
 * Règle de D-003 : elle ne doit jamais retarder l'information. Elle ne s'affiche
 * donc qu'à la toute première visite (voir App), s'ouvre en un seul geste, et
 * laisse la page entièrement lisible dès que l'animation est passée.
 */
export function Envelope({ onOpened }: Props) {
  const reduced = useReducedMotion()
  const [state, setState] = useState<'closed' | 'opening' | 'leaving'>('closed')

  // Tant que l'enveloppe est là, la page derrière ne défile pas.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  function open() {
    if (state !== 'closed') return

    if (reduced) {
      onOpened()
      return
    }

    setState('opening')
    // La lettre sort, puis l'écran s'efface sur l'invitation.
    window.setTimeout(() => setState('leaving'), 1150)
    window.setTimeout(onOpened, 1750)
  }

  const isOpening = state !== 'closed'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-night px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: state === 'leaving' ? 0 : 1, scale: state === 'leaving' ? 1.15 : 1 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
    >
      {/* Halos, pour que l'écran d'accueil soit déjà dans l'ambiance de la fête */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[100px]"
          animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <button
        type="button"
        onClick={open}
        aria-label={copy.envelopeAria}
        className="group relative flex cursor-pointer flex-col items-center rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
      >
        <motion.div
          className="relative"
          style={{ perspective: 1200 }}
          animate={reduced || isOpening ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Enveloppe : 280x186 sur téléphone, 340x226 au-delà */}
          <div className="relative h-[186px] w-[280px] sm:h-[226px] sm:w-[340px]">
            {/* Doublure, visible par l'ouverture une fois le rabat relevé */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#2a0f4d] to-[#1a0930] shadow-[0_25px_60px_rgba(139,92,246,.35)]" />

            {/* La lettre, qui sort de l'enveloppe */}
            <motion.div
              className="absolute inset-x-4 top-3 z-10 rounded-md bg-gradient-to-b from-[#fdfbff] to-[#efe7ff] px-4 py-5 text-center shadow-[0_10px_30px_rgba(0,0,0,.45)]"
              initial={{ y: 0 }}
              animate={isOpening ? { y: reduced ? 0 : -96, scale: 1.04 } : { y: 0 }}
              transition={{ duration: 0.85, delay: 0.35, ease: easeOutExpo }}
            >
              <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-[#7c5bb5]">
                {copy.eyebrow}
              </p>
              <p className="mt-2 font-display text-2xl leading-tight text-[#1a0930]">
                {invitation.firstName}
              </p>
              <p className="font-display text-4xl leading-none text-[#8b2fb8]">{invitation.age}</p>
            </motion.div>

            {/*
              Face avant : tout le rectangle SAUF l'encoche triangulaire du haut,
              dont la pointe est à 55%. Le rabat couvre exactement cette encoche,
              les deux arêtes coïncident donc au pixel près une fois fermé.
            */}
            <div
              className="absolute inset-0 z-20 rounded-lg bg-gradient-to-br from-[#3b1566] via-[#2a0f4d] to-[#1a0930]"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
            />

            {/* Rabat, qui bascule vers l'arrière à l'ouverture */}
            <motion.div
              className="absolute inset-x-0 top-0 z-30 h-[55%] origin-top"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ rotateX: 0 }}
              animate={isOpening ? { rotateX: reduced ? 0 : -168 } : { rotateX: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              {/*
                Le liseré doré suit la silhouette découpée grâce au drop-shadow,
                qui épouse le clip-path au lieu de la boîte rectangulaire.
              */}
              <div
                className="h-full w-full rounded-t-lg bg-gradient-to-b from-[#4a1b7d] to-[#33125c]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  backfaceVisibility: 'hidden',
                  filter: 'drop-shadow(0 1.5px 0 rgba(255,215,110,.5))',
                }}
              />
            </motion.div>

            {/* Cachet de cire, posé sur la pointe du rabat */}
            <motion.div
              className="absolute left-1/2 top-[55%] z-40 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-14 sm:w-14"
              style={{
                background:
                  'radial-gradient(circle at 34% 30%, #ffe9a8 0%, #ffd76e 35%, #d99b1f 75%, #8a5a08 100%)',
                boxShadow: '0 6px 20px rgba(0,0,0,.5), inset 0 -2px 6px rgba(0,0,0,.35)',
              }}
              animate={isOpening ? { scale: 0, opacity: 0, rotate: -25 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeIn' }}
            >
              <span className="font-display text-xl text-[#6b3f04] sm:text-2xl">
                {invitation.firstName.charAt(0)}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 font-body text-sm uppercase tracking-[0.3em] text-aqua"
          animate={isOpening ? { opacity: 0 } : reduced ? undefined : { opacity: [0.45, 1, 0.45] }}
          transition={
            isOpening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {copy.envelopeHint}
        </motion.p>
      </button>
    </motion.div>
  )
}
