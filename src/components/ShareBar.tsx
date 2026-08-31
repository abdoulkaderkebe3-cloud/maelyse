import { useState } from 'react'
import { copy, party } from '../config'
import { useParty } from '../context/PartyContext'
import { Spark } from './Spark'

/** Partage natif sur téléphone, repli sur la copie du lien ailleurs. */
export function ShareBar() {
  const { playSound } = useParty()
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    playSound('pop')
    const url = window.location.href
    const shareData = {
      title: `${party.firstName} turns ${party.age}`,
      text: `${party.firstName} is turning ${party.age} on ${party.dayLabel}, ${party.dateLabel}. You are invited!`,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // Partage annulé par l'utilisateur : on ne fait rien de plus.
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      // Presse-papiers refusé : le lien reste visible dans la barre d'adresse.
    }
  }

  return (
    <div className="relative text-center">
      {/* Étincelle 7 sur 9 */}
      <Spark id="share" className="left-[12%] top-[10%]" />

      <p className="font-body text-sm text-muted">{copy.shareTitle}</p>
      <button
        type="button"
        onClick={handleShare}
        className="mx-auto mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-surface/80 px-6 font-body text-base font-medium text-ink transition-all duration-200 ease-out hover:border-aqua/60 hover:text-aqua active:scale-[0.97]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
        >
          <circle cx="18" cy="5" r="2.6" />
          <circle cx="6" cy="12" r="2.6" />
          <circle cx="18" cy="19" r="2.6" />
          <path d="m8.3 10.7 7.4-4.4M8.3 13.3l7.4 4.4" />
        </svg>
        {copied ? copy.shareCopied : copy.shareButton}
      </button>
    </div>
  )
}
