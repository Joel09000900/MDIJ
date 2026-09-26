import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Remonte en haut à chaque changement de page.
 * Si l'URL porte une ancre (« /#about »), descend jusqu'à la section correspondante,
 * y compris quand on arrive depuis une autre page.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const cible = document.getElementById(hash.slice(1))
    if (cible) cible.scrollIntoView({ behavior: 'smooth' })
  }, [pathname, hash])

  return null
}
