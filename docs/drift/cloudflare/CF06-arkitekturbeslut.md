# CF06 – fastställd arkitektur och mätbudget

Datum: 2026-10-30. Status: **fastställd arkitektur och låst mätbudget**.

## Sammanfattning

Efter genomförandet och den lokala maskinella verifieringen av de tre genomförbarhetsproven (CF03, CF04 och CF05) fastställs härmed de slutliga arkitekturbesluten och prestandabudgeten inför den fullständiga ombyggnaden (CF07–CF14).

Samtliga bindande produktkrav från användaren är uppfyllda i den låsta modellen:
* **0 kr återkommande driftkostnad:** Inga betalda provkrediter, inga betalda runners och inga automatiska förbrukningsavgifter.
* **Fullständig HTML för alla 41 744 artiklar:** Varje artikel har en unik URL, komplett artikeltext och unika metadata i det initiala svaret utan JavaScript-beroende.
* **Beständig webbredaktion:** Redigering sker i webbläsaren med Supabase Auth och RLS; publicering sker via separat administratörsstyrd knapp.
* **Gamla länkar fungerar:** 68 kompakta `_redirects`-regler säkrar HTTP 301-omdirigering från `/ordbok/<id>` till rätt underdomän med bevarad sökkontext.
* **Oförändrad besökarupplevelse:** Presentation, typsnitt, källhänvisningar, kartor, grammatik och personlig ordlista bevaras.

---

## 1. Fastställda arkitekturbeslut

| Beslutsområde | Fastställt val | Bevis / Underlag från prototyperna |
|---|---|---|
| **1. Exportmetod för ordbok** | Dedikerad statisk artikelbyggare (`scripts/cloudflare/render-article.ts`) för ordboksdelarna; Next.js static export för huvudsajten | Next.js App Router-export genererar dubbla filer (HTML + `.txt` RSC-payload) vilket gav 13 850 filer i grupp 04 (86,6 % av budgeten) och krävde minuter av webpack-bygge. Den dedikerade byggaren genererar exakt 1 HTML-fil per artikel: 6 901 filer totalt (43,1 % av budgeten), bygger på 1,75 s och har noll onödiga payloads. |
| **2. Gruppfördelning och värdar** | Sju ordboksunderdomäner (`ord-01..07.fornsvenska.se`), huvudsajt (`www.fornsvenska.se`) och redaktörsyta (`admin.fornsvenska.se`) | Deterministisk ägarfunktion `getArticleOwner(id)` baserad på första tecknet efter `--`. Samtliga 41 744 ID:n fördelas entydigt: minsta gruppen 3 367 artiklar (grupp 05), största 6 900 (grupp 04). Inga föräldralösa ID:n. |
| **3. Ruttkontrakt & gamla länkar** | 68 dynamiska prefixregler i `_redirects` på `www.fornsvenska.se` (HTTP 301 till rätt underdomän) | 68 regler ryms väl inom Cloudflare Pages tak på 100 dynamiska regler. Specialtecken (`ö`, `þ`, `ä` samt deras URL-kodade motsvarigheter) har explicita regler. Huvudsajtens `/ordbok` påverkas inte och loopar inte. Query-parametrar skickas med. |
| **4. Snapshot-kontrakt** | `fornsvenska.snapshot.v1` med release-ID `cf-<hash>`, manifest och versionsbundna tillgångar | Maskinellt verifierat i CF02 ([CF02-snapshotkontrakt.md](./CF02-snapshotkontrakt.md)). Transaktionell JSON-aggregering undviker radgränser. Strikt avvisande av skadade tillgångar eller obehöriga filer. |
| **5. Sökindexstrategi** | Tvådelat index: Kompakt uppslagsordsindex (grundsökning/bläddring) + separat on-demand fulltextindex (Web Worker) | Grundindexet för alla 41 744 poster är **0,58 MB gzip** (4,33 MB rått) och laddas på < 150 ms vid ordboksbesök. Söktid är i snitt **2,61 ms**. Fulltextindexet (6,25 MB gzip) laddas uteslutande vid aktivt val av artikeltextsökning. Grundsökning kräver 0 fulltextdata. |
| **6. Personlig ordlista** | Kanonisk hemvist på `www.fornsvenska.se`; Cross-Origin Storage Bridge via iframe och `postMessage` | 9 vitlistade origins med strikt fältsanitering ([CF04-ordlista-over-origins.md](./CF04-ordlista-over-origins.md)). Vid blockerad lagring (Safari ITP) returneras `BLOCKED` – klienten nollställer aldrig och skriver aldrig över användarens ordlista. Säkerhetskopiering via JSON-export/import. |
| **7. Redaktion & behörighet** | Webbredaktion på `admin.fornsvenska.se` mot Supabase Auth och RLS i beständiga tabeller | Utkast sparas beständigt och isoleras strikt från publicerad utgåva ([CF05-redigering-och-publicering.md](./CF05-redigering-och-publicering.md)). Publiceringsknappen kräver `arAdmin === true`, har idempotensskydd och kvotspärr (max 28 körningar/månad). |
| **8. Gratis byggkedja & release** | GitHub Actions standard-Linux runner + Cloudflare Pages Direct Upload via Wrangler | 0 kr kostnad (gratis standardrunner i publikt repo). Huvudsajten aktiveras alltid sist. Vid avbrutet eller misslyckat delbygge förblir aktiv release 100 % intakt och läsbar. |

---

## 2. Åtskillnad mellan beslut och antaganden

### Fastställda beslut (bekräftade och bevisade)
* Ordboken delas upp på exakt sju underdomäner med prefixmappning på första tecknet efter `--`.
* Huvudsajten `www.fornsvenska.se` behåller sökgränssnittet och använder det kompakta 0,58 MB-indexet.
* Artiklar renderas som ren HTML med delad CSS och ett minimalt, självständigt inline-skript för bokmärkning.
* Vanlig besökstrafik (läsning, ordbokssökning, textbläddring, kartvisning) genererar **0 anrop** till Supabase DB eller Cloudflare Workers.

### Antaganden som verifieras i molnfasen (CF10–CF13)
* Resend gratisdomänverifiering genomförs i CF10 utan kostnad för e-post vid kontaktformulär.
* Cloudflare Pages Direct Upload från GitHub Actions standardrunner till de nio projekten räknas inom månadskvoten om 500 operationer (vår budget räknar konservativt 252 operationer).
* Same-site cookies/storage mellan underdomäner under skarp DNS på `fornsvenska.se` verifieras i acceptanstestet CF12.

---

## 3. Fastställd prestandabudget

Mätdata från baslinjen och prototypmätningarna samlade i [`CF06-prestandabudget.json`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/drift/cloudflare/CF06-prestandabudget.json):

```text
                                PRESTANDABUDGET FÖR FORNSVENSKA
┌──────────────────────────────────────┬──────────────────────┬──────────────────────┐
│ Metrik                               │ Budgettak / Mål      │ Uppmätt i prototyp   │
├──────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Startsida: Initial HTML (gzip)       │ <= 6 KB              │ 3,6 KB               │
│ Startsida: Total initial payload     │ <= 80 KB             │ 49,8 KB              │
│ Startsida: Statiska nätanrop         │ <= 10 förfrågningar  │ 8 förfrågningar      │
│ Startsida: LCP (Largest Contentful)  │ <= 1,0 s             │ ~0,8 s (lokal)       │
├──────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Grundsökning: Kompakt sökindex       │ <= 1,0 MB gzip       │ 0,58 MB gzip         │
│ Grundsökning: Kall söktid (1:a sök)  │ <= 10 ms             │ 2,84 ms              │
│ Grundsökning: Varm söktid (snitt)    │ <= 5 ms              │ 2,61 ms (p95 3,3 ms) │
│ Grundsökning: Minnesåtgång i JS      │ <= 30 MB heap        │ 18 MB heap           │
├──────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Fulltextsökning: Index (on-demand)   │ <= 8,0 MB gzip       │ 6,25 MB gzip         │
│ Fulltextsökning: Påverkan på bas     │ 0 KB vid vanlig sök  │ 0 KB (lazy loaded)   │
├──────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Största ordboksdel (Grupp 04: l–o)   │ <= 16 000 filer      │ 6 901 filer (43,1 %) │
│ Största ordboksdel mot Pages Free    │ <= 20 000 filer      │ 6 901 filer (34,5 %) │
│ Största ordboksdel: Byggtid          │ <= 60 s              │ 1,75 s               │
│ Största ordboksdel: Minne vid bygge  │ <= 512 MB RSS        │ 376 MB RSS           │
├──────────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Månatliga releasekörningar           │ 28 kompletta försök  │ 252 Pages-operationer│
│ Cloudflare Pages månadskvot          │ 500 operationer      │ 49,6 % säkerhetsmarg │
│ Publika anrop till DB/Workers        │ 0 anrop              │ 0 anrop              │
└──────────────────────────────────────┴──────────────────────┴──────────────────────┘
```

*Mätprofil:* macOS arm64, Node 24.21.0, 100 sökobservationer med spritt stickprov över alla 41 744 artiklar.

---

## 4. Kvarstående avgränsningar och etappindelning

Den fullständiga ombyggnaden påbörjas nu i linje med de låsta besluten:
* **CF07:** Statisk huvudsajt på `www.fornsvenska.se` (startsida, texter, grammatik, resurser, runor).
* **CF08:** Produktionsklar statisk ordbok och klientbaserad sökning med 0,58 MB-indexet.
* **CF09:** Fullständig webbredaktion på `admin.fornsvenska.se`.
* **CF10:** Kontaktformulär (Resend), run-API och externa tillgångar.
* **CF11:** Samordnad byggkedja och releasehantering (GitHub Actions + Wrangler).
* **CF12:** Samlad lokal och molnbaserad acceptans.
* **CF13:** Testleverans och kontrollerad produktionsflytt.
* **CF14:** Uppföljning och förvaltningsöverlämning.
