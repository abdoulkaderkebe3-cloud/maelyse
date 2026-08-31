import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// Polices auto-hebergees : plus aucun appel a fonts.googleapis.com ni fonts.gstatic.com.
// Seul le sous-ensemble latin est telecharge, grace aux unicode-range du paquet.
import '@fontsource-variable/playfair-display/wght.css'
import '@fontsource-variable/inter/wght.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
