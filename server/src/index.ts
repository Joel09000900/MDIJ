import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from './config.js'
import { baseAccessible, initBase } from './db.js'
import { adhesionsRouter } from './routes/adhesions.js'
import { authRouter } from './routes/auth.js'
import { tableauRouter } from './routes/tableau.js'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: config.clientOrigins }))
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', async (_req, res) => {
  res.json({
    ok: true,
    service: 'mdij-api',
    base: (await baseAccessible()) ? 'connectée' : 'injoignable',
    time: new Date().toISOString(),
  })
})

app.use('/api/auth', authRouter)
app.use('/api/adhesions', adhesionsRouter)
app.use('/api/tableau-de-bord', tableauRouter)

// En production (Render), le serveur peut aussi servir le front compilé.
const here = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.resolve(here, '..', '..', 'client', 'dist')
if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ ok: false, error: 'Erreur serveur' })
})

// La table est créée au démarrage si elle n'existe pas encore.
// Même si la base est injoignable, le site public doit rester servi.
initBase()
  .then(() => console.log('Base PostgreSQL prête'))
  .catch((err) => console.error('Base PostgreSQL injoignable :', err instanceof Error ? err.message : err))
  .finally(() => {
    app.listen(config.port, () => {
      console.log(`API MDIJ sur http://localhost:${config.port}`)
    })
  })
