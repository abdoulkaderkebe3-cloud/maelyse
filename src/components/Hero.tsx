import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { invitation } from '../data/invitation'
import { DiscoBall } from './NightSky'
import { easeOutExpo } from './Reveal'

const { copy } = invitation

/** Apparition en cascade des blocs du hero, au chargement de la page. */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Parallaxe : le décor et le texte ne quittent pas l'écran à la même vitesse.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  const ballY = useTransform(smooth, [0, 1], [0, 180])
  const textY = useTransform(smooth, [0, 1], [0, 70])
  const fade = useTransform(smooth, [0.2, 0.95], [1, 0])
  const ageScale = useTransform(smooth, [0, 1], [1, 1.25])

  const parallax = reduced ? {} : { y: ballY }
  const textParallax = reduced ? {} : { y: textY, opacity: fade }

  return (
    <header
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-10 pt-4 text-center"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center"
      >
        <motion.p
          variants={item}
          style={textParallax}
          className="self-start font-body text-xs uppercase tracking-[0.32em] text-aqua"
        >
          {copy.eyebrow}
        </motion.p>

        <motion.div variants={item} style={parallax}>
          <DiscoBall className="-mt-2" />
        </motion.div>

        <motion.h1
          variants={item}
          style={textParallax}
          className="mt-8 font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl"
        >
          {invitation.fullName}
        </motion.h1>

        <motion.div
          variants={item}
          style={textParallax}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="font-body text-sm uppercase tracking-[0.28em] text-muted">
            {copy.turns}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
        </motion.div>

        {/* Le 9 grandit légèrement au défilement, comme s'il s'approchait. */}
        <motion.p
          variants={item}
          style={reduced ? {} : { scale: ageScale, opacity: fade }}
          className="mt-2 bg-gradient-to-b from-white via-gold to-neon bg-clip-text font-display text-[8rem] leading-[0.9] text-transparent drop-shadow-[0_0_45px_rgba(217,70,239,.55)] sm:text-[10rem]"
        >
          {invitation.age}
        </motion.p>

        <motion.p
          variants={item}
          style={textParallax}
          className="mt-6 max-w-xs text-balance font-body text-base leading-relaxed text-muted sm:max-w-sm"
        >
          {copy.tagline}
        </motion.p>

        <motion.p
          variants={item}
          style={textParallax}
          className="mt-8 font-display text-xl text-ink sm:text-2xl"
        >
          {invitation.dayLabel}
          <span className="mx-2 text-neon">·</span>
          {invitation.dateLabel}
        </motion.p>

        <motion.div
          variants={item}
          style={textParallax}
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <a
            href="#rsvp"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
          >
            {copy.heroPrimary}
          </a>
          <a
            href="#location"
            className="flex min-h-[52px] items-center justify-center rounded-full border border-line bg-surface/60 px-8 font-body text-base font-medium text-ink transition-colors duration-200 ease-out hover:border-aqua/60 hover:text-aqua"
          >
            {copy.heroSecondary}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={reduced ? {} : { opacity: fade }}
        className="mt-10 h-10 w-px bg-gradient-to-b from-transparent via-muted/60 to-transparent"
      >
        <motion.div
          className="h-full w-px bg-aqua"
          animate={reduced ? undefined : { y: ['-100%', '100%'], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </header>
  )
}
