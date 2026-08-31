import { invitation } from '../data/invitation'

const { copy } = invitation

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/60 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="min-w-28 font-body text-xs uppercase tracking-[0.22em] text-aqua">
        {label}
      </span>
      <span className={`font-body text-base leading-relaxed ${muted ? 'text-muted' : 'text-ink'}`}>
        {value}
      </span>
    </div>
  )
}

export function Details() {
  const time =
    invitation.startTime && invitation.endTime
      ? `${invitation.startTime} to ${invitation.endTime}`
      : invitation.startTime ?? copy.timeUnknown

  return (
    <div className="rounded-card border border-line bg-surface/50 px-5 py-2 backdrop-blur sm:px-8">
      <Row label={copy.whenLabel} value={`${invitation.dayLabel}, ${invitation.dateLabel}`} />
      <Row label={copy.timeLabel} value={time} muted={!invitation.startTime} />
      <Row label={copy.whereLabel} value={copy.whereValue} />
      <Row label={copy.parentsLabel} value={copy.parentsValue} />
    </div>
  )
}
