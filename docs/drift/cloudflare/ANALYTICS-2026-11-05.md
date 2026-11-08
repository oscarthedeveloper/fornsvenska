# Bedömning av gratisutrymmet på Cloudflare, 2026-11-05

**Bedömning: Cloudflare är tydligt bättre lämpat för den nuvarande statiska leveransmodellen. Inga aktuella mätvärden visar att hostingens gratisgränser håller på att ta slut.** Detta är inte en garanti för obegränsade API-anrop eller byggen, och inte en fullständig jämförelse med tidigare kontoförbrukning hos Netlify/Vercel.

## Lästa kontomått

Inloggad Cloudflare-panel granskades utan ändringar av betalplan, säkerhet, cache eller analysinställningar. Workers-plansidan visar Free som Current plan, $0. Kontot har åtta Pages-projekt utan Git-anslutning, publicerade genom Direct Upload.

Workers & Pages visar för 5 november: **2 / 100 000 requests today**, dvs. **0,002 %** av dagskvoten. Huvudprojektets Functions Metrics för senaste 24 timmar visar två lyckat slutförda Worker-anrop, noll Worker-exekveringsfel och tre subrequests. Slutförda Worker-anrop betyder inte automatiskt HTTP 200; ett kontrollerat HTTP-felsvar kan vara en lyckad exekvering. CPU-grafernas råtal hade inte tillräckligt tydliga enheter för att rapportera säker CPU-marginal i millisekunder.

Domänens Requests Analytics visar samma avrundade totalsiffror för senaste 24 timmar och senaste sju dagar:

| Mått | Avläst |
|---|---:|
| HTTP-anrop | cirka 2 720 |
| Överförd data | 59,51 MB |
| Registrerade visits | 520 |
| Cache hit rate | 2,79 % |
| 2xx | cirka 2 040 |
| 3xx | 194 |
| 4xx | 469 |
| 5xx | 13 (0,48 %) |

Tidsfönstret på sju dagar är inte sju dygns representativ stabil drift. Domänen kopplades till sajten den 5 november, och mätningen innehåller etablering, våra tester, skannrar/botar och egen användning. Registrerade visits får inte likställas med mänskliga läsare eller jämföras direkt med sessionsmått från en annan leverantör.

### Serverfelen

Filtrering på Status class = 5xx gav 13 anrop:

- 6 till två ACME-certifikatverifieringssökvägar.
- 5 till två cf-custom-hostname-challenge-sökvägar.
- 1 till /api/kontakt.
- 1 till /.

Elva fel gäller alltså domän-/certifikatverifiering, inte vanliga innehållssidor. Vi observerade även en 522 på startsidan under domänaktiveringen och ett avsiktligt 503-svar från okonfigurerad kontakt tidigare i arbetet. Det är förenligt med dessa två återstående fel, men full Ray-ID/loggkorrelation gjordes inte. Felen bevisar inte ett kapacitets- eller kvotproblem. Den begränsade mätningen bevisar inte heller framtida felfri drift.

### Cache och mätluckor

Cachefördelningen var Dynamic cirka 2 150, Miss 416, Hit 75, None 61 och Bypass 20. **Dynamic i zonens cachevy betyder inte att dessa anrop har kört en Worker eller SSR.** Den faktiska Workers-räknaren och leveransens ruttregler är relevanta för funktionskvoten. Låg cacheträff är därför inte belägg för en snabbt förbrukad Workers-kvot.

Huvudprojektets Web Analytics är disabled. Inget aktiverades under granskningen. Domänvyn för fornsvenska.se omfattar inte artikeltrafik på de sju fornsvenska-ord-XX.pages.dev-värdarna eller annan trafik till pages.dev. 59,51 MB är därför inte ett totalmått för hela sajtens hosting. Detta begränsar besöks- och bandbreddsanalysen, men de statiska artikelprojekten behöver fortfarande inga Worker-anrop.

## Varför modellen är gynnsammare

Publicerad HTML, CSS, typsnitt, bilder och sökindex levereras som statiska Pages-filer. Sökning sker i webbläsaren. Huvudsajtens _routes.json aktiverar endast workern för kontakt, publiceringsbegäran och det externa run-API:et; statiska run-exporter är undantagna. Artikelprojekten har ingen API-worker. Vanliga besök kräver alltså inte ett serverjobb per sida eller sökning.

Cloudflare dokumenterar att statiska Pages-anrop är gratis och obegränsade när de inte anropar Functions. Functions delar Workers Free-kvoten på 100 000 anrop per UTC-dygn. Dessa är olika mått: domänens cirka 2 720 HTTP-anrop ska inte dras från samma kvot som dagens två Worker-anrop.

Det är en effekt både av Cloudflares villkor och av att sajten har byggts om. Utan historiska förbrukningsrapporter går det inte att slå fast om Netlify/Vercel tidigare stoppade på bandbredd, compute, requests, byggen eller annan resurs. Inga sådana exakta orsaker antas här.

## Begränsningar som kvarstår

Lokala distributionsfiler räknades separat från trafikmåtten:

- Åtta projekt av plattformens dokumenterade 100.
- Största artikelprojekt: 13 819 filer av 20 000, cirka 69,1 %. Intern projektgräns är 16 000.
- Största fil: ordbok/index-fulltext.json, 19 158 897 byte = 18,27 MiB av 25 MiB, cirka 73,1 %.
- Pages dokumenterar 500 plattformsbyggen per månad på Free. Nuvarande publicering bygger lokalt/utanför Cloudflare och laddar upp färdiga filer. Kontots faktiska månadsräknare för Pages-byggen/Direct Upload kunde inte läsas ut i denna granskning; antal uppladdningar omräknas därför inte till en påstådd förbrukad byggkvot. Workers Build Minutes är ett annat mått och ska inte förväxlas med Pages-byggen.
- Kontakttjänstens Supabase- och Resend-gränser är separata. Hostingens statiska trafik förbrukar inte dessa kvoter. E-post har applikationstak 50/dygn och 1 000/månad samt fem reservationer per timme/IP.

## Rekommendation

Behåll den nuvarande statiska Cloudflare-modellen. Behåll avgränsningen i _routes.json; inför inte SSR, catch-all-worker eller databasfråga för varje sidvisning utan att räkna om budgeten. Följ särskilt det stora fulltextindexet och filantalet när ordboken växer. Publicera samlat efter redigering i stället för att bygga om alla projekt vid varje sparning.

Nästa analys bör samla minst en till två veckors stabil trafik och även artikelvärdarna. Aktivering av Web Analytics på relevanta projekt eller sammanföring under egna underdomäner kan ge bättre besöksbild; dessa ändringar genomfördes inte under denna läsgranskning. Utred kvarstående återkommande 5xx separat om de fortsätter efter etableringen. Höj inte betalplanen eller inför breda cache-/blockeringsregler utifrån enbart nuvarande siffror.

## Källor

- Inloggat Workers & Pages-konto: https://dash.cloudflare.com/56623d142691aa2621a7d8503db9304e/workers-and-pages
- Domänanalys, sju dagar: https://dash.cloudflare.com/56623d142691aa2621a7d8503db9304e/fornsvenska.se/analytics/requests?t=7-days
- Huvudprojektets Metrics: https://dash.cloudflare.com/56623d142691aa2621a7d8503db9304e/pages/view/fornsvenska-www/analytics/production
- Statiska anrop och Functions-pris: https://developers.cloudflare.com/pages/functions/pricing/
- Pages-gränser: https://developers.cloudflare.com/pages/platform/limits/
- Workers-pris: https://developers.cloudflare.com/workers/platform/pricing/
- Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
