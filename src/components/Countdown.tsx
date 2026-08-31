import { AnimatePresence, motion } from 'motion/react'
import { copy, party } from '../config'
import { useCountdown } from '../hooks/useCountdown'
import { useAnimateInView } from '../hooks/useAnimateInView'
import { Stagger, staggerItem, easeOutExpo } from './Reveal'

/**
 * Une tuile du compte à rebours, en tableau à volets.
 *
 * Le chiffre ne se contente pas de changer : le volet bascule vers l'avant,
 * l'ancien disparaît par le bas pendant que le nouveau arrive par le haut.
 * Un filet horizontal marque la charnière, comme sur les vrais tableaux de gare.
 */
function Tile({ value, label, anime }: { value: number; label: string; anime: boolean }) {
  const display = String(value).padStart(2, '0')

  return (
    <motion.div
      variants={anime ? staggerItem : undefined}
      className="relative flex flex-1 flex-col items-center overflow-hidden rounded-2xl border border-line bg-surface/80 px-2 py-4 sm:py-6"
    >
      {/*
        Pas de lueur qui balaie la tuile. Elle y était, et sur quatre tuiles côte
        à côte ça faisait quatre projecteurs qui passaient en permanence pendant
        qu'on essayait de lire quatre nombres. Le compte à rebours bouge déjà :
        les chiffres changent tout seuls.
      */}
      <span
        className="relative block h-9 w-full sm:h-14"
        style={{ perspective: '420px' }}
        aria-hidden="true"
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={display}
            className="absolute inset-0 flex items-center justify-center font-display text-3xl tabular-nums text-gold sm:text-5xl"
            style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
            initial={anime ? { rotateX: -88, opacity: 0 } : false}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 88, opacity: 0 }}
            transition={{ duration: 0.42, ease: easeOutExpo }}
          >
            {display}
          </motion.span>
        </AnimatePresence>

        {/*
          Pas de charnière tracée en travers du chiffre. Il y en avait une, un
          filet quasi noir censé imiter un tableau de gare : sur un chiffre doré
          en serif, ça ne se lit pas comme une charnière, ça se lit comme une
          barre noire qui coupe le chiffre en deux. La bascule du volet suffit
          à raconter le mécanisme.
        */}
      </span>

      {/* Lu par les lecteurs d'écran à la place de l'animation */}
      <span className="sr-only">{`${value} ${label}`}</span>

      <span className="relative mt-1 font-body text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
        {label}
      </span>
    </motion.div>
  )
}

export function Countdown() {
  const { ref, animate } = useAnimateInView<HTMLDivElement>()
  const { days, hours, minutes, seconds, started } = useCountdown(party.dateISO)

  if (started) {
    return <p className="text-center font-display text-2xl text-gold">{copy.countdownToday}</p>
  }

  return (
    <div ref={ref} className="relative">
      <p className="mb-5 text-center font-body text-xs uppercase tracking-[0.28em] text-aqua">
        {copy.countdownTitle}
      </p>

      <Stagger className="flex gap-2 sm:gap-3" gap={0.11}>
        <Tile value={days} label={copy.countdownUnits.days} anime={animate} />
        <Tile value={hours} label={copy.countdownUnits.hours} anime={animate} />
        <Tile value={minutes} label={copy.countdownUnits.minutes} anime={animate} />
        <Tile value={seconds} label={copy.countdownUnits.seconds} anime={animate} />
      </Stagger>
    </div>
  )
}
