import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { invitation } from '../data/invitation'
import { easeOutExpo } from './Reveal'

const { copy } = invitation

type Props = { onOpened: () => void }
type Phase = 'arriving' | 'idle' | 'opening' | 'entering'

/** Étincelles en orbite autour de l'enveloppe. Cinq points, un seul conteneur qui tourne. */
const SPARKS = [
  { angle: 0, distance: 132, size: 5, colour: '#ffd76e' },
  { angle: 72, distance: 118, size: 3, colour: '#22d3ee' },
  { angle: 144, distance: 140, size: 4, colour: '#d946ef' },
  { angle: 216, distance: 112, size: 3, colour: '#ffffff' },
  { angle: 288, distance: 136, size: 4, colour: '#8b5cf6' },
]

async function burst() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({
    particleCount: 70,
    spread: 100,
    startVelocity: 42,
    origin: { y: 0.48 },
    colors: ['#ffd76e', '#d946ef', '#8b5cf6', '#22d3ee', '#ffffff'],
    disableForReducedMotion: true,
  })
}

/**
 * Ouverture du site.
 *
 * L'enveloppe arrive de loin en tournant, flotte cachetée, puis à l'appui :
 * le sceau éclate en onde de choc, le rabat bascule, la lettre monte, et elle
 * grandit jusqu'à remplir l'écran, si bien qu'on entre littéralement dans la
 * lettre pour arriver sur l'invitation.
 *
 * Règle de D-003 : tout ça ne se joue qu'à la première visite (voir App), et
 * ne retarde jamais l'accès à l'information.
 */
export function Envelope({ onOpened }: Props) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('arriving')

  // La page derrière ne défile pas tant que l'enveloppe est là.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Fin de l'arrivée : l'enveloppe se met à flotter et devient touchable.
  useEffect(() => {
    if (reduced) {
      setPhase('idle')
      return
    }
    const timer = window.setTimeout(() => setPhase('idle'), 1250)
    return () => window.clearTimeout(timer)
  }, [reduced])

  function open() {
    if (phase !== 'idle') return

    if (reduced) {
      onOpened()
      return
    }

    setPhase('opening')
    void burst()
    // La lettre grandit et absorbe l'écran, puis on passe la main à l'invitation.
    window.setTimeout(() => setPhase('entering'), 1050)
    window.setTimeout(onOpened, 2000)
  }

  const opening = phase === 'opening' || phase === 'entering'
  const entering = phase === 'entering'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: entering ? 0 : 1 }}
      transition={{ duration: 0.5, delay: entering ? 0.45 : 0, ease: 'easeIn' }}
    >
      {/* Voile sombre : le ciel étoilé et les ballons restent visibles derrière */}
      <div className="absolute inset-0 -z-10 bg-night/45" />

      {/* Éclair de lumière au moment où l'on entre dans la lettre */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: entering ? [0, 0.85, 0] : 0 }}
        transition={{ duration: 0.7, times: [0, 0.35, 1], ease: 'easeOut' }}
      />

      <motion.button
        type="button"
        onClick={open}
        aria-label={copy.envelopeAria}
        className="group relative cursor-pointer rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aqua"
        style={{ perspective: 1400 }}
        // Arrivée : l'enveloppe vient de loin, de biais, et se redresse.
        initial={reduced ? false : { scale: 0.15, rotateX: 52, rotateY: -38, y: 140, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 62, damping: 14, mass: 1.1 }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
          // Flottement, uniquement pendant l'attente.
          animate={
            reduced || opening
              ? { y: 0, rotateZ: 0 }
              : { y: [0, -9, 0], rotateZ: [-1.2, 1.2, -1.2] }
          }
          transition={{ duration: 6, repeat: opening ? 0 : Infinity, ease: 'easeInOut' }}
        >
          {/* Étincelles en orbite */}
          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
              animate={{ rotate: opening ? 220 : 360 }}
              transition={
                opening
                  ? { duration: 1, ease: 'easeOut' }
                  : { duration: 22, repeat: Infinity, ease: 'linear' }
              }
            >
              {SPARKS.map((spark) => (
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
            {/* Doublure, visible par l'ouverture */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#2a0f4d] to-[#1a0930] shadow-[0_30px_70px_rgba(139,92,246,.45)]" />

            {/*
              La lettre. Elle monte, puis grandit jusqu'à remplir l'écran :
              c'est elle qui devient l'invitation.
            */}
            <motion.div
              className="absolute inset-x-4 top-3 z-10 origin-center rounded-md bg-gradient-to-b from-[#fdfbff] to-[#efe7ff] px-4 py-5 text-center shadow-[0_14px_40px_rgba(0,0,0,.5)]"
              initial={{ y: 0, scale: 1 }}
              animate={
                entering
                  ? { y: -70, scale: 14, opacity: 0 }
                  : opening
                    ? { y: -104, scale: 1.06, opacity: 1 }
                    : { y: 0, scale: 1, opacity: 1 }
              }
              transition={
                entering
                  ? { duration: 0.85, ease: [0.7, 0, 0.84, 0] }
                  : { duration: 0.75, delay: 0.3, ease: easeOutExpo }
              }
            >
              <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-[#7c5bb5]">
                {copy.eyebrow}
              </p>
              <p className="mt-2 font-display text-2xl leading-tight text-[#1a0930]">
                {invitation.firstName}
              </p>
              <p className="font-display text-4xl leading-none text-[#8b2fb8]">{invitation.age}</p>
            </motion.div>

            {/* Face avant : le rectangle moins l'encoche du haut */}
            <div
              className="absolute inset-0 z-20 rounded-lg bg-gradient-to-br from-[#3b1566] via-[#2a0f4d] to-[#1a0930]"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)' }}
            />

            {/* Rabat, qui bascule vers l'arrière */}
            <motion.div
              className="absolute inset-x-0 top-0 z-30 h-[55%] origin-top"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: opening ? (reduced ? 0 : -168) : 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: easeOutExpo }}
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

            {/* Onde de choc au moment où le sceau cède */}
            {!reduced && (
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-[55%] z-40 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
                initial={{ scale: 0, opacity: 0 }}
                animate={opening ? { scale: 7, opacity: [0.9, 0] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              />
            )}

            {/* Halo qui respire derrière le sceau, tant qu'il est fermé */}
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
              animate={opening ? { scale: 0, opacity: 0, rotate: 200 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeIn' }}
            >
              <span className="font-display text-xl text-[#6b3f04] sm:text-2xl">
                {invitation.firstName.charAt(0)}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      <motion.p
        className="mt-10 font-body text-sm uppercase tracking-[0.3em] text-aqua"
        initial={{ opacity: 0 }}
        animate={
          opening
            ? { opacity: 0 }
            : phase === 'idle'
              ? reduced
                ? { opacity: 1 }
                : { opacity: [0.45, 1, 0.45] }
              : { opacity: 0 }
        }
        transition={
          phase === 'idle' && !opening && !reduced
            ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        {copy.envelopeHint}
      </motion.p>
    </motion.div>
  )
}
