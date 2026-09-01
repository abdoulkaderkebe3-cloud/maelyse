import { sound as soundConfig } from '../config'

/**
 * ============================================================================
 *  MOTEUR SONORE
 * ============================================================================
 *
 * Tous les sons sont SYNTHÉTISÉS avec l'API Web Audio. Aucun fichier audio
 * n'est téléchargé.
 *
 * Pourquoi : un jeu de bruitages en MP3 pèse facilement plusieurs centaines de
 * kilo-octets, sur une connexion qui est souvent une 4G moyenne, pour des sons
 * qui durent un quart de seconde. Ici tout est calculé par le navigateur, le
 * coût réseau est de zéro octet, et le son est prêt instantanément.
 *
 * Le contexte audio n'est créé qu'au PREMIER GESTE de l'invité : les navigateurs
 * refusent le son non sollicité, et c'est une bonne règle.
 */

export type SoundName = 'puff' | 'spark' | 'whoosh' | 'chime' | 'tap' | 'pop'

const MUTE_KEY = 'maelyse-muted-v1'

/**
 * « Happy Birthday to You », en do majeur, à trois temps.
 *
 * Chaque entrée est une note MIDI et une durée en noires. `null` est un silence.
 * Do central = 60, donc sol4 = 67 et do5 = 72.
 *
 * Le morceau est dans le domaine public : la revendication de Warner/Chappell a
 * été invalidée par la justice américaine en 2015 puis abandonnée en 2016.
 *
 * Pourquoi cette mélodie plutôt que la boucle pentatonique d'avant : elle était
 * jolie mais anonyme, elle aurait pu accompagner n'importe quelle page. Trois
 * notes de Happy Birthday et un parent sait ce qu'il vient d'ouvrir, sans lire
 * une ligne.
 */
const HAPPY_BIRTHDAY: readonly (readonly [number | null, number])[] = [
  // Levée, puis « Happy birthday to you »
  [67, 0.5], [67, 0.5],
  [69, 1], [67, 1], [72, 1],
  [71, 2],
  // « Happy birthday to you »
  [67, 0.5], [67, 0.5],
  [69, 1], [67, 1], [74, 1],
  [72, 2],
  // « Happy birthday dear Maëlys »
  [67, 0.5], [67, 0.5],
  [79, 1], [76, 1], [72, 1],
  [71, 1], [69, 1],
  // « Happy birthday to you »
  [77, 0.5], [77, 0.5],
  [76, 1], [72, 1], [74, 1],
  [72, 3],
  // Le silence fait partie du morceau : sans lui, la boucle harcèle.
  [null, 4],
]

/** Noires par minute. Volontairement lent : c'est une berceuse, pas une fanfare. */
const TEMPO = 76

function midiToFrequency(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

class PartyAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicBus: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null

  private schedulerId = 0
  private nextNoteTime = 0
  /** Index de la note en cours dans HAPPY_BIRTHDAY. */
  private step = 0
  private musicOn = false

  muted = false
  ready = false

  constructor() {
    try {
      this.muted = window.localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      this.muted = false
    }
  }

  /** À appeler depuis un vrai geste de l'utilisateur, jamais au chargement. */
  unlock() {
    if (this.ctx) {
      void this.ctx.resume()
      return
    }

    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = window.AudioContext ?? (window as WithWebkit).webkitAudioContext
    if (!Ctor) return

    const ctx = new Ctor()
    this.ctx = ctx

    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : soundConfig.masterVolume
    this.master.connect(ctx.destination)

    this.musicBus = ctx.createGain()
    this.musicBus.gain.value = soundConfig.musicVolume
    this.musicBus.connect(this.master)

    // Un bruit blanc d'une seconde, réutilisé pour tous les sons soufflés.
    const length = ctx.sampleRate
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
    this.noiseBuffer = buffer

    this.ready = true
  }

  setMuted(muted: boolean) {
    this.muted = muted
    try {
      window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      // Stockage bloqué : le choix ne survivra pas à la visite, sans gravité.
    }
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setTargetAtTime(muted ? 0 : soundConfig.masterVolume, now, 0.05)
    }
  }

  /** Souffle court et doux : bruit filtré qui s'éteint vite. */
  private playPuff(at: number) {
    const ctx = this.ctx!
    const source = ctx.createBufferSource()
    source.buffer = this.noiseBuffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1100, at)
    filter.frequency.exponentialRampToValueAtTime(320, at + 0.22)
    filter.Q.value = 0.9
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.5, at + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24)
    source.connect(filter).connect(gain).connect(this.master!)
    source.start(at)
    source.stop(at + 0.3)
  }

  /** Étincelle : une note claire qui monte, avec sa petite harmonique. */
  private playSpark(at: number) {
    const ctx = this.ctx!
    for (const [ratio, level, delay] of [
      [1, 0.32, 0],
      [2.01, 0.16, 0.02],
      [3.02, 0.08, 0.04],
    ] as const) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880 * ratio, at + delay)
      osc.frequency.exponentialRampToValueAtTime(1480 * ratio, at + delay + 0.16)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, at + delay)
      gain.gain.exponentialRampToValueAtTime(level, at + delay + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + delay + 0.42)
      osc.connect(gain).connect(this.master!)
      osc.start(at + delay)
      osc.stop(at + delay + 0.5)
    }
  }

  /** Souffle long, pour l'ouverture de l'enveloppe. */
  private playWhoosh(at: number) {
    const ctx = this.ctx!
    const source = ctx.createBufferSource()
    source.buffer = this.noiseBuffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(300, at)
    filter.frequency.exponentialRampToValueAtTime(2600, at + 0.5)
    filter.Q.value = 1.4
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.4, at + 0.14)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.75)
    source.connect(filter).connect(gain).connect(this.master!)
    source.start(at)
    source.stop(at + 0.8)
  }

  /** Petite fanfare de récompense. */
  private playChime(at: number) {
    const notes = [72, 76, 79, 84]
    notes.forEach((note, index) => {
      this.bell(midiToFrequency(note), at + index * 0.09, 0.34, 1.5)
    })
  }

  /** Retour discret sur un appui d'interface. */
  private playTap(at: number) {
    this.bell(midiToFrequency(84), at, 0.14, 0.35)
  }

  /** Petit « pop » rond, pour les récompenses légères. */
  private playPop(at: number) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, at)
    osc.frequency.exponentialRampToValueAtTime(760, at + 0.09)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.34, at + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22)
    osc.connect(gain).connect(this.master!)
    osc.start(at)
    osc.stop(at + 0.26)
  }

  /** Une note de boîte à musique : sinus pur, attaque nette, longue décroissance. */
  private bell(frequency: number, at: number, level: number, seconds: number, bus?: GainNode) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = frequency

    // Une harmonique légèrement désaccordée donne le côté métallique du carillon.
    const harmonic = ctx.createOscillator()
    harmonic.type = 'sine'
    harmonic.frequency.value = frequency * 2.76

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(level, at + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds)

    const harmonicGain = ctx.createGain()
    harmonicGain.gain.setValueAtTime(0.0001, at)
    harmonicGain.gain.exponentialRampToValueAtTime(level * 0.22, at + 0.006)
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, at + seconds * 0.45)

    const target = bus ?? this.master!
    osc.connect(gain).connect(target)
    harmonic.connect(harmonicGain).connect(target)

    osc.start(at)
    harmonic.start(at)
    osc.stop(at + seconds + 0.05)
    harmonic.stop(at + seconds + 0.05)
  }

  play(name: SoundName) {
    if (!this.ready || !this.ctx || this.muted) return
    const at = this.ctx.currentTime + 0.001
    switch (name) {
      case 'puff':
        return this.playPuff(at)
      case 'spark':
        return this.playSpark(at)
      case 'whoosh':
        return this.playWhoosh(at)
      case 'chime':
        return this.playChime(at)
      case 'tap':
        return this.playTap(at)
      case 'pop':
        return this.playPop(at)
    }
  }

  /**
   * Boîte à musique de fond : « Happy Birthday », en boucle.
   *
   * Un ordonnanceur regarde 200 ms devant lui et programme les notes à l'avance.
   * C'est indispensable : si on se contentait d'un minuteur pour jouer chaque
   * note au moment voulu, le rythme tremblerait à chaque fois que le navigateur
   * est occupé ailleurs. Ici les notes sont posées à l'avance sur l'horloge
   * audio, qui, elle, ne tremble pas.
   */
  startMusic() {
    if (!this.ready || !this.ctx || this.musicOn) return
    this.musicOn = true
    this.nextNoteTime = this.ctx.currentTime + 0.15
    this.step = 0

    const secondsPerBeat = 60 / TEMPO

    this.schedulerId = window.setInterval(() => {
      if (!this.ctx || !this.musicBus) return
      while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
        const [note, beats] = HAPPY_BIRTHDAY[this.step % HAPPY_BIRTHDAY.length]
        const seconds = beats * secondsPerBeat

        if (note !== null) {
          // La résonance dépasse la durée écrite : les notes se recouvrent un
          // peu, ce qui donne l'harmonie naturelle d'une vraie boîte à musique.
          this.bell(midiToFrequency(note), this.nextNoteTime, 0.3, seconds + 1.3, this.musicBus)
        }

        this.nextNoteTime += seconds
        this.step += 1
      }
    }, 60)
  }

  stopMusic() {
    this.musicOn = false
    window.clearInterval(this.schedulerId)
  }
}

/** Une seule instance pour toute l'application. */
export const partyAudio = new PartyAudio()
