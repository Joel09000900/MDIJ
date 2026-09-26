export const ADHESION_ROLES = [
  'Devenir militant',
  'Devenir bénévole terrain',
  'Soutenir financièrement',
  'Simplement être informé',
] as const

export type AdhesionRole = (typeof ADHESION_ROLES)[number]

export interface AdhesionInput {
  nom: string
  telephone: string
  quartier: string
  souhait: AdhesionRole
}

export interface Adhesion extends AdhesionInput {
  id: string
  createdAt: string
}

export type ValidationResult =
  | { ok: true; data: AdhesionInput }
  | { ok: false; errors: Partial<Record<keyof AdhesionInput, string>> }
