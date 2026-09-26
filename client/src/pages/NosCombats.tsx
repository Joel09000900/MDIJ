import { Link } from 'react-router-dom'
import Mission from '../components/Mission'

/** Page « Nos Combats » : les 4 piliers du programme. */
export default function NosCombats() {
  return (
    <>
      <Mission />
      <section className="section section-cta">
        <div className="container page-cta" data-reveal>
          <h2 className="section-title">Ces combats sont aussi les tiens.</h2>
          <p>Rejoins le MDIJ et porte-les avec nous, sur le terrain, à Yopougon et partout ailleurs.</p>
          <Link to="/rejoindre" className="btn btn-primary">
            Je rejoins le combat
          </Link>
        </div>
      </section>
    </>
  )
}
