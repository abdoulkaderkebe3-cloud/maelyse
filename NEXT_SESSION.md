# NEXT_SESSION.md
> Prompt prêt à coller dans une nouvelle conversation Claude Code

---

Salut Claude, on reprend le travail sur le projet **anniv**.

Lis ces fichiers dans l'ordre pour reconstituer le contexte :
1. `./CLAUDE.md` (constitution du projet)
2. `./PROGRESS.md` (où on en est)
3. `./DECISIONS.md` (choix techniques)

**Résumé de la situation :**
C'est l'invitation d'anniversaire de **Maelyse Kadyjat, 9 ans**, une vraie fête le **samedi 5 septembre 2026** à Abidjan (GPS `5.3310823, -3.9445682`). Une page unique en **anglais**, partagée par lien WhatsApp, qui doit être en ligne **avant le vendredi 4 septembre**. Cette échéance arbitre toutes les décisions.

Tout est cadré et rien n'est codé. Stack : React 19 + Vite + TypeScript strict + Tailwind v4, déploiement Vercel. Direction artistique fixée par Kader avec images de référence : noir profond, violet électrique, pourpre néon, bleu turquoise, touches dorées, halos néon et boule à facettes, titre en serif, ambiance "disco magique" adaptée à une fête de 9 ans. Les réponses de présence partent en **message WhatsApp pré-rempli**, sans backend, décision prise à cause du délai.

Le lien sera ouvert par **les parents des camarades**, pas par les enfants : les textes anglais leur parlent (horaires, adresse, déposer ou rester), le visuel parle à l'enfant.

**Trois informations manquent encore et bloquent la version livrable :** l'heure de début et de fin, le nom du lieu en clair, et le numéro WhatsApp qui reçoit les réponses. Demande-les à Kader en ouverture de session.

**Prochaine étape concrète :** initialiser le projet Vite + React + TS + Tailwind v4, poser les tokens de la palette néon dans le `@theme` de `src/index.css` et créer `src/data/invitation.ts` où vit tout le contenu, puis coder l'écran d'accueil en mobile first à 390px.

Confirme-moi que tu as bien lu le contexte, réclame les informations manquantes, et propose ton plan avant de coder.
