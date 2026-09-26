import { Link } from 'react-router-dom'
import President from '../components/President'

/** Page « Le Président » : portrait de Konan Famien et échéances. */
export default function LePresident() {
  return (
    <>
      <President />
      <section className="section section-cta">
        <div className="container page-cta" data-reveal>
          <h2 className="section-title">Marche à ses côtés.</h2>
          <p>Le combat du Président est celui de toute une génération. Prends ta place dans le mouvement.</p>
          <Link to="/rejoindre" className="btn btn-primary">
            Adhérer au MDIJ
          </Link>
        </div>
      </section>
    </>
  )
}
