import { createHash, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { config } from './config.js'

/** Comparaison à durée constante : ne révèle rien par le temps de réponse. */
function memeSecret(a: string, b: string): boolean {
  if (!a || !b) return false
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function motDePasseValide(saisi: unknown): boolean {
  if (typeof saisi !== 'string' || !config.adminPassword) return false
  return memeSecret(saisi, config.adminPassword)
}

/** Protège une route : en-tête « Authorization: Bearer <ADMIN_TOKEN> ». */
export function exigeAdmin(req: Request, res: Response, next: NextFunction): void {
  const jeton = req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!config.adminToken || !memeSecret(jeton, config.adminToken)) {
    res.status(401).json({ ok: false, error: 'Non autorisé' })
    return
  }
  next()
}
