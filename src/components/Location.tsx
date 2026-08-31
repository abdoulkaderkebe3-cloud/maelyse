import { motion } from 'motion/react'
import { copy, mapsLink, venue } from '../config'
import { useAnimateInView } from '../hooks/useAnimateInView'

/**
 * Le lieu.
 *
 * RÈGLE ABSOLUE : les coordonnées GPS ne s'affichent JAMAIS à l'écran. Elles ne
 * vivent que dans le lien du bouton. Ce qu'un parent lit, c'est un nom et une
 * adresse en toutes lettres, celle qu'il peut dire à un chauffeur de taxi.
 * « 5.33108, -3.94457 » n'aide personne à venir.
 *
 * Il n'y a pas non plus de carte Google intégrée : elle serait recouverte d'un
 * lien donc inutilisable sur place, elle jure en gris au milieu d'une page nuit,
 * et c'est une intégration tierce qui télécharge ses propres scripts sur une
 * connexion qui est souvent une 4G moyenne. À la place, un repère dessiné, sans
 * rue inventée.
 */
export function Location() {
  const { ref, animate } = useAnimateInView<HTMLDivElement>()

  return (
    <div ref={ref} className="relative">
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.openMaps}
        className="group relative block overflow-hidden rounded-card border border-line bg-gradient-to-b from-[#1a0f33] to-[#0c0620] p-8 transition-colors duration-200 hover:border-aqua/50"
      >
        {/* Cercles concentriques : un repère, pas une carte */}
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
              /* Cercles fixes. Trois anneaux qui palpitaient en boucle sous
                 un repère qui flottait déjà, ça faisait beaucoup pour une carte
                 qui ne dit qu'une chose : c'est ici. */
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center py-4 text-center">
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="relative h-12 w-12"
            animate={animate ? { y: [0, -4, 0] } : undefined}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 22s7.5-6.1 7.5-12a7.5 7.5 0 1 0-15 0c0 5.9 7.5 12 7.5 12Z" fill="url(#pin)" />
            <circle cx="12" cy="10" r="2.8" fill="#1a0930" />
            <defs>
              <linearGradient id="pin" x1="12" y1="0" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffd76e" />
                <stop offset="1" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </motion.svg>

          <p className="mt-4 font-display text-2xl leading-tight text-ink sm:text-3xl">{venue.name}</p>
          {venue.address && (
            <p className="mt-1 max-w-xs text-balance font-body text-base text-muted">
              {venue.address}
            </p>
          )}
          {venue.hint && (
            <p className="mt-1 max-w-xs text-balance font-body text-sm text-muted/80">{venue.hint}</p>
          )}

          <span className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-aqua/40 px-5 font-body text-xs uppercase tracking-[0.2em] text-aqua transition-colors duration-200 group-hover:border-aqua group-hover:bg-aqua/10">
            {copy.locationHint}
          </span>
        </div>
      </a>

      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-gold px-6 font-body text-base font-semibold text-[#1f0b3a] transition-opacity duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
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
