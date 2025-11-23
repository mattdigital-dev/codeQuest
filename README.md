![CodeQuest](public/next.svg)

# CodeQuest

CodeQuest est un mini-jeu éducatif en 3D qui combine **Next.js 16**, **React 19**, **React Three Fiber**, **Blockly**, **tRPC v11** et **PostgreSQL/Prisma** pour enseigner la logique de programmation via six défis progressifs.

## Architecture

- **Front-end** : Next.js App Router, Tailwind CSS v4, React Three Fiber + Drei, Zustand pour l’état du jeu et de l’UI.
- **Blockly** : éditeur et toolbox par zone, sandbox `worldAPI` sécurisée pour exécuter le code généré.
- **Back-end** : tRPC (`/app/api/trpc/[trpc]/route.ts`) expose les routeurs `progress`, `telemetry`, `health`.
- **Persistance** : PostgreSQL + Prisma (modèles `User`, `Progress`, `ChallengeStatus`, `EventLog`), synchronisation locale via `localStorage`.

## Pré-requis

- Node.js 20+
- PostgreSQL accessible via `DATABASE_URL` (voir `.env`).

## Installation

```bash
pnpm install
pnpm db:generate   # génère le client Prisma
# pnpm db:push    # pousse le schéma si besoin
```

## Commandes utiles

| Commande          | Description                                   |
| ----------------- | --------------------------------------------- |
| `pnpm dev`        | Démarre Next.js en mode développement         |
| `pnpm build`      | Build production                              |
| `pnpm start`      | Lancement production                          |
| `pnpm lint`       | Vérifie le code avec `next lint`              |
| `pnpm db:migrate` | Lance une migration Prisma                    |
| `pnpm db:push`    | Push du schéma vers la base                   |

## Structure

- `app/` : pages (`/` landing, `/game` scène 3D, API health/progress/telemetry, tRPC handler).
- `src/game/` : monde 3D (îlots, ponts, joueur, caméra, collisions).
- `src/blockly/` : provider, éditeur, sandbox et défis (`challenges/*.ts`).
- `src/store/` : Zustand (`gameStore`, `uiStore`).
- `src/core/` : types partagés, logique de progression et persistance.
- `src/db/` : client Prisma + repository.
- `src/server/api/` : tRPC (context, routers, app router).
- `src/components/` : UI (HUD, overlay, boutons, etc.).

## Données & API

- **Progression** : `progress.get/upsert/reset` (tRPC + REST mirroir via `/api/progress`).
- **Télémétrie** : `telemetry.emit` + `/api/telemetry`.
- **Santé** : `/api/health`.

## Défis Blockly

1. Village de la Logique – activer le cristal.
2. Forêt des Boucles – répéter des actions.
3. Temple des Conditions – utiliser if/else.
4. Forge des Variables – gérer un compteur.
5. Tour des Événements – réagir à des signaux.
6. Sanctuaire Final – mini-projet combinant tous les concepts.

Chaque défi possède :
- une toolbox dédiée,
- une configuration XML de départ,
- une validation côté sandbox.

## Lancer le jeu

1. Configurez votre base (`DATABASE_URL`).
2. `pnpm dev`
3. Visitez `http://localhost:3000/` pour l’accueil, `http://localhost:3000/game` pour la scène 3D. Ouvrez un totem pour relever un défi Blockly.
