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

  /** Textes anglais. Ils s'adressent aux parents, le visuel s'adresse à l'enfant. */
  copy: {
    eyebrow: 'You are invited',
    turns: 'turns',
    tagline: 'Nine years of joy, and a dance floor waiting for you.',
    heroPrimary: "I'll be there",
    heroSecondary: 'See the place',

    countdownTitle: 'The party starts in',
    countdownToday: 'It is today. See you tonight!',
    countdownOver: 'What a night. Thank you for celebrating with us.',

    detailsTitle: 'Everything you need to know',
    whenLabel: 'When',
    timeLabel: 'Time',
    timeUnknown: 'Time to be confirmed',
    whereLabel: 'Where',
    whereValue: 'Tap the map, it opens straight in Google Maps',
    parentsLabel: 'For parents',
    parentsValue:
      'Parents are welcome to stay, and just as welcome to drop off and come back. Whatever suits you best.',

    locationTitle: 'Find us',
    locationHint: 'Tap the map to open it in Google Maps',
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

    footer: 'See you on the dance floor.',
  },
} as const

/** Lien Google Maps ouvert au clic sur la carte. */
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${invitation.location.latitude},${invitation.location.longitude}`

/** Carte intégrée, sans clé API, volontairement chargée en différé. */
export const mapsEmbed = `https://www.google.com/maps?q=${invitation.location.latitude},${invitation.location.longitude}&hl=en&z=16&output=embed`
