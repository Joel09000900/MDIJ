# Modifications du 29 septembre 2026

Journal des changements apportés au site **MDIJ** (client React + serveur Express).

- Dernier commit avant la session : `a361ca9` — Mode nuit sur l'ensemble du site

---

## À faire

- [ ] Migrer les 4 images historiques de `client/public/images/` vers `imageFamien`
      et mettre à jour `Hero.tsx`, `Logo.tsx`, `Mission.tsx`, `President.tsx`.

---

## Modifications réalisées

### 1. Dossier `imageFamien` rangé par entrée de la navigation

**Contexte / demande :** disposer d'un dossier `imageFamien` dans le client,
découpé en sous-dossiers calqués sur la barre de navigation, pour importer les
images section par section.

**Fichiers touchés :** création de `client/src/imageFamien/` (11 nouveaux fichiers,
aucun fichier existant modifié).

**Détail :**

```
client/src/imageFamien/
├── README.md         convention de nommage et d'import
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

Les dossiers reprennent un à un les entrées de `NAV` (`client/src/content.ts`),
plus `commun` et `rejoindre` (le bouton d'appel à l'action de l'en-tête).

Placé dans `src/` et non dans `public/` : Vite résout alors les images à la
compilation — un chemin erroné casse le build, les fichiers reçoivent une empreinte
pour la mise en cache. C'est la convention d'un projet Vite pour des images
importées. `tsconfig.json` déclare déjà `"types": ["vite/client"]`, les imports
d'images sont donc typés sans configuration supplémentaire.

Chaque dossier contient un `index.ts` qui exporte ses images. Ajout d'une image :

```ts
// src/imageFamien/nos-combats/index.ts
import marcheJeunesse from './marche-jeunesse.jpg'
export { marcheJeunesse }
```

```tsx
// dans un composant
import { marcheJeunesse } from '../imageFamien/nos-combats'
<img src={marcheJeunesse} alt="Marche de la jeunesse à Yopougon" />
```

**Vérification :** `npm run typecheck` dans `client/` — aucune erreur.

---

### 2. Héro de l'accueil : photo en fond, visuel et citation supprimés

**Contexte / demande :** sur la section `#accueil`, supprimer les classes
`hero-visual` et `hero-quote`, et utiliser `heros.jpeg` en fond de la section.

**Fichiers touchés :**

- `client/src/imageFamien/accueil/index.ts` — export de `heros.jpeg`
- `client/src/components/Hero.tsx`
- `client/src/styles/global.css`

**Détail :**

- Le bloc `<figure className="hero-visual">` a été retiré de `Hero.tsx`. Il portait
  l'image `/images/meeting.jpg` et la citation `hero-quote` (« Une jeunesse insérée,
  c'est une nation debout. ») — les deux disparaissent de la page.
- `heros.jpeg` est importé depuis `imageFamien/accueil` et passé à la section via la
  variable CSS `--hero-image`. Les voiles de couleur restent ainsi dans la feuille de
  style, le composant ne transporte que le chemin de l'image.
- `.hero` reçoit la photo en `background-image`, en `cover`, sous un dégradé violet
  translucide qui préserve la lisibilité du texte blanc. L'ancien fond était un
  dégradé animé (`degradeAnime`), incompatible avec une image en `cover` : l'animation
  a été retirée.
- La section reçoit `min-height: min(76vh, 660px)` : sans sa colonne image, elle serait
  devenue trop courte pour une photo de fond.
- `.hero-inner` n'est plus une grille à deux colonnes — le texte occupe toute la largeur.
- Règles supprimées : `.hero-visual`, `.hero-visual img`, `.hero-visual:hover img`,
  `.hero-quote`, `.hero-quote strong`, `.hero-quote span`, ainsi que leurs variantes
  en mode nuit et dans la requête média.
- Mode nuit : `.theme-sombre .hero` garde la même photo sous un voile plus dense.
- Cadrage affiné après relecture : `background-position: center 30%` au lieu de
  `center`. Le sujet est haut dans la photo ; le décalage le ramène vers le milieu
  de la bande et laisse voir les bras levés plutôt que le bas des vêtements.

**Vérification :** `npm run build` — compilation TypeScript et build Vite sans erreur ;
`heros.jpeg` est bien intégré au bundle (`dist/assets/heros-4A6oAjOC.jpeg`). Plus aucune
occurrence de `hero-visual` ou `hero-quote` dans `src/`.

---

## Notes et points en suspens

- Les dossiers de `imageFamien` sont encore vides, sauf `accueil/` qui contient
  `heros.jpeg`.
- L'image `public/images/meeting.jpg` n'est plus utilisée nulle part depuis la
  suppression de `hero-visual`.
- L'animation `@keyframes degradeAnime` (ligne 118 de `global.css`) n'est plus
  appelée par aucune règle. Conservée pour l'instant.
- `client/public/images/` n'a pas été touché : les 4 images actuelles y restent et
  les composants qui les affichent fonctionnent comme avant. La migration est notée
  dans « À faire ».
- Si une entrée est ajoutée à `NAV`, créer le dossier correspondant et l'ajouter à
  `src/imageFamien/index.ts`.
