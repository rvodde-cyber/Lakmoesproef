# Organisatie lakmoesproef — projectbeschrijving

**Gerelateerde documenten:** [ANALYSE.md](./ANALYSE.md) · [LOGBOEK.md](./LOGBOEK.md)

---

## 1. Doel en positie

De **organisatie lakmoesproef** is een zelfstandige webapplicatie voor een **organisatiescan**: respondenten beantwoorden een vaste set vragen over voorbeeldig en ethisch organiseren. De applicatie berekent een samenvattende score, groepeert antwoorden voor visualisatie en ondersteunt reflectie en rapportage (print).

Dit project is **los** van het Moral Maps / Moral APS-traject: er wordt geen deelnemerscode, geen Supabase-sessie en geen trilogie-flow gedeeld. Alleen de **kwaliteitseisen aan documentatie en onderhoud** zijn vergelijkbaar.

---

## 2. Doelgroep en gebruik

| Doelgroep | Gebruik |
|-----------|---------|
| Organisaties, teams, adviseurs | Eenmalige of periodieke scan; bespreking van uitkomsten en acties |
| Onderzoek / lectoraat | Instrumentontwikkeling en doorontwikkeling van inhoud en presentatie |

De applicatie is bedoeld voor **browsergebruik** (desktop en tablet); permanente opslag van invullingen gebeurt **niet** in de applicatie zelf (zie analyse).

---

## 3. Functionele scope (huidige versie)

- **Landingspagina** met korte toelichting, optioneel hero-beeld en startknop.
- **Vragenlijst:** 21 items met titel, ondertitel en toelichting; antwoordschaal 1–5 per vraag.
- **Voortgang:** teller van ingevulde vragen t.o.v. totaal.
- **Na voltooiing:**
  - **Integriteitsscore** als percentage (gemiddelde van 1–5 geschaald naar 0–100%).
  - **Radarvisualisatie** op basis van zeven clusters (labels uit organisatietheorie; drie vragen per cluster).
  - **Quick actions:** drie geprioriteerde suggesties op basis van de laagste clustergemiddelden.
  - Vrij **observatie-/actieveld** (tekst).
  - **Printvriendelijk rapport** (browservenster + `window.print()`), inclusief bronnenlijst (APA7-stijl) op de eindpagina.
- Optioneel veld **organisatienaam** voor het rapport.

---

## 4. Buiten scope (expliciet)

- Geen account- of loginstroom.
- Geen server-side persistentie van scans in deze codebase.
- Geen koppeling met Moral Maps-data of -routes.
- Geen beheerdersinterface voor het wijzigen van vragen via de UI (vragen staan in code).

---

## 5. Technische stack (samenvatting)

React 19, Vite 8, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`). Build levert statische assets (`dist`) geschikt voor o.a. Vercel.

Zie **ANALYSE.md** voor architectuur, risico’s en verbeterpunten.

---

## 6. Deployment (richtlijn)

- **Root directory:** `apps/organisatie-lakmoesproef`
- **Build:** `npm run build`
- **Output:** `dist`
- **Productie-URL (Vercel):** [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app) (project `organisatie-morele-lakmoestest`)

---

## 7. Bronnen en verwijzingen in de app

De gebruikersinterface verwijst naar literatuur en naar het Fontys Lectoraat Ethisch Werken; de volledige bronnenlijst staat in de applicatie zelf. Documentatie in deze map beschrijft **alleen** het softwareproject, niet de wetenschappelijke claim of validering van het instrument.

---

*Laatste inhoudelijke update document: 2026-05-12 — voor pauze/hervatting: zie `LOGBOEK.md` (sectie **Pauze — resume-punt**).*
