import { motion, useReducedMotion } from 'motion/react'
import { invitation } from '../data/invitation'
import { Stagger, staggerItem } from './Reveal'

/**
 * Déroulé de la fête, sans horaires.
 * Volontairement : annoncer « 16h gâteau » et ne pas le tenir est le meilleur moyen
 * d'avoir dix parents à la porte au mauvais moment.
 */
export function Plan() {
  const reduced = useReducedMotion()
  // Typage élargi pour que vider le tableau dans invitation.ts reste possible.
  const steps: readonly { title: string; text: string }[] = invitation.plan

  if (steps.length === 0) return null

  return (
    <Stagger className="relative flex flex-col gap-6 pl-8" gap={0.12}>
      {/* Le fil qui relie les étapes */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-aqua/50 via-violet/40 to-transparent"
      />

      {steps.map((step) => (
        <motion.div key={step.title} variants={reduced ? undefined : staggerItem} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-8 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-aqua bg-night"
          />
          <h3 className="font-body text-xs uppercase tracking-[0.22em] text-aqua">{step.title}</h3>
          <p className="mt-1.5 font-body text-base leading-relaxed text-ink">{step.text}</p>
        </motion.div>
      ))}
    </Stagger>
  )
}
