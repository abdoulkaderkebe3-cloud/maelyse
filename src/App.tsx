import { invitation } from './data/invitation'
import { NightSky } from './components/NightSky'
import { Hero } from './components/Hero'
import { Section } from './components/Section'
import { Reveal } from './components/Reveal'
import { Countdown } from './components/Countdown'
import { Details } from './components/Details'
import { Location } from './components/Location'
import { Rsvp } from './components/Rsvp'
import { ShareBar } from './components/ShareBar'
import { StickyCta } from './components/StickyCta'
import { ScrollProgress } from './components/ScrollProgress'

const { copy } = invitation

export default function App() {
  return (
    <>
      <ScrollProgress />
      <NightSky />

      <main className="relative">
        <Hero />

        <Section>
          <Countdown />
        </Section>

        <Section title={copy.detailsTitle}>
          <Details />
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
            <p className="font-display text-lg italic text-muted">{copy.footer}</p>
          </Reveal>
        </footer>
      </main>

      <StickyCta />
    </>
  )
}
