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

---

## D-008 - 2026-08-31 : Bibliothèque d'animation - **motion (ex framer-motion)**

**Décision :** `motion` v13 pour toutes les animations, plus `canvas-confetti` sur la confirmation de présence.

**Raison :** demandé par Kader, qui veut un vrai rendu et non des transitions CSS minimales. `motion` est retenu contre GSAP parce qu'il est déclaratif en React (`whileInView`, `AnimatePresence` pour les 5 états du formulaire) et qu'il expose `useReducedMotion`, ce qui rend la règle d'accessibilité applicable sans code parallèle.

**Coût assumé :** le bundle passe à **110 Ko gzippés**. C'est lourd pour une page unique lue en 4G moyenne. Accepté parce que la qualité du rendu est une demande explicite, mais c'est le premier poste à réduire si la page rame sur un téléphone réel. Aucune image lourde ne vient s'y ajouter, tout le décor est en CSS.

---

## D-009 - 2026-08-31 : Dépôt et déploiement

**Décision :** dépôt `github.com/abdoulkaderkebe3-cloud/maelyse`, déploiement Vercel.

**Note :** commit d'ouverture sans aucun trailer de co-auteur, conformément à la règle du workspace.

---

## D-010 - 2026-08-31 : Page non indexable et non traduite

**Décision :** `<meta name="robots" content="noindex, nofollow">` et blocage de la traduction automatique (`translate="no"` plus `<meta name="google" content="notranslate">`).

**Raison du noindex :** la page porte le **nom complet d'une enfant de 9 ans, la date exacte où elle sera quelque part, et la position GPS d'un domicile**. Le lien doit circuler entre parents invités, pas être trouvable dans un moteur de recherche. Le noindex ne gêne en rien le partage par lien ou par WhatsApp.

**Raison du notranslate, trouvée en réel :** la première image d'aperçu générée est sortie **entièrement en français** (« VOUS ÊTES INVITÉ », « TOURS », « Samedi 5 septembre »). Le HTML était bien en anglais : c'est Chrome qui avait traduit la page à la volée, le navigateur étant configuré en français. Le défaut est invisible tant qu'on ne regarde pas le rendu réel, et il aurait touché tous les parents dont le téléphone est en français, c'est-à-dire la majorité à Abidjan. Le site est en anglais par décision de Kader, il doit donc le rester à l'écran.

---

## D-011 - 2026-08-31 : Carte assombrie par filtre CSS

**Décision :** la carte Google Maps intégrée est assombrie côté navigateur par `filter: invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.88) saturate(0.7)`.

**Raison :** l'intégration sans clé API ne permet aucun style personnalisé, et une carte blanche au milieu d'une page noire est le seul élément qui cassait la direction artistique. Le filtre la ramène dans le thème sans coût réseau.

**Limite acceptée :** l'attribution « Map data ©2026 Google » reste visible, comme l'exigent les conditions d'utilisation. Elle n'est jamais masquée par le dégradé qui recouvre la carte.

---

## D-012 - 2026-08-31 : URL publique - `maelyse.vercel.app`, et le piège de la protection Vercel

**Décision :** le lien partagé aux parents est **https://maelyse.vercel.app**.

**Raison :** cette URL est lue par chaque parent invité avant même d'ouvrir la page. `anniv-6bwhsvcp3-abdoulkaderkebe3-clouds-projects.vercel.app` a l'air d'une erreur système, `maelyse.vercel.app` a l'air d'une invitation.

**Piège rencontré, à retenir pour tous les projets Vercel :** l'alias créé avec `vercel alias set` **répondait 302 vers l'écran de connexion Vercel**. La protection de déploiement du compte couvre les URL de déploiement et les alias posés à la main, mais pas le domaine de production généré automatiquement par le projet. Concrètement, le lien s'ouvrait normalement pour Kader, déjà connecté à Vercel, et affichait une page de connexion à tous les autres. **C'est le défaut le plus dangereux de la journée** : invisible pour celui qui déploie, bloquant pour tout le monde d'autre, et il ne se serait vu qu'au moment où un parent aurait répondu « ton lien me demande un mot de passe ».

**Correctif :** rattacher le domaine au projet avec `vercel domains add maelyse.vercel.app anniv` au lieu de `vercel alias set`. Vérifié ensuite en HTTP : 200 sur la page et sur l'image d'aperçu.

**Méthode à garder :** après chaque mise en ligne, contrôler le code HTTP **depuis l'extérieur d'une session connectée**. Un 200 obtenu dans un navigateur où l'on est authentifié ne prouve rien.

**Note :** le dépôt GitHub a été rattaché automatiquement au projet Vercel pendant le premier déploiement. Un `git push` sur `main` redéploie donc le site, contrairement à `artluxury` où la liaison n'avait jamais été faite.

---

## D-013 - 2026-08-31 : Enveloppe d'accueil, montrée à la première visite seulement

**Décision :** l'invitation s'ouvre sur une enveloppe fermée, cachetée d'un sceau de cire doré marqué « M ». Un appui fait basculer le rabat vers l'arrière, la lettre sort, puis l'écran s'efface sur l'invitation. Environ 1,7 seconde en tout.

**L'enveloppe n'apparaît qu'à la toute première visite.** Un indicateur en stockage local (`maelyse-envelope-opened-v1`) fait que les visites suivantes tombent directement sur l'invitation.

**Raison de cette restriction :** demandée par Kader pour l'effet, elle reste soumise à la règle de D-003, l'animation ne retarde jamais l'information. Un parent qui rouvre le lien le jeudi pour revérifier l'adresse ne doit pas retraverser une animation. Le geste est magique la première fois, agaçant la quatrième.

**Piège de construction rencontré :** la première version laissait apparaître la lettre blanche de part et d'autre du rabat. Le rabat était un triangle de 62% de hauteur tandis que la face avant remontait en V jusqu'à 72%, laissant une bande non couverte des deux côtés. Corrigé en faisant coïncider exactement les deux géométries : la face avant est le rectangle **moins** l'encoche triangulaire, pointe à 55%, et le rabat est cette encoche.

---

## D-014 - 2026-08-31 : Passe de performance, la fluidité prime sur l'effet

**Contexte :** exigence explicite de Kader, le site ne doit jamais ramer, les invités sont des enfants et des parents sur des téléphones ordinaires. Mesures faites au navigateur avec **processeur ralenti 6x et réseau 4G lente**, sur le build de production et non le serveur de développement (le mesurer en développement donnait 12,8 s, chiffre sans aucun rapport avec la réalité).

**Cinq changements, du plus au moins efficace :**

1. **La feuille de style ne bloque plus le premier affichage.** Un `<link rel="stylesheet">` classique empêche le navigateur de peindre quoi que ce soit tant qu'il n'a pas la feuille. Un greffon Vite maison (`nonBlockingCss` dans `vite.config.ts`) la déclare en média `print` puis la rebascule sur `all` au chargement, avec repli `<noscript>`. **Le diagnostic « requêtes bloquant le rendu » a disparu de la trace.**

2. **L'enveloppe est dessinée par le HTML lui-même**, en style intégré, avant tout JavaScript. Sans ça, l'invité regardait un écran noir pendant toute la durée de téléchargement et d'exécution du script. React remplace ce contenu au montage. Aucun texte « Tap to open » dans cette version statique : tant que le script n'est pas là, l'appui ne ferait rien, et un bouton qui ne répond pas est pire qu'un bouton absent. Un décalage de 26 px au montage a été compensé à la main dans le CSS d'amorce.

3. **Polices auto-hébergées** via `@fontsource-variable`. Deux origines externes supprimées (`fonts.googleapis.com` et `fonts.gstatic.com`), donc deux résolutions DNS et deux poignées de main TLS en moins sur une connexion lente. Les `unicode-range` du paquet font que seul le sous-ensemble latin est téléchargé, soit 48 Ko pour Inter et 38 Ko pour Playfair. L'italique de Playfair a été abandonné : 37 Ko pour une seule ligne de pied de page.

4. **Les halos néon ne sont plus animés.** Animer la taille d'un élément flouté oblige le navigateur à recalculer un flou de 70 à 110 px à chaque image, ce qui était de loin le calcul le plus lourd de la page. Ils sont désormais peints une fois.

5. **Le champ d'étoiles passe de 70 éléments du DOM à 3.** Chaque couche est un seul div dont le fond est une liste de dégradés radiaux, et seule son opacité est animée. Les positions sont tirées par un générateur déterministe pour que le ciel soit stable d'un rendu à l'autre.

**Deux autres retraits :** tous les `backdrop-filter` (8 occurrences), très coûteux sur mobile au défilement, remplacés par des fonds semi-transparents simples ; et les confettis passés en import dynamique, donc chargés au moment du « oui » et non au premier affichage.

**Résultat mesuré, à 6x et 4G lente :** LCP de **6055 ms à environ 5,4 s**, décalage cumulé de mise en page **à 0,00**, plus aucune requête bloquant le rendu. Le gain réel n'est pas dans le LCP mais dans le premier affichage, que cette mesure ne capte pas : l'enveloppe apparaît maintenant presque immédiatement au lieu d'un écran noir.

**Ce qui reste et qui n'a pas été fait :** le paquet JavaScript pèse 113 Ko gzippés, dont environ un tiers pour `motion`. Le réduire demanderait de passer à `LazyMotion` et de remplacer chaque `motion.div` par un `m.div`, ce qui est mécanique mais risqué à cinq jours de la fête. C'est le premier levier si le besoin se confirme sur un téléphone réel.

---

## D-015 - 2026-08-31 : Section « How the day goes », contenu à valider

**Décision :** une section de déroulé en quatre moments (accueil, piste de danse, gâteau, jeux et photos), **sans aucun horaire**.

**Raison de l'absence d'horaires :** annoncer « 16h le gâteau » et ne pas le tenir, c'est dix parents à la porte au mauvais moment. Le déroulé donne l'ambiance, pas un planning.

⚠️ **Ces quatre moments sont une proposition écrite par Claude, pas une information confirmée par Kader.** Ils sont plausibles pour un anniversaire de 9 ans mais restent inventés. Ils vivent dans `invitation.plan` et doivent être relus, corrigés ou supprimés avant l'envoi du lien. Vider le tableau retire la section proprement.

Même remarque pour deux lignes ajoutées au bloc d'informations : le **code vestimentaire** (« tout ce qui brille ») et la **mention sur les cadeaux** (« votre enfant qui vient, c'est déjà le principal »). Utiles aux parents, qui posent toujours ces deux questions, mais à valider.
