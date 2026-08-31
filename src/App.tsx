import { invitation } from './data/invitation'
import { NightSky } from './components/NightSky'
import { Hero } from './components/Hero'
import { Section } from './components/Section'
import { Countdown } from './components/Countdown'
import { Details } from './components/Details'
import { Location } from './components/Location'
import { Rsvp } from './components/Rsvp'
import { ShareBar } from './components/ShareBar'
import { StickyCta } from './components/StickyCta'

const { copy } = invitation

export default function App() {
  return (
    <>
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
          <Location />
        </Section>

        <Section id="rsvp" title={copy.rsvpTitle}>
          <Rsvp />
        </Section>

        <Section>
          <ShareBar />
        </Section>

        <footer className="px-5 pb-24 pt-4 text-center sm:pb-14">
          <p className="font-display text-lg italic text-muted">{copy.footer}</p>
        </footer>
      </main>

      <StickyCta />
    </>
  )
}
