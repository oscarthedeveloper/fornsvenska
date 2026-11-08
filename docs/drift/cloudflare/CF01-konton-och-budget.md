# CF01 – konton och gratisbudget

Datum: 2026-10-30. Status: **lokalt verifierad budget; konto- och planuppgifter verifierade i molnet; kedjeprov återstår**. CF01 är ännu inte fullt godkänd som fungerande publiceringskedja.

## Resultat och godkännandekriterier

Målmodellen har en möjlig kostnadsfri byggkedja: ett samordnat bygge på standard-Linux i GitHub Actions i det redan publika repot, följt av Wrangler Direct Upload till Pages. Valet är preliminärt tills konton och prototyper verifierats. Ingen workflow, tjänst, betalplan eller driftsättning har aktiverats.

För godkänd CF01 krävs dokumenterade leverantörsgränser, faktisk gratisnivå och förbrukning i berörda konton, plats för alla projekt, full releasebudget samt stopp vid kvotbrist. Officiella erbjudanden och en fungerande lokal kalkyl räcker inte som kontobevis. Kriterierna registrerades i STATUS.md innan budgetverktyget skrevs.

## Åtkomstmatris

| Tjänst | Kontrollerat | Återstående kontobevis |
|---|---|---|
| GitHub | Ansluten tjänst bekräftar publikt repo och administrativ behörighet. Webbläsaren visar Actions tillåtet, standardbehörighet read contents/packages. Kontots Actions-budget är $0 med status Usage blocked; aktuell månads metered usage visar inga data | Standard-Linux-jobb behöver köras i prototyp; exakt artifact/cache-lagring är inte verifierad av vyn utan användningsdata |
| Cloudflare Pages/Workers | Inloggad session. Workers Free är Current plan, $0. Workers & Pages visar inga projekt. Dagens anrop 0/100 000; månadens Workers build minutes 0/3 000 | Pages build count visas inte i granskad vy; Workers build minutes får inte förväxlas med Pages-kvoten. Skapande av nio projekt och Direct Upload ska provas i CF03; 48-timmarsgräns kan gälla |
| Supabase | Inloggad session för rätt befintligt projekt. Organisationen är Free, två projekt. Fornsvenskas DB 27,01 MB. Cykel 13 oktober–13 november: okachad egress 0,013 GB, cached 0,002 GB, Storage-sammanfattning 0,031 GB; inga overage-avgifter enligt vyn | Exakta aktuella bucketbyte, DB-innehåll/paritet och framtida index-/revisionsstorlek. Storage-detaljvyn anger periodmedel 0,03 GB, inte en full objektinventering |
| Resend | Inloggad session. Transactional Free: 2/3 000 e-post denna månad, 0/100 i dag. Transactional pay-as-you-go av och ej tillgängligt på Free. Domains visar No domains yet | Ingen verifierad avsändardomän; gratis domänverifiering och verklig leverans återstår i CF10, utan DNS-ändring denna etapp |


Kontroll av lokala variabler redovisade endast närvaro, aldrig värden. Avsaknad i de kontrollerade platserna betyder inte att användaren saknar konton. Inledningsvis visades inloggningssidor. Efter att användaren ordnat åtkomst kunde samma sessioner läsa kontona; matrisen ovan beskriver slutläget. Kontobevis utan personuppgifter finns i [CF01-kontobevis.json](./CF01-kontobevis.json).

En sökning efter Cloudflare/Supabase/Resend-anslutningar hittade en tillgänglig men ännu inte ansluten Supabase-plugin; den har föreslagits. Ingen Cloudflare- eller Resend-plugin hittades i denna sökning. Användaren ordnade därefter webbläsarinloggning till alla tre tjänsterna; Supabase-pluginen anslöts därefter och verifierade samma projekt som ACTIVE_HEALTHY och organisationens plan som free. Inga nya konton har skapats.

## Officiella gränser kontrollerade denna etapp

| Resurs | Dokumenterad gratisnivå | Betydelse |
|---|---|---|
| Pages | 500 byggen/månad, ett samtidigt bygge per konto, 20 min timeout | Hela releasekedjan delar budget; nio projekt ger inte nio oberoende 500-budgetar |
| Pages-filer | 20 000/projekt, 25 MiB/fil; 100 projekt/konto | Intern gräns 16 000 filer. Nykonton kan begränsas under första 48 timmarna |
| Redirects | 2 000 statiska och 100 dynamiska | Alla gamla ID:n måste täckas av testade regler |
| Functions/Workers | Delad kvot 100 000 anrop/dag, nollställs vid midnatt UTC | Vanlig läsning ska aldrig gå via funktioner |
| Workers Free | 10 ms CPU/anrop, 128 MB minne | Publiceringsfunktionen får förmedla ett jobb; stort export-/HTML-bygge hör hemma i byggmiljön |
| Supabase Free | 500 MB DB, 1 GB fillagring, 5 GB egress och separat 5 GB cached egress; två aktiva gratisprojekt; paus efter en veckas inaktivitet | Räkna inte cached egress som extra DB-exportbudget. Mät även redaktions-/authtrafik |
| Resend Free | 100 e-post/dag och 3 000/månad, tre verifierade domäner | Inkommande e-post och varje mottagare räknas; budgeten gäller hela kontot |
| GitHub Actions | Standardrunners för publika repos är gratis. Större runners kan debiteras; lagring är en separat kostnadsrisk | Välj standard-Linux, noll egna persistenta Actions-artefakter och cache i kandidatkedjan |

Källor: [Pages-gränser](https://developers.cloudflare.com/pages/platform/limits/), [statiska anrop och Functions](https://developers.cloudflare.com/pages/functions/pricing/), [Workers-gränser](https://developers.cloudflare.com/workers/platform/limits/), [Supabase-priser](https://supabase.com/pricing), [Supabase organisationsdebitering](https://supabase.com/docs/guides/platform/billing-on-supabase), [Resend-kvoter](https://resend.com/docs/knowledge-base/account-quotas-and-limits), [Actions-debitering](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

GitHubs aktuella dokumentation uttrycker inkluderad privat compute som belopp, inte ett generellt löfte om 2 000 minuter. Kandidaten bygger på det publika repots standardrunner, inte provkrediter eller privat minutpott. Actions är tillåtet och en stoppande Actions-budget på $0 är nu verifierad. Detta bevisar inte att ett releasejobb har körts. Inga inställningar ändrades.

## Kandidat för byggning och publicering

1. Redaktören sparar beständigt i redaktionslagret. Sparande startar inget bygge.
2. En separat Publicera-begäran kontrollerar aktuell adminroll, beständig jobbstatus, idempotens och kvotutrymme. Detaljer verifieras i CF05.
3. En betrodd releasekörning på standard-Linux fryser/exporterar en sammanhängande revision en gång. Samtliga delbyggen använder samma snapshot, inte nio separata DB-exporter.
4. Samma jobb bygger och validerar alla delar och laddar upp dem med Wrangler; huvudsajten aktiveras sist. Ingen kostnad för persistent Actions-artifact/cache införs. Inga privata snapshots läggs i Git, jobblogg eller publik artefakt.
5. Tre frysta snapshots och nödvändiga tillgångar budgeteras i privat beständig lagring för återbyggnad. Detta är en kandidat, inte ett verifierat rollbackflöde; CF11 måste visa kompatibel återställning av alla projekt.

Cloudflare dokumenterar [Direct Upload från lokal dator eller egen CI](https://developers.cloudflare.com/pages/get-started/direct-upload/) och [GitHub Actions med Wrangler](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/). Drag-and-drop har 1 000-filersgräns och duger inte för artikelgrupperna. Direct Upload-projekt kan inte senare växlas till Git integration utan nytt projekt. Projektvalet måste därför göras medvetet före skapande.

Dokumentationen ger här inget tillräckligt kontobevis för hur Direct Upload räknas mot månadskvoten. Kalkylen reserverar därför en Pages-operation för varje uppladdat projekt även vid preview, fel och omförsök; ingen obegränsad uppladdningskvot antas. Kontots verkliga redovisning måste kontrolleras med CF03-provet.

Alternativet Pages-byggen budgeteras med samma antal projektoperationer. Om varje delprojekt själv läser DB skulle exporten mångdubblas och innehållet kunna skilja sig mellan byggen. Alternativet kräver därför samma frysta snapshot och mätning av största delbyggnaden under 20 minuter. Det väljs inte som huvudkandidat före prototyperna.

Lokal gratisreserv: exportera samma godkända revision, bygg och validera lokalt, ladda upp via Wrangler till uttryckligen valda test-/releaseprojekt. Den kräver samma konto, filgränser och uppladdningskvot som CI och kan inte kringgå en förbrukad Pages-kvot. Reserven ersätter inte webbredigering. Ingen lokal reservpublicering är ännu implementerad eller provad.

## Konservativ månadsbudget

Reproducerbara indata finns i [CF01-budgetantaganden.json](./CF01-budgetantaganden.json); kör `node scripts/cloudflare/budget.mjs`. Verktyget gör inga nätanrop och godkänner aldrig molnberedskap. Resultatet finns i [CF01-budgetresultat.json](./CF01-budgetresultat.json).

| Antagande | Planeringsram |
|---|---:|
| Huvudsajt + sju artikelgrupper + redaktörsyta | 9 projekt per komplett försök |
| Produktionsreleaser/månad | 12 |
| Kompletta förhandsbyggen/månad | 8 |
| Extra kompletta misslyckanden/omförsök/månad | 6 |
| Kompletta etablerings-/testomgångar/månad | 2 |
| Totalt | 28 försök × 9 = 252 projektoperationer |
| Reserv för annan Pages-användning | 100 operationer |
| Kvar av 500 efter kandidat och reserv | 148 operationer |
| CI-tak per komplett försök, inklusive export/test/uppladdning | 30 minuter, ännu inte uppmätt |
| CI-tid vid detta tak | 840 minuter/månad på gratis standardrunner i publikt repo |
| Persistenta Actions-artifacts / cache för denna kedja | 0 byte / 0 byte |

Alla nio projekt antas ändras varje gång; ingen besparing från oförändrade grupper räknas hem. Misslyckade försök budgeteras som fulla omgångar. Tolv produktionsreleaser är en försiktig startpolicy, inte en utlovad kapacitet. Fler prototypomgångar än två kräver ombudgetering. Övrig faktisk kontoförbrukning kan överstiga reserven.

### Export, lagring och bilder

MB/GB i kalkylen är decimala byte, medan Pages filgräns anges i MiB. Den lokala ordboken är 42 086 164 byte och allt `data/` 44 459 354 byte. Detta är varken DB-diskstorlek eller full produktionssnapshot. Största lokala publika tillgången är 3 223 218 byte; molnets tillgångar är fortfarande oinventerade.

- Högst 75 MB snapshot + 25 MB exporterade refererade tillgångar per försök ger 28 × 100 MB = 2,8 GB. Lägg till 0,5 GB för redaktion/Auth/övrig trafik: 3,3 GB/månad mot internt tak 4 GB och dokumenterad 5 GB okachad kvot.
- Varje omförsök antas ladda ner på nytt. Samma tillgångar återanvänds av delbyggen inom jobbet. Refererade Supabase-bilder ska levereras statiskt till läsare, annars tillkommer besökartrafik utanför modellen.
- Tre snapshots à 75 MB + högst 400 MB originaltillgångar + 25 MB övrig lagring = 650 MB mot internt tak 700 MB och 1 GB leverantörsnivå. Permanenta lokala privata backuper behöver dessutom finnas före migrering.
- DB internt tak: 350 MB inklusive index, revisioner och jobbtabeller, under dokumenterade 500 MB. Det måste mätas i det riktiga projektet; 42 MB JSON bevisar inte att DB med index/revisioner ryms.

75/25/400 MB och 30 minuter är accepterbara planeringstak att pröva, inte mätresultat. Den nu verifierade DB-storleken 27,01 MB och låga egressen visar nuvarande marginal, men bevisar inte att framtida importer eller revisioner ryms. Överskridande kräver ändrad gratis teknisk modell, minskad publiceringsfrekvens eller ny prototyp. Det motiverar inte att kasta innehåll/revisioner eller byta till betalt. Redaktörens sparande och aktuella revision får inte raderas för att frigöra releaseutrymme.

### Funktioner och kontakt

Publik läsning/sökning budgeteras till **0** Functions-/DB-anrop. Administration, Publicera, kontakt och eventuellt externt run-API delar Workers dagskvot med kontots övriga funktioner. Före CF05/10 måste verkliga request-/CPU-tal och missbruksskydd mätas; 100 000 är ingen garanti för trafik under angrepp.

Kontakt får initialt högst 50 e-post/dag och 1 000/månad i applikationens budget, med avdrag för kontots övriga trafik. Resend räknar varje mottagare och även inbound. Inga testmeddelanden skickades. Kvotkontroll/rate limiting är krav till CF10, ännu inte införda.

## Beteende vid förbrukad kvot eller otillgänglig tjänst

- Bygg-/export-/lagringsgräns: avvisa eller köa Publicera med begripligt fel och beständig status. Ändra inte aktiv release; starta inga automatiska omförsök utan kvotkontroll.
- Gratis-CI saknas eller repo blir privat: stoppa CI-publicering, använd verifierad lokal reserv om övriga kvoter räcker. Välj inga större runners eller betalt compute automatiskt.
- Redaktions-DB är pausad: informera redaktören, invänta återstart. Redan publicerad HTML/sökdata ska fungera självständigt. Inga schemalagda keep-alive-anrop införs.
- Kontakt-/funktionskvot slut: visa fel endast för berörd funktion. Static assets för läsning ska inte routas via funktioner. Läsning får inte påverkas.
- Rollback ska i första hand återaktivera redan verifierade kompatibla versioner; om återbyggnad krävs måste även den rymmas i kvarvarande budget.

Detta är avsedd policy för senare implementation, inte ett påstående att dagens app redan har dessa spärrar.

## Kvarstående godkännande och nästa startpunkt

Konton/planer och GitHubs kostnadsspärr är molnverifierade enligt matrisen. Det samordnade publiceringsflödet är inte kört och ska inte beskrivas som molnverifierat. Följande återstår för fullt kedjegodkännande:

1. CF03: skapa avskilda testprojekt inom gratisnivån, kontrollera faktiskt tillåtet projektantal och uppladdningarnas redovisning. Noll befintliga projekt innebär inte bevis för att nio kan skapas omedelbart.
2. CF02: exportera rätt aktuellt innehåll, mäta snapshot/tillgångar och kontrollera DB-paritet. Förvånansvärt liten DB jämfört med 42 MB lokal ordboks-JSON får inte tolkas som saknat innehåll utan exportbevis.
3. CF05/11: ett autentiserat, beständigt publiceringsjobb på standard-Linux med kvotkontroll; mät tid och resursbehov mot kandidatbudgeten. Varken lokal backup eller kontoåtkomst bevisar detta flöde.
4. CF10: verifiera en avsändardomän kostnadsfritt eller prova den befintliga testavsändarens begränsningar. Dagens kod har `onboarding@resend.dev` som fallback. Ingen tyst ersättning av produktionsavsändare och inga DNS-ändringar har gjorts.

Ingen ytterligare inloggning behövs för denna etapps läsgranskning. För faktisk CI/deploy krävs senare snävt avgränsade autentiseringsuppgifter i betrodd miljö; inga sådana skapades eller exponerades nu. Supabase visar även loggkvoter med kommande ändringar 2027; kontrollera dem igen i CF12/14 och logga aldrig fulla snapshots eller hemligheter.

Beroenden: CF02 kan fortsätta med lokalt innehållskontrakt oberoende av CF01. CF03–CF05 kan förberedas lokalt men kan inte godkännas i molnet utan ovanstående; CF06 är därför inte upplåst. Full ombyggnad CF07–CF11 börjar inte på enbart denna kalkyl.

Ändrade filer i CF01: denna rapport, STATUS.md, CF01-budgetantaganden.json, CF01-budgetresultat.json, CF01-kontobevis.json och `scripts/cloudflare/budget.mjs`. Kontroll: beräknat normalfall, kvotöverskridande och ogiltigt projektantal; normalfall 252 operationer, 3,3 GB egress, 650 MB lagring. Ingen ändring av applikation, databas eller produktion. Inga secrets/deploy-hook-URL:er sparade.

## Komplettering: ansluten Supabase-tjänst

Efter användarens anslutning verifierades projektlistan, rätt Fornsvenska-projekt och organisationens Free-plan även via Supabase-tjänsten. En läsgranskning av `public` listar elva tabeller, alla med RLS aktiverat. Inga ordbokstabeller listas i detta schema. Verktygets radvärden är inte kontrollerade med exakt räkning och används inte som bevis på tom databas. CF02 måste fastställa vad som faktiskt är auktoritativ källa och vilka tabeller/scheman som används, innan en exportväg väljs. Ingen SQL, migration eller innehållsändring kördes.
