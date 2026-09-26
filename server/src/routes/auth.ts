import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { motDePasseValide } from '../auth.js'
import { config } from '../config.js'

export const authRouter = Router()

/** Peu de tentatives : c'est la seule porte d'entrée de l'espace du président. */
const limiteur = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Trop de tentatives. Réessaie dans 15 minutes.' },
})

/** POST /api/auth/login — échange le mot de passe contre le jeton d'accès. */
authRouter.post('/login', limiteur, (req: Request, res: Response) => {
  const { motDePasse } = (req.body ?? {}) as { motDePasse?: unknown }

  if (!config.adminPassword || !config.adminToken) {
    res.status(500).json({ ok: false, error: "L'accès administrateur n'est pas configuré sur le serveur." })
    return
  }
  if (!motDePasseValide(motDePasse)) {
    res.status(401).json({ ok: false, error: 'Mot de passe incorrect.' })
    return
  }
  res.json({ ok: true, token: config.adminToken })
})
