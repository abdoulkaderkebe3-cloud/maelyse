import { motion } from 'motion/react'
import { plan } from '../config'
import { Stagger, staggerItem } from './Reveal'
import { Spark } from './Spark'

/**
 * Déroulé de la fête, sans horaires.
 * Volontairement : annoncer « 16h le gâteau » et ne pas le tenir, c'est dix
 * parents à la porte au mauvais moment.
 */
export function Plan() {
  if (plan.length === 0) return null

  return (
    <div className="relative">
      {/* Étincelle 5 sur 9, au bout du fil du programme */}
      <Spark id="plan" className="right-[8%] top-[52%]" />

      <Stagger className="relative flex flex-col gap-6 pl-8" gap={0.12}>
        {/* Le fil qui relie les étapes */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-aqua/50 via-violet/40 to-transparent"
        />

        {plan.map((step) => (
          <motion.div key={step.title} variants={staggerItem} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-8 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-aqua bg-night"
            />
            <h3 className="font-body text-xs uppercase tracking-[0.22em] text-aqua">{step.title}</h3>
            <p className="mt-1.5 font-body text-base leading-relaxed text-ink">{step.text}</p>
          </motion.div>
        ))}
      </Stagger>
    </div>
  )
}
