import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { game } from '../config'
import { partyAudio } from '../lib/sound'
import type { SoundName } from '../lib/sound'

/**
 * ============================================================================
 *  ÉTAT DE LA FÊTE : les étincelles trouvées, et le son.
 * ============================================================================
 *
 * Un seul endroit sait combien d'étincelles ont été trouvées, si la partie est
 * gagnée, et si le son est coupé. Tous les composants lisent ici.
 *
 * La progression est conservée d'une visite à l'autre : un enfant qui revient
 * le lendemain ne recommence pas de zéro, il lui reste juste celles qu'il n'a
 * pas trouvées.
 */

type PartyState = {
  /** Identifiants des étincelles déjà trouvées. */
  found: string[]
  /** Nombre trouvé, de 0 à `game.total`. */
  count: number
  total: number
  /** Vrai quand les neuf sont trouvées. */
  won: boolean
  /** Vrai le temps de l'écran de victoire. */
  showVictory: boolean

  /** Ramasse une étincelle. Ne compte jamais deux fois la même. */
  collect: (id: string) => void
  /** Ferme l'écran de victoire. */
  closeVictory: () => void
  /** Remet le jeu à zéro. */
  resetGame: () => void

  muted: boolean
  toggleMuted: () => void
  /** Démarre le son. À appeler depuis un vrai geste de l'invité. */
  startAudio: () => void
  /** Joue un bruitage. Sans effet tant que le son n'a pas démarré. */
  playSound: (name: SoundName) => void
}

const Context = createContext<PartyState | null>(null)

function readFound(): string[] {
  try {
    const raw = window.localStorage.getItem(game.storageKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    // Navigation privée ou stockage bloqué : la partie recommence, sans gravité.
    return []
  }
}

export function PartyProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<string[]>(readFound)
  const [showVictory, setShowVictory] = useState(false)
  const [muted, setMuted] = useState(() => partyAudio.muted)

  const count = found.length
  const won = count >= game.total

  useEffect(() => {
    try {
      window.localStorage.setItem(game.storageKey, JSON.stringify(found))
    } catch {
      // sans effet
    }
  }, [found])

  const playSound = useCallback((name: SoundName) => {
    partyAudio.play(name)
  }, [])

  const startAudio = useCallback(() => {
    partyAudio.unlock()
    if (!partyAudio.muted) partyAudio.startMusic()
  }, [])

  const collect = useCallback((id: string) => {
    setFound((previous) => {
      if (previous.includes(id)) return previous
      const next = [...previous, id]

      if (next.length >= game.total) {
        partyAudio.play('chime')
        // On laisse l'étincelle finir son éclat avant d'ouvrir la victoire.
        window.setTimeout(() => setShowVictory(true), 650)
      } else {
        partyAudio.play('spark')
      }

      return next
    })
  }, [])

  const closeVictory = useCallback(() => setShowVictory(false), [])

  const resetGame = useCallback(() => {
    setFound([])
    setShowVictory(false)
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
    () => ({
      found,
      count,
      total: game.total,
      won,
      showVictory,
      collect,
      closeVictory,
      resetGame,
      muted,
      toggleMuted,
      startAudio,
      playSound,
    }),
    [
      found,
      count,
      won,
      showVictory,
      collect,
      closeVictory,
      resetGame,
      muted,
      toggleMuted,
      startAudio,
      playSound,
    ],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useParty() {
  const value = useContext(Context)
  if (!value) throw new Error('useParty doit être utilisé dans un PartyProvider')
  return value
}
