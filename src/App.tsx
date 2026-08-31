import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { copy } from './config'
import { PartyProvider, useParty } from './context/PartyContext'

import { Sky } from './components/Sky'
import { Intro } from './components/Intro'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
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
import { SparkCounter } from './components/SparkCounter'
import { SoundToggle } from './components/SoundToggle'
import { Spark } from './components/Spark'
import { Victory } from './components/Victory'

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

      {/* Commandes permanentes, hors du flux de lecture */}
      {introDone && (
        <>
          <SoundToggle />
          <SparkCounter />
        </>
      )}

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

        <Section>
          <Reveal direction="up">
            <ShareBar />
          </Reveal>
        </Section>

        <footer className="relative px-5 pb-24 pt-4 text-center sm:pb-14">
          {/* Étincelle 8 sur 9, la dernière cachée. La neuvième est sur le gâteau. */}
          <Spark id="footer" className="right-[16%] top-[6%]" />

          <Reveal direction="blur" distance={16}>
            <p className="font-display text-lg tracking-wide text-muted">{copy.footer}</p>
          </Reveal>
        </footer>
      </main>

      <StickyCta />
      <Victory />
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
