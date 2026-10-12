import { useState, type CSSProperties } from 'react'
import { REALISATIONS_PAYSAGE, REALISATIONS_PORTRAIT } from '../imageFamien/realisation'
import Carrousel from './Carrousel'
import GalerieModal from './GalerieModal'

const LIBELLE = 'Les réalisations du MDIJ sur le terrain'

/* Construit sur le même modèle que President.tsx : un carrousel à gauche, le texte
   et la frise à droite. Les textes ci-dessous sont provisoires, à remplacer. */
export default function Realisations() {
  const [galerie, setGalerie] = useState(false)

  return (
    <section id="realisation" className="section section-dark">
      <div className="container president-grid">
        <div className="president-photo realisation-media" data-reveal>
          {/* Le cadre entier est le déclencheur : cliquer les portraits ouvre les paysages,
              comme le bouton placé juste en dessous. */}
          <button
            type="button"
            className="realisation-apercu"
            onClick={() => setGalerie(true)}
            aria-label="Voir les autres photos des réalisations"
          >
            <Carrousel images={REALISATIONS_PORTRAIT} libelle={LIBELLE} />
          </button>
          <button type="button" className="btn btn-outline realisation-plus" onClick={() => setGalerie(true)}>
            En savoir plus
          </button>
        </div>
        <div data-reveal style={{ '--delai': '0.15s' } as CSSProperties}>
          <span className="section-tag">Nos réalisations</span>
          <h2 className="section-title">RÉALISATION YOPOUGON</h2>
          <p>
            Le MDIJ se juge sur le terrain. Chaque action menée à <strong>Yopougon</strong> répond à un besoin concret
            des jeunes de la commune : se former, travailler, se faire entendre.
          </p>
          <p>
            Ces réalisations ne sont pas des vitrines. Elles sont la preuve qu'une jeunesse organisée change les choses
            sans attendre qu'on le fasse à sa place.
          </p>
        </div>
      </div>
      <GalerieModal
        open={galerie}
        onClose={() => setGalerie(false)}
        images={REALISATIONS_PAYSAGE}
        libelle={LIBELLE}
      />
    </section>
  )
}
