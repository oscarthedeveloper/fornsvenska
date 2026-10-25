# E01 – Nulägesprotokoll och konfiguration

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)

---

## 1. Utgångspunkt och Git-status

- **Gren:** `main`
- **Senaste incheckning (HEAD):** `08d53a5` (`origin/main`) — "öhrn"
- **Fjärrarkiv:** `https://github.com/oscarthedeveloper/fornsvenska.git`

### 1.1 Avgränsning av befintliga, pågående ändringar
Arbetskopian innehåller omfattande pågående arbete som **inte får röras eller skrivas över**:
- **Textmaterial & parser:**
  - `data/textdokument.ts` (+4 338 rader)
  - `data/texter.ts` (+27 rader)
  - `lib/text.ts` (+14 rader)
  - `scripts/build_textdokument.py` (uppdaterad textbyggare)
  - `scripts/validate-texter.ts` och `tests/validate-texter.test.mjs`
- **Runmaterial & kartfunktioner:**
  - `app/runor/`, `app/admin/runor/`, `app/api/runor/`
  - `components/runor/`, `components/admin/RunicEditorialAdmin.tsx`
  - `lib/runor/` (24 filer, inklusive GeoJSON, korpus och avtal)
  - `tests/runor-*.test.mjs` (27 testsviter)
- **Paket- och konfigurationsändringar:**
  - `package.json` och `package-lock.json` (`leaflet`, `@electric-sql/pglite`, `validate:texter`)
  - `app/globals.css` (runstyling)
  - `components/Toppnav.tsx` (länk till `/runor`)
  - `.gitignore` (lokala arbetsfiler)

Samtliga dessa filer förblir orörda under optimeringsarbetet.

---

## 2. Låsta versioner och körtidsmiljö

| Komponent | Version i projektet | Konfiguration |
|---|---|---|
| **Node.js (lokalt)** | `v24.21.0` | macOS arm64 |
| **Node.js (Netlify)** | `20` | Konfigurerad i `netlify.toml` (`[build.environment] NODE_VERSION = "20"`) |
| **Next.js** | `14.2.5` | Låst version i `package.json` |
| **React** | `18.3.1` | `^18.3.1` (låst via `package-lock.json`) |
| **React DOM** | `18.3.1` | `^18.3.1` (låst via `package-lock.json`) |
| **@supabase/ssr** | `0.5.1` | `^0.5.1` |
| **@supabase/supabase-js** | `2.45.0` | `^2.45.0` |
| **TypeScript** | `5.5.4` | `^5.5.4` |
| **Tailwind CSS** | `3.4.7` | `^3.4.7` |

---

## 3. Netlify-adapter och körtidsarkitektur

- **Konfigurationsfil:** [`netlify.toml`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/netlify.toml)
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"

  [build.environment]
    NODE_VERSION = "20"

  [dev]
    command = "npm run dev"
    targetPort = 3000
  ```
- **Netlify Next-runtime:** Netlify detekterar Next.js automatiskt och applicerar `@netlify/plugin-nextjs` v5.
- **Aktiv serverfunktion i produktion:** `Next.js Server Handler` (`___netlify-server-handler`).
- **Edge Functions:** `middleware.ts` kompileras till en Netlify Edge Function (matcher: alla sidor utom `_next/static`, `_next/image`, `favicon.ico` och statiska bildformat).

---

## 4. Netlify-kvot och förbrukningsstatus (2026-10-25)

Enligt Netlifys driftgränssnitt per 25 oktober 2026:
- **Period:** 1 oktober 2026 – 1 november 2026.
- **Funktionsanrop:** **146 418** anrop förbrukade av **125 000** i kvotgräns (117 % av månadskvoten).
- **Funktionstid:** **6 timmar** av 100 timmar.
- **Kontoåtgärd:** Netlify visar varning om att projekt pausas och återställs vid nästa månadsskifte (1 nov) om inte abonnemanget uppgraderas.

### Grindverifiering (E01-grind)
- Eftersom produktionskontot är i kvotöverskridande läge och externa förhandsdeployer kan pausas av Netlify, **genomförs alla mätningar och verifieringar lokalt mot identiskt produktionsbygge** (`next build && next start`).
- Inga antaganden görs om att lokala data motsvarar produktion utan strikt kontroll av miljöflaggor.
- Molnverifiering på Netlify i etapp E13 markeras tills vidare som blockerad tills kontoåtkomst medges.

---

## 5. Datakälla och miljöarkitektur

Projektet har en hybrid dataarkitektur:
1. **Kanoniska filer i `data/` (standard när flagga saknas):**
   - Arkiv (Grammatik och Texter): [`data/grammatik.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/grammatik.ts), [`data/dokument.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/dokument.ts), [`data/texter.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter.ts), [`data/textdokument.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/textdokument.ts).
   - Startsida: standardinnehåll i [`lib/sidtyper.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/sidtyper.ts).
   - Resurser: [`data/resurser.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/resurser.ts) och [`lib/kallbibliotek.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/kallbibliotek.ts).
   - Ordbok: [`data/ordbok/poster.json`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/ordbok/poster.json) (41 744 poster, inläst i minnesindex).
   - Runor: [`lib/runor/pilot-data.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/runor/pilot-data.ts) och [`lib/runor/batch1-data.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/runor/batch1-data.ts).
2. **Supabase Postgres (styrs via `NEXT_PUBLIC_DATA_SOURCE=supabase` och `HAR_SUPABASE`):**
   - När `NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY` finns i miljön sätts `HAR_SUPABASE = true`.
   - Läsvägar för arkiv, sidor och ordbok kontrollerar uttryckligen:  
     `HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase"`
   - När `NEXT_PUBLIC_DATA_SOURCE` inte är satt till `"supabase"` läser applikationen från de lokala filerna, även om Supabase-nycklarna är definierade för inloggning/admin.

---

## 6. Uppmätta route-typer vid produktionsbygge (`next build`)

Vid rent bygge genereras följande route-matris:

```
Route (app)                              Size     First Load JS   Typ
┌ ƒ /                                    6.68 kB         111 kB   Dynamic (Serverfunktion)
├ ○ /_not-found                          871 B          88.5 kB   Static
├ ƒ /admin                               4.1 kB          171 kB   Dynamic (Serverfunktion)
├ ƒ /admin/runor                         3.68 kB         170 kB   Dynamic (Serverfunktion)
├ ƒ /api/ordbok/uppslag                  0 B                0 B   Dynamic (Serverfunktion)
├ ƒ /api/runor/v1                        0 B                0 B   Dynamic (Serverfunktion)
├ ƒ /api/runor/v1/[slug]                 0 B                0 B   Dynamic (Serverfunktion)
├ ƒ /grammatik/[[...slug]]               9.34 kB         120 kB   Dynamic (Serverfunktion)
├ ○ /icon.svg                            0 B                0 B   Static
├ ○ /kallor                              141 B          87.8 kB   Static
├ ƒ /ordbok                              9.38 kB         115 kB   Dynamic (Serverfunktion)
├ ƒ /ordbok/[id]                         202 B           106 kB   Dynamic (Serverfunktion)
├ ƒ /resurser                            10.2 kB         177 kB   Dynamic (Serverfunktion)
├ ○ /resurser/vastgotalagen              2.73 kB         102 kB   Static
├ ○ /runor                               12.1 kB         117 kB   Static
├ ● /runor/[slug]                        10.5 kB         115 kB   SSG (20 förrenderade HTML-sidor)
└ ƒ /texter/[[...slug]]                  7.92 kB         119 kB   Dynamic (Serverfunktion)
```

**Observation:**  
11 av 16 rutter klassificeras som `ƒ Dynamic` och anropar `___netlify-server-handler` vid varje besök.

---

## 7. Identifierade huvudorsaker till hög anropsvolym

1. **Gemensam sessionsavläsning i [`app/layout.tsx`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/app/layout.tsx):**  
   Rotlayouten anropar `await hamtaSession()`, vilket anropar `skapaServerKlient()` och läser `cookies()`. När Supabase är konfigurerat gör detta att Next.js betraktar hela rotlayouten och alla undersidor som dynamiska.
2. **Explicit `force-dynamic`:**  
   - `app/page.tsx`
   - `app/texter/[[...slug]]/page.tsx`
   - `app/grammatik/[[...slug]]/page.tsx`
   - `app/resurser/page.tsx`
   - `app/admin/page.tsx`
   - `app/admin/runor/page.tsx`
3. **Länkförhandsladdning (`prefetch`):**  
   Next.js `<Link>`-komponenter förhandsladdar RSC-data när länkar syns i viewport eller hovras. Eftersom sidorna är dynamiska skickas en RSC-förfrågan till Netlify-serverfunktionen för varje synlig eller hovrad länk.
4. **Bred cacheinvalidering i Server Actions:**  
   `lib/actions.ts` anropar `revalidatePath('/', 'layout')`, vilket slår ut all eventuell cache över hela webbplatsen.
5. **Okontrollerad uppslagscache i API:**  
   `app/api/ordbok/uppslag/route.ts` saknar `Cache-Control`-headers, vilket gör att varje tangenttryckning eller klick på ord gör ett färskt anrop till serverfunktionen.

---

## 8. Verifieringsstatus för verktyg och tester

- `npm run validate:kallor`: Godkänd (0 fel).
- `npm run validate:texter`: Godkänd (0 fel).
- `npx tsx --test tests/validate-texter.test.mjs`: Godkänd (6/6 tester).
- `npx tsx --test tests/runor-contract.test.mjs`: Godkänd (8/8 tester).
- `npx tsc --noEmit`: Godkänd (0 typfel).
- `npm run build`: Godkänd (exit code 0).

---

## 9. Plan för Etapp E02 (Nästa steg)

Etapp E02 kommer att mäta faktiska besökarresor mot produktionsservern (`npm run start`):
1. **Resa 1:** Startsida → Textkatalog → Textläsning → Ordboksuppslag i text → Nästa text.
2. **Resa 2:** Grammatiköversikt → Grammatikartikel → Korshänvisning.
3. **Resa 3:** Resursbibliotek → Filtrering → Skriftkammaren / PDF-visning.
4. **Resa 4:** Runsida → Filter → Detaljsida → Tillbaka.
5. **Resa 5:** Inloggning redaktör → Redigering → Sparning → Kontroll som anonym läsare.

Resultaten dokumenteras i `docs/drift/E02-besokarresor-fore-andring.md`.
