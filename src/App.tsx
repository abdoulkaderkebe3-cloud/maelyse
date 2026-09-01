import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { copy } from './config'
import { PartyProvider, useParty } from './context/PartyContext'

import { Sky } from './components/Sky'
import { Intro } from './components/Intro'
import { Hero } from './components/Hero'
import { Section } from './components/Section'
import { Reveal } from './components/Reveal'
import { Countdown } from './components/Countdown'
import { Cake } from './components/Cake'
import { Details } from './components/Details'
import { Plan } from './components/Plan'
import { Location } from './components/Location'
import { ShareBar } from './components/ShareBar'
import { StickyCta } from './components/StickyCta'
import { ScrollProgress } from './components/ScrollProgress'
import { SoundToggle } from './components/SoundToggle'

/**
 * L'ouverture se rejoue à CHAQUE chargement de la page.
 *
 * Elle ne le faisait pas : une clé de stockage local retenait la première
 * visite et les suivantes arrivaient directement sur l'invitation. Kader a
 * demandé l'inverse (D-029), donc plus de mémoire du tout, et volontairement
 * pas de clé laissée à traîner.
 *
 * Ce qui rend le choix tenable : l'enveloppe attend un appui et ne part jamais
 * toute seule, et une fois lancée, un appui n'importe où abrège la séquence.
 */
function Invitation() {
  const { startAudio } = useParty()
  const [introDone, setIntroDone] = useState(false)

  // L'invitation commence toujours en haut, quelle que soit la position de
  // défilement que le navigateur voudrait restaurer.
  useEffect(() => {
    if (!introDone) window.scrollTo(0, 0)
  }, [introDone])

  const finishIntro = useCallback(() => setIntroDone(true), [])

  // Filet de sécurité pour le son : l'ouverture démarre l'audio sur l'appui de
  // l'enveloppe, mais si elle est court-circuitée d'une manière ou d'une autre,
  // le premier appui sur la page s'en charge, une seule fois.
  useEffect(() => {
    if (!introDone) return
    function onFirstGesture() {
      startAudio()
      window.removeEventListener('pointerdown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture, { once: true })
    return () => window.removeEventListener('pointerdown', onFirstGesture)
  }, [introDone, startAudio])

  return (
    <>
      <ScrollProgress />
      <Sky />

      <AnimatePresence>
        {!introDone && <Intro key="intro" onDone={finishIntro} />}
      </AnimatePresence>

      {/* Seule commande permanente, hors du flux de lecture */}
      {introDone && <SoundToggle />}

      {/*
        Tant que l'ouverture est là, la page est masquée mais garde sa place :
        le ciel et les ballons continuent de vivre derrière, sans que le contenu
        de l'invitation transparaisse au travers.
      */}
      <main
        className={`relative transition-opacity duration-500 ${
          introDone ? 'opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!introDone}
      >
        <Hero />

        {/*
          Il y avait ici un bandeau défilant qui répétait en boucle « Maëlys ·
          turns 9 · September 5th · you are invited », c'est-à-dire exactement ce
          que le hero vient de dire, juste au-dessus. Retiré : c'est le motif qui
          signale une page générée plutôt qu'une page dessinée (D-031).
        */}
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

        <Section>
          <Reveal direction="up">
            <ShareBar />
          </Reveal>
        </Section>

        <footer className="relative px-5 pb-24 pt-4 text-center sm:pb-14">
          <Reveal direction="blur" distance={16}>
            <p className="font-display text-lg tracking-wide text-muted">{copy.footer}</p>
          </Reveal>
        </footer>
      </main>

      <StickyCta />
    </>
  )
}

export default function App() {
  return (
    <PartyProvider>
      <Invitation />
    </PartyProvider>
  )
}
