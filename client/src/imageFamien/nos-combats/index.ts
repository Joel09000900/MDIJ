/**
 * Nos Combats — /nos-combats
 *
 * Déposer les images de cette section dans ce dossier, puis les exporter ici.
 */
import type { ImageCarrousel } from '../../components/Carrousel'
import mobilisation from './mobilisation.jpg'
import rea1 from './Rea1.jpeg'

/**
 * Photos du bandeau « mobilisation », dans l'ordre du défilé.
 *
 * Les deux sont en 3/2 avec les visages dans le haut du cliché : le cadrage du
 * bandeau (`object-position: center top`, voir global.css) leur convient à toutes
 * les deux, aucune n'a besoin d'un cadrage propre.
 */
export const MOBILISATION: readonly ImageCarrousel[] = [mobilisation, rea1]
