/**
 * imageFamien — images du site regroupées par entrée de la barre de navigation.
 *
 * Un dossier par entrée de `NAV` (voir `src/content.ts`), plus `commun` pour les
 * visuels partagés. Chaque dossier expose ses images via son propre `index.ts`.
 *
 * Deux façons d'importer :
 *   import { accueil } from '../imageFamien'          // puis accueil.banniere
 *   import { banniere } from '../imageFamien/accueil' // import direct
 */
export * as commun from './commun'
export * as accueil from './accueil'
export * as leMouvement from './le-mouvement'
export * as nosCombats from './nos-combats'
export * as services from './services'
export * as lePresident from './le-president'
export * as contact from './contact'
export * as connexion from './connexion'
export * as rejoindre from './rejoindre'
