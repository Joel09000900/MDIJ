import { useEffect } from 'react'
import Carrousel from './Carrousel'

/** Durée d'affichage de chaque image : une seconde, comme partout ailleurs sur le site. */
const DUREE = 1000

type Props = {
  open: boolean
  onClose: () => void
  /** Images à faire défiler, toutes dans la même orientation que le cadre. */
  images: readonly string[]
  /** Ce que l'ensemble représente, pour la fenêtre et le lecteur d'écran. */
  libelle: string
}

/**
 * Fenêtre « En savoir plus » des réalisations : la page passe derrière un voile flou
 * et seules les images paysage défilent, dans un cadre 3/2 — la proportion des clichés,
 * pour qu'aucun bord ne soit rogné.
 *
 * Même conduite que DonModal : Échap ferme, le clic sur le voile aussi, et le
 * défilement de la page est bloqué tant que la fenêtre est ouverte.
 */
export default function GalerieModal({ open, onClose, images, libelle }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || images.length === 0) return null

  return (
    <div className="galerie-backdrop" onClick={onClose}>
      <div className="galerie" role="dialog" aria-modal="true" aria-label={libelle} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="galerie-close" aria-label="Fermer" onClick={onClose}>×</button>
        <Carrousel images={images} libelle={libelle} className="galerie-cadre" duree={DUREE} />
      </div>
    </div>
  )
}
