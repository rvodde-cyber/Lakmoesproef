# Organisatie lakmoesproef

Organisatiescan op basis van 21 vragen over voorbeeldig en ethisch organiseren.

> **Monorepo:** als deze map nog onder `moral aps/apps/` staat, verplaats hem naar een eigen GitHub-repo — zie `MIGRATIE_APARTE_REPOSITORY.md` en `docs/SCHEIDING_MAPS_EN_ORGANISATIE_LAKMOES.md` in de Moral APS-root.

## Stack
- React + Vite
- TypeScript
- Tailwind CSS

## Inhoud
- 21 professioneel geformuleerde vragen
- Onderwerp + ondertitel + uitleg per vraag
- Scoringsmodel van 1 tot 5
- Integriteitsscore en observatieveld

## Scripts
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run test`

## Lokaal en live URL

- **Lokaal:** in deze map `npm run dev` → meestal [http://localhost:5173](http://localhost:5173). (Het script `npm run dev:organisatie` op monorepo-root wordt verwijderd zodra de app uit die repo is gehaald.)
- **Productie (Vercel):** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app)  
  - Vercel-projectnaam: `organisatie-morele-lakmoestest`  
  - *Let op:* een kleine **dashboard-preview** kan “Forbidden” tonen terwijl de site in een normale browser gewoon laadt (bekend gedrag bij sommige Vercel-thumbnails / fetch bots).

## Vercel
- **In eigen repo:** root directory `.`
- **Nog in monorepo:** tijdelijk `apps/organisatie-lakmoesproef` — na migratie aanpassen naar `.`
- Build command: `npm run build`
- Output directory: `dist`

## Notities
- Instrumentversie in UI/rapport: `v1.1`
- Sessies worden lokaal opgeslagen in browser (`localStorage`) om later te hervatten.
- Vercel-accounttaken (custom domain/analytics): zie `VERCEL_PROFESSIONALISERING.md`.
