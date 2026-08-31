# PROGRESS.md
> Dernière mise à jour : 2026-09-01 00:40

## État global
**L'invitation est complète côté contenu.** Kader a donné l'heure (14h), les deux activités (natation et poterie), et a décidé de retirer le formulaire de réponse et la ligne « For parents ».

**Plus rien ne bloque l'envoi du lien.** Le dernier point ouvert, le nom du lieu, est tranché : ce sera « Abidjan », rien de plus (D-026).

✅ **Tout est commité, poussé et EN LIGNE sur https://maelyse.vercel.app.** Vérifié sur le site public : « From 2:00 PM », « Abidjan », programme natation et poterie, aucune section de réponse, gâteau correct, aucun trait noir sur le compte à rebours, 0 erreur console, aucun débordement horizontal.

**Le lien est prêt à être envoyé aux invités.**

La fête est le **samedi 5 septembre 2026 à 14h**, il reste **5 jours**.

## Fait
- [x] Structure de continuité, 29 décisions actées (D-001 à D-029)
- [x] Vite 8 + React 19 + TypeScript strict + Tailwind v4
- [x] **`src/config.ts`, fichier de configuration unique** (D-021) : palette, fête, lieu, jeu, son, programme, tous les textes. Il remplace `src/data/invitation.ts`
- [x] **Ouverture cinématique** `Intro.tsx`, première visite seulement
- [x] **Son d'ambiance** discret, jamais automatique, démarré au premier geste (D-022)
- [x] **Jeu des neuf étincelles** : huit cachées dans la page, la neuvième sur le gâteau, `Victory` et feux d'artifice à la fin (D-022)
- [x] Ciel vivant, gâteau interactif à 9 bougies, bandeau défilant, animations au défilement
- [x] Passe de performance mesurée à 6x processeur et 4G lente (D-014, D-019)
- [x] Carte cliquable vers Google Maps, repère dessiné, coordonnées jamais affichées
- [x] Partage natif, aperçu WhatsApp à 63 Ko, noindex, traduction bloquée
- [x] **Heure de début : 14h.** `dateISO` corrigé de 15h à 14h UTC, le compte à rebours visait une heure fausse (D-023)
- [x] **Aucune heure de fin annoncée**, choix de Kader. La ligne Time affiche « From 2:00 PM » (D-023)
- [x] **Formulaire de réponse supprimé** et ligne « For parents » retirée, sur décision de Kader (D-024)
- [x] Hero ramené à **un seul bouton, « See the place »**, barre fixe basse rebranchée sur le bloc lieu
- [x] **Programme réel** : accueil, natation, poterie, gâteau (D-025)
- [x] « Dress code » devient **« What to bring »** : maillot, serviette, rechange
- [x] **Lieu réduit à « Abidjan »** (D-026), l'adresse devient facultative dans le code et la précision est portée par le bouton Maps
- [x] **Gâteau corrigé** (D-027) : les bougies des extrémités flottaient à côté du glaçage, les deux étages avaient presque la même largeur, les coulures du bas formaient des dents sombres, le plat ne débordait qu'à droite
- [x] **Trait noir retiré du compte à rebours** (D-027) : un filet quasi noir barrait le milieu de chaque chiffre
- [x] **Ouverture allongée** (D-028) : le prénom assemblé ne tenait que 20 ms à l'écran avant le départ, il tient maintenant une seconde. Séquence complète mesurée à 5474 ms contre 3350
- [x] **Raccourci « passer »** (D-028) : un appui n'importe où abrège l'ouverture, pris en compte en 67 ms
- [x] **L'ouverture se rejoue à chaque chargement** (D-029), la clé de stockage local est supprimée
- [x] Meta description et Open Graph mis à jour, ils ne promettent plus de répondre
- [x] Build vert (`npm run build`), vérifié au navigateur en 390px et 1440px, **0 erreur console, 0 débordement horizontal**

## En cours
- [ ] Rien. Le site est en ligne et à jour.

## À faire (priorisé)
- [ ] **Envoyer le lien aux parents** sur WhatsApp
- [ ] Tester sur un vrai téléphone : aperçu WhatsApp du lien, ouverture de Google Maps, son, jeu des étincelles
- [ ] Optionnel : alléger `motion` via LazyMotion (~120 Ko gzippés aujourd'hui). **À ne pas tenter avant la fête.**
- [ ] Optionnel : ajout au calendrier (.ics), galerie photo

## Décisions clés prises (voir DECISIONS.md pour détails)
- D-001 à D-012 : stack, pas de backend, direction artistique, anglais, Vercel, noindex
- D-013 enveloppe d'accueil, première visite seulement
- D-014 passe de performance, la fluidité prime sur l'effet
- D-015 section déroulé, contenu proposé à valider
- D-016 retrait du vocabulaire de soirée, c'est une fête d'enfant
- D-017 refonte visuelle, ouverture cinématique, gâteau interactif
- D-018 LE défaut de fond : le body opaque recouvrait tout le décor
- D-019 mesures de fluidité, et une erreur de méthode corrigée
- D-020 ballons volontairement sombres, à cause du contraste du texte
- **D-021 `src/config.ts`, fichier de configuration unique**
- **D-022 ouverture cinématique, son et jeu des neuf étincelles** (refonte retrouvée non commitée)
- **D-023 14h, et aucune heure de fin annoncée**
- **D-024 retrait du formulaire de réponse et de la ligne « For parents »**
- **D-025 le programme dit enfin ce qui va se passer : natation et poterie**
- **D-026 le lieu affiché, c'est « Abidjan », rien de plus**
- **D-027 gâteau et compte à rebours, quatre défauts que seul l'œil voyait**
- **D-028 l'ouverture prend son temps, et devient interruptible**
- **D-029 l'ouverture se rejoue à chaque chargement, D-013 est annulée**

## Pièges rencontrés et solutions
- **Un travail non commité n'existe pas.** À la reprise du 2026-08-31, deux heures de refonte (config unique, son, jeu des étincelles) ont été retrouvées dans l'arbre de travail : jamais commitées, jamais documentées, et donc absentes du site en ligne alors que PROGRESS.md annonçait le contraire. Commiter est ce qui rend un travail réel.
- **PROGRESS.md peut mentir.** Il décrivait un état antérieur de deux heures au disque. À chaque reprise, croiser le journal avec `git status` et les dates de modification, pas seulement lire le journal.
- **Le fuseau se vérifie.** `dateISO` était à 15h UTC pour une fête à 14h à Abidjan, qui est sur GMT. Le compte à rebours se serait trompé d'une heure sans que rien ne le signale.
- **Retirer une section, c'est retirer tout ce qui pointait dessus.** Supprimer le formulaire imposait aussi le bouton du hero, la cible de la barre fixe basse, l'observateur d'intersection, les textes, le bloc de configuration et la description Open Graph.
- **Une animation peut être entièrement juste et ne rien donner à voir.** L'ouverture enchaînait correctement ses quatre temps, mais le tableau final n'existait que 20 ms : tout le mouvement menait à une image que personne ne voyait. Le temps de pause fait partie de l'animation, pas du vide entre deux animations.
- **Un clic sur un enfant remonte au parent.** Le clic qui ouvre l'enveloppe atteignait le voile devenu porteur du raccourci « passer », et aurait sauté l'ouverture dans le geste même qui la lance. `stopPropagation` sur l'ouverture.
- **`mx-auto` ne centre pas un élément plus large que son parent.** Les marges automatiques ne deviennent jamais négatives : l'élément reste collé à gauche et ne déborde qu'à droite. Il faut `left-1/2` et `-translate-x-1/2`.
- **Flex rétracte les éléments trop larges sans rien signaler.** Les neuf bougies en `w-8` étaient silencieusement ramenées à 27 px pour remplir la ligne, ce qui masquait le vrai problème : la rangée était plus large que le glaçage sur lequel elle est censée poser.
- **Une capture pleine page ne montre pas les animations au défilement** : les blocs révélés à l'apparition restent à opacité zéro et la page paraît vide. Injecter une règle qui force l'opacité avant de capturer, sinon on croit à tort que le rendu est cassé.
- **Le brief mélangeait deux produits** (vitrine et invitation) → tranché en D-004 avant tout code.
- **Chrome traduisait la page en français à la volée** → `translate="no"` et meta notranslate.
- **La protection de déploiement Vercel** rendait le lien inaccessible à tous sauf à Kader, invisible depuis un navigateur connecté → contrôler le code HTTP hors session.
- **Mesurer la performance sur le serveur de développement ne veut rien dire** : 12,8 s en dev contre 5,4 s en production, pour le même code.
- **Une mesure de fluidité dans un onglet en arrière-plan ne vaut rien.** J'ai accusé la carte Google sur cette base et je l'ai retirée à tort.
- **Les animations infinies tournent hors écran**, dont 18 pour les flammes des bougies pendant qu'on lit l'adresse deux écrans plus bas.
- **Le heredoc bash cale sur du TSX** → écriture directe de fichier pour ces cas.

## Notes importantes pour la prochaine session
**Le travail est terminé et en ligne.** Deux commits poussés le 2026-08-31 : `ed47688` pour le code, `aca4596` pour le journal. Aucun trailer de co-auteur.

Plus aucun champ n'est en attente dans `src/config.ts`, tout le contenu est validé par Kader. Le dépôt est relié au projet Vercel, un push sur `main` redéploie tout seul.

Ce qui reste est facultatif et sans urgence : test sur un vrai téléphone, ajout au calendrier (.ics), galerie photo. Ne pas toucher à `motion` avant la fête.
