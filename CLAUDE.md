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
2. **Il a envie de venir.** L'invitation doit avoir l'air d'un cadeau, pas d'un formulaire.

> ⚠️ L'objectif « il répond » a été **retiré le 2026-08-31** sur décision de Kader (D-024). Le site ne collecte plus de réponses, les confirmations se font dans la conversation WhatsApp où le lien est partagé.

---

## Le vrai destinataire

L'invitée a 9 ans, mais **le lien est ouvert par les parents des camarades**, ce sont eux qui lisent, qui décident et qui répondent.

Conséquence sur toute l'interface :

- Les textes anglais s'adressent aux **parents** (clairs, rassurants, précis sur les horaires), pendant que le **visuel** s'adresse à l'enfant (magique, festif).
- Un parent a besoin de savoir où c'est exactement et ce que son enfant doit emporter. Kader a choisi de ne pas annoncer d'heure de fin (D-023) et de ne pas parler aux parents de rester ou déposer (D-024).
- Il y a de la **natation** : maillot, serviette et rechange sont une information indispensable, pas un détail.

---

## Stack technique

- **React 19** + **Vite** + **TypeScript** (strict)
- **Tailwind CSS v4** (tokens dans le bloc `@theme` de `src/index.css`, pas de `tailwind.config.js`)
- **Pas de backend.** Et depuis D-024, plus de collecte de réponses du tout
- Déploiement : **Vercel**, dépôt `github.com/abdoulkaderkebe3-cloud/maelyse` relié au projet, un push sur `main` redéploie

---

## Direction artistique

Fixée par Kader avec images de référence, voir D-003. **Dépouillée en D-031** : la page accumulait trop d'effets et ressemblait à un site généré, ce qui est un problème de crédibilité pour Kader.

**Règle qui en découle, à appliquer à tout ajout futur :** un effet doit gagner sa place. Pas de bandeau défilant, pas de dégradé sur du texte, pas de halo néon sur un bouton, pas d'animation infinie qui ne raconte rien. La couleur d'action est un **aplat or avec texte sombre**, jamais un dégradé magenta. Dans le doute, retirer.

Nuit électrique et haut de gamme : noir profond, dégradés violet électrique, pourpre néon et bleu turquoise, touches dorées et argentées sur les détails et les boutons. Halos néon, boule à facettes discrète en arrière-plan, étoiles scintillantes, titre en serif.

Positionnement retenu : **soirée disco magique**, pas soirée d'adultes. La palette est conservée telle quelle, l'ambiance est réorientée vers une fête de 9 ans (voir D-003).

---

## Conventions de code

- TypeScript strict, aucun `any` non justifié
- Composants fonctionnels, un composant par fichier, nommage `PascalCase`
- **Tout ce qui est modifiable vit dans `src/config.ts`** (D-021), jamais en dur dans le JSX : palette, prénom, âge, date, heures, lieu, réglages du jeu et du son, programme, tous les textes anglais. Corriger une heure la veille de la fête doit demander de toucher un seul fichier et une seule ligne.
- Couleurs, espacements et rayons en tokens, jamais de valeur magique
- Mobile first strict : on code le 390px d'abord, on élargit ensuite en `min-width`
- Commits en français, sans trailer de co-auteur

---

## Règles de design propres au projet

Les 4 piliers du CLAUDE.md racine s'appliquent. Spécificités :

- **Motif en Z**, page de faible densité : le prénom en haut, la date au centre, le bouton d'action en bas et atteignable sans scroll, ou en barre fixe basse. Depuis D-024 ce bouton unique est « See the place » et descend vers le lieu.
- **Thème sombre unique**, exception assumée au thème double du workspace. Une invitation de soirée n'a pas de mode clair.
- **Contraste AA malgré le néon** : le violet saturé sur noir tombe autour de 3:1, il sert donc aux fonds, halos et bordures, jamais au texte courant. Le doré, le turquoise clair et le blanc portent le texte. **Les boutons sont un aplat or avec texte `#1f0b3a`**, environ 14:1 ; l'ancien blanc sur dégradé magenta tombait à 2,6:1 et échouait au seuil (D-031).
- **Les animations ne bloquent jamais l'information.** L'ouverture se rejoue à chaque chargement (D-029), donc elle doit rester interruptible : l'enveloppe attend un appui et ne part jamais seule, et une fois lancée, un appui n'importe où l'abrège (D-028). `transform` et `opacity` uniquement, `prefers-reduced-motion` respecté, page lisible avec toutes les animations coupées.
- **Poids de la page surveillé.** L'invité est sur un téléphone d'entrée de gamme en 4G moyenne. Pas de vidéo de fond, pas de librairie d'animation lourde, images dimensionnées et compressées.
- **Il n'y a plus de formulaire** depuis D-024. La règle des 5 états reste valable pour tout formulaire qui reviendrait.

---

## Fonctionnalités

**Indispensables (v1) :**
- [x] Écran d'accueil : prénom, 9 ans, date, heure, lieu, bouton d'action
- [x] Compte à rebours jusqu'au 5 septembre
- [x] Bloc lieu avec bouton "Open in Google Maps" vers les coordonnées GPS
- [x] Bouton de partage du lien (Web Share API avec repli copier)
- [x] Balises Open Graph et image de partage, pour que l'aperçu WhatsApp soit correct
- [x] ~~Réponse de présence par message WhatsApp pré-rempli~~ retirée en D-024

**Souhaitables, faites :**
- [x] Ouverture cinématique, rejouée à chaque chargement et interruptible (D-028, D-029)
- [x] Musique d'ambiance (jamais en lecture automatique)
- [x] Gâteau interactif
- [x] ~~Jeu des neuf étincelles~~ retiré en D-031

**Souhaitables, pas faites :**
- [ ] Ajout au calendrier (.ics)
- [ ] Galerie photo

---

## Informations encore manquantes

**Aucune.** Tout le contenu est validé par Kader au 2026-08-31.

- Heure de début : **14h** (D-023)
- Heure de fin : **volontairement non annoncée** (D-023)
- Lieu affiché : **« Abidjan » seul**, la précision est portée par le bouton Google Maps (D-026)
- Programme : **natation et poterie** (D-025)
- Numéro WhatsApp : **sans objet** depuis le retrait du formulaire de réponse (D-024)
