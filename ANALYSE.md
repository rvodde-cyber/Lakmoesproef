# Organisatie lakmoesproef — technische en productanalyse

**Gerelateerde documenten:** [BESCHRIJVING.md](./BESCHRIJVING.md) · [LOGBOEK.md](./LOGBOEK.md)

---

## 1. Architectuur

### 1.1 Overzicht

| Laag | Keuze |
|------|--------|
| Runtime | Single Page Application (SPA), alles client-side |
| Bundler | Vite met React-plugin |
| Taal | TypeScript (strict build via `tsc -b` vóór `vite build`) |
| Styling | Tailwind CSS v4 via officiële Vite-plugin |

### 1.2 Broncode-structuur

- **`src/App.tsx`** — monolithische hoofdcomponent: data (vragenlijst), state, radargrafiek, alle UI-secties en printlogica.
- **`src/index.css`** — globale stijlen / Tailwind entry.
- **`public/`** — o.a. hero-afbeelding voor de landing.

Er is **geen** router, geen state management-bibliotheek en geen API-laag. De complexiteit is bewust laag; groei zal opsplitsing in componenten en modules vragen.

---

## 2. Datamodel en logica

### 2.1 Vragen

- `Question`: `id`, `title`, `subtitle`, `explanation`.
- Vragen zijn een **constante array** in `App.tsx` — wijzigingen vereisen een code-edit en nieuwe build.

### 2.2 State

- `organization`: string, optioneel.
- `answers`: `Record<number, number>` — vraag-id → score 1–5.
- `notes`: vrije tekst voor observaties/acties.
- `started`: boolean; scheidt landing van vragenflow.

### 2.3 Scoreberekening

- **Voltooiing:** alle 21 vragen hebben een score.
- **Percentage:** som van scores / (21 × 5), afgerond naar geheel percentage.
- Logica is **deterministisch** en reproduceerbaar op basis van lokale state.

### 2.4 Pijlers / radar

- Zeven labels (McKinsey 7S-achtige benamingen): elk cluster combineert **drie opeenvolgende** vraag-id’s (1–3, 4–6, …, 19–21).
- Clustergemiddelde = gemiddelde van ingevulde scores binnen dat cluster (bij gedeeltelijke invulling: alleen aanwezige waarden — bij voltooiing altijd drie waarden).

**Productnotitie:** de landingspagina noemt “13 Filters”; de implementatie gebruikt **7 clusters × 3 vragen**. Dit is een **inhoudelijke/communicatieve inconsistentie** die bij een volgende redactieronde uitgelijnd moet worden (zie LOGBOEK).

### 2.5 Quick actions

- Bepaald door sortering op laagste clustergemiddelde; top 3 krijgen vaste tekstuele adviezen per clusterlabel.
- Geen externe configuratie — onderhoud in code.

---

## 3. Presentatie en print

- **Screen vs print:** `print:hidden` en `print:block` scheiden interactieve elementen van rapportlayout.
- **Printknop:** triggert `window.print()`; geen server-side PDF.
- **Datum in rapport:** `Intl.DateTimeFormat("nl-NL")` op het moment van render (niet “vastgezet” bij start sessie).

---

## 4. Afhankelijkheden

### 4.1 Direct gebruikt

React, React DOM, Tailwind v4 + Vite-plugin — in lijn met `package.json` en imports.

### 4.2 Geïnstalleerd maar niet gebruikt in `src/`

- `docx`
- `pptxgenjs`

**Analyse:** verhoogt bundle niet (tree-shaking bij geen import), maar verhoogt **onderhoudslast en verwarring**. Aanbeveling: verwijderen tot er een concrete exportfeature is, of implementeren en documenteren in LOGBOEK.

---

## 5. Kwaliteit en risico’s

| Risico | Impact | Mitigatie (richting) |
|--------|--------|----------------------|
| Geen persistentie | Gebruiker verliest data bij refresh | Expliciet communiceren; eventueel later localStorage of export |
| Monolithische `App.tsx` | Moeilijker testen en reviewen | Opsplitsen in componenten + hooks |
| Copy/marketing vs code (“13 filters”) | Vertrouwensverlies | Eén waarheid in UX-copy en berekening |
| Print layout browsers | Verschillen per browser | Handmatige printtest (Chrome, Edge, Safari) |

---

## 6. Test- en releasechecklist (kort)

- `npm run lint`
- `npm run build`
- Rooktest: start → alle vragen → score + radar + quick actions → print preview
- Vercel: juiste root, `dist` als output
- **Live (bekend):** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app) — bij twijfel na deploy altijd in een normale browser testen, niet alleen op de Vercel-dashboardpreview (die soms 403 toont).

---

## 7. Scheiding van andere producten in de monorepo

Deze app **deelt geen codebase-paden** met Moral Maps flows. Wijzigingen hier raken Moral APS niet, behalve via gedeelde monorepo-tooling (indien aanwezig op repo-niveau). Documentatie voor Moral Maps hoort **niet** in dit project te landen.

---

## 8. Verdere upgrade en professionalisering (advies)

Onderstaande is een **prioriteitenlijst** voor volwassen productontwikkeling; niet alles hoeft nu. Volgorde afstemmen op doel: onderzoek, brede inzet in organisaties, of alleen interne tool.

### A. Betrouwbaarheid en data

- **Voortgang bewaren:** `localStorage` of “sessie herstellen” (met waarschuwing bij gevoelige data op gedeelde PC’s); optioneel export/import JSON voor back-up.
- **Expliciete “sessie reset”** en korte privacytekst (geen server, data blijft in browser) als je persistence toevoegt.

### B. Rapportage en uitrol

- **PDF:** of verbeterde print-CSS (laagdrempelig), of echte PDF-generatie (serverless of client-lib) als print per browser te wisselend is.
- **`docx` / `pptxgenjs`:** óf implementeren (rapport- of pitch-export), óf uit `package.json` halen om ruis te vermijden.
- **Vaste productie-URL + custom domain** in Vercel voor professionele uitstraling en stable links in materialen.

### C. Kwaliteit code en onderhoud

- **Splitsen `App.tsx`:** aparte componenten (Landing, QuestionCard, Report, RadarChart), eventueel `questions` naar `data/questions.ts`.
- **Tests:** vitest + React Testing Library voor scoreberekening en clustergemiddelden (regressies voorkomen).
- **CI:** op monorepo-niveau `lint` + `build` voor deze app bij elke PR.

### D. Toegankelijkheid en UX

- **Toetsenbord en focus:** vraag-antwoorden als `radiogroup` / duidelijke `aria-*`; skip-link naar vragenlijst.
- **Contrast en motion:** controleren op WCAG-basis; `prefers-reduced-motion` voor eventuele animaties.
- **Landingscopy vs logica:** één consistent verhaal (bijv. “7 dimensies” vs “13 filters”) — inhoudelijk met domeinexpert afstemmen.

### E. Instrument en inhoud (niet-technisch maar product)

- **Versie van het instrument** in de UI en in het printrapport (bv. `v1.2`) zodat vergelijkingen in de tijd helder zijn.
- **Methodologische pagina** (kort): wat de score wel/niet zegt — verlaagt verkeerde interpretatie.

Nieuwe besluiten en uitgevoerde stappen uit deze lijst horen in **`LOGBOEK.md`** met datum.

---

## 9. Resume na onderbreking

**Actuele productstand, live-URL, besluiten (paginering, lakmoes 1–2) en de geprioriteerde stapellijst** staan gebundeld in **`LOGBOEK.md`** onder **“Pauze — resume-punt”**. Begin daar na een pauze; gebruik dit document (§1–§8) voor architectuur en langetermijnadvies.

---

*Laatste inhoudelijke update document: 2026-05-12*
