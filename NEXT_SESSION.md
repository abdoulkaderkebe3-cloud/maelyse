# NEXT_SESSION.md
> Prompt prêt à coller dans une nouvelle conversation Claude Code

---

Salut Claude, on reprend le travail sur le projet **anniv**.

Lis ces fichiers dans l'ordre pour reconstituer le contexte :
1. `./CLAUDE.md` (constitution du projet)
2. `./PROGRESS.md` (où on en est)
3. `./DECISIONS.md` (15 décisions actées)

**Résumé de la situation :**
Invitation d'anniversaire de **Maelyse Kadyjat, 9 ans**, vraie fête le **samedi 5 septembre 2026** à Abidjan. Le site est **en ligne sur https://maelyse.vercel.app**, dépôt `github.com/abdoulkaderkebe3-cloud/maelyse` relié à Vercel, donc un push sur `main` redéploie.

Page unique en anglais, mobile first, thème nuit néon. Elle s'ouvre sur une **enveloppe cachetée** qu'on touche pour entrer (première visite seulement), puis déroule hero, compte à rebours, informations, déroulé de la journée, carte cliquable vers Google Maps, réponse de présence par WhatsApp pré-rempli, et partage. Animations `motion` au défilement. Une passe de performance a été faite et mesurée à 6x processeur ralenti et 4G lente.

⚠️ **Trois choses bloquent l'envoi du lien aux invités, toutes dans `src/data/invitation.ts` :**
- `whatsappNumber` est vide, donc le bouton de réponse ne fait rien. Format international sans + ni espaces, exemple `2250700000000`.
- `startTime` et `endTime` sont vides, la ligne Time affiche « Time to be confirmed ».
- `plan`, `dressCodeValue` et `giftValue` sont des contenus **proposés par Claude et jamais validés par Kader** (voir D-015). À relire, corriger ou supprimer.

Demande ces trois points à Kader en ouverture de session.

**Prochaine étape concrète :** compléter ces champs, rebuilder, pousser, puis tester le lien sur un vrai téléphone : aperçu WhatsApp, ouverture de Google Maps, envoi d'une vraie réponse de présence.

Confirme-moi que tu as bien lu le contexte avant d'agir.
