# Invitation d'anniversaire - Maëlys Kadyjat

Invitation en ligne pour les 9 ans de Maëlys, le samedi 5 septembre 2026 à Abidjan.
Une page unique, en anglais, pensée pour être ouverte sur un téléphone depuis un lien WhatsApp.

## Stack

React 19 + Vite + TypeScript strict + Tailwind CSS v4, animations avec `motion`.
Aucun backend : les confirmations de présence partent en message WhatsApp pré-rempli.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérifie les types puis produit dist/
```

## Modifier le contenu

Tout le contenu affiché vit dans un seul fichier : [`src/data/invitation.ts`](src/data/invitation.ts).
Prénom, âge, date, heures, coordonnées du lieu, numéro WhatsApp et l'intégralité des textes anglais.
Aucun texte n'est écrit en dur dans un composant.

## À compléter avant de partager le lien

| Champ | Où | Effet tant que c'est vide |
|---|---|---|
| `whatsappNumber` | `src/data/invitation.ts` | le bouton de réponse affiche un message d'attente au lieu d'ouvrir WhatsApp |
| `startTime` / `endTime` | `src/data/invitation.ts` | la ligne « Time » affiche « Time to be confirmed » |

Le numéro s'écrit au format international, sans `+` ni espaces. Exemple : `2250700000000`.

## Image d'aperçu

L'aperçu affiché par WhatsApp est `public/og.jpeg`, généré depuis `design/og-source.html`.
Pour le refaire après un changement de texte : ouvrir ce fichier dans un navigateur en 1200x630 et capturer.

## Notes

- Thème sombre unique, assumé. Une invitation de soirée n'a pas de mode clair.
- La page est en `noindex` : elle se partage par lien mais n'apparaît dans aucun moteur de recherche.
- La traduction automatique du navigateur est désactivée, le site reste en anglais.
