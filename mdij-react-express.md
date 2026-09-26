# Site MDIJ — React + TypeScript (front) et Node.js + Express (back)

Reproduction de la page https://mdijci.netlify.app avec les mêmes sections, les mêmes textes et la même charte violette. Le front est en React + TypeScript (Vite). Le back est une API Node.js + Express en TypeScript qui enregistre les adhésions et renvoie le lien WhatsApp pré-rempli.

Chaque fichier du projet figure plus bas avec son chemin. Crée l'arborescence dans ton IDE, colle chaque bloc dans le fichier indiqué, puis suis la partie « Lancer le projet ».

## Arborescence

```
mdij/
├── package.json                 scripts pour lancer front + back ensemble
├── .gitignore
├── render.yaml                  déploiement de l'API sur Render
├── server/                      API Node.js + Express
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── data/                    adhesions.json est créé ici automatiquement
│   └── src/
│       ├── index.ts             démarrage du serveur
│       ├── config.ts            variables d'environnement
│       ├── types.ts
│       ├── validation.ts        contrôle des champs du bulletin
│       ├── store.ts             enregistrement des adhésions (fichier JSON)
│       ├── whatsapp.ts          construction du lien wa.me
│       └── routes/adhesions.ts  POST et GET /api/adhesions
└── client/                      front React + TypeScript
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .env.example
    ├── vercel.json
    ├── index.html
    ├── public/
    │   ├── manifest.json
    │   └── images/              logo.png, meeting.jpg, mobilisation.jpg, president.jpg
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── types.ts
        ├── content.ts           textes, numéros et liens
        ├── api.ts               appel à l'API Express
        ├── styles/global.css
        └── components/
            ├── Logo.tsx  Reseaux.tsx  TopBar.tsx  Header.tsx
            ├── Hero.tsx  About.tsx  Mission.tsx  Services.tsx
            ├── President.tsx  Rejoindre.tsx  DonModal.tsx
            └── Footer.tsx  WhatsAppFloat.tsx
```

## Lancer le projet

Il faut Node.js 18 ou plus récent.

```bash
cd mdij
npm run install:all                     # installe racine, server et client
cp server/.env.example server/.env      # puis modifie ADMIN_TOKEN
npm run dev                             # API sur :4000, site sur :5173
```

Ouvre http://localhost:5173. En local, Vite redirige `/api` vers `http://localhost:4000`, donc aucune configuration d'URL n'est nécessaire.

Les images ne sont pas dans ce document. Récupère-les depuis le site actuel (clic droit, « Enregistrer l'image sous ») et place-les dans `client/public/images/` sous ces noms : `logo.png`, `meeting.jpg`, `mobilisation.jpg`, `president.jpg`.

## Fonctionnement du bulletin d'adhésion

1. Le front vérifie les quatre champs.
2. Il envoie le bulletin en `POST /api/adhesions`.
3. L'API revérifie, enregistre l'adhésion dans `server/data/adhesions.json` et renvoie le lien WhatsApp pré-rempli.
4. Le front ouvre WhatsApp ; l'adhérent appuie sur « Envoyer ».

Si l'API ne répond pas, le front ouvre quand même WhatsApp avec le même message. Aucune adhésion n'est perdue.

Pour consulter la liste des adhérents :

```bash
curl https://TON-API.onrender.com/api/adhesions -H "Authorization: Bearer TON_ADMIN_TOKEN"
```

## Routes de l'API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | vérifie que l'API tourne |
| POST | `/api/adhesions` | enregistre un bulletin, renvoie `whatsappUrl` |
| GET | `/api/adhesions` | liste des adhésions, protégée par `ADMIN_TOKEN` |

Corps attendu par `POST /api/adhesions` :

```json
{
  "nom": "Konan Yao Michel",
  "telephone": "07 02 05 02 84",
  "quartier": "Yopougon Niangon",
  "souhait": "Devenir militant"
}
```

`souhait` accepte uniquement : `Devenir militant`, `Devenir bénévole terrain`, `Soutenir financièrement`, `Simplement être informé`.

## Déploiement

Front sur Vercel : importe le dépôt, choisis `client` comme « Root Directory ». Vite est détecté. Dans les variables d'environnement, ajoute `VITE_API_URL=https://TON-API.onrender.com`.

API sur Render : le fichier `render.yaml` crée le service web. Mets l'adresse Vercel de ton site dans `CLIENT_ORIGIN`. Le disque de Render est effacé à chaque redéploiement, donc `adhesions.json` ne suffit pas en production durable : ajoute un disque persistant Render monté sur `server/data`, ou passe à PostgreSQL (seul `store.ts` est à réécrire).

## À compléter

- `client/src/content.ts`, constante `RESEAUX` : les liens Facebook, TikTok et YouTube sont sur `#`, comme sur le site actuel.
- `server/.env` : remplace `ADMIN_TOKEN` par un jeton long et secret.
- Les quatre images dans `client/public/images/`.

---

# Code source

## Racine

### `package.json`

```json
{
  "name": "mdij",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "install:all": "npm install && npm --prefix server install && npm --prefix client install",
    "dev": "concurrently -n server,client -c magenta,cyan \"npm --prefix server run dev\" \"npm --prefix client run dev\"",
    "build": "npm --prefix server run build && npm --prefix client run build",
    "start": "npm --prefix server start"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

### `.gitignore`

```gitignore
node_modules
dist
.env
server/data/adhesions.json
.DS_Store
```

### `render.yaml`

```yaml
services:
  - type: web
    name: mdij-api
    runtime: node
    rootDir: server
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: CLIENT_ORIGIN
        value: https://mdij.vercel.app
      - key: WHATSAPP_NUMBER
        value: "2250702050284"
      - key: ADMIN_TOKEN
        generateValue: true
```

## Backend — server

### `server/package.json`

```json
{
  "name": "mdij-server",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "express-rate-limit": "^7.4.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.10.1",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

### `server/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

### `server/.env.example`

```bash
PORT=4000
# URL du front autorisée à appeler l'API (Vercel en production)
CLIENT_ORIGIN=http://localhost:5173
# Numéro WhatsApp du MDIJ, format international sans + ni espaces
WHATSAPP_NUMBER=2250702050284
# Jeton pour lire la liste des adhésions (GET /api/adhesions)
ADMIN_TOKEN=change-moi-par-un-long-jeton
```

### `server/src/config.ts`

```ts
import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigins: required('CLIENT_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim()),
  whatsappNumber: required('WHATSAPP_NUMBER', '2250702050284'),
  adminToken: process.env.ADMIN_TOKEN ?? '',
  isProd: process.env.NODE_ENV === 'production',
} as const
```

### `server/src/types.ts`

```ts
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
```

### `server/src/validation.ts`

```ts
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
```

### `server/src/store.ts`

```ts
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Adhesion, AdhesionInput } from './types.js'

/**
 * Stockage simple dans un fichier JSON.
 * Suffisant pour démarrer ; à remplacer par PostgreSQL / MongoDB
 * quand le nombre d'adhérents grossit (Render propose PostgreSQL).
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(here, '..', 'data')
const FILE = path.join(DATA_DIR, 'adhesions.json')

let queue: Promise<unknown> = Promise.resolve()

async function readAll(): Promise<Adhesion[]> {
  try {
    const raw = await readFile(FILE, 'utf8')
    return JSON.parse(raw) as Adhesion[]
  } catch {
    return []
  }
}

export function listAdhesions(): Promise<Adhesion[]> {
  return readAll()
}

export function saveAdhesion(input: AdhesionInput): Promise<Adhesion> {
  const task = queue.then(async () => {
    await mkdir(DATA_DIR, { recursive: true })
    const all = await readAll()
    const adhesion: Adhesion = { id: randomUUID(), createdAt: new Date().toISOString(), ...input }
    all.push(adhesion)
    await writeFile(FILE, JSON.stringify(all, null, 2), 'utf8')
    return adhesion
  })
  queue = task.catch(() => undefined)
  return task
}
```

### `server/src/whatsapp.ts`

```ts
import { config } from './config.js'
import type { AdhesionInput } from './types.js'

export function waLink(message: string): string {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function adhesionMessage(a: AdhesionInput): string {
  return [
    'Bonjour MDIJ, je souhaite adhérer au mouvement.',
    '',
    `Nom & prénoms : ${a.nom}`,
    `Téléphone / WhatsApp : ${a.telephone}`,
    `Quartier / Commune : ${a.quartier}`,
    `Je souhaite : ${a.souhait}`,
  ].join('\n')
}
```

### `server/src/routes/adhesions.ts`

```ts
import { Router, type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
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
adhesionsRouter.get('/', async (req: Request, res: Response) => {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '')
  if (!config.adminToken || token !== config.adminToken) {
    res.status(401).json({ ok: false, error: 'Non autorisé' })
    return
  }
  const all = await listAdhesions()
  res.json({ ok: true, total: all.length, adhesions: all })
})
```

### `server/src/index.ts`

```ts
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from './config.js'
import { adhesionsRouter } from './routes/adhesions.js'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: config.clientOrigins }))
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'mdij-api', time: new Date().toISOString() })
})

app.use('/api/adhesions', adhesionsRouter)

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

app.listen(config.port, () => {
  console.log(`API MDIJ sur http://localhost:${config.port}`)
})
```

## Frontend — client

### `client/package.json`

```json
{
  "name": "mdij-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

### `client/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

### `client/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En développement, /api est redirigé vers le serveur Express
    proxy: { '/api': 'http://localhost:4000' },
  },
})
```

### `client/.env.example`

```bash
# URL de l'API Express en production (Render). Vide en local : le proxy Vite s'en charge.
VITE_API_URL=
```

### `client/vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### `client/index.html`

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MDIJ — Mouvement Démocratique pour l'Insertion des Jeunes</title>
    <meta name="description" content="MDIJ, Mouvement Démocratique pour l'Insertion des Jeunes. Yopougon, Côte d'Ivoire. Donne ta voix. Bâtis ton avenir." />
    <meta name="theme-color" content="#4E1A6B" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="MDIJ — Mouvement Démocratique pour l'Insertion des Jeunes" />
    <meta property="og:description" content="Donne ta voix. Bâtis ton avenir." />
    <meta property="og:image" content="/images/logo.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="MDIJ" />
    <link rel="icon" href="/images/logo.png" />
    <link rel="apple-touch-icon" href="/images/logo.png" />
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `client/public/manifest.json`

```json
{
  "name": "MDIJ — Mouvement Démocratique pour l'Insertion des Jeunes",
  "short_name": "MDIJ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4E1A6B",
  "icons": [{ "src": "/images/logo.png", "sizes": "512x512", "type": "image/png" }]
}
```

### `client/src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root introuvable')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### `client/src/App.tsx`

```tsx
import { useState } from 'react'
import About from './components/About'
import DonModal from './components/DonModal'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Mission from './components/Mission'
import President from './components/President'
import Rejoindre from './components/Rejoindre'
import Services from './components/Services'
import TopBar from './components/TopBar'
import WhatsAppFloat from './components/WhatsAppFloat'

export default function App() {
  const [donOuvert, setDonOuvert] = useState(false)

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <About />
        <Mission />
        <Services onDon={() => setDonOuvert(true)} />
        <President />
        <Rejoindre />
      </main>
      <Footer />
      <DonModal open={donOuvert} onClose={() => setDonOuvert(false)} />
      <WhatsAppFloat />
    </>
  )
}
```

### `client/src/types.ts`

```ts
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
```

### `client/src/content.ts`

```ts
import type { Pilier, Service } from './types'

export const CONTACT = {
  whatsapp: '2250702050284',
  telephone: '+225 07 02 05 02 84',
  numeroDon: '07 02 05 02 84',
  email: 'jp3522885@gmail.com',
  localisation: 'Yopougon, Abidjan',
} as const

/** Remplace les « # » par les vraies URLs des pages. */
export const RESEAUX = [
  { label: 'f', nom: 'Facebook', url: '#' },
  { label: 'Tk', nom: 'TikTok', url: '#' },
  { label: 'Yt', nom: 'YouTube', url: '#' },
  { label: 'W', nom: 'WhatsApp', url: `https://wa.me/${CONTACT.whatsapp}` },
] as const

export const NAV = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#about', label: 'Le Mouvement' },
  { href: '#mission', label: 'Nos Combats' },
  { href: '#services', label: 'Services' },
  { href: '#president', label: 'Le Président' },
  { href: '#contact', label: 'Contact' },
] as const

export const PILIERS: Pilier[] = [
  {
    icon: '🤝',
    titre: 'Insertion sociale',
    texte: 'Recréer le lien : accompagnement, solidarité et dignité pour chaque jeune trop souvent livré à lui-même.',
  },
  {
    icon: '🎭',
    titre: 'Renaissance culturelle',
    texte: 'Réconcilier la jeunesse avec ses us et coutumes, ses langues et son identité. Moderne sans se renier.',
  },
  {
    icon: '📈',
    titre: 'Puissance économique',
    texte: 'Se lever, entreprendre et conquérir notre souveraineté économique face à la domination étrangère.',
  },
  {
    icon: '🗳️',
    titre: 'Engagement politique',
    texte: 'Ramener la jeunesse au premier plan : des jeunes députés, des jeunes maires, des jeunes qui décident.',
  },
]

export const SERVICES: Service[] = [
  {
    icon: '📄',
    categorie: 'Emploi',
    titre: 'Dépose ton CV',
    texte: 'Envoie-nous ton CV : le MDIJ te trouve des offres d’emploi en ',
    fort: '72 heures',
    apresFort: '. Ta compétence mérite une chance.',
    bouton: '💬 Déposer mon CV',
    message:
      'Bonjour MDIJ, je viens de la rubrique « Déposer mon CV / Offres d\'emploi en 72h ». Je souhaite déposer mon CV.',
  },
  {
    icon: '🚀',
    categorie: 'Entreprendre',
    titre: 'Financement de projet',
    texte: 'Tu as un projet, une idée, une entreprise à lancer ? Le MDIJ t’accompagne pour financer ton ambition.',
    bouton: '💬 Financer mon projet',
    message: 'Bonjour MDIJ, je viens de la rubrique « Financement de projet ». J\'aimerais présenter mon projet.',
  },
  {
    icon: '🎁',
    categorie: 'Solidarité',
    titre: 'Faire un don ou legs',
    texte: 'Soutiens le combat de la jeunesse. Chaque don renforce nos actions sociales, culturelles et économiques.',
    bouton: '🎁 Faire un don / legs',
  },
]

export const AVANTAGES = [
  'Participe aux actions de terrain à Yopougon',
  'Forme-toi et développe ton leadership',
  'Défends la culture et l’économie ivoiriennes',
  'Porte la voix des jeunes jusqu’aux institutions',
] as const

export const MESSAGE_CONTACT = 'Bonjour MDIJ, je vous contacte depuis votre site.'

export function waLink(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
```

### `client/src/api.ts`

```ts
import type { AdhesionForm, AdhesionResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function envoyerAdhesion(data: AdhesionForm): Promise<AdhesionResponse> {
  const res = await fetch(`${API_URL}/api/adhesions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return (await res.json()) as AdhesionResponse
}
```

### `client/src/components/Logo.tsx`

```tsx
export default function Logo({ taille = 46 }: { taille?: number }) {
  return <img src="/images/logo.png" alt="Logo MDIJ" width={taille} height={taille} className="logo-img" />
}
```

### `client/src/components/Reseaux.tsx`

```tsx
import { RESEAUX } from '../content'

export default function Reseaux() {
  return (
    <div className="socials">
      {RESEAUX.map((r) => (
        <a key={r.nom} href={r.url} aria-label={r.nom} target={r.url === '#' ? undefined : '_blank'} rel="noreferrer">
          {r.label}
        </a>
      ))}
    </div>
  )
}
```

### `client/src/components/TopBar.tsx`

```tsx
import { CONTACT, waLink } from '../content'
import Reseaux from './Reseaux'

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <p className="topbar-welcome">
          Bienvenue sur le site officiel du MDIJ — <strong>Une jeunesse debout.</strong>
        </p>
        <div className="topbar-contacts">
          <a href={waLink()}>📱 {CONTACT.telephone}</a>
          <a href={`mailto:${CONTACT.email}`}>✉️ {CONTACT.email}</a>
          <span>📍 {CONTACT.localisation}</span>
        </div>
        <Reseaux />
      </div>
    </div>
  )
}
```

### `client/src/components/Header.tsx`

```tsx
import { useEffect, useState } from 'react'
import { NAV } from '../content'
import Logo from './Logo'

export default function Header() {
  const [ouvert, setOuvert] = useState(false)
  const [scrolle, setScrolle] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolle(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolle ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#accueil" className="brand">
          <Logo />
          <span className="brand-text">
            <strong>MDIJ</strong>
            <small>Insertion des Jeunes</small>
          </span>
        </a>

        <button
          type="button"
          className="burger"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          onClick={() => setOuvert((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${ouvert ? 'is-open' : ''}`}>
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>
              {l.label}
            </a>
          ))}
          <a href="#rejoindre" className="btn btn-primary nav-cta" onClick={() => setOuvert(false)}>
            Rejoindre
          </a>
        </nav>
      </div>
    </header>
  )
}
```

### `client/src/components/Hero.tsx`

```tsx
export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="badge">Côte d'Ivoire · Yopougon</span>
          <h1>
            Donne ta voix. <span className="accent">Bâtis ton avenir.</span>
          </h1>
          <p className="hero-lead">
            Le Mouvement Démocratique pour l'Insertion des Jeunes rend à la jeunesse ivoirienne sa place : sociale,
            culturelle, économique et politique. L'heure des spectateurs est terminée.
          </p>
          <div className="hero-actions">
            <a href="#rejoindre" className="btn btn-primary">Je rejoins le combat</a>
            <a href="#about" className="btn btn-outline">Découvrir le MDIJ</a>
          </div>
        </div>

        <figure className="hero-visual">
          <img src="/images/meeting.jpg" alt="Meeting du MDIJ à Yopougon" />
          <figcaption className="hero-quote">
            <strong>"Une jeunesse insérée, c'est une nation debout."</strong>
            <span>— Konan Famien, Président</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
```

### `client/src/components/About.tsx`

```tsx
export default function About() {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div>
          <span className="section-tag">Qui sommes-nous</span>
          <h2 className="section-title">Le MDIJ, l'équipe de confiance de la jeunesse ivoirienne.</h2>
        </div>
        <div className="about-text">
          <p>
            Fondé le <strong>11 septembre 2024</strong>, le MDIJ est né d'une conviction simple : la jeunesse doit
            compter.
          </p>
          <p>
            Nous constatons que les jeunes restent tenus à l'écart : à l'écart de l'aide sociale, à l'écart de leur
            propre culture, à l'écart de l'économie dominée par les investisseurs étrangers, et détournés de la
            politique après les crises qu'a traversées la Côte d'Ivoire de 1990 à 2010.
          </p>
          <p>
            Le MDIJ organise, forme et mobilise les jeunes pour qu'ils deviennent acteurs de leur destin et bâtisseurs
            du pays de demain.
          </p>
          <a href="#mission" className="btn btn-primary">Nos combats</a>
        </div>
      </div>
    </section>
  )
}
```

### `client/src/components/Mission.tsx`

```tsx
import { PILIERS } from '../content'

export default function Mission() {
  return (
    <section id="mission" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Notre programme</span>
          <h2 className="section-title">Nos 4 combats pour la jeunesse</h2>
          <p className="section-sub">Quatre fronts, une seule ambition : faire de chaque jeune un citoyen inséré, fier et libre.</p>
        </div>

        <div className="piliers">
          {PILIERS.map((p) => (
            <article key={p.titre} className="card pilier">
              <div className="pilier-icon" aria-hidden="true">{p.icon}</div>
              <h3>{p.titre}</h3>
              <p>{p.texte}</p>
            </article>
          ))}
        </div>

        <div className="mobilisation">
          <img src="/images/mobilisation.jpg" alt="Mobilisation des jeunes du MDIJ" />
          <div className="mobilisation-text">
            <h3>Une jeunesse debout, unie et déterminée</h3>
            <p>Sur le terrain, à chaque rassemblement, le MDIJ transforme l'énergie de la jeunesse en force de changement.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### `client/src/components/Services.tsx`

```tsx
import { SERVICES, waLink } from '../content'

export default function Services({ onDon }: { onDon: () => void }) {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Ce que le MDIJ fait pour toi</span>
          <h2 className="section-title">Nos services à la jeunesse</h2>
          <p className="section-sub">Un clic te met directement en contact avec le MDIJ. Choisis le service dont tu as besoin.</p>
        </div>

        <div className="services">
          {SERVICES.map((s) => (
            <article key={s.titre} className="card service">
              <div className="service-icon" aria-hidden="true">{s.icon}</div>
              <span className="service-cat">{s.categorie}</span>
              <h3>{s.titre}</h3>
              <p>
                {s.texte}
                {s.fort && <strong>{s.fort}</strong>}
                {s.apresFort}
              </p>
              {s.message ? (
                <a className="btn btn-whatsapp" href={waLink(s.message)} target="_blank" rel="noreferrer">
                  {s.bouton}
                </a>
              ) : (
                <button type="button" className="btn btn-primary" onClick={onDon}>
                  {s.bouton}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### `client/src/components/President.tsx`

```tsx
export default function President() {
  return (
    <section id="president" className="section section-dark">
      <div className="container president-grid">
        <div className="president-photo">
          <img src="/images/president.jpg" alt="Konan Famien, Président du MDIJ" />
        </div>
        <div>
          <span className="section-tag">Le Président</span>
          <h2 className="section-title">Konan Famien, la voix d'une génération.</h2>
          <p>
            Fondateur et Président du MDIJ, Konan Famien incarne une jeunesse qui ne baisse plus les yeux. Ancré à{' '}
            <strong>Yopougon</strong>, il porte un message clair : la jeunesse ivoirienne a le talent, le courage et la
            légitimité pour diriger.
          </p>
          <p>
            Avec audace et détermination, il trace le chemin d'un engagement concret, de terrain, au service des jeunes
            de sa commune et de tout le pays.
          </p>
          <div className="timeline">
            <div className="timeline-item">
              <strong>2028</strong>
              <span>Candidature à la Mairie de Yopougon</span>
            </div>
            <div className="timeline-item">
              <strong>2030</strong>
              <span>Élections législatives</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### `client/src/components/Rejoindre.tsx`

```tsx
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { envoyerAdhesion } from '../api'
import { AVANTAGES, waLink } from '../content'
import { SOUHAITS, type AdhesionErrors, type AdhesionForm } from '../types'

const VIDE: AdhesionForm = { nom: '', telephone: '', quartier: '', souhait: '' }

function valider(f: AdhesionForm): AdhesionErrors {
  const e: AdhesionErrors = {}
  if (f.nom.trim().length < 3) e.nom = 'Indique ton nom et tes prénoms.'
  const chiffres = f.telephone.replace(/\D/g, '')
  if (chiffres.length < 8 || chiffres.length > 15) e.telephone = 'Numéro invalide.'
  if (f.quartier.trim().length < 2) e.quartier = 'Indique ton quartier ou ta commune.'
  if (!f.souhait) e.souhait = 'Fais un choix.'
  return e
}

function messageSecours(f: AdhesionForm): string {
  return [
    'Bonjour MDIJ, je souhaite adhérer au mouvement.',
    '',
    `Nom & prénoms : ${f.nom}`,
    `Téléphone / WhatsApp : ${f.telephone}`,
    `Quartier / Commune : ${f.quartier}`,
    `Je souhaite : ${f.souhait}`,
  ].join('\n')
}

type Etat = 'idle' | 'envoi' | 'ok' | 'erreur'

export default function Rejoindre() {
  const [form, setForm] = useState<AdhesionForm>(VIDE)
  const [erreurs, setErreurs] = useState<AdhesionErrors>({})
  const [etat, setEtat] = useState<Etat>('idle')

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErreurs((er) => ({ ...er, [name]: undefined }))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const er = valider(form)
    setErreurs(er)
    if (Object.keys(er).length > 0) return

    setEtat('envoi')
    let lien = waLink(messageSecours(form))
    try {
      const res = await envoyerAdhesion(form)
      if (!res.ok) {
        setErreurs(res.errors ?? {})
        setEtat('erreur')
        return
      }
      if (res.whatsappUrl) lien = res.whatsappUrl
    } catch {
      // API injoignable : on passe quand même par WhatsApp pour ne perdre aucune adhésion.
    }
    window.open(lien, '_blank', 'noopener')
    setEtat('ok')
    setForm(VIDE)
  }

  return (
    <section id="rejoindre" className="section section-alt">
      <div className="container rejoindre-grid">
        <div>
          <span className="section-tag">Passe à l'action</span>
          <h2 className="section-title">Rejoins le MDIJ. Écris l'histoire.</h2>
          <p>
            Le changement ne se regarde pas, il se construit. En rejoignant le MDIJ, tu deviens acteur d'un mouvement
            qui rend à la jeunesse sa force et sa fierté.
          </p>
          <ul className="avantages">
            {AVANTAGES.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>

        <form className="card form" onSubmit={onSubmit} noValidate>
          <h3>Bulletin d'adhésion</h3>
          <p className="form-hint">Remplis ce formulaire, un responsable te recontacte.</p>

          <label htmlFor="nom">Nom &amp; prénoms</label>
          <input id="nom" name="nom" value={form.nom} onChange={onChange} autoComplete="name" />
          {erreurs.nom && <small className="err">{erreurs.nom}</small>}

          <label htmlFor="telephone">Téléphone / WhatsApp</label>
          <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={onChange} autoComplete="tel" />
          {erreurs.telephone && <small className="err">{erreurs.telephone}</small>}

          <label htmlFor="quartier">Quartier / Commune</label>
          <input id="quartier" name="quartier" value={form.quartier} onChange={onChange} />
          {erreurs.quartier && <small className="err">{erreurs.quartier}</small>}

          <label htmlFor="souhait">Je souhaite</label>
          <select id="souhait" name="souhait" value={form.souhait} onChange={onChange}>
            <option value="">— Choisir —</option>
            {SOUHAITS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {erreurs.souhait && <small className="err">{erreurs.souhait}</small>}

          <button type="submit" className="btn btn-primary btn-block" disabled={etat === 'envoi'}>
            {etat === 'envoi' ? 'Envoi…' : 'Envoyer mon adhésion'}
          </button>

          {etat === 'ok' && (
            <p className="form-ok">Merci ! WhatsApp s'ouvre avec ton bulletin : appuie sur « Envoyer » pour finaliser.</p>
          )}
          {etat === 'erreur' && <p className="err">Vérifie les champs signalés puis renvoie.</p>}
          <p className="form-foot">Ensemble, une jeunesse debout. 💪</p>
        </form>
      </div>
    </section>
  )
}
```

### `client/src/components/DonModal.tsx`

```tsx
import { useEffect, useState } from 'react'
import { CONTACT, MESSAGE_CONTACT, waLink } from '../content'

const APPS = [
  { id: 'wave', logo: 'WAVE', nom: 'Wave', detail: 'Envoi rapide et sans frais', url: 'https://wave.com', couleur: '#1DC8F2' },
  { id: 'maxit', logo: 'Max it', nom: 'Max It — Orange Money', detail: "Via l'application Orange", url: 'https://www.orange.ci', couleur: '#FF7900' },
] as const

async function copierNumero(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(CONTACT.numeroDon.replace(/\s/g, ''))
    return true
  } catch {
    return false
  }
}

export default function DonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  async function copier() {
    const ok = await copierNumero()
    setCopie(ok)
    if (ok) setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="don-titre" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Fermer" onClick={onClose}>×</button>
        <h3 id="don-titre">Faire un don ou legs 🎁</h3>
        <p>
          Choisis ton appli : elle s'ouvre et le numéro du MDIJ est copié — colle-le et entre le montant. Merci de
          soutenir le combat de la jeunesse !
        </p>

        {APPS.map((a) => (
          <a
            key={a.id}
            className="pay-option"
            href={a.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => void copierNumero()}
          >
            <span className="pay-logo" style={{ background: a.couleur }}>{a.logo}</span>
            <span className="pay-text">
              <strong>{a.nom}</strong>
              <small>{a.detail}</small>
            </span>
            <span className="pay-cta">Payer</span>
          </a>
        ))}

        <div className="don-numero">
          <span>Numéro du MDIJ</span>
          <strong>{CONTACT.numeroDon}</strong>
          <button type="button" className="btn btn-outline-dark" onClick={() => void copier()}>
            {copie ? '✅ Copié' : '📋 Copier le numéro'}
          </button>
        </div>

        <a className="modal-wa" href={waLink(MESSAGE_CONTACT)} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
      </div>
    </div>
  )
}
```

### `client/src/components/Footer.tsx`

```tsx
import { CONTACT, MESSAGE_CONTACT, waLink } from '../content'
import Logo from './Logo'
import Reseaux from './Reseaux'

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <Logo taille={64} />
          <p>
            Mouvement Démocratique pour l'Insertion des Jeunes. Une jeunesse insérée, une nation debout. Fondé le 11
            septembre 2024.
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>📍 Yopougon, Abidjan<br />Côte d'Ivoire</p>
          <a href={waLink(MESSAGE_CONTACT)} target="_blank" rel="noreferrer">📱 WhatsApp : {CONTACT.telephone}</a>
          <a href={`mailto:${CONTACT.email}`}>✉️ Nous écrire</a>
          <a href="#rejoindre">📝 Adhérer au MDIJ</a>
        </div>
        <div>
          <h4>Suivez-nous</h4>
          <p>Rejoignez la communauté MDIJ sur les réseaux sociaux.</p>
          <Reseaux />
        </div>
      </div>
      <div className="footer-bottom">
        © 2024–2026 MDIJ — Mouvement Démocratique pour l'Insertion des Jeunes · Yopougon, Côte d'Ivoire · Tous droits réservés.
      </div>
    </footer>
  )
}
```

### `client/src/components/WhatsAppFloat.tsx`

```tsx
import { MESSAGE_CONTACT, waLink } from '../content'

export default function WhatsAppFloat() {
  return (
    <a className="wa-float" href={waLink(MESSAGE_CONTACT)} target="_blank" rel="noreferrer" aria-label="Écrire au MDIJ sur WhatsApp">
      💬
    </a>
  )
}
```

### `client/src/styles/global.css`

```css
:root {
  --violet: #4e1a6b;
  --violet-fonce: #2f0f42;
  --violet-clair: #f3ecf7;
  --orange: #f7931e;
  --vert: #25d366;
  --texte: #1f1a24;
  --gris: #5e5566;
  --blanc: #ffffff;
  --rayon: 14px;
  --ombre: 0 10px 30px rgba(78, 26, 107, 0.12);
  --police: 'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: var(--police); color: var(--texte); background: var(--blanc); line-height: 1.6; }
img { max-width: 100%; display: block; }
a { color: inherit; }
h1, h2, h3, h4 { line-height: 1.2; margin: 0 0 0.6em; }
p { margin: 0 0 1em; }

.container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 20px; }

/* Boutons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 24px; border-radius: 999px; font-weight: 700; text-decoration: none; border: 2px solid transparent; cursor: pointer; font-size: 15px; transition: transform .15s, box-shadow .15s, background .15s; }
.btn:hover { transform: translateY(-2px); box-shadow: var(--ombre); }
.btn-primary { background: var(--orange); color: var(--blanc); }
.btn-outline { border-color: var(--blanc); color: var(--blanc); background: transparent; }
.btn-outline-dark { border-color: var(--violet); color: var(--violet); background: transparent; }
.btn-whatsapp { background: var(--vert); color: var(--blanc); }
.btn-block { width: 100%; }
.btn:disabled { opacity: .6; cursor: wait; }

/* Barre du haut */
.topbar { background: var(--violet-fonce); color: #e9dcf1; font-size: 13.5px; }
.topbar-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 20px; padding-top: 8px; padding-bottom: 8px; }
.topbar-welcome { margin: 0; }
.topbar-contacts { display: flex; flex-wrap: wrap; gap: 16px; }
.topbar a { text-decoration: none; }
.socials { display: flex; gap: 8px; }
.socials a { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.12); color: var(--blanc); text-decoration: none; font-weight: 700; font-size: 12px; }
.socials a:hover { background: var(--orange); }

/* En-tête */
.header { position: sticky; top: 0; z-index: 50; background: var(--blanc); transition: box-shadow .2s; }
.header.is-scrolled { box-shadow: 0 4px 18px rgba(0,0,0,.08); }
.header-inner { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; padding-bottom: 12px; }
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-img { object-fit: contain; }
.brand-text { display: flex; flex-direction: column; line-height: 1.1; }
.brand-text strong { color: var(--violet); font-size: 22px; letter-spacing: 1px; }
.brand-text small { color: var(--gris); font-size: 12px; }
.nav { display: flex; align-items: center; gap: 22px; }
.nav a { text-decoration: none; font-weight: 600; color: var(--texte); }
.nav a:hover { color: var(--violet); }
.nav .nav-cta { color: var(--blanc); padding: 10px 20px; }
.burger { display: none; background: none; border: 0; cursor: pointer; padding: 6px; }
.burger span { display: block; width: 26px; height: 3px; margin: 5px 0; background: var(--violet); border-radius: 2px; }

/* Héro */
.hero { background: linear-gradient(135deg, var(--violet-fonce), var(--violet)); color: var(--blanc); padding: 70px 0 80px; }
.hero-inner { display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; }
.badge { display: inline-block; background: rgba(255,255,255,.15); padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 18px; }
.hero h1 { font-size: clamp(34px, 5.5vw, 58px); font-weight: 800; }
.hero .accent { color: var(--orange); display: block; }
.hero-lead { font-size: 18px; opacity: .92; max-width: 56ch; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }
.hero-visual { position: relative; margin: 0; }
.hero-visual img { border-radius: var(--rayon); width: 100%; aspect-ratio: 4/3; object-fit: cover; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
.hero-quote { position: absolute; left: -20px; bottom: -24px; max-width: 320px; background: var(--blanc); color: var(--texte); padding: 16px 18px; border-radius: var(--rayon); box-shadow: var(--ombre); border-left: 5px solid var(--orange); }
.hero-quote strong { display: block; color: var(--violet); }
.hero-quote span { font-size: 13px; color: var(--gris); }

/* Sections */
.section { padding: 80px 0; }
.section-alt { background: var(--violet-clair); }
.section-dark { background: var(--violet-fonce); color: var(--blanc); }
.section-head { text-align: center; max-width: 720px; margin: 0 auto 44px; }
.section-tag { display: inline-block; color: var(--orange); font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 13px; margin-bottom: 10px; }
.section-title { font-size: clamp(26px, 3.6vw, 40px); color: var(--violet); }
.section-dark .section-title { color: var(--blanc); }
.section-sub { color: var(--gris); }

.card { background: var(--blanc); border-radius: var(--rayon); box-shadow: var(--ombre); padding: 28px; }

/* À propos */
.about-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 48px; align-items: start; }
.about-text p { color: var(--gris); }

/* Programme */
.piliers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.pilier-icon { font-size: 38px; margin-bottom: 12px; }
.pilier h3 { color: var(--violet); font-size: 19px; }
.pilier p { color: var(--gris); font-size: 15px; margin: 0; }
.mobilisation { position: relative; margin-top: 48px; border-radius: var(--rayon); overflow: hidden; }
.mobilisation img { width: 100%; aspect-ratio: 21/8; object-fit: cover; }
.mobilisation-text { position: absolute; inset: auto 0 0 0; padding: 28px; color: var(--blanc); background: linear-gradient(transparent, rgba(47,15,66,.92)); }
.mobilisation-text h3 { font-size: 26px; }
.mobilisation-text p { margin: 0; }

/* Services */
.services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.service { display: flex; flex-direction: column; gap: 6px; }
.service-icon { font-size: 36px; }
.service-cat { color: var(--orange); font-weight: 700; text-transform: uppercase; font-size: 12.5px; letter-spacing: 1px; }
.service h3 { color: var(--violet); }
.service p { color: var(--gris); flex: 1; }
.service .btn { align-self: flex-start; }

/* Président */
.president-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 48px; align-items: center; }
.president-photo img { border-radius: var(--rayon); aspect-ratio: 3/4; object-fit: cover; width: 100%; border: 4px solid var(--orange); }
.section-dark p { color: #e3d6ec; }
.timeline { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 24px; }
.timeline-item { flex: 1 1 200px; background: rgba(255,255,255,.08); border-left: 4px solid var(--orange); padding: 16px 18px; border-radius: 10px; }
.timeline-item strong { display: block; font-size: 28px; color: var(--orange); }

/* Rejoindre */
.rejoindre-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.avantages { list-style: none; padding: 0; margin: 20px 0 0; }
.avantages li { padding: 8px 0 8px 32px; position: relative; }
.avantages li::before { content: '✔'; position: absolute; left: 0; color: var(--vert); font-weight: 800; }
.form h3 { color: var(--violet); margin-bottom: 4px; }
.form-hint { color: var(--gris); font-size: 14px; }
.form label { display: block; font-weight: 600; font-size: 14px; margin: 14px 0 6px; }
.form input, .form select { width: 100%; padding: 12px 14px; border: 1.5px solid #d9cce2; border-radius: 10px; font: inherit; background: var(--blanc); }
.form input:focus, .form select:focus { outline: none; border-color: var(--violet); box-shadow: 0 0 0 3px rgba(78,26,107,.15); }
.form .btn { margin-top: 20px; }
.err { display: block; color: #c0392b; font-size: 13px; margin-top: 4px; }
.form-ok { background: #e8f8ee; color: #1b7a43; padding: 12px; border-radius: 10px; margin-top: 14px; font-size: 14px; }
.form-foot { text-align: center; color: var(--gris); margin: 14px 0 0; font-size: 14px; }

/* Pied de page */
.footer { background: #1d0829; color: #d8c8e3; padding-top: 56px; }
.footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 36px; padding-bottom: 36px; }
.footer h4 { color: var(--blanc); }
.footer a { display: block; text-decoration: none; margin-bottom: 6px; }
.footer a:hover { color: var(--orange); }
.footer .socials a { display: grid; margin: 0; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,.1); text-align: center; padding: 18px 20px; font-size: 13px; }

/* Modal de don */
.modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(20,5,30,.7); display: grid; place-items: center; padding: 16px; }
.modal { position: relative; background: var(--blanc); border-radius: 18px; padding: 28px; width: 100%; max-width: 440px; max-height: 92vh; overflow: auto; }
.modal h3 { color: var(--violet); }
.modal p { color: var(--gris); font-size: 14.5px; }
.modal-close { position: absolute; top: 10px; right: 14px; background: none; border: 0; font-size: 28px; cursor: pointer; color: var(--gris); }
.pay-option { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1.5px solid #e6dcec; border-radius: 12px; text-decoration: none; margin-bottom: 10px; }
.pay-option:hover { border-color: var(--violet); }
.pay-logo { color: var(--blanc); font-weight: 800; padding: 10px 12px; border-radius: 10px; font-size: 13px; min-width: 64px; text-align: center; }
.pay-text { flex: 1; display: flex; flex-direction: column; }
.pay-text small { color: var(--gris); }
.pay-cta { background: var(--violet); color: var(--blanc); padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 13px; }
.don-numero { background: var(--violet-clair); border-radius: 12px; padding: 16px; text-align: center; margin-top: 8px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
.don-numero strong { font-size: 24px; color: var(--violet); letter-spacing: 1px; }
.modal-wa { position: absolute; bottom: 14px; right: 14px; text-decoration: none; font-size: 22px; }

/* Bouton WhatsApp flottant */
.wa-float { position: fixed; right: 18px; bottom: 18px; z-index: 60; width: 58px; height: 58px; border-radius: 50%; background: var(--vert); display: grid; place-items: center; font-size: 26px; text-decoration: none; box-shadow: 0 8px 24px rgba(0,0,0,.25); }

/* Responsive */
@media (max-width: 960px) {
  .hero-inner, .about-grid, .president-grid, .rejoindre-grid { grid-template-columns: 1fr; }
  .piliers { grid-template-columns: repeat(2, 1fr); }
  .services, .footer-grid { grid-template-columns: 1fr; }
  .hero-quote { position: static; margin-top: 16px; max-width: none; }
  .burger { display: block; }
  .nav { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; background: var(--blanc); padding: 10px 20px 20px; box-shadow: 0 10px 20px rgba(0,0,0,.08); }
  .nav.is-open { display: flex; }
  .nav a { padding: 12px 0; border-bottom: 1px solid #eee; }
  .nav .nav-cta { margin-top: 12px; border: 0; }
  .header-inner { position: relative; }
}
@media (max-width: 560px) {
  .piliers { grid-template-columns: 1fr; }
  .topbar-contacts { display: none; }
  .section { padding: 56px 0; }
  .mobilisation img { aspect-ratio: 4/3; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .btn { transition: none; }
}
```
