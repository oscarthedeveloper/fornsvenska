> Aktuell kontaktkonfiguration och verifierad e-postleverans: [2026-11-05](./KONTAKT-2026-11-05.md). Rapporten nedan beskriver tidigare lokala prototyper.

# CF10 – Kontakt, run-API, kartor och externa tillgångar

Datum: 2026-11-01. Status: **lokalt verifierad integration; kontaktvalidering, spamskydd, Resend-kvothantering, statiska run-API-exporter och extern tillgångsinventering bekräftade**.

---

## Sammanfattning och resultat

Etapp CF10 säkrar Fornsvenskas externa integrationer och API-kontrakt inom ramen för en kostnadsfri statisk hostingmodell:

1. **Kontaktfunktion och Resend:**
   - Serverhemlig API-nyckel (`RESEND_API_KEY`) via serverendpoint (`/api/kontakt`).
   - Flernivåspamskydd:
     - Dold honeypot (`bot-field`) med tyst avvisning av botar.
     - Tidsspärr: avvisar inskick snabbare än 1,5 sekunder (automatiserade skript).
     - Indatabegränsning: namn max 100 tecken, epost max 150 tecken, ämne max 200 tecken, meddelande max 5 000 tecken.
     - Frekvensbegränsning: max 5 inskick per timme per IP med HTTP 429 Too Many Requests.
   - Daglig kvotkontroll: stoppar utskick vid 100 mejl/dag i enlighet med Resends gratisgräns.
   - Säker test- och mockadapter: förhindrar att oavsiktliga mejl skickas under tester och lokal utveckling.
   - Felisolering: kontaktfel (500, 502, 503) isoleras och påverkar aldrig övriga routes.
2. **Run-API och statiska exporter:**
   - Versionsbundna statiska API-exporter genererade i `public/api/runor/v1/`:
     - `index.json` (79,5 KB): komplett kanonisk publicerad korpus.
     - `geojson.json` (19,7 KB): standardiserad GeoJSON-export enligt RFC 7946.
     - `versions/2026.1-pilot.json` (79,5 KB) och `versions/2026.2-batch1.json` (165,0 KB).
     - `inscriptions/[slug].json`: 20 självständiga statiska inskriftsfiler.
   - Fullständig bakåtkompatibilitet för parametrarna `format`, `placement`, `province`, `carrier`, `q`, `version`, slug, CORS och OPTIONS.
   - Publika besökare på kartan och katalogen gör **0 API-anrop** (använder lokala statiska data).
3. **Inventering av externa tillgångar och kartor:**
   - OpenStreetMap karttiles: standard on-demand inladdning med obligatorisk attribution och `tileerror`-fallback till tillgängligt listalternativ. Ingen otillåten massnedladdning eller scraping.
   - Bokfiler: 25 faksimilsidor och maskintextad PDF för *Äldre Västgötalagen* (Cod. Holm. B 59) serveras som fria statiska filer under Public Domain.
   - Runbilder: 41 WebP-filer i `public/images/runor/` inom prestandabudgeten (tumnaglar <= 150 KiB, fullstora <= 300 KiB) med full källattribution.
   - Typsnitt: Newsreader och Martian Mono självhostade via Next.js (`next/font/google`) med noll externa anrop; Noto Sans Runic hämtas fritt via Google Fonts CDN.

---

## 1. Inventerings- och licensmatris för externa tillgångar

| Tillgång / Tjänst | Leverantör / Källa | Typ av resurs | Kostnad & Kvot | Attribution & Licens | Återpublicering & Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kartunderlag (Tiles)** | OpenStreetMap (OSM) | Raster-tiles (`tile.openstreetmap.org/{z}/{x}/{y}.png`) | $0 (Ingen API-nyckel). Följer OSM Tile Usage Policy. | `© OpenStreetMap bidragsgivare` länkad till copyright-sida | Tillåtet för webbvisning; massnedladdning förbjuden. Fallback till tillgänglig lista finns. |
| **E-post / Kontakt** | Resend | Transaktionell e-post via HTTPS API | $0 (Free tier: max 100 mejl/dag, 3 000/mån) | Serverhemlig nyckel; mottagare konfigurerad i miljövariabel | Skyddad med rate limiting (5/h), kvotspärr (100/dag) och mockadapter i test. |
| **Runbilder & planscher** | RAÄ KulturNav & Kungl. Vitterhetsakademien | WebP-bilder i `public/images/runor/` | $0 (Statiskt på Cloudflare Pages edge) | CC-BY (RAÄ) / Public Domain (SRI planscher) | Alla bilder kuraterade och optimerade (< 150 KiB för tumnaglar). |
| **Bokfaksimil & PDF** | Kungliga biblioteket (Cod. Holm. B 59) | 25 PNG-sidor & PDF i `public/bocker/vastgotalagen/` | $0 (Statiskt på Cloudflare Pages edge, ~10 MB) | Public Domain (kulturarv utan upphovsrättsligt skydd) | Fri återpublicering utan användningsbegränsning. |
| **Typsnitt: Antikva & Mono** | Google Fonts (Newsreader, Martian Mono) | WOFF2-filer inbäddade vid byggtid | $0 (0 externa anrop i produktion) | SIL Open Font License 1.1 | Självhostat lokalt av Next.js byggmotor. |
| **Typsnitt: Runor** | Google Fonts (Noto Sans Runic) | CSS & WOFF2 för fornnordiska/medeltida runor | $0 (Hämtas via Google Fonts CDN) | SIL Open Font License 1.1 | Föransluten med `preconnect` i sidhuvudet. |
| **Supabase Storage** | Supabase Free tier | Eventuella resursomslag via public URL | $0 (Free tier: 1 GB lagring, 2 GB egress) | Eget administrativt material | Vid saknad bild renderas rent typografiskt standardomslag utan nätverksanrop. |

---

## 2. Kvarvarande externa anrop och kvoter

Vid normal anonym läsning och sökning på webbplatsen görs:
* **0 anrop** till Cloudflare Workers
* **0 anrop** till Supabase DB / Auth
* **0 anrop** till Resend API
* **Endast webbläsaranrop för kartvisning:** När en användare öppnar Runsidans interaktiva karta hämtas kartrutor on-demand från OpenStreetMap. Om nätverket är offline eller kartleverantören blockeras fångas felet av `tileerror` och användaren kan läsa hela korpusen via den likvärdiga listan (WCAG AA).
* **Endast vid aktiv kontakt:** När en besökare skickar ett meddelande i formuläret på `/kontakt` anropas `/api/kontakt`, som skyddas mot missbruk av frekvensbegränsning (5/h per IP) och kvotkontroll (max 100/dag).

---

## 3. Testresultat och verifiering

Samtliga krav har verifierats med automatiserade enhetstester i [`tests/cloudflare-cf10.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf10.test.mjs):

1. **Kontaktvalidering:** Godkänner korrekta meddelanden; avvisar tom e-post, ogiltiga format och överlånga inmatningar med HTTP 400.
2. **Spamskydd & tidsspärr:** Honeypot fångar botar tyst; inlämningar snabbare än 1,5 sekunder avvisas med HTTP 400; fler än 5 anrop per timme spärras med HTTP 429.
3. **Kvotkontroll:** Utskick stoppas med HTTP 429 när 100 meddelanden uppnåtts under samma dag.
4. **Statiska run-API-exporter:** `index.json`, `geojson.json`, versionsfiler och samtliga 20 inskrifter genereras och valideras.
5. **Bakåtkompatibilitet:** Dynamiska parametrar (`format=geojson`, `placement`, `province`, `carrier`, `q`, slug, CORS och OPTIONS) fungerar identiskt med tidigare API-kontrakt.
6. **Tillgångsinventering & sekretess:** Kartattribution, bildstorleksbudgetar, bokfiler och total avsaknad av hårdkodade API-nycklar verifierade maskinellt.
7. **Regressionsprov:** Samtliga **202 tester** i repositoryt passerar utan anmärkning (`node --import tsx --test tests/*.test.mjs`).
8. **Typkontroll:** `npx tsc --noEmit` passerar felfritt med exit-kod 0.

---

## 4. Slutsats och nästa etapp

Etapp CF10 är **fullständigt implementerad och lokalt verifierad**.

* **Klar:** Kontakttjänst med spamskydd, frekvensbegränsning och kvotspärr; statiska run-API-exporter med full bakåtkompatibilitet; komplett tillgångsinventering.
* **Nästa etapp:** **CF11 – Byggkedja, samordnad release och återställning**.
