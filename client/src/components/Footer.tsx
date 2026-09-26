import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { RESEAUX_CONTACT } from '../content'
import Logo from './Logo'
import LogoReseau from './LogoReseau'

/**
 * Pied de page volontairement sobre : les rubriques du site sont déjà
 * dans le menu, on ne garde ici que l'identité, les réseaux et la mention légale.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-marque">
          <Logo taille={46} />
          <span>
            <strong>MDIJ</strong>
            <small>Yopougon, Abidjan · Côte d'Ivoire</small>
          </span>
        </Link>

        <div className="footer-reseaux">
          {RESEAUX_CONTACT.map((r) => (
            <a
              key={r.id}
              href={r.url}
              aria-label={r.nom}
              target={r.url === '#' ? undefined : '_blank'}
              rel="noreferrer"
              style={{ '--marque': r.couleur } as CSSProperties}
            >
              <LogoReseau nom={r.id} taille={19} />
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">© 2024–2026 MDIJ — Tous droits réservés.</div>
    </footer>
  )
}
