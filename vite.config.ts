import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Charge la feuille de style principale sans bloquer le premier affichage.
 *
 * Pourquoi : une balise <link rel="stylesheet"> classique empêche le navigateur de
 * peindre quoi que ce soit tant qu'elle n'est pas arrivée. Sur une 4G moyenne, ça
 * repoussait de plus d'une demi-seconde l'enveloppe d'accueil, qui est pourtant
 * dessinée en style intégré dans le HTML et n'a besoin de rien pour s'afficher.
 *
 * Comment : la feuille est déclarée pour le média « print », donc non bloquante,
 * puis rebasculée sur « all » dès qu'elle est chargée. Le <noscript> garde le cas
 * sans JavaScript correct.
 */
function nonBlockingCss(): Plugin {
  return {
    name: 'non-blocking-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*)>/g,
        (_match, before, href, after) =>
          `<link rel="stylesheet"${before}href="${href}"${after} media="print" onload="this.media='all'">` +
          `<noscript><link rel="stylesheet" href="${href}"></noscript>`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), nonBlockingCss()],
})
