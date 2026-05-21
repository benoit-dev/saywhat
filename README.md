# saywhat — Chalet Matawinie 2026

App du weekend pour le crew. Migrée depuis un artifact Claude vers une vraie app Vite + React + Convex.

## Stack

- **Frontend** — Vite + React 19 + TypeScript
- **Backend** — Convex (realtime DB + file storage)
- **Auth** — Code d'accès partagé (`pixie`) + picker de nom dans la liste du crew
- **Hosting** — Railway (frontend statique), Convex hébergé chez Convex

## Setup local (premier lancement)

```bash
npm install
npx convex dev
```

`npx convex dev` ouvre un navigateur pour le login Convex puis crée ton projet. Une fois lancé, il :

1. Écrit `VITE_CONVEX_URL` dans `.env.local`
2. Regénère `convex/_generated/` avec les vrais types
3. Pousse le schéma et les functions au cloud Convex

Laisse `npx convex dev` tourner dans un terminal — il sync à chaque modif de `convex/`.

Dans un **second** terminal :

```bash
npm run dev
```

L'app tourne sur http://localhost:5173 — code d'accès `pixie`.

### Seed initial

La première fois (DB Convex vide), seed les données par défaut :

```bash
npx convex run seed:seedAll
```

Idempotent — tu peux le re-runner, il skip ce qui existe déjà.

## Structure

```
saywhat/
├── convex/                  # Backend Convex
│   ├── schema.ts            # Schéma des tables
│   ├── courses.ts           # Mutations/queries courses (auto + manuels + overrides)
│   ├── group.ts             # Qui prend quoi
│   ├── cars.ts              # Voitures
│   ├── randos.ts            # Votes randos
│   ├── polls.ts             # Sondages Fun
│   ├── wall.ts              # Wall de citations
│   ├── photos.ts            # Photos (file storage)
│   ├── persos.ts            # Checklist perso par user
│   ├── seed.ts              # Seed initial des données
│   └── _generated/          # ⚠ Stubs minimaux — écrasés par `convex dev`
├── src/
│   ├── App.tsx              # Routing par tabs
│   ├── main.tsx             # Bootstrap + ConvexProvider
│   ├── styles.css           # CSS global (extrait 1:1 de l'artifact)
│   ├── data/
│   │   ├── constants.ts     # PEOPLE, RECIPES, MEALS, DEFAULTS, etc.
│   │   └── courses.ts       # calcQty / formatQty / generateCoursesFromRecipes
│   ├── lib/
│   │   ├── user.ts          # Context du user courant
│   │   ├── toast.tsx        # Toast notifications
│   │   └── copy.ts          # Helper clipboard avec fallback
│   ├── components/          # Header, UserBar, Tabs, AccessGate, Copyable...
│   └── views/               # 8 vues (Infos, Repas, Courses, Persos, Rando, Group, Cars, Fun)
└── index.html
```

## Modèle de données

Single-trip pour l'instant — tout est implicitement le weekend du chalet. Pas de notion de `tripId`.

Tables Convex :

- **`coursesManual`** — items ajoutés à la main
- **`coursesOverrides`** — modifs sur les items auto-générés (done/assigned/qty/name/deleted)
- **`groupItems`** — qui prend quoi (jeux, enceinte, etc.)
- **`cars`** — voitures avec driver + pax
- **`randos`** — sentiers avec liste de votes
- **`polls`** — sondages avec options inline (chaque option a sa liste de voters)
- **`wallItems`** — citations + likes
- **`photos`** — métadonnées (le fichier vit dans `_storage` Convex)
- **`persos`** — checklist privée par user (indexée par user)

## Déploiement Railway

### Frontend (Vite)

1. Crée un service Railway depuis ce repo
2. Build command : `npm run build`
3. Start command : `npm start` (sert `dist/` via `vite preview`)
4. Variables d'env :
   - `VITE_CONVEX_URL` — l'URL de **production** de ton déploiement Convex
   - `PORT` — Railway le set automatiquement

### Convex production

```bash
npx convex deploy --prod
```

Convex te donnera une URL prod (`https://*.convex.cloud`) à coller dans Railway.

Pour seed la prod :

```bash
npx convex run --prod seed:seedAll
```

## Notes design

- UI fidèle à l'artifact original — mêmes classes CSS, mêmes interactions
- Les **recettes & menus** sont hardcodés dans `src/data/constants.ts` (changement = redéploiement). Si tu veux pouvoir les éditer en runtime, on déplace ça dans Convex.
- La date de **révélation de la galerie** est `2026-05-24T12:00:00` — modifie `REVEAL_TIME` dans `constants.ts`.
- Le code d'accès est `pixie` (constante `ACCESS_CODE`). C'est barré côté client uniquement — suffisant entre potes, pas une vraie auth.

## Roadmap (post-weekend)

- Multi-trip (table `trips`, foreign keys partout)
- Vraie auth Convex (magic link)
- PWA + notifs push
- Édition runtime des menus & recettes
