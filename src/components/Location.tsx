import { motion } from 'motion/react'
import { useAnimateInView } from '../hooks/useAnimateInView'
import { invitation, mapsLink } from '../data/invitation'

const { copy } = invitation
const { latitude, longitude, city } = invitation.location

/**
 * Carte du lieu.
 *
 * Il n'y a volontairement PAS de carte Google intégrée ici. Deux raisons, et une
 * troisième qui s'est révélée fausse, notée pour que personne ne la reprenne :
 *
 * 1. Le geste attendu est « je touche et j'arrive dans Google Maps ». La carte
 *    intégrée était recouverte d'un lien, donc impossible à manipuler sur place :
 *    elle ne servait qu'à faire joli, mal, en gris au milieu d'une page nuit.
 * 2. C'est une intégration tierce qui télécharge ses propres scripts et ses
 *    tuiles, sur une connexion qui est souvent une 4G moyenne.
 * 3. ⚠️ FAUSSE PISTE : j'avais conclu qu'elle divisait par deux les images par
 *    seconde de la page. C'était un artefact de mesure, l'onglet mesuré n'étant
 *    pas au premier plan. Vérifié ensuite proprement : 144 images par seconde
 *    avec ou sans elle. L'iframe ne coûtait rien en fluidité.
 *
 * À la place, un repère dessiné : aucune rue inventée, juste un point qui pulse,
 * les coordonnées réelles, et un lien qui ouvre la vraie carte.
 */
export function Location() {
  const { ref, animate } = useAnimateInView<HTMLDivElement>()
  const reduced = !animate

  return (
    <div ref={ref}>
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.openMaps}
        className="group relative block overflow-hidden rounded-card border border-line bg-gradient-to-b from-[#1a0f33] to-[#0c0620] p-8 shadow-[0_0_50px_rgba(139,92,246,.18)] transition-colors duration-200 hover:border-aqua/50"
      >
        {/* Cercles concentriques : un repère, pas une carte. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[0, 1, 2].map((ring) => (
            <motion.span
              key={ring}
              className="absolute left-1/2 top-1/2 rounded-full border border-aqua/25"
              style={{
                width: 120 + ring * 110,
                height: 120 + ring * 110,
                marginLeft: -(60 + ring * 55),
                marginTop: -(60 + ring * 55),
              }}
              animate={reduced ? undefined : { opacity: [0.15, 0.5, 0.15] }}
              transition={{
                duration: 3.2,
                delay: ring * 0.55,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center py-6 text-center">
          {/* Onde qui part du repère */}
          {!reduced && (
            <motion.span
              aria-hidden="true"
              className="absolute top-0 h-12 w-12 rounded-full bg-neon/30"
              animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* Le repère */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-12 w-12 drop-shadow-[0_0_18px_rgba(217,70,239,.7)]"
            animate={reduced ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M12 22s7.5-6.1 7.5-12a7.5 7.5 0 1 0-15 0c0 5.9 7.5 12 7.5 12Z"
              fill="url(#pin)"
            />
            <circle cx="12" cy="10" r="2.8" fill="#1a0930" />
            <defs>
              <linearGradient id="pin" x1="12" y1="0" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffd76e" />
                <stop offset="1" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </motion.svg>

          <p className="mt-4 font-display text-2xl text-ink">{city}</p>
          <p className="mt-1 font-body text-sm tabular-nums text-muted">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>

          <span className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-aqua/40 px-5 font-body text-xs uppercase tracking-[0.2em] text-aqua transition-colors duration-200 group-hover:border-aqua group-hover:bg-aqua/10">
            {copy.locationHint}
          </span>
        </div>
      </a>

      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon to-violet px-6 font-body text-base font-semibold text-white shadow-[0_0_28px_rgba(217,70,239,.35)] transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
        {copy.openMaps}
      </a>
    </div>
  )
}
