# PROGRESS.md
> Dernière mise à jour : 2026-08-31 18:30

## État global
**L'invitation est codée, buildée, vérifiée au navigateur et poussée sur GitHub.** Déploiement Vercel en cours.
La fête est le **samedi 5 septembre 2026**, il reste **5 jours**. Le site doit être partageable avant le vendredi 4.

⚠️ **Le lien ne peut pas encore être envoyé aux invités** : sans numéro WhatsApp, le bouton de réponse ne fait rien, et l'heure de la fête n'est pas affichée.

## Fait
- [x] Structure de continuité (CLAUDE.md, PROGRESS.md, DECISIONS.md, NEXT_SESSION.md)
- [x] 11 décisions actées, D-001 à D-011
- [x] Projet initialisé à la main : Vite 8, React 19, TypeScript strict, Tailwind v4
- [x] Tokens de la palette néon posés en thème sombre unique dans le `@theme`
- [x] `src/data/invitation.ts` : tout le contenu et tous les textes anglais centralisés
- [x] Décor : ciel étoilé, halos néon animés, boule à facettes et ses rayons, tout en CSS
- [x] Hero : prénom, 9 en dégradé, date, deux boutons, le tout tient sans scroll en 390px
- [x] Compte à rebours à la seconde jusqu'au 5 septembre
- [x] Bloc informations pour les parents (quand, heure, où, déposer ou rester)
- [x] Carte intégrée assombrie, entièrement cliquable, plus bouton « Open in Google Maps »
- [x] Formulaire de réponse avec ses 5 états, message WhatsApp pré-rempli, confettis sur un oui
- [x] Barre d'action fixe en bas sur mobile, qui s'efface quand le formulaire est à l'écran
- [x] Partage natif avec repli sur la copie du lien
- [x] Image d'aperçu WhatsApp générée et allégée à 63 Ko
- [x] Page en noindex, traduction automatique du navigateur bloquée
- [x] Build vert, `tsc` propre, 110 Ko de JS gzippé
- [x] Vérification navigateur réelle en 390px et en 1440px, **0 erreur console, 0 débordement horizontal**
- [x] Poussé sur `github.com/abdoulkaderkebe3-cloud/maelyse`, commit `c9f1ea8` sans co-auteur

## En cours
- [ ] Déploiement Vercel et vérification de l'URL en ligne

## À faire (priorisé)
- [ ] **Renseigner `whatsappNumber` dans `src/data/invitation.ts`** (bloquant, le bouton de réponse est inerte sans lui)
- [ ] **Renseigner `startTime` et `endTime`** (bloquant, un parent ne peut pas s'organiser sans)
- [ ] Repasser l'URL absolue dans la balise `og:image` une fois le domaine Vercel connu
- [ ] Tester le lien sur un vrai téléphone : aperçu WhatsApp, ouverture de Maps, envoi d'une réponse
- [ ] Si le temps le permet : animation d'ouverture d'enveloppe, ajout au calendrier (.ics), galerie photo

## Décisions clés prises (voir DECISIONS.md pour détails)
- D-001 React + Vite + TS + Tailwind v4
- D-002 réponses par WhatsApp pré-rempli, aucun backend
- D-003 direction artistique néon, ambiance disco magique et non « Euphoria »
- D-004 on construit l'invitation, pas la vitrine « Digital Invitations DZ » du brief
- D-005 le RSVP temps réel du brief est abandonné
- D-006 l'échéance du 4 septembre arbitre toutes les décisions
- D-007 site en anglais, textes destinés aux parents
- D-008 animations avec `motion`, coût assumé de 110 Ko gzippés
- D-009 dépôt `maelyse` sur GitHub, déploiement Vercel
- D-010 page en noindex et traduction automatique bloquée
- D-011 carte Google Maps assombrie par filtre CSS

## Pièges rencontrés et solutions
- **Le brief mélangeait deux produits**, une vitrine de service et une invitation → arbitré en D-004 avant d'écrire du code.
- **« RSVP en temps réel » est un piège de calendrier** : deux mots anodins qui imposent une base de données → écarté en D-005.
- **Chrome traduisait la page en français à la volée.** Découvert seulement en regardant l'image d'aperçu générée, qui est sortie en français alors que le HTML est en anglais. Un build vert ne l'aurait jamais montré. → `translate="no"` et meta `notranslate`.
- **La carte Google blanche cassait tout le thème** → filtre CSS d'inversion, l'attribution Google restant visible comme l'exigent ses conditions.
- **Le heredoc bash cale sur du TSX** contenant à la fois des apostrophes, des accolades et des littéraux gabarits → passer par l'écriture directe de fichier pour ces cas.
- **Le hero avait un grand vide sous les boutons**, invisible à la lecture du code, vu à la capture → `justify-center` sur le conteneur.

## Notes importantes pour la prochaine session
Deux champs à remplir dans `src/data/invitation.ts` et l'invitation est prête à partir : `whatsappNumber` et les heures. Les deux sont commentés en gras dans le fichier, impossible de les rater.

Le fichier de contenu est la seule chose à toucher pour changer quoi que ce soit d'affiché. Aucun texte n'est en dur dans un composant.

L'image d'aperçu WhatsApp se régénère depuis `design/og-source.html`, ouvert en 1200x630 dans un navigateur. Attention, il faut vérifier que le navigateur ne la traduit pas avant de capturer.
