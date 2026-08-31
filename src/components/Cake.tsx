import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { copy, game, party } from '../config'
import { useParty } from '../context/PartyContext'
import { useAnimateInView } from '../hooks/useAnimateInView'
import { easeOutExpo } from './Reveal'

const CANDLES = Array.from({ length: party.age }, (_, index) => index)

async function wishConfetti() {
  const { default: confetti } = await import('canvas-confetti')
  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 40,
    origin: { y: 0.66 },
    colors: ['#ffd76e', '#d946ef', '#8b5cf6', '#22d3ee', '#ffffff'],
    disableForReducedMotion: true,
  })
}

/**
 * Une bougie : mèche, flamme qui vacille, et un filet de fumée quand elle s'éteint.
 *
 * La zone tactile fait 32 par 64 pixels alors que la flamme en fait 10 de large :
 * un enfant qui vise à peu près souffle quand même sa bougie.
 */
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
  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label={`${copy.cakeCandleAria} ${index + 1}`}
      className="group relative flex h-16 w-8 cursor-pointer flex-col items-center justify-end transition-transform duration-150 active:scale-90 disabled:cursor-default disabled:active:scale-100"
    >
      {/* Fumée, une fois la bougie éteinte */}
      <AnimatePresence>
        {!lit && anime && (
          <motion.span
            key="smoke"
            aria-hidden="true"
            className="pointer-events-none absolute bottom-11 h-3 w-3 rounded-full bg-silver/45 blur-[3px]"
            initial={{ opacity: 0.75, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -28, scale: 1.7 }}
            transition={{ duration: 1.15, ease: 'easeOut' }}
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
              anime
                ? { scale: [1, 1.14, 0.95, 1], opacity: 1, y: [0, -1, 0.5, 0] }
                : { scale: 1, opacity: 1 }
            }
            exit={{ scale: 0, opacity: 0, y: -8 }}
            transition={
              anime
                ? {
                    scale: { duration: 0.9 + index * 0.07, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 1.1 + index * 0.05, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 0.25 },
                  }
                : { duration: 0.2 }
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
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fdf7ff 0 5px, #d946ef 5px 10px)' }}
      />
    </button>
  )
}

/**
 * Le gâteau, avec ses neuf bougies à souffler.
 *
 * C'est le seul endroit du site où l'enfant a quelque chose à faire, et c'est
 * aussi la NEUVIÈME étincelle du jeu : celle-là ne se trouve pas en cherchant,
 * elle se gagne en soufflant toutes les bougies. Sans elle, impossible de
 * terminer, ce qui garantit que tout le monde passe par le gâteau.
 */
export function Cake() {
  const { ref, animate, reduced } = useAnimateInView<HTMLDivElement>()
  const { collect, found, playSound } = useParty()
  const [lit, setLit] = useState<boolean[]>(() => CANDLES.map(() => true))

  const remaining = lit.filter(Boolean).length
  const done = remaining === 0
  const sparkEarned = found.includes(game.cakeId)

  function finish() {
    void wishConfetti()
    // La neuvième étincelle est décernée ici. `collect` ignore les doublons.
    collect(game.cakeId)
  }

  function blow(index: number) {
    setLit((previous) => {
      if (!previous[index]) return previous
      const next = [...previous]
      next[index] = false
      playSound('puff')
      if (next.every((candle) => !candle)) finish()
      return next
    })
  }

  function blowAll() {
    if (done) return
    setLit(CANDLES.map(() => false))
    playSound('puff')
    finish()
  }

  function relight() {
    setLit(CANDLES.map(() => true))
    playSound('tap')
  }

  return (
    <div ref={ref} className="relative flex flex-col items-center">
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

      <motion.div
        className="relative mt-6 w-[320px] select-none sm:w-[360px]"
        animate={reduced || !done ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      >
        {/* Lueur des bougies, qui faiblit à mesure qu'on souffle */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-gold/25 blur-[40px]"
          animate={{ opacity: remaining / party.age }}
          transition={{ duration: 0.4 }}
        />

        {/*
          Bougies.

          La largeur de cette rangée est CONTRAINTE et volontairement plus
          étroite que l'étage du haut : sans elle, les neuf boutons prennent
          toute la largeur du gâteau et les bougies des extrémités se plantent
          dans le vide, à côté du glaçage. Les boutons se rétractent d'eux-mêmes
          pour tenir dedans, chacun garde une zone tactile d'environ 24 par 64
          pixels, et le bouton « Blow them all out » reste la sortie pour les
          gros doigts et le clavier.
        */}
        <div className="relative z-10 mx-auto flex w-[220px] items-end justify-center gap-[2px] sm:w-[250px] sm:gap-1">
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
          Étage du haut. L'ellipse claire donne le volume.

          Sa largeur est prise en étau, et les deux bornes comptent : plus large
          que la rangée de bougies, sinon les bougies des bords se plantent à
          côté du glaçage ; nettement plus étroit que l'étage du bas, sinon les
          deux étages se confondent et l'ensemble ne lit plus comme un gâteau
          mais comme deux boîtes empilées.
        */}
        <div className="relative z-10 mx-auto -mt-1 h-14 w-[236px] sm:h-16 sm:w-[270px]">
          <div className="absolute inset-0 rounded-t-md bg-gradient-to-b from-[#fbf1ff] to-[#e0c2f7]" />
          <div className="absolute inset-x-0 -top-2 mx-auto h-4 rounded-[50%] bg-[#fdf8ff]" />
          <div className="absolute inset-x-0 -bottom-3 flex justify-between px-2">
            {Array.from({ length: 9 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="block w-3 rounded-b-full bg-[#e0c2f7]"
                style={{ height: 7 + ((index * 7) % 13) }}
              />
            ))}
          </div>
        </div>

        {/* Étage du bas */}
        <div className="relative -mt-1 h-24 w-full sm:h-28">
          <div className="absolute inset-0 rounded-b-xl rounded-t-md bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#6b21a8] shadow-[0_20px_45px_rgba(139,92,246,.45)]" />
          <div className="absolute inset-x-0 top-9 flex justify-center gap-3.5">
            {Array.from({ length: 7 }, (_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,110,.8)]"
              />
            ))}
          </div>
          {/*
            Pas de coulures sous cet étage. Elles existaient, et elles formaient
            une rangée de dents sombres suspendues au-dessus du plat : un vrai
            gâteau ne dégouline pas de son étage du bas sur le plat, le glaçage
            coule du haut vers le bas.
          */}
        </div>

        {/*
          Plat. Centré par décalage et non par `mx-auto` : il est plus large que
          le gâteau, et des marges automatiques ne peuvent pas devenir négatives.
          Avec `mx-auto` il restait collé à gauche et ne dépassait qu'à droite.
        */}
        <div className="relative left-1/2 z-20 mt-1 h-2.5 w-[108%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#e8edf5] via-silver/60 to-silver/10 shadow-[0_10px_25px_rgba(0,0,0,.5)]" />
      </motion.div>

      {/* Récompense : l'étincelle gagnée sur le gâteau */}
      <AnimatePresence>
        {sparkEarned && (
          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="mt-6 flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 font-body text-sm text-gold"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M12 2.6l2.1 6.1 6.4.2-5.1 3.9 1.8 6.2L12 15.3l-5.2 3.7 1.8-6.2-5.1-3.9 6.4-.2z"
                fill="currentColor"
              />
            </svg>
            {copy.sparkFirst}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Sortie clavier et gros doigts : la même action en un seul bouton */}
      <button
        type="button"
        onClick={done ? relight : blowAll}
        className="mt-6 min-h-[48px] rounded-full border border-line bg-surface/80 px-6 font-body text-sm text-ink transition-colors duration-200 hover:border-aqua/60 hover:text-aqua"
      >
        {done ? copy.cakeReset : copy.cakeBlowAll}
      </button>
    </div>
  )
}
