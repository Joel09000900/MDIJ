import { Link } from 'react-router-dom'
import Realisations from '../components/Realisations'

/** Page « Réalisations » : ce que le MDIJ a accompli sur le terrain. */
export default function Realisation() {
  return (
    <>
      <Realisations />
      <section className="section section-cta">
        <div className="container page-cta" data-reveal>
          <h2 className="section-title">Construis la suite avec nous.</h2>
          <p>Chaque réalisation part d'un jeune qui a décidé d'agir. Rejoins le mouvement et ajoute la tienne.</p>
          <Link to="/rejoindre" className="btn btn-primary">
            Adhérer au MDIJ
          </Link>
        </div>
      </section>
    </>
  )
}
