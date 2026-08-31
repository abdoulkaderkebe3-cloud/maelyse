import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { partyAudio } from '../lib/sound'
import type { SoundName } from '../lib/sound'

/**
 * ============================================================================
 *  ÉTAT PARTAGÉ : le son, et rien d'autre.
 * ============================================================================
 *
 * Ce contexte portait aussi le jeu des neuf étincelles : les étincelles
 * trouvées, la victoire, la progression retenue d'une visite à l'autre. Le jeu
 * a été retiré (D-031), et avec lui la moitié de ce fichier.
 *
 * Il ne reste que le son, qui a une vraie raison d'être partagé : le bouton qui
 * le coupe est en haut de l'écran, et les bruitages sont déclenchés depuis
 * l'ouverture et depuis le gâteau, aux deux bouts de la page.
 */

type PartyState = {
  muted: boolean
  toggleMuted: () => void
  /** Démarre le son. À appeler depuis un vrai geste de l'invité, jamais seul. */
  startAudio: () => void
  /** Joue un bruitage. Sans effet tant que le son n'a pas démarré. */
  playSound: (name: SoundName) => void
}

const Context = createContext<PartyState | null>(null)

export function PartyProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => partyAudio.muted)

  const playSound = useCallback((name: SoundName) => {
    partyAudio.play(name)
  }, [])

  const startAudio = useCallback(() => {
    partyAudio.unlock()
    if (!partyAudio.muted) partyAudio.startMusic()
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((previous) => {
      const next = !previous
      partyAudio.setMuted(next)
      if (next) partyAudio.stopMusic()
      else {
        partyAudio.unlock()
        partyAudio.startMusic()
      }
      return next
    })
  }, [])

  const value = useMemo<PartyState>(
    () => ({ muted, toggleMuted, startAudio, playSound }),
    [muted, toggleMuted, startAudio, playSound],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useParty() {
  const value = useContext(Context)
  if (!value) throw new Error('useParty doit être utilisé dans un PartyProvider')
  return value
}
