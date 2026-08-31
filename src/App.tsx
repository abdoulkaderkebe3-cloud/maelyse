import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { invitation } from './data/invitation'
import { Sky } from './components/Sky'
import { Envelope } from './components/Envelope'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Section } from './components/Section'
import { Reveal } from './components/Reveal'
import { Countdown } from './components/Countdown'
import { Cake } from './components/Cake'
import { Details } from './components/Details'
import { Plan } from './components/Plan'
import { Location } from './components/Location'
import { Rsvp } from './components/Rsvp'
import { ShareBar } from './components/ShareBar'
import { StickyCta } from './components/StickyCta'
import { ScrollProgress } from './components/ScrollProgress'

const { copy } = invitation
const OPENED_KEY = 'maelyse-envelope-opened-v1'

/** L'enveloppe ne se montre qu'à la première visite (voir D-003 et D-013). */
function hasOpenedBefore() {
  try {
    return window.localStorage.getItem(OPENED_KEY) === '1'
  } catch {
    // Stockage bloqué : on montre l'enveloppe, c'est le comportement le plus joli.
    return false
  }
}

export default function App() {
  const [envelopeDone, setEnvelopeDone] = useState(hasOpenedBefore)

  // L'invitation commence toujours en haut, quelle que soit la position
  // de défilement restaurée par le navigateur.
  useEffect(() => {
    if (!envelopeDone) window.scrollTo(0, 0)
  }, [envelopeDone])

  const handleOpened = useCallback(() => {
    try {
      window.localStorage.setItem(OPENED_KEY, '1')
    } catch {
      // Sans effet : l'enveloppe se remontrera à la prochaine visite, sans gravité.
    }
    setEnvelopeDone(true)
  }, [])

  return (
    <>
      <ScrollProgress />
      <Sky />

      <AnimatePresence>
        {!envelopeDone && <Envelope key="envelope" onOpened={handleOpened} />}
      </AnimatePresence>

      {/*
        Tant que l'enveloppe est là, la page est masquée mais garde sa place :
        le ciel étoilé et les ballons continuent de vivre derrière l'enveloppe,
        sans que le contenu de l'invitation transparaisse au travers.
      */}
      <main
        className={`relative transition-opacity duration-500 ${envelopeDone ? 'opacity-100' : 'invisible opacity-0'}`}
        aria-hidden={!envelopeDone}
      >
        <Hero />

        <Marquee />

        <Section>
          <Countdown />
        </Section>

        {/* Le seul moment du site où l'enfant a quelque chose à faire */}
        <Section>
          <Reveal direction="scale">
            <Cake />
          </Reveal>
        </Section>

        <Section title={copy.detailsTitle}>
          <Details />
        </Section>

        <Section title={copy.planTitle}>
          <Plan />
        </Section>

        <Section id="location" title={copy.locationTitle}>
          <Reveal direction="scale">
            <Location />
          </Reveal>
        </Section>

        <Section id="rsvp" title={copy.rsvpTitle}>
          <Reveal direction="blur">
            <Rsvp />
          </Reveal>
        </Section>

        <Section>
          <Reveal direction="up">
            <ShareBar />
          </Reveal>
        </Section>

        <footer className="px-5 pb-24 pt-4 text-center sm:pb-14">
          <Reveal direction="blur" distance={16}>
            <p className="font-display text-lg tracking-wide text-muted">{copy.footer}</p>
          </Reveal>
        </footer>
      </main>

      <StickyCta />
    </>
  )
}
