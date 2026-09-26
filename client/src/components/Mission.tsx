import type { CSSProperties } from 'react'
import { PILIERS } from '../content'

export default function Mission() {
  return (
    <section id="mission" className="section section-alt">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="section-tag">Notre programme</span>
          <h2 className="section-title">Nos 4 combats pour la jeunesse</h2>
          <p className="section-sub">Quatre fronts, une seule ambition : faire de chaque jeune un citoyen inséré, fier et libre.</p>
        </div>

        <div className="piliers">
          {PILIERS.map((p, i) => (
            <article
              key={p.titre}
              className="card pilier"
              data-reveal
              style={{ '--delai': `${i * 0.1}s` } as CSSProperties}
            >
              <div className="pilier-icon" aria-hidden="true">{p.icon}</div>
              <h3>{p.titre}</h3>
              <p>{p.texte}</p>
            </article>
          ))}
        </div>

        <div className="mobilisation" data-reveal>
          <img src="/images/mobilisation.jpg" alt="Mobilisation des jeunes du MDIJ" />
          <div className="mobilisation-text">
            <h3>Une jeunesse debout, unie et déterminée</h3>
            <p>Sur le terrain, à chaque rassemblement, le MDIJ transforme l'énergie de la jeunesse en force de changement.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
