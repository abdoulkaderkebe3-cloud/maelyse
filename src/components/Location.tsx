import { invitation, mapsEmbed, mapsLink } from '../data/invitation'

const { copy } = invitation

/**
 * Décision de Kader : pas de nom de lieu écrit.
 * La carte entière est cliquable et ouvre Google Maps, plus un bouton explicite
 * en dessous pour ceux qui ne devinent pas qu'une carte se touche.
 */
export function Location() {
  return (
    <div>
      <div className="relative overflow-hidden rounded-card border border-line shadow-[0_0_50px_rgba(139,92,246,.18)]">
        <iframe
          title="Party location on the map"
          src={mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_brightness(0.95)_contrast(0.88)_saturate(0.7)] sm:h-80"
        />

        {/* Recouvre la carte : un seul geste, un seul résultat. */}
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.openMaps}
          className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-night/80 via-transparent to-transparent p-4 transition-colors duration-200 hover:from-night/60"
        >
          <span className="rounded-full border border-aqua/40 bg-night/80 px-4 py-2 font-body text-xs text-aqua backdrop-blur">
            {copy.locationHint}
          </span>
        </a>
      </div>

      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-surface/60 px-6 font-body text-base font-medium text-ink backdrop-blur transition-colors duration-200 ease-out hover:border-aqua/60 hover:text-aqua"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
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
