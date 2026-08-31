# PROGRESS.md
> Dernière mise à jour : 2026-08-31 19:20

## État global
**L'invitation est EN LIGNE : https://maelyse.vercel.app**
Enveloppe d'accueil, animations au défilement, passe de performance faite et mesurée. Vérifiée au navigateur en 390px et en 1440px, 0 erreur console, 0 débordement horizontal.

La fête est le **samedi 5 septembre 2026**, il reste **5 jours**.

⚠️ **Le lien ne peut toujours pas être envoyé aux invités.** Trois choses manquent, toutes dans `src/data/invitation.ts` :
1. `whatsappNumber` : sans lui le bouton de réponse ne fait rien
2. `startTime` / `endTime` : la ligne Time affiche « Time to be confirmed »
3. `plan`, `dressCodeValue` et `giftValue` : contenus proposés par Claude, à relire (voir D-015)

## Fait
- [x] Structure de continuité, 15 décisions actées (D-001 à D-015)
- [x] Vite 8 + React 19 + TypeScript strict + Tailwind v4
- [x] Tout le contenu centralisé dans `src/data/invitation.ts`
- [x] 7 sections : enveloppe, hero, compte à rebours, informations, déroulé, lieu, réponse, partage
- [x] **Enveloppe d'accueil** cachetée, rabat qui bascule, lettre qui sort, première visite seulement (D-013)
- [x] **Animations au défilement** : parallaxe du hero, titres révélés mot par mot, cascades, compteur à rouleau, filet de progression
- [x] **Passe de performance mesurée** à 6x processeur et 4G lente (D-014)
- [x] Carte cliquable qui ouvre Google Maps, assombrie par filtre CSS
- [x] Formulaire de réponse avec ses 5 états, message WhatsApp pré-rempli, confettis
- [x] Partage natif, image d'aperçu WhatsApp à 63 Ko, noindex, traduction bloquée
- [x] Poussé sur `github.com/abdoulkaderkebe3-cloud/maelyse`, dépôt relié à Vercel
- [x] Déployé et vérifié public en HTTP hors session connectée

## En cours
- [ ] Attente des informations manquantes de Kader (heure, numéro WhatsApp, validation du déroulé)

## À faire (priorisé)
- [ ] **Renseigner `whatsappNumber`** (bloquant)
- [ ] **Renseigner `startTime` et `endTime`** (bloquant)
- [ ] **Relire le déroulé, le code vestimentaire et la mention cadeaux** (inventés par Claude, D-015)
- [ ] Tester sur un vrai téléphone : aperçu WhatsApp, ouverture de Maps, envoi d'une réponse réelle
- [ ] Si besoin après test réel : alléger `motion` via LazyMotion (~113 Ko gzippés aujourd'hui)
- [ ] Optionnel : ajout au calendrier (.ics), galerie photo

## Décisions clés prises (voir DECISIONS.md pour détails)
- D-001 stack React + Vite + TS + Tailwind v4
- D-002 réponses par WhatsApp pré-rempli, aucun backend
- D-003 direction artistique néon, ambiance disco magique
- D-004 on construit l'invitation, pas la vitrine du brief
- D-005 le RSVP temps réel est abandonné
- D-006 l'échéance du 4 septembre arbitre tout
- D-007 site en anglais, textes destinés aux parents
- D-008 animations avec `motion`
- D-009 dépôt `maelyse`, déploiement Vercel
- D-010 noindex et traduction automatique bloquée
- D-011 carte Google Maps assombrie par filtre CSS
- D-012 URL publique maelyse.vercel.app, piège de la protection de déploiement
- D-013 enveloppe d'accueil, première visite seulement
- D-014 passe de performance, la fluidité prime sur l'effet
- D-015 section déroulé, contenu proposé à valider

## Pièges rencontrés et solutions
- **Le brief mélangeait deux produits** (vitrine et invitation) → tranché en D-004 avant tout code.
- **« RSVP en temps réel »** impose une base de données → écarté en D-005.
- **Chrome traduisait la page en français à la volée.** Vu seulement en regardant l'image d'aperçu générée, sortie en français alors que le HTML est en anglais → `translate="no"` et meta notranslate.
- **La protection de déploiement Vercel rendait le lien inaccessible à tout le monde sauf à Kader.** Invisible depuis un navigateur connecté → rattacher le domaine au projet (`vercel domains add`) et non poser un alias, puis contrôler le code HTTP hors session.
- **La feuille de style bloquait le premier affichage**, y compris l'enveloppe dessinée en HTML → greffon Vite qui la charge en non bloquant.
- **Animer un élément flouté** force le recalcul du flou à chaque image, c'était le calcul le plus lourd de la page → halos figés.
- **Mesurer la performance sur le serveur de développement ne veut rien dire** : 12,8 s en dev contre 5,4 s en production, pour le même code.
- **La tuile des secondes se vidait** à chaque changement de valeur → compteur à rouleau avec l'ancien et le nouveau chiffre présents en même temps.
- **L'enveloppe laissait voir la lettre par les côtés** → face avant et rabat construits sur la même géométrie.
- **Le heredoc bash cale sur du TSX** → écriture directe de fichier pour ces cas.

## Notes importantes pour la prochaine session
Trois champs à remplir ou relire dans `src/data/invitation.ts` et l'invitation part. Ils sont tous commentés en gras dans le fichier.

Un `git push` sur `main` redéploie automatiquement, le dépôt est relié au projet Vercel.

Le premier levier de performance restant est `motion`, environ un tiers des 113 Ko gzippés. Passer à LazyMotion est mécanique mais à ne pas tenter dans les jours qui précèdent la fête.
