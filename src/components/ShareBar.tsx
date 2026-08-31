import { useState } from 'react'
import { invitation } from '../data/invitation'

const { copy } = invitation

/** Partage natif sur téléphone, repli sur la copie du lien ailleurs. */
export function ShareBar() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    const shareData = {
      title: `${invitation.firstName} turns ${invitation.age}`,
      text: `${invitation.firstName} is turning ${invitation.age} on ${invitation.dayLabel}, ${invitation.dateLabel}. You are invited!`,
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
    <div className="text-center">
      <p className="font-body text-sm text-muted">{copy.shareTitle}</p>
      <button
        type="button"
        onClick={handleShare}
        className="mx-auto mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-surface/60 px-6 font-body text-base font-medium text-ink transition-colors duration-200 ease-out hover:border-aqua/60 hover:text-aqua"
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
