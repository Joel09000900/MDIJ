export const SOUHAITS = [
  'Devenir militant',
  'Devenir bénévole terrain',
  'Soutenir financièrement',
  'Simplement être informé',
] as const

export type Souhait = (typeof SOUHAITS)[number]

export interface AdhesionForm {
  nom: string
  telephone: string
  quartier: string
  souhait: Souhait | ''
}

export type AdhesionErrors = Partial<Record<keyof AdhesionForm, string>>

export interface AdhesionResponse {
  ok: boolean
  id?: string
  whatsappUrl?: string
  errors?: AdhesionErrors
}

export interface Pilier {
  icon: string
  titre: string
  texte: string
}

export interface Service {
  icon: string
  categorie: string
  titre: string
  texte: string
  fort?: string
  apresFort?: string
  bouton: string
  message?: string
}

export interface Adhesion {
  id: string
  createdAt: string
  nom: string
  telephone: string
  quartier: string
  souhait: Souhait
}

export interface ReponseConnexion {
  ok: boolean
  token?: string
  error?: string
}

export interface ReponseAdhesions {
  ok: boolean
  total?: number
  adhesions?: Adhesion[]
  error?: string
}

export type SourceInscrit = 'Registre' | 'Site' | 'Ancienne base'

/** Une personne du mouvement, toutes tables confondues, après normalisation. */
export interface Inscrit {
  id: string
  nom: string
  telephone: string | null
  quartier: string
  commune: string
  lieuBrut: string
  activite: string
  activiteDetail: string | null
  fiche: number | null
  souhait: string | null
  source: SourceInscrit
  date: string
}

export interface ReponseTableau {
  ok: boolean
  total?: number
  parSource?: Record<SourceInscrit, number>
  inscrits?: Inscrit[]
  error?: string
}
