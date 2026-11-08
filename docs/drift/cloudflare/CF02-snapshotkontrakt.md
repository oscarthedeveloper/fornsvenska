# CF02 – snapshotkontrakt v1

Status 2026-10-30: lokalt verifierat prototypformat. Ingen offentlig release godkänd.

## Gränser

`fornsvenska.snapshot.v1` är ett fryst byggunderlag, inte en ny datakälla som besökaren laddar ner i sin helhet. CF03/08 ska generera HTML och separata index ur det. Det ska ligga i en privat katalog utanför repository och alla publika byggmappar. Exportören avvisar utdata i repositoryt. Alla nuvarande exporter har `audience: private-prototype`, `publishable: false` och explicita kvarstående publiceringshinder. Ingen flagga finns för att kringgå spärren.

Första exportören heter avsiktligt `export-local`: filvalet måste vara uttryckligt och ingen felande DB-läsning kan ändra dess källa. Den gör inga DB-anrop. Den privata DB-exporten är separat jämförelse-/backupunderlag, aldrig en filfallback eller ett offentligt snapshot. DB-innehåll importeras inte automatiskt till de lokala dokumenten.

## Filer och integritet

`manifest.json` innehåller schema, release-ID, audience, publiceringsspärr, källäge, Git-commit, checksummor/byte för verkliga källfiler, antal, kvarstående hinder och alla utdatafiler. Release-ID är `cf-` plus 24 tecken av SHA-256 över manifestet utan ID. Manifestets filposter innehåller full SHA-256. Identiskt innehåll och identiska käll-/verktygsfiler ger samma ID; ingen aktuell tid ingår i det deterministiska lokala manifestet.

Git-commit räcker inte för ospårade/ändrade filer. Därför binds `data/`, `lib/`, `public/`, snapshotverktygen, npm-låsfil, package.json och tsconfig.json även till verkliga filchecksummor. Inventering sker före modulimport och efter export. Om någon indata ändras stoppas körningen; omförsök görs i en ny process så att TS-modulcache inte kan återanvända tidigare läsning.

Utdata skrivs till en ny privat stagingkatalog och valideras före namnbyte. Befintligt mål avvisas; äldre snapshot skrivs inte över. En avbruten namnbytesfas kan lämna en tom reserverad målkatalog, men aldrig en giltig tidigare release som delvis skrivits över. Använd nytt målnamn vid omförsök. Ett snapshot är läsbart först när manifest och alla checksummor är godkända.

Filer under `data/`:

| Fil | Innehåll |
|---|---|
| dictionary.json | Oförändrade importerade ordposter; alla språkfält, betydelser, sortering och källidentifierare bevaras |
| corrections.json | Separata rättelser. Personfältet `skapadAv` utelämnas uttryckligen; källstöd, motivering och datum bevaras |
| definitions.json | Kurerade moderna definitioner; automatisk glosering lämnas åt samma domänfunktioner som dagens presentation |
| archive.json | Hela grammmatik-/textträden och dokumenten, inklusive historiskt offentliga utkast |
| homepage.json | Filkällans explicita startsidetext |
| resources.json | Filkällans bibliotek genom befintliga `medKallor`, inklusive källregister och bokvyreferenser |
| sources.json | Källregistret; inga underliggande skyddade PDF/XML-källfiler kopieras |
| runor.json | Publicerade pilot- och batch1-poster, filtrerade genom befintliga `toPublicPublishedItem` |
| assets.json | Ursprunglig lokal URL → checksummebundet filnamn, byte och SHA-256 |
| external-references.json | Inventering av externa referenser; innehåller även bibliografiska länkar och är inte en lista som får massnedladdas |

Ordboksposterna hydreras senare med samma proveniens-/presentationsfunktioner och rättelser/definitioner från samma snapshot. Rådatans checksumma och de separata redaktionella filerna låser just det innehåll som ska återges; de garanterar inte ännu korrekt artikel-HTML.

## Tillgångar

Alla 67 lokala `public/`-filer kopieras till `assets/<sha256>.<ändelse>` och får en URL-mappning. Två ursprungliga URL:er med samma byte kan dela fil. Ursprungliga URL:er ska ersättas av mappningen i senare statiska byggen; nuvarande applikationslänkar har inte ändrats.

`freeze-assets.mjs` kan frysa en uttrycklig privat URL-plan för offentliga Supabase Storage-objekt på exakt angiven HTTPS-origin. Signed URLs, query-parametrar, andra origins, redirects och filer över 25 MiB avvisas. Varje objekt läses två gånger och checksummorna måste stämma. Resultatet sparas privat med `rightsVerified: false`, `publishable: false`. Samma URL med andra byte ger annan hash och upptäcks vid en ny frysning. Två lika läsningar bevisar inte en transaktion mellan DB och Storage; bindningen till publicerad revision och återpubliceringsrätt måste verifieras separat.

Ingen karttile, bibliografisk länk eller privat bucket genomsöks. Storage-inventeringens metadata är inte ersättning för faktiska filchecksummor. Externa bilder som ska ingå i offentlig release måste uttryckligen godkännas och kopplas till samma publiceringsversion före CF06/10/11.

## DB-läsning utan trunkering

Den granskade DB-exporten körs med `scripts/cloudflare/sql/export-editorial.sql`: en enda SELECT aggregerar fyra uttryckligen valda tabeller och räknar dem i samma statement. Den returnerar en JSON-rad, utan standardfrågans radgräns på 1 000 innehållsposter. PostgreSQLs MVCC ger samma statement-snapshot åt delurvalen. Exporten innehåller privata redaktionsfält och lagras enbart privat. Parsefel, avbrutet svar och skillnad mellan arraylängd och exakt count är blockerande.

Detta är valt för den uppmätta lilla DB-exporten, inte en obegränsad framtida exportmetod. Vid stor DB väljs direkt läsanslutning med `REPEATABLE READ, READ ONLY` och cursor/keyset-sidor i samma transaktion, eller en immutabel publiceringsrevision med stabil nyckel, exakt antal och checksumma. Separata `.range()`-anrop mot levande tabeller räcker inte: stabil sortering undviker inte blandade revisioner. Ingen sådan anslutning/RPC/migration infördes här.

Se [PostgreSQL: transaktionsisolering](https://www.postgresql.org/docs/17/transaction-iso.html) och [Supabase: range](https://supabase.com/docs/reference/javascript/range).

## Valideringsgrind

`node --import tsx scripts/cloudflare/snapshot.ts validate <privat-katalog>` kontrollerar kontraktsversion, privat audience, publiceringsspärr, entydiga filvägar, saknade/extra filer, symlänkar, storlekar, filchecksummor och release-ID. Därefter kontrolleras ordboks-ID:n, rättelse-/definitionsmål, dokumentens nåbarhet och antal ordposter.

Detta är en integritetskontroll för betrodd lokal export. Det är inte en signatur eller en full säkerhets-/innehållsgrind för godtycklig indata. Produktionsbyggen måste dessutom kontrollera offentlig fälttillåtelselista, publicerad revision, källpolicy, alla innehållstyper/antal, rättigheter och hemligheter före offentlig export. Nuvarande verktyg tillåter därför ingen offentlig release.

## Reproducerbara kommandon

```sh
node --import tsx scripts/cloudflare/compare-sources.ts /privat/katalog/database.json
node --import tsx scripts/cloudflare/snapshot.ts export-local /privat/katalog/nytt-snapshot
node --import tsx scripts/cloudflare/snapshot.ts validate /privat/katalog/nytt-snapshot
node scripts/cloudflare/freeze-assets.mjs /privat/url-plan.json /privat/nya-bilder https://bekraftat-projekt.supabase.co
node --import tsx --test tests/cloudflare-snapshot.test.mjs
```

DB-exporten utfördes med den anslutna Supabase-tjänsten. Verktyget kan användas igen med SQL-filen; ingen DB-nyckel eller ny privilegierad databasfunktion krävs i repositoryt.
