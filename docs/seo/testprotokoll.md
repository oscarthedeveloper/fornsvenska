# Testprotokoll: Teknisk slutkontroll för Google-sök och SEO (S16)

Datum: 2026-10-25  
Testmiljö: Node.js `v24.21.0`, Next.js `14.2.5` i lokalt produktionsläge (`next build && next start -p 3009`)  
Referens: [`docs/seo/GOOGLE_GENOMFORANDEPLAN.md`](./GOOGLE_GENOMFORANDEPLAN.md)

---

## 1. Sammanfattning av testresultat

| Testområde | Kommando / Kontrollpunkt | Resultat | Anmärkning |
|---|---|---|---|
| **TypeScript-validering** | `npx tsc --noEmit` | **Pass (0 fel)** | Samtliga nya metadata- och sitemapmoduler strikt typkontrollerade. |
| **Källkornsvalidering** | `npm run validate:kallor` | **Pass (0 fel)** | 39 verk, 54 filer, 193 grammatikdokument godkända. |
| **Textarkivsvalidering** | `npm run validate:texter` | **Pass (0 fel)** | 35 dokument, 159 sektioner, 377 meningar godkända. |
| **Text-regressionssvit** | `npx tsx --test tests/validate-texter.test.mjs` | **Pass (6/6 tester)** | Positiva och negativa testfall för textintegritet. |
| **Run-kontraktssvit** | `npx tsx --test tests/runor-contract.test.mjs` | **Pass (8/8 tester)** | Avgränsning av kandidat-/utkastmaterial. |
| **SEO-kontraktssvit** | `npx tsx --test tests/seo-contract.test.mjs` | **Pass (4/4 tester)** | Verifierar 280 kanoniska sidor, 41 744 ordboksposter i 2 delkartor samt JSON-LD. |
| **Produktionsbygge** | `npm run build` | **Pass (Exit code 0)** | 315 statiska sidor och XML-kartor förgenererade. |

---

## 2. Verifiering av robots.txt och sitemaps

### 2.1 `/robots.txt`
```http
HTTP/1.1 200 OK
Content-Type: text/plain
```
Innehåll:
```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.fornsvenska.se/sitemap.xml
Sitemap: https://www.fornsvenska.se/sitemap/0.xml
Sitemap: https://www.fornsvenska.se/sitemap/1.xml
Sitemap: https://www.fornsvenska.se/sitemap/2.xml
```

### 2.2 Sitemap Index och delkartor
- **`/sitemap.xml`:** Giltigt `<sitemapindex>` med referenser till `/sitemap/0.xml`, `/sitemap/1.xml`, `/sitemap/2.xml`.
- **`/sitemap/0.xml`:** Exakt **280 kanoniska redaktionella URL:er** (startsida, 232 grammatiksidor, 44 textsidor, 2 resurssidor, 1 ordbokssida). Cache-status: `HIT` (statiskt förgenererad).
- **`/sitemap/1.xml`:** **25 000 ordboksposter** (delkarta 1).
- **`/sitemap/2.xml`:** **16 744 ordboksposter** (delkarta 2).
- **Totalt antal adresser:** **42 024 unika, kanoniska adresser** deklarerade för Google Search Console utan överskridande av protokollgränserna (50 000 URL / 50 MB).

---

## 3. Matris över representativa URL:er (HTTP 200 / Headers)

| URL / Rutt | Status | Title | Description | Canonical |
|---|---|---|---|---|
| `/` | 200 | Fornsvenska – texter, ordbok och grammatik \| Fornsvenska.se | Språkhistorisk studieplattform för fornsvenska… | `https://www.fornsvenska.se` |
| `/grammatik` | 200 | Fornsvensk grammatik — ljudlära, böjningslära och syntax \| Fornsvenska.se | Systematisk grammatik över fornsvenskan i 193 artiklar… | `https://www.fornsvenska.se/grammatik` |
| `/grammatik/substantiv` | 200 | Substantiv — Grammatik \| Fornsvenska.se | Genus, numerus, kasus, species och stamklasser… | `https://www.fornsvenska.se/grammatik/substantiv` |
| `/grammatik/substantiv/fyrkasussystemet/nominativ` | 200 | Nominativ – Subjekt, subjektivt predikativ och tilltalsform \| Fornsvenska.se | Nominativ är det grammatiska grundkasuset i fornsvenskan… | `https://www.fornsvenska.se/grammatik/substantiv/fyrkasussystemet/nominativ` |
| `/texter` | 200 | Fornsvenska textarkivet — lagar, urkunder och runinskrifter \| Fornsvenska.se | Källkritiska utgåvor av fornsvenska texter med diplomatisk text… | `https://www.fornsvenska.se/texter` |
| `/texter/lagar/aldre-vastgotalagen` | 200 | Äldre Västgötalagen — Texter \| Fornsvenska.se | Cod. Holm. B 59. Källkritiska fornsvenska utgåvor… | `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen` |
| `/texter/lagar/aldre-vastgotalagen/kristnu-balker-i` | 200 | Kristnu balkær, del I – Äldre Västgötalagen, inledningen och dopet (Cod. Holm. B 59) \| Fornsvenska.se | Balkens inledning fastslår den kristna trons och kyrkans primat… | `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen/kristnu-balker-i` |
| `/resurser` | 200 | Resursbibliotek — litteratur och skrifter \| Fornsvenska.se | Läroböcker, examensarbeten, avhandlingar och medeltida skrifter… | `https://www.fornsvenska.se/resurser` |
| `/resurser/vastgotalagen` | 200 | Äldre Västgötalagen — bokvy \| Fornsvenska.se | Läs hela Äldre Västgötalagen i maskintext, uppslag för uppslag… | `https://www.fornsvenska.se/resurser/vastgotalagen` |
| `/ordbok` | 200 | Ordbok — Söderwalls fornsvenska ordbok \| Fornsvenska.se | Sökbar utgåva av K. F. Söderwalls Ordbok… | `https://www.fornsvenska.se/ordbok` |
| `/ordbok/soederwall--bonde-nn.1` | 200 | bonde (1) — Söderwalls huvudverk \| Fornsvenska.se | Fri jordbrukare och hemmansägare med fulla medborgerliga rättigheter… | `https://www.fornsvenska.se/ordbok/soederwall--bonde-nn.1` |

---

## 4. Negativa testfall

1. **Administration (`/admin`):**
   - HTML-meta innehåller explicit: `<meta name="robots" content="noindex, nofollow">`.
   - Google tillåts läsa sidan i `robots.txt` för att omedelbart avindexera den.
2. **Icke-existerande route (`/felaktig-slask-url`):**
   - Returnerar korrekt HTTP 404 och standardiserad 404-felsida.
3. **Alias (`/kallor`):**
   - Omdirigerar med permanent redirect (308/301) till `/resurser`. Exkluderad ur sitemap.
4. **Ej publicerat runmaterial (`/runor`):**
   - Exkluderat ur sitemap i enlighet med publiceringskontraktet.
