import { useEffect, useState } from 'react'

export type Theme = 'clair' | 'sombre'

const CLE = 'mdij.theme'

/**
 * Thème au chargement : le choix mémorisé s'il existe, sinon le réglage du
 * système d'exploitation. Le même calcul est fait par le petit script de
 * `index.html`, qui pose la classe avant le premier affichage pour éviter
 * un éclair blanc à l'ouverture.
 */
export function themeInitial(): Theme {
  try {
    const stocke = localStorage.getItem(CLE)
    if (stocke === 'sombre' || stocke === 'clair') return stocke
  } catch {
    // stockage bloqué : on retombe sur la préférence système
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair'
  } catch {
    return 'clair'
  }
}

export function appliquerTheme(theme: Theme): void {
  document.documentElement.classList.toggle('theme-sombre', theme === 'sombre')
  try {
    localStorage.setItem(CLE, theme)
  } catch {
    // préférence non mémorisée : elle durera le temps de l'onglet
  }
}

/**
 * Suit le thème en cours pour les composants dont le texte en dépend
 * (la légende de la carte de chaleur, par exemple). Observer la classe évite
 * de faire descendre un état de thème à travers toute l'application.
 */
export function useSombre(): boolean {
  const [sombre, setSombre] = useState(() => document.documentElement.classList.contains('theme-sombre'))

  useEffect(() => {
    const observateur = new MutationObserver(() =>
      setSombre(document.documentElement.classList.contains('theme-sombre')),
    )
    observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observateur.disconnect()
  }, [])

  return sombre
}
