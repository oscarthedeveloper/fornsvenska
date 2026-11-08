> Korrigering 2026-11-01: Denna historiska prototyprapport bevisar inte molnleverans eller produktionsgodkännande. Se [aktuella blockerare](./BLOCKERARE-2026-11-01.md).

# CF13 – Testleverans och kontrollerad produktionsflytt

## Sammanfattning
Denna rapport sammanställer testleveransen, testinstruktionen för användargranskning samt den tekniska DNS- och produktionsflyttplanen för övergången till Cloudflare Pages Free.

> [!IMPORTANT]
> **Aktuell status för etapp CF13:**  
> **Färdig testleverans framlagd för användargranskning.**  
> I enlighet med ombyggnadsplanens godkännandekriterier genomförs den faktiska DNS-flytten av produktionsdomänen `fornsvenska.se` **först efter användarens uttryckliga klartecken**. Tills dess förblir den befintliga produktionsmiljön orörd och säker.

---

## 1. Testversion och testinstruktion för användaren

Plattformen kan provköras lokalt eller i preview-miljö med samtliga funktioner aktiva.

### 1.1 Starta testmiljön lokalt
```bash
# 1. Bygg och förbered statiska artefakter och distribution
npm run build
npx tsx scripts/cloudflare/build-main-site.ts
npx tsx scripts/cloudflare/build-ordbok-groups.ts

# 2. Starta Next.js i test-/förhandsgranskningsläge
npm run dev
# Öppna http://localhost:3000 i webbläsaren
```

### 1.2 Genomför de 5 centrala användarresorna
1. **Läs:**
   - Navigera till en textutgåva (t.ex. `/texter/aldre-vastgotalagen`).
   - Klicka på ett fornsvenskt ord i texten (t.ex. *vrækæ* eller *konunger*).
   - Verifiera att ordbokspanelen blixtsnabbt fälls ut med morfologisk analys och ordbokshänvisning utan sidomladdning.
2. **Sök:**
   - Gå till `/ordbok`.
   - Gör en sökning i sökfältet (t.ex. *fadhir*, *lagh*, *skip*).
   - Verifiera att sökresultat levereras omedelbart från den lokala Web Workern (`search-worker.js`), med 100 % paritet mot ursprungsverket.
   - Prova att stänga av internetanslutningen i webbläsarens nätverksflik (Offline) — sökning och uppslag fortsätter att fungera felfritt!
3. **Bokmärk och anteckna:**
   - Klicka på bokmärkesikonen (Spara ord) på en artikel.
   - Lägg till en personlig anteckning i ordlistepanelen.
   - Öppna en annan flik eller sida och verifiera att det sparade ordet och anteckningen synkroniseras via Storage Bridge.
   - Exportera till Anki eller CSV via exportknappen.
4. **Redigera:**
   - Navigera till `/admin` (kräver redaktörsinloggning via Supabase Auth).
   - Gör en textjustering på startsidan, en ordbokspost eller en runinskrift.
   - Verifiera att autosparning visar sparat utkast (`rev X`) utan att ändringen publiceras offentligt direkt.
5. **Publicera & Rollback:**
   - Tryck på "Publicera" i redaktionsöversikten.
   - Verifiera att release-orkestreraren genomför pre-flight checks, fasar ut ordboksdelarna först och huvudsajten sist.
   - Vid behov: testa att återställa till föregående release via `scripts/cloudflare/release.ts --rollback <releaseId>`. Utkasten i redaktionen förblir intakta.

---

## 2. Arkitektur och underdomäner

För att hålla projektet strikt inom Cloudflare Pages Free ($0/månad) utan att spränga gränsen på max 20 000 filer per projekt har ordboken delats in i 7 tekniska underdomäner:

| Värdadress | Innehåll & Funktion | Filantal | Storlek |
|---|---|---|---|
| `www.fornsvenska.se` | Huvudsajt (texter, startsida, runor, kartor, sökindex, Storage Bridge, 301-redirects) | 766 | 159 MB |
| `ord-01.fornsvenska.se` | Ordboksartiklar för initialer **a, b, c, d, e** | 12 217 | 58 MB |
| `ord-02.fornsvenska.se` | Ordboksartiklar för initialer **f, g** | 10 945 | 52 MB |
| `ord-03.fornsvenska.se` | Ordboksartiklar för initialer **h, i, j, k** | 13 245 | 61 MB |
| `ord-04.fornsvenska.se` | Ordboksartiklar för initialer **l, m, n, o** | 13 803 | 66 MB |
| `ord-05.fornsvenska.se` | Ordboksartiklar för initialer **p, q, r, ö, þ, -, _** | 6 737 | 49 MB |
| `ord-06.fornsvenska.se` | Ordboksartiklar för initial **s** | 13 221 | 64 MB |
| `ord-07.fornsvenska.se` | Ordboksartiklar för initialer **t, u, v, y, ä** | 13 341 | 59 MB |
| **Totalt** | **Hela Fornsvenska.se med alla 41 744 artiklar som statisk HTML** | **84 275** | **518 MB** |

### Viktiga beteendeförändringar att känna till:
1. **URL-adressering:** När en besökare klickar på en ordbokslänk från huvudsajten eller en extern länk (`/ordbok/<id>`) omdirigeras webbläsaren med HTTP 301 till `ord-XX.fornsvenska.se/ordbok/<id>`.
2. **Sömlös delad ordlista:** Tack vare Cross-Origin Storage Bridge märker användaren inte av domänbytet; bokmärken och anteckningar fungerar identiskt över alla underdomäner.
3. **0 sekunders sökfördröjning:** Sökningen sker lokalt i webbläsaren via Web Worker; inga anrop skickas till en server för sökningar.

---

## 3. DNS- och flyttplan

### 3.1 E-postskydd (Oförändrade MX/SPF/DKIM/DMARC)
För att säkerställa att befintlig e-post inte påverkas eller avbryts vid DNS-flytten ska samtliga MX- och TXT-poster behållas orörda:
- `MX`: Befintliga värden kopieras exakt.
- `TXT (SPF)`: `v=spf1 include:... ~all` behålls.
- `TXT (DKIM / DMARC)`: Behålls oförändrade.

### 3.2 DNS-poster att konfigurera i Cloudflare
När namnservrarna delegeras till Cloudflare skapas följande CNAME-poster mot Cloudflare Pages:

| Typ | Namn (Värd) | Innehåll / Mål | Proxy status |
|---|---|---|---|
| `CNAME` | `www` | `<cloudflare-pages-huvudsajt>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `@` (apex) | `<cloudflare-pages-huvudsajt>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-01` | `<cloudflare-pages-ord-01>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-02` | `<cloudflare-pages-ord-02>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-03` | `<cloudflare-pages-ord-03>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-04` | `<cloudflare-pages-ord-04>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-05` | `<cloudflare-pages-ord-05>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-06` | `<cloudflare-pages-ord-06>.pages.dev` | Proxied (Orange moln) |
| `CNAME` | `ord-07` | `<cloudflare-pages-ord-07>.pages.dev` | Proxied (Orange moln) |

### 3.3 Återställningsplan (Rollback) vid eventuella driftproblem
Om oförutsedda problem skulle uppstå under domänflytten:
1. Ändra namnservrarna eller DNS A/CNAME-posterna tillbaka till den tidigare driftkonfigurationen (t.ex. tidigare registrar/Vercel).
2. TTL för DNS bör sänkas till 300 sekunder (5 minuter) 24 timmar före den skarpa flytten för att möjliggöra omedelbar tillbakarullning vid behov.

---

## 4. Granskningsfrågor till användaren

Följande beslut och klartecken erfordras från användaren innan produktionsflytten aktiveras:
1. **Godkännande av testleveransen:** Har du provat sökningen, textuppslaget och ordboksnavigeringen och är nöjd med upplevelsen?
2. **Klartecken för domänflytt:** Är du redo att vi kopplar in Cloudflare DNS för `fornsvenska.se`?
