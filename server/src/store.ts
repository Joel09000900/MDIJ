import { randomUUID } from 'node:crypto'
import { pool } from './db.js'
import type { Adhesion, AdhesionInput } from './types.js'

/**
 * Stockage des adhésions dans PostgreSQL (Neon).
 * Tout le serveur passe par ces deux fonctions : changer de base ne demande
 * de réécrire que ce fichier.
 */

interface Ligne {
  id: string
  created_at: Date
  nom: string
  telephone: string
  quartier: string
  souhait: string
}

function versAdhesion(l: Ligne): Adhesion {
  return {
    id: l.id,
    createdAt: l.created_at.toISOString(),
    nom: l.nom,
    telephone: l.telephone,
    quartier: l.quartier,
    souhait: l.souhait as Adhesion['souhait'],
  }
}

/** Toutes les adhésions, de la plus récente à la plus ancienne. */
export async function listAdhesions(): Promise<Adhesion[]> {
  const { rows } = await pool.query<Ligne>(
    'SELECT id, created_at, nom, telephone, quartier, souhait FROM adhesions ORDER BY created_at DESC',
  )
  return rows.map(versAdhesion)
}

/** Enregistre un bulletin et renvoie la ligne telle qu'elle a été écrite. */
export async function saveAdhesion(input: AdhesionInput): Promise<Adhesion> {
  const { rows } = await pool.query<Ligne>(
    `INSERT INTO adhesions (id, nom, telephone, quartier, souhait)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at, nom, telephone, quartier, souhait`,
    [randomUUID(), input.nom, input.telephone, input.quartier, input.souhait],
  )
  const ligne = rows[0]
  if (!ligne) throw new Error("L'adhésion n'a pas pu être enregistrée.")
  return versAdhesion(ligne)
}
