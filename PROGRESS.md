# PROGRESS.md
> Dernière mise à jour : 2026-08-31 18:10

## État global
Projet créé et cadré. Phase : Initialisation terminée, plan d'attaque proposé, en attente de validation. **Aucune ligne de code applicatif écrite.**
Échéance dure : la fête est le **samedi 5 septembre 2026**, le site doit être en ligne **avant le vendredi 4 septembre**. J-5 au moment de la création.

## Fait
- [x] Structure de continuité initialisée (CLAUDE.md, PROGRESS.md, DECISIONS.md, NEXT_SESSION.md)
- [x] Stack fixée : React 19 + Vite + TypeScript strict + Tailwind v4 (D-001)
- [x] Nature du produit tranchée : une vraie invitation, pas une vitrine de service (D-004)
- [x] Direction artistique reçue et actée : nuit électrique néon, ambiance disco magique (D-003)
- [x] Destination des réponses tranchée : WhatsApp pré-rempli, aucun backend (D-002 et D-005)
- [x] Langue tranchée : site en anglais, textes écrits pour les parents (D-007)
- [x] Données réelles reçues : Maelyse Kadyjat, 9 ans, samedi 5 septembre 2026, GPS `5.3310823, -3.9445682`

## En cours
- [ ] Validation du plan d'attaque par Kader
- [ ] Obtention des 3 informations manquantes qui bloquent la v1 (heure de début et de fin, nom du lieu en clair, numéro WhatsApp de réception)

## À faire (priorisé)
- [ ] Initialiser Vite + React + TS + Tailwind v4, poser les tokens de la palette néon
- [ ] `src/data/invitation.ts` : tout le contenu centralisé, y compris les textes anglais
- [ ] Écran d'accueil mobile first en 390px (prénom, 9 ans, date, lieu, CTA)
- [ ] Compte à rebours jusqu'au 5 septembre
- [ ] Bloc lieu avec bouton "Open in Google Maps"
- [ ] Formulaire de réponse et message WhatsApp pré-rempli, avec ses 5 états
- [ ] Bouton de partage (Web Share API avec repli copier) et balises Open Graph
- [ ] Vérification visuelle réelle au navigateur à 390px puis en desktop, console propre
- [ ] Déploiement Vercel et vérification du lien sur un vrai téléphone
- [ ] Si et seulement si le temps le permet : ouverture d'enveloppe, fichier .ics, galerie

## Décisions clés prises (voir DECISIONS.md pour détails)
- D-001 stack React + Vite + TS + Tailwind v4
- D-002 réponses par WhatsApp pré-rempli, pas de backend
- D-003 direction artistique néon, ambiance repositionnée en disco magique et non "Euphoria"
- D-004 on construit l'invitation, pas la vitrine "Digital Invitations DZ" du brief
- D-005 le RSVP temps réel du brief est abandonné
- D-006 l'échéance du 4 septembre arbitre toutes les décisions suivantes
- D-007 site en anglais, textes destinés aux parents

## Pièges rencontrés et solutions
- **Le brief reçu mélangeait deux produits** (une vitrine de service et une invitation) → tranché en D-004 avant d'écrire du code, ce qui aurait autrement produit une page vitrine inutilisable pour la fête.
- **"RSVP en temps réel" est un piège de calendrier** : la formulation est anodine mais impose une base de données et des règles de sécurité → écarté en D-005.
- **Le violet néon sur noir ne passe pas le contraste AA en texte** (environ 3:1) → il est réservé aux fonds et aux halos, décidé d'avance pour ne pas avoir à repeindre l'interface après coup.

## Notes importantes pour la prochaine session
Trois informations manquent et **bloquent la v1** : l'heure de début et de fin, le nom du lieu en clair (les coordonnées GPS seules ne suffisent pas, personne ne lit des coordonnées), et le numéro WhatsApp qui reçoit les réponses. Le reste peut avancer sans, en mettant des valeurs de remplacement clairement marquées dans `src/data/invitation.ts`.

Le destinataire réel du lien n'est pas l'enfant mais **les parents des camarades**. C'est ce qui décide du ton anglais et du contenu du formulaire.

Rappel de méthode issu d'artluxury : ne jamais mesurer ou compter des éléments d'interface à l'oeil sur une capture, mesurer dans le DOM.
