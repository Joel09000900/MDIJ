# imageFamien

Images du site MDIJ, rangées **par entrée de la barre de navigation**.

## Arborescence

```
src/imageFamien/
├── index.ts          regroupe toutes les sections
├── commun/           logo, arrière-plans, icônes partagés
├── accueil/          /
├── nos-combats/      /nos-combats
├── services/         /#services
├── le-president/     /le-president
├── realisation/      /realisation
├── contact/          /contact
├── connexion/        /connexion
└── rejoindre/        /rejoindre
```

Les dossiers reprennent les entrées de `NAV` dans `src/content.ts`. Si une entrée
est ajoutée à la navigation, créer le dossier correspondant et l'ajouter à `index.ts`.

## Ajouter une image

1. Déposer le fichier dans le dossier de la section, en **kebab-case** :
   `src/imageFamien/nos-combats/marche-jeunesse.jpg`
2. L'exporter depuis le `index.ts` du dossier :

   ```ts
   import marcheJeunesse from './marche-jeunesse.jpg'
   export { marcheJeunesse }
   ```

3. L'utiliser dans un composant :

   ```tsx
   import { marcheJeunesse } from '../imageFamien/nos-combats'

   <img src={marcheJeunesse} alt="Marche de la jeunesse à Yopougon" />
   ```

## Pourquoi ici et pas dans `public/`

Dans `src/`, Vite traite les images à la compilation : un chemin erroné casse le
build au lieu de passer inaperçu, les fichiers reçoivent une empreinte pour la mise
en cache, et les petites images sont intégrées automatiquement. Dans `public/`, les
chemins ne sont jamais vérifiés.

> `mobilisation.jpg` a rejoint `nos-combats/`. Restent dans `client/public/images/`,
> référencées par chemin absolu : `logo.png` (utilisée par `Logo.tsx`), `meeting.jpg`
> et `president.jpg` (plus utilisées). Leur migration reste à faire.

## Images plus larges que leur cadre

Un cadre de carrousel rogne les photos qui n'ont pas sa proportion, à partir du
centre. Si le sujet est décentré, l'exporter avec son point de cadrage plutôt que
comme un simple chemin :

```ts
import type { ImageCarrousel } from '../../components/Carrousel'

export const PORTRAITS: readonly ImageCarrousel[] = [
  portrait1,
  { src: portrait9, cadrage: '24% center' }, // photo de groupe : le sujet est à gauche
]
```
