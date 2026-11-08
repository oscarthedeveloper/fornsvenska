# CF02 – innehållsparitet och publiceringssnapshot

Datum: 2026-10-30. Status: **lokalt verifierad prototyp; DB-export och driftkonfiguration läsgranskade i molnet; full produktionsparitet återstår**.

## Leverans

Ett versionsbundet privat provsnapshot och verktyg för export, validering, källjämförelse och frysning av offentliga refererade bilder finns. [Snapshotkontraktet](./CF02-snapshotkontrakt.md) beskriver formatet och spärrarna. [Källjämförelsen](./CF02-kalljamforelse.json) innehåller endast antal/checksummor, inte den privata DB-exportens innehåll.

Ingen applikationskod, schema, RLS, produktionsdata, Vercel-konfiguration eller DNS har ändrats. Den anslutna databasen och Storage lästes enbart. Inga privata snapshots har lagts i Git eller publika byggmappar.

## Vilken källa används?

Användaren visste inte vilken källa produktionen använder och bad att driftkonfigurationen skulle kontrolleras. Vercels registrerade Production Deployment pekar på commit `4237cd31f49bcf7fd12b52b4855b7eed9c647b96`, samma som lokal HEAD. Nuvarande projektvariabler innehåller publik Supabase-URL/anonnyckel men saknar `NEXT_PUBLIC_DATA_SOURCE`. Sökning efter väljaren gav inga resultat på vare sig Project eller Shared. Inga hemliga variabelvärden visades.

Med den granskade koden innebär detta filkälla för arkiv, startsida, bibliotek och ordbok. Runor väljer DB separat men aktuella runutgåvetabeller saknas, vilket i dagens app innebär filreserv. Detta är ett belägg för konfigurerat beteende. Den pausade Vercel-driften användes inte som HTML-/prestandatest, och vi har inte bevisat historiska byggvariabelvärden eller innehåll på alla produktionsdomäner.

| Innehåll | Källa för explicit lokalt provsnapshot | DB-läge / nästa kontroll |
|---|---|---|
| Arkiv/grammatik/text | Träd och dokument i `data/` | DB har annat urval och andra payloads. Ingen automatisk sammanslagning |
| Startsida | `START_STANDARD` | En DB-rad finns och dess råpayload skiljer sig. Inte automatiskt vald |
| Bibliotek och bokvy | `medKallor`, källregister och fasta skrifter | Två hyllor och åtta resurser i DB finns kvar privat för granskning |
| Ordartiklar | poster.json, 41 744 unika ID:n | Ordbokstabellen saknas i anslutna projektets public-schema |
| Ordrättelser | ordbok-rattelser.json, 0 poster | Motsvarande DB-tabell saknas |
| Moderna definitioner | moderniserade-definitioner.json, 14 poster | Motsvarande DB-tabell saknas |
| Runor | 20 publicerade pilotposter och 50 batch1-poster genom befintligt publiceringsfilter | Editionstabellen saknas. Default på sajten är pilot; versionerna sammanblandas inte |
| Lokala tillgångar | 67 checksummebundna filer från public/ | Inkluderar ignorerade lokala bokfiler; deploypaketeringen måste prövas i CF03/07 |

## Verklig DB-jämförelse

Den tidigare tabellöversiktens `rows: 0` var inte exakta antal. Exakt läsning gav 102 `nodes`, en `sidor`, två `hyllor` och åtta `resurser`. DB:n har även andra namngivna svenska-/portfolio-tabeller; de är inte denna apps publika läsväg och exporterades inte som publikt innehåll.

Av de 102 noderna hör 43 till grammatik och 22 till texter. Övriga 37 ligger under andra äldre rötter och bevaras privat. Filträden har 231 respektive 43 noder. Filerna innehåller 193 grammatikdokument och 35 textdokument; DB-träden har 33 respektive 14 dokumentnoder. Sex DB-grammatikadresser finns inte i filträdet. På delade dokumentadresser är råa JSON-payloads olika; det är inte samma sak som att varje mening har ändrats.

33 av alla DB-noder är märkta utkast, varav fem i grammatikroten och en i textroten. De har inte raderats eller automatiskt blivit nya privata utkast. Filkällans historiskt offentliga utkast följer med i provsnapshotet. Att avgöra om DB-exklusivt material tidigare varit offentligt kräver separat publiceringshistorik/granskning.

## Privat lagring och återställning

Under `/private/tmp/fornsvenska-cf02-20261030/` finns:

- `database.json`: sammanhängande innehållsexport, 81 702 byte. SHA-256 finns i källjämförelsen. Alla arraylängder motsvarar exakt count i samma SQL-statement.
- `storage-inventory.json`: metadata för två publika buckets och 37 objekt, cirka 31,4 MB enligt metadata. Ingen användarlista, auth-tabell eller token exporterades.
- `frozen-db-assets/`: de två offentliga Storage-bilder som just de exporterade innehållsfälten refererar till, sammanlagt 1 017 926 byte, vardera checksummebunden och dubbelläst. Ingen massnedladdning av hela buckets gjordes.
- `snapshot-final-a/` och `snapshot-final-b/`: två reproducerade lokala provsnapshot. Det maskinella resultatet dokumenteras i CF02-verifiering.json.

Katalogen är privat (0700) och DB-/bildfilerna 0600. Kopiera relevanta slutartefakter till beständig privat lagring före migrering; `/private/tmp` är inte långsiktig backup. Produktions-DB-backup med auth/roller är inte gjord och behövs före framtida datamigrering. Återställning här innebär att återläsa en kopia, inte att skriva DB över nyare redaktionellt arbete.

Bilderna är frysta byte för jämförelse, inte godkända för återpublicering. Bibliografiska länkar, externa kartor och eventuella andra publika produktionsbilder ska inventeras/frysas enligt rättigheter och publicerad revision i CF10/11.

## Kontroller och resultat

- Typkontroll godkänd. 161 befintliga/nya tester godkända, inga fel eller överhoppade. De tre nya riskproven täcker dubbla ID:n, saknade rättelsemål/dokument, bevarade utkast och ändrade data-/bildbyte/extra filer.
- Käll- och textvalidering godkända. Ingen validering togs bort.
- Två rena exporter gav samma release-ID; filinventeringen kontrolleras före och efter export. Export till befintlig snapshot får inte skriva över den.
- Rå ordboksdata i snapshotet jämförs maskinellt med alla lokala källposter, inte bara stickprov. Rättelser, definitioner och dokumentens nåbarhet valideras separat.
- Standard-HTTP-frågans radgräns undviks med en sammanhängande JSON-aggregation, inte med ett enda trunkerat `.select()`. Ingen migration eller RPC installerades.

Utvecklingskörningar fångade och rättade två verktygsfel före slutkontrollerna: TS-jämförelseskriptets top-level await behövde huvudfunktion, och målreservationens tomma katalog skulle ersättas med rename utan rm. En misslyckad körning lämnade endast en tom målreservation; tidigare data ändrades inte. Lokal bildhämtning krävde godkänd nätåtkomst genom sandboxen och lyckades sedan.

## Kvarstående hinder och nästa startpunkt

CF02 är inte godkänd som färdigt offentligt produktionssnapshot. Vi har nu känt lokalt urval och full privat export av de relevanta DB-tabellerna, men saknar verifierat innehåll i det pausade produktionssvaret, historisk publicerad revision för DB-exklusiva adresser och full rättighets-/versionsbindning av externa tillgångar. Provexportens publiceringsspärr kvarstår.

Nästa avgränsade arbete är CF03:s lokala HTML-/filbudgetprototyp från det explicita provsnapshotet. Det kan ge mätvärden utan att påstå produktionsparitet. CF03:s molngodkännande kräver även CF01:s faktiska uppladdnings-/projektprov. Ingen full ombyggnad eller produktionsflytt ska påbörjas innan CF06:s grind klarats.

Ändrade filer: rapport, snapshotkontrakt, källjämförelse, verifieringsresultat, STATUS.md, snapshot-core.ts, snapshot.ts, compare-sources.ts, freeze-assets.mjs, SQL-exportfilen och tests/cloudflare-snapshot.test.mjs. Ursprungliga Cloudflare-underlag och allt innehåll är bevarade.
