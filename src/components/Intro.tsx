import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { copy, party } from '../config'
import { useParty } from '../context/PartyContext'
import { easeOutExpo } from './Reveal'

/**
 * ============================================================================
 *  OUVERTURE DU SITE
 * ============================================================================
 *
 * Une seule séquence continue, en quatre temps, environ trois secondes après
 * l'appui :
 *
 *   1. sealed    l'enveloppe flotte, cachetée, entourée d'étincelles en orbite
 *   2. burst     le sceau éclate, le rabat bascule, la lumière envahit l'écran
 *   3. assemble  les lettres du prénom jaillissent de la lumière et s'assemblent
 *   4. leave     tout s'écarte, on entre dans la fête
 *
 * Règle non négociable : cette séquence ne se joue qu'à la PREMIÈRE visite
 * (voir App). Un parent qui rouvre le lien le jeudi pour revérifier l'adresse
 * tombe directement sur l'invitation. C'est magique une fois, agaçant la
 * quatrième.
 */

type Phase = 'arriving' | 'sealed' | 'burst' | 'assemble' | 'leave'

const ORBIT = [
  { angle: 0, distance: 132, size: 5, colour: '#ffd76e' },
  { angle: 72, distance: 118, size: 3, colour: '#22d3ee' },
  { angle: 144, distance: 140, size: 4, colour: '#d946ef' },
  { angle: 216, distance: 112, size: 3, colour: '#ffffff' },
  { angle: 288, distance: 136, size: 4, colour: '#8b5cf6' },
]

/** Positions de départ des lettres : figées une fois pour toutes. */
function useLetterOrigins(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        // Réparties en éventail plutôt qu'au hasard pur : l'assemblage se lit
        // comme un mouvement, pas comme du désordre.
        const spread = (index / Math.max(1, count - 1)) * 2 - 1
        return {
          x: spread * (140 + Math.random() * 90),
          y: -170 - Math.random() * 120,
          rotate: spread * 55 + (Math.random() * 30 - 15),
        }
      }),
    [count],
  )
}

export function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const { startAudio, playSound } = useParty()
  const [phase, setPhase] = useState<Phase>('arriving')

  const letters = useMemo(() => party.firstName.split(''), [])
  const origins = useLetterOrigins(letters.length)

  /** Minuteurs de la séquence, annulés si le composant disparaît en route. */
  const timersRef = useRef<number[]>([])
  const timers = timersRef.current

  useEffect(
    () => () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
    },
    [],
  )

  // Le fond ne défile pas tant que l'ouverture n'est pas finie.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Fin de l'arrivée : l'enveloppe devient touchable.
  useEffect(() => {
    if (reduced) {
      setPhase('sealed')
      return
    }
    const timer = window.setTimeout(() => setPhase('sealed'), 1150)
    return () => window.clearTimeout(timer)
  }, [reduced])

  function open() {
    if (phase !== 'sealed') return

    // Le son démarre ici, sur un vrai geste, jamais tout seul.
    startAudio()
    playSound('whoosh')

    if (reduced) {
      onDone()
      return
    }

    setPhase('burst')
    timers.push(
      window.setTimeout(() => {
        setPhase('assemble')
        playSound('chime')
      }, 780),
      window.setTimeout(() => setPhase('leave'), 2650),
      window.setTimeout(onDone, 3350),
    )
  }

  const opening = phase === 'burst' || phase === 'assemble' || phase === 'leave'
  const showLetters = phase === 'assemble' || phase === 'leave'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'leave' ? 0 : 1 }}
      transition={{ duration: 0.55, delay: phase === 'leave' ? 0.3 : 0, ease: 'easeIn' }}
    >
      {/* Voile léger : le ciel et les ballons restent visibles derrière */}
      <div className="absolute inset-0 -z-10 bg-night/45" />

      {/* L'éclair de lumière qui accompagne l'éclatement du sceau */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'burst' ? [0, 0.9, 0] : 0 }}
        transition={{ duration: 0.85, times: [0, 0.3, 1], ease: 'easeOut' }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* L'ENVELOPPE                                                         */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {!showLetters && (
          <motion.button
            key="envelope"
            type="button"
            onClick={open}
            aria-label={copy.envelopeAria}
            className="relative cursor-pointer rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
            style={{ perspective: 1400 }}
            initial={reduced ? false : { scale: 0.15, rotateX: 52, rotateY: -38, y: 140, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
            exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 62, damping: 14, mass: 1.1 }}
          >
            <motion.div
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={
                reduced || opening ? { y: 0, rotateZ: 0 } : { y: [0, -9, 0], rotateZ: [-1.2, 1.2, -1.2] }
              }
              transition={{ duration: 6, repeat: opening ? 0 : Infinity, ease: 'easeInOut' }}
            >
              {/* Étincelles en orbite */}
              {!reduced && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
                  animate={{ rotate: opening ? 240 : 360 }}
                  transition={
                    opening
                      ? { duration: 1, ease: 'easeOut' }
                      : { duration: 22, repeat: Infinity, ease: 'linear' }
                  }
                >
                  {ORBIT.map((spark) => (
                    <motion.span
                      key={spark.angle}
                      className="absolute rounded-full"
                      style={{
                        width: spark.size,
                        height: spark.size,
                        background: spark.colour,
                        boxShadow: `0 0 10px ${spark.colour}`,
                        transform: `rotate(${spark.angle}deg) translateX(${spark.distance}px)`,
                      }}
                      animate={{ opacity: opening ? 0 : [0.35, 1, 0.35] }}
                      transition={{
                        duration: 2.6,
                        repeat: opening ? 0 : Infinity,
                        delay: spark.angle / 200,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </motion.div>
              )}

              <div className="relative h-[186px] w-[280px] sm:h-[226px] sm:w-[340px]">
                {/* Doublure */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#2a0f4d] to-[#1a0930] shadow-[0_30px_70px_rgba(139,92,246,.45)]" />

                {/* La lettre, qui monte */}
                <motion.div
                  className="absolute inset-x-4 top-3 z-10 rounded-md bg-gradient-to-b from-[#fdfbff] to-[#efe7ff] px-4 py-5 text-center shadow-[0_14px_40px_rgba(0,0,0,.5)]"
                  animate={opening ? { y: -104, scale: 1.06 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.28, ease: easeOutExpo }}
                >
                  <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-[#7c5bb5]">
                    {copy.eyebrow}
                  </p>
                  <p className="mt-2 font-display text-2xl leading-tight text-[#1a0930]">
                    {party.firstName}
                  </p>
                  <p className="font-display text-4xl leading-none text-[#8b2fb8]">{party.age}</p>
                </motion.div>

                {/* Face avant : le rectangle moins l'encoche du haut */}
                <div
                  className="absolute inset-0 z-20 rounded-lg bg-gradient-to-br from-[#3b1566] via-[#2a0f4d] to-[#1a0930]"
                  style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
                />

                {/* Rabat */}
                <motion.div
                  className="absolute inset-x-0 top-0 z-30 h-[55%] origin-top"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: opening ? -168 : 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
                >
                  <div
                    className="h-full w-full rounded-t-lg bg-gradient-to-b from-[#4a1b7d] to-[#33125c]"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      backfaceVisibility: 'hidden',
                      filter: 'drop-shadow(0 1.5px 0 rgba(255,215,110,.55))',
                    }}
                  />
                </motion.div>

                {/* Onde de choc du sceau */}
                {!reduced && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-[55%] z-40 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={opening ? { scale: 8, opacity: [0.95, 0] } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                )}

                {/* Halo qui respire tant que c'est fermé */}
                {!reduced && !opening && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-1/2 top-[55%] z-30 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40 blur-md sm:h-14 sm:w-14"
                    animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                {/* Sceau de cire */}
                <motion.div
                  className="absolute left-1/2 top-[55%] z-40 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-14 sm:w-14"
                  style={{
                    background:
                      'radial-gradient(circle at 34% 30%, #ffe9a8 0%, #ffd76e 35%, #d99b1f 75%, #8a5a08 100%)',
                    boxShadow: '0 6px 22px rgba(0,0,0,.55), inset 0 -2px 6px rgba(0,0,0,.35)',
                  }}
                  animate={opening ? { scale: 0, opacity: 0, rotate: 220 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.36, ease: 'easeIn' }}
                >
                  <span className="font-display text-xl text-[#6b3f04] sm:text-2xl">
                    {party.firstName.charAt(0)}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* LE PRÉNOM QUI S'ASSEMBLE                                            */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {showLetters && (
          <motion.div
            key="name"
            className="relative flex flex-col items-center"
            exit={{ scale: 1.35, opacity: 0, transition: { duration: 0.6, ease: 'easeIn' } }}
          >
            <div className="flex items-baseline justify-center">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block font-display text-[2.9rem] leading-none text-ink drop-shadow-[0_0_28px_rgba(217,70,239,.55)] sm:text-7xl"
                  initial={{
                    x: origins[index].x,
                    y: origins[index].y,
                    rotate: origins[index].rotate,
                    scale: 2.4,
                    opacity: 0,
                    filter: 'blur(10px)',
                  }}
                  animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={{
                    duration: 1.05,
                    delay: index * 0.075,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              className="mt-5 font-body text-sm uppercase tracking-[0.34em] text-aqua"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6, ease: easeOutExpo }}
            >
              {copy.introTagline}
            </motion.p>

            <motion.p
              className="mt-1 bg-clip-text font-display text-[5.5rem] leading-none text-transparent drop-shadow-[0_0_45px_rgba(217,70,239,.6)] sm:text-[7rem]"
              data-shine=""
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              {party.age}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite à toucher, tant que rien n'est commencé */}
      <AnimatePresence>
        {phase === 'sealed' && (
          <motion.p
            key="hint"
            className="mt-10 font-body text-sm uppercase tracking-[0.3em] text-aqua"
            initial={{ opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: [0.45, 1, 0.45] }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={
              reduced
                ? { duration: 0.3 }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {copy.envelopeHint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
