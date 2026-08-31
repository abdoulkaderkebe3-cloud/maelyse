import { useEffect, useState } from 'react'

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** true le jour même, une fois l'heure de début passée. */
  started: boolean
}

function computeRemaining(target: number): Countdown {
  const diff = target - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    started: false,
  }
}

/** Compte à rebours jusqu'à la date de la fête, mis à jour chaque seconde. */
export function useCountdown(targetISO: string): Countdown {
  const target = new Date(targetISO).getTime()
  const [remaining, setRemaining] = useState(() => computeRemaining(target))

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(computeRemaining(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  return remaining
}
