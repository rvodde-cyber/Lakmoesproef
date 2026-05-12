# Logboek — Organisatie lakmoesproef

**Alleen dit project.** Geen Moral Maps / Moral APS-trajecten in dit bestand.

**Gerelateerde documenten:** [BESCHRIJVING.md](./BESCHRIJVING.md) · [ANALYSE.md](./ANALYSE.md)

---

## Werkwijze: logboek en upgrades

- **Automatisch bij elke wijziging door jou lokaal:** dat kan een AI niet “op de achtergrond” volgen; wijzigingen verschijnen pas hier als ze in deze workspace staan en er een sessie is waarin ze worden verwerkt.
- **Wel afgesproken:** zodra we in Cursor samen aan **organisatie-lakmoesproef** werken (code of docs), wordt **`LOGBOEK.md`** (en zo nodig `ANALYSE.md` / `BESCHRIJVING.md`) in dezelfde sessie bijgewerkt — tenzij jij expliciet vraagt dat achterwege te laten.
- **Jij werkt alleen even zelf:** stuur een kort bericht als *“update organisatie-lakmoesproef logboek voor commits X–Y”* of plak `git log` / diff-samenvatting; dan wordt het alsnog netjes bijgetrokken.
- **Roadmap en advies** staan in `ANALYSE.md` §8 (wordt uitgebreid naarmate het project rijpt).

---

## 2026-05-12 — Uitvoering puntenlijst (één voor één)

### Afgerond in deze sessie

1. **Beeld per blok:** 7 nieuwe pagina-afbeeldingen toegevoegd in `public/question-block-1.svg` t/m `public/question-block-7.svg`; `PageIllustration` rendert nu echte image-assets.
2. **Copy consistentie:** landing aangepast van “13 Filters” naar **“7 dimensies”**.
3. **Dependencies:** ongebruikte `docx` en `pptxgenjs` verwijderd uit runtime dependencies.
4. **Vercel-professionalisering:** uitvoerbaar stappenplan vastgelegd in `VERCEL_PROFESSIONALISERING.md` (custom domain, analytics, speed insights, post-deploy check). Uitvoering zelf vraagt accountactie.
5. **Code-onderhoud:** `App.tsx` opgeschoond door data/rekenlogica/componenten op te splitsen naar:
   - `src/data/questions.ts`
   - `src/utils/assessment.ts`
   - `src/components/QuestionCard.tsx`
   - `src/components/RadarChart.tsx`
6. **Kwaliteit en a11y:** scorekeuze omgezet naar `radiogroup`/`radio`-patroon; teststack toegevoegd (`vitest`, RTL, jsdom) plus eerste unittests in `src/utils/assessment.test.ts`.
7. **Productverbetering:** sessieherstel via `localStorage` toegevoegd; instrumentversie `v1.1` zichtbaar in landing en printrapport; knop “Sessie wissen” + privacytekst toegevoegd.
8. **Deploy-check:** lokale `lint`, `test`, `build` uitgevoerd in app-map.

### Open om handmatig op te pakken

- Vercel accountstappen uit `VERCEL_PROFESSIONALISERING.md` echt uitvoeren (custom domain en analytics aanzetten).
- Print smoke-test expliciet nalopen in zowel Edge als Chrome na eerstvolgende UI-iteratie.

---

## Pauze — resume-punt (alles vastgelegd)

*Laatste update van dit blok: 2026-05-12. Hier verder lezen na een onderbreking.*

### Stand van het product (wat werkt)

- **Vragenlijst:** 21 items, schaal 1–5, opgedeeld in **7 pagina’s à 3 vragen** met **Vorige / Volgende** en zacht scrollen naar het paneel.
- **Illustratie per blok:** `PageIllustration.tsx` — abstracte SVG + kort onderschrift per blok; bedoeld als tijdelijke invulling tot **eigen beelden per pagina**.
- **Reageerbuis:** `LitmusTube.tsx` — vloeistof**hoogte** = voortgang (beantwoord / 21); vloeistof**kleur** = alleen het **aandeel antwoorden 1 en 2** onder de tot dan toe ingevulde vragen (3–5 kleuren het buisje niet).
- **Rapport (na afronden):** integriteitsscore %, radar (7×3 clusters), quick actions, vrije notities, print, APA7-bronnenlijst.
- **Landing + header:** organisatienaam optioneel, hero-afbeelding, verwijzing Fontys Lectoraat.
- **Geen** server-side opslag van scans in deze app; alles client-side.

### Live en lokaal

- **Productie:** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app) (Vercel-project `organisatie-morele-lakmoestest`).
- **Lokaal:** repo-root `npm run dev:organisatie` of in `apps/organisatie-lakmoesproef` → `npm run dev` → meestal [http://localhost:5173](http://localhost:5173).

### Kernbestanden (techniek)

| Bestand | Rol |
|--------|-----|
| `src/App.tsx` | State, vragendata, paginering, rapport, radar, quick actions |
| `src/PageIllustration.tsx` | Thema-illustratie per vragenblok (nu SVG) |
| `src/LitmusTube.tsx` | Reageerbuis (voortgang + lakmoeskleur obv 1–2) |

### Besluiten die gelden (tot ze worden herzien)

1. **Paginering:** 7×3 is akkoord; een slotpagina met **4** vragen past niet bij exact **21** vragen zonder ander totaal of ander schema.
2. **Lakmoeskleur:** **uitsluitend scores 1 en 2** bepalen de kleur van de vloeistof; gemiddelde en scores 3–5 niet voor dit effect.
3. **Per-pagina-foto’s:** inhoudelijk en visueel **volgende sessie** te kiezen en technisch te koppelen (bijv. `public/…` + aanpassing `PageIllustration`).

### Volgende stappen (concreet, geprioriteerd)

1. **Beeld per blok:** assets kiezen/plaatsen; `PageIllustration` uitbreiden met echte afbeeldingen (fallback op SVG behouden kan).
2. **Tekst / marketing:** landing “13 Filters” vs **7 dimensies / 21 vragen** — één consistent verhaal met inhoudsverantwoordelijke.
3. **Dependencies:** `docx` en `pptxgenjs` in `package.json` — verwijderen **of** echte exportfeature bouwen en documenteren.
4. **Vercel:** custom domain; optioneel Web Analytics en Speed Insights (zie ook `ANALYSE.md` §8).
5. **Code-onderhoud:** `App.tsx` opsplitsen (landing, vragen, rapport, radar); optioneel `questions` naar `data/questions.ts`.
6. **Kwaliteit:** vitest/RTL voor score- en lakmoeslogica; print rooktest op Edge/Chrome; radiogroups/toegankelijkheid voor scoreknoppen.
7. **Product:** optioneel voortgang in `localStorage` + korte privacytekst; instrumentversie (bv. v1.x) op scherm en in printrapport.
8. **Deploy:** na wijzigingen `npm run lint` + `npm run build` in app-map; daarna Vercel-deploy volgens bestaande projectinstelling.

### Hervatten in Cursor

- Formuleer bv. *“verder met organisatie-lakmoesproef, zie LOGBOEK pauze-blok”*; werk na substantiële wijzigingen dit **pauze-blok** of de gedateerde regels eronder bij.

---

## 2026-05-11 — Vragenlijst: paginering + illustraties per blok

### Gedaan

- Vragenlijst opgesplitst in **7 blokken van elk 3 vragen** (21 totaal). Navigatie **Vorige / Volgende**, voortgang **blok x / 7**, bij paginawissel zacht scrollen naar het vragenpaneel.
- Per blok een **thematische illustratie**: abstracte SVG + kort onderschrift dat aansluit bij de drie vragen in dat blok (`PageIllustration.tsx`). Geen externe stock-URL’s; later eenvoudig te vervangen door foto’s in `public/` indien gewenst.

### Besluit / kader

- Gewenste patroon “elke pagina 3, **laatste pagina 4**” is met **exact 21 vragen** niet haalbaar (21 is geen `3k + 4`). Gekozen: **7×3**. Wil men ooit wél 3+3+…+4, dan moet het totaal aantal vragen worden aangepast (bijv. 19 of 22) of een ander verdeelschema worden afgesproken.

---

## 2026-05-11 — Reageerbuis: kleur op “negatieve” antwoorden

### Gedaan

- Component **`LitmusTube.tsx`**: reageerbuis naast de vragen; **vloeistofhoogte** stijgt met invulvoortgang (`beantwoord / 21`).
- **Vloeistofkleur** volgt het **aandeel scores 1 en 2** onder de tot dan toe gegeven antwoorden (3–5 kleuren niet mee): meer 1–2 → **roder**; geen 1–2 → **groen/teal**. Korte statusregel onder het buisje (geen oordeel, wel diagnose).
- Per-pagina **foto’s/illustraties** bewust nog niet gewijzigd: volgende sessie inhoudelijk per blok te kiezen (nu nog thematische SVG in `PageIllustration`).

### Besluit (kleur lakmoes)

- **Alleen scores 1 en 2** bepalen de vloeistofkleur (aandeel 1–2 onder de tot nu toe gegeven antwoorden). Scores 3, 4 en 5 kleuren het buisje niet mee.

---

## 2026-05-11 — Live-omgeving bevestigd (Vercel + screenshots)

### Feiten

- **Vercel-project:** `organisatie-morele-lakmoestest`
- **Productie-URL:** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app)
- **Status:** deployment *Ready* (dashboard); live pagina laadt in browser zoals bedoeld (landingspagina Organisatiescan).
- **Branch:** productie gekoppeld aan `main` (o.a. na merge PR rond maps-flow; exact commit volgens Vercel-dashboard).

### Observatie dashboard

- Thumbnail/preview in Vercel kan **403 Forbidden** tonen terwijl echte gebruikers de site wel zien — geen aanwijzing dat productie kapot is; wel iets om niet blind op de miniatuur te vertrouwen.

### Professionalisatie (uit dashboard)

- Nog open in Vercel-checklist o.a.: **custom domain**, **Web Analytics**, **Speed Insights** — aansluitend op `ANALYSE.md` §8.

### Gedaan (docs)

- `README.md` en `BESCHRIJVING.md`: productie-URL en projectnaam vastgelegd; noot bij preview-thumbnail.

---

## 2026-05-11 — URL, logboek-afspraak en professionalisatiepad

### Vraag eigenaar

- Logboek structureel laten bijhouden bij wijzigingen; ideeën voor upgrade/professionalisering; welke URL morgen te gebruiken.

### Antwoord / vastlegging

- **Productie-URL:** in deze repository staat **geen** vaste publicatie-URL voor deze app (wel voor Moral Maps-projecten, bv. `moral-maps.vercel.app`). De live-URL is het **Vercel-project** dat aan `apps/organisatie-lakmoesproef` is gekoppeld — meestal `https://<jouw-projectnaam>.vercel.app`. Controleer in [Vercel Dashboard](https://vercel.com/dashboard) → het project → *Domains* / *Deployments*. Na eerste deploy: URL hier en in `README.md` vastleggen.
- **Lokaal morgen bekijken:** vanuit repo-root `npm run dev:organisatie` of in de app-map `npm run dev` → standaard [http://localhost:5173](http://localhost:5173) (Vite-default; alleen als poort vrij is).
- **Professionalisatie:** zie `ANALYSE.md` §8; logboek hieronder blijft voor besluiten en feitelijke wijzigingen.

### Gedaan (docs)

- Werkwijzeblok toegevoegd bovenaan dit logboek.
- `ANALYSE.md` uitgebreid met adviesroadmap §8.
- `README.md` uitgebreid met sectie *Lokaal en live URL*.

---

## 2026-05-11 — Documentatiebasis en vervolg

### Gedaan

- Projectdocumentatie opgesplitst in drie bestanden (beschrijving, analyse, logboek) onder `apps/organisatie-lakmoesproef/`.
- Huidige functionaliteit in code vastgelegd: 21 vragen, 1–5 scores, percentage-score, 7×3 clustergroepering voor radar, quick actions, printrapport met APA7-bronnenlijst.
- Technische analyse toegevoegd: SPA-architectuur, afhankelijkheden, risico’s, expliciete scheiding van Moral Maps.

### Observaties (geen inhoudelijke MAPS-koppeling)

- Dependencies `docx` en `pptxgenjs` staan in `package.json` maar worden niet geïmporteerd in `src/` — opruimen of functionaliteit inplannen.
- Mogelijke mismatch tussen marketingcopy op de landing (“13 Filters”) en de implementatie (7 clusters van elk 3 vragen) — aligneren met inhoudsverantwoordelijke.

### Openstaand / voorgestelde vervolgstappen

- [ ] Besluit: ongebruikte export-packages verwijderen of DOCX/PPTX-export ontwerpen en bouwen.
- [ ] Copy en cijfermatige story op landing en in rapport tegen de code houden.
- [ ] Overweeg opsplitsen `App.tsx` (layout, vraagkaart, rapport, radar) voor leesbaarheid en toekomstige tests.
- [ ] Print smoke-test op doelbrowsers na grotere UI-wijzigingen.

### Status product

- Laatste beoordeling door producteigenaar: UI oogde “goed”; deze periode is bedoeld voor **doorontwikkeling** op basis van bovenstaande documenten.

---

## Archief (aan te vullen)

Voeg hieronder nieuwe datums toe in **omgekeerde chronologische volgorde** (nieuwste bovenaan), met korte bullets: wat er gebeurde, waarom, en wat er nog openstaat.

---

*Formaat en zorgvuldigheid: gelijkwaardig aan de documentatiepraktijk van Moral Maps; inhoud uitsluitend over organisatie lakmoesproef.*
