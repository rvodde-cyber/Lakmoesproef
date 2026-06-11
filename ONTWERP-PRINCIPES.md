# Ontwerpprincipes voor Fontys Ethiek Apps
*Afgeleid van de Morele Lakmoesproef — de mooiste app uit de reeks*

---

## Look & Feel

### Kleurenpalet
De app gebruikt een strak, rustig palet dat professionaliteit uitstraalt zonder kil te worden:

- **Achtergrond:** `#f1f3f4` (warm lichtgrijs) — nooit zuiver wit, dat voelt te klinisch
- **Kaarten:** `#ffffff` met `border border-slate-200` en `shadow-sm` — subtiele diepte
- **Primaire kleur:** violet/fuchsia gradiënt (`from-violet-600 to-fuchsia-600`) — warm en onderscheidend
- **Tekst:** `slate-900` voor koppen, `slate-600` voor body, `slate-500` voor labels
- **Accenten:** `teal-600` voor geselecteerde antwoorden en focusranden

### Typografie
- Koppen: `font-semibold`, nooit `font-bold` — dat voelt zwaarder en minder elegant
- Labels boven secties: `text-xs font-semibold uppercase tracking-wider` in een accentkleur — geeft structuur zonder opdringerig te zijn
- Body: `text-sm leading-relaxed` — ruimte en leesbaarheid
- Microcopy (uitleg, disclaimers): `text-xs text-slate-500` — aanwezig maar niet storend

### Kaarten & Rounding
- Alles in `rounded-2xl` — consequent, nooit scherpe hoeken
- Kaarten altijd: `border border-slate-200 bg-white shadow-sm p-5` of `p-6`
- Nooit zware schaduwen — `shadow-sm` is genoeg voor dieptegevoel
- Knoppen: `rounded-full` voor primaire acties, `rounded-lg` of `rounded-xl` voor secundaire

### Animaties
- Eén subtiele animatie voor paginawisselingen: `fade-slide-in` (320ms, ease-out, 10px omhoog + lichte scale)
- Altijd `prefers-reduced-motion: reduce` respecteren — toegankelijkheid eerst
- Scoreknop hover: `hover:border-slate-400` — geen kleurexplosie, alleen een hint
- Vloeistof in de LitmusTube: `transition-all duration-500 ease-out` — vloeiend, nooit schokkerig

---

## Structuur & Architectuur

### Inhoud altijd scheiden van interface
Alle tekst, vragen en copy zitten in aparte bestanden (`questions.ts`, `instrumentCopy.ts`), **nooit** hardcoded in componenten. Voordelen:
- Eenvoudig aanpassen zonder door UI-code te zoeken
- Vertalingen of varianten later toevoegen is triviaal
- Docenten/onderzoekers kunnen content aanpassen zonder te programmeren

### Drie lagen per vraag
Elke vraag heeft altijd drie niveaus:
1. **Titel** — kort en krachtig (2–4 woorden): *"Leiderschap als voorbeeld"*
2. **Subtitel** — één thematische zin: *"Walk the talk"*
3. **Toelichting** — de echte uitleg, één à twee zinnen

Dit geeft rust: de gebruiker ziet eerst het grote plaatje, dan de details.

### Vragen in blokken, niet als eindeloze lijst
Groepeer vragen in blokken van 3 (of max. 4). Per blok:
- Een thematische illustratie
- Een caption die het thema van het blok benoemt
- Duidelijke vorige/volgende navigatie

---

## De Visuele Metafoor

De **LitmusTube** is wat deze app memorabel maakt. Het testbuisje:
- Vult zich mee met de voortgang (0–100%)
- Kleurt richting rood bij lage scores, neutraal bij hoge scores
- Is gebouwd als SVG-component met vloeiende animaties
- Past perfect bij het thema van de "lakmoesproef"

**Principe:** Elke app verdient één sterke visuele metafoor die bij het onderwerp past. Niet decoratief, maar functioneel — het vertelt iets over de inhoud.

Andere voorbeelden per thema:
- Vertrouwen-app → een brug die zich opbouwt
- Dilemma-app → een weegschaal
- Morele moed-app → een kompas

---

## UX-patronen

### Sessie opslaan zonder login
Antwoorden worden lokaal in de browser bewaard (`localStorage`). Voordelen:
- Geen account nodig → drempel nul
- Gebruiker kan halverwege stoppen en later verder
- Eén knop om alles te wissen ("Sessie wissen")
- Privacy by design: niets gaat naar een server tenzij de gebruiker dat kiest

### Inklapbare uitleg
Uitgebreide instructies zitten in een `<details>`-element: zichtbaar voor wie het wil, onzichtbaar voor wie al weet hoe het werkt. Nooit informatie verplicht tonen die sommige gebruikers al kennen.

### Sticky sidebar
Tijdens het invullen staat de LitmusTube rechts in een `sticky` sidebar. De gebruiker ziet altijd zijn voortgang, ook als hij scrolt. Dat geeft gevoel van richting.

### Printbare resultaten
De resultatenpagina heeft een print-stylesheet (`@media print`) zodat het rapport als PDF kan worden opgeslagen. `print:hidden` verbergt alle navigatie en knoppen. Dit is een kleine investering met grote praktische waarde voor gebruikers.

---

## Copy & Tone of Voice

### Geruststellen, niet beoordelen
De tekst benadrukt steeds dat het gaat om een *persoonlijke inschatting*, niet een objectief oordeel. Dit verlaagt de drempel enorm — mensen vullen eerlijker in als ze zich niet beoordeeld voelen.

> *"Dit is geen externe audit van uw organisatie — het is uw eigen reflectie."*

### Instructies kort en direct
- ❌ *"Lees de titel, het thema en de korte toelichting bij deze stelling. Kies daarna het cijfer dat het beste past..."*
- ✅ *"Geef uw inschatting van de praktijk — niet wat er op papier staat."*

Halveer elke instructiezin. Wat overblijft is sterker.

### Schaaluitleg compact
- ❌ *"1 = Helemaal mee oneens, 10 = Helemaal mee eens"*
- ✅ *"1 = weinig · 2 = beperkt · 3 = deels · 4 = duidelijk · 5 = sterk"*

De middenpunten benoemen maakt de schaal bruikbaarder dan alleen de uitersten.

### Bescheidenheid over het instrument
Een korte regel als *"Het Fontys lectoraat denkt graag mee over verbeterstappen"* geeft het instrument academische legitimiteit zonder arrogant te klinken.

---

## Toegankelijkheid

- `role="radiogroup"` en `aria-label` op scoregroepen
- `aria-checked` op scoreknoppen
- `role="img"` met `aria-label` op de LitmusTube SVG
- `prefers-reduced-motion` altijd respecteren
- Focusranden altijd zichtbaar (`focus:border-teal-600 focus:outline-none` met visuele ring)

---

## Checklist voor nieuwe apps

Gebruik dit als startpunt bij elke nieuwe app:

- [ ] Achtergrond `#f1f3f4`, kaarten wit met `rounded-2xl shadow-sm border-slate-200`
- [ ] Één primaire kleur als gradiënt voor hoofdknoppen (`rounded-full`)
- [ ] Inhoud (tekst, vragen) in aparte databestanden
- [ ] Drie lagen per vraag: titel → subtitel → toelichting
- [ ] Één visuele metafoor die bij het thema past
- [ ] Sessie lokaal opslaan zonder login
- [ ] Instructieteksten gehalveerd ten opzichte van eerste versie
- [ ] Copy die geruststelt: "uw inschatting, geen oordeel"
- [ ] `prefers-reduced-motion` respecteren
- [ ] Print-stylesheet voor de resultatenpagina
- [ ] Instrumentversie zichtbaar in de UI
