import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { navLinks, site } from "../config/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="logo" aria-hidden="true">
            {site.sigle.charAt(0)}
          </span>
          {site.sigle}
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="menu-principal"
          className={`navbar__menu${open ? " is-open" : ""}`}
          aria-label="Navigation principale"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => `navbar__link${isActive ? " is-active" : ""}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/adherer" className="btn btn--accent">
                Adhérer au mouvement
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
