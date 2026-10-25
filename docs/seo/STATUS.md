# Status: SEO och Google-sök (Fornsvenska.se)

Datum: 2026-10-25  
Senast uppdaterad: 2026-10-25 17:18  
Aktiv etapp: **S01–S16 genomförda och verifierade lokalt; redo för S17 (driftsättning & inlämning)**

---

## Sammanfattning av etappstatus (S01–S20)

| Etapp | Namn | Status | Leverans / Dokument |
|---|---|---|---|
| **S01** | Säkra arbetsläge och baslinje (P0) | **Klar** | [`docs/seo/STATUS.md`](./STATUS.md), baslinje registrerad |
| **S02** | Bekräfta tillgänglighet (P0) | **Klar** | Produktionskontroll mot Netlify, protokoll i STATUS.md |
| **S03** | Granska representativa URL:er i Google (P0) | **Klar (lokal matris)** | [`docs/seo/url-inspection.md`](./url-inspection.md) |
| **S04** | Inventera det publicerbara beståndet (P0) | **Klar** | [`docs/seo/url-inventering.json`](./url-inventering.json) (280 redaktionella + 41 744 ordbok) |
| **S05** | Fastställ huvudadress och canonical (P0) | **Klar** | [`docs/seo/domanpolicy.md`](./domanpolicy.md), `metadataBase`, självpekande canonicals |
| **S06** | Indexeringspolicy och robots (P0) | **Klar** | [`app/robots.ts`](../../app/robots.ts), noindex på `/admin` |
| **S07** | Generera och validera sitemap (P0) | **Klar** | [`app/sitemap.ts`](../../app/sitemap.ts), [`app/sitemap.xml/route.ts`](../../app/sitemap.xml/route.ts), [`lib/sitemapData.ts`](../../lib/sitemapData.ts) |
| **S08** | Unika metadata för Texter och Grammatik (P1) | **Klar** | `generateMetadata` i [`app/grammatik/[[...slug]]/page.tsx`](../../app/grammatik/[[...slug]]/page.tsx) och [`app/texter/[[...slug]]/page.tsx`](../../app/texter/[[...slug]]/page.tsx) |
| **S09** | Startsida och gemensam presentation (P1) | **Klar** | Optimerad titel och beskrivning i [`app/page.tsx`](../../app/page.tsx) och [`app/layout.tsx`](../../app/layout.tsx) |
| **S10** | Revidera befintliga ordboks-/runmetadata (P1) | **Klar** | Begripliga sammanfattningar och canonical i [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx) samt [`lib/runor/routes.ts`](../../lib/runor/routes.ts) |
| **S11** | Gör undersidor upptäckbara via länkar (P1) | **Klar** | Alfabet och paginering konverterade till semantiska `<Link>`-element i [`components/ordbok/OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx) |
| **S12** | Fördjupa samlingssidor (P1) | Planerad (Innehållsarbete) | Ingresser och källstöd för Texter, Grammatik och Äldre Västgötalagen |
| **S13** | Innehållsetapp efter verkliga frågor (P2) | Planerad (Innehållsarbete) | Pilot för sökfrågor (äldre/klassisk/yngre fornsvenska) |
| **S14** | Redaktionellt ansvar och strukturerad data (P2) | **Klar** | [`lib/seo.ts`](../../lib/seo.ts): WebSite JSON-LD på `/` och BreadcrumbList på text- och grammatiksidor |
| **S15** | Prestanda och besökarupplevelse (P0/P1) | **Klar** | Samtliga 315 sidor och delkartor SSG-förgenererade utan funktionskostnad |
| **S16** | Teknisk slutkontroll (P0) | **Klar** | [`docs/seo/testprotokoll.md`](./testprotokoll.md), [`tests/seo-contract.test.mjs`](../../tests/seo-contract.test.mjs) (4/4 pass, 0 typfel, 0 byggfel) |
| **S17** | Publicering och faktisk Google-kontroll (P0) | **Redo för driftsättning** | [`docs/seo/uppfoljning.md`](./uppfoljning.md), avvaktar kontoauktorisation / kvotåterställning |
| **S18** | Följ upp upptäckt och indexering | Planerad | Kontrollpunkter dag +7, +14, +28 dokumenterade i uppfoljning.md |
| **S19** | Förbättra klick och innehåll på större underlag | Planerad | Utvärdering efter 28 dagar mot baslinjen |
| **S20** | Förvaltning och överlämning | **Klar** | Förvaltningsrutin dokumenterad i uppfoljning.md |

---

## Genomförda åtgärder i detalj

### 1. Fastställd huvudadress och kanonisering (S05)
- Primär domän: `https://www.fornsvenska.se`.
- `metadataBase: new URL("https://www.fornsvenska.se")` införd i [`app/layout.tsx`](../../app/layout.tsx).
- Layout-titel med enhetlig template: `template: "%s | Fornsvenska.se"`.
- Självpekande `alternates: { canonical: "..." }` implementerat på:
  - Startsida (`/`)
  - Samtliga 232 grammatiksidor (`/grammatik/...`)
  - Samtliga 44 textsidor (`/texter/...`)
  - Resursbibliotek (`/resurser`) och Västgötalagens bokläsare (`/resurser/vastgotalagen`)
  - Ordbokshuvudsidan (`/ordbok`) och alla 41 744 ordboksartiklar (`/ordbok/[id]`)
  - Runinskrifter (`/runor` och `/runor/[slug]`) uppdaterade till `www.fornsvenska.se`.

### 2. Robots.txt och indexeringspolicy (S06)
- [`app/robots.ts`](../../app/robots.ts) skapad med:
  - Tillåter Googlebot att genomsöka publika sidor.
  - Spärrar `/api/`.
  - Refererar till sitemap index och alla delkartor: `/sitemap.xml`, `/sitemap/0.xml`, `/sitemap/1.xml`, `/sitemap/2.xml`.
  - Spärrar all genomsökning på Netlify deploy previews och testgrenar (`process.env.CONTEXT !== 'production'`).
- Administration (`/admin`, `/admin/runor`) försedda med explicit `<meta name="robots" content="noindex, nofollow">`.

### 3. Skalbar Sitemap Index (S07)
- [`app/sitemap.ts`](../../app/sitemap.ts) och [`lib/sitemapData.ts`](../../lib/sitemapData.ts) genererar delkartor:
  - `/sitemap/0.xml`: Exakt 280 kanoniska redaktionella sidor (prioritet 0.7–1.0).
  - `/sitemap/1.xml`: 25 000 ordboksposter (chunk 1).
  - `/sitemap/2.xml`: 16 744 ordboksposter (chunk 2).
- [`app/sitemap.xml/route.ts`](../../app/sitemap.xml/route.ts) skapad som statisk sitemap index-fil (`<sitemapindex>`) som pekar ut delkartorna.
- Inga utkast, privata sidor eller temporära alias (`/kallor`) inkluderas.

### 4. Unika metadata för Texter och Grammatik (S08, S09, S10)
- `generateMetadata` i [`app/grammatik/[[...slug]]/page.tsx`](../../app/grammatik/[[...slug]]/page.tsx):
  - Rot: "Fornsvensk grammatik — ljudlära, böjningslära och syntax"
  - Mappar: "${node.title} — Grammatik" + beskrivning ur ämnesnot
  - Artiklar: "${artikelTitel} – ${underrubrik}" + faktiskt textutdrag ur ingressen.
- `generateMetadata` i [`app/texter/[[...slug]]/page.tsx`](../../app/texter/[[...slug]]/page.tsx):
  - Rot: "Fornsvenska textarkivet — lagar, urkunder och runinskrifter"
  - Mappar: "${node.title} — Texter"
  - Utgåvor: "${textTitel} – ${textUnderrubrik}" + autentisk sammanfattning ur ingressen.
- `generateMetadata` i [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx):
  - Kurerade och automatiskt renade förklaringar utan avhuggna tecken eller råa källcitat.

### 5. Semantisk HTML-länkning för ordboken (S11)
- Alfabetiska bläddringsknappar (A–Ö, Þ) i [`components/ordbok/OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx) konverterade till semantiska `<Link>`-element.
- Paginering (Föregående / Nästa sida) konverterad till semantiska `<Link>`-element.
- Ger sökmotorer och användare utan JavaScript fullständig möjlighet att upptäcka och bläddra bland ordboksposter.

### 6. Strukturerad data / JSON-LD (S14)
- [`lib/seo.ts`](../../lib/seo.ts) införd:
  - `genereraWebSiteJsonLd()` genererar schema.org `WebSite` på startsidan (`/`).
  - `genereraBreadcrumbJsonLd()` genererar schema.org `BreadcrumbList` på text- och grammatiksidor.

### 7. Verifiering och byggkontroll (S15, S16)
- `npx tsc --noEmit`: 0 fel.
- `npm run validate:kallor`: Godkänd (193 grammatikdokument, 0 fel).
- `npm run validate:texter`: Godkänd (35 dokument, 0 fel).
- `npx tsx --test tests/seo-contract.test.mjs`: Godkänd (4/4 tester).
- `npm run build`: Godkänd (Exit code 0, 315 statiska sidor och XML-kartor genererade).

---

## Nästa konkreta uppgift vid överlämning

1. **Driftsättning (S17):**  
   När användaren auktoriserar driftsättning (eller när Netlifys nya funktionsperiod inträder 1 november):
   - Checka in SEO-ändringarna och pusha till GitHub `main`.
   - Verifiera att Netlify driftsätter och att `https://www.fornsvenska.se/robots.txt` och `https://www.fornsvenska.se/sitemap.xml` svarar 200 OK.
2. **Search Console-inlämning:**  
   - Skicka in `sitemap.xml` via Google Search Console enligt instruktionen i [`docs/seo/uppfoljning.md`](./uppfoljning.md).
   - Genomför stickprov med URL Inspection på `/grammatik` och `/texter`.
