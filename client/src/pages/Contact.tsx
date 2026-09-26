import type { CSSProperties } from 'react'
import LogoReseau from '../components/LogoReseau'
import { RESEAUX_CONTACT } from '../content'

/** Page « Contact » : le texte d'invitation, puis le choix du réseau. */
export default function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <div className="container reseaux-grid">
        <div data-reveal>
          <span className="section-tag">Reste au contact</span>
          <h2 className="section-title">Parle au MDIJ. Choisis ton réseau.</h2>
          <p>
            Le changement ne se regarde pas, il se construit. Écris-nous là où tu es déjà : un responsable du mouvement
            te répond, et tu ne rates plus rien de nos actions sur le terrain.
          </p>
          <p>
            WhatsApp pour une réponse directe, Instagram et TikTok pour suivre la mobilisation, LinkedIn pour l'emploi
            et les partenariats. À toi de choisir.
          </p>
        </div>

        <div className="reseaux-liste" data-reveal style={{ '--delai': '0.12s' } as CSSProperties}>
          {RESEAUX_CONTACT.map((r, i) => (
            <a
              key={r.id}
              className="reseau"
              href={r.url}
              target={r.url === '#' ? undefined : '_blank'}
              rel="noreferrer"
              style={{ '--marque': r.couleur, '--delai': `${0.18 + i * 0.08}s` } as CSSProperties}
            >
              <span className="reseau-logo">
                <LogoReseau nom={r.id} />
              </span>
              <span className="reseau-texte">
                <strong>{r.nom}</strong>
                <small>{r.detail}</small>
              </span>
              <span className="reseau-action">{r.action}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
