/**
 * Source unique de tout le contenu affiché sur l'invitation.
 * Aucun texte ne doit être écrit en dur dans un composant.
 * Corriger une information la veille de la fête = une ligne à changer ici.
 */

export const invitation = {
  /** Prénom mis en avant, celui que les gens connaissent. */
  firstName: 'Maelyse',
  /** Nom complet, affiché une seule fois. */
  fullName: 'Maelyse Kadyjat',
  age: 9,

  /**
   * Date et heure de la fête, en heure d'Abidjan (UTC+0, la Côte d'Ivoire est sur GMT).
   *
   * ⚠️ À COMPLÉTER : l'heure ci-dessous est un espace réservé.
   * Tant que `startTime` vaut null, le site affiche « Time to be confirmed »
   * et le compte à rebours vise 15h00 par défaut.
   */
  dateISO: '2026-09-05T15:00:00Z',
  startTime: null as string | null, // exemple une fois connue : '3:00 PM'
  endTime: null as string | null, // exemple : '7:00 PM'

  /** Affichage de la date, écrit en toutes lettres pour les parents. */
  dayLabel: 'Saturday',
  dateLabel: 'September 5th, 2026',

  location: {
    /**
     * Décision de Kader : pas de nom de lieu écrit, les invités cliquent
     * sur la carte et voient directement l'emplacement dans Google Maps.
     */
    latitude: 5.3310823,
    longitude: -3.9445682,
    city: 'Abidjan',
  },

  /**
   * ⚠️ À COMPLÉTER AVANT DE PARTAGER LE LIEN.
   * Numéro qui reçoit les réponses, au format international sans + ni espaces.
   * Exemple pour la Côte d'Ivoire : '2250700000000'
   * Tant que la valeur est vide, le bouton de réponse reste désactivé.
   */
  whatsappNumber: '',

  /**
   * Programme de la fête.
   *
   * ⚠️ À RELIRE : ces quatre moments sont une proposition, pas une information
   * confirmée. Ils sont volontairement sans horaire pour ne rien promettre de faux.
   * Adapte-les à ce qui est réellement prévu, ou vide le tableau pour retirer la section.
   */
  plan: [
    { title: 'Welcome', text: 'Arrive, say hello, and settle in with the other children.' },
    { title: 'Games', text: 'Party games, small prizes, and a lot of laughing.' },
    { title: 'Cake and candles', text: 'Nine candles, one wish, and a very loud happy birthday.' },
    { title: 'Photos', text: 'A photo corner, so everyone goes home with a picture.' },
  ],

  /** Textes anglais. Ils s'adressent aux parents, le visuel s'adresse à l'enfant. */
  copy: {
    envelopeHint: 'Tap to open',
    envelopeAria: 'Open the invitation',

    eyebrow: 'You are invited',
    turns: 'turns',
    tagline: 'Nine candles, one big cake, and a party that would not be the same without you.',
    heroPrimary: "I'll be there",
    heroSecondary: 'See the place',

    countdownTitle: 'The party starts in',
    countdownToday: 'It is today. See you very soon!',
    countdownOver: 'What a day. Thank you for celebrating with us.',

    detailsTitle: 'Everything you need to know',
    whenLabel: 'When',
    timeLabel: 'Time',
    timeUnknown: 'Time to be confirmed',
    whereLabel: 'Where',
    whereValue: 'Tap the location card, it opens straight in Google Maps',
    parentsLabel: 'For parents',
    parentsValue:
      'Parents are welcome to stay, and just as welcome to drop off and come back. Whatever suits you best.',

    marquee: 'Maelyse · turns 9 · September 5th · you are invited',

    cakeTitle: 'Nine candles are waiting',
    cakeHint: 'Tap the flames, one by one',
    cakeBlowAll: 'Blow them all out',
    cakeDone: 'Wish made!',
    cakeDoneHint: 'Now we just need you there on Saturday.',
    cakeReset: 'Light them again',
    cakeCandleAria: 'Blow out candle',

    planTitle: 'How the day goes',
    dressCodeLabel: 'Dress code',
    dressCodeValue: 'Your favourite party outfit. Bright colours very welcome.',
    giftLabel: 'Gifts',
    giftValue: 'Your child coming is already the best part. No pressure on presents.',

    locationTitle: 'Find us',
    locationHint: 'Tap to open',
    openMaps: 'Open in Google Maps',

    rsvpTitle: 'Will you be there?',
    rsvpIntro:
      "Let us know before Thursday, September 3rd, so we can count the cake slices right.",
    childNameLabel: "Child's name",
    childNamePlaceholder: 'e.g. Awa',
    attendingYes: 'Yes, count us in',
    attendingNo: 'Sorry, we cannot make it',
    adultsLabel: 'Adults coming along',
    submitYes: 'Send my answer',
    submitNo: 'Send my answer',
    sending: 'Opening WhatsApp...',
    sentTitle: 'Thank you!',
    sentBody:
      'Your answer is ready in WhatsApp. Just press send and you are done.',
    sentAgain: 'Change my answer',
    alreadyTitle: 'You already answered',
    alreadyBody: 'We have you down. See you on Saturday!',
    errorNoNumber: 'Answers open very soon. Please check back in a moment.',
    nameRequired: 'Please write the name first.',

    shareTitle: 'Know someone who should come?',
    shareButton: 'Share this invitation',
    shareCopied: 'Link copied',

    footer: 'We cannot wait to celebrate with you.',
  },
} as const

/** Lien Google Maps ouvert au clic sur la carte. */
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${invitation.location.latitude},${invitation.location.longitude}`

