import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { copy, party } from '../config'
import { DiscoBall } from './DiscoBall'
import { Spark } from './Spark'
import { easeOutExpo } from './Reveal'

/** Entrée en cascade des blocs, au premier affichage. */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}
const letters = { hidden: {}, show: { transition: { staggerChildren: 0.045 } } }
const letter3d = {
  hidden: { opacity: 0, y: 26, rotateX: -75 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.65, ease: easeOutExpo } },
}

/**
 * Écran d'accueil.
 *
 * Deux profondeurs se combinent :
 * - au DÉFILEMENT, le décor et le texte quittent l'écran à des vitesses
 *   différentes ;
 * - au MOUVEMENT DU DOIGT ou de la souris, la boule et le grand chiffre se
 *   décalent légèrement, ce qui donne la sensation d'un relief réel plutôt
 *   que d'une image plate.
 *
 * L'amplitude est volontairement faible : au-delà de quelques pixels, l'effet
 * cesse d'être élégant et devient un gadget qui donne le tournis.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // --- Profondeur au défilement -------------------------------------------
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const ballY = useTransform(smooth, [0, 1], [0, 180])
  const textY = useTransform(smooth, [0, 1], [0, 70])
  const fade = useTransform(smooth, [0.2, 0.95], [1, 0])
  const ageScale = useTransform(smooth, [0, 1], [1, 1.25])

  // --- Profondeur au mouvement du pointeur --------------------------------
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.6 })
  const tiltY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.6 })

  const ballShiftX = useTransform(tiltX, [-1, 1], [18, -18])
  const ballShiftY = useTransform(tiltY, [-1, 1], [10, -10])
  const ageShiftX = useTransform(tiltX, [-1, 1], [-24, 24])
  const nameShiftX = useTransform(tiltX, [-1, 1], [-10, 10])

  useEffect(() => {
    if (reduced) return
    const element = ref.current
    if (!element) return

    function onPointerMove(event: PointerEvent) {
      const rect = element!.getBoundingClientRect()
      // Ramené entre -1 et 1, l'origine étant le centre du hero.
      pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
      pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }

    function recenter() {
      pointerX.set(0)
      pointerY.set(0)
    }

    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerleave', recenter)
    element.addEventListener('pointercancel', recenter)
    return () => {
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerleave', recenter)
      element.removeEventListener('pointercancel', recenter)
    }
  }, [pointerX, pointerY, reduced])

  const decorStyle = reduced ? {} : { y: ballY, x: ballShiftX, translateY: ballShiftY }
  const textStyle = reduced ? {} : { y: textY, opacity: fade }
  const nameStyle = reduced ? {} : { y: textY, opacity: fade, x: nameShiftX }

  return (
    <header
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-10 pt-4 text-center"
    >
      {/* Étincelle 1 sur 9, flottant dans le ciel du hero */}
      <Spark id="sky" className="left-[14%] top-[20%]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center"
      >
        {/*
          Centrée et non calée à gauche : le bouton du son et le compteur
          d'étincelles occupent les deux coins hauts de l'écran, et une accroche
          calée à gauche passait dessous.
        */}
        <motion.p
          variants={item}
          style={textStyle}
          className="mt-8 font-body text-xs uppercase tracking-[0.32em] text-aqua sm:mt-4"
        >
          {copy.eyebrow}
        </motion.p>

        <motion.div variants={item} style={decorStyle}>
          <DiscoBall className="-mt-2" />
        </motion.div>

        <motion.h1
          variants={letters}
          style={nameStyle}
          className="mt-8 font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl"
          aria-label={party.fullName}
        >
          {party.fullName.split(' ').map((word, wordIndex) => (
            <span key={wordIndex} aria-hidden="true" className="inline-block">
              {word.split('').map((character, characterIndex) => (
                <motion.span key={characterIndex} variants={letter3d} className="inline-block">
                  {character}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={item}
          style={textStyle}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="font-body text-sm uppercase tracking-[0.28em] text-muted">
            {copy.turns}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
        </motion.div>

        {/* Le grand chiffre : il grandit au défilement et se décale au pointeur */}
        <motion.p
          variants={item}
          style={reduced ? {} : { scale: ageScale, opacity: fade, x: ageShiftX }}
          className="mt-2 animate-shimmer bg-clip-text font-display text-[8rem] leading-[0.9] text-transparent drop-shadow-[0_0_50px_rgba(217,70,239,.6)] sm:text-[10rem]"
          data-shine=""
        >
          {party.age}
        </motion.p>

        <motion.p
          variants={item}
          style={textStyle}
          className="mt-6 max-w-xs text-balance font-body text-base leading-relaxed text-silver sm:max-w-sm"
        >
          {copy.tagline}
        </motion.p>

        <motion.p
          variants={item}
          style={textStyle}
          className="mt-8 font-display text-xl text-ink sm:text-2xl"
        >
          {party.dayLabel}
          <span className="mx-2 text-neon">·</span>
          {party.dateLabel}
        </motion.p>

        <motion.div
          variants={item}
          style={textStyle}
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          {/*
            Un seul bouton depuis le retrait du formulaire de réponse : la seule
            chose qu'un parent a réellement à faire sur cette page, c'est trouver
            le lieu. Deux boutons dont un sans but affaibliraient les deux.
          */}
          <a
            href="#location"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.97]"
          >
            {copy.heroPrimary}
          </a>
        </motion.div>
      </motion.div>

      {/* Repère de défilement : une lueur qui descend le long d'un filet */}
      <motion.div
        aria-hidden="true"
        style={reduced ? {} : { opacity: fade }}
        className="mt-10 h-10 w-px overflow-hidden bg-gradient-to-b from-transparent via-muted/50 to-transparent"
      >
        <motion.div
          className="h-3 w-px bg-aqua"
          animate={reduced ? undefined : { y: [-12, 40], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </header>
  )
}
