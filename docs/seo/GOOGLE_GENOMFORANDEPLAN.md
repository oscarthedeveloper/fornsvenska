# Fornsvenska.se: genomförandeplan för Google-sök

Version 1.0, 2026-10-25. Överlämning till en annan AI.
Status: granskning och plan klara; SEO-ändringar och Search Console-inlämningar inte utförda.

## Uppdrag

Förbättra upptäckt, indexerbarhet, relevans och presentation i Google utan att försämra besökarupplevelsen. Arbeta först med drift och teknisk upptäckbarhet, därefter metadata, internlänkning och innehåll. Ingen placering eller indexering kan garanteras. Bevara befintliga fungerande URL:er, läsning, ordbok, PDF-läsare, karta och redigering.

Projektrot: `/Users/oscarpagerup/Desktop/Git Repo/fornsvenska`.
Läs även `docs/drift/NETLIFY_OPTIMERINGSPLAN.md`. Befintlig arbetskopia innehåller pågående ändringar; skriv inte över dem. Denna plan är inte en instruktion att ändra abonnemang, publicera externt eller skicka meddelanden.

## 1. Faktisk baslinje från Search Console

Rapporterna lästes i användarens inloggade webbläsare 2026-10-25 för domänegendomen `sc-domain:fornsvenska.se`. Detta är en manuell avläsning, inte en fullständig dataexport.

### Resultatrapport

Söktyp Webb; valt filter 3 månader. Diagrammets synliga dataintervall angavs som **16–23 oktober 2026**. Senaste uppdatering angavs som tre timmar tidigare. Tolka inte de åtta synliga dagarna som tre månaders observerad trafik.

| Mått | Avläst värde |
|---|---:|
| Klick | 1 |
| Exponeringar | 54 |
| Genomsnittlig CTR | 1,9 % |
| Genomsnittlig position | 12,9 |

Sidtabellen innehöll en enda rad: `https://www.fornsvenska.se/`, med 1 klick och 54 exponeringar. Det visar att endast startsidan har rapporterad synlighet i detta urval; det bevisar inte att alla andra sidor för närvarande är omöjliga att indexera.

Frågetabellens samtliga nio synliga rader:

| Fråga | Klick | Exponeringar |
|---|---:|---:|
| fornsvenska | 0 | 4 |
| äldre fornsvenska | 0 | 2 |
| fornsvenskan | 0 | 1 |
| yngre fornsvenska | 0 | 1 |
| fornsvenska ord | 0 | 1 |
| klassisk fornsvenska | 0 | 1 |
| forma svenskan | 0 | 1 |
| fortsätt framåt | 0 | 1 |
| fornsvenska textbanken | 0 | 1 |

Raderna summerar till 13 exponeringar och noll klick, inte rapportens totalsiffror. Google utelämnar bland annat anonymiserade frågor ur tabellen. Skillnaden får inte fyllas med påhittade frågor, och klicket kan inte tillskrivas någon av de visade frågorna. Genomsnittspositionen är inte placeringen för frågan ”fornsvenska”. Underlaget räcker inte för robusta CTR-slutsatser eller sökvolymsbedömningar.

### Indexering och webbplatskartor

- Indexeringsrapporten: **1 indexerad sida, 2 inte indexerade**, senast uppdaterad **2026-10-16**.
- Den enda visade orsaken: **Sida med omdirigering**.
- Exempel: `http://fornsvenska.se/` och `https://fornsvenska.se/`, båda med senaste genomsökning 17 oktober. Bevara dessa datum som gränssnittet visade dem; rapportens olika datumfält sammanfaller inte.
- Inga inskickade webbplatskartor i egendomens tabell: **0 rader**. Detta bevisar inte att Google aldrig har hittat en sitemap på annat sätt.
- Översikten visade HTTPS: 1 och ej HTTPS: 0.
- Viktiga webbvärden: **inga data** för mobil och desktop. Det betyder inte att prestandan är dålig eller god.

De två omdirigerade domänvarianterna kan vara helt korrekta. Ta inte bort deras omdirigeringar för att få fler gröna indexerade rader. Kontrollera destination och statuskod först.

### Begränsningar

Ingen enskild URL har ännu granskats med Googles URL Inspection eller live-test. Därmed är Googles valda canonical, renderad HTML och crawlbarhet för undersidor inte verifierade. Rapporter för manuella åtgärder, säkerhet, länkar och detaljerad genomsökning har inte granskats. Inga domänändringar, verifieringsknappar eller sitemap-inlämningar har utförts.

## 2. Kodfynd och arbets­hypoteser

Lokal kod är inte bevis för publicerad version. Kontrollera deployment före ändring.

| Fynd | Åtgärdskandidat |
|---|---|
| `app/layout.tsx` har generell titel/beskrivning men ingen synlig `metadataBase` | Gemensam adress- och metadatastrategi. |
| Texter och Grammatik saknar sidunik metadatagenerering i granskade routes | Generera titel/beskrivning från det faktiska dokumentet eller mappen. |
| `app/runor/page.tsx` använder canonical utan www | Utred konflikt mot startsidans rapporterade www-adress; ändra konsekvent efter kontroll. |
| Ordboksartiklar har metadata; runinskrifter har metadata och JSON-LD | Granska och återanvänd, bygg inte dubbla system. |
| Inga robots-/sitemap-filer hittades i `app` eller `public` vid filinventeringen | Kontrollera publika adresser; skapa vid behov. |
| `/admin/runor` har noindex; `/admin` saknar explicit metadata i granskad fil | Samlad indexeringspolicy för administrativa routes. |
| Global layout läser session och flera lässidor använder `force-dynamic` | Samordna med driftplan; dynamik är inte automatiskt ett SEO-fel. |

Netlify-granskningen samma dag visade 146 418/125 000 funktionsanrop och varning om paus. Driftstopp är därför en konkret risk. Search Console visar dock inte i det avlästa underlaget att Netlify redan har orsakat indexeringsförlust. Påstå inte detta som fastställd orsak.

## 3. Prioriterade etapper

Alla genomförandeetapper S01–S20 är planerade. Varje etapp får en verifieringspost med datum, ändrade filer, testresultat, återstående frågor och nästa steg. Rutinmässiga lokala åtgärder kräver inte återkommande användarbekräftelse.

### S01 – Säkra arbetsläge och baslinje (P0)

Läs Git-status, lokala instruktioner och driftplanen. Spara aktuell deployment-identitet, datakälla och de här Search Console-värdena. Dokumentera versioner utan hemligheter.
Leverans: `STATUS.md` och daterad baslinje.
Godkänd när: egna ändringar kan skiljas från pågående text-/runarbete och senaste driftversionen är identifierad.

### S02 – Bekräfta tillgänglighet (P0; efter S01)

Kontrollera startsida och representativa undersidor anonymt på produktion: statuskod, innehåll, omdirigeringar och fel. Prova både direktlänk och navigation. Hantera kvotstopp enligt driftplanen; gör inga betalningar inom SEO-uppdraget.
Leverans: statusrapport och driftberoenden.
Godkänd när: avsedda offentliga sidor svarar med korrekt innehåll och 200, felaktiga URL:er med riktig 404. Vid driftblockering fortsätter lokal förberedelse, men publicerad verifiering förblir blockerad.

### S03 – Granska representativa URL:er i Google (P0; efter S02)

Använd URL Inspection för startsidan, en text, en grammatikartikel, ordboken, en ordboksartikel, resurser och en publicerad runinskrift. Registrera känd/okänd URL, senaste crawl, tillåten indexering, hämtning och deklarerad respektive Google-vald canonical. Kör live-test där det behövs. Läs också säkerhets- och manuella åtgärdsrapporter.
Leverans: URL-matris med faktiska resultat och avläsningsdatum.
Godkänd när: discovery-, renderings-, canonical- och kvalitetsfrågor hålls isär. Ett lyckat live-test betyder inte att sidan redan är indexerad.

### S04 – Inventera det publicerbara beståndet (P0; efter S01)

Generera en URL-förteckning ur faktisk datakälla, inte bara filnamn. Klassificera fullständiga artiklar, innehållsrika samlingssidor, utkast, tomma noder, sökresultat, filter, administration och alias. Räkna inte allt i källregistret som en egen webbsida.
Leverans: `url-inventering.json` med route, typ, publik status, innehållskälla, önskad indexering och motivering.
Godkänd när: inga utkast eller tomma dokument slentrianmässigt föreslås för sitemap.

### S05 – Fastställ huvudadress och canonical (P0; efter S03–S04)

Preliminärt förstahandsval är `https://www.fornsvenska.se`, eftersom den adressen har synlighet i rapporten. Bekräfta Netlifys primära domän, verkliga omdirigeringar och Google-val innan beslut. Byt inte till utan www enbart av estetiska skäl.

Samordna metadataBase, självpekande canonical, sitemap, Open Graph och absoluta interna länkar. Varje unik artikel ska peka på sin egen huvudadress, inte startsidan. Bevara path och relevanta parametrar vid värd-/HTTPS-omdirigering; undvik kedjor och loopar. Bestäm separat vad som gäller för filtrering och sidindelning: innehållsligt olika sidor får inte automatiskt canonical till sida 1.
Leverans: domänpolicy och tester för adresser med/utan www och HTTP/HTTPS.
Godkänd när: avsedda varianter konvergerar korrekt och källans två redirect-rader inte behandlas som fel som måste indexeras.

### S06 – Indexeringspolicy och robots (P0; efter S04–S05)

Inför avsiktlig noindex för administrativa/inloggningsvyer och olämpliga interna sökresultat där motiverat. Säkerställ autentisering separat: noindex skyddar inga data. Blockera inte samtidigt Googles hämtning av en sida vars noindex måste kunna läsas. Tillåt nödvändiga CSS-/JS-resurser.

Skapa robots.txt med korrekt sitemap-adress om fil saknas. Använd inte robots som canonical-lösning. Förhandsmiljö ska inte indexeras; produktionsmiljö får inte ärva dess blockeringar.
Leverans: explicit policymatris och kontrollerade headers/HTML.
Godkänd när: avsedda lässidor inte råkar få noindex eller blockeras.

### S07 – Generera och validera sitemap (P0; efter S04–S06)

Generera från samma publiceringslogik som visar innehållet. Endast kanoniska, indexerbara URL:er med fungerande innehåll. Exkludera alias, fel, utkast och parameterkombinationer. Använd verkligt ändringsdatum för lastmod eller utelämna det; sätt inte dagens datum varje bygge.

Ordboken kan ge många adresser: räkna faktiskt bestånd och dela vid behov i sitemap-index och delkartor enligt protokollets gränser (50 000 URL:er och 50 MB okomprimerat per sitemap). Generera cachebart, utan dyr total databasgenomgång för varje Google-anrop.
Leverans: XML och automatisk validering av format, antal, unika adresser och indexeringspolicy.
Godkänd när: sitemap kan hämtas anonymt och alla små sidfamiljer samt ett representativt ordboksurval har kontrollerats utan att överbelasta produktionen.

### S08 – Unika metadata för Texter och Grammatik (P1; efter S05)

Implementera `generateMetadata` i respektive catch-all-route med samma data som sidan. Hantera rot, mappar, dokument, okända slugs och utkast. Beskriv faktiskt innehåll. Ingen titel får lova fullständig utgåva om sidan är ett utdrag.

Exempel: ”Kristnu balkær, del I – Äldre Västgötalagen | Fornsvenska.se”. Beskrivningen berättar kort om text, svensk tolkning och källstöd när dessa verkligen finns.
Leverans: granskade metadata för alla text-/grammatiksidor.
Godkänd när: inga oavsiktliga gemensamma standardtitlar, rå uppmärkning eller tomma beskrivningar återstår. Teckengränser används som redaktionellt stöd, inte en garanti för Googles visning.

### S09 – Startsida och gemensam presentation (P1; efter S08)

Behåll ”Det var en gång, fornsvenskan” som synlig huvudrubrik om den fortfarande är önskad. Ge sidan en tydlig söktitel, exempelvis ”Fornsvenska – texter, ordbok och grammatik | Fornsvenska.se”. Komplettera med kort, synlig orientering om innehållet och tydliga länkar vidare.
Leverans: avvägd titel, beskrivning och introduktion utan redesign.
Godkänd när: samma språk och ämne uttrycks i metadata och innehåll; inga upprepade nyckelordslistor eller dolda SEO-texter.

### S10 – Revidera befintliga ordboks-/runmetadata (P1; efter S05)

Kontrollera att metadata laddas från rätt post och har korrekt canonical. Ersätt vid behov ordbokens mekaniska textklippning med begriplig sammanfattning utan att ändra historiska betydelser. Bevara homonymnummer och källidentifiering. Granska att runbeskrivningar som ”verifierade läsningar” motsvarar faktisk kvalitet.
Leverans: representativa exempel samt automatiska regler för resten.
Godkänd när: unika poster inte blandas ihop och fel/utkast inte framställs som färdiga artiklar.

### S11 – Gör undersidor upptäckbara via länkar (P1; efter S04)

Kontrollera vanlig HTML-länkning från startsida till samling och från samling till artikel. Behåll brödsmulor och föregående/nästa. Ordboksartiklar får en genomtänkt alfabetisk eller annan bläddringsväg om sökrutan är enda ingången. Kartans inskrifter ska även nås via läsbar lista. Skapa inte en startsida med tiotusentals länkar.
Leverans: länk- och djupanalys för prioriterade sidor samt åtgärdade isolerade sidor.
Godkänd när: representativa dokument kan nås utan formulärinmatning och utan att interagera med karta; länkar fungerar på mobil.

### S12 – Fördjupa samlingssidor (P1; efter S11)

Prioritera Texter, Grammatik och Äldre Västgötalagen: introduktion, materialets avgränsning, läsordning och beskrivande länkar. Samlingssidor ska ge värde utöver en lista, men inte duplicera varje artikel.
Leverans: tre redaktionellt granskade sidunderlag eller motsvarande befintliga sidor.
Godkänd när: sakuppgifter är belagda enligt KALLPOLICY och tillägg inte försvårar navigation.

### S13 – Första innehållsetappen efter verkliga frågor (P2; efter S12)

Synliga frågor ger svaga men relevanta signaler: fornsvenska, äldre/klassisk/yngre fornsvenska och fornsvenska ord. Kartlägg befintliga svar innan nya sidor skapas. Föreslagen pilot: en bra introduktion till fornsvenska, en källbelagd jämförelse av periodbeteckningar och en sida med ordexempel som länkar till ordboken.

Detta är innehållshypoteser, inte bevisad efterfrågan. Skapa inte varsin snarlik sida för ”fornsvenska” och ”fornsvenskan”. Frågorna ”forma svenskan” och ”fortsätt framåt” är inte prioriteringar på denna evidens. Behåll historiska former i originaltext; moderna sökord hör hemma i förklaringen.
Leverans: ämne→befintlig/möjlig sida→syfte→källor, följt av en liten granskad pilot.
Godkänd när: varje sida besvarar en egen fråga och tillför nytt innehåll, utan fabricerade källor eller massgenererade varianter.

### S14 – Redaktionellt ansvar och strukturerad data (P2; efter S10–S13)

Gör ansvarig utgivare/redaktion, källprinciper och verkliga uppdateringar tydliga. Lägg relevanta BreadcrumbList-/WebSite-uppgifter där de motsvarar synlig information. Granska befintlig JSON-LD för runor innan nytt skapas; validera syntax och överensstämmelse. Utge inte schema.org-typer för att garantera Google-specialresultat.
Leverans: förtroendeinformation och validerad uppmärkning.
Godkänd när: inga påhittade betyg, författare, granskningar eller uppdateringsdatum finns.

### S15 – Prestanda och besökarupplevelse (P0/P1; parallellt med driftplan)

Search Console saknar fältdata: använd laboratoriemätningar nu och skilj dem från Core Web Vitals i verklig trafik. Testa initial HTML, mobil layout, fokus, kontrast, reduced motion, ordklick, PDF och karta. Undvik klientberoende tomma innehållsskal och dyr metadata som hämtar samma dataset upprepade gånger.
Leverans: jämförbara före/efter-mätningar på samma testprofil.
Godkänd när: inga försämrade kärnflöden, inga nya betydande layoutskiften eller ökade serveranrop som äventyrar driften. SEO får inte minska webbplatsens användbarhet.

### S16 – Teknisk slutkontroll (P0; efter S05–S15)

Kontrollera hela lilla routebeståndet och ett dokumenterat stratifierat urval av stor ordbok. Testa metadata, en canonical per sida, statuskoder, robots, XML, internlänkar och serverrenderat innehåll. Kör relevanta befintliga tester, TypeScript, källvalidering och produktionsbygge. Spara negativa testfall för okänd slug, utkast, filter och felaktig domän.
Leverans: verifieringsrapport och avgränsad diff.
Godkänd när: inga nya blockerande fel, inget privat material i sitemap, inga gamla URL:er brutna. Redovisa tidigare orelaterade fel utan att dölja misslyckade tester.

### S17 – Publicering och faktisk Google-kontroll (P0; efter S16)

Förbered återställning och följ användarens då gällande publiceringsauktorisation. Verifiera den publicerade versionen innan Search Console-inlämning. Skicka därefter sitemap om det ingår i auktoriserat genomförande och dokumentera exakt URL/status. Inspektera ett litet urval viktiga sidor; begär indexering vid behov, inte rutinmässigt för hela ordboken.
Leverans: deploy-id, produktionstest och faktisk inlämningsstatus.
Godkänd när: sitemap är läsbar och avsedda sidor klarar live-test. Skriv ”inskickat”, inte ”indexerat”, tills Google visar det senare. Klicka inte ”verifiera åtgärder” för korrekta redirect-varianter.

### S18 – Följ upp upptäckt och indexering (efter S17)

Kontrollpunkter cirka 7, 14 och 28 dagar efter publicering, med hänsyn till rapportfördröjning. Ingen automation är skapad. Registrera Google-upptäckta och indexerade URL:er per sidfamilj, canonical-val, sitemapfel, crawl-/serverfel och om undersidor får exponeringar.
Leverans: jämförelse mot baslinjen och prioriterad fellista.
Godkänd när: tekniskt åtgärdade problem hålls isär från Googles indexeringsbeslut. Om relevanta sidor uteblir: kontrollera upptäckt, live-test, canonical och innehåll innan fler sidor produceras.

### S19 – Förbättra klick och innehåll på större underlag

Jämför kompletta 28-dagarsperioder när sådana finns. Vid fortsatt låg volym: använd längre period och redovisa osäkerhet. Separera sida/fråga/enhet och dokumentera filter. Utvärdera titeländringar på jämförbara frågor; total CTR kan sjunka när nya frågor börjar ge exponeringar utan att förbättringen misslyckats.
Leverans: konkret nästa innehålls-/metadataetapp med evidens.
Godkänd när: inga slutsatser om enskilda frågor dras från webbplatsens genomsnittsposition och inga påhittade sökvolymer används.

### S20 – Förvaltning och överlämning

Dokumentera hur nya dokument får metadata, länkar och sitemap-inträde automatiskt. Gör indexeringspolicy till en del av publiceringsgrinden. Rapportera genomfört, lokalt verifierat, produktionsverifierat och observerat i Google separat.
Leverans: drift-/SEO-rutin, ändringslogg, aktuella risker och nästa konkreta uppgift.
Godkänd när: nästa AI kan fortsätta utan att gissa vilken version Google-resultaten avser.

## 4. Mål, mätning och återställning

Tekniska leveransmål: 100 % av avsedda publika artiklar har korrekt unik titel och canonical; inga oavsiktliga noindex; giltig sitemap med rätt urval; fungerande interna länkar och oförändrade läsflöden. Mät populationen från S04, inte ett antaget sidantal.

Effektmål: synlighet för relevanta undersidor utöver startsidan, fler relevanta exponeringar och klick över tid. Sätt inga garantier om topp 3, 100 % Google-indexering eller ett bestämt klickantal med nuvarande underlag. Använd inte 1,9 % CTR som ensam framgångsgräns.

Återställ om en ändring blockerar alla sidor, ger fel canonical över hela webbplatsen, läcker privata uppgifter, bryter navigation/redigering eller orsakar driftproblem. Återställ kod/config till verifierad version och kontrollera publika svar igen. Använd inte Search Consoles borttagningsverktyg som vanlig rollback.

Risker att särskilt undvika: ändra fungerande domän utan skäl; indexera tusentals tomma/tunna sidor; duplicera periodartiklar; låta filter skapa oändliga URL-varianter; lägga noindex bakom robots-blockering; tolka saknade CWV-data som godkänt; skicka sitemap till en pausad webbplats och kalla arbetet klart.

## 5. Arbetsfiler som ska skapas vid genomförande

`STATUS.md`, `url-inventering.json`, `url-inspection.md`, `metadata-matris.md`, `testprotokoll.md` och `uppfoljning.md`. Dessa är planerade leveranser, inte redan utförda granskningar. Spara relevanta datum, filter och rapportlänkar; inkludera aldrig cookies, token eller kontots privata profiluppgifter i överlämningen.

## 6. Källor och rapportlänkar

- [Search Console – resultat](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Afornsvenska.se)
- [Indexering](https://search.google.com/search-console/index?resource_id=sc-domain%3Afornsvenska.se)
- [Webbplatskartor](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Afornsvenska.se)
- [Googles SEO-guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Sitemap: generering och inlämning](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical och dubbletter](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Skillnader mellan rapporternas totalsiffror och tabeller](https://support.google.com/webmasters/answer/17010575?hl=en)
- [Felsökning av genomsökning](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors)

Kontosiffrorna är avlästa i UI, inte hämtade från de offentliga dokumentationssidorna. Rapporterna kan ändras efter denna överlämning.
