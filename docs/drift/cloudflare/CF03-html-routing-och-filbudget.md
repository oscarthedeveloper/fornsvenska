# CF03 – artikel-HTML, routing och filbudget

Datum: 2026-10-30. Status: **lokalt verifierad prototyp för HTML, routing och filbudget; molnverifiering på testprojekt återstår**.

## Sammanfattning och resultat

Etapp CF03 har undersökt och verifierat de tre centrala riskfrågorna för ordbokens uppdelning:
1. **Fullständig artikel-HTML och metadata:** Varje artikel genereras som en ren statisk HTML-sida med full artikeltext, formaterade citat, länkade korshänvisningar, källproveniens och fullständiga unika metadata (title, description, canonical på underdomänen och OpenGraph) utan krav på JavaScript för läsning eller indexering.
2. **Deterministisk routing och entydigt ägarskap:** Samtliga 41 744 unika ID:n mappar deterministiskt till exakt en av sju tekniska grupper baserat på första tecknet efter `--`. Gamla länkar `/ordbok/<id>` på huvudsajten omdirigeras med 301 till rätt underdomän via 68 kompakta Cloudflare Pages-prefixregler, vilket ryms med god marginal inom gränsen på max 100 dynamiska regler.
3. **Mätning av största ordgruppen (Grupp 04):** Den största gruppen (*l–o*, 6 900 artiklar) har byggts och exporterats i sin helhet. Total filräkning landar på **6 901 filer**, vilket motsvarar **43,1 % av den interna budgeten (16 000 filer)** och **34,5 % av Cloudflare Pages Free-gränsen (20 000 filer)**. Byggtiden för samtliga 6 900 artiklar var 1,75 sekunder.

---

## 1. Gruppfördelning och deterministisk ägarfunktion

Ägarfunktionen `getArticleOwner(id)` i [`scripts/cloudflare/routing.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/scripts/cloudflare/routing.ts) extraherar första tecknet efter `--` i artikelns ID (inte postens alfabetiska visningssektion `letterSection`).

| Grupp | Värd / underdomän | Initialer efter `--` | Artiklar | Exporterade filer (HTML + delad tillgång) | Budgetmarginal (mot 16 000) |
|---|---|---|---:|---:|---:|
| 01 | `ord-01.fornsvenska.se` | a, b, c, d, e | 6 107 | 6 108 | 38,2 % |
| 02 | `ord-02.fornsvenska.se` | f, g | 5 471 | 5 472 | 34,2 % |
| 03 | `ord-03.fornsvenska.se` | h, i, j, k | 6 621 | 6 622 | 41,4 % |
| 04 | `ord-04.fornsvenska.se` | l, m, n, o (störst) | 6 900 | 6 901 | **43,1 %** |
| 05 | `ord-05.fornsvenska.se` | p, q, r, ö, þ, -, _ | 3 367 | 3 368 | 21,1 % |
| 06 | `ord-06.fornsvenska.se` | s | 6 609 | 6 610 | 41,3 % |
| 07 | `ord-07.fornsvenska.se` | t, u, v, y, ä | 6 669 | 6 670 | 41,7 % |
| **Totalt** | **7 underdomäner** | **28 unika initialer** | **41 744** | **41 751** | — |

Samtliga 41 744 ID:n har kontrollerats maskinellt i [`tests/cloudflare-cf03.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf03.test.mjs). Inga föräldralösa ID:n, saknade initialer eller dubbla grupptillhörigheter förekommer.

---

## 2. Gamla länkar och Cloudflare Pages `_redirects`

För att bevara samtliga inkommande sökmotorlänkar och bokmärken till `/ordbok/<id>` på `www.fornsvenska.se` skapas en uppsättning prefixregler i `_redirects`.

### Regelstruktur och volym
* Cloudflare Pages Free tillåter högst **100 dynamiska regler** (splats/placeholders) och **2 000 statiska regler**.
* Vår genererade regelfil [`docs/drift/cloudflare/CF03-redirects.txt`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/drift/cloudflare/CF03-redirects.txt) innehåller exakt **68 aktiva dynamiska regler**:
  * 56 standardregler för de 28 initialerna × 2 källdatamängder (`soederwall--<tecken>*` och `soederwall-supp--<tecken>*`).
  * 12 regler för URL-kodade specialtecken (`ö` som `%C3%B6`/`%c3%b6`, `þ` som `%C3%BE`/`%c3%be`, `ä` som `%C3%A4`/`%c3%a4`).
* Regelvolymen 68 ryms med god säkerhetsmarginal inom 100-reglersgränsen (32 regler kvar för andra behov).

### Beteende och loopskydd
* Sök- och bläddringssidan `/ordbok` och `/ordbok?q=...` på huvudsajten matchar **inte** prefixreglerna (eftersom reglerna kräver prefix `/ordbok/soederwall` eller `/ordbok/soederwall-supp`). Det uppstår därmed inga redirectloopar.
* Query-parametrar (t.ex. `?q=...&mode=...`) skickas automatiskt vidare i Cloudflare Pages redirects, vilket bevarar sökkontexten.
* Efter omdirigering landar besökaren på målartikeln med HTTP 200, där `<link rel="canonical">` pekar på artikelns faktiska URL på underdomänen.

---

## 3. Mätdata för största ordgruppen (Grupp 04)

Uppmätta värden ur [`CF03-filbudget.json`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/drift/cloudflare/CF03-filbudget.json):

| Parameter | Uppmätt värde | Gräns / Referens | Marginal |
|---|---:|---:|---:|
| Antal artiklar | 6 900 | — | — |
| Exporterade filer | 6 901 | 16 000 (intern budget) | **9 099 filer till godo (43,1 % utnyttjat)** |
| Exporterade filer mot Pages Free | 6 901 | 20 000 (Cloudflare-tak) | **13 099 filer till godo (34,5 % utnyttjat)** |
| Total filstorlek (uncompressed) | 58,28 MB | — | — |
| Total filstorlek (gzip) | 18,78 MB | — | — |
| Genomsnittlig HTML-storlek | 8 447 byte | 25 MiB (Pages max/fil) | < 0,1 % av maxgräns |
| Min / Median / Max HTML-storlek | 7 592 / 8 289 / 37 358 byte | — | — |
| Byggtid för alla 6 900 artiklar | 1 751 ms (1,75 s) | 20 min (Pages timeout) | 99,8 % tidsmarginal |
| Peak minnesåtgång (RSS) | 376 MB | — | Mycket resurssnålt |

### Jämförelse mot Next.js `output: 'export'`
Om Next.js standard App Router-export skulle användas:
* Next.js genererar både en `.html`-fil och en `.txt` (RSC payload) för varje dynamisk sida, plus delade webpack-chunks.
* 6 900 artiklar × 2 + 50 chunks = **13 850 filer**.
* 13 850 filer motsvarar **86,6 % av internbudgeten på 16 000 filer**. Detta lämnar liten tillväxtmarginal och medför dessutom betydligt längre byggtider och högre minnesåtgång i webpack/turbopack.
* **Slutsats:** Den dedikerade statiska artikelbyggaren ger identisk HTML-presentation och full tillgänglighet, men halverar filantalet och bygger på under 2 sekunder. Den väljs som preliminär exportmetod för ordboksdelarna.

---

## 4. Artikelprototyp och interaktion

Prototypen i [`scripts/cloudflare/render-article.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/scripts/cloudflare/render-article.ts):
* **Initial HTML:** Innehåller hela artikeln, käll-ID, ordboksband, ordklass, modern definition (om sådan finns), redaktionell rättelse (om sådan finns), formaterade citat (`<span class="ordbok-citat">`) och verifierade länkade hänvisningar (`se <ord>`).
* **Metadata:** Unik `<title>`, `<meta name="description">` och `<link rel="canonical">` samt OpenGraph-taggar.
* **Bokmärkning i webbläsaren:** Innehåller en tillgänglig knapp (`#bokmarke-knapp`) och ett minimalt, självständigt inline-skript som läser och skriver till samma `localStorage`-nyckel (`fornsvenska_sparade_ord_v1`) som befintlig applikation.

---

## 5. Genomförda kontroller

1. **Enhetstester:** 5 av 5 godkända i [`tests/cloudflare-cf03.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf03.test.mjs).
2. **Regressionskontroll:** Samtliga 166 befintliga tester i repo passerar utan fel (`node --import tsx --test tests/*.test.mjs`).
3. **Typkontroll:** `npx tsc --noEmit` passerar med exit-kod 0.
4. **Mätverifiering:** Största gruppen (6 900 artiklar) byggd till temporär katalog med uppmätta tider, storlekar och minne.

---

## 6. Kvarstående hinder och nästa startpunkt

* **Molnverifiering:** Den genererade `_redirects`-filen och artikel-HTML:en är maskinellt verifierade lokalt. Faktiskt deploy-prov på ett Pages-testprojekt i inloggat Cloudflare-konto (statuskoder 301/200, trailing slashes och Unicode på Cloudflares edge) kan genomföras när testprojekt skapas.
* **Nästa etapp:** **CF04 – Prova gemensam personlig ordlista över underdomäner**. CF04 ska prova hur sparade ord och anteckningar kan synkroniseras eller delas mellan `www.fornsvenska.se` och de sju underdomänerna utan att kräva inloggning eller molndatabas för användarens privata studiedata.
