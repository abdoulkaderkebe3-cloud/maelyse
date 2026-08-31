import { motion } from 'motion/react'
import { invitation } from '../data/invitation'
import { useCountdown } from '../hooks/useCountdown'

const { copy } = invitation

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border border-line bg-surface/60 px-2 py-4 backdrop-blur sm:py-6">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="font-display text-3xl tabular-nums text-gold sm:text-5xl"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="mt-1 font-body text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const { days, hours, minutes, seconds, started } = useCountdown(invitation.dateISO)

  if (started) {
    return (
      <p className="text-center font-display text-2xl text-gold">{copy.countdownToday}</p>
    )
  }

  return (
    <div>
      <p className="mb-5 text-center font-body text-xs uppercase tracking-[0.28em] text-aqua">
        {copy.countdownTitle}
      </p>
      <div className="flex gap-2 sm:gap-3">
        <Tile value={days} label="days" />
        <Tile value={hours} label="hours" />
        <Tile value={minutes} label="min" />
        <Tile value={seconds} label="sec" />
      </div>
    </div>
  )
}
