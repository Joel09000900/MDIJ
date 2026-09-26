import pg from 'pg'
import { config } from './config.js'

/**
 * Pool de connexions PostgreSQL (Neon).
 * `ssl` est passé explicitement : la vérification complète du certificat reste
 * active quelle que soit la façon dont les futures versions de pg interpréteront
 * le « sslmode » présent dans l'URL.
 */
export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: { rejectUnauthorized: true },
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

pool.on('error', (err) => {
  console.error('Erreur inattendue du pool PostgreSQL :', err.message)
})

/** Crée la table des adhésions si elle n'existe pas encore. */
export async function initBase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS adhesions (
      id         UUID PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      nom        TEXT NOT NULL,
      telephone  TEXT NOT NULL,
      quartier   TEXT NOT NULL,
      souhait    TEXT NOT NULL
    )
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS adhesions_created_at_idx ON adhesions (created_at DESC)
  `)
}

/** Ping simple, utilisé par /api/health. */
export async function baseAccessible(): Promise<boolean> {
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}
