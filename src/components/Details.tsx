import { motion } from 'motion/react'
import { copy, party, venue } from '../config'
import { Stagger, staggerItem } from './Reveal'

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-col gap-1 border-b border-line/60 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
    >
      <span className="min-w-28 font-body text-xs uppercase tracking-[0.22em] text-aqua">{label}</span>
      <span className={`font-body text-base leading-relaxed ${muted ? 'text-muted' : 'text-ink'}`}>
        {value}
      </span>
    </motion.div>
  )
}

/** Le bloc que les parents lisent vraiment. */
export function Details() {
  // Trois cas : une plage complète, une heure de début seule, ou rien.
  // Kader a choisi de ne pas annoncer d'heure de fin, c'est le cas du milieu.
  const time = !party.startTime
    ? copy.timeUnknown
    : party.endTime
      ? `${party.startTime} to ${party.endTime}`
      : copy.timeFrom.replace('{time}', party.startTime)

  return (
    <div className="relative">
      <Stagger className="rounded-card border border-line bg-surface/85 px-5 py-2 sm:px-8">
        <Row label={copy.whenLabel} value={`${party.dayLabel}, ${party.dateLabel}`} />
        <Row label={copy.timeLabel} value={time} muted={!party.startTime} />
        {/* L'adresse est facultative : sans elle, la ligne se réduit au nom du lieu. */}
        <Row
          label={copy.whereLabel}
          value={venue.address ? `${venue.name} — ${venue.address}` : venue.name}
        />
        <Row label={copy.dressCodeLabel} value={copy.dressCodeValue} />
        <Row label={copy.giftLabel} value={copy.giftValue} />
      </Stagger>
    </div>
  )
}
