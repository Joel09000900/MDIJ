import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../content'
import { lireJeton } from '../session'
import { appliquerTheme, themeInitial, type Theme } from '../theme'
import Logo from './Logo'

export default function Header() {
  const [ouvert, setOuvert] = useState(false)
  const [scrolle, setScrolle] = useState(false)
  const { pathname, hash } = useLocation()
  const [theme, setTheme] = useState<Theme>(themeInitial)

  useEffect(() => {
    appliquerTheme(theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Entrée active : la page courante, ou l'ancre courante pour les sections de l'accueil. */
  function estActif(to: string): boolean {
    const [chemin, ancre] = to.split('#')
    const cible = chemin || '/'
    if (ancre) return pathname === '/' && hash === `#${ancre}`
    return pathname === cible && !hash
  }

  /** Sur l'accueil, un second clic sur la même ancre doit quand même redescendre. */
  function onClickLien(to: string) {
    setOuvert(false)
    const ancre = to.split('#')[1]
    if (!ancre || pathname !== '/' || hash !== `#${ancre}`) return
    document.getElementById(ancre)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`header ${scrolle ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOuvert(false)}>
          <Logo />
          <span className="brand-text">
            <strong>MDIJ</strong>
            <small>Insertion des Jeunes</small>
          </span>
        </Link>

        <nav className={`nav ${ouvert ? 'is-open' : ''}`}>
          {NAV.map((l) => {
            // une fois le président connecté, « Connexion » mène à son tableau de bord
            const connecte = l.to === '/connexion' && Boolean(lireJeton())
            const to = connecte ? '/administration' : l.to
            const label = connecte ? 'Tableau de bord' : l.label
            return (
              <Link
                key={l.to}
                to={to}
                className={`${estActif(to) ? 'is-active' : ''} ${l.to === '/connexion' ? 'nav-admin' : ''}`.trim() || undefined}
                onClick={() => onClickLien(to)}
              >
                {label}
              </Link>
            )
          })}
          <Link to="/rejoindre" className="btn btn-primary nav-cta" onClick={() => onClickLien('/rejoindre')}>
            Rejoindre
          </Link>
        </nav>

        <div className="header-outils">
          <button
            type="button"
            className="bascule-theme"
            onClick={() => setTheme((t) => (t === 'sombre' ? 'clair' : 'sombre'))}
            aria-pressed={theme === 'sombre'}
            aria-label={theme === 'sombre' ? 'Passer en affichage clair' : 'Passer en affichage sombre'}
            title={theme === 'sombre' ? 'Affichage clair' : 'Affichage sombre'}
          >
            {theme === 'sombre' ? '☀️' : '🌙'}
          </button>

          <button
            type="button"
            className={`burger ${ouvert ? 'is-open' : ''}`}
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={ouvert}
            onClick={() => setOuvert((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
