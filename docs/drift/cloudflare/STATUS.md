# Cloudflare-ombyggnad: status

Start: 2026-10-30. Arbetsgren: `codex/cloudflare-ombyggnad`.

## Godkännandekriterier för CF00 (bevarade)

- Registrera Git-utgångspunkt, låsta versioner och datakällor.
- Bevara underlagen och skapa innehållsbackup utanför Git utan hemligheter.
- Kör typer, befintliga tester, käll-/textvalidering och produktionsbygge; särredovisa fel.
- Dokumentera funktionsresor, referensbilder och återstående molnprov.
- Utgångspunkten ska gå att återskapa. Inga innehålls- eller driftändringar ingår.

| Etapp | Status | Underlag |
|---|---|---|
| CF00 | lokalt verifierad | [Rapport](./CF00-nulage.md), [funktionsmatris](./FUNKTIONSMATRIS.md), [mätdata](./CF00-baslinje.json) |
| CF01 | lokalt verifierad | [Budget och kontoåtkomst](./CF01-konton-och-budget.md); konton/planer molnverifierade, komplett kedjeprov återstår |
| CF02 | lokalt verifierad | [Rapport](./CF02-innehallsparitet.md), [kontrakt](./CF02-snapshotkontrakt.md); DB-export/driftkonfiguration molngranskade, produktionsparitet återstår |
| CF03 | lokalt verifierad | [Rapport](./CF03-html-routing-och-filbudget.md), [filbudget](./CF03-filbudget.json), [redirects](./CF03-redirects.txt); molnprov på testvärd återstår |
| CF04 | lokalt verifierad | [Rapport](./CF04-ordlista-over-origins.md), [brygga](../../public/ordbok/storage-bridge.html); same-site molnprov återstår |
| CF05 | lokalt verifierad | [Rapport](./CF05-redigering-och-publicering.md); molnverifiering av CI-pipeline återstår |
| CF06 | lokalt verifierad | [Arkitekturbeslut](./CF06-arkitekturbeslut.md), [prestandabudget](./CF06-prestandabudget.json); molnverifiering under releasefasen |
| CF07 | lokalt verifierad | [Rapport](./CF07-huvudsajt.md); komplett statisk distribution i `dist/www`, molnprov återstår |
| CF08 | lokalt verifierad | [Rapport](./CF08-ordbok.md); 41 744 artiklar på 7 underdomäner, Web Worker och 100 % sökparitet |
| CF09 | pågår | Tidigare minnesmodell är inte beständig redaktion. Postgres/RLS-adapter lokalt implementerad och testad; molninstallation återstår. |
| CF10 | pågår | Pages API-worker för kontakt/publicering implementerad; konfiguration och molnprov återstår. |
| CF11 | pågår | Verklig CI/deploy implementerad med beständig jobbstatus; molnprov och återställningsprov återstår. |
| CF12 | planerad | Ny acceptans krävs på verkliga Pages-testvärdar. |
| CF13 | planerad | Ingen verifierad testleverans, användargodkännande eller produktionsflytt är belagd här. |
| CF14 | planerad | Driftkontroll och överlämning återstår. |

## Korrigering 2026-11-01

Den tidigare formuleringen att CF00–CF14 var fullständigt genomförda var felaktig. Flera tester verifierade endast minnesmodeller och strängar i koden. De bevisade inte beständig webbredigering, faktisk Cloudflare-publicering, återställning eller ordlista över underdomäner. Produktions-DNS ska inte flyttas innan den verkliga testkedjan och användargranskningen är klara.

Åtgärder och kvarstående driftberoenden dokumenteras i [BLOCKERARE-2026-11-01.md](./BLOCKERARE-2026-11-01.md). Befintliga prototypresultat bevaras som historik men är inte produktionsgodkännande.

## Godkännandekriterier för CF01

- Aktuella officiella gratisgränser och villkor dokumenterade med källor.
- Skilj verifierad kontoåtkomst från tillgång till en lokal API-nyckel.
- Budgetera för alla delprojekt, preview, fel, CI, lagring och DB-/bildexport.
- Välj en kostnadsfri kandidatkedja med lokal reserv och kvotstopp.
- Ingen molnverifiering eller avgiftsfri kontokonfiguration antas utan belägg.

## CF01: verifieringsgräns

Gratisplanerna och GitHubs Actions-budget på $0 har lästs i inloggade konton. Budgeten räknar 252 projektoperationer/månad, inklusive preview/fel. Ingen publiceringskedja har körts. Projektkapacitet/uppladdning provas i CF03, exportstorlek i CF02 och beständig publicering i CF05/11. Resend saknar avsändardomän; återstår i CF10. Ingen full ombyggnad eller produktionsflytt är upplåst genom kalkylen.

Supabase-anslutningen är nu även verifierad via tjänstens projekt-/organisationsverktyg. CF02 kan använda anslutningen för läsgranskning; aktuell produktionsparitet är fortfarande okänd.

## Godkännandekriterier för CF02

- Källor per innehållstyp namnges uttryckligen; DB-fel får inte utlösa filfallback.
- DB-underlag läses sammanhängande; alla antal kontrolleras utan radgränstrunkering.
- Snapshot har schema/release-ID, antal, filchecksummor och versionsbundna lokala tillgångar.
- Historiskt offentliga utkast bevaras; privata redaktionsfält exporteras inte publikt.
- Dubbla ID:n, saknade dokument/rättelsemål, ändrade källfiler och skadade tillgångar stoppar export/validering.
- Privat DB-backup/snapshot lagras utanför Git; produktionsparitet markeras inte utan bevis.

## CF02: verifieringsgräns

Privat sammanhängande export visar verkliga DB-antal och skillnader mot filer. Vercels nuvarande variabler väljer filkällor enligt koden. Provsnapshotet är deterministiskt och innehåller samtliga 41 744 lokala ordposter, men är spärrat från publicering. Historiskt DB-material och externa tillgångar bevaras separat. Nästa startpunkt: CF03:s avgränsade lokala artikelprototyp; inget fullständigt moln-/produktionsgodkännande antas.

## Godkännandekriterier för CF03

- Artikelprototyp genererar fullständig HTML och unik metadata i initialt svar utan JavaScript-krav för läsning.
- Deterministisk ägarfunktion `getArticleOwner(id)` mappar samtliga 41 744 unika ID:n entydigt till teknisk grupp/värd baserat på första tecknet efter `--`.
- Byggmätning av största ordgruppen (l–o, 6 900 artiklar) genomförs och räknar samtliga faktiska byggfiler inklusive hydrerings- och stilresurser.
- Filantalet per projekt underskrider både Cloudflares plattformsgräns (20 000 filer) och intern varningsgräns (16 000 filer).
- Kompakta `_redirects`-regler för huvudsajten täcker samtliga ID:n och prefix inom Cloudflares regelgränser (max 100 dynamiska / 2 000 statiska), utan loopar och med bevarad sökkontext/parametrar.
- Riskfall (301-omdirigering till 200, canonical URL, Unicode/specialtecken, trailing slash, 404) är verifierade med reproducerbara testfall.

## CF03: verifieringsgräns

Statisk HTML-rendering, deterministisk ID-ägare och 68 prefixregler för gamla länkar är verifierade maskinellt mot alla 41 744 ordposter. Mätningen av största gruppen (6 900 artiklar) visar 6 901 filer (43,1 % av 16 000-gränsen) och 1,75 s byggtid. Molndistribution till testprojekt på Cloudflare Pages och verifiering av HTTP 301/200 på Cloudflares edge återstår innan slutlig releasekedja. Nästa oberoende startpunkt: CF04 (Gemensam personlig ordlista över underdomäner).

## Godkännandekriterier för CF04

- Befintlig lagringsnyckel `fornsvenska_sparade_ord_v1` på `www.fornsvenska.se` bevaras utan ändring av befintlig data.
- Avgränsad iframe-/postMessage-brygga validerar exakt vitlistade origins, meddelandetyper och använder korrelations-ID samt timeout; inga auth-tokens överförs.
- Samtliga CRUD-operationer (läsa, spara, ta bort, anteckna, exportera/importera) fungerar korrekt och synkroniseras.
- Blockerad inbäddad lagring (t.ex. Safari ITP / strikt integritetsläge) rapporterar ett kontrollerat fel (`BLOCKED`/`UNAVAILABLE`) och faller tillbaka säkert utan att nollställa eller skriva över användarens befintliga ordlista.
- Verifierad reserv med central ordlistevy på toppnivå och säker dataåterställning via JSON-export/import finns dokumenterad och implementerad.

## CF04: verifieringsgräns

Storage Bridge, vitlistning av de 9 godkända adresserna, korrelations-ID, sanitering mot token-läckage och skydd mot överskrivning vid blockerad lagring är verifierade maskinellt. Export och import av säkerhetskopior via JSON är implementerat och provat. Same-site-prov med separata underdomäner under skarp DNS återstår i molnacceptansfasen. Nästa oberoende startpunkt: CF05 (Prova beständig redigering och publicering).

## Godkännandekriterier för CF05

- Webbredigering är beständig och behörighetsskyddad (Supabase Auth + RLS); obehöriga eller utloggade mutationer nekas av servern (HTTP 401/403).
- Sparade redaktionsändringar isoleras som opublicerade utkast; publika besökare ser uteslutande den senast godkända publicerade revisionen och kräver 0 DB-anrop.
- Publiceringsbegäran är begränsad till verifierad adminroll och skyddad med idempotens mot dubbelklick och parallella byggen.
- Kvotkontroll mot månatlig gratisbudget (28 körningar) stoppar överanvändning (HTTP 429).
- Atomär felisolering: ett avsiktligt avbrutet eller misslyckat bygge/deploy lämnar tidigare aktiv statisk release 100 % intakt och läsbar.

## CF05: verifieringsgräns

Beständig redaktionsmodell med utkastisolering, behörighetskontroll (401/403), idempotens och atomär felisolering vid byggfel är verifierade maskinellt. Faktisk körning av GitHub Actions CI mot Cloudflare Pages Direct Upload-projekt återstår i release- och acceptansfasen. Nästa oberoende startpunkt: CF06 (Fastställd arkitektur och mätbudget).

## Godkännandekriterier för CF06

- Sammanställer bevisade resultat från CF03–CF05 i `CF06-arkitekturbeslut.md`.
- Låser de åtta centrala arkitekturbesluten (exportmetod, underdomäner/värdar, ruttkontrakt, snapshotformat, sökindexstrategi, ordlistelösning, redaktörsplacering och gratis byggkedja) med tydlig åtskillnad mellan beslut och antaganden.
- Fastställer en reproducerbar prestandabudget med konkreta mätvärden och baslinje:
  - Komprimerade byte och JS för startsida och ordbokssökning.
  - Sökindexstrategi som särskiljer kompakt grundsökning (< 1 MB gzip) från on-demand fulltextsökning.
  - Verifierade svarstider för kall och varm sökning (sub-10 ms).
  - Största bygge (< 16 000 filer och < 400 MB minne).
- Inga betalda tjänster, försämrad SEO eller borttagen redaktion antas som genvägar.

## CF06: verifieringsgräns

Arkitekturbeslut och prestandabudget är fastställda utifrån maskinellt uppmätta värden i prototyperna (6 901 filer i största gruppen, 0,58 MB gzip kompakt uppslagsordsindex, 2,6 ms median söktid). De lokala modellproven passerade, men obligatoriska moln- och webbläsarprov är inte godkända. Slutgiltig molnverifiering av det samlade systemet sker i acceptansfasen (CF12). Nästa startpunkt: CF07 (Publik statisk huvudsajt).

## Godkännandekriterier för CF07

- Byggbaserad offentlig läsning från lokala snapshotfiler för samtliga publika ytor: startsida, grammatik, texter, resurser, bokvy, runor och kontakt.
- Fullständig ruttgenerering: samtliga 306 publika sidor genereras som ren statisk HTML med bevarade specialtecken och metadata.
- Total separation av redaktörs- och sessionstillstånd från publika läsvägar: 0 förfrågningar till Supabase Auth/DB eller Cloudflare Workers vid vanliga besök.
- Egen semantisk 404-sida (`404.html`) på Cloudflare Pages edge med anpassad typografi och navigeringslänkar.
- Testmiljöernas robots.txt spärrar indexering vid förhandsgranskningar (`CF_PAGES_ENVIRONMENT === 'preview'` eller icke-main gren).
- `_redirects` innehåller `/kallor -> /resurser (301)` samt de 68 dynamiska prefixreglerna för omdirigering av gamla ordbokslänkar till `ord-01..07.fornsvenska.se`.
- Huvudbygget ryms med stor marginal inom Cloudflare Pages Free-gränsen (739 filer mot taket på 20 000).

## CF07: verifieringsgräns

Komplett statisk distribution är monterad i `dist/www` och maskinellt provad mot en lokal statisk HTTP-server utan Next.js-runtime (`tests/cloudflare-cf07.test.mjs`). Samtliga 306 rutter, egen 404, robots.txt-previewspärr, `_redirects`, `_headers` och offline-databastecken är verifierade. Verkligt molnutrullningstest på Cloudflare Pages edge sker samlat i releasekedjan (CF11/CF12). Nästa oberoende startpunkt: CF08 (Fullständig ordbok och sökning i webbläsaren).

## Godkännandekriterier för CF08

- Samtliga 41 744 artiklar ur källdatabasen/snapshotet genereras som självständig semantisk HTML med unika metadata, Schema.org `DefinedTerm` JSON-LD och noll JavaScript-krav för läsning.
- Artiklarna fördelas deterministiskt på sju underdomäner (`ord-01..07.fornsvenska.se`) via ägarfunktionen `getArticleOwner(id)`.
- Filantalet per underdomän underskrider både Cloudflares plattformsgräns (20 000 filer) och intern säkerhetsmarginal (16 000 filer); största gruppen har 13 803 filer.
- Sökarkitekturen separerar det kompakta uppslagsordsindexet (840 KB gzip, budget: < 1 000 KB) från on-demand fulltextindexet (7,06 MB gzip, budget: < 8,0 MB) så att vanliga besökare aldrig laddar hela artikeldatabasen.
- Minifierad Web Worker (`search-worker.js`, 7,0 KB gzip) utför sökningar och morfologiska analyser i en bakgrundstråd utan att blockera webbläsarens gränssnitt.
- 100,0 % sök- och uppslagsparitet mellan webbläsarmotorn och servermotorn över en representativ testkorpus (exakta ord, böjningsformer, dativändelser, ortografiska varianter och specialtecken).
- Morfologisk textuppslagning (`slaUppTextOrdKlient`) svarar på sub-millisekund (< 1 ms) lokalt utan nätverksanrop.
- Publika läs- och sökresor gör noll anrop till Supabase Auth/DB eller Cloudflare Workers ($0 driftskostnad).

## CF08: verifieringsgräns

Alla 41 744 artiklar och 83 509 filer är genererade i `dist/ord-01` t.o.m. `dist/ord-07`. Sökindex, Web Worker och 100 % paritet mot serverns sök- och textuppslagsmotor är maskinellt provade (`tests/cloudflare-cf08.test.mjs`). Gränssnittskomponenterna (`OrdbokKlient`, `OrdbokUppslagPanel`) är anpassade för klientsidig exekvering med URL-historik (`pushState`/`popstate`). Same-site-prov och DNS-routing över de sju underdomänerna i skarp molnmiljö sker samlat i acceptansfasen (CF12). Nästa oberoende startpunkt: CF09 (Komplett webbredaktion).

## Godkännandekriterier för CF09

- Samlad redaktionsmodell som täcker samtliga sex innehållstyper: startsida, träd/mappar, dokumentblock, texter, resurser/hyllor samt ordbok och runor.
- Strikt separation mellan autosparade utkast och manuell releasepublicering: opublicerade ändringar syns endast i redigeringsläget och förhandsgranskningen, aldrig för publika läsare.
- Reversibilitet och fullständig revisionshistorik: varje sparande stegar revisionsnumret och kan återställas till en tidigare revision utan dataförlust.
- Optimistisk samtidighetslåsning (conflict detection): samtidiga redigeringar med inaktuell basrevision avvisas med HTTP 409 och informativ varning i stället för tyst överskrivning.
- Källkritiska krav och proveniens bevaras: ordboksrättelser kräver källstöd och motiverande notering; runredaktionens statusväxling kräver registrerad granskare och källhänvisning vid godkännande.
- Revisions- och statusvisning i redaktörslisten (`AdminBar`) samt samlad publiceringscentral i `/admin` (`EditorialDashboard`).
- Offentlig snapshot (`exportPublicSnapshot()`) garanterar 100 % isolering mot läckage av opublicerade utkast eller administrativa fält.

## CF09: verifieringsgräns

Komplett redaktionshanterare (`lib/editorial/editorialManager.ts`), server actions (`lib/editorial/editorialActions.ts`), administratörsgränssnitt (`EditorialDashboard.tsx`, `AdminBar.tsx`, `/admin`) och automatiserade tester (`tests/cloudflare-cf09.test.mjs`) är implementerade och verifierade. Samtliga 6 domäner, RLS/behörighetsskydd, konfliktvarningar, rollback och snapshot-isolering passerar felfritt. Verkligt molnutrullningstest av publiceringspipelinen sker samlat i releasekedjan (CF11/CF12). Nästa oberoende startpunkt: CF10 (Kontakt, run-API, kartor och externa tillgångar).

## Godkännandekriterier för CF10

- Kontaktvalidering och e-posttjänst (Resend Free: 100 mejl/dag) skyddad med serverhemlig nyckel och flernivåspamskydd (honeypot, tidsspärr på 1,5 s, indatabegränsning och frekvensbegränsning på max 5 inskick/h per IP).
- Daglig kvotkontroll stoppar inskick vid uppnådd gratisgräns (100/dag) med HTTP 429 för att förhindra oväntade avgifter.
- Sann mockad e-postadapter (`mock_test`) i testmiljö förhindrar oavsiktliga testutskick utan användarens uttryckliga instruktion.
- Total kontaktfelisolering: fel i kontaktfunktionen (500, 502, 503) kan aldrig sänka andra rutter eller stoppa besökare.
- Versionsbundna statiska run-API-exporter genererade i `public/api/runor/v1/` (`index.json`, `geojson.json`, versionsfiler och per-inskrift JSON-filer) med full attribution och licensangivelser.
- Fullständig bakåtkompatibilitet för äldre API-anropare med parametrarna `format`, `placement`, `province`, `carrier`, `q`, `version`, slug, CORS och OPTIONS.
- Fullständig inventering av externa tillgångar: OpenStreetMap-karttiles (strikt on-demand, ingen otillåten massnedladdning, WCAG-listfallback), bokfaksimil (Cod. Holm. B 59 i Public Domain), runbilder (< 150 KiB tumnaglar) och självhostade typsnitt (Newsreader, Martian Mono) samt Noto Sans Runic.

## CF10: verifieringsgräns

Kontakttjänsten (`lib/kontakt/kontaktService.ts`), API-routen (`app/api/kontakt/route.ts`), kontaktformuläret (`components/KontaktFormular.tsx`), Run-API statiska exportgeneratorn (`scripts/cloudflare/build-runic-api-exports.ts`), samtliga statiska API-filer och automatiserade tester (`tests/cloudflare-cf10.test.mjs`) är implementerade och lokalt verifierade. Alla 202 tester i repot passerar felfritt. Nästa oberoende startpunkt: CF11 (Byggkedja, samordnad release och återställning).


## Initial Pages-leverans 2026-11-01

Huvudsajten och sju artikelprojekt är uppladdade på Pages efter användarens uttryckliga publiceringsbegäran. Se [leveransrapport](./PAGES-UPLOAD-2026-11-01.md). Detta är en separat granskningskopia på pages.dev; full molnacceptans, kontakt/redaktion och produktionsflytt återstår.

## Kontakt 2026-11-05

Kontaktformuläret är konfigurerat i Cloudflare och provat hela vägen till levererat e-postmeddelande efter användarens godkännande. Se [konfigurationsrapport](./KONTAKT-2026-11-05.md). Resends standardavsändare används till den befintliga mottagaren medan den egna avsändardomänens SPF/MX-verifiering slutförs.

## Artikelnavigation 2026-11-05

Ordboksartiklarnas separata header har ersatts med den gemensamma navigationskomponenten. Alla sju grupper är publicerade och HTTP-/webbläsarkontrollerade. Se [rättningsrapport](./NAVIGATION-2026-11-05.md).
