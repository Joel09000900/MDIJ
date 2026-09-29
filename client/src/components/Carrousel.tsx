import { useEffect, useState } from 'react'

/** Durée d'affichage de chaque image, en millisecondes. */
const DUREE = 2000

type Props = {
  /** Images à faire défiler, dans l'ordre. */
  images: readonly string[]
  /** Ce que l'ensemble représente : les images étant empilées, elles n'ont qu'un libellé. */
  libelle: string
}

/**
 * Cadre d'images empilées qui se succèdent en fondu.
 * Partagé par la page du Président et celle des Réalisations.
 */
export default function Carrousel({ images, libelle }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // une seule image, ou moins d'animations demandées : rien ne défile
    if (images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const minuteur = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, DUREE)
    return () => clearInterval(minuteur)
  }, [images])

  // dossier encore vide : on n'affiche pas de cadre creux
  if (images.length === 0) return null

  return (
    <div className="carrousel-cadre" role="img" aria-label={libelle}>
      {images.map((image, i) => (
        <img
          key={image}
          src={image}
          alt=""
          className={i === index ? 'is-active' : undefined}
          loading={i === 0 ? undefined : 'lazy'}
        />
      ))}
    </div>
  )
}
