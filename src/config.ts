/**
 * ============================================================================
 *  CONFIGURATION UNIQUE DE L'INVITATION
 * ============================================================================
 *
 * Tout ce qui change d'une fête à l'autre vit ici, et NULLE PART ailleurs.
 * Aucun texte, aucune couleur, aucune date n'est écrite en dur dans un composant.
 *
 * Pour réutiliser ce site pour un autre client : ce fichier suffit.
 *
 * Les champs marqués ⚠️ doivent être remplis avant de partager le lien.
 */

// ---------------------------------------------------------------------------
// 1. LA PALETTE
// ---------------------------------------------------------------------------
// Ces valeurs sont injectées au démarrage dans les variables CSS que Tailwind
// utilise (voir src/lib/palette.ts). Changer une couleur ici la change partout.

export const palette = {
  /** Fond le plus profond, celui de la page. */
  night: '#06030f',
  /** Nuit un peu plus claire, pour les dégradés. */
  night2: '#0d0620',
  /** Fond des cartes et des blocs. */
  surface: '#150a2b',
  /** Filets et bordures. */
  line: '#2c1a4d',

  /** Violet électrique. Lumière et halos uniquement, jamais de texte dessus. */
  violet: '#8b5cf6',
  /** Rose magenta, la couleur d'action. */
  neon: '#d946ef',
  /** Turquoise, la couleur des repères et des libellés. */
  aqua: '#22d3ee',
  /** Or, la couleur de la fête et des récompenses. */
  gold: '#ffd76e',
  /** Argent, pour les matières froides. */
  silver: '#d6deeb',

  /** Texte principal. */
  ink: '#f5f3ff',
  /** Texte secondaire. */
  muted: '#b9aeda',
} as const

// ---------------------------------------------------------------------------
// 2. LA FÊTE
// ---------------------------------------------------------------------------

export const party = {
  /** Prénom mis en avant, celui qui s'assemble à l'ouverture. */
  firstName: 'Maelyse',
  /** Nom complet, affiché une seule fois. */
  fullName: 'Maelyse Kadyjat',
  age: 9,

  /** Date et heure de la fête, en heure d'Abidjan (la Côte d'Ivoire est sur GMT). */
  dateISO: '2026-09-05T14:00:00Z',
  /** Heure de début, confirmée par Kader. */
  startTime: '2:00 PM' as string,
  /**
   * Heure de fin. Volontairement vide : Kader a choisi de ne pas en annoncer.
   * Tant qu'elle l'est, la page affiche « From 2:00 PM » et non une plage.
   */
  endTime: '' as string,

  dayLabel: 'Saturday',
  dateLabel: 'September 5th, 2026',
} as const

// ---------------------------------------------------------------------------
// 3. LE LIEU
// ---------------------------------------------------------------------------
// RÈGLE : les coordonnées ne s'affichent JAMAIS à l'écran. Elles ne servent
// qu'à construire le lien Google Maps. Ce qu'on montre, c'est un nom et une
// adresse que quelqu'un peut lire à voix haute à un taxi.

export const venue = {
  /** Choix de Kader : la ville seule, rien de plus. */
  name: 'Abidjan',
  /**
   * Précision sous le nom. Vide = masquée, et c'est le cas voulu ici :
   * la précision réelle est portée par le bouton Google Maps.
   */
  address: '',
  /** Complément facultatif : étage, portail, point de repère. Vide = masqué. */
  hint: '',

  /** Utilisées uniquement dans le lien, jamais affichées. */
  latitude: 5.3310823,
  longitude: -3.9445682,
} as const

/** Lien ouvert par le bouton. Les coordonnées ne vivent que dans cette URL. */
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`

// ---------------------------------------------------------------------------
// 4. LE SON
// ---------------------------------------------------------------------------

export const sound = {
  /** Volume général, de 0 à 1. Volontairement discret. */
  masterVolume: 0.35,
  /** Volume de la boîte à musique de fond. */
  musicVolume: 0.18,
  /** Le son démarre au premier geste de l'invité, jamais tout seul. */
  startOnFirstTap: true,
} as const

// ---------------------------------------------------------------------------
// 5. LE PROGRAMME
// ---------------------------------------------------------------------------
// Les DEUX activités sont confirmées par Kader : natation et poterie.
// L'accueil et le gâteau restent une proposition évidente.
// Volontairement sans horaires : annoncer « 16h le gâteau » et ne pas le tenir,
// c'est dix parents à la porte au mauvais moment.

export const plan: readonly { title: string; text: string }[] = [
  { title: 'Welcome', text: 'Arrive, say hello, and settle in with the other children.' },
  {
    title: 'Swimming',
    text: 'A swimming session in the pool. Please pack a swimsuit, a towel and dry clothes to change into.',
  },
  {
    title: 'Pottery',
    text: 'A pottery workshop, where every child shapes something and takes it home.',
  },
  { title: 'Cake and candles', text: 'Nine candles, one wish, and a very loud happy birthday.' },
]

// ---------------------------------------------------------------------------
// 6. TOUS LES TEXTES
// ---------------------------------------------------------------------------
// Le site est en anglais. Les textes s'adressent aux PARENTS, qui sont ceux qui
// ouvrent le lien et décident, pendant que le visuel s'adresse à l'enfant.

export const copy = {
  // Ouverture
  envelopeHint: 'Tap to open',
  envelopeAria: 'Open the invitation',
  introTagline: 'is turning',
  /** Raccourci proposé pendant l'ouverture, une fois le prénom assemblé. */
  introSkip: 'Tap to skip',

  // Hero
  eyebrow: 'You are invited',
  turns: 'turns',
  tagline: 'Nine candles, one big cake, and a party that would not be the same without you.',
  /** Il n'y a plus de formulaire de réponse : la seule action de la page est le lieu. */
  heroPrimary: 'See the place',
  scrollHint: 'Scroll',

  // Compte à rebours
  countdownTitle: 'The party starts in',
  countdownToday: 'It is today. See you very soon!',
  countdownUnits: { days: 'days', hours: 'hours', minutes: 'min', seconds: 'sec' },

  // Gâteau
  cakeTitle: 'Nine candles are waiting',
  cakeHint: 'Tap the flames, one by one',
  cakeBlowAll: 'Blow them all out',
  cakeDone: 'Wish made!',
  cakeDoneHint: 'Now we just need you there on Saturday.',
  cakeReset: 'Light them again',
  cakeCandleAria: 'Blow out candle',

  // Informations
  detailsTitle: 'Everything you need to know',
  whenLabel: 'When',
  timeLabel: 'Time',
  timeUnknown: 'Time to be confirmed',
  /** Employé quand l'heure de début est connue mais pas celle de fin. */
  timeFrom: 'From {time}',
  whereLabel: 'Where',
  dressCodeLabel: 'What to bring',
  dressCodeValue:
    'Party clothes, plus a swimsuit, a towel and dry clothes to change into after the pool.',
  giftLabel: 'Gifts',
  giftValue: 'Your child coming is already the best part. No pressure on presents.',

  // Programme
  planTitle: 'How the day goes',

  // Lieu
  locationTitle: 'Find us',
  openMaps: 'Open in Google Maps',
  locationHint: 'Tap to open the map',

  // Partage
  shareTitle: 'Know someone who should come?',
  shareButton: 'Share this invitation',
  shareCopied: 'Link copied',

  // Pied de page
  footer: 'We cannot wait to celebrate with you.',

  // Son
  soundOn: 'Turn the music on',
  soundOff: 'Turn the music off',
} as const
