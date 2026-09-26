import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { exigeAdmin } from '../auth.js'
import { listAdhesions, saveAdhesion } from '../store.js'
import { validateAdhesion } from '../validation.js'
import { adhesionMessage, waLink } from '../whatsapp.js'

export const adhesionsRouter = Router()

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false })

/** POST /api/adhesions — enregistre une adhésion et renvoie le lien WhatsApp pré-rempli. */
adhesionsRouter.post('/', limiter, async (req: Request, res: Response) => {
  const result = validateAdhesion(req.body)
  if (!result.ok) {
    res.status(400).json({ ok: false, errors: result.errors })
    return
  }
  const adhesion = await saveAdhesion(result.data)
  res.status(201).json({ ok: true, id: adhesion.id, whatsappUrl: waLink(adhesionMessage(adhesion)) })
})

/** GET /api/adhesions — liste des adhérents (en-tête Authorization: Bearer <ADMIN_TOKEN>). */
adhesionsRouter.get('/', exigeAdmin, async (_req: Request, res: Response) => {
  const all = await listAdhesions()
  res.json({ ok: true, total: all.length, adhesions: all })
})
