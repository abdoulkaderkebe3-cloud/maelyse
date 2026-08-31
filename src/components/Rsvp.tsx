import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { invitation } from '../data/invitation'

const { copy } = invitation
const STORAGE_KEY = 'maelyse-rsvp-v1'

type Status = 'idle' | 'sending' | 'sent' | 'already' | 'error'

function celebrate() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#d946ef', '#8b5cf6', '#22d3ee', '#ffd76e', '#ffffff'],
    disableForReducedMotion: true,
  })
}

function buildMessage(childName: string, attending: boolean, adults: number) {
  const owner = `${invitation.firstName}'s ${invitation.age}th birthday party`
  if (!attending) {
    return `Hi! ${childName} will not be able to make it to ${owner}. Sending lots of love!`
  }
  const adultsPart =
    adults > 0
      ? ` ${adults} adult${adults > 1 ? 's' : ''} coming along.`
      : ' Coming on their own.'
  return `Hi! ${childName} will be at ${owner} on Saturday.${adultsPart}`
}

export function Rsvp() {
  const [childName, setChildName] = useState('')
  const [attending, setAttending] = useState(true)
  const [adults, setAdults] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [nameError, setNameError] = useState(false)

  // État « déjà répondu » : on ne redemande pas à quelqu'un qui a répondu.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) setStatus('already')
    } catch {
      // Navigation privée ou stockage bloqué : on laisse simplement le formulaire ouvert.
    }
  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const name = childName.trim()
    if (!name) {
      setNameError(true)
      return
    }
    setNameError(false)

    if (!invitation.whatsappNumber) {
      setStatus('error')
      return
    }

    setStatus('sending')
    const message = buildMessage(name, attending, adults)
    const url = `https://wa.me/${invitation.whatsappNumber}?text=${encodeURIComponent(message)}`

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, attending, adults }))
    } catch {
      // Le stockage n'est pas indispensable, la réponse part quand même.
    }

    window.open(url, '_blank', 'noopener,noreferrer')
    if (attending) celebrate()
    window.setTimeout(() => setStatus('sent'), 400)
  }

  function reset() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // sans effet
    }
    setStatus('idle')
  }

  const showForm = status === 'idle' || status === 'sending' || status === 'error'

  return (
    <div className="rounded-card border border-line bg-surface/50 p-5 backdrop-blur sm:p-8">
      <AnimatePresence mode="wait">
        {!showForm && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="py-6 text-center"
          >
            <p className="font-display text-3xl text-gold">
              {status === 'sent' ? copy.sentTitle : copy.alreadyTitle}
            </p>
            <p className="mx-auto mt-3 max-w-sm font-body text-base leading-relaxed text-muted">
              {status === 'sent' ? copy.sentBody : copy.alreadyBody}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 min-h-[44px] font-body text-sm text-aqua underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              {copy.sentAgain}
            </button>
          </motion.div>
        )}

        {showForm && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <p className="font-body text-sm leading-relaxed text-muted">{copy.rsvpIntro}</p>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="child-name"
                className="font-body text-xs uppercase tracking-[0.22em] text-aqua"
              >
                {copy.childNameLabel}
              </label>
              <input
                id="child-name"
                type="text"
                value={childName}
                onChange={(event) => {
                  setChildName(event.target.value)
                  if (nameError) setNameError(false)
                }}
                placeholder={copy.childNamePlaceholder}
                autoComplete="off"
                aria-invalid={nameError}
                aria-describedby={nameError ? 'child-name-error' : undefined}
                className={`min-h-[52px] rounded-xl border bg-night/60 px-4 font-body text-base text-ink placeholder:text-muted/50 transition-colors duration-200 focus:border-aqua focus:outline-none ${
                  nameError ? 'border-neon' : 'border-line'
                }`}
              />
              {nameError && (
                <p id="child-name-error" className="font-body text-sm text-neon">
                  {copy.nameRequired}
                </p>
              )}
            </div>

            <fieldset className="flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 font-body text-xs uppercase tracking-[0.22em] text-aqua">
                Coming?
              </legend>
              <div className="flex flex-col gap-2 sm:flex-row">
                {[
                  { value: true, label: copy.attendingYes },
                  { value: false, label: copy.attendingNo },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => setAttending(option.value)}
                    aria-pressed={attending === option.value}
                    className={`min-h-[52px] flex-1 rounded-xl border px-4 font-body text-base transition-all duration-200 ease-out ${
                      attending === option.value
                        ? 'border-neon bg-neon/15 text-ink shadow-[0_0_25px_rgba(217,70,239,.25)]'
                        : 'border-line bg-night/40 text-muted hover:border-violet/60'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {attending && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-body text-xs uppercase tracking-[0.22em] text-aqua">
                  {copy.adultsLabel}
                </span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setAdults(count)}
                      aria-pressed={adults === count}
                      aria-label={`${count} adults`}
                      className={`h-11 w-11 rounded-lg border font-body text-base transition-all duration-200 ${
                        adults === count
                          ? 'border-aqua bg-aqua/15 text-aqua'
                          : 'border-line bg-night/40 text-muted hover:border-violet/60'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {status === 'error' && (
              <p role="alert" className="font-body text-sm text-gold">
                {copy.errorNoNumber}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="min-h-[54px] rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {status === 'sending' ? copy.sending : attending ? copy.submitYes : copy.submitNo}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
