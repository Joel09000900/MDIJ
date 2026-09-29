import type { CSSProperties } from 'react'
import { REALISATIONS } from '../imageFamien/realisation'
import Carrousel from './Carrousel'

/* Construit sur le même modèle que President.tsx : un carrousel à gauche, le texte
   et la frise à droite. Les textes ci-dessous sont provisoires, à remplacer. */
export default function Realisations() {
  return (
    <section id="realisation" className="section section-dark">
      <div className="container president-grid">
        <div className="president-photo" data-reveal>
          <Carrousel images={REALISATIONS} libelle="Les réalisations du MDIJ sur le terrain" />
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
          <div className="timeline">
            <div className="timeline-item">
              <strong>2024</strong>
              <span>Première action de terrain</span>
            </div>
            <div className="timeline-item">
              <strong>2026</strong>
              <span>Deuxième action de terrain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
