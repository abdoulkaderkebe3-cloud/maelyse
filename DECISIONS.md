# DECISIONS.md
> Historique des choix techniques et leurs raisons.

---

## D-001 - 2026-08-31 : Choix de la stack technique

**Décision :** React 19 + Vite + TypeScript strict + Tailwind CSS v4.

**Raison :** demandé par Kader. C'est aussi la stack de `artluxury` et de `gshop`, donc les réflexes sont déjà en place (tokens dans le `@theme` de `index.css`, pas de `tailwind.config.js`, build vérifié en TS strict). Pour une page unique, Vite démarre en quelques secondes et le build sort sous les 100 Ko.

**TypeScript ajouté au brief initial :** Kader avait dit "react, vite, tailwindcss" sans préciser. TypeScript est mis par défaut parce que c'est sa convention sur tous les autres projets du workspace et que le coût est nul sur un projet de cette taille.

**Alternatives écartées :**
- Next.js : le rendu serveur n'apporte rien à une page statique, et le déploiement Vercel d'un Vite est tout aussi simple.
- HTML/CSS pur : suffisant techniquement, mais rend le compte à rebours et le formulaire plus pénibles à écrire, et ne montre rien dans un portfolio.

---

## D-002 - 2026-08-31 : Destination des réponses RSVP - **TRANCHÉE : WhatsApp pré-rempli, aucun backend**

**Décision :** le formulaire construit un message en anglais ("Hi! Aya will be at Maelyse's birthday, coming with 1 adult") et ouvre WhatsApp vers le numéro de l'organisateur via `https://wa.me/<numero>?text=<message>`. Aucune base de données, aucune clé, aucun compte.

**Raison :** l'échéance est à J-5 (voir D-006). L'option Supabase demandait une table, des règles RLS correctes, un écran d'administration et des tests de sécurité, soit une journée de plus, sur le chemin critique, pour une fête d'enfant où l'organisateur comptera de toute façon les réponses lui-même. C'est aussi la solution retenue sur `gshop`, et c'est le canal que les parents utilisent déjà.

**Contre :** aucune liste consolidée, les réponses arrivent en conversation WhatsApp. Accepté.

**Alternatives écartées :**
- **Supabase** : la bonne solution s'il y avait deux semaines. Le piège qui aurait coûté cher : la clé publique vit dans le navigateur, donc sans RLS interdisant la lecture, n'importe qui avec le lien lit la liste complète des invités d'une fête d'enfant. À reprendre en v2 seulement si le projet devient un vrai produit.
- **Google Forms** : casse le design au seul moment qui compte, celui où l'invité clique.

---

## D-003 - 2026-08-31 : Direction artistique - **TRANCHÉE**

**Décision :** nuit électrique et haut de gamme. Fond noir profond, dégradés violet électrique / pourpre néon / bleu turquoise, touches dorées et argentées sur les détails et les boutons. Halos néon, texture de boule à facettes discrète en arrière-plan, étoiles scintillantes, typographie de titre en serif, animation d'ouverture d'enveloppe.

**Raison :** direction fournie directement par Kader, avec images de référence et un brief rédigé. La palette n'est pas à rediscuter.

**Un ajustement fait sur l'ambiance, pas sur la palette :** le brief citait "Euphoria" comme référence. La palette tient parfaitement, mais l'univers de cette série est celui d'adolescents et d'adultes, et l'invitation est celle d'une fête de 9 ans lue par des parents. Le positionnement retenu est donc **soirée disco magique** : mêmes couleurs, mêmes néons, mêmes paillettes, registre "pop star et boule à facettes" plutôt que "soirée d'adultes". Aucune couleur ne change, seuls le vocabulaire anglais et le choix des images bougent.

**Ce que la direction implique concrètement :**
- Tokens en **thème sombre unique**, pas de mode clair. Exception assumée au thème double du workspace.
- **Contraste AA maintenu** : le violet saturé sur noir tombe autour de 3:1, donc il porte les fonds, halos et bordures, jamais le texte courant. Le texte est blanc, doré clair ou turquoise clair.
- Néons, scintillements et particules coûtent cher sur un téléphone d'entrée de gamme, qui est l'appareil de l'invité moyen. `transform` et `opacity` uniquement, coupure sous `prefers-reduced-motion`, page lisible sans aucune animation.
- **L'ouverture d'enveloppe ne retarde jamais l'information** : elle se saute au premier tap et ne se rejoue pas d'une visite à l'autre.

---

## D-004 - 2026-08-31 : Nature du produit - **TRANCHÉE : une invitation réelle, pas une vitrine de service**

**Contexte :** le brief transmis décrivait "Digital Invitations DZ", un **service** de faire-part numériques, tout en listant les fonctionnalités **d'une invitation** (compte à rebours, RSVP, galerie, Maps). Ce sont deux produits différents : une vitrine vend (exemples, tarifs, contact), une invitation informe et collecte.

**Décision :** on construit **l'invitation**. Kader a donné le prénom, l'âge, la date et le lieu réels : c'est une vraie fête, le samedi 5 septembre 2026, pour Maelyse Kadyjat, 9 ans, à Abidjan.

**Le brief "Digital Invitations DZ" est donc utilisé comme référence visuelle et fonctionnelle, pas comme cahier des charges de produit.** Le "DZ" (Algérie) n'est pas repris, la fête est à Abidjan.

**Note pour plus tard :** si l'invitation plaît, elle est le meilleur argument commercial d'un service du même type en Côte d'Ivoire. Une invitation réussie et cliquable vend mieux qu'une page de tarifs. Ce serait un projet distinct, à ouvrir après le 5 septembre.

---

## D-005 - 2026-08-31 : Le "RSVP en temps réel" du brief est abandonné

**Décision :** la confirmation de présence en temps réel demandée dans le brief n'est pas implémentée. Elle est remplacée par le message WhatsApp de D-002.

**Raison :** "temps réel" impose une base de données, donc Supabase, donc des règles RLS, donc du temps qu'on n'a pas à J-5. La valeur pour l'organisateur est identique : il sait qui vient. Seule la forme change, un fil de messages au lieu d'un tableau.

---

## D-006 - 2026-08-31 : La date de la fête est l'arbitre de toutes les décisions

**Décision :** toute décision ultérieure se tranche en faveur de ce qui est en ligne le **vendredi 4 septembre au plus tard**. Une fonctionnalité qui met l'échéance en risque est reportée sans discussion.

**Raison :** le projet est ouvert le 31 août pour une fête le 5 septembre. Une invitation livrée après la fête vaut zéro, quelle que soit sa qualité. Les fonctionnalités sont donc classées en indispensables et souhaitables dans le CLAUDE.md du projet, et les souhaitables ne sont abordées qu'une fois les indispensables en ligne et vérifiées au navigateur.

---

## D-007 - 2026-08-31 : Site en anglais, mais des textes écrits pour des parents

**Décision :** toute l'interface est en anglais, sur demande de Kader. Les fichiers de travail (CLAUDE.md, PROGRESS.md, DECISIONS.md) restent en français.

**Point de méthode qui découle du destinataire réel :** l'invitée a 9 ans, mais le lien est ouvert par **les parents de ses camarades**, qui lisent, décident et répondent. Les textes anglais leur parlent (horaires précis, adresse, faut-il rester ou déposer), pendant que le visuel parle à l'enfant. Le formulaire demande le **nom de l'enfant**, pas celui de l'adulte qui remplit.

Anglais simple et chaleureux, pas de tournures compliquées : à Abidjan, une partie des parents lira une langue qui n'est pas la leur au quotidien.
