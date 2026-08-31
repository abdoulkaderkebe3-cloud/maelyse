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

---

## D-016 - 2026-08-31 : Le vocabulaire de soirée est retiré, c'est une fête d'enfant

**Correction demandée par Kader :** « c'est une fête d'anniversaire d'un enfant, tu parles de danse sur le site ».

**Il a raison, et l'erreur était déjà identifiée sans être corrigée.** D-003 signalait que la référence « Euphoria » du brief était un univers d'adultes, mais seule l'ambiance visuelle avait été repositionnée. Le vocabulaire du brief, lui, était resté tel quel dans les textes anglais.

**Ce qui a été réécrit :**

| Avant | Après |
|---|---|
| « Nine years of joy, and a dance floor waiting for you. » | « Nine candles, one big cake, and a party that would not be the same without you. » |
| Étape « Dance floor » : « The disco ball goes on and the music does the rest. » | Étape « Games » : « Party games, small prizes, and a lot of laughing. » |
| « Say hello, grab a drink and pick your best pair of sunglasses. » | « Arrive, say hello, and settle in with the other children. » |
| « Anything that shines. Sequins, colours, sunglasses, all welcome. » | « Your favourite party outfit. Bright colours very welcome. » |
| « See you on the dance floor. » | « We cannot wait to celebrate with you. » |
| « It is today. See you tonight! » | « It is today. See you very soon! » |
| Description de partage : « a night of music, lights and cake » | « games, cake and a big birthday celebration » |

**Ce qui n'a PAS changé :** la direction artistique. Le noir, les néons violets et turquoise, la boule à facettes et le sceau doré sont la demande explicite de Kader avec images de référence, et une boule à facettes dans une fête d'enfant est une décoration, pas une ambiance de boîte de nuit. Seuls les mots ont bougé.

**Leçon de méthode :** repérer qu'une référence ne colle pas ne suffit pas, il faut corriger partout où elle a laissé des traces. Ici l'ambiance visuelle avait été rectifiée et les textes oubliés, alors que ce sont les textes que les parents lisent.

**Défaut corrigé au passage :** le retrait des flous d'arrière-plan (D-014) laissait le texte de la page transparaître derrière la barre d'action fixe du bas. Fond rendu entièrement opaque, ce qui est aussi moins coûteux à afficher.

---

## D-017 - 2026-08-31 : Refonte visuelle, ouverture cinématique et gâteau interactif

**Demande de Kader :** « le rendu actuel ne me plaît pas trop, je veux un site incroyable, une animation de départ incroyable, ils doivent être époustouflés ».

**Ce qui a été ajouté :**

1. **Ouverture cinématique.** L'enveloppe arrive de loin en tournant sur trois axes, se stabilise et flotte, entourée de cinq étincelles en orbite et d'un halo qui respire derrière le sceau. À l'appui : onde de choc dorée, le sceau éclate, le rabat bascule en 3D, la lettre monte, puis **elle grandit jusqu'à remplir l'écran** avec un éclair de lumière. On entre littéralement dans la lettre. Environ deux secondes.
2. **Ciel vivant.** Étoiles qui scintillent et **ballons qui montent**, dessinés dans un seul canvas.
3. **Gâteau interactif à neuf bougies.** On touche chaque flamme pour la souffler, un filet de fumée s'échappe, la lueur sur le gâteau faiblit à mesure. Toutes éteintes : confettis et « Wish made! ». Un bouton « Blow them all out » sert de sortie au clavier et aux gros doigts. **C'est le seul endroit du site où l'enfant a quelque chose à faire**, et c'est ce qui fait qu'on remontre l'invitation à ses copains au lieu de la lire une fois.
4. **Bandeau défilant** sous le hero, nom lettre par lettre, titres de section lettre par lettre, reflet mobile sur le grand chiffre, filet de progression du défilement.

---

## D-018 - 2026-08-31 : LE défaut qui expliquait tout, le fond du body

**Symptôme :** Kader trouve le rendu fade. Le décor de fond (ciel, halos, étoiles) est bien dessiné, le canvas contient des pixels lumineux vérifiés au navigateur, mais **rien n'est visible à l'écran**.

**Cause :** `body` avait un fond opaque. Comme `html` en a un aussi, le fond du body n'est plus propagé au viewport : il se peint comme un fond d'élément normal. Or, dans l'ordre de peinture, un fond d'élément passe **par-dessus** les descendants en z-index négatif. Le décor entier, en `-z-10`, était donc recouvert.

**Correction :** `body` en `background: transparent`, le fond sombre restant porté par `html`.

**Pourquoi c'est important au-delà de ce projet :** le défaut ne produit **aucune erreur**, ni au build, ni en console, ni dans les tests. Le code est juste, les éléments existent, ils ont les bonnes dimensions, et ils sont invisibles. Il ne se voit qu'en regardant l'écran. C'est exactement la raison de la règle « on regarde le rendu réel avant d'annoncer qu'une interface est prête ».

---

## D-019 - 2026-08-31 : Mesurer la fluidité, et une erreur de méthode à ne pas refaire

**Contexte :** exigence de Kader, le site ne doit jamais ramer.

**⚠️ ERREUR COMMISE, corrigée ensuite :** les premières mesures donnaient 4 images par seconde au défilement, et l'A/B désignait la **carte Google intégrée** comme responsable, avec un rapport de 1 à 2. J'ai retiré l'iframe sur cette base. **C'était faux.** L'onglet mesuré n'était pas au premier plan, et le navigateur bride les animations des onglets en arrière-plan. Vérification refaite onglet sélectionné : **144 images par seconde avec ou sans l'iframe**. Elle ne coûtait rien.

**Règle qui en découle :** avant toute mesure de fluidité, s'assurer que l'onglet mesuré est bien au premier plan, et **toujours mesurer une page vide dans les mêmes conditions** pour connaître le plafond du navigateur. Ici la page vide monte à 141 images par seconde même avec le processeur ralenti six fois : le plafond n'est donc pas le bridage, et les écarts constatés sont réels.

**Mesures honnêtes, onglet au premier plan :**
- processeur normal : **86 à 145 images par seconde** selon la section, pire image 7 à 42 ms
- processeur ralenti 6 fois, ce qui simule un téléphone très bas de gamme : **18 à 31 images par seconde**

**Optimisation réellement efficace :** les animations infinies **tournent même quand leur section est hors écran**. La page en portait une trentaine en permanence, dont **dix-huit rien que pour les flammes des neuf bougies**, qui brûlaient pendant qu'on lisait l'adresse deux écrans plus bas. Un crochet `useAnimateInView` les met en veille tant que la section n'est pas proche de l'écran. Gain mesuré à 6x sur la section informations : de 14 à 31 images par seconde.

**Autres optimisations retenues :** chaque ballon est pré-dessiné une fois dans un canvas hors écran puis simplement recopié, au lieu de recréer un dégradé radial et trois chemins par ballon et par image ; le canvas est en un pixel par point CSS ; le dessin est plafonné à 30 images par seconde ; la boucle s'arrête quand l'onglet passe en arrière-plan.

**La carte intégrée n'est pas revenue** malgré la correction, mais pour de vraies raisons cette fois : le geste attendu est d'ouvrir Google Maps, la carte était recouverte d'un lien donc inutilisable sur place, elle jurait en gris au milieu d'une page nuit, et c'est une intégration tierce qui télécharge ses propres scripts et tuiles sur une 4G moyenne. Elle est remplacée par un repère dessiné, sans rue inventée, avec les coordonnées réelles.

---

## D-020 - 2026-08-31 : Les ballons restent sombres, à cause du contraste

**Décision :** la palette des ballons est volontairement sombre (fuchsia foncé, violet profond, sarcelle, ambre brûlé, framboise), avec un petit reflet blanc net qui suffit à faire lire la forme.

**Raison :** le décor passe **derrière le texte**. Un ballon doré clair derrière une ligne de texte fait tomber le contraste autour de 2:1, très en dessous du seuil lisible. Avec des teintes sombres, la luminance moyenne reste basse et le texte garde son contraste. La phrase du hero est passée de `muted` à `silver` pour la même raison.

**Les cartes de contenu ont aussi été opacifiées** (de 50% à 85%) : un ballon qui traversait le formulaire de réponse gênait la lecture et faisait négligé.

---

## D-021 - 2026-08-31 : `src/config.ts`, fichier de configuration unique

**Décision :** `src/data/invitation.ts` est remplacé par `src/config.ts`, découpé en sections numérotées : palette, fête, lieu, jeu, son, programme, textes. Rien d'autre ne contient de valeur modifiable.

**Raison :** la règle du projet était déjà « tout le contenu dans un seul fichier », mais les couleurs vivaient dans le CSS, les réglages du son et du jeu dans leurs composants. Le fichier unique va plus loin : **il rend le site réutilisable pour un autre anniversaire en ne touchant qu'un fichier**, ce qui a une valeur au-delà de cette fête.

**Conséquence :** la palette est injectée en variables CSS au démarrage par `src/lib/palette.ts`, au lieu d'être figée dans le bloc `@theme` de Tailwind.

---

## D-022 - 2026-08-31 : Ouverture cinématique, son d'ambiance et jeu des neuf étincelles

**Contexte :** cette refonte a été réalisée en fin de session précédente et n'avait **jamais été commitée ni documentée**. Elle a été retrouvée dans l'arbre de travail à la reprise du 2026-08-31 au soir.

**Ce qui a changé :**
- `Envelope.tsx` devient `Intro.tsx` : ouverture plus longue et plus construite, toujours à la première visite seulement.
- **Son d'ambiance** (`src/lib/sound.ts`, `SoundToggle`) : boîte à musique discrète, jamais en lecture automatique, démarrée au premier geste de l'invité, coupable en un appui.
- **Jeu des neuf étincelles** : huit sont cachées dans la page, la neuvième se gagne en soufflant les bougies. Trouver les neuf déclenche `Victory` et les feux d'artifice. L'état est partagé par `PartyContext` et retenu d'une visite à l'autre.

**Raison du jeu :** le site s'adresse aux parents pour l'information, mais l'enfant qui regarde par-dessus l'épaule n'avait rien à faire après le gâteau. Neuf étincelles pour neuf ans donnent une raison de parcourir toute la page, donc de lire toutes les informations.

**Piège à retenir :** un travail non commité n'existe pas. Deux heures de refonte ne tenaient qu'au disque local, sans trace dans le journal du projet.

---

## D-023 - 2026-08-31 : 14h, et aucune heure de fin annoncée

**Décision :** la fête commence à **14h** (`2:00 PM`). Kader a choisi de **ne pas annoncer d'heure de fin**. La ligne Time affiche donc « From 2:00 PM » et non une plage.

**Comment c'est codé :** `party.endTime` reste volontairement vide et `Details` gère trois cas : plage complète, heure de début seule, rien du tout. Renseigner `endTime` plus tard suffit à faire réapparaître la plage, sans toucher au composant.

**Réserve exprimée :** l'heure de fin est la première question qu'un parent se pose pour s'organiser, et le CLAUDE.md du projet en faisait une information indispensable. Kader a tranché en connaissance de cause. Si un parent la demande par message, c'est une ligne à remplir.

**Effet de bord corrigé :** `dateISO` passe de 15h à **14h UTC**, la Côte d'Ivoire étant sur GMT. Le compte à rebours visait une heure fausse d'une heure.

---

## D-024 - 2026-08-31 : Retrait du formulaire de réponse et de la ligne « For parents »

**Décision de Kader :** on retire **la section de réponse de présence entière** et **la ligne « For parents »** du bloc d'informations.

**Ce que ça change :**
- `Rsvp.tsx` est supprimé, ainsi que le bloc `rsvp` de la configuration (numéro WhatsApp, nombre d'adultes) et tous les textes du formulaire.
- Le **numéro WhatsApp n'est plus une information bloquante**. Il ne reste plus rien qui empêche d'envoyer le lien.
- Le hero passe de deux boutons à **un seul, « See the place »**, qui descend vers le lieu. La barre fixe basse pointe au même endroit et disparaît quand le bloc du lieu est à l'écran.
- La description Open Graph ne promet plus de répondre.

**Conséquence assumée :** le site n'offre plus aucun moyen de confirmer sa venue. Les réponses se feront hors du site, dans la conversation WhatsApp où le lien est partagé. L'objectif 2 du projet (« Il répond ») tombe, l'invitation devient purement informative.

**Ce qui reste malgré tout :** la natation impose une information pratique. La ligne « Dress code » devient **« What to bring »** et demande maillot, serviette et rechange. Ce n'est pas une ligne pour les parents, c'est ce qu'un enfant doit avoir dans son sac.

---

## D-025 - 2026-08-31 : Le programme dit enfin ce qui va se passer

**Décision :** les deux activités confirmées par Kader sont **la natation** et **la poterie**. Le programme devient : accueil, natation, poterie, gâteau.

**Ce qui a été retiré :** « Games » et « Photos », inventés par Claude en D-015 et jamais validés. Un programme faux est pire qu'un programme court.

**Ce qui reste une proposition :** l'accueil et le gâteau, qui vont de soi pour un anniversaire de 9 ans.

**Toujours sans horaires**, pour la raison déjà actée : annoncer « 16h le gâteau » et ne pas le tenir, c'est dix parents à la porte au mauvais moment.

---

## D-026 - 2026-08-31 : Le lieu affiché, c'est « Abidjan », rien de plus

**Décision de Kader :** le lieu affiché se réduit à **« Abidjan »**. `venue.address` est vidé, la précision est portée uniquement par le bouton Google Maps, qui pointe sur les vraies coordonnées.

**Ce que ça implique dans le code :** l'adresse devient facultative. `Details` affiche « nom — adresse » si l'adresse existe, le nom seul sinon ; `Location` masque la ligne d'adresse quand elle est vide. Remplir `venue.address` plus tard suffit à la faire réapparaître, sans toucher aux composants.

**Réserve exprimée, et écartée par Kader :** un parent qui prend un taxi ne peut rien dire au chauffeur avec « Abidjan » seul, il devra ouvrir Maps. Kader a tranché en connaissance de cause, l'invitation part dans un groupe où les gens se connaissent.

**Le champ n'est plus marqué ⚠️** dans `src/config.ts` : ce n'est plus une valeur par défaut oubliée, c'est un choix.

---

## D-027 - 2026-08-31 : Le gâteau et le compte à rebours, quatre défauts que seul l'œil voyait

**Contexte :** Kader signale « un souci au niveau du gâteau », puis « des traits noirs » sur le compte à rebours. Aucun des quatre défauts ne produisait d'erreur, ni au build, ni en console.

**1. Les bougies des extrémités flottaient à côté du gâteau.** La rangée de neuf boutons mesurait 268 px, exactement la largeur de l'étage du BAS, alors que l'étage du HAUT n'en faisait que 176. Les boutons `w-8` ne tenaient pas dans la largeur et **flex les avait rétractés** de 32 à 27 px pour remplir toute la ligne, ce qui masquait le problème dans le code : rien n'indiquait un débordement, la rangée était simplement trop large pour le glaçage. Correction : la rangée est **contrainte à 220 px** et centrée, l'étage du haut passe à 236 px, il l'englobe donc franchement.

**2. Les deux étages avaient presque la même largeur.** Après le premier essai, 248 px contre 300, l'ensemble ne lisait plus comme un gâteau mais comme deux boîtes empilées. Le gâteau est élargi à 320 px et l'étage du haut ramené à 236 : **84 px d'écart**, soit 42 de chaque côté, l'étagement redevient lisible.

**3. Les coulures de l'étage du bas formaient une rangée de dents sombres** suspendues au-dessus du plat, dans la même couleur que le bas du gâteau. Supprimées : le glaçage coule du haut vers le bas, un étage inférieur ne dégouline pas sur son plat.

**4. Le plat ne débordait qu'à droite.** Il fait 108 % de la largeur du gâteau et était centré par `mx-auto`. **Des marges automatiques ne deviennent jamais négatives** : sur un élément plus large que son parent, `mx-auto` le laisse collé à gauche. Remplacé par `left-1/2` et `-translate-x-1/2`, débordement mesuré à 13 px de chaque côté.

**5. Le compte à rebours était barré d'un trait noir.** Chaque tuile portait un filet `bg-night/70`, donc quasi noir, en travers du milieu, censé imiter la charnière d'un tableau de gare. Sur un chiffre doré en serif, ça ne se lit pas comme une charnière mais comme une barre noire qui coupe le chiffre. Retiré : la bascule du volet raconte déjà le mécanisme.

**Ce qu'il faut en retenir :** une intention de dessin ne se valide pas dans le code, elle se valide à l'écran. Les cinq défauts venaient de valeurs parfaitement cohérentes prises isolément, et fausses les unes par rapport aux autres. Trois d'entre eux sont des rapports de largeur, que seule une mesure des rectangles réels a permis de constater.

---

## D-028 - 2026-08-31 : L'ouverture prend son temps, et devient interruptible

**Demande de Kader :** « après l'enveloppe tu peux rendre l'animation plus longue ».

**Ce qui n'allait pas, mesuré :** le grand « 9 » finissait d'apparaître à 2630 ms et le départ se déclenchait à 2650. **L'image assemblée existait vingt millisecondes.** Toute la mise en scène menait à un tableau que personne n'avait le temps de regarder. Le défaut n'était pas la vitesse des mouvements, c'était l'absence totale de temps de pause.

**Nouveau minutage**, regroupé dans une constante `BEAT` en tête de `Intro.tsx` pour qu'on n'ait plus à chasser des `delay` dans le JSX :

| Repère | Avant | Après |
|---|---|---|
| Le prénom commence à s'assembler | 780 ms | 780 ms |
| Tout est assemblé et immobile | 2630 ms | 3380 ms |
| Départ | 2650 ms | 4400 ms |
| Page rendue | 3350 ms | 5300 ms |

Le temps de pause passe donc de **20 ms à environ une seconde**. Mesure réelle au navigateur : ouverture complète en 5474 ms.

**Contrepartie obligatoire, le raccourci.** Dès que la séquence est lancée, **un appui n'importe où l'abrège** (67 ms mesurés entre l'appui et la page). Un discret « Tap to skip » apparaît à 2200 ms, une fois le prénom en place : le proposer d'emblée reviendrait à s'excuser de son propre décor. Une animation plus longue n'a le droit d'exister que si on peut en sortir.

**`prefers-reduced-motion` est inchangé** : pour ces visiteurs, l'appui sur l'enveloppe ouvre directement la page, sans aucune séquence.

---

## D-029 - 2026-08-31 : L'ouverture se rejoue à chaque chargement

**Demande de Kader :** « quand on actualise le site on doit revenir à l'animation de départ ».

**Ce qui change :** **D-013 est annulée.** Une clé de stockage local (`maelyse-intro-seen-v2`) retenait la première visite et les suivantes arrivaient directement sur l'invitation. Elle est supprimée, et volontairement pas remplacée : plus aucune mémoire, l'ouverture se joue à chaque chargement de la page.

**L'argument de D-013 était réel** et il reste vrai : un parent qui rouvre le lien le jeudi pour revérifier l'adresse retraverse l'ouverture. Kader a tranché en connaissance de cause.

**Ce qui rend le choix tenable, et qui n'existait pas quand D-013 a été prise :**
- l'enveloppe **attend un appui**, elle ne part jamais toute seule, donc personne ne subit une animation qu'il n'a pas déclenchée ;
- **un appui n'importe où abrège la séquence** (D-028). Un parent pressé touche deux fois l'écran et il est sur la page.

**Piège évité au passage :** le clic qui ouvre l'enveloppe remontait au voile qui porte désormais le raccourci, et aurait donc déclenché « passer » dans la foulée du même geste. `stopPropagation` sur l'ouverture règle le cas.

---

## D-030 - 2026-08-31 : Le décor ne coûte rien, mesuré une deuxième fois

**Demande de Kader :** vérifier que le décor ne fait pas ramer la page.

**Première série, fausse.** Elle donnait le décor à 21 ms par image sur 83, soit un quart du coût. **L'erreur : chaque condition était mesurée à la suite, sans rechargement.** La première passe de défilement déclenche toutes les animations d'apparition de la page, les suivantes n'ont plus à les faire. Je comparais donc une passe chargée à des passes déjà réchauffées, et l'écart mesuré n'était pas celui du décor mais celui de l'ordre des mesures.

**Deuxième série, protocole corrigé** : onglet focalisé et visible, une passe de chauffe systématiquement jetée, mesure sur la passe suivante, processeur bridé 4 fois, défilement continu de toute la page.

| | Image médiane | Pire image | Images > 50 ms |
|---|---|---|---|
| Avec le décor | 28,0 ms (36 i/s) | 90,5 ms | 6 sur 150 |
| Sans le décor | 28,4 ms (35 i/s) | 83,4 ms | 7 sur 149 |

**Le décor est gratuit.** Les optimisations de D-019 ont fait leur travail : ballons pré-dessinés une fois dans un canvas hors écran puis recopiés, canvas à un pixel par point CSS, dessin plafonné à 30 images par seconde, boucle arrêtée quand l'onglet passe en arrière-plan.

**Sans bridage** : 141 images par seconde médianes, pire image 27,8 ms, **aucune image au-delà de 33 ms**. Page vide de référence dans les mêmes conditions : 145 images par seconde, ce qui confirme que le plafond du navigateur n'est pas en cause.

**La règle de méthode, deux fois apprise :** ne jamais comparer deux mesures de fluidité prises à la suite sur la même page. Recharger, ou au minimum jeter une passe de chauffe. Une page qui vient d'être parcourue n'est plus dans le même état que la première fois.

---

## D-031 - 2026-08-31 : Dépouillement, parce que la page ressemblait à un site généré

**Ce que Kader a dit :** « ça ressemble trop à un site vibe codé, il y va de ma crédibilité ».

**Le diagnostic, et il compte plus que la correction :** aucun élément n'était raté isolément. C'est l'**accumulation** qui trahit une page générée. Sept choses bougeaient en même temps, chaque bloc avait son halo, chaque couleur son dégradé. La retenue est ce qui distingue un travail de designer d'un empilement d'effets, et une machine n'empile pas par erreur, elle empile parce que rien ne lui coûte d'ajouter.

**Ce qui a été retiré :**

- **Le bandeau défilant.** Il répétait en boucle « Maelyse · turns 9 · September 5th · you are invited », c'est-à-dire mot pour mot ce que le hero dit juste au-dessus. C'est le motif numéro un des pages générées.
- **Le dégradé arc-en-ciel animé du grand « 9 »**, dans le hero et dans l'ouverture. Remplacé par un or plein. Le chiffre gagne en présence en perdant son effet.
- **Le balayage lumineux des tuiles du compte à rebours.** Quatre tuiles côte à côte, donc quatre projecteurs qui passaient en permanence pendant qu'on essayait de lire quatre nombres.
- **Les boutons en dégradé magenta vers violet avec halo néon**, l'autre grande signature. Remplacés par un aplat or avec texte sombre.
- **Le jeu des neuf étincelles en entier** : les huit étincelles cachées, le compteur, l'écran de victoire, les feux d'artifice. Cinq composants supprimés, et la moitié de `PartyContext`.
- **Les lueurs superflues** : l'onde qui pulsait sous le repère du lieu, les trois anneaux qui palpitaient, l'ombre néon de la carte, le halo du pin.

**Ce qui reste, et pourquoi :** l'ouverture à l'enveloppe (c'est le seul vrai moment de mise en scène, et il est demandé), le gâteau à souffler (la seule chose que l'enfant peut faire), le ciel et les ballons (ils sont derrière le texte, pas dessus, et ils ne coûtent rien, voir D-030), la boule à facettes (elle porte la direction artistique de D-003).

**Le contraste s'améliore au passage.** Le bouton principal était du texte blanc sur un dégradé magenta, soit environ 2,6:1, très en dessous du seuil AA que le projet s'impose. L'aplat or avec texte `#1f0b3a` monte à environ 14:1.

**Et la fluidité double.** Processeur bridé 4 fois, même protocole que D-030 :

| | Image médiane | Pire image | Images > 50 ms |
|---|---|---|---|
| Avant dépouillement | 28,0 ms (36 i/s) | 90,5 ms | 6 sur 150 |
| Après | **13,8 ms (72 i/s)** | 55,4 ms | 1 sur 370 |

Le paquet passe de 382,6 à 370,6 Ko, la feuille de style de 55,4 à 48,0 Ko.

**Ce qu'il faut en retenir :** les effets ne se paient pas qu'en crédibilité, ils se paient aussi en millisecondes. Retirer ce qui ne servait à rien a rendu la page deux fois plus fluide sans qu'on optimise quoi que ce soit.

---

## D-032 - 2026-08-31 : Le compteur « 1 / 9 » était la preuve du problème

**Ce qui s'est passé :** Kader a demandé « le 1/9 sert à quoi ? ». C'est le compteur du jeu des étincelles, posé dans le coin haut droit de sa propre invitation.

**Pourquoi c'est la bonne question :** si le propriétaire du site doit demander à quoi sert un élément de son interface, un parent qui reçoit le lien sur WhatsApp ne se le demandera même pas, il l'ignorera. Un élément d'interface qui a besoin d'être expliqué et qui ne l'est pas est un élément à retirer.

**La leçon, pour les prochains projets :** le jeu était une bonne idée mal introduite. Il a été ajouté en D-022 sans jamais être validé par Kader, et sans une seule ligne à l'écran pour l'annoncer. Une fonctionnalité que personne n'a demandée et que rien n'explique finit toujours par être un élément décoratif de plus.
