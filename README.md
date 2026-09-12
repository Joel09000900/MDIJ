# Mdij

Monorepo React (Vite) + Node/Express + PostgreSQL (Neon), tout en TypeScript.

## Structure

- `client/` — React + Vite (port 5173, proxy `/api` vers le serveur)
  - `src/config/site.ts` — nom, slogan, Président, coordonnées (à personnaliser)
  - `src/index.css` — charte graphique (couleurs dans `:root`)
  - `src/pages/` — une page par entrée du menu
- `server/` — Express + Prisma (port 3001)

## Pages

| Menu                 | URL             |
| -------------------- | --------------- |
| Accueil              | `/`             |
| À propos             | `/a-propos`     |
| Le Président         | `/le-president` |
| Contact              | `/contact`      |
| Adhérer au mouvement | `/adherer`      |

## API

- `GET /api/health` — état du serveur
- `POST /api/contact` — `{ nom, email, sujet, message }` → table `contact_messages`
- `POST /api/adhesions` — `{ prenom, nom, email, telephone, ville, profession?, motivation?, consentement: true }` → table `adhesions` (e-mail unique)

## Prérequis

1. Créer un projet sur [neon.tech](https://neon.tech) et récupérer la connection string.
2. Copier `server/.env.example` vers `server/.env` et remplacer `DATABASE_URL` par cette connection string.

## Installation

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Base de données

Définir les modèles dans `server/prisma/schema.prisma`, puis :

```bash
cd server
npm run prisma:migrate   # crée/applique une migration
npm run prisma:generate  # régénère le client Prisma
```

## Lancer le projet (dev)

Depuis la racine :

```bash
npm run dev
```

Lance le client (http://localhost:5173) et le serveur (http://localhost:3001) en parallèle.
