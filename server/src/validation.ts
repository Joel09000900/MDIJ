import { ADHESION_ROLES, type AdhesionInput, type AdhesionRole, type ValidationResult } from './types.js'

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function isRole(v: string): v is AdhesionRole {
  return (ADHESION_ROLES as readonly string[]).includes(v)
}

export function validateAdhesion(body: unknown): ValidationResult {
  const b = (body ?? {}) as Record<string, unknown>
  const nom = str(b.nom)
  const telephone = str(b.telephone)
  const quartier = str(b.quartier)
  const souhait = str(b.souhait)

  const errors: Partial<Record<keyof AdhesionInput, string>> = {}
  if (nom.length < 3 || nom.length > 120) errors.nom = 'Nom et prénoms requis.'
  const digits = telephone.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) errors.telephone = 'Numéro de téléphone invalide.'
  if (quartier.length < 2 || quartier.length > 120) errors.quartier = 'Quartier / commune requis.'
  if (!isRole(souhait)) errors.souhait = 'Choix invalide.'

  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return { ok: true, data: { nom, telephone, quartier, souhait: souhait as AdhesionRole } }
}
