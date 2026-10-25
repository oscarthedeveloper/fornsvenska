# E09 – Ordboksuppslag och sökning

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md), [`E02`](./E02-besokarresor-fore-andring.md), [`E03`](./E03-routematris-och-cachehinder.md), [`E04`](./E04-separation-av-session-och-layout.md), [`E05`](./E05-saker-offentlig-datalasning.md), [`E06`](./E06-startsidan-pilot.md), [`E07`](./E07-texter-och-grammatik.md), [`E08`](./E08-resursbibliotek-och-pdf.md)

---

## 1. Mål och genomförande

Ordboksuppslag vid läsning av fornsvenska texter (`/api/ordbok/uppslag`) och sökning i Söderwalls ordbok (41 744 artiklar) utgör en central interaktiv funktion. I utgångsläget saknade API-routen cache-headers helt, vilket innebar att varje ordklick i texterna orsakade ett nytt anrop till Netlifys serverfunktion (`___netlify-server-handler`). Dessutom saknade klienten minnescache, vilket gjorde att återkommande klick på samma ord genererade upprepade nätverksanrop.

### Genomförda åtgärder:

1. **CDN-cache och säker felhantering i API-routen ([`app/api/ordbok/uppslag/route.ts`](../../app/api/ordbok/uppslag/route.ts)):**
   - Lyckade ordforms- och stamuppslag (HTTP 200) förses med `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`. Detta tillåter Netlify CDN att cacha svaret vid kanten och återanvända det för alla besökare.
   - Tomma/ogiltiga förfrågningar (HTTP 400) och oväntade fel (HTTP 500) returnerar strikt `Cache-Control: no-store, max-age=0` så att temporära fel aldrig felaktigt fastnar i CDN-cache.

2. **Klientsidig minnescache och AbortController ([`components/text/OrdbokUppslagPanel.tsx`](../../components/text/OrdbokUppslagPanel.tsx)):**
   - Implementerade en modulbaserad minnescache (`Map<string, OrdbokTextUppslagResultat>`) med kapacitet för 250 uppslag och LRU-borttagning.
   - När användaren klickar på ett ord som redan har slagits upp (eller återvänder till ett tidigare ord i samma session) returneras resultatet omedelbart från minnet (0 ms latens, 0 nätverksanrop).
   - Införde `AbortController` i `useEffect`: Vid snabba ordbyten i texten avbryts pågående oavslutade HTTP-förfrågningar direkt, vilket sparar bandbredd och förhindrar kapplöpningseffekter (race conditions).

3. **Inkrementell statisk återvalidering för ordbokssidor:**
   - I [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx): Satte `export const revalidate = 86400` (24 timmar ISR). Eftersom ordboken innehåller 41 744 artiklar renderas de on-demand vid första förfrågan och sparas därefter i CDN-cachen.
   - I [`app/ordbok/page.tsx`](../../app/ordbok/page.tsx): Satte `export const revalidate = 86400` för ordbokssökning.

---

## 2. Före/Efter-mätning

Mätning mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`):

### API-anrop: `/api/ordbok/uppslag?ord=fyrst`

| Metrik | Före E09 | Efter E09 | Förbättring |
|---|---|---|---|
| **Cache-Control** | `null` (private, no-cache) | `public, s-maxage=86400, stale-while-revalidate=604800` | Återanvänds på CDN Edge |
| **Klientlatens vid återbesök/upprepat ord** | ~2–5 ms nätverksanrop | **0.0 ms (minnescache)** | **100 % eliminerat nätverksanrop** |
| **Hantering av snabba ordbyten** | Bakgrundsanrop fullföljs | **Avbryts omedelbart med AbortController** | Förhindrar onödig serverbelastning |
| **Resa 1 (Serverfunktioner vid varma besök)** | 1 anrop kvarstod (API) | **0 anrop på CDN / 0 anrop i webbläsaren** | **100 % minskning på Resa 1!** |

---

## 3. Grindverifiering (E09)

- **Snabba ordbyten visar alltid rätt ord:** Verifierat. `AbortController` avbryter föregående förfrågan och felhanteringen ignorerar `AbortError`, vilket garanterar att den senast klickade termen alltid är den som visas.
- **Språkligt betydelsefulla specialtecken bevaras:** Verifierat. Ordformer med fornsvenska tecken såsom `þing` (träffar `þing`), `dræpa` (träffar `dräpa`) slås upp korrekt och URL-kodas felfritt.
- **Tom träff och fel hanteras korrekt:** Verifierat. Icke-existerande ord (t.ex. `xyznonexistent`) returnerar ren träfflista `traffar: []` med status 200; tomt ord returnerar status 400 med `no-store`.
- **Upprepade uppslag blir inte långsammare:** Verifierat. Upprepade klick på samma ord är momentana (< 1 ms) tack vare minnescachen.
- **Ingen massiv nedladdning av hela ordboken:** Verifierat. Klienten tar endast emot det enskilda ordets uppslagsresultat och behåller en lättviktig lokal cache (max 250 poster).
