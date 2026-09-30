import { useEffect, useState } from 'react'

/** Durée d'affichage de chaque image, en millisecondes, faute de mieux. */
const DUREE_DEFAUT = 2000

/**
 * Une image du carrousel.
 *
 * Les images sont en `object-fit: cover` : celle qui ne tombe pas à la proportion du
 * cadre est rognée, à partir du centre. Quand le sujet n'est pas au milieu du cliché,
 * il se retrouve coupé — passer alors `{ src, cadrage }`, où `cadrage` est une valeur
 * `object-position` (« 24% center ») qui déplace la fenêtre visible sur le sujet.
 */
export type ImageCarrousel = string | { src: string; cadrage: string }

type Props = {
  /** Images à faire défiler, dans l'ordre. */
  images: readonly ImageCarrousel[]
  /** Ce que l'ensemble représente : les images étant empilées, elles n'ont qu'un libellé. */
  libelle: string
  /**
   * Classe du cadre, si la mise en forme n'est pas celle des portraits.
   * Par défaut `carrousel-cadre` : le cadre 3/4 à bordure orange.
   */
  className?: string
  /** Durée d'affichage de chaque image, en millisecondes. */
  duree?: number
}

/**
 * Cadre d'images empilées qui se succèdent en fondu.
 * Partagé par la page du Président, celle des Réalisations et le bandeau
 * « mobilisation » de Nos Combats — chacun fournit la classe de son cadre.
 */
export default function Carrousel({ images, libelle, className = 'carrousel-cadre', duree = DUREE_DEFAUT }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // une seule image, ou moins d'animations demandées : rien ne défile
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const minuteur = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, duree)
    return () => clearInterval(minuteur)
  }, [images, duree])

  // dossier encore vide : on n'affiche pas de cadre creux
  if (images.length === 0) return null

  return (
    <div className={className} role="img" aria-label={libelle}>
      {images.map((image, i) => {
        const src = typeof image === 'string' ? image : image.src
        const cadrage = typeof image === 'string' ? undefined : image.cadrage
        return (
          <img
            key={src}
            src={src}
            alt=""
            className={i === index ? 'is-active' : undefined}
            loading={i === 0 ? undefined : 'lazy'}
            style={cadrage ? { objectPosition: cadrage } : undefined}
          />
        )
      })}
    </div>
  )
}
