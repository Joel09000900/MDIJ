/**
 * Le Président — /le-president
 *
 * Déposer les images de cette section dans ce dossier, puis les ajouter au tableau
 * ci-dessous : leur ordre est celui du défilé.
 *
 * Une photo plus large que le cadre 3/4 est rognée sur les côtés à partir du centre.
 * Si le Président n'est pas au milieu du cliché, l'inscrire `{ src, cadrage }` pour
 * amener la fenêtre visible sur lui (voir `ImageCarrousel` dans Carrousel.tsx).
 */
import type { ImageCarrousel } from '../../components/Carrousel'
import portrait1 from './Pfamien1.jpeg'
import portrait2 from './Pfamien2.jpeg'
import portrait3 from './Pfamien3.jpeg'
import portrait4 from './Pfamien4.jpeg'
import portrait5 from './Pfamien5.jpeg'
import portrait6 from './Pfamien6.jpeg'
import portrait7 from './Pfamien7.jpeg'
import portrait8 from './Pfamien8.jpeg'
import portrait9 from './Pfamien9.jpeg'
import portrait10 from './Pfamien10.jpeg'

/** Portraits du Président, dans l'ordre du défilé. */
export const PORTRAITS: readonly ImageCarrousel[] = [
  portrait1,
  portrait2,
  portrait3,
  portrait4,
  portrait5,
  portrait6,
  portrait7,
  portrait8,
  // photo de groupe en 3/2 : le Président y est le deuxième en partant de la gauche,
  // centré à 37 % de la largeur. Sans ce cadrage, le cadre s'ouvre sur son voisin.
  { src: portrait9, cadrage: '24% center' },
  portrait10,
]
