import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Anime les éléments marqués `data-reveal` quand ils entrent dans l'écran.
 * Relance l'observation à chaque changement de page, et ne fait rien
 * si l'utilisateur a demandé moins d'animations dans son système.
 */
export default function Reveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const cibles = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const moinsDAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (moinsDAnimations || !('IntersectionObserver' in window)) {
      cibles.forEach((el) => el.classList.add('is-visible'))
      return
    }

    // L'état masqué n'est posé que si ce code tourne : sans JS, rien n'est caché.
    document.documentElement.classList.add('reveal-actif')

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          if (!entree.isIntersecting) return
          entree.target.classList.add('is-visible')
          observateur.unobserve(entree.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    cibles.forEach((el) => observateur.observe(el))
    return () => observateur.disconnect()
  }, [pathname])

  return null
}
