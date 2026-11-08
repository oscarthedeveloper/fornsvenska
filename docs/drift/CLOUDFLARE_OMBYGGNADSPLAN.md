# Ombyggnadsplan: Fornsvenska på Cloudflare Pages Free

Datum: 2026-10-30. Status: **planerad; inga genomförandeetapper är påbörjade**.

Mottagare: den AI som ska genomföra ombyggnaden i detta repository. Läs hela planen före ändringar och arbeta vidare till verifierad leverans. Detta dokument är en arbetsinstruktion, inte ett protokoll över utfört arbete.

## Uppdrag och bindande produktkrav

Fornsvenska är ett hobbyprojekt. Netlify och sedan Vercel har nått gratisgränser inom kort tid. Uppdraget är att minska behovet av serverkörning och prova långsiktigt kostnadsfri drift på Cloudflare Pages Free. En oförändrad dynamisk Next.js-app på en annan gratisplattform är inte lösningen.

Användaren har uttryckligen valt:

- Ingen återkommande hostingavgift, inga provkrediter som förutsättning och ingen automatisk förbrukningsdebitering. Befintlig domänförnyelse räknas separat.
- Samtliga ordartiklar ska ha egen sida med full offentlig artikeltext och unik metadata i det initiala HTML-svaret. En gemensam JavaScript-vy uppfyller inte kravet.
- Redigering ska finnas i webbläsaren. Separat Publicera-knapp är accepterad; lokal redigering är inte huvudflödet.
- Artiklar får flyttas till underdomäner om gamla länkar fortsätter fungera genom permanenta omdirigeringar.
- Utseende, innehåll, källhänvisningar, sökning och studiedata ska bevaras. Eventuella nödvändiga funktionsförändringar måste redovisas och avgöras före borttagning.

Planen ger utrymme för rutinmässiga tekniska beslut och reversibla lokala ändringar. Den ger inte tillstånd att köpa tjänster, skapa nya konton för att utöka kvoter, acceptera nya bindande villkor, radera produktionsdata eller flytta produktions-DNS utan godkänd testversion och uttryckligt klartecken för flytten. Följ även värdmiljöns behörighetsregler. Fråga inte om lov för varje etapp eller rutinmässig lokal ändring.

## Läsunderlag och källornas status

1. [Krav och publiceringsmodell](./CLOUDFLARE_KRAV_OCH_PUBLICERINGSMODELL.md).
2. [Maskinellt verifierad lokal inventering](./CLOUDFLARE_INVENTERING.json).
3. Aktuell kod, `package.json`, `package-lock.json`, `KALLPOLICY.md`, `SUPABASE.md` och tillämpliga `AGENTS.md`.
4. `docs/drift/NETLIFY_OPTIMERINGSPLAN.md` och äldre E-rapporter är historik. Flera av deras beskrivningar är inaktuella. Härled inte dagens rotlayout, datakälla eller säkerhet från dem.

Inventeringen gjordes vid commit `4237cd31f49bcf7fd12b52b4855b7eed9c647b96`. Den visar 41 744 lokala ordposter med unika ID:n, 42 086 164 byte rå JSON och cirka 10,2 MB gzip. Den verifierar inte produktionsdatabasen, aktuell molnkonfiguration, färdiga exportfiler eller mobilprestanda. Kontrollera ändringar sedan denna commit; återställ aldrig andras arbete för att passa planen.

## Målarkitektur

```text
Redaktör i webbläsaren
  -> Supabase Auth + beständigt redaktionslager med RLS/RPC
  -> behörighetskontrollerad publiceringsbegäran
  -> fryst innehållsversion + bygge + verifiering
  -> statisk huvudsajt och separata statiska ordboksdelar

Läsare/sökmotor
  -> HTML, CSS, JS, bilder och versionsbundna datafiler på Pages
  -> ordbokssökning och textuppslag i webbläsaren
  -> inga Next.js-/Worker-/Supabase-anrop för vanlig läsning och sökning

Kontakt och eventuellt externt run-API
  -> separata, snävt avgränsade gratisfunktioner
```

Utgångspunkt: huvudsajt på `www.fornsvenska.se`, cirka sju ordboksprojekt på underdomäner och en gemensam redaktörsyta, exempelvis `admin.fornsvenska.se`. Namn och slutligt projektantal bestäms efter prototyper. Återanvänd befintliga komponenter och rena domänfunktioner; ett ramverksbyte är inte ett mål. Om en liten separat statisk artikelbyggare är mer ändamålsenlig än full Next.js-export, dokumentera valet och håll presentation/metadata gemensamma.

Föreslagen ID-fördelning finns i inventeringen. Den använder första tecknet efter `--`, inte postens `letterSection`. Största gruppen är 6 900 artiklar. Antagandet två filer/artikel plus gemensamma tillgångar är bara ett räkneexempel. Varje faktisk byggmapp ska räknas.

## Arbetsdisciplin och leveranser

- Använd en separat gren med prefix `codex/` om inte aktuell miljö eller användaren anger annat. Gör ändringarna granskningsbara och undvik att blanda ombyggnad med innehållsredigering.
- Skapa `docs/drift/cloudflare/STATUS.md` och en kort rapport per etapp. Statusar: planerad, pågår, lokalt verifierad, molnverifierad eller blockerad. En molnberoende etapp får inte markeras klar med enbart lokala tester.
- Varje rapport anger ändrade filer, genomförda kontroller, resultat, kvarstående risker och nästa startpunkt. Spara mätmiljö och relevanta råvärden utan cookies, token eller personuppgifter.
- Sätt godkännandekriterier före implementation. Lägg tester på verkliga risker: språkregler, innehållsparitet, behörigheter, lagring, routing och releasefel. Undvik tester som bara återger implementationen.
- Om kontoåtkomst saknas: fortsätt oberoende lokalt arbete. Dokumentera exakt vad som saknas och vilka efterföljande etapper som inte kan godkännas. Kravändringar eller betalning får inte antas som lösning.
- Vid misslyckad prototyp: ändra målmodellens tekniska del inom användarens krav och prova igen. Om kraven inte kan förenas inom gratisdrift, redovisa konflikten innan stor ombyggnad fortsätter.

## Etappöversikt

| Etapp | Leverans | Kräver |
|---|---|---|
| CF00 | Återställningsbar utgångspunkt och baslinje | — |
| CF01 | Verifierad gratisbudget och åtkomstmatris | CF00 |
| CF02 | Innehållskontrakt och exporterbart snapshot | CF00 |
| CF03 | Prototyp för HTML, filbudget och gamla länkar | CF01–02 |
| CF04 | Prototyp för gemensam ordlista över underdomäner | CF00–01 |
| CF05 | Prototyp för beständig webbredigering och publicering | CF01–02 |
| CF06 | Fastställd arkitektur och mätbudget | CF03–05 |
| CF07 | Publik statisk huvudsajt | CF06 |
| CF08 | Produktionsklar statisk ordbok och klientbaserad sökning | CF06 |
| CF09 | Fullständig webbredaktion | CF05–06 |
| CF10 | Kontakt, run-API och externa tillgångar | CF06 |
| CF11 | Samordnad byggning, release och återställning | CF07–10 |
| CF12 | Samlad lokal och molnbaserad acceptans | CF11 |
| CF13 | Testleverans, godkännande och produktionsflytt | CF12 |
| CF14 | Uppföljning och förvaltningsöverlämning | CF13 |

CF03–CF05 är avgränsade genomförbarhetsprov. Full ombyggnad börjar först efter CF06. Oberoende arbete kan ordnas effektivt utan att ändra etappernas beroenden.

## CF00 – Säkra nuläge och baslinje

**Arbete:** Läs aktuell Git-status och lokala instruktioner. Registrera verkliga versioner, datakällor och byggkommandon. Bevara de två befintliga Cloudflare-underlagen även om de ännu är ospårade. Säkerhetskopiera innehåll och dokumentera återställning innan någon datamigrering görs; kopiera inte hemligheter till repo eller rapporter.

Kör relevanta befintliga kontroller och registrera redan existerande fel separat. Dokumentera ett produktionsbygge lokalt, om möjligt, och besökarresor: text till orduppslag; ordbokssökning/filter/artikel/återgång; grammatik och källhänvisning; bokläsare; runkarta/filter/detalj; ordlista/export; redigering/spara/ladda om. Produktionens paus får inte behandlas som ett prestandatest.

**Leverans:** `CF00-nulage.md`, funktionsmatris, referensbilder för huvudvyer och reproducerbar baslinje. Ange vad som kan och inte kan testas utan molnåtkomst.

**Godkänt när:** utgångspunkten kan återskapas och funktionskraven går att följa genom resten av planen. Inga tidigare rapporters testpåståenden har okritiskt återanvänts.

## CF01 – Gratisbudget och molnåtkomst

**Arbete:** Kontrollera aktuell officiell dokumentation och verkliga konton för Pages, Workers, Supabase, Resend och vald byggtjänst. Utgångsvärden från 2026-10-30: Pages Free 20 000 filer/projekt, 25 MiB/fil, 500 byggen/månad, 20 min byggtimeout och dokumenterad gräns 100 projekt/konto; `_redirects` högst 100 dynamiska och 2 000 statiska regler. Functions/Workers Free delar en dagskvot. Kontospecifika villkor gäller vid faktisk användning.

Beräkna hela publiceringskedjan inklusive förhandsbyggen, misslyckade försök, samtliga delprojekt, CI-minuter, artefaktlagring, DB-export och bilder. Välj mellan Pages-byggen och en verifierad gratis CI-kedja; dokumentera lokal gratisreserv. Ett lokalt bygge är en publiceringsreserv, inte en ersättning för redigering i webbläsaren. Spara inga deploy-hook-URL:er eller åtkomsttoken i rapporter.

**Leverans:** `CF01-konton-och-budget.md` med kontoåtkomst, gränser, konservativ budget för publiceringsfrekvens och beteende när en gräns nås. Räkna inte 500 byggen som 500 kompletta releaser över alla projekt.

**Godkänt när:** inga betalda resurser krävs för den valda kedjan och vanliga läsresor inte beror på funktionskvoten. Om ett konto måste anslutas ska behovet vara konkret beskrivet; resten av det lokala arbetet kan fortsätta.

## CF02 – Innehållsparitet och publiceringssnapshot

**Kodankare:** `lib/archive.ts`, `lib/sidor.ts`, `lib/resurser.ts`, `lib/ordbok/ordbokDb.ts`, `lib/ordbok/rattelser.ts`, `lib/ordbok/modernisering.ts`, `lib/runor/server.ts`, `lib/runor/contract.ts` och relevanta SQL-filer.

**Arbete:** Kartlägg auktoritativ källa per innehållstyp. Jämför filer med aktuell DB när åtkomst finns. Exportera dokumentträd, artiklar, startsida, resurser, publicerade runversioner, rättelser, moderna definitioner och tillgångsreferenser. Hantera Supabases paginering; ett standardsvar med radbegränsning är inte en full export.

Definiera ett versionsbundet snapshot med schema-/release-ID, datakällor, postantal och checksummor. Läsningar under export ska ge en sammanhängande version, exempelvis genom transaktion eller versionskontroller med omförsök. Versionsbind refererade bilder; identisk URL med ändrat filinnehåll får inte ge odetekterbar blandning. Skilj publicerad revision från pågående redaktion, utan att automatiskt dölja tidigare offentligt material märkt som utkast. Bevara språkdata, proveniens, rättelser och källpolicy. Exportfel ska stoppa publicering och lämna tidigare publicering fungerande.

**Leverans:** snapshotkontrakt, export-/valideringsverktyg och `CF02-innehallsparitet.md`. Privata snapshots och DB-backuper lagras utanför Git och publika byggmappar; enbart tillåtna offentliga data får bli offentliga artefakter.

**Godkänt när:** fullständighet och innehållsparitet är maskinellt kontrollerbara, aktuellt dataurval är känt och inget tyst byte till gamla filfallbacks sker. Aktuellt postantal kan avvika från 41 744 om verkliga källor har ändrats; varje skillnad måste förklaras.

## CF03 – Prova artikel-HTML, uppdelning och omdirigeringar

**Arbete:** Bygg en liten artikelprototyp från snapshotet, med full artikel och verklig metadata utan JavaScript. Välj sedan preliminär exportmetod och bygg hela den största ordgruppen för att mäta alla filer, storlekar, minne och byggtid. Pröva hur gemensamma komponenter, hydrering och RSC-/JSON-filer påverkar antalet; skär inte bort hydreringstillgångar som gränssnittet behöver.

Generera en enda deterministisk ägarfunktion för ID till grupp/värd och använd den för filer, länkar, sitemaps, sökresultat och redirectregler. Behåll äldre gruppägarskap vid framtida tillväxt. Prova kompakta prefixregler med specialtecken, kodade/okodade URL:er, query-parametrar och regelprioritet. Prefixen följer ID, inte alfabetisk visningssektion. Kontrollera att alla ID:n får exakt ett mål och att inga redirectloopar skapas.

Gör en minimal molnverifiering på testprojekt innan reglerna betraktas som fungerande. Testa 301 till riktig 200-artikel, canonical, direktlänk, trailing slash, Unicode och verklig 404. Pages `_redirects` kan inte användas som proxy till andra projekt. Lägg inte en Worker framför all läsning för att behålla en enda origin.

**Leverans:** `CF03-html-routing-och-filbudget.md`, faktiskt exporterad filrapport och reproducerbara testfall. Testresurser och värdar ska vara tydligt avskilda från produktionen.

**Godkänt när:** exportmetoden ryms med marginal i största gruppen, alla ID:n har en entydig rutt och molnet har verifierat riskfallen. Intern utgångsbudget är högst 16 000 filer/projekt, aldrig över leverantörens gräns. Alla extra filer räknas. Om sju grupper inte räcker, föreslå stabil fördelning som gör det; lås inte antalet av bekvämlighet.

## CF04 – Prova gemensam personlig ordlista

**Kodankare:** `lib/ordbok/bokmarken.ts`, `components/ordbok/BokmarkenPanel.tsx`, `BokmarkeKnapp.tsx`, `BokmarkenTrigger.tsx` och `components/text/OrdbokUppslagPanel.tsx`.

**Arbete:** Bevara befintlig lagringsnyckel och data på `www.fornsvenska.se`. Prova en gemensam origin för ordlistan, exempelvis en avgränsad iframe-/postMessage-brygga. Tillåt bara kända exakta origins, validera meddelanden och använd korrelations-ID, timeout och tydliga fel. Överför inte auth-token genom bryggan. Prova verkliga underdomäner under samma domän; skilda `pages.dev`-adresser kan ge andra same-site-villkor och räcker inte som enda bevis.

Testa läsa/spara/ta bort/anteckna/exportera från huvudsajt och två artikelvärdar, samtidiga flikar och blockerad inbäddad lagring i relevanta webbläsare. Fråga inte efter nya användarkonton och flytta inte privat studiedata till molnet. Om en brygga inte är tillförlitlig: prova en användbar central ordlistevy med säker toppnivånavigering. En sådan förändring ska visas för användaren innan den ersätter nuvarande interaktion.

**Leverans:** `CF04-ordlista-over-origins.md`, verifierad reserv och dataåterställning via export/import.

**Godkänt när:** tidigare ord och anteckningar finns kvar och användaren inte får separata ordlistor per underdomän. Saknad åtkomst får inte visas som en tom lista och sedan skriva över befintlig data.

## CF05 – Prova beständig redigering och publicering

**Arbete:** Genomför ett vertikalt prov: logga in i webbläsaren, ändra ett litet innehållsobjekt, spara, ladda om, begär publicering och se den nya revisionen i en statisk testutgåva. Efter sparning men före publicering ska tidigare publik revision fortsätta visas. Återskapa samma data efter ny session; klienttillstånd räcker inte som lagringstest.

Verifiera verklig RLS och adminroll för läsning av redaktion och samtliga mutationer. Välj en beständig modell för ordredaktionens befintliga filskrivningar. Begränsa publiceringsbegäran till aktuell adminroll på servern, med persistent status och idempotens. Bygghemligheter ligger bara i betrodd tjänst/byggmiljö. Prova obehörig, utloggad och återkallad roll samt dubbel publicering och byggfel. Delad adminsession över alla artikelvärdar är inte förutsatt.

**Leverans:** `CF05-redigering-och-publicering.md` och valt huvudflöde: spara, förhandsgranska, publicera, följ status, återställ. Alla kostnadsberoenden ska vara kända.

**Godkänt när:** webbredigering är beständig och behörighetsskyddad, inga offentliga besök kräver redaktions-DB och ett avsiktligt publiceringsfel lämnar tidigare statiska version läsbar.

## CF06 – Lås tekniska beslut före full ombyggnad

**Arbete:** Sammanställ resultaten från CF03–CF05. Lås exportmetod, gruppfördelning/värdar, ruttkontrakt, snapshotformat, sökindexstrategi, ordlistelösning, redaktörsplacering och gratis byggkedja i `CF06-arkitekturbeslut.md`. Skilj beslut från antaganden och uppdatera status/kravunderlag utan att radera historiken.

Fastställ prestandabudget med baslinjen: komprimerade byte och JS för första sida, första uppslagsordssökning och första fulltextsökning, antal statiska förfrågningar, minnesbehov, varm/kall söktid och största bygge. Ange testad enhet, nätprofil och antal observationer. En stor fulltextindexnedladdning kräver aktivt metodval, inte bara gzip på hela rådatabasen. Fulltext kan laddas separat efter behov; grundsökning får inte kräva all artikeldata.

**Leverans:** `CF06-arkitekturbeslut.md` med beslut, bevis från prototyperna, prestandabudget och kvarstående avgränsningar.

**Godkänt när:** alla tre prototypernas nödvändiga moln-/webbläsarprov har klarats eller en verifierad alternativ teknisk modell uppfyller samma krav. Betalda tjänster, försämrad SEO eller borttagen redigering är inte automatiska alternativ.

## CF07 – Statisk huvudsajt och offentlig datagräns

**Arbete:** Inför byggbaserad offentlig läsning från snapshot för startsida, grammatik, texter, resurser och runor. Generera alla giltiga routes, inklusive arkivrötter och mappar. Separera redaktörens data/komponenter från publik läsväg så att Server Actions, cookieklient och sessionsmiddleware inte behövs där. Alla godkända innehållsändringar blir synliga via ny publicering, inte genom ISR på besökarnas anrop.

Bevara layout, animationer, specialtypsnitt, tillgänglighet, bilder, bokvy, fotnoter och källhänvisningar. Hantera `next/image`, redirects och övriga serverberoenden uttryckligen för vald exportmetod. Uppdatera testmiljöernas robots/noindex; befintlig Netlify-variabel är inte en tillräcklig Cloudflare-lösning.

**Leverans:** fungerande statiskt huvudbygge och `CF07-huvudsajt.md`.

**Godkänt när:** webbplatsens läsdel fungerar från en vanlig statisk server utan Next.js-process, med korrekta 404:or och samma offentliga innehåll. Blockera Supabase och applikationens funktionsadresser under lästest; innehållet ska fortfarande gå att läsa. Externa kartbilder/typsnitt identifieras separat.

## CF08 – Fullständig ordbok och sökning i webbläsaren

**Kodankare:** `app/ordbok/*`, `components/ordbok/*`, `lib/ordbok/ordbokServer.ts`, `normalisering.ts`, `kandidater.ts`, `proveniens.ts` och `components/text/*`.

**Arbete:** Generera samtliga artikel-HTML-sidor, metadata, rättelser, moderna definitioner, källor och relaterade länkar. Flytta query-baserad söklogik och textuppslag till en ren delad motor och byggda index; importera inte Node-filsystem eller hela rådatabasen i klientpaketet. Använd Web Worker där det behövs för att hålla gränssnittet responsivt. Hantera versionsbunden cache, avbrutna sökningar, inaktuella svar och fel vid delnedladdning.

Bevara exakt/förleden/alias och befintlig rangordning, Söderwalls alfabet, homonymer, datasetfilter, sidindelning, artikeltextsökning och morfologiska uppslag. Skapa en representativ paritetskorpus mot dagens motor, inklusive NFC, þ/th/dh, æ/ä, ø/ö, w/v, tom fråga, inga träffar och kombinerade filter. Kontrollera att eventuella skillnader mellan dagens fil- och DB-adapter hanteras avsiktligt. Bevara delbara sökparametrar och bakåt/framåt utan ny serverrendering.

**Leverans:** alla ordboksdelar, versionsbundet sökindex, integrerade textuppslag och `CF08-ordbok.md` med före/efter-mätning.

**Godkänt när:** alla snapshot-ID:n motsvarar riktig HTML, artikeltext och metadata; sökparitet är dokumenterad; huvudresorna gör noll publika funktions-/DB-anrop. Kontrollera alla filer maskinellt och ett spritt urval visuellt. Inga hela rådata följer med till varje besökare. Mät kalla och varma mobilresor mot CF06-budgeten; rapportera avvikelser innan budgeten ändras.

## CF09 – Komplett webbredaktion

**Arbete:** Bygg vidare på CF05 till startsida, träd/mappar, dokumentblock, texter, hyllor/resurser/omslag, ordrättelser, moderna definitioner och runredaktion. Återanvänd befintliga redigeringskomponenter där möjligt. Publicera-knappen är separat från autosparning, som ska ha beständig och tydlig sparstatus. Visa aktuell sparad revision, publicerad revision och förhandsgranskning. Hantera samtidiga redigeringar eller varna för konflikter i stället för tyst överskrivning.

Flytta lokala filskrivningar till valt beständigt lager. Säkerställ att publicering tar med de nya revisionerna, inte bara ursprungliga importfiler. Håll privata utkast/administrativa uppgifter utanför offentlig snapshot. Bevara redaktionella källkrav och rättelsernas proveniens. Runredaktionens tidigare tillståndsändring i minnet får inte bli en falsk lyckad sparning i den nya ytan.

**Leverans:** webbredaktion och `CF09-redaktion.md` med behörighets-/lagringsmatris och migreringsjournal.

**Godkänt när:** varje innehållstyp kan ändras, laddas om, förhandsgranskas och publiceras; obehöriga försök nekas av backend. Testa även uppladdningar, avbruten nätanslutning och utloggning. Datamigrering är reversibel och historiska rättelser finns kvar.

## CF10 – Kontakt, run-API, kartor och externa tillgångar

**Arbete:** Återanvänd kontaktvalideringen och Resend där gratisnivån räcker. Håll API-nyckel serverhemlig, lägg på verifierat spamskydd, begränsad indata och kvot-/felhantering. En honeypot eller klientflagga ensam räcker inte för att begränsa missbruk. Kontaktfel ska inte göra andra routes otillgängliga.

Publicera versionsbundna statiska runexporter. Bevara äldre API-beteende för parametrarna `format`, `placement`, `province`, `carrier`, `q`, `version`, slug-uppslag, CORS och OPTIONS där kontraktet kräver det. Om en avgränsad kompatibilitetsfunktion behövs används den endast av externa API-klienter; den publika kartan/filtervyn ska använda statiska data. Ändra inte kontrakt eller publiceringsurval tyst.

Inventera Supabase-bilder, bokfiler, externa karttiles och typsnitt. Kopiera bara offentliga tillgångar som får återpubliceras, under filgränser och med rätt attribution. Karttiles ska användas enligt leverantörens villkor; ingen massnedladdning som genväg.

**Leverans:** `CF10-integrationer.md`, kompatibilitetstester och lista över kvarvarande externa anrop/kvoter.

**Godkänt när:** kontakt fungerar i verifierad testmiljö och API-kontrakt/attribution består. Skicka inte testmeddelanden till andra utan användarens uttryckliga instruktion; använd mockad e-postadapter lokalt och redovisa om verklig leverans ännu inte har verifierats.

## CF11 – Byggkedja, samordnad release och återställning

**Arbete:** Gör snapshot, sökindex, HTML, sitemaps, assets och redirects reproducerbara med gemensamt release-ID. Lägg automatiska kontroller före publicering: schema, innehåll, ID-ägarskap, filantal, största fil, hemlighets-/privatdata och ruttbudget. Publicera inte huvudindexet om någon artikelgrupp saknas.

Bygg/testa alla delar före aktivering. Deploya innehållsdelarna först och huvudindex sist. Pages-projekt växlar inte atomiskt: dokumentera blandversionsfönster och designa data/länkar så att gamla öppna klienter och tidigare publika versioner fungerar under övergången. För borttagningar och ändrade dataformat behövs uttrycklig kompatibilitetsstrategi; anta inte att gamla indexfiler finns kvar efter nästa deploy. Att behålla historiska filer påverkar filbudgeten och ska räknas.

Publiceringsjobb ska ha ID, aktör, snapshotversion, projektstatus och felmeddelanden i beständigt lager. Dubbelklick blir ett jobb, autosparning blir inget jobb. Skydda deploy-hemligheter och publiceringsendpoint med autentisering, aktuell adminroll, CSRF-/originhantering där relevant och kö-/frekvensbegränsning. Återställning återaktiverar en tidigare kompatibel utgåva över samtliga berörda projekt och får inte skriva över senare redaktionella revisioner.

**Leverans:** verktyg/CI, operatörsinstruktion, `CF11-release.md` och dokumenterad felinjektion i testmiljö: misslyckad gruppdeploy, avbrutet bygge, dubbelbegäran, inaktuellt klientindex och återställning.

**Godkänt när:** ett faktiskt avbrutet testjobb inte lämnar brutna publicerade länkar eller statusen färdig. Ett helt releasevarv och rollback har verifierats; kvoter och alla kvarvarande filer ryms med marginal. Rapportera verklig konsistens, inte påstådd global atomisk publicering.

## CF12 – Samlad acceptans

**Arbete och obligatoriska kontroller:**

- Fullständighetskontroll för samtliga ID:n: en ägare, en fungerande canonical, artikeltext och metadata i initial HTML. Testa HTTP/status/content-type och okända ID:n; en redirect eller ett demosvar räcker inte.
- Lokal täckning av samtliga gamla ordlänkar samt molnprov av varje regeltyp, källa, specialtecken och frågesträng. Bevara sökkontext eller återgång där den tidigare finns. Undvik redirectkedjor och loopar.
- Funktionsmatrisen från CF00: textuppslag, sökning, alla filter, bakåt/framåt, bokmärken/anteckningar/export, fotnoter, bokvy, karta och redaktion.
- Statiskt huvud-/artikelbygge utan Next-server. Blockerade funktions-/DB-anrop ska inte stoppa anonym läsning eller sökning. Tillfälligt pausad redaktions-DB ska lämna redan publicerat innehåll fungerande.
- Säkerhetsprov för obehörig mutation, återkallad adminroll, utkast i export, publiceringsendpoint och frånvaro av hemligheter i samtliga publika artefakter.
- Mobil/dator och relevanta webbläsare: tangentbord, fokus, skärmläsaretiketter, reduced motion och huvudsakliga layouter. Särskilt ordlistebryggans reserv provas under blockerad lagring.
- Prestanda mot CF06-budgeten och verkligt filantal/storlek/byggtid per projekt. Rapportera antal körningar; redovisa inte p95 från bara fem mätningar.
- Kör projektets relevanta kontroller för typer, byggning, källor och texter. Bevara och redovisa befintliga fel; maskera dem inte genom att ta bort valideringen.
- Kontrollera att testmiljön har noindex och inte listar produktionslänkar som egen canonical. Detta är inte åtkomstskydd för privata förhandsgranskningar.

**Leverans:** `CF12-acceptans.md` med godkänt/underkänt per krav, mätdata och reproducerbara steg. Kontrollera eventuella konto-/leverantörsändringar sedan CF01.

**Godkänt när:** inga obligatoriska krav saknar belägg och inga väsentliga funktions-/innehålls-/säkerhetsfel återstår. Saknad molnåtkomst redovisas som återstående verifiering, aldrig som godkänt.

## CF13 – Testleverans och kontrollerad produktionsflytt

**Arbete:** Ge användaren en konkret testversion och kort testinstruktion: läs, sök, bokmärk, redigera, publicera. Redovisa alla beteendeförändringar, underdomäner, återstående begränsningar och verifierad gratisbudget. Låt användaren granska innan produktionsdomänen flyttas.

Förbered DNS-plan med nuvarande värden, apex/www/ordboks-/adminvärdar, HTTPS, canonical/redirectpolicy och återställningskommandon. Bevara e-postens MX/TXT/SPF/DKIM/DMARC och andra tjänster. Om namnservrar måste ändras ska hela zonen inventeras först. Flytta inga hemligheter eller privata förhandsvyer till publika adresser.

Efter användarens uttryckliga klartecken för domänflytt: genomför och verifiera faktiska produktionsvärdar, certifikat, gamla ordlänkar, publicering och kritiska resor. Kontrollera att produktions-robots tillåter avsedd indexering och sitemaps pekar på rätt värdar. Behåll tidigare kod/driftkonfiguration för återställning. Den tidigare Vercel-miljön kan vara pausad och är inte en verifierad fungerande reserv bara för att DNS kan ändras tillbaka.

**Leverans:** fungerande produktionsadresser och `CF13-driftbyte.md` med verifierat resultat/återställningsläge. Om godkännande eller kontoåtkomst saknas: leverera färdig testversion och konkret återstående åtgärd; markera inte produktionsflytten som gjord.

**Godkänt när:** användaren har godkänt testversion och produktionsflytt, och kritiska resor, HTTPS, gamla länkar och publicering har verifierats på produktionsvärdarna. Enbart färdig testleverans räcker inte för att markera denna etapp klar.

## CF14 – Uppföljning och överlämning

**Arbete:** Leverera korta instruktioner för redigering, publicering, backup, återställning, ny artikel, tillväxt i största gruppen och kontroll av gratisgränser. Ange vilka delar som fungerar om redaktionen eller kontaktfunktionen ligger nere. Dokumentera revisions-/releaseformat och var hemligheter hanteras, utan att skriva ut dem.

Gör första driftkontroll efter flytten och ange uppföljningspunkter efter ungefär ett dygn, en vecka och en månad: felaktiga gamla länkar, filantal, statisk trafik, eventuella funktionsanrop, DB-/bildtrafik, byggbudget och kontaktkvot. Skapa inte automatisk återkommande körning om användaren inte uttryckligen ber om det. En månads stabil drift får inte markeras verifierad vid första leveransen.

**Leverans:** `CF14-forvaltning.md`, slutlig status och tydlig lista över vad som är lokalt verifierat, molnverifierat, produktionsverifierat respektive framtida uppföljning.

**Godkänt när:** förvaltningsöverlämningen och första driftkontrollen är genomförda. Senare dygns-, vecko- och månadskontroller har varsin separat status och får stå som planerade utan att påstås genomförda.

## Definition av färdig leverans

Ombyggnaden är färdig för granskning när CF00–CF12 är verifierade och testversionen visar alla avtalade funktioner inom gratisdrift. Produktionsleveransen är färdig först efter genomförd och verifierad CF13. Uppföljning under en hel månad är en separat observation i CF14; den är inte ett löfte om att någon gratisleverantör aldrig ändrar villkor eller får driftstörningar.

Slutrapporten ska innehålla faktiska adresser, vad som ändrats, tester och deras begränsningar, gratisbudget, data-/säkerhetsstatus samt hur användaren redigerar och publicerar. Sammanfatta inte endast antal ändrade filer eller lokalt passerande tester.

## Startinstruktion till genomförande AI

> Genomför denna plan i Fornsvenska-repositoryt. Läs först hela planen, kravmodellen och inventeringen. Börja med CF00 och håll status löpande. Prova de osäkra delarna i CF03–CF05 innan full ombyggnad. Fortsätt självständigt med allt som är auktoriserat och möjligt; dokumentera konkreta externa hinder. Bevara gratisdrift, full HTML för alla ordartiklar, webbredigering och fungerande gamla länkar. Inför inga betalda beroenden eller tysta funktionsborttagningar. Förbered och verifiera en komplett testleverans innan produktionsflytt begärs. Följ etappernas godkännandekriterier och redovisa ärligt vad som faktiskt har verifierats.

## Officiella referenser

Kontrollerade i förarbetet 2026-10-30; CF01 ska kontrollera igen mot aktuellt konto och valda versioner.

- [Pages-gränser](https://developers.cloudflare.com/pages/platform/limits/)
- [Statiska anrop och Functions-kvot](https://developers.cloudflare.com/pages/functions/pricing/)
- [Workers-gränser](https://developers.cloudflare.com/workers/platform/limits/)
- [Redirects och begränsningar för proxy](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Egna domäner](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Next.js 14: statisk export](https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports)
- [Supabase gratisnivå](https://supabase.com/pricing)
- [Resend gratisnivå](https://resend.com/pricing)
