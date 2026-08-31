import { AnimatePresence, motion } from 'motion/react'
import { invitation } from '../data/invitation'
import { useCountdown } from '../hooks/useCountdown'
import { Stagger, staggerItem, easeOutExpo } from './Reveal'
import { useAnimateInView } from '../hooks/useAnimateInView'

const { copy } = invitation

function Tile({ value, label, anime }: { value: number; label: string; anime: boolean }) {
  const reduced = !anime

  return (
    <motion.div
      variants={reduced ? undefined : staggerItem}
      className="relative flex flex-1 flex-col items-center overflow-hidden rounded-2xl border border-line bg-surface/80 px-2 py-4 sm:py-6"
    >
      {/* Lueur qui balaie la tuile, comme un projecteur qui passe. */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-violet/20 to-transparent"
          animate={{ x: ['-120%', '260%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        />
      )}

      {/*
        Compteur à rouleau : l'ancien chiffre sort par le haut pendant que le nouveau
        entre par le bas. Les deux sont posés en absolu au même endroit, sinon la case
        se vide le temps de la transition, ce qui se voyait sur les secondes.
      */}
      <span className="relative block h-9 w-full overflow-hidden sm:h-14">
        <AnimatePresence initial={false}>
          <motion.span
            key={value}
            initial={reduced ? false : { y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="absolute inset-0 flex items-center justify-center font-display text-3xl tabular-nums text-gold sm:text-5xl"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="relative mt-1 font-body text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
        {label}
      </span>
    </motion.div>
  )
}

export function Countdown() {
  const { ref, animate } = useAnimateInView<HTMLDivElement>()
  const { days, hours, minutes, seconds, started } = useCountdown(invitation.dateISO)

  if (started) {
    return <p className="text-center font-display text-2xl text-gold">{copy.countdownToday}</p>
  }

  return (
    <div ref={ref}>
      <p className="mb-5 text-center font-body text-xs uppercase tracking-[0.28em] text-aqua">
        {copy.countdownTitle}
      </p>
      <Stagger className="flex gap-2 sm:gap-3" gap={0.11}>
        <Tile value={days} label="days" anime={animate} />
        <Tile value={hours} label="hours" anime={animate} />
        <Tile value={minutes} label="min" anime={animate} />
        <Tile value={seconds} label="sec" anime={animate} />
      </Stagger>
    </div>
  )
}
