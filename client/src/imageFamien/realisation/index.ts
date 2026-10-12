/**
 * Réalisations — /realisation
 *
 * Déposer les images de cette section dans ce dossier, puis les ajouter au tableau
 * qui correspond à leur orientation : leur ordre est celui du défilé.
 *
 * Les deux tableaux sont séparés parce que la page les affiche à deux endroits et
 * dans deux cadres différents : les portraits (810 × 1080) dans le cadre 3/4 de la
 * section, les paysages (1280 × 853) dans la fenêtre « En savoir plus ». Mélangés
 * dans un seul cadre, l'une des deux orientations était forcément rognée.
 */
import r1 from './r1.jpeg'
import r2 from './r2.jpeg'
import r3 from './r3.jpeg'
import r4 from './r4.jpeg'
import r5 from './r5.jpeg'
import r6 from './r6.jpeg'
import r7 from './r7.jpeg'
import r8 from './r8.jpeg'
import r9 from './r9.jpeg'
import r10 from './r10.jpeg'

/** Images verticales, affichées dans le cadre 3/4 de la section. */
export const REALISATIONS_PORTRAIT: readonly string[] = [r1, r2, r3, r4, r5, r6]

/** Images horizontales, affichées seulement dans la fenêtre « En savoir plus ». */
export const REALISATIONS_PAYSAGE: readonly string[] = [r7, r8, r9, r10]
