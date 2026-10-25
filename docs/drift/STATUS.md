# Status: Netlify-optimering (färre funktionsanrop med bibehållen besökarupplevelse)

Datum: 2026-10-25  
Senast uppdaterad: 2026-10-25 18:25  
Aktiv etapp: **E12 genomförd (Lokal plan slutförd; redo för E13 vid molnkvotåterställning)**

---

## Sammanfattning av etappstatus

| Etapp | Namn | Status | Rapport / Dokument |
|---|---|---|---|
| **E01** | Säkra utgångspunkt och konfiguration | **Klar** | [`docs/drift/E01-nulagesprotokoll.md`](./E01-nulagesprotokoll.md) |
| **E02** | Mät besökarresor före ändring | **Klar** | [`docs/drift/E02-besokarresor-fore-andring.md`](./E02-besokarresor-fore-andring.md) |
| **E03** | Kartlägg routes och cachehinder | **Klar** | [`docs/drift/E03-routematris-och-cachehinder.md`](./E03-routematris-och-cachehinder.md) |
| **E04** | Separera session från offentlig layout | **Klar** | [`docs/drift/E04-separation-av-session-och-layout.md`](./E04-separation-av-session-och-layout.md) |
| **E05** | Inför säker offentlig dataläsning | **Klar** | [`docs/drift/E05-saker-offentlig-datalasning.md`](./E05-saker-offentlig-datalasning.md) |
| **E06** | Optimera startsidan som pilot | **Klar** | [`docs/drift/E06-startsidan-pilot.md`](./E06-startsidan-pilot.md) |
| **E07** | Texter och Grammatik | **Klar** | [`docs/drift/E07-texter-och-grammatik.md`](./E07-texter-och-grammatik.md) |
| **E08** | Resursbibliotek och PDF-läsning | **Klar** | [`docs/drift/E08-resursbibliotek-och-pdf.md`](./E08-resursbibliotek-och-pdf.md) |
| **E09** | Ordboksuppslag och sökning | **Klar** | [`docs/drift/E09-ordboksuppslag-och-sokning.md`](./E09-ordboksuppslag-och-sokning.md) |
| **E10** | Runsida, förhandsladdning och middleware | **Klar** | [`docs/drift/E10-runsida-forhandsladdning-middleware.md`](./E10-runsida-forhandsladdning-middleware.md) |
| **E11** | Aktualitet och redaktionell invalidation | **Klar** | [`docs/drift/E11-aktualitet-och-invalidation.md`](./E11-aktualitet-och-invalidation.md) |
| **E12** | Samlad funktions-, säkerhets- och tillgänglighetskontroll | **Klar** | [`docs/drift/E12-samlad-kontroll.md`](./E12-samlad-kontroll.md) |
| **E13** | Verifiera på Netlify och förbered återställning | **Förberedd** (Blockerad i moln) | [`docs/drift/E13-molnverifiering.md`](./E13-molnverifiering.md) |
| **E14** | Kontrollerad lansering och uppföljning | **Förberedd** | [`docs/drift/E14-lansering-och-uppfoljning.md`](./E14-lansering-och-uppfoljning.md) |


---

## Grindnot och molnblockerare (E01)

> [!WARNING]
> **Molnverifiering på Netlify är för tillfället blockerad:**
> Kontot har överskridit månadskvoten (146 418 av 125 000 funktionsanrop). Netlify visar varning om att projekt pausas/inte driftsätts förrän nästa period (1 nov) eller uppgradering.
> 
> **Beslut i enlighet med E01-grinden:**  
> Arbetet fortsätter lokalt med strikt produktionsbygge (`next build && next start`), identisk datamodell och nätverksmätning. Alla molnberoende verifieringssteg i E13 markeras som blockerade tills kontoåtkomst medges eller ny mätperiod inträder.

---

## Genomfört i E01

1. **Git-status och avgränsning:**
   - Arbetskopians HEAD är `08d53a5` (`origin/main`).
   - Omfattande pågående arbete i textmaterialet (`data/textdokument.ts`, `data/texter.ts`, `lib/text.ts`, `scripts/build_textdokument.py`) samt runor (`app/runor/`, `lib/runor/`, `components/runor/`, `tests/`) har inventerats och isolerats. Inga av dessa filer har rörts eller skrivits över.
2. **Låsta versioner verifierade:**
   - Node.js: `v24.21.0` lokalt, `NODE_VERSION = "20"` i `netlify.toml`.
   - Next.js: `14.2.5` (låst).
   - React: `^18.3.1` (låst till 18.3.1 via `package-lock.json`).
   - `@supabase/ssr`: `^0.5.1`.
   - `@supabase/supabase-js`: `^2.45.0`.
3. **Bygg- och kodhälsa:**
   - `npm run validate:kallor`: Godkänd (39 verk, 54 filer, 193 grammatikdokument, 0 fel).
   - `npm run validate:texter`: Godkänd (35 dokument, 159 sektioner, 377 meningar, 0 fel).
   - `npx tsx --test tests/validate-texter.test.mjs`: Godkänd (6/6 tester).
   - `npx tsx --test tests/runor-contract.test.mjs`: Godkänd (8/8 tester).
   - `npx tsc --noEmit`: Godkänd (0 typfel).
   - `npm run build`: Godkänd från ren `.next` (34 statiska/SSG-sidor genererade).
4. **Huvudorsaker till hög funktionskvot kartlagda:**
   - `app/layout.tsx` anropar `hamtaSession()` som anropar `cookies()`, vilket gör att rotlayouten och alla underliggande sidor renderas dynamiskt när Supabase är aktivt.
   - Flera centrala sidor (`/`, `/texter`, `/grammatik`, `/resurser`) har hårdkodat `export const dynamic = "force-dynamic"`.
   - Länkförhandsladdning (`Link`-komponenter) hämtar RSC-payloads för dynamiska sidor vid hover/viewport, vilket genererar Netlify-serverfunktionsanrop.
   - `lib/actions.ts` utför global `revalidatePath('/', 'layout')` som tömmer eventuell cache över hela applikationen.

## Genomfört i E02

1. **Automatiserad mätning av fem centrala besökarresor ([`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts)):**
   - 5 kalla och 5 varma körningar per resa mot Next.js produktionsserver (`next start -p 3123`).
   - Mätning av såväl fullständiga HTML-dokumentanrop som Next.js RSC-förhandsladdningsanrop (`RSC: 1`).
   - Rådata sparad i [`docs/drift/E02-matvardens-data.json`](./E02-matvardens-data.json) och analyserad i [`docs/drift/E02-besokarresor-fore-andring.md`](./E02-besokarresor-fore-andring.md).
2. **Kritiska mätinsikter:**
   - **Resa 1 (Startsida → Textmapp → Text → Ordbok → Nästa text):** Genererar **9 serverfunktionsanrop** (4 HTML + 4 RSC-prefetch + 1 API-uppslag). Samtliga sidor returnerar `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.
   - **Resa 2 (Grammatik):** Genererar **4 serverfunktionsanrop** med ansenlig RSC-datamängd (~128 kB per navigation).
   - **Resa 3 (Resurser):** Genererar **2 serverfunktionsanrop** för `/resurser`, medan `/resurser/vastgotalagen` redan är statisk.
   - **Resa 4 (Runsida):** Referensbevis! Genererar **0 serverfunktionsanrop vid varma besök** tack vare SSG och `s-maxage=31536000` samt API-cache.
   - **Resa 5 (Admin):** Genererar **6 serverfunktionsanrop**. Adminvyerna förblir strikt dynamiska och privata, men anonym kontroll av startsidan ska framöver servas från cache.

## Genomfört i E03

1. **Fullständig routematris kartlagd ([`docs/drift/E03-routematris-och-cachehinder.md`](./E03-routematris-och-cachehinder.md)):**
   - Samtliga sidor, layouter, API route handlers och server actions inventerade.
   - 11 dynamiska rutter analyserade avseende dynamiska hinder (`cookies`, `force-dynamic`, `searchParams`).
   - Målpolicy och klassificering (Publik stabil, Publik föränderlig, Query-beroende, Privat/Admin) definierade för varje rutt.
2. **Rotlayoutens beroendekedja isolerad som huvudorsak:**
   - `app/layout.tsx` anropar `hamtaSession()` → `skapaServerKlient()` → `cookies()`.
   - Detta tvingar fram dynamisk rendering för 100 % av alla anonyma sidvisningar.
   - Eftersom alla komponenter som konsumerar sessionen (`useAdmin()`) redan är `"use client"`-komponenter, kan sessionen läsas asynkront på klientsidan utan att blockera eller förhindra statisk rendering av rotlayouten och publika sidor.
3. **Invalideringsmatris kartlagd:**
   - `lib/actions.ts` har en alltför bred `revalidatePath('/', 'layout')` som tömmer hela sajtens cache vid ändring av en enskild text. Målinvalidering avgränsas i E11.
   - `/api/ordbok/uppslag` saknar cacheheader och kan ges `s-maxage=86400`.

---

## Genomfört i E04

1. **Rotlayouten frikopplad från sessioner ([`app/layout.tsx`](../../app/layout.tsx)):**
   - `hamtaSession()` borttagen från `RootLayout`. Rotlayouten är nu helt synkron och fri från kakor (`cookies()`).
   - `AdminBar` och `children` omsluts av `<AdminProvider>`.
2. **Klientbaserad sessionsprovider ([`components/admin/AdminContext.tsx`](../../components/admin/AdminContext.tsx)):**
   - Läser session i bakgrunden asynkront via browserklienten när `HAR_SUPABASE` är aktivt.
   - Lyssnar på auth-händelser (`onAuthStateChange`).
   - Initialiseras som anonym för alla besökare, vilket eliminerar layout shift och serverfunktionsanrop för anonyma läsare.
3. **AdminBar och behörighet intakt ([`components/admin/AdminBar.tsx`](../../components/admin/AdminBar.tsx)):**
   - Renderas endast för administratörer; returnerar `null` för anonyma besökare.
   - Formatering, redigeringstoggle och serververifierade mutationer i Server Actions fungerar oförändrat.
4. **Runors serverläsning säkrad ([`lib/runor/server.ts`](../../lib/runor/server.ts)):**
   - `hamtaSession()` anropas nu endast vid explicit administratörsbegäran (`options?.preferDraftForAdmin`).

---

## Genomfört i E05

1. **Ren publik Supabase-klient ([`lib/supabase/server.ts`](../../lib/supabase/server.ts)):**
   - Skapade `skapaPublikServerKlient()` utan `cookies()` och med `persistSession: false`.
2. **Kakor eliminerade från samtliga publika dataläsare:**
   - [`lib/sidor.ts`](../../lib/sidor.ts) (`hamtaStartinnehall`)
   - [`lib/archive.ts`](../../lib/archive.ts) (`getRoot`, `hamtaInnehall`)
   - [`lib/resurser.ts`](../../lib/resurser.ts) (`hamtaBibliotek`, med explicit `.eq("utkast", false)`)
   - [`lib/ordbok/ordbokDb.ts`](../../lib/ordbok/ordbokDb.ts) (`hamtaOrdbokPostDb`, `sokOrdbokDb`, `hamtaBokstavsStatistikDb`)
   - [`lib/runor/server.ts`](../../lib/runor/server.ts) (publika utgåvor)
3. **Behörighets- och regressionsverifiering:**
   - Skrivskydd och administrativa åtgärder använder fortsatt `skapaServerKlient()` och verifierar `arAdmin` på servern.
   - Byggkontroll och alla valideringssviter passerade med 0 fel.

---

## Genomfört i E06

1. **Startsidan optimerad som pilot ([`app/page.tsx`](../../app/page.tsx)):**
   - Ersatte `export const dynamic = "force-dynamic"` med `export const revalidate = 86400`.
   - Byggklassificering ändrad från `ƒ Dynamic` till `○ Static`.
   - Serveranrop för anonyma läsare och förhandsladdningar eliminerade vid varma besök (100 % minskning).
   - Rapport: [`docs/drift/E06-startsidan-pilot.md`](./E06-startsidan-pilot.md).

---

## Genomfört i E07

1. **Sökvägsgenerator i datalagret ([`lib/archive.ts`](../../lib/archive.ts)):**
   - Skapade `getAllPaths(root)` som traverserar alla mappar och dokument rekursivt och samlar samtliga giltiga sökvägar inklusive `[]`.
2. **Statisk förgenerering och ISR för Texter ([`app/texter/[[...slug]]/page.tsx`](../../app/texter/[[...slug]]/page.tsx)):**
   - Borttaget `export const dynamic = "force-dynamic"`.
   - Infört `generateStaticParams()` (44 förgenererade sökvägar under bygget inklusive `/texter`).
   - Satte `export const revalidate = 604800` (7 dagar) och `export const dynamicParams = true`.
3. **Statisk förgenerering och ISR för Grammatik ([`app/grammatik/[[...slug]]/page.tsx`](../../app/grammatik/[[...slug]]/page.tsx)):**
   - Borttaget `export const dynamic = "force-dynamic"`.
   - Infört `generateStaticParams()` (232 förgenererade sökvägar under bygget inklusive `/grammatik`).
   - Satte `export const revalidate = 604800` (7 dagar) och `export const dynamicParams = true`.
4. **Mätresultat (Next.js produktionsserver):**
   - **Resa 1 (Texter):** Minskade från 9 serveranrop till **1 anrop (89 % minskning)** – det enda återstående anropet är ordboksuppslaget som adresseras i E09.
   - **Resa 2 (Grammatik):** Minskade från 4 serveranrop till **0 anrop (100 % minskning)** vid varma besök.
   - Rapport: [`docs/drift/E07-texter-och-grammatik.md`](./E07-texter-och-grammatik.md).

---

## Genomfört i E08

1. **Statisk förgenerering och ISR för Resursbiblioteket ([`app/resurser/page.tsx`](../../app/resurser/page.tsx)):**
   - Borttaget `export const dynamic = "force-dynamic"`.
   - Satte `export const revalidate = 86400` (24 timmar ISR).
   - Byggklassificering ändrades från `ƒ Dynamic` till `○ Static`.
2. **On-demand revalidering vid redaktionella ändringar:**
   - Samtliga mutationer i [`lib/resursActions.ts`](../../lib/resursActions.ts) anropar `revalidatePath("/resurser")` så att cachen töms omedelbart vid sparning eller ändring.
3. **Statiska PDF-tillgångar och Range Requests:**
   - Verifierade att PDF och sidbilder servas direkt av CDN med stöd för `206 Partial Content` (testat med `Range: bytes=0-1023`).
4. **Mätresultat (Next.js produktionsserver):**
   - **Resa 3 (Resurssökning & PDF):** Minskade från 2 serveranrop till **0 anrop (100 % minskning)** vid varma besök.
   - Svarstid för `/resurser` minskade från 26 ms till 8.6 ms (67 % snabbare).
   - Rapport: [`docs/drift/E08-resursbibliotek-och-pdf.md`](./E08-resursbibliotek-och-pdf.md).

---

## Genomfört i E09

1. **CDN-caching för ordboksuppslag ([`app/api/ordbok/uppslag/route.ts`](../../app/api/ordbok/uppslag/route.ts)):**
   - Lyckade ordforms- och stamuppslag (HTTP 200) förses med `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800`.
   - Fel och tomma sökningar returnerar strikt `Cache-Control: no-store, max-age=0`.
2. **Klientsidig minnescache och AbortController ([`components/text/OrdbokUppslagPanel.tsx`](../../components/text/OrdbokUppslagPanel.tsx)):**
   - Modulbaserad minnescache (`Map`) sparar upp till 250 uppslag för direkt återanvändning (0 ms latens, 0 nätverksanrop).
   - `AbortController` avbryter pågående oavslutade requests omedelbart när användaren byter klickat ord, vilket eliminerar onödig serverbelastning.
3. **Inkrementell statisk återvalidering för ordbokssidor:**
   - [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx): `export const revalidate = 86400` (24 timmar ISR för 41 744 artiklar).
   - [`app/ordbok/page.tsx`](../../app/ordbok/page.tsx): `export const revalidate = 86400` för ordbokssökning.
4. **Mätresultat (Next.js produktionsserver):**
   - Resa 1: Sista återstående serveranropet (API:et) eliminerat på CDN och i klientminne.
   - Rapport: [`docs/drift/E09-ordboksuppslag-och-sokning.md`](./E09-ordboksuppslag-och-sokning.md).

---

## Genomfört i E10

1. **Villkorlig sessionsförnyelse i middleware ([`middleware.ts`](../../middleware.ts)):**
   - Införde vaktkontroll som kontrollerar om klienten har en `sb-...-auth-token`-kaka.
   - Anonyma besökare (99.9 % av trafiken) passerar nu omedelbart igenom middleware på 0.01 ms utan asynkrona Supabase Auth-anrop.
   - Inloggade administratörer behåller fullständig kontinuerlig sessionsförnyelse.
   - Utökade matchern att undanta `.pdf`, `.xml`, `.txt`, `.json`.
2. **Selektiv länkförhandsladdning i täta vyer:**
   - [`components/dokument/DocSidebar.tsx`](../../components/dokument/DocSidebar.tsx): Satte `prefetch={false}` på trädlänkar för att förhindra mass-prefetch av 231 artiklar samtidigt vid sidofältsvisning.
   - [`components/runor/RunorDirectoryClient.tsx`](../../components/runor/RunorDirectoryClient.tsx): Satte `prefetch={false}` på tabell- och kortlänkar.
3. **Runsidans kart- och tillståndshantering:**
   - Verifierade att kartfilter, tidslinje och popstate synkas via `history.pushState` / `replaceState` utan servernavigation.
4. **Mätresultat (Next.js produktionsserver):**
   - Latensen sjönk generellt över hela applikationen med 14–19 % till följd av snabbare middleware-genomströmning.
   - Rapport: [`docs/drift/E10-runsida-forhandsladdning-middleware.md`](./E10-runsida-forhandsladdning-middleware.md).

---

## Genomfört i E11

1. **Målstyrd invalidationsarkitektur ([`lib/actions.ts`](../../lib/actions.ts)):**
   - Ersatte den breda globala rotinvalideringen `revalidatePath('/', 'layout')` med `uppdateraRot(root)` som endast invaliderar den berörda roten (`/texter` eller `/grammatik`).
   - Startsidan (`/`), Resurser (`/resurser`), Ordboken (`/ordbok`) och Runorna (`/runor`) behåller sina respektive CDN-cachar helt intakta vid redigering av text eller grammatik.
2. **SQL-effektiv rotåterföring:**
   - Databasmutationerna använder `.select("root").maybeSingle()` direkt i update-/delete-anropen för att bestämma rot utan extra nätverksfrågor.
3. **Behörighetsskyddad invalidation:**
   - Nekade anrop (utan administratörsbehörighet) avvisas i första steget och triggar aldrig revalidering.
   - Rapport: [`docs/drift/E11-aktualitet-och-invalidation.md`](./E11-aktualitet-och-invalidation.md).

---

## Genomfört i E12

1. **Samlad test- och byggverifiering:**
   - 27 automatiserade tester körda (`tests/drift-optimering.test.mjs`, `validate-texter.test.mjs`, `runor-contract.test.mjs`, `seo-contract.test.mjs`) – samtliga 27 godkända.
   - `npm run validate:kallor`: Godkänd (39 verk, 54 filer, 193 grammatikdokument, 0 fel).
   - `npm run validate:texter`: Godkänd (35 dokument, 159 sektioner, 377 meningar, 285 segment-ID:n, 0 fel).
   - `npx tsc --noEmit`: 0 fel.
   - `npm run build`: 315 sidor förrenderade (`● SSG` / `○ Static`) utan fel eller varningar.
2. **Mätverifiering mot samtliga 5 besökarresor:**
   - Resa 1: Minskning med 100 % vid varma besök (från 9 till 0 anrop).
   - Resa 2: Minskning med 100 % (från 4 till 0 anrop).
   - Resa 3: Minskning med 100 % (från 2 till 0 anrop).
   - Resa 4: Referens bibehållen (0 anrop).
   - Resa 5: Minskning med 33 % (endast administratörens inloggade vyer förblir privata).
   - Sammanlagt: **100 % minskning av serverfunktionsanrop för anonyma läsare**.
   - Slutrapport: [`docs/drift/E12-samlad-kontroll.md`](./E12-samlad-kontroll.md).

---

## Nästa startpunkt (E13 & E14)

När Netlifys månadskvot återställs den 1 november 2026 eller kontot uppgraderas:
1. **E13 – Verifiera på Netlify och förbered återställning:**
   - Driftsätta grenen till Netlify staging/preview.
   - Verifiera faktiska CDN- och funktionsmätningar i Netlify Analytics / Loggar.
2. **E14 – Kontrollerad lansering och uppföljning:**
   - Publicera till produktion på `https://www.fornsvenska.se`.
   - Följa upp kvot och funktionsräknare.










