import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div data-reveal>
          <span className="section-tag">Qui sommes-nous</span>
          <h2 className="section-title">Le MDIJ, l'équipe de confiance de la jeunesse ivoirienne.</h2>
        </div>
        <div className="about-text" data-reveal style={{ '--delai': '0.12s' } as CSSProperties}>
          <p>
            Fondé le <strong>11 septembre 2024</strong>, le MDIJ est né d'une conviction simple : la jeunesse doit
            compter.
          </p>
          <p>
            Nous constatons que les jeunes restent tenus à l'écart : à l'écart de l'aide sociale, à l'écart de leur
            propre culture, à l'écart de l'économie dominée par les investisseurs étrangers, et détournés de la
            politique après les crises qu'a traversées la Côte d'Ivoire de 1990 à 2010.
          </p>
          <p>
            Le MDIJ organise, forme et mobilise les jeunes pour qu'ils deviennent acteurs de leur destin et bâtisseurs
            du pays de demain.
          </p>
          <Link to="/nos-combats" className="btn btn-primary">Nos combats</Link>
        </div>
      </div>
    </section>
  )
}
