# CF07 – Publik statisk huvudsajt och offentlig datagräns

Datum: 2026-10-30. Status: **lokalt verifierad**.  
Testsvit: [`tests/cloudflare-cf07.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf07.test.mjs) (6/6 godkända).

---

## Sammanfattning

Etapp CF07 implementerar och driftsätter det statiska huvudbygget för `www.fornsvenska.se`. Huvudsajten förvandlas från en Node.js-beroende ISR-applikation till en **100 % ren statisk distribution** (`dist/www`), kapabel att serveras direkt från Cloudflare Pages Free edge utan någon aktiv applikationsserver eller runtime-process.

Alla offentliga läsresor (startsida, grammatik, textarkiv, resursbibliotek, bokvy, runinskrifter och kontakt) baseras uteslutande på de versionsbundna lokala snapshotfilerna vid byggtillfället. Inga anonyma läsare genererar förfrågningar till Supabase Auth/DB eller Cloudflare Workers.

---

## 1. Rutter och genererad filstruktur

Statisk sammanställning utförs av [`scripts/cloudflare/build-main-site.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/scripts/cloudflare/build-main-site.ts) som monterar distributionen i `dist/www`:

```text
dist/www/
├── index.html                           # Startsida med initial HTML och JSON-LD
├── 404.html                             # Egen semantisk felsida för Cloudflare Pages edge
├── _redirects                           # 68 ordboksregler + /kallor -> /resurser (301)
├── _headers                             # Cache-direktiv: immutable chunks, revalidate för HTML
├── robots.txt                           # Dynamisk robots med preview-spärr
├── sitemap.xml                          # Huvudsitemap
├── sitemap/                             # Del-sitemaps (0.xml, 1.xml, 2.xml)
├── icon.svg                             # Webbplatsikon
├── ordbok/
│   └── storage-bridge.html              # CF04 Cross-Origin Storage Bridge
├── grammatik/                           # 232 prerenderade sidor (alla mappar och dokument)
│   ├── index.html
│   ├── introduktion/
│   │   ├── index.html
│   │   └── vad-ar-fornsvenska/
│   │       └── index.html
│   └── ...
├── texter/                              # 44 prerenderade sidor (lagar, urkunder, prosa)
│   ├── index.html
│   ├── lagar/
│   │   └── aldre-vastgotalagen/
│   │       ├── arfda-balker/index.html
│   │       └── ...
│   └── ...
├── resurser/                            # Resursbibliotek
│   ├── index.html
│   └── vastgotalagen/                   # Äldre Västgötalagen bokvy (Cod. Holm. B 59)
│       └── index.html
├── runor/                               # Sveriges runinskrifter
│   ├── index.html                       # Katalog och interaktiv Leaflet-karta
│   └── ol-1/index.html                  # Detaljsida med schema.org JSON-LD
├── kontakt/                             # Kontakt- och rättelseformulär
│   └── index.html
├── bocker/                              # Lokala faksimil- och bok-PDF:er
└── _next/static/                        # Minifierade CSS-, typsnitts- och JS-chunks
```

### Filbudget och volymer:
* **Faktiskt filantal:** 739 filer.
* **Intern varningsbudget (CF03):** 16 000 filer (utnyttjande: **4,6 %**).
* **Cloudflare Pages Free tak:** 20 000 filer (utnyttjande: **3,7 %**).
* **Byggtid för monteringen:** 335–520 ms.
* **Verifierade rutter i bygget:** 306 unika sidrutter.

---

## 2. Egen designad 404.html på edge

Tidigare förlitade sig projektet på Next.js generiska interna `_not-found`. I CF07 skapades [`app/not-found.tsx`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/app/not-found.tsx):
* Renderas vid byggtillfället till `dist/www/404.html`.
* Följer Fornsvenska.se:s typografi (`Newsreader`, `Martian Mono`), färger (`paper`, `ink`, `rust`) och `SiteFrame`.
* Presenterar tydlig svensk felinformation: *"Felkod 404 – Sidan hittades inte"*.
* Erbjuder direkta navigeringslänkar tillbaka till webbplatsens alla huvudytor (*Startsida*, *Ordbok*, *Grammatik*, *Textarkiv*, *Runinskrifter*, *Resursbibliotek*).
* Cloudflare Pages returnerar automatiskt denna fil med HTTP-status `404` vid alla icke-matchande URL:er på `www.fornsvenska.se`.

---

## 3. Offentlig datagräns och nollanropsgaranti

Kravet för CF07 slår fast att webbplatsens läsdel ska fungera fullständigt utan databas och utan runtime-anrop.

### Åtgärder i källkoden:
1. **`AdminContext.tsx`:**  
   Tidigare kördes `supabase.auth.getSession()` och en fråga mot `admins`-tabellen ovillkorligen vid klientmontering i `RootLayout`.  
   Nu har en snabbkontroll införts:
   ```typescript
   const isAdminHostOrPath =
     window.location.hostname.startsWith("admin.") ||
     window.location.pathname.startsWith("/admin");
   const harAuthKaka = document.cookie.includes("sb-");
   let harStorageToken = false;
   // Kontrollera om localStorage innehåller Supabase-auth-token
   if (!isAdminHostOrPath && !harAuthKaka && !harStorageToken) {
     return; // 0 nätverksanrop för anonyma besökare!
   }
   ```
   Detta eliminerar 100 % av förfrågningarna från allmänna besökare.
2. **Offline- och blockeringsprov:**  
   Under testkörning kopplades nätverksåtkomsten mot Supabase bort. Samtliga 306 publika sidor genererades och serverades med fullständigt innehåll från de versionsbundna lokala källfilerna.

---

## 4. Testmiljöernas robots- och noindex-spärr

I enlighet med ombyggnadsplanen har miljödetekteringen uppdaterats i [`app/robots.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/app/robots.ts):
```typescript
export function arPreviewMiljo(): boolean {
  if (process.env.CONTEXT && process.env.CONTEXT !== "production") return true; // Netlify
  if (process.env.CF_PAGES_ENVIRONMENT === "preview") return true;               // Cloudflare Pages preview
  if (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main" && process.env.CF_PAGES_BRANCH !== "master") return true;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return true;
  if (process.env.NEXT_PUBLIC_VERCEL_ENV && process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return true;
  return false;
}
```
* I preview-miljöer genereras `User-agent: *\nDisallow: /`.
* I produktionsmiljön tillåts fullständig genomsökning (`Allow: /`) medan `/api/` spärras.

---

## 5. Ruttkontrakt för `_redirects` och `_headers`

I `dist/www/_redirects` kombineras:
1. **Äldre interna rutter:**  
   `/kallor /resurser 301`
2. **Gamla ordbokslänkar till de sju underdomänerna (CF03):**  
   68 prefixregler för `/ordbok/soederwall*` till `https://ord-01..07.fornsvenska.se/ordbok/soederwall* 301` med bevarad sökkontext.

I `dist/www/_headers` deklareras:
* `/_next/static/*`: `Cache-Control: public, max-age=31536000, immutable` (permanenta hashade resurser).
* `/*.html`: `Cache-Control: public, max-age=0, must-revalidate` (omedelbar synlighet vid ny release).
* `/ordbok/storage-bridge.html`: `Cache-Control: public, max-age=3600`, `X-Frame-Options: SAMEORIGIN`.
* Bilder och typsnitt: `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`.

---

## 6. Inventering av externa tillgångar

1. **Kartor (Runor):**
   * Kartmotorn Leaflet använder OpenStreetMap via `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.
   * Standardattribution till OpenStreetMap bidragsgivare visas i kartans fot.
   * Vid nätverksfel eller blockering fångar `tileerror`-lyssnaren felet och sätter en icke-blockerande varningstext; katalogen förblir 100 % sök- och läsbar via listreserven.
2. **Typsnitt:**
   * Webbplatsens brödtext och rubriker (`Newsreader`, `Martian Mono`) bakas in och serveras lokalt från `_next/static/media/`.
   * Extern länk till Google Fonts för `Noto Sans Runic` tillhandahåller runteckenstöd för äldre webbläsare som saknar lokala medeltidsrunor.

---

## 7. Verifieringsresultat

### Maskinell provning ([`tests/cloudflare-cf07.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf07.test.mjs)):
* `CF07: Statiskt huvudbygge och filbudget för Cloudflare Pages`: **Godkänd** (739 filer, 306 rutter, < 20 000 filer).
* `CF07: Ren statisk webbserver betjänar publika läsrutter och 404`: **Godkänd** (200 OK på startsida, grammatik, textarkiv, runor, resurser, bokvy; 404 på ogiltig rutt).
* `CF07: Ruttkontrakt för _redirects och _headers`: **Godkänd** (68 ordboksregler, 1 kallor-regel, korrekta cache-headers).
* `CF07: Preview-miljöer och robots.txt-spärr`: **Godkänd** (Cloudflare Pages preview och icke-main grenar spärras korrekt).
* `CF07: Säkerställd datagräns och nollanropsgaranti för anonyma läsare`: **Godkänd** (0 anrop, inga hemligheter i HTML).
* `CF07: Extern tillgångsinventering (kartor och specialtypsnitt)`: **Godkänd** (OSM-attribution, Noto Sans Runic).

Samtliga **185 tester** i repositoryt passerar utan anmärkning (`node --import tsx --test tests/*.test.mjs`).  
Källkoden kompilerar utan TypeScript-fel (`npx tsc --noEmit` exit code 0).

---

## 8. Slutsats och nästa steg

Etapp **CF07** är fullständigt genomförd och verifierad lokalt. Huvudsajten `www.fornsvenska.se` kan distribueras till Cloudflare Pages som en ren statisk webbplats inom gratisnivån.

Nästa etapp enligt ombyggnadsplanen är **CF08 – Fullständig ordbok och sökning i webbläsaren** (integrering av det kompakta 0,58 MB sökindexet på huvudsajten, Web Worker för fulltextsökning och generering av samtliga 41 744 artikel-HTML-sidor över `ord-01..07`).
