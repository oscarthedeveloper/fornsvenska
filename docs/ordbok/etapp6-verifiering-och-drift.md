# Etapp 3–6 — Verifieringsrapport och drift-/importanvisning

Datum: 2026-10-16  
Dataversion / Importversion: `2026-10-16.v1`

---

## 1. Genomförda etapper (1–6)

1. **Etapp 1 — Inventering och verifiering av källdata:**
   - Nedladdning av originalfiler från Språkbanken Text (`Källor/soederwall.xml` och `Källor/soederwall-supp.xml`), SHA-256-verifiering och registrering i `data/kallor.ts` under käll-ID `SOD1884` och `SOD-SUPP`.
   - Fullständig inventering av XML-element, fältmappning, kantfall och dokumenterat provurval på 43 poster i [`docs/ordbok/etapp1-inventering.md`](./etapp1-inventering.md) samt [`docs/ordbok/importmanifest.json`](./importmanifest.json).
2. **Etapp 2 — Datamodell och reproducerbar import:**
   - Implementerat deterministiskt importskript [`scripts/import-ordbok.ts`](../../scripts/import-ordbok.ts) (`npm run import:ordbok`) som bevarar originaltext, formrader (`<WordForm>`), betydelser (`<Sense>`) och källproveniens.
   - Separat rättelselagring i `data/ordbok-rattelser.json` samt valfri databasmigration i [`supabase/ordbok.sql`](../../supabase/ordbok.sql).
   - Verifierat att två på varandra följande importer ger byte-identisk utdata (`SHA-256: 302f5d71fd7b8cadc7637fc4b803f6a39fa846cf2f746ca77295d702b9eac4d7`) med **41 744 unika poster** (22 572 i huvudverket, 19 172 i supplementet) och 0 bortfall.
3. **Etapp 3 — Sökning och alfabetisk bläddring:**
   - Serverbaserad söktjänst i [`lib/ordbok/ordbokServer.ts`](../../lib/ordbok/ordbokServer.ts) och normaliserings-/aliasmodul i [`lib/ordbok/normalisering.ts`](../../lib/ordbok/normalisering.ts).
   - Rangordning:
     1. Exakt uppslagsord (`exact_headword`)
     2. Exakt källbelagd variantform (`exact_variant`)
     3. Exakt teckenalias på uppslagsord (`alias_headword`, t.ex. `thing` → `þing`, `ægha` → `ägha`)
     4. Prefix på uppslagsord (`prefix_headword`)
     5. Exakt teckenalias på variant (`alias_variant`)
     6. Prefix på variant (`prefix_variant`)
     7. Prefix via teckenalias (`alias_headword` / `alias_variant`)
   - Separat sökläge för **Historisk artikeltext** med kontextuella textutdrag.
   - Söderwalls lexikografiska ordning (`A–Ö`, sist `Þ (TH)`) och URL-baserad tillståndshantering (`?q=`, `?mode=`, `?letter=`, `?dataset=`, `?page=`, `?entry=`).
4. **Etapp 4 — Ordbokens gränssnitt:**
   - Sök- och bläddringsvy på [`app/ordbok/page.tsx`](../../app/ordbok/page.tsx) och beständig artikelvy på [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx).
   - Återanvänder `SiteFrame`, aktiv navigeringsmarkering i `Toppnav` (även synlig på smala skärmar), papperspaletten (`#FDFBEF`, `#111111`, `#FF5C39`, `#FFFFFF`) samt Newsreader och Martian Mono.
   - Desktop visar träfflista till vänster och artikel till höger; mobil visar träfflista följd av separat artikelläsning med tydlig återgångsknapp till samma sökning.
   - Stöd för tangentbordsnavigering (`ArrowUp`/`ArrowDown` i träfflistan), teckenknappar (`þ`, `æ`, `ø`, `ä`, `ö`, `å`), laddningsvy och 404-vy.
5. **Etapp 5 — Källor, kvalitet och säker presentation:**
   - Säkert renderingslager i [`components/ordbok/OrdbokArtikelVy.tsx`](../../components/ordbok/OrdbokArtikelVy.tsx) som aldrig exekverar rå HTML/XML.
   - Tydlig åtskillnad mellan Språkbankens leverantörskvalitet och webbplatsens egen granskningsstatus (`oandrad_kallimport`).
   - Ärliga länkar till Språkbanken Text, DOI, CC BY 4.0 och Projekt Runebergs bandöversikter (inga påhittade sidlänkar).
   - Korshänvisningar: **2 298** verifierade hänvisningar länkas till målordet; **2 249** hänvisningar som saknar entydigt målord i XML-källan visas som oförändrad text utan gissade mål.
6. **Etapp 6 — Verifiering och överlämning:**
   - Automatiserad testsvit och prestandamätning i [`scripts/test-ordbok-search.ts`](../../scripts/test-ordbok-search.ts).
   - Källvalidering (`npm run validate:kallor`) och produktionsbygge (`npm run build`) godkända utan blockerande fel.

---

## 2. Prestandamätning (hela datamängden, 41 744 poster)

Miljö: macOS, Node.js v24.21.0, lokalt serverminnesindex i `lib/ordbok/ordbokServer.ts`.

- **Kallstart (inläsning + sortering + indexering av 41 744 poster):** ~465–504 ms (sker en gång per serverprocess).
- **Alfabetisk bläddring med paginering (t.ex. bokstav `Þ`, 999 poster):** **0,23–0,48 ms**.
- **Uppslagsords- och variantsökning (`konunger`, `lagh`, `ägha`, `hava`, `hus`, `rätter`):** **35–39 ms**.
- **Teckenaliassökning (`þing` / `thing`):** **57–78 ms**.
- **Fritextsökning i historisk artikeltext (`kloster`, `stadh`, `abbedissa`):** **10–27 ms**.
- **Klientpaket (`First Load JS`):** `/ordbok` lägger endast till **8,84 kB** (och `/ordbok/[id]` **175 B**) ovanpå sajtens delade baspaket; noll byte av råa XML-filer eller hela ordboksindexet skickas till webbläsaren.

---

## 3. Drift- och importanvisning

### 3.1 Lokalkörning och omimport

1. Kontrollera att källfilerna ligger i `Källor/soederwall.xml` och `Källor/soederwall-supp.xml` (om de behöver återhämtas, se exakta URL:er och SHA-256 i `docs/ordbok/importmanifest.json`).
2. Generera (eller regenerera) ordboksindexet:
   ```bash
   npm run import:ordbok
   ```
   Detta skapar `data/ordbok/poster.json` (samt uppdaterar `docs/ordbok/importrapport.json`). Eventuella poster i `data/ordbok-rattelser.json` bevaras automatiskt.
3. Kör källvalidering och söktest:
   ```bash
   npm run validate:kallor
   npx tsx scripts/test-ordbok-search.ts
   ```
4. Starta utvecklingsservern eller bygg för produktion:
   ```bash
   npm run dev
   # eller
   npm run build && npm run start
   ```
   *(Obs: Kör inte `npm run build` samtidigt som `npm run dev` körs i samma mapp, eftersom båda skriver till `.next/`.)*

### 3.2 Miljövariabler och eventuell Supabase-migrering

- Ordboken fungerar **helt utan miljövariabler** genom det serverbaserade filindexet `data/ordbok/poster.json` (genererat av `npm run import:ordbok`).
- Om projektet i produktion vill lagra ordboken och framtida redaktionella rättelser i Supabase:
  1. Kör [`supabase/ordbok.sql`](../../supabase/ordbok.sql) i Supabase SQL Editor.
  2. Befintliga miljövariabelnamn i projektet är `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADMIN_EPOSTDOMAN` samt (endast lokalt vid migrering/seed) `SUPABASE_SERVICE_ROLE_KEY`. Publicera aldrig `SUPABASE_SERVICE_ROLE_KEY` i klientkod eller med `NEXT_PUBLIC_`-prefix.
- Om sajten byggs på Netlify utan att `Källor/*.xml` är incheckade i Git, antingen:
  - kör `npm run import:ordbok` i byggsteget efter att XML-filerna hämtats från Språkbanken, eller
  - inkludera `data/ordbok/poster.json` i distributionsflödet.

---

## 4. Kända begränsningar i första versionen

1. **Källfilernas täckning hos Språkbanken:**
   - I Språkbankens `soederwall-supp.xml` saknas kapitlet `V` i supplementet, och huvudverkets `Ä`-kapitel (332 poster) ligger i början av `Ä`-avsnittet i `soederwall-supp.xml` (index `17988–18319`). Båda förhållandena är dokumenterade och tydligt märkta i gränssnittet.
2. **Sidnummer till tryckt förlaga:**
   - Eftersom LMF/XML-filerna inte innehåller Söderwalls tryckta sid- eller spaltnummer länkar varje artikel ärligt till rätt bandöversikt hos Projekt Runeberg och till Språkbankens DOI, aldrig till en gissad faksimilsida.
3. **Avgränsning mot övriga senare etapper:**
   - Ingen automatisk nysvensk modernisering utöver källans egen artikeltext görs automatiskt.

---

## 5. Påbyggnadsetapp: Klicka-på-ord-uppslagning i lästexterna (`/texter`)

I påbyggnadsetappen har de fornsvenska lästexterna under `/texter` kopplats direkt till Söderwalls ordbok:

1. **Källtrogen kandidatgenerering ([`lib/ordbok/kandidater.ts`](../../lib/ordbok/kandidater.ts)):**
   - Varje klickat ord i lästexterna prövas i strikt ordning:
     1. `exact_headword`: Exakt uppslagsord i Söderwall.
     2. `exact_variant`: Exakt belagd stavnings- eller böjningsform i Söderwalls `<WordForm>`.
     3. `ortho_candidate`: Dokumenterad paleografisk/ortografisk motsvarighet (t.ex. `æ → ä/a`, `ø → ö`, `ð ↔ þ ↔ dh`, `u → v` före vokal, `konongær → konunger`, `böndær → bonde`).
     4. `inflected_candidate`: Dokumenterad böjnings- eller stamkandidat (t.ex. dativ plural `-um/-om`, presens/plural `-ir/-ar/-er`, oblika svaga former på `-u/-o`).
   - Ingen kandidat presenteras någonsin som exakt träff utan sin uttryckliga kategori och förklaring.
2. **Serveruppslag på < 1 ms ([`lib/ordbok/ordbokServer.ts`](../../lib/ordbok/ordbokServer.ts) & [`app/api/ordbok/uppslag/route.ts`](../../app/api/ordbok/uppslag/route.ts)):**
   - `slaUppTextOrd(ord)` slår upp ordformen i minnesindexets `byExactHeadword` och `byExactVariant` på `0,04–0,99 ms`.
3. **Interaktiv läsvy i `/texter` ([`KlickbarFsvMening.tsx`](../../components/text/KlickbarFsvMening.tsx), [`OrdbokUppslagPanel.tsx`](../../components/text/OrdbokUppslagPanel.tsx), [`Sektion.tsx`](../../components/text/Sektion.tsx), [`TextView.tsx`](../../components/text/TextView.tsx)):**
   - När redigeringsläget (`redigerbar`) är avstängt och `Ordboksuppslag: På` är valt kan läsaren klicka på valfritt fornsvenskt ord i utdraget.
   - Panelen visar det klickade ordets form i handskriften, meningskontextens grammatiknot ur textutgåvan samt matchande Söderwall-artiklar med källmärkning (`Huvudverket` / `Supplementet`) och direktlänk till `/ordbok/[id]`.

---

## 6. Påbyggnadsetapp: Morfologisk analys och böjningsuppslagning direkt i `/ordbok`

Utöver uppslagningen från `/texter` har även ordbokens huvudsökning (`sokOrdbok` i [`lib/ordbok/ordbokServer.ts`](../../lib/ordbok/ordbokServer.ts)) och klientvy ([`components/ordbok/OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx)) utökats med morfologisk och ortografisk kandidatuppslagning:

1. **Utökad fornsvensk morfologi ([`lib/ordbok/kandidater.ts`](../../lib/ordbok/kandidater.ts)):**
   - Omfattar starka och svaga substantivändelser (inkl. bestämd dativ/genitiv/plural som `-inum`, `-omin`, `-innar`, `-unnar`), svaga verbpreteriter och particip (`-adhi/-aþi`, `-adhe/-aþe`, `-adhis/-aþis`, `-dhi/-þi`, `-adher/-aþer`, `-andi/-ande`), komparativ/superlativ (`-ari/-are`, `-aster/-ister`), samt dokumenterade omljudda och starka former (`mæn → man/maþer`, `böker → bok`, `föter → foter`, `hondum → hand`, `londum → land`, `tok → taka`, `gik → ganga`, `fik → fa`, `boret → bära`, `varþ → varþa`).
2. **Tydlig särskillnad i träfflistan och analysrutan:**
   - Vid sökning på en böjd eller paleografisk ordform i `/ordbok` visas rutan **Morfologisk & ortografisk analys** ovanför träfflistan med klickbara grundformer och grammatisk förklaring.
   - Varje träff som nåtts via kandidatuppslagning märks med brickan `Ortografisk motsvarighet` eller `Böjningskandidat` samt den specifika grammatiska förklaringen (`matchExplanation`).

---

## 7. Påbyggnadsetapp: Bokmärken och personlig ordlista (localStorage & flervals-export)

För att stödja självstudier och vokabulärinlärning har ordboken och textläsaren försetts med ett lokalt bokmärkessystem:

1. **Integritets- och klientsäker lagring i `localStorage` ([`lib/ordbok/bokmarken.ts`](../../lib/ordbok/bokmarken.ts)):**
   - **Ingen koppling till Supabase** — alla ordlistor, anteckningar och kontextcitat lagras strikt i användarens webbläsare under nyckeln `fornsvenska_sparade_ord_v1`.
   - SSR-säkert (`typeof window !== "undefined"` och `suppressHydrationWarning`) för att förhindra hydreringsglapp i Next.js.
   - Reaktiva uppdateringar över komponentgränser via det anpassade webbläsareventet `BOKMARKEN_HANDELSE`.
2. **Kontextuellt sparande:**
   - I ordbokens artikelvy ([`OrdbokArtikelVy.tsx`](../../components/ordbok/OrdbokArtikelVy.tsx)) och träfflista ([`OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx)) sparas ord med uppslagsord, ordklass, definition och källverk.
   - Vid uppslag i lästexterna ([`OrdbokUppslagPanel.tsx`](../../components/text/OrdbokUppslagPanel.tsx)) sparas dessutom den autentiska fornsvenska meningen, källtextens titel och den klickade ordformen i handskriften som `kallText`.
3. **Sidopanel för personlig ordlista ([`BokmarkenPanel.tsx`](../../components/ordbok/BokmarkenPanel.tsx)):**
   - Skjutbar studielåda (slide-over drawer) med realtidsfilter (sökning på uppslagsord/anteckning/kontext samt kategorifilter `Alla`, `Från texter`, `Huvudverk`, `Supplement`).
   - Integrerad redigerare för egna studieanteckningar per sparat ord.
   - Global trigger `Ordlista (N)` i sidans toppnavigering ([`Toppnav.tsx`](../../components/Toppnav.tsx)), i ordbokens verktygsrad och i textläsaren.
4. **Flervals-export för studier och repetition:**
   - **Anki Flashcards (TSV):** Genererar en tabbseparerad importfil med Anki-kompatibla metadatahuvuden (`#separator:tab`, `#html:true`, `#tags column:3`). Framsidan innehåller fornsvenskt uppslagsord och ordform; baksidan innehåller ordklass, definitionsutdrag, källverk, handskriftsmening och användarens egna anteckningar. Taggas automatiskt med `fornsvenska`.
   - **CSV (med UTF-8 BOM):** Optimerad för direktöppning i Microsoft Excel och kalkylprogram med UTF-8 Byte Order Mark (`\uFEFF`), vilket garanterar korrekt visning av fornsvenska tecken (`þ`, `æ`, `ø`, `ä`, `ö`).
   - **Formaterad utskriftstext (.txt):** Läsvänlig studieöversikt för utskrift eller klistra in i anteckningsappar.
   - **JSON-säkerhetskopia:** Fullständig strukturerad backup för migrering mellan webbläsare eller säkerhetskopiering.

---

## 8. Påbyggnadsetapp: Redaktionellt rättelsegränssnitt och faksimilverifiering

För att kunna åtgärda fel i Språkbankens digitalisering (t.ex. OCR-fel eller teckenförvanskningar) med full källtransparens och bevarad proveniens:

1. **Bevarande av källans original och differentiering ([`lib/ordbok/rattelseDiff.ts`](../../lib/ordbok/rattelseDiff.ts) & [`components/ordbok/OrdbokRattelseDiff.tsx`](../../components/ordbok/OrdbokRattelseDiff.tsx)):**
   - Källans ursprungliga uppslagsord (`headwordOriginal`), XML-utdrag och käll-ID skrivs aldrig över eller raderas.
   - En visuell diff-komponent visar skillnaden mellan källans ursprungliga form och den korrigerade visningsformen.
   - Obligatoriskt krav på **dokumenterat källstöd** (faksimilhänvisning till Runeberg, band och sida, eller handskriftsreferens) och **redaktionell motivering** för varje rättelse.
2. **Dubbel lagringsarkitektur (lokal JSON & Supabase) ([`lib/ordbok/rattelser.ts`](../../lib/ordbok/rattelser.ts) & [`lib/ordbok/rattelseActions.ts`](../../lib/ordbok/rattelseActions.ts)):**
   - Ändringar sparas automatiskt i `data/ordbok-rattelser.json`, vilket säkerställer att framtida omimporter från Språkbankens råa XML aldrig förlorar utförda rättelser.
   - Om Supabase är konfigurerat (`HAR_SUPABASE`) synkroniseras rättelserna automatiskt mot tabellen `public.ordbok_rattelser` (med RLS som kräver behörighet från `public.admins`).
   - I lokalt utvecklingsläge (utan ansluten Supabase) kan utvecklare och redaktörer arbeta direkt mot `data/ordbok-rattelser.json` utan att låsas ute.
3. **Realtidsuppdatering av serverminne ([`lib/ordbok/ordbokServer.ts`](../../lib/ordbok/ordbokServer.ts)):**
   - Funktionerna `appliceraRattelseIMinne` och `avlasgnaRattelseIMinne` slår igenom ändringar omedelbart i minnesindexets uppslagsord, söktabeller och klartext utan omstart av servern.
4. **Gränssnittskomponenter för redaktionell hantering:**
   - [`OrdbokRedaktionsKnapp.tsx`](../../components/ordbok/OrdbokRedaktionsKnapp.tsx) & [`OrdbokRattelseModal.tsx`](../../components/ordbok/OrdbokRattelseModal.tsx): Tillgänglig direkt i artikelvyn för inloggade administratörer och i redigeringsläget med snabbknappar för fornsvenska specialtecken (`þ`, `ð`, `æ`, `ø`, `ä`, `ö`, `å`).
   - [`OrdbokRattelserAdmin.tsx`](../../components/admin/OrdbokRattelserAdmin.tsx): Administrationsöversikt på `/admin` med sökfilter, diff-granskning, snabblänkar till berörda artiklar, återställningsknapp och export till JSON.
   - Träfflistan i [`OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx) märker rättade poster med en subtil bricka `Rättad`.

---

## 9. Påbyggnadsetapp: Moderniserade definitioner och pedagogiskt förklaringsstöd

För att underlätta läsförståelse för studenter och nybörjare, utan att förvanska eller dölja Söderwalls historiska 1800-talstext:

1. **Strikt separation och proveniensdeklaration ([`components/ordbok/ModerntForklaringsstod.tsx`](../../components/ordbok/ModerntForklaringsstod.tsx)):**
   - Söderwalls historiska ordbokstext visas oförändrad i källavsnitten.
   - Det moderna stödet presenteras i en separat, fällbar modul med tydlig deklaration: *"Modernt förklaringsstöd & snabbglosa · Söderwalls historiska ordbokstext (1884) återges oförändrad nedan."*
2. **Kurerat register för högfrekventa fornsvenska begrepp ([`data/ordbok/moderniserade-definitioner.json`](../../data/ordbok/moderniserade-definitioner.json)):**
   - Strukturerade moderna glosor, lättbegripliga förklaringar och pedagogiska formnoter för centrala termer (t.ex. *konunger*, *lagh*, *þing*, *bonde*, *kirkia*, *biskoper*, *rätter*, *dräpa*, *böta*, *vara*, *hava*, *man*).
   - Möjlighet för administratörer att redigera och lägga till kurerade förklaringar direkt via [`ModernDefinitionModal.tsx`](../../components/ordbok/ModernDefinitionModal.tsx) och Server Actions i [`lib/ordbok/moderniseringActions.ts`](../../lib/ordbok/moderniseringActions.ts).
3. **Automatisk extraktion och 1800-talsnormalisering ([`lib/ordbok/modernisering.ts`](../../lib/ordbok/modernisering.ts)):**
   - För poster som ännu saknar manuellt kurerad förklaring extraheras snabbglosor automatiskt ur Söderwalls inledande definition och normaliseras från arkaisk 1800-talssvenska (*hafwa* → *ha*, *wara* → *vara*, *gifwa* → *ge*, *qvinna* → *kvinna*, *blifwa* → *bli*, *huruledes* → *hur*, etc.).
   - Märks ärligt som `Automatisk läshjälp` till skillnad från `✓ Kurerat förklaringsstöd`.
4. **Integration i sökning och lästexter:**
   - **I ordbokens söklista ([`OrdbokKlient.tsx`](../../components/ordbok/OrdbokKlient.tsx)):** Moderna snabbglosor visas direkt under uppslagsordet, vilket gör det enkelt för studenter att snabbt överskåda träffar.
   - **I textläsaren ([`OrdbokUppslagPanel.tsx`](../../components/text/OrdbokUppslagPanel.tsx)):** När man klickar på ett fornsvenskt ord i en medeltidstext visas moderna snabbglosor och förklaring direkt i sidolådan.

---

## 10. Påbyggnadsetapp: Produktionsmigrering till Supabase & molnsökning

För installationer som körs i molndrift (t.ex. Netlify / Vercel i kombination med Supabase) har en komplett databasarkitektur och molnadapter färdigställts:

1. **Idempotent databasschema ([`supabase/ordbok.sql`](../../supabase/ordbok.sql)):**
   - `public.ordbok_poster`: Rymmer samtliga 41 744 poster med fullständig struktur (käll-ID, ursprungligt uppslagsord, normaliserat visningsord, formrader, betydelsemoment, korshänvisningar och källchecksummor).
   - `public.ordbok_rattelser`: Rymmer redaktionella rättelser med revisionshistorik och obligatoriskt källstöd.
   - `public.ordbok_moderna_definitioner`: Rymmer kurerade och automatiska moderna definitioner, snabbglosor och pedagogiska noter.
   - Optimerade index för blixtsnabb filtrering och sökning: GIN-index på `search_keys` (`text[]`), B-träd på `letter_section`, `headword_display`, `sort_key` samt svensk fulltextsökningskolumn (`tsvector`) för historisk artikeltext.
   - Strikt Row Level Security (RLS): Allmänheten har öppen läsåtkomst (`SELECT`), medan `INSERT`/`UPDATE`/`DELETE` kräver autentiserad administratör via `public.admins`.
2. **Batchat migreringsskript ([`scripts/seed-ordbok-supabase.ts`](../../scripts/seed-ordbok-supabase.ts)):**
   - Körs via kommandot:
     ```bash
     npm run seed:ordbok
     ```
   - Läser in `data/ordbok/poster.json` och skickar upp posterna i batcher om 500 rader med `upsert` för att minimera minnesanvändning och undvika nätverkstimeouts.
   - Laddar och synkroniserar dessutom alla lokala rättelser från `data/ordbok-rattelser.json` samt kurerade definitioner från `data/ordbok/moderniserade-definitioner.json`.
   - Kräver `NEXT_PUBLIC_SUPABASE_URL` och `SUPABASE_SERVICE_ROLE_KEY` i `.env.local` eller skalmiljön.
3. **Hybrid dataarkitektur och Postgres-adapter ([`lib/ordbok/ordbokDb.ts`](../../lib/ordbok/ordbokDb.ts)):**
   - Styrs sömlöst via flaggan `NEXT_PUBLIC_DATA_SOURCE="supabase"`.
   - När flaggan är satt dirigerar [`app/ordbok/page.tsx`](../../app/ordbok/page.tsx) och [`app/ordbok/[id]/page.tsx`](../../app/ordbok/[id]/page.tsx) alla förfrågningar via:
     - `hamtaBokstavsStatistikDb()` — aggregerar postantal per bokstav i alfabetet.
     - `sokOrdbokDb()` — utför Postgres-optimerad uppslagsords-, prefix- och artikeltextsökning med paginering och JOIN mot rättelser och moderna definitioner.
     - `hamtaOrdbokPostDb()` — hämtar en specifik artikel och hydrerar den med aktiva rättelser och kurerade glosor.
   - När flaggan inte är satt (eller i lokal utveckling) används sajtens lokala in-memory-index i `lib/ordbok/ordbokServer.ts` med noll externa beroenden och < 1 ms svarstid.






