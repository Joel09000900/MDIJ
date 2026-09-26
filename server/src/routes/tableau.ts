import { Router, type Request, type Response } from 'express'
import { exigeAdmin } from '../auth.js'
import { pool } from '../db.js'
import { libelleActivite, normaliserLieu, normaliserTelephone } from '../normalisation.js'

export const tableauRouter = Router()

/** Une personne, quelle que soit la table d'origine. */
interface Inscrit {
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
  source: 'Registre' | 'Site' | 'Ancienne base'
  date: string
}

interface LigneMembre {
  id: string
  numero: number | null
  nom_prenom: string
  domicile: string | null
  telephone: string | null
  activite: string
  activite_detail: string | null
  fiche_source: number | null
  created_at: Date
}

interface LigneAdhesion {
  id: string
  created_at: Date
  nom: string
  telephone: string
  quartier: string
  souhait: string
}

interface LigneAncienne {
  id: number
  nom: string
  tel: string | null
  quartier: string | null
  role: string | null
  createdAt: Date
}

/** Une table absente ne doit pas faire tomber tout le tableau de bord. */
async function interroger<T extends object>(sql: string): Promise<T[]> {
  try {
    const { rows } = await pool.query<T>(sql)
    return rows
  } catch (err) {
    console.error('Requête ignorée :', err instanceof Error ? err.message : err)
    return []
  }
}

/**
 * GET /api/tableau-de-bord — rassemble les trois tables de la base en une seule
 * liste normalisée. Les agrégats sont calculés côté navigateur pour que les
 * filtres du tableau de bord réagissent sans aller-retour réseau.
 */
tableauRouter.get('/', exigeAdmin, async (_req: Request, res: Response) => {
  const [membres, adhesions, anciennes] = await Promise.all([
    interroger<LigneMembre>(
      `SELECT id, numero, nom_prenom, domicile, telephone, activite::text AS activite,
              activite_detail, fiche_source, created_at
       FROM membres ORDER BY numero NULLS LAST`,
    ),
    interroger<LigneAdhesion>(
      `SELECT id, created_at, nom, telephone, quartier, souhait
       FROM adhesions ORDER BY created_at DESC`,
    ),
    interroger<LigneAncienne>(
      `SELECT id, nom, tel, quartier, role, "createdAt" FROM "Adhesion" ORDER BY "createdAt" DESC`,
    ),
  ])

  const inscrits: Inscrit[] = [
    ...membres.map((m): Inscrit => {
      const lieu = normaliserLieu(m.domicile)
      return {
        id: m.id,
        nom: m.nom_prenom,
        telephone: normaliserTelephone(m.telephone),
        quartier: lieu.quartier,
        commune: lieu.commune,
        lieuBrut: m.domicile ?? '',
        activite: libelleActivite(m.activite),
        activiteDetail: m.activite_detail,
        fiche: m.fiche_source,
        souhait: null,
        source: 'Registre',
        date: m.created_at.toISOString(),
      }
    }),
    ...adhesions.map((a): Inscrit => {
      const lieu = normaliserLieu(a.quartier)
      return {
        id: a.id,
        nom: a.nom,
        telephone: normaliserTelephone(a.telephone),
        quartier: lieu.quartier,
        commune: lieu.commune,
        lieuBrut: a.quartier,
        activite: 'Non renseignée',
        activiteDetail: null,
        fiche: null,
        souhait: a.souhait,
        source: 'Site',
        date: a.created_at.toISOString(),
      }
    }),
    ...anciennes.map((a): Inscrit => {
      const lieu = normaliserLieu(a.quartier)
      return {
        id: `ancienne-${a.id}`,
        nom: a.nom,
        telephone: normaliserTelephone(a.tel),
        quartier: lieu.quartier,
        commune: lieu.commune,
        lieuBrut: a.quartier ?? '',
        activite: 'Non renseignée',
        activiteDetail: null,
        fiche: null,
        souhait: a.role,
        source: 'Ancienne base',
        date: a.createdAt.toISOString(),
      }
    }),
  ]

  res.json({
    ok: true,
    total: inscrits.length,
    parSource: {
      Registre: membres.length,
      Site: adhesions.length,
      'Ancienne base': anciennes.length,
    },
    inscrits,
  })
})
