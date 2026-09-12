import { Link } from "react-router";
import { navLinks, site } from "../config/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">
            <span className="logo" aria-hidden="true">
              {site.sigle.charAt(0)}
            </span>
            {site.sigle}
          </p>
          <p className="footer__muted">{site.slogan}</p>
        </div>

        <div>
          <h3>Navigation</h3>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/adherer">Adhérer au mouvement</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer__muted">
            <li>{site.contact.adresse}</li>
            <li>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </li>
            <li>{site.contact.telephone}</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          © {new Date().getFullYear()} {site.nomComplet}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
