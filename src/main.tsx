import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { applyPalette } from './lib/palette'

// Polices auto-hébergées : plus aucun appel à fonts.googleapis.com ni
// fonts.gstatic.com. Seul le sous-ensemble latin est téléchargé, grâce aux
// unicode-range du paquet.
import '@fontsource-variable/playfair-display/wght.css'
import '@fontsource-variable/inter/wght.css'
import './index.css'

// La palette de config.ts est injectée avant le premier rendu, pour qu'aucun
// écran n'apparaisse avec les couleurs par défaut du CSS.
applyPalette()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
