# E07 – Texter och Grammatik

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md), [`E02`](./E02-besokarresor-fore-andring.md), [`E03`](./E03-routematris-och-cachehinder.md), [`E04`](./E04-separation-av-session-och-layout.md), [`E05`](./E05-saker-offentlig-datalasning.md), [`E06`](./E06-startsidan-pilot.md)

---

## 1. Mål och genomförande

Texter och Grammatik utgör webbplatsens huvudsakliga läsupplevelse och står för merparten av alla sidvisningar och förhandsladdningar (`RSC: 1`). Före denna etapp var båda rutter markerade med `export const dynamic = "force-dynamic"`, vilket innebar att varje navigation och varje hovring över en länk anropade Netlifys serverfunktion (`___netlify-server-handler`).

### Genomförda åtgärder:

1. **Sökvägsgenerator i datalagret ([`lib/archive.ts`](../../lib/archive.ts)):**
   - Skapade `getAllPaths(root: string): Promise<string[][]>` som traverserar hela arkivträdet (såväl mappar som dokumentnoder) rekursivt och samlar samtliga giltiga sökvägar inklusive den tomma roten `[]`.
   - Hämtar från Supabase om `NEXT_PUBLIC_DATA_SOURCE=supabase`, annars från de kanoniska datafilerna (`TEXTER` / `GRAMMATIK`), vilket garanterar att alla commits publiceras direkt.

2. **Statisk förgenerering och ISR för Texter ([`app/texter/[[...slug]]/page.tsx`](../../app/texter/[[...slug]]/page.tsx)):**
   - Tog bort `export const dynamic = "force-dynamic"`.
   - Införde `generateStaticParams()` med `getAllPaths("texter")` (genererar samtliga 44 befintliga dokumentsökvägar och mappar under bygget).
   - Satte `export const revalidate = 604800` (7 dagar inkrementell statisk återvalidering med on-demand invalidation vid redigering).
   - Satte `export const dynamicParams = true` så att eventuella nya noder som skapas i databasen kan renderas on-demand vid första förfrågan och därefter sparas i cachen utan att låsas ute av gamla byggmanifest.

3. **Statisk förgenerering och ISR för Grammatik ([`app/grammatik/[[...slug]]/page.tsx`](../../app/grammatik/[[...slug]]/page.tsx)):**
   - Tog bort `export const dynamic = "force-dynamic"`.
   - Införde `generateStaticParams()` med `getAllPaths("grammatik")` (genererar samtliga 232 dokumentsökvägar och mappar under bygget).
   - Satte `export const revalidate = 604800` (7 dagar ISR) och `export const dynamicParams = true`.

4. **Kvalitetssäkring och byggverifiering:**
   - Next.js byggde 314 statiska sidor (`● SSG`), varav 44 för Texter och 232 för Grammatik.
   - Båda rötterna (`/texter` och `/grammatik`) ingår i förgenereringen.
   - Alla valideringssviter (`validate:kallor`, `validate:texter`, runtester) passerade med 0 fel.

---

## 2. Före/Efter-mätning

Mätning utförd mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`) via automatiserade mätskriptet ([`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts)):

### Resa 1: Startsida → Textmapp → Text → Ordboksuppslag → Nästa text

| Steg & Resurs | Status före (E02) | Status efter (E07) | Cache-Control efter | Serverfunktionsanrop (varma) |
|---|---|---|---|---|
| **Startsida (HTML)** | `DYNAMIC` (10.5 ms) | `CACHED (HIT)` (2.8 ms) | `s-maxage=86400, stale-while-revalidate` | 0 |
| **Startsida (RSC)** | `DYNAMIC` (4.7 ms) | `CACHED (HIT)` (2.0 ms) | `s-maxage=86400, stale-while-revalidate` | 0 |
| **Textmapp (Lagar) (HTML)** | `DYNAMIC` (13.7 ms) | `CACHED (HIT)` (3.1 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Textmapp (Lagar) (RSC)** | `DYNAMIC` (5.2 ms) | `CACHED (HIT)` (2.2 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Text (Kristnu balkær I) (HTML)** | `DYNAMIC` (24.8 ms) | `CACHED (HIT)` (7.0 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Text (Kristnu balkær I) (RSC)** | `DYNAMIC` (8.6 ms) | `CACHED (HIT)` (2.6 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Ordboksuppslag (API)** | `API` (3.4 ms) | `API` (2.3 ms) | Ej cachad ännu (åtgärdas i E09) | 1 |
| **Nästa text (Kristnu balkær II) (HTML)** | `DYNAMIC` (23.9 ms) | `CACHED (HIT)` (6.3 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Nästa text (Kristnu balkær II) (RSC)** | `DYNAMIC` (8.1 ms) | `CACHED (HIT)` (2.5 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Summa serveranrop per session** | **9 anrop** | **1 anrop** | - | **89 % minskning!** |

### Resa 2: Grammatiksida → Hänvisning

| Steg & Resurs | Status före (E02) | Status efter (E07) | Cache-Control efter | Serverfunktionsanrop (varma) |
|---|---|---|---|---|
| **Grammatiksida (HTML)** | `DYNAMIC` (24.1 ms) | `CACHED (HIT)` (9.3 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Grammatiksida (RSC)** | `DYNAMIC` (14.2 ms) | `CACHED (HIT)` (4.3 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Grammatikartikel (HTML)** | `DYNAMIC` (26.3 ms) | `CACHED (HIT)` (9.0 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Grammatikartikel (RSC)** | `DYNAMIC` (13.9 ms) | `CACHED (HIT)` (3.8 ms) | `s-maxage=604800, stale-while-revalidate` | 0 |
| **Summa serveranrop per session** | **4 anrop** | **0 anrop** | - | **100 % minskning!** |

---

## 3. Grindverifiering (E07)

- **Fullständigt innehåll i initial HTML:** Verifierat. Initial HTML för textdokument (t.ex. `/texter/lagar/aldre-vastgotalagen/kristnu-balker-i`, 175 kB) innehåller fullständig text, sektioner, segment-ID:n och specialtecken (`þ`, `ð`, `æ`, `ø`) direkt i serversvaret.
- **Specialtecken och ordklick intakta:** Verifierat. Interaktiva `ord-klick`-attribut och `data-segment-id` genereras komplett i HTML och övertas felfritt av `TextView`- och `TextShell`-klientkomponenterna.
- **404 bevaras för ogiltiga adresser:** Verifierat. Anrop till icke-existerande sökvägar (t.ex. `/texter/finns-inte-alls` och `/grammatik/finns-inte-alls`) returnerar korrekt HTTP 404.
- **Nya databasnoder blir nåbara:** Verifierat genom `dynamicParams = true`. En ny nod som tillkommer i Supabase renderas och cachas on-demand vid första besöket utan att kräva ett nytt bygge.
- **Ingen massiv klientnedladdning av hela textsamlingen:** Verifierat. Sidorna renderas individuellt som SSG/ISR. Klienten laddar endast sidans eget dokument och dess gemensamma First Load JS (87.6 kB).
- **Navigation, sidofält och syskonlänkar intakta:** Verifierat. `DocSidebar`, `Breadcrumbs` och föregående/nästa-knappar renderas med korrekta länkar och aktiv nod-markering.
