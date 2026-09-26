# Site MDIJ — React + TypeScript (front) et Node.js + Express (back)

Site du **Mouvement Démocratique pour l'Insertion des Jeunes** (Yopougon, Côte d'Ivoire).

- **Front** : React 18 + TypeScript (Vite), navigation multi-pages avec React Router.
- **Back** : API Node.js + Express en TypeScript. Elle enregistre les adhésions dans
  PostgreSQL (Neon) et renvoie le lien WhatsApp pré-rempli.

## Arborescence

```
mdij/
├── package.json                 scripts pour lancer front + back ensemble
├── render.yaml                  déploiement de l'API sur Render
├── server/                      API Node.js + Express
│   ├── .env / .env.example      DATABASE_URL, ADMIN_PASSWORD, ADMIN_TOKEN…
│   ├── nodemon.json             redémarrage automatique en développement
│   └── src/
│       ├── index.ts             démarrage, création de la table, /api/health
│       ├── config.ts            variables d'environnement
│       ├── db.ts                pool PostgreSQL (Neon) + schéma
│       ├── store.ts             lecture / écriture des adhésions
│       ├── auth.ts              comparaison du mot de passe, garde des routes
│       ├── validation.ts        contrôle des champs du bulletin
│       ├── whatsapp.ts          construction du lien wa.me
│       ├── normalisation.ts    regroupe les domiciles saisis à la main
│       └── routes/              adhesions.ts · auth.ts · tableau.ts
└── client/                      front React + TypeScript
    ├── vercel.json
    ├── public/images/           logo.png, meeting.jpg, mobilisation.jpg, president.jpg
    └── src/
        ├── main.tsx  App.tsx  types.ts
        ├── content.ts           textes, numéros, réseaux et menu
        ├── api.ts               appels à l'API Express
        ├── session.ts           jeton du président
        ├── stats.ts             calculs du tableau de bord
        ├── theme.ts             mode clair / sombre du site
        ├── styles/global.css
        ├── pages/               Accueil · NosCombats · LePresident · Contact
        │                        Rejoindre · Connexion · Administration
        └── components/
            ├── Header.tsx  Footer.tsx  Logo.tsx  LogoReseau.tsx
            ├── Hero.tsx  About.tsx  Mission.tsx  Services.tsx  President.tsx
            ├── BulletinAdhesion.tsx  DonModal.tsx  WhatsAppFloat.tsx
            ├── Reveal.tsx  ScrollToHash.tsx
            └── admin/           Tuile · Barres · Colonnes · BarreEmpilee
                                 Carte (chaleur) · Jauge
```

## Lancer le projet

Il faut Node.js 18 ou plus récent.

```bash
npm run install:all   # installe racine, server et client
npm run dev           # API sur :4000, site sur :5173
```

`server/.env` contient déjà la chaîne Neon, le jeton et le mot de passe.
Pour repartir de zéro : `cp server/.env.example server/.env`, puis renseigne les valeurs.

## Mode nuit

Le bouton 🌙 de la barre de navigation bascule **tout le site** en affichage
sombre. Le choix est mémorisé ; sans choix, le site suit le réglage du système.
La classe est posée par un court script de `index.html` avant le premier
affichage, pour éviter un éclair blanc à l'ouverture. Les graphiques du tableau
de bord ont leurs propres teintes de nuit, validées contre la surface sombre.

## Les pages

| Page | URL | Contenu |
|---|---|---|
| Accueil | `/` | héro, le mouvement, services |
| Nos Combats | `/nos-combats` | les 4 piliers du programme |
| Le Président | `/le-president` | portrait de Konan Famien |
| Contact | `/contact` | choix du réseau : WhatsApp, Instagram, TikTok, LinkedIn |
| Rejoindre | `/rejoindre` | bulletin d'adhésion |
| Connexion | `/connexion` | accès réservé au président |
| Tableau de bord | `/administration` | statistiques et demandes d'adhésion |

## Fonctionnement du bulletin d'adhésion

1. Le front vérifie les quatre champs.
2. Il envoie le bulletin en `POST /api/adhesions`.
3. L'API revérifie, enregistre l'adhésion dans PostgreSQL et renvoie le lien
   WhatsApp pré-rempli.
4. Le front ouvre WhatsApp ; l'adhérent appuie sur « Envoyer ».

Si l'API ne répond pas, le front ouvre quand même WhatsApp avec le même message.

## Espace du président

L'entrée « Connexion » du menu mène à `/connexion` ; le mot de passe est celui de
`ADMIN_PASSWORD`. Une fois connecté, cette entrée devient « Tableau de bord » et
`/administration` affiche :

- quatre chiffres clés : effectif, quartiers couverts, communes, arrivées de la semaine ;
- le profil des membres par activité, et la part de chaque commune ;
- les quartiers les plus mobilisés, après regroupement des orthographes ;
- une carte de chaleur croisant l'activité et la commune ;
- l'avancement du recensement par fiche de terrain ;
- trois jauges de qualité des données (téléphone, activité détaillée, fiche d'origine) ;
- la liste complète, avec recherche, filtres et export CSV.

Les filtres (recherche, activité, commune, source) agissent sur tous les visuels
à la fois. Les trois tables de la base sont réunies par `GET /api/tableau-de-bord`,
qui normalise les domiciles saisis à la main : « Yop-Sud » et « Yopougon Sud »
comptent ensemble.

Le serveur échange le mot de passe contre `ADMIN_TOKEN` (`POST /api/auth/login`),
que le navigateur conserve. Dix tentatives maximum par quart d'heure.

## Base de données

PostgreSQL hébergé sur [Neon](https://neon.tech). La table est créée au démarrage
du serveur si elle n'existe pas :

```sql
CREATE TABLE adhesions (
  id         UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nom        TEXT NOT NULL,
  telephone  TEXT NOT NULL,
  quartier   TEXT NOT NULL,
  souhait    TEXT NOT NULL
);
```

La base contient aussi deux tables antérieures, lues sans être modifiées :
`membres` (registre de terrain) et `Adhesion` (ancienne application).

Tout le serveur passe par `listAdhesions()` et `saveAdhesion()` de `store.ts` :
changer de base ne demande de réécrire que ce fichier.

## Routes de l'API

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/health` | état du service et de la base |
| POST | `/api/adhesions` | enregistre un bulletin, renvoie `whatsappUrl` |
| POST | `/api/auth/login` | `{ motDePasse }` → renvoie le jeton d'accès |
| GET | `/api/adhesions` | liste des adhésions, protégée par `ADMIN_TOKEN` |
| GET | `/api/tableau-de-bord` | registre + adhésions, normalisés, protégé |

Corps attendu par `POST /api/adhesions` :

```json
{
  "nom": "Konan Yao Michel",
  "telephone": "07 02 05 02 84",
  "quartier": "Yopougon Niangon",
  "souhait": "Devenir militant"
}
```

`souhait` accepte uniquement : `Devenir militant`, `Devenir bénévole terrain`,
`Soutenir financièrement`, `Simplement être informé`.

## Déploiement

**Front sur Vercel** : importe le dépôt, choisis `client` comme « Root Directory ».
Ajoute la variable `VITE_API_URL=https://TON-API.onrender.com`.

**API sur Render** : `render.yaml` crée le service web. Mets l'adresse Vercel du site
dans `CLIENT_ORIGIN`, et renseigne `DATABASE_URL` et `ADMIN_PASSWORD` dans le tableau
de bord Render — marquées `sync: false`, elles ne sont jamais écrites dans le dépôt.
Les adhésions vivant dans Neon, aucun disque persistant n'est nécessaire.

## À compléter

- `client/src/content.ts`, constante `RESEAUX_CONTACT` : Instagram, TikTok et
  LinkedIn sont encore sur `#`.
- `server/.env` : change `ADMIN_PASSWORD`.
