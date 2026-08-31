# NEXT_SESSION.md
> Prompt prêt à coller dans une nouvelle conversation Claude Code

---

Salut Claude, on reprend le travail sur le projet **anniv**.

Lis ces fichiers dans l'ordre pour reconstituer le contexte :
1. `./CLAUDE.md` (constitution du projet)
2. `./PROGRESS.md` (où on en est)
3. `./DECISIONS.md` (choix techniques, 12 décisions actées)

**Résumé de la situation :**
C'est l'invitation d'anniversaire de **Maelyse Kadyjat, 9 ans**, une vraie fête le **samedi 5 septembre 2026** à Abidjan. Le site est **codé, déployé et en ligne sur https://maelyse.vercel.app**, dépôt `github.com/abdoulkaderkebe3-cloud/maelyse` relié au projet Vercel, donc un push sur `main` redéploie.

Page unique en anglais, mobile first, direction artistique nuit néon avec boule à facettes. Compte à rebours, bloc d'informations pour les parents, carte cliquable qui ouvre Google Maps, réponse de présence par message WhatsApp pré-rempli, partage natif. Vérifié au navigateur en 390px et 1440px, 0 erreur console, 0 débordement horizontal.

⚠️ **Le lien ne peut pas encore être envoyé aux invités. Deux champs manquent dans `src/data/invitation.ts` :**
- `whatsappNumber` : sans lui, le bouton de réponse affiche un message d'attente au lieu d'ouvrir WhatsApp. Format international sans + ni espaces, exemple `2250700000000`.
- `startTime` et `endTime` : sans eux, la ligne « Time » affiche « Time to be confirmed ».

**Prochaine étape concrète :** demander ces deux informations à Kader, les inscrire dans `src/data/invitation.ts`, rebuilder, pousser, puis tester le lien sur un vrai téléphone (aperçu WhatsApp, ouverture de Maps, envoi d'une réponse de présence réelle).

Ensuite seulement, et seulement si le temps le permet avant vendredi : animation d'ouverture d'enveloppe, ajout au calendrier (.ics), galerie photo.

Confirme-moi que tu as bien lu le contexte avant d'agir.
