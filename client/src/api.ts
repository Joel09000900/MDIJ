import type { AdhesionForm, AdhesionResponse, ReponseAdhesions, ReponseConnexion, ReponseTableau } from './types'

const API_URL = import.meta.env?.VITE_API_URL ?? ''

export async function envoyerAdhesion(data: AdhesionForm): Promise<AdhesionResponse> {
  const res = await fetch(`${API_URL}/api/adhesions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return (await res.json()) as AdhesionResponse
}

/** Échange le mot de passe du président contre un jeton d'accès. */
export async function connexion(motDePasse: string): Promise<ReponseConnexion> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motDePasse }),
  })
  return (await res.json()) as ReponseConnexion
}

/** Liste complète des adhésions, réservée au président. */
export async function chargerAdhesions(jeton: string): Promise<ReponseAdhesions> {
  const res = await fetch(`${API_URL}/api/adhesions`, {
    headers: { Authorization: `Bearer ${jeton}` },
  })
  return (await res.json()) as ReponseAdhesions
}

/** Toutes les personnes de la base, normalisées, pour le tableau de bord. */
export async function chargerTableau(jeton: string): Promise<ReponseTableau> {
  const res = await fetch(`${API_URL}/api/tableau-de-bord`, {
    headers: { Authorization: `Bearer ${jeton}` },
  })
  return (await res.json()) as ReponseTableau
}
