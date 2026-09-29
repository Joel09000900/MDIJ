# imageFamien

Images du site MDIJ, rangées **par entrée de la barre de navigation**.

## Arborescence

```
src/imageFamien/
├── index.ts          regroupe toutes les sections
├── commun/           logo, arrière-plans, icônes partagés
├── accueil/          /
├── le-mouvement/     /#about
├── nos-combats/      /nos-combats
├── services/         /#services
├── le-president/     /le-president
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

> Les images historiques (`logo.png`, `meeting.jpg`, `mobilisation.jpg`,
> `president.jpg`) sont encore dans `client/public/images/` et référencées par
> chemin absolu. Leur migration vers ce dossier reste à faire.
