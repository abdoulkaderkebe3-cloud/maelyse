import { motion } from 'motion/react'
import { invitation } from '../data/invitation'
import { DiscoBall } from './NightSky'

const { copy } = invitation

/** Apparition en cascade des blocs du hero. */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  return (
    <header className="relative flex min-h-[100svh] flex-col items-center px-5 pb-10 pt-4 text-center">
      {/* Lecture en Z : repère en haut à gauche, décor en haut à droite */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center"
      >
        <motion.p
          variants={item}
          className="self-start font-body text-xs uppercase tracking-[0.32em] text-aqua"
        >
          {copy.eyebrow}
        </motion.p>

        <DiscoBall className="-mt-2" />

        <motion.h1
          variants={item}
          className="mt-8 font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl"
        >
          {invitation.fullName}
        </motion.h1>

        <motion.div variants={item} className="mt-6 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="font-body text-sm uppercase tracking-[0.28em] text-muted">
            {copy.turns}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
        </motion.div>

        <motion.p
          variants={item}
          className="mt-2 bg-gradient-to-b from-white via-gold to-neon bg-clip-text font-display text-[8rem] leading-[0.9] text-transparent drop-shadow-[0_0_45px_rgba(217,70,239,.55)] sm:text-[10rem]"
        >
          {invitation.age}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-xs text-balance font-body text-base leading-relaxed text-muted sm:max-w-sm"
        >
          {copy.tagline}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-8 font-display text-xl text-ink sm:text-2xl"
        >
          {invitation.dayLabel}
          <span className="mx-2 text-neon">·</span>
          {invitation.dateLabel}
        </motion.p>

        {/* CTA principal en bas du bloc, atteignable au pouce */}
        <motion.div variants={item} className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#rsvp"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
          >
            {copy.heroPrimary}
          </a>
          <a
            href="#location"
            className="flex min-h-[52px] items-center justify-center rounded-full border border-line bg-surface/60 px-8 font-body text-base font-medium text-ink backdrop-blur transition-colors duration-200 ease-out hover:border-aqua/60 hover:text-aqua"
          >
            {copy.heroSecondary}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="mt-10 h-10 w-px bg-gradient-to-b from-transparent via-muted/60 to-transparent"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </header>
  )
}
