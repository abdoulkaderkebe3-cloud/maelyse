import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAnimateInView } from '../hooks/useAnimateInView'
import { invitation } from '../data/invitation'
import { easeOutExpo } from './Reveal'

const { copy } = invitation
const CANDLES = Array.from({ length: invitation.age }, (_, index) => index)

async function wishConfetti() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({
    particleCount: 110,
    spread: 95,
    startVelocity: 38,
    origin: { y: 0.65 },
    colors: ['#ffd76e', '#d946ef', '#8b5cf6', '#22d3ee', '#ffffff'],
    disableForReducedMotion: true,
  })
}

/** Une bougie : mèche, flamme qui vacille, et un filet de fumée quand elle s'éteint. */
function Candle({
  lit,
  onBlow,
  index,
  anime,
}: {
  lit: boolean
  onBlow: () => void
  index: number
  anime: boolean
}) {
  const reduced = !anime

  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label={`${copy.cakeCandleAria} ${index + 1}`}
      className="group relative flex h-16 w-8 cursor-pointer flex-col items-center justify-end disabled:cursor-default"
    >
      {/* Fumée, seulement une fois la bougie éteinte */}
      <AnimatePresence>
        {!lit && !reduced && (
          <motion.span
            key="smoke"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-11 h-3 w-3 rounded-full bg-silver/40 blur-[3px]"
            initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -26, scale: 1.6 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Flamme */}
      <AnimatePresence>
        {lit && (
          <motion.span
            key="flame"
            aria-hidden="true"
            className="absolute bottom-10 h-4 w-[10px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[radial-gradient(circle_at_50%_75%,#fffbe8_0%,#ffd76e_45%,#ff8a3d_100%)] shadow-[0_0_14px_rgba(255,215,110,.85)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              reduced
                ? { scale: 1, opacity: 1 }
                : { scale: [1, 1.14, 0.95, 1], opacity: 1, y: [0, -1, 0.5, 0] }
            }
            exit={{ scale: 0, opacity: 0, y: -6 }}
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    scale: { duration: 0.9 + index * 0.07, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 1.1 + index * 0.05, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.25 },
                  }
            }
          />
        )}
      </AnimatePresence>

      {/* Mèche */}
      <span aria-hidden="true" className="absolute bottom-9 h-2 w-[2px] rounded bg-[#3b2a1a]" />

      {/* Corps rayé */}
      <span
        aria-hidden="true"
        className="h-9 w-[9px] rounded-sm shadow-[0_2px_6px_rgba(0,0,0,.5)]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #fdf7ff 0 5px, #d946ef 5px 10px)',
        }}
      />
    </button>
  )
}

/**
 * Le gâteau, avec ses neuf bougies à souffler.
 *
 * C'est le seul endroit du site où l'enfant a quelque chose à faire.
 * Une invitation qu'on regarde se lit une fois ; une invitation avec laquelle
 * on joue se remontre aux copains.
 */
export function Cake() {
  const { ref, animate, reduced } = useAnimateInView<HTMLDivElement>()
  const [lit, setLit] = useState<boolean[]>(() => CANDLES.map(() => true))
  const remaining = lit.filter(Boolean).length
  const done = remaining === 0

  function blow(index: number) {
    setLit((previous) => {
      if (!previous[index]) return previous
      const next = [...previous]
      next[index] = false
      if (next.every((candle) => !candle)) void wishConfetti()
      return next
    })
  }

  function blowAll() {
    if (done) return
    setLit(CANDLES.map(() => false))
    void wishConfetti()
  }

  function relight() {
    setLit(CANDLES.map(() => true))
  }

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="min-h-[3.5rem] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={done ? 'done' : 'todo'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <p className="font-display text-2xl text-gold sm:text-3xl">
              {done ? copy.cakeDone : copy.cakeTitle}
            </p>
            <p className="mt-1 font-body text-sm text-muted">
              {done ? copy.cakeDoneHint : copy.cakeHint}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Le gâteau */}
      <motion.div
        className="relative mt-6 w-[268px] select-none sm:w-[320px]"
        animate={reduced || !done ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      >
        {/* Lueur des bougies sur le gâteau, qui faiblit à mesure qu'on souffle */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-gold/25 blur-[40px]"
          animate={{ opacity: remaining / invitation.age }}
          transition={{ duration: 0.4 }}
        />

        {/* Bougies */}
        <div className="relative z-10 flex items-end justify-center gap-[3px] sm:gap-1.5">
          {CANDLES.map((index) => (
            <Candle
              key={index}
              index={index}
              lit={lit[index]}
              anime={animate}
              onBlow={() => blow(index)}
            />
          ))}
        </div>

        {/*
          Étage du haut. Le dessus est une ellipse claire, qui donne le volume :
          sans elle, un étage de gâteau se lit comme une simple boîte.
        */}
        <div className="relative z-10 mx-auto -mt-1 h-14 w-44 sm:h-16 sm:w-52">
          <div className="absolute inset-0 rounded-t-md bg-gradient-to-b from-[#fbf1ff] to-[#e0c2f7]" />
          <div className="absolute inset-x-0 -top-2 mx-auto h-4 rounded-[50%] bg-[#fdf8ff]" />

          {/* Coulures de glaçage, qui débordent sur l'étage du bas */}
          <div className="absolute inset-x-0 -bottom-3 flex justify-between px-2">
            {Array.from({ length: 8 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="block w-3 rounded-b-full bg-[#e0c2f7]"
                style={{ height: 8 + ((index * 5) % 10) }}
              />
            ))}
          </div>
        </div>

        {/* Étage du bas */}
        <div className="relative -mt-1 h-24 w-full sm:h-28">
          <div className="absolute inset-0 rounded-b-xl rounded-t-md bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#6b21a8] shadow-[0_20px_45px_rgba(139,92,246,.45)]" />

          {/* Perles dorées */}
          <div className="absolute inset-x-0 top-9 flex justify-center gap-3.5">
            {Array.from({ length: 7 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,110,.8)]"
              />
            ))}
          </div>

          {/* Coulures du bas, qui retombent sur le plat */}
          <div className="absolute inset-x-0 -bottom-2 flex justify-between px-3">
            {Array.from({ length: 11 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="block w-3 rounded-b-full bg-[#6b21a8]"
                style={{ height: 6 + ((index * 4) % 8) }}
              />
            ))}
          </div>
        </div>

        {/* Plat */}
        <div className="relative z-20 mx-auto mt-1 h-2.5 w-[108%] rounded-full bg-gradient-to-b from-[#e8edf5] via-silver/60 to-silver/10 shadow-[0_10px_25px_rgba(0,0,0,.5)]" />
      </motion.div>

      {/* Sorties clavier et gros doigts : la même action, en un seul bouton */}
      <button
        type="button"
        onClick={done ? relight : blowAll}
        className="mt-8 min-h-[48px] rounded-full border border-line bg-surface/80 px-6 font-body text-sm text-ink transition-colors duration-200 hover:border-aqua/60 hover:text-aqua"
      >
        {done ? copy.cakeReset : copy.cakeBlowAll}
      </button>
    </div>
  )
}
