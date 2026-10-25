# E08 – Resursbibliotek och PDF-läsning

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md), [`E02`](./E02-besokarresor-fore-andring.md), [`E03`](./E03-routematris-och-cachehinder.md), [`E04`](./E04-separation-av-session-och-layout.md), [`E05`](./E05-saker-offentlig-datalasning.md), [`E06`](./E06-startsidan-pilot.md), [`E07`](./E07-texter-och-grammatik.md)

---

## 1. Mål och genomförande

Resursbiblioteket (`/resurser`) och Västgötalagens digitala bokvy (`/resurser/vastgotalagen`) erbjuder katalog och läsning av medeltida källor, ordböcker, grammatikor och avhandlingar. Före denna etapp tvingades `/resurser` att renderas dynamiskt vid varje besök via `export const dynamic = "force-dynamic"`.

### Genomförda åtgärder:

1. **Statisk förgenerering och ISR för Resursbiblioteket ([`app/resurser/page.tsx`](../../app/resurser/page.tsx)):**
   - Ersatte `export const dynamic = "force-dynamic"` med `export const revalidate = 86400` (24 timmar inkrementell statisk återvalidering med omedelbar on-demand revalidering vid redigering).
   - Byggklassificering för `/resurser` ändrades från `ƒ Dynamic` till `○ Static`.
   - Initial data laddas via `hamtaBibliotek()` i [`lib/resurser.ts`](../../lib/resurser.ts) som använder `skapaPublikServerKlient()` (framtagen i E05) och filtrerar på `utkast = false`.

2. **Omedelbar on-demand revalidering vid redaktionella ändringar:**
   - Samtliga mutationsfunktioner i [`lib/resursActions.ts`](../../lib/resursActions.ts) (`skapaHylla`, `sparaHylla`, `taBortHylla`, `skapaResurs`, `sparaResurs`, `taBortResurs`, `flyttaHylla`, `flyttaResurs`) anropar `revalidatePath("/resurser")`.
   - När en administratör sparar en ändring, flyttar eller skapar en resurs invalideras ISR-cachen omedelbart on-demand på servern.

3. **Statiska PDF-tillgångar och Range Requests:**
   - Verifierade att stora dokument (såsom `public/bocker/vastgotalagen/vastgotalagen-maskintext.pdf`, 330 kB) och sidbilder i `public/` servas direkt som statiska filer på CDN-nivå.
   - Verifierade med HTTP `Range: bytes=0-1023` att webbservern och CDN stöder `206 Partial Content` och `Accept-Ranges: bytes`, vilket möjliggör för webbläsare och PDF-visare att strömma sidor utan att förladda hela filen.

---

## 2. Före/Efter-mätning

Mätning utförd mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`) via mätskriptet ([`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts)):

### Resa 3: Resurssökning → Bok/PDF-visning

| Steg & Resurs | Status före (E02) | Status efter (E08) | Cache-Control efter | Serverfunktionsanrop (varma) |
|---|---|---|---|---|
| **Resurser (HTML)** | `DYNAMIC` (26.0 ms) | `CACHED (HIT)` (8.6 ms) | `s-maxage=86400, stale-while-revalidate` | 0 |
| **Resurser (RSC)** | `DYNAMIC` (15.6 ms) | `CACHED (HIT)` (4.9 ms) | `s-maxage=86400, stale-while-revalidate` | 0 |
| **Västgötalagen PDF-läsare (HTML)** | `CACHED (HIT)` (2.2 ms) | `CACHED (HIT)` (2.6 ms) | `s-maxage=31536000, stale-while-revalidate` | 0 |
| **Västgötalagen PDF-läsare (RSC)** | `CACHED (HIT)` (1.7 ms) | `CACHED (HIT)` (2.1 ms) | `s-maxage=31536000, stale-while-revalidate` | 0 |
| **Summa serveranrop per session** | **2 anrop** | **0 anrop** | - | **100 % minskning!** |

---

## 3. Grindverifiering (E08)

- **Filtrering och sökning är lika snabb:** Verifierat. All sökning och typfiltrering i [`components/resurser/ResursBibliotek.tsx`](../../components/resurser/ResursBibliotek.tsx) sker momentant i minnet på klientsidan.
- **Hash-länkar fungerar:** Direktlänkar med hash (t.ex. `/resurser#kalla-id`) läses av via `window.location.hash` och öppnar motsvarande resurs direkt.
- **Bok öppnas på rätt ställe och PDF-behavior intakt:** Verifierat. [`components/resurser/Boklasare.tsx`](../../components/resurser/Boklasare.tsx) öppnar bokvy, kapitelnavigering och uppslag korrekt.
- **PDF Range Requests godkända:** Begäran om `Range: bytes=0-1023` mot `/bocker/vastgotalagen/vastgotalagen-maskintext.pdf` returnerar `206 Partial Content` med `Content-Range: bytes 0-1023/330564`.
- **Ingen onödig förladdning av PDF-filer:** Endast sidbilder och metadata laddas; själva PDF:en laddas endast när användaren aktivt begär den.
