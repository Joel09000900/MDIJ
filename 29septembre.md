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

### 3. Accès du président dissimulé dans le pied de page

**Contexte / demande :** retirer « Connexion » du menu et cacher cet accès dans la
mention légale du pied de page, sous les mots « Parole tenue », sans décoration ni
couleur qui trahisse un lien.

**Fichiers touchés :** `client/src/components/Footer.tsx`,
`client/src/components/Header.tsx`, `client/src/content.ts`,
`client/src/styles/global.css`.

**Détail :**

- La ligne du pied de page devient :
  « © 2024–2026 MDIJ — Tous droits réservés. **Parole tenue.** », où « Parole tenue. »
  est un `<Link>` de classe `footer-acces`.
- La classe hérite de la couleur, de la police et du curseur du texte qui l'entoure,
  sans soulignement, au repos comme au survol. Seule la navigation au clavier la
  révèle (`:focus-visible`), pour que la page reste utilisable.
- La destination suit l'état de session, comme le faisait le menu : `/administration`
  si un jeton est présent, `/connexion` sinon.
- L'entrée « Connexion » disparaît de `NAV`. La logique dédiée du `Header` (bascule
  vers « Tableau de bord », classe `nav-admin`) n'avait plus d'objet : la boucle de
  navigation est redevenue une simple projection de `NAV`, et les deux règles CSS
  `.nav a.nav-admin` ont été supprimées.
- La route `/connexion` reste en place : elle n'est simplement plus annoncée.

**Vérification :** `npm run build` — sans erreur. Plus aucune occurrence de
`nav-admin` dans `src/`.

> Une première version de cette modification retirait aussi la section Services de
> l'accueil ; ce volet a été annulé, les services restent en place.

---

### 4. Section Services retirée de l'accueil

**Contexte / demande :** supprimer la section `<section className="section" id="services">`
de la page d'accueil.

**Fichiers touchés :** `client/src/pages/Accueil.tsx`, `client/src/App.tsx`,
`client/src/content.ts`.

**Détail :**

- `Accueil.tsx` ne rend plus que `<Hero />` et `<About />`.
- L'entrée « Services » (`/#services`) est retirée de `NAV` : l'ancre n'existe plus.
  Le menu compte désormais cinq entrées.
- `Services.tsx` portait le seul bouton qui ouvrait la fenêtre de don. Sans lui,
  `DonModal` n'est plus joignable et l'état `donOuvert` devenait inutilisé (erreur
  `noUnusedLocals`) : le câblage `onDon` a donc été retiré de `App.tsx` et de
  `Accueil.tsx`.
- `Services.tsx` et `DonModal.tsx` restent sur le disque, simplement plus importés :
  rien n'est perdu si la section ou le don doivent revenir.

**Vérification :** `npm run build` — sans erreur.

---

### 5. « Le Mouvement » retiré du menu

**Contexte / demande :** supprimer l'entrée « Le Mouvement » de la barre de navigation.

**Fichiers touchés :** `client/src/content.ts`.

**Détail :**

- L'entrée `{ to: '/#about', label: 'Le Mouvement' }` quitte `NAV`. Le menu compte
  désormais quatre entrées : Accueil, Nos Combats, Le Président, Contact — que des
  pages, plus aucune ancre.
- **La section elle-même reste sur l'accueil** : seul le lien du menu disparaît. Elle
  garde son `id="about"`, toujours visé par le bouton « Découvrir le MDIJ » du héros,
  donc `ScrollToHash` reste utile.

**Vérification :** `npm run build` — sans erreur.

---

### 6. Services devient une vraie page

**Contexte / demande :** garder « Services » dans la barre de navigation, en tant
que page.

**Fichiers touchés :** `client/src/components/Services.tsx` déplacé vers
`client/src/pages/Services.tsx`, `client/src/App.tsx`, `client/src/content.ts`.

**Détail :**

- Le composant quitte `components/` pour `pages/` : ce n'est plus une section de
  l'accueil mais une page, comme `Contact.tsx`. Le fichier lui-même est inchangé,
  hors commentaire d'en-tête ; `from '../content'` reste valable, les deux dossiers
  étant au même niveau.
- Nouvelle route `/services` dans `App.tsx`, et entrée `{ to: '/services',
  label: 'Services' }` dans `NAV`, après « Nos Combats ». Le menu revient à cinq
  entrées.
- **La fenêtre de don redevient atteignable** : la page porte le bouton qui l'ouvre,
  donc le câblage `onDon` et le rendu de `DonModal` reviennent dans `App.tsx`. Le
  point en suspens de la section 4 est résolu.
- La section garde son `id="services"`, comme `Contact.tsx` garde `id="contact"`.
  Il ne sert plus d'ancre de menu, la navigation se faisant par la route.

**Vérification :** `npm run build` — sans erreur. `/services` répond en 200 sur le
serveur de développement.

---

### 7. Portraits défilants sur la page du Président

**Contexte / demande :** sur `LePresident.tsx`, faire défiler les images du dossier
`imageFamien/le-president` dans le cadre `.president-photo`, deux secondes par image.

**Fichiers touchés :** `client/src/components/President.tsx`,
`client/src/imageFamien/le-president/index.ts`, `client/src/styles/global.css`,
`client/src/imageFamien/index.ts`, `client/src/imageFamien/README.md`.

**Détail :**

- Les cinq portraits (`Pfamien1` à `Pfamien5`) sont exportés en un tableau ordonné
  `PORTRAITS` : l'ordre du fichier est l'ordre du défilé.
- `President.tsx` empile les cinq images dans le cadre et fait tourner un index avec
  `setInterval`, `DUREE = 2000` ms. Seule celle qui porte `is-active` est opaque ;
  la transition CSS assure le fondu enchaîné.
- Le minuteur est nettoyé au démontage. Il ne démarre pas si le système demande moins
  d'animations (`prefers-reduced-motion`), ni s'il n'y a qu'une seule image — même
  logique que le composant `Reveal`.
- Les portraits étant empilés, ils se lisent comme une seule illustration : le cadre
  porte `role="img"` et le libellé, les `<img>` ont un `alt` vide. Seule la première
  est chargée d'emblée, les suivantes en `loading="lazy"`.
- **Le cadre et les images sont séparés.** `.president-photo` reste la cible du
  `data-reveal` ; un `.president-cadre` à l'intérieur porte la proportion 3/4, la
  bordure orange, l'ombre, le découpage (`overflow: hidden`) et le survol. Seules les
  images bougent dedans : plus aucun clignotement de bordure d'un portrait à l'autre,
  et les glissements sont proprement coupés au bord du cadre.
- **Une seule façon d'entrer, commune aux cinq portraits.** Le portrait au repos
  attend agrandi de 7 % et décalé de 12 px vers le bas
  (`transform: translateY(12px) scale(1.07)`) ; celui qui devient actif rejoint sa
  place avec `.is-active { transform: none }`.

  Une première version distribuait cinq entrées différentes à tour de rôle (glissement
  depuis la droite, depuis la gauche, ouverture depuis le centre, redressement). Après
  observation du rendu, la pose par le bas a été retenue pour tous : le défilé est plus
  posé, et l'attention reste sur le portrait plutôt que sur l'effet.
- Le fondu dure 0,85 s, le déplacement 2,1 s : le portrait continue donc de bouger
  lentement une fois net, et le suivant arrive avant la fin du parcours — le défilé
  n'a pas de temps mort.
- Avec `prefers-reduced-motion`, transitions et transformations sont neutralisées sur
  le cadre, son survol et les images ; le portrait courant s'affiche net.
- L'ancienne image `/images/president.jpg` n'est plus utilisée.

**Au passage :** le dossier `imageFamien/le-mouvement/` avait été supprimé du disque
mais le barrel racine l'exportait toujours, ce qui cassait la compilation. La ligne
correspondante et l'entrée du README ont été retirées.

**Vérification :** `npm run build` — sans erreur, les cinq portraits sont intégrés au
bundle. `/le-president` répond en 200.

---

### 8. Cadrage du bandeau « mobilisation »

**Contexte / demande :** centrer l'image de la classe `.mobilisation`, affichée sur la
page « Nos Combats ».

**Fichiers touchés :** `client/src/styles/global.css`.

**Détail :**

- Le bandeau est en 21/8 (2,625) alors que la photo `mobilisation.jpg` fait
  1600 × 1066, soit 3/2 (1,501). En `object-fit: cover`, seuls **57 % de la hauteur**
  de la photo tiennent dans le bandeau.
- Avec le cadrage par défaut (`object-position: center`, soit 50 %), la fenêtre visible
  allait de 21 % à 79 % de la hauteur. Or les visages occupent le premier quart de
  l'image (2 % à 28 %) : ils étaient coupés au-dessus.
- `object-position: center top` fait démarrer la fenêtre à 0 % : elle couvre alors
  0–57 %, et les visages se retrouvent vers le tiers supérieur du bandeau. C'est le
  réglage qui les rapproche le plus du centre, la géométrie interdisant de descendre
  davantage.
- La règle vaut aussi sur mobile : la requête média passe le bandeau en 4/3, plus
  étroit que la photo, donc la hauteur entière est visible et le cadrage vertical n'a
  plus d'effet.

**Vérification :** `npm run build` — sans erreur.

---

### 9. Nouvelle page « Réalisations »

**Contexte / demande :** créer une page `Realisation.tsx` dans la barre de navigation,
bâtie exactement comme `LePresident.tsx`, avec son dossier dans `imageFamien`.

**Fichiers touchés :** créations `client/src/pages/Realisation.tsx`,
`client/src/components/Realisations.tsx`, `client/src/components/Carrousel.tsx`,
`client/src/imageFamien/realisation/index.ts` ; modifications `client/src/App.tsx`,
`client/src/content.ts`, `client/src/components/President.tsx`,
`client/src/styles/global.css`, `client/src/imageFamien/index.ts` et son README.

**Détail :**

- `pages/Realisation.tsx` reprend la structure de `LePresident.tsx` : le composant de
  contenu, puis la bande d'appel à l'action vers `/rejoindre`.
- `components/Realisations.tsx` reprend celle de `President.tsx` : carrousel à gauche,
  intitulé, deux paragraphes et frise à droite. **Les textes sont provisoires**, à
  remplacer par les vraies réalisations.
- Route `/realisation` dans `App.tsx`, entrée `Réalisations` dans `NAV` après
  « Le Président ». Le menu compte six entrées.
- Dossier `imageFamien/realisation/` avec son `index.ts`, ajouté au barrel racine et au
  README. Il exporte `REALISATIONS`.
- Les six images `r1.jpeg` à `r6.jpeg` y sont déposées et exportées dans cet ordre :
  le carrousel les fait défiler à gauche, deux secondes chacune, avec exactement les
  mêmes transitions que la page du Président — c'est le même composant `Carrousel`.
- Titre de la colonne de droite : **RÉALISATION YOPOUGON**.

**Deux décisions prises au passage :**

- **Le carrousel est factorisé plutôt que dupliqué.** Sa logique (minuteur, index,
  respect de `prefers-reduced-motion`) vit maintenant dans `components/Carrousel.tsx`,
  qui prend les images et un libellé. `President.tsx` l'utilise aussi. Les deux pages
  restent donc identiques par construction, au lieu de diverger à la première
  correction. Le composant renvoie `null` tant qu'aucune image n'est fournie, pour ne
  pas afficher un cadre vide.
- **Les classes CSS du cadre sont généralisées.** `.president-cadre` devient
  `.carrousel-cadre` : la nouvelle page n'hérite pas d'un nom qui parle du Président.
  `.president-grid` et `.president-photo` sont conservées telles quelles, elles portent
  la mise en page de la section.

**Vérification :** `npm run build` — sans erreur. `/realisation` répond en 200.

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
- Le commentaire de `src/imageFamien/services/index.ts` cite encore `/#services` :
  la section est désormais la page `/services`.
- Sous le titre **RÉALISATION YOPOUGON**, les deux paragraphes et les deux dates de la
  frise de `components/Realisations.tsx` restent provisoires, en attente du texte.
- **Vite sert parfois un module vide** après une réécriture complète de fichier : la
  transformation est mise en cache pendant que le fichier est encore tronqué, et la
  page devient blanche alors que `npm run build` passe. Un `touch` sur le fichier
  suffit à forcer la relecture. Le projet étant dans OneDrive, la synchronisation rend
  la course plus probable. Vérifier la taille servie après chaque réécriture.
