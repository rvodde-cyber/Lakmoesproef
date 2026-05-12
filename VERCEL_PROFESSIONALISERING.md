# Vercel professionalisering

Dit bestand dekt de punten die accounttoegang in Vercel vereisen.

## 1) Custom domain koppelen

1. Open [Vercel dashboard](https://vercel.com/dashboard) en kies project `organisatie-morele-lakmoestest`.
2. Ga naar `Settings` -> `Domains` -> `Add`.
3. Voeg gewenst domein toe (bijv. `lakmoes.jouwdomein.nl`).
4. Volg DNS-instructies van Vercel (A/CNAME/TXT verificatie).
5. Controleer of SSL-status op `Valid` staat.

## 2) Web Analytics en Speed Insights

1. In projectdashboard: open `Analytics` en zet `Web Analytics` aan.
2. Open `Speed Insights` en activeer voor productie.
3. Controleer na 24-48 uur of data binnenkomt (page views, CWV).

## 3) Productiecheck na deploy

1. Open live URL: [https://organisatie-morele-lakmoestest.vercel.app](https://organisatie-morele-lakmoestest.vercel.app).
2. Doorloop rooktest:
   - start vragenlijst
   - invullen meerdere pagina's
   - reageerbuiskleur verandert bij scores 1-2
   - rapport zichtbaar bij 21/21
   - print preview opent
3. Let op: thumbnail in Vercel dashboard kan 403 tonen; browsercheck is leidend.
