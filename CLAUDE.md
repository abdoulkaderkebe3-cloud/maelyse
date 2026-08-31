# CLAUDE.md - Projet anniv

> Constitution du projet. Lue en premier à chaque reprise de session.
> Le contexte personnel de Kader vit dans le CLAUDE.md racine du workspace Jarvis.

---

## Description

Invitation d'anniversaire en ligne, une page unique partagée par lien WhatsApp, qui remplace le carton papier et l'image envoyée dans un groupe.

**Ce n'est pas un exercice.** C'est une vraie fête, avec une date dure.

| | |
|---|---|
| **Qui** | Maelyse Kadyjat |
| **Âge** | 9 ans |
| **Quand** | **samedi 5 septembre 2026** |
| **Où** | Abidjan, coordonnées GPS `5.3310823, -3.9445682` (zone est d'Abidjan, vers Bingerville) |
| **Langue du site** | **anglais** |
| **Échéance de livraison** | le site doit être en ligne et partageable **avant le vendredi 4 septembre** |

---

## Contrainte numéro un : le temps

Le projet a été lancé le 2026-08-31, soit **J-5**. Cette contrainte prime sur toutes les autres et sert d'arbitre à chaque décision : entre deux options, on prend celle qui est en ligne vendredi.

Une invitation livrée après la fête vaut zéro, quelle que soit sa qualité.

---

## Objectifs

1. **Le lien s'ouvre et informe.** Un parent reçoit le lien sur WhatsApp, l'ouvre sur un téléphone souvent modeste, avec une connexion parfois moyenne, et sait en 3 secondes qui, quand et où.
2. **Il répond.** La confirmation de présence se fait en un geste, sans compte à créer, sans application à installer.
3. **Il a envie de venir.** L'invitation doit avoir l'air d'un cadeau, pas d'un formulaire.

---

## Le vrai destinataire

L'invitée a 9 ans, mais **le lien est ouvert par les parents des camarades**, ce sont eux qui lisent, qui décident et qui répondent.

Conséquence sur toute l'interface :

- Les textes anglais s'adressent aux **parents** (clairs, rassurants, précis sur les horaires), pendant que le **visuel** s'adresse à l'enfant (magique, festif).
- Un parent a besoin de savoir : à quelle heure ça finit, où c'est exactement, et s'il doit rester ou déposer. Ces informations manquent presque toujours et ce sont celles qu'on redemande par message.
- Le formulaire de réponse demande le **nom de l'enfant**, pas celui de l'adulte qui remplit.

---

## Stack technique

- **React 19** + **Vite** + **TypeScript** (strict)
- **Tailwind CSS v4** (tokens dans le bloc `@theme` de `src/index.css`, pas de `tailwind.config.js`)
- **Pas de backend.** Les réponses partent en message WhatsApp pré-rempli (D-002 et D-005)
- Déploiement : **Vercel**

---

## Direction artistique

Fixée par Kader avec images de référence, voir D-003.

Nuit électrique et haut de gamme : noir profond, dégradés violet électrique, pourpre néon et bleu turquoise, touches dorées et argentées sur les détails et les boutons. Halos néon, boule à facettes discrète en arrière-plan, étoiles scintillantes, titre en serif.

Positionnement retenu : **soirée disco magique**, pas soirée d'adultes. La palette est conservée telle quelle, l'ambiance est réorientée vers une fête de 9 ans (voir D-003).

---

## Conventions de code

- TypeScript strict, aucun `any` non justifié
- Composants fonctionnels, un composant par fichier, nommage `PascalCase`
- **Tout le contenu affiché vit dans `src/data/invitation.ts`**, jamais en dur dans le JSX. Prénom, âge, date, heures, lieu, textes anglais, numéro WhatsApp. Corriger une heure la veille de la fête doit demander de toucher un seul fichier et une seule ligne.
- Couleurs, espacements et rayons en tokens, jamais de valeur magique
- Mobile first strict : on code le 390px d'abord, on élargit ensuite en `min-width`
- Commits en français, sans trailer de co-auteur

---

## Règles de design propres au projet

Les 4 piliers du CLAUDE.md racine s'appliquent. Spécificités :

- **Motif en Z**, page de faible densité : le prénom en haut, la date au centre, le bouton de réponse en bas et atteignable sans scroll, ou en barre fixe basse.
- **Thème sombre unique**, exception assumée au thème double du workspace. Une invitation de soirée n'a pas de mode clair.
- **Contraste AA malgré le néon** : le violet saturé sur noir tombe autour de 3:1, il sert donc aux fonds, halos et bordures, jamais au texte courant. Le doré, le turquoise clair et le blanc portent le texte.
- **Les animations ne bloquent jamais l'information.** L'ouverture d'enveloppe se saute au premier tap et ne se rejoue pas. `transform` et `opacity` uniquement, `prefers-reduced-motion` respecté, page lisible avec toutes les animations coupées.
- **Poids de la page surveillé.** L'invité est sur un téléphone d'entrée de gamme en 4G moyenne. Pas de vidéo de fond, pas de librairie d'animation lourde, images dimensionnées et compressées.
- **Les 5 états du formulaire** existent : repos, envoi, succès, erreur, déjà répondu.

---

## Fonctionnalités

**Indispensables (v1, livrées avant vendredi) :**
- [ ] Écran d'accueil : prénom, 9 ans, date, heure, lieu, bouton de réponse
- [ ] Compte à rebours jusqu'au 5 septembre
- [ ] Bloc lieu avec bouton "Open in Google Maps" vers les coordonnées GPS
- [ ] Réponse de présence par message WhatsApp pré-rempli
- [ ] Bouton de partage du lien (Web Share API avec repli copier)
- [ ] Balises Open Graph et image de partage, pour que l'aperçu WhatsApp soit correct

**Souhaitables si le temps le permet :**
- [ ] Animation d'ouverture d'enveloppe
- [ ] Ajout au calendrier (.ics)
- [ ] Galerie photo
- [ ] Musique d'ambiance (jamais en lecture automatique)

---

## Informations encore manquantes

1. **L'heure de début et l'heure de fin.** Bloquant pour la v1, un parent ne peut pas répondre sans.
2. **Le nom du lieu en clair** ("chez nous", nom de la résidence, du quartier). Les coordonnées GPS seules ne suffisent pas, personne ne lit des coordonnées.
3. **Le numéro WhatsApp** qui reçoit les réponses.
