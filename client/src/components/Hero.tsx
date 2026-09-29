import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { heros } from '../imageFamien/accueil'

/** La photo de fond est passée en variable CSS : les voiles restent dans la feuille de style. */
const fond = { '--hero-image': `url(${heros})` } as CSSProperties

export default function Hero() {
  return (
    <section id="accueil" className="hero" style={fond}>
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="badge">Côte d'Ivoire · Yopougon</span>
          <h1>
            Donne ta voix. <span className="accent">Bâtis ton avenir.</span>
          </h1>
          <p className="hero-lead">
            Le Mouvement Démocratique pour l'Insertion des Jeunes rend à la jeunesse ivoirienne sa place : sociale,
            culturelle, économique et politique. L'heure des spectateurs est terminée.
          </p>
          <div className="hero-actions">
            <Link to="/rejoindre" className="btn btn-primary">Je rejoins le combat</Link>
            <Link to="/#about" className="btn btn-outline">Découvrir le MDIJ</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
