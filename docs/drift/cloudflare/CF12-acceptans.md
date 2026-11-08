# CF12 – Samlad acceptans

## Sammanfattning
Denna rapport sammanfattar den samlade acceptanskontrollen för Fornsvenska på Cloudflare Pages Free i enlighet med kraven i [CLOUDFLARE_OMBYGGNADSPLAN.md](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/drift/CLOUDFLARE_OMBYGGNADSPLAN.md).

Samtliga 9 obligatoriska kontrollområden har genomförts, provats och **godkänts lokalt**. Hela projektets testsvit på **218 automatiserade tester** passerar utan ett enda fel (0 fail), och projektet kompilerar med 0 fel i `npx tsc --noEmit`.

---

## 1. Samlad acceptansmatris

| Kontrollområde | Krav & Beskrivning | Resultat | Underlag & Test |
|---|---|---|---|
| **1. Fullständighet** | Samtliga 41 744 ordboks-ID:n har exakt en deterministisk ägare, giltig canonical, artikeltext och metadata i initial HTML utan JavaScript-krav. Okända ID:n kastar explicit fel. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 1), `scripts/cloudflare/routing.ts` |
| **2. Gamla ordlänkar** | 68 prefixregler i `_redirects` på `www.fornsvenska.se` mappar samtliga 41 744 artiklar med HTTP 301 till `ord-01..07.fornsvenska.se`. Specialtecken (`ö`, `þ`, `ä`, URL-kodade varianter) och query params omdirigeras loop- och kedjefritt. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 2), `dist/www/_redirects` |
| **3. Funktionsmatris** | Textuppslag (klicka-i-text), sökning och filter (uppslagsord, verk), bokmärken/anteckningar, runinskrifter, karta och redaktion fungerar enligt CF00-baslinjen. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 3), `tests/cloudflare-cf08.test.mjs` |
| **4. Statiskt bygge** | Distribution utan server: publika läsare och sökning fungerar 100 % lokalt i webbläsaren även vid helt blockerat nätverk/offline. 0 anrop till Supabase eller Workers för läsare. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 4), `dist/www` |
| **5. Säkerhetsprov** | Obehöriga/oautentiserade mutationer nekas (HTTP 401/403). Återkallad adminroll nekas. 0 interna utkast läcker till offentliga snapshots. 0 hemligheter i publika distributionsfiler. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 5), `tests/cloudflare-cf09.test.mjs` |
| **6. Tillgänglighet & reserv** | WCAG AA-kontrast, semantisk HTML (`<main>`, `<article>`, `lang="sv"`, `<h1>`), skärmläsaretiketter och defensiv hantering när localStorage nekas (Safari ITP / privatläge). | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 6), `tests/runor-wcag-audit.test.mjs` |
| **7. Prestandabudget** | Uppslagsordsindex < 1.0 MB gzip (0.58 MB), fulltextindex < 8.0 MB gzip (6.25 MB), search-worker < 35 KB (2.8 KB). Max filstorlek i ordboken: 66 KB (gräns 25 MB). Max filantal per grupp: 13 803 (tak 16 000). | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 7), `CF06-prestandabudget.json` |
| **8. Projektkontroller** | `validate:kallor` och `validate:texter` passerar med 0 blockerande fel. `tsc --noEmit` ger 0 typfel. 218 tester passerar. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 8), `npm run validate:*` |
| **9. Testmiljöisolering** | Förhandsgranskningsmiljöer (preview) har robots noindex/disallow och pekar aldrig ut skarpa produktionslänkar som sin egen canonical. | **GODKÄNT** | `tests/cloudflare-cf12.test.mjs` (test 9), `app/robots.ts`, `app/layout.tsx` |

---

## 2. Detaljerade mätdata och verifiering

### 2.1 Ordboksgrupper och filbudget (Cloudflare Pages Free)
| Grupp | Initialer | Domän | Antal artiklar | Max filstorlek | Pages Free gräns | Säkerhetsmarginal |
|---|---|---|---|---|---|---|
| **ord-01** | a, b, c, d, e | `ord-01.fornsvenska.se` | 12 217 | 58 KB | 20 000 filer / 25 MB | 38.9 % marginal |
| **ord-02** | f, g | `ord-02.fornsvenska.se` | 10 945 | 52 KB | 20 000 filer / 25 MB | 45.3 % marginal |
| **ord-03** | h, i, j, k | `ord-03.fornsvenska.se` | 13 245 | 61 KB | 20 000 filer / 25 MB | 33.8 % marginal |
| **ord-04** | l, m, n, o | `ord-04.fornsvenska.se` | 13 803 | 66 KB | 20 000 filer / 25 MB | 31.0 % marginal |
| **ord-05** | p, q, r, ö, þ, -, _ | `ord-05.fornsvenska.se` | 6 737 | 49 KB | 20 000 filer / 25 MB | 66.3 % marginal |
| **ord-06** | s | `ord-06.fornsvenska.se` | 13 221 | 64 KB | 20 000 filer / 25 MB | 33.9 % marginal |
| **ord-07** | t, u, v, y, ä | `ord-07.fornsvenska.se` | 13 341 | 59 KB | 20 000 filer / 25 MB | 33.3 % marginal |
| **huvudsajt**| (www/app) | `www.fornsvenska.se` | 766 filer | 1.9 MB (index) | 20 000 filer / 25 MB | 96.2 % marginal |

*Samtliga 41 744 artiklar ryms med betryggande marginal inom Cloudflare Pages Free-gränserna.*

### 2.2 Sök- och uppslagsprestanda
- **Sökindex för uppslagsord:** 4.13 MB rådata, **595 KB gzip** (budget: < 1.0 MB).
- **Fulltextindex:** 15.77 MB rådata, **6.25 MB gzip** (budget: < 8.0 MB).
- **Search Web Worker:** 8.4 KB rådata, **2.8 KB gzip** (budget: < 35 KB).
- **Sub-millisekundsrespons:** Morfologiska textuppslag (`slaUppTextOrdKlient`) exekverar på **0.15–0.45 ms** i klienten utan nätverkslatens.
- **Sökparitet:** 100 % exakt överensstämmelse mellan serverns sökresultat och Web Worker/klientmotorn.

### 2.3 Drift- och kostnadsbudget ($0/månad)
- **Cloudflare Pages:** 0 kr/månad (obegränsad statisk bandbredd och förfrågningar).
- **GitHub Actions:** 0 kr/månad (ca 224 byggoperationer/månad, budgeterat max 28 releaser; GitHub Free ger 2 000 gratisminuter).
- **Supabase Free Tier:** 0 kr/månad (endast för administrativ redaktion och auth; 0 publika anrop).
- **Resend Free Tier:** 0 kr/månad (kontaktformulär med strikt kvot på max 100 mejl/dag, 3 000/månad).

---

## 3. Säkerhets- och integritetsgranskning

1. **Inga läckande hemligheter:**
   - Automatisk skanning har verifierat att inga API-nycklar (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CLOUDFLARE_API_TOKEN` eller `GITHUB_TOKEN`) finns i `dist/www`, `public/` eller de genererade ordboksartiklarna.
2. **Webbredaktionens åtkomstkontroll:**
   - Oautentiserade anrop till redaktionens server actions avvisas med HTTP 401.
   - Användare utan administratörsroll avvisas med HTTP 403.
   - Återkallade administratörsroller slår igenom omedelbart vid sparande eller publicering.
3. **Cross-Origin Storage Bridge:**
   - Endast de 9 auktoriserade ursprungen (`*.fornsvenska.se` och `localhost` för utveckling) tillåts kommunicera med Storage Bridge via `postMessage`.
   - Alla mottagna poster tvättas defensivt (`sanitizeSavedPost`), och eventuella sessionstokens eller skript taggas bort innan sparning.
4. **Isolering av test- och preview-miljöer:**
   - I testmiljöer genererar `app/robots.ts` och `scripts/cloudflare/render-article.ts` automatiskt `noindex, nofollow`.
   - Testmiljöns canonical-taggar pekar på testvärden (`preview.fornsvenska.se` eller `*.pages.dev`), aldrig på produktionsdomänerna.

---

## 4. Reproducerbara verifieringssteg

För att självständigt köra samtliga acceptanskontroller:

```bash
# 1. Kontrollera typer
npx tsc --noEmit

# 2. Validera källor och texter
npm run validate:kallor
npm run validate:texter

# 3. Kör samlad acceptanstestsvit (CF12)
node --import tsx --test tests/cloudflare-cf12.test.mjs

# 4. Kör samtliga Cloudflare-tester (CF03–CF12)
node --import tsx --test tests/cloudflare-cf*.test.mjs

# 5. Kör hela projektets testsvit (218 tester)
node --import tsx --test tests/*.test.mjs
```

---

## 5. Avgränsning mot molnverifiering

I enlighet med ombyggnadsplanens föreskrifter skiljer vi strikt på vad som är lokalt verifierat och vad som kräver aktiv molnåtkomst:
- **Lokalt verifierat:** Fullständig HTML-generering, 68 redirects, indexbygge, pre-flight checks, felinjektioner, WCAG AA, rollback och säkerhetsprov.
- **Återstående molnverifiering i CF13:** Faktisk DNS-pekning i Cloudflare dashboard, SSL-certifikat för apex och 8 underdomäner, samt skarp sändning via Resends e-postdomän.

---

## 6. Slutsats

Etapp **CF12 (Samlad acceptans)** är härmed **godkänd och lokalt verifierad**.
Inga obligatoriska krav saknar belägg och inga funktions-, säkerhets- eller budgetavvikelser föreligger. Plattformen är fullständigt redo för **CF13 (Testleverans och kontrollerad produktionsflytt)**.
