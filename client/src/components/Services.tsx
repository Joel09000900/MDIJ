import type { CSSProperties } from 'react'
import { SERVICES, waLink } from '../content'

export default function Services({ onDon }: { onDon: () => void }) {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="section-tag">Ce que le MDIJ fait pour toi</span>
          <h2 className="section-title">Nos services à la jeunesse</h2>
          <p className="section-sub">Un clic te met directement en contact avec le MDIJ. Choisis le service dont tu as besoin.</p>
        </div>

        <div className="services">
          {SERVICES.map((s, i) => (
            <article
              key={s.titre}
              className="card service"
              data-reveal
              style={{ '--delai': `${i * 0.12}s` } as CSSProperties}
            >
              <div className="service-icon" aria-hidden="true">{s.icon}</div>
              <span className="service-cat">{s.categorie}</span>
              <h3>{s.titre}</h3>
              <p>
                {s.texte}
                {s.fort && <strong>{s.fort}</strong>}
                {s.apresFort}
              </p>
              {s.message ? (
                <a className="btn btn-whatsapp" href={waLink(s.message)} target="_blank" rel="noreferrer">
                  {s.bouton}
                </a>
              ) : (
                <button type="button" className="btn btn-primary" onClick={onDon}>
                  {s.bouton}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
