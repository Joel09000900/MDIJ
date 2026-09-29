import type { CSSProperties } from 'react'
import { PORTRAITS } from '../imageFamien/le-president'
import Carrousel from './Carrousel'

export default function President() {
  return (
    <section id="president" className="section section-dark">
      <div className="container president-grid">
        <div className="president-photo" data-reveal>
          <Carrousel images={PORTRAITS} libelle="Konan Famien, Président du MDIJ" />
        </div>
        <div data-reveal style={{ '--delai': '0.15s' } as CSSProperties}>
          <span className="section-tag">Le Président</span>
          <h2 className="section-title">Konan Famien, la voix d'une génération.</h2>
          <p>
            Fondateur et Président du MDIJ, Konan Famien incarne une jeunesse qui ne baisse plus les yeux. Ancré à{' '}
            <strong>Yopougon</strong>, il porte un message clair : la jeunesse ivoirienne a le talent, le courage et la
            légitimité pour diriger.
          </p>
          <p>
            Avec audace et détermination, il trace le chemin d'un engagement concret, de terrain, au service des jeunes
            de sa commune et de tout le pays.
          </p>
          <div className="timeline">
            <div className="timeline-item">
              <strong>2028</strong>
              <span>Candidature à la Mairie de Yopougon</span>
            </div>
            <div className="timeline-item">
              <strong>2030</strong>
              <span>Élections législatives</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
