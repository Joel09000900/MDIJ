/** Jeton d'accès du président, conservé dans le navigateur entre deux visites. */
const CLE = 'mdij.admin.token'

export function lireJeton(): string {
  try {
    return localStorage.getItem(CLE) ?? ''
  } catch {
    return ''
  }
}

export function enregistrerJeton(jeton: string): void {
  try {
    localStorage.setItem(CLE, jeton)
  } catch {
    // navigation privée ou stockage bloqué : la session durera le temps de l'onglet
  }
}

export function effacerJeton(): void {
  try {
    localStorage.removeItem(CLE)
  } catch {
    // rien à faire
  }
}

