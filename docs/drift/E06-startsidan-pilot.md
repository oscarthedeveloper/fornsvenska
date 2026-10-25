# E06 – Pilotoptimering: Startsidan (`/`)

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md), [`E02`](./E02-besokarresor-fore-andring.md), [`E03`](./E03-routematris-och-cachehinder.md), [`E04`](./E04-separation-av-session-och-layout.md), [`E05`](./E05-saker-offentlig-datalasning.md)

---

## 1. Mål och genomförande

Som första pilot för att minska serverfunktionsanropen på Netlify optimerades webbplatsens mest besökta sida — Startsidan (`/`).

### Åtgärd:
1. I [`app/page.tsx`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/app/page.tsx):
   - Tog bort `export const dynamic = "force-dynamic"`.
   - Införde `export const revalidate = 86400` (inkrementell statisk återvalidering var 24:e timme eller omedelbart on-demand vid sparning).
2. Säkrades av tidigare etapper:
   - **E04:** Rotlayouten frikopplad från sessioner (`cookies()` anropas inte).
   - **E05:** `hamtaStartinnehall()` i [`lib/sidor.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/sidor.ts) använder `skapaPublikServerKlient()`.
   - **Aktualitetsgaranti:** När en administratör redigerar startsidans text anropar [`lib/sidActions.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/sidActions.ts) `revalidatePath("/")`, vilket omedelbart rensar cachen on-demand så att nytt innehåll publiceras direkt.

---

## 2. Före/Efter-mätning

Mätning utförd mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`):

| Metrik | Före pilot (E02) | Efter pilot (E06) | Förbättring / Förändring |
|---|---|---|---|
| **Next.js byggklassificering** | `ƒ Dynamic` (Serverfunktion) | `○ Static` (Förrenderad) | **Från dynamisk till statisk** |
| **HTML Serverstatus** | `DYNAMIC` | `CACHED (HIT)` | **Serverfunktion eliminerad** |
| **HTML Cache-Control** | `private, no-cache, no-store, max-age=0` | `s-maxage=86400, stale-while-revalidate` | **Återanvänds på CDN** |
| **HTML Svarstid (median)** | 10.5 ms | **2.6 ms** | **75 % snabbare svarstid** |
| **RSC Prefetch Status** | `DYNAMIC` | `CACHED (HIT)` | **Prefetch-serveranrop eliminerat** |
| **RSC Prefetch Cache-Control** | `private, no-cache, no-store, max-age=0` | `s-maxage=86400, stale-while-revalidate` | **Återanvänds på CDN** |
| **RSC Svarstid (median)** | 4.7 ms | **1.8 ms** | **62 % snabbare prefetch** |
| **Netlify-funktionsanrop (varma besök)** | 2 anrop per besök (HTML + RSC) | **0 anrop** | **100 % minskning av serverfunktionsanrop!** |

---

## 3. Grindverifiering (E06)

- **Buildrapport och verkliga svar visar avsedd rendering:** Verifierat. Bygget genererar `○ /` som statisk sida. HTTP-svaren från produktionsservern returnerar `x-nextjs-cache: HIT` och `Cache-Control: s-maxage=86400, stale-while-revalidate`.
- **Upprepade varma besök ger tydlig minskning av serverkörningar:** Verifierat. Varma besök och förhandsladdningar servas direkt från Next.js / CDN-cache utan att trigga serverfunktion.
- **Ingen visuell eller funktionell regression:** Verifierat. Typsnitt (Newsreader och Martian Mono), layout, navigation till Texter, Grammatik, Resurser, Ordbok och Runor samt redigerarens inline-funktionalitet är 100 % intakta.
- **Aktualitetskrav uppfyllt:** Vid redigering anropar `lib/sidActions.ts` `revalidatePath('/')`, vilket rensar cachen on-demand.
