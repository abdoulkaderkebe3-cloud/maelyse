import { palette } from '../config'

/**
 * Injecte la palette du fichier de configuration dans les variables CSS que
 * Tailwind utilise.
 *
 * Pourquoi : Tailwind v4 fige les couleurs du bloc `@theme` au build. En les
 * réécrivant sur l'élément racine au démarrage, la palette redevient pilotable
 * depuis `config.ts`, ce qui permet de reprendre le site pour un autre client
 * sans toucher au CSS.
 *
 * Les noms doivent correspondre exactement à ceux déclarés dans index.css.
 */
export function applyPalette() {
  const root = document.documentElement
  const map: Record<string, string> = {
    '--color-night': palette.night,
    '--color-night-2': palette.night2,
    '--color-surface': palette.surface,
    '--color-line': palette.line,
    '--color-violet': palette.violet,
    '--color-neon': palette.neon,
    '--color-aqua': palette.aqua,
    '--color-gold': palette.gold,
    '--color-silver': palette.silver,
    '--color-ink': palette.ink,
    '--color-muted': palette.muted,
  }

  for (const [name, value] of Object.entries(map)) {
    root.style.setProperty(name, value)
  }

  // La couleur de la barre du navigateur sur mobile suit le fond de la page.
  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) themeColor.setAttribute('content', palette.night)
}
