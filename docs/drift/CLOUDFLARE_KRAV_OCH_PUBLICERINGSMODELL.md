# Cloudflare Pages Free: krav och publiceringsmodell

Datum: 2026-10-30. Underlag: lokal kod vid commit `4237cd3` och leverantörsdokumentation kontrollerad samma dag.

Status: funktionerna är inventerade och målmodellen föreslagen. Användarens tre produktbeslut nedan är bekräftade. Modellens genomförbarhet ska verifieras i avgränsade prototyper under det senare genomförandet. Ingen applikationskod, databas, DNS eller driftskonfiguration har ändrats genom detta dokument.

Detta är förarbetet till en senare, separat etappindelad ombyggnadsplan för en genomförande AI. Dokumentet är inte den planen och är inte en instruktion att börja bygga om applikationen nu.

Den separata [ombyggnadsplanen](./CLOUDFLARE_OMBYGGNADSPLAN.md) har nu upprättats. Detta kravunderlag behålls som underlag; genomförandestatus förs enligt ombyggnadsplanen.

## 1. Bekräftade krav

1. Återkommande hostingavgift ska vara noll. Inga tidsbegränsade provkrediter, betalda tillägg eller automatisk övergång till förbrukningsdebitering får vara en förutsättning. Befintlig domänförnyelse är en separat kostnad.
2. Alla ordartiklar ska ha egna sidor där fullständig offentlig artikeltext och metadata finns i det initiala HTML-svaret. JavaScript-rendering eller generiska metadata räcker inte som ersättning.
3. Redigering ska kunna ske i webbläsaren. Ett separat publiceringssteg är accepterat. Automatisk omedelbar publicering efter varje tangenttryckning krävs därför inte.
4. Ordboksdelar får ligga på underdomäner, om gamla ordlänkar fortsätter fungera via permanenta omdirigeringar.
5. Cloudflare Pages Free är vald plattform att prova. Arkitekturen ska minska resursbehovet, inte bara flytta dagens dynamiska trafik till en ny gratiskvot.
6. Ombyggnadsplanen skrivs senare, består av etapper och ska kunna lämnas till en annan AI som genomför ändringarna.

Övriga krav nedan är föreslagna acceptanskriterier för att bevara dagens funktioner, inte ytterligare beslut som tillskrivs användaren.

## 2. Verifierat nuläge och avgränsning

Den maskinläsbara inventeringen finns i [CLOUDFLARE_INVENTERING.json](./CLOUDFLARE_INVENTERING.json). Den innehåller inga miljövariabler eller hemligheter.

| Observation | Verifierat underlag |
|---|---|
| Next.js 14.2.5, React 18.3.1-intervall, npm-låsfil | `package.json`, `package-lock.json` |
| 41 744 poster med unika ID:n: 22 572 huvudverk och 19 172 supplement | `data/ordbok/poster.json`, maskinell räkning |
| Ordboksfil: 42 086 164 byte; gzip i lokal mätning: 10 236 295 byte | Filstorlek och Python gzip; detta är inte mätt webbtrafik eller färdig sökindexstorlek |
| 67 publika filer, totalt 15 378 631 byte | `public/`; genererat byggresultat ingår inte |
| 13 sidmoduler och 5 route handlers | `app/`; en sidmodul kan representera många URL:er |
| Sökning/navigering i ordboken går genom `router.push` till en serverkomponent med `searchParams` | `components/ordbok/OrdbokKlient.tsx`, `app/ordbok/page.tsx` |
| Ordartikeln använder både `params` och `searchParams`; `revalidate = 86400` finns redan | `app/ordbok/[id]/page.tsx`; att bara lägga till denna flagga är ingen ny lösning |
| Publika läsklienter är redan separerade från cookieklienten; rotlayouten använder klientbaserad AdminProvider | `lib/supabase/server.ts`, `app/layout.tsx`, `components/admin/AdminContext.tsx` |
| Server Actions används för dokument, träd, startsida, resurser, rättelser och moderna definitioner | `lib/actions.ts`, `lib/sidActions.ts`, `lib/resursActions.ts`, `lib/ordbok/*Actions.ts` |
| Delar av ordredaktionen skriver till lokala filer | `lib/ordbok/rattelser.ts`, `lib/ordbok/modernisering.ts` |
| Personlig ordlista och anteckningar ligger i localStorage på nuvarande origin | `lib/ordbok/bokmarken.ts` |
| Runredaktionens visade statusändring uppdaterar klienttillstånd och logg i minnet | `components/admin/RunicEditorialAdmin.tsx`; verklig beständighet får inte antas |

Produktionsdatabas, aktuell RLS, bucketinnehåll, faktisk kontoförbrukning och Cloudflare-konto är inte inspekterade i detta förarbete. Lokala filer är inte bevis för att innehållet är identiskt med produktionen. Tidigare Netlify-rapporter under `docs/drift/` är historik; deras beskrivning av rotlayout och rendering får inte behandlas som aktuell kodanalys.

## 3. Funktionskrav och serverberoenden

| Del | Nuvarande beroende | Krav i målmodellen |
|---|---|---|
| Startsida och animationer | Bygg-/serverläsning av fil eller Supabase | Färdig offentlig HTML; samma visuella utformning och rörelseinställningar |
| Grammatik och textarkiv | `lib/archive.ts`, filer eller Supabase; Server Actions för redigering | Färdiga mapp-/dokumentsidor, samma navigering, specialtecken, fotnoter och källhänvisningar |
| Ordbokssökning | Serverläsning och query-parametrar | Sökning, alfabet, källfilter, artikeltextsökning, ordning och sidindelning i webbläsaren; delbara sök-URL:er och bakåt/framåt |
| Ordartiklar | Serverläsning, metadata, query-baserad återgång | Full HTML per giltigt ID, unik canonical/title/description, källtext, rättelser och moderna förklaringar |
| Orduppslag från text | `components/text/OrdbokUppslagPanel.tsx` anropar `/api/ordbok/uppslag?ord=…` | Samma normalisering, morfologiska kandidater och rangordning med lokalt index; ingen generell funktion per klick |
| Personlig ordlista | localStorage, exporter till bland annat JSON/CSV/Anki | Befintliga sparade ord och anteckningar bevaras; en sammanhängande ordlista även efter underdomänflytt |
| Resursbibliotek och Västgötalagens bokvy | Filer/DB, klientläsare, Supabase Storage för omslag | Samma sökning, läsning och länkar. Bokvyn får inte felaktigt inventeras enbart som PDF |
| Runor och karta | Filer/publicerade DB-versioner, Leaflet, OSM-kartor | Färdig listreserv och detaljsidor; klientfilter, karta, attribution och felreserv bevaras |
| Run-API | Query-baserad JSON/GeoJSON och slug-API | Befintliga kontrakt inventeras: statiska versionerade exporter där möjligt. Query-/OPTIONS-beteende får inte tyst tas bort |
| Administration | Supabase Auth, RLS, serverrenderade adminsidor, Server Actions | Gemensam webbaserad redaktörsyta med beständigt sparande, behörighetskontroll och separat publicering |
| Kontakt | POST `/api/kontakt`, Resend och serverhemligheter | Fungerande formulär med avgränsad gratisfunktion; kvotfel påverkar inte läsning av webbplatsen |
| SEO och äldre adresser | Metadata, robots, delade sitemaps, `/kallor`-redirect | Fullständiga sitemaps och permanenta gamla ordlänkar; korrekt 404 och avskild testindexering |

Godkända utkastregler ska bevaras. En märkning som `utkast` kan betyda offentligt ofärdigt material i nuvarande produkt och får inte automatiskt omtolkas. Administrativa/hemliga uppgifter och ännu inte publicerade redaktionella revisioner får däremot aldrig följa med i offentliga byggartefakter.

## 4. Föreslagen publiceringsmodell

### Publik webbplats

Huvudsajten på `www.fornsvenska.se` levererar startsida, grammatik, texter, resurser, runor och ordbokssökning som statiska tillgångar. Webbläsaren utför sökning och återanvänder ett versionsbundet sökindex. Artiklar och index genereras från samma publiceringsögonblick.

En ordartikel har en riktig HTML-sida på den underdomän som äger dess ordgrupp. Hela HTML-artikeln kräver ingen API-/Supabase-förfrågan från besökaren. Visning, källkritiska uppgifter och metadata genereras från samma auktoritativa innehåll som sökindexet. Artikelpresentationen återanvänder befintliga komponenter där det är praktiskt; ett byte av hela ramverket är inte beslutat.

### Ordbokens uppdelning

Ett enda Pages Free-projekt rymmer inte 41 744 HTML-filer. Utgångspunkten är därför **sju ordboksprojekt plus huvudsajt och en redaktörsyta**, med slutligt antal styrt av verkliga byggfiler. Nedanstående arbetsfördelning är räknad på första tecknet efter `--` i befintligt ID, inte på Söderwalls visningsalfabet. Den ändrar inte ordbokens språkvetenskapliga sortering.

| Teknisk grupp | ID-initialer | Artiklar | Räkneexempel: 2 filer/artikel + 1 000 gemensamma filer |
|---|---|---:|---:|
| 01 | a–e | 6 107 | 13 214 |
| 02 | f–g | 5 471 | 11 942 |
| 03 | h–k, inklusive i/j | 6 621 | 14 242 |
| 04 | l–o | 6 900 | 14 800 |
| 05 | p–r samt ö, þ, bindestreck och understreck | 3 367 | 7 734 |
| 06 | s | 6 609 | 14 218 |
| 07 | t, u, v, y, ä | 6 669 | 14 338 |
| Totalt | Alla befintliga ID:n exakt en gång | 41 744 | — |

De tekniska gruppnamnen och underdomännamnen är ännu inte låsta. Exemplen antar två filer per artikel; faktisk Next.js-export kan ge fler tillgångar. **Inget projekt godkänns på räkneexemplet:** hela byggmappen ska räknas. Föreslagen intern varningsnivå är 16 000 filer per projekt, under plattformsgränsen 20 000. Stabil gruppindelning ska undvika att befintliga artiklar flyttas vid varje ny import; största gruppen och nya initialer ska bevakas.

Projektuppdelningen använder ett konto och separata statiska innehållsdelar. Inga extra konton skapas för att utöka kvoter och inget beroende av beviljad gränshöjning införs. Kontots faktiska projekt-/byggbegränsningar ska kontrolleras före uppläggning.

### Gamla länkar och sökmotorer

På huvudsajten ska kompakta prefixregler skicka gamla `/ordbok/<id>` med 301 till artikelns nya underdomän. Pages dokumenterar splats och externa redirectmål, men Unicode, URL-kodning, sökparametrar och regelprioritet måste provas i Cloudflare innan reglerna godkänns. Prefixen ska härledas från ID:n, inte från `letterSection`, eftersom dessa ibland skiljer sig.

Nuvarande ID:n kräver färre än 100 unika kombinationer av källa och första ID-tecken; återstående redirectbudget ska mätas efter hantering av kodade varianter och övriga gamla adresser. Ingen lista med 41 744 enskilda redirectregler ska förutsättas rymmas.

Efter omdirigering ska artikeln ha 200, full HTML och canonical till sin faktiska nya URL. Interna länkar går direkt dit. Sitemaps grupperas per värd med korrekta hänvisningar; gamla adresser får inte fortsätta anges som canonical. Varken indexering, ranking eller oförändrad söktrafik kan garanteras genom flytten.

Pages stödjer inte proxy till externa projekt genom `_redirects`. DNS kan inte fördela samma värd efter URL-sökväg. Ingen Worker framför all läsning införs som genväg; det skulle återinföra en kvot för den publika trafiken.

### Redaktörsyta och data

En central webbaserad redaktörsyta, exempelvis `admin.fornsvenska.se`, behåller inloggning, innehållsredigering och förhandsgranskning. Publika artiklar kan länka till motsvarande redigeringsvy. Exakt placering och hur mycket inline-redigering som återanvänds bestäms i den senare planen.

Supabase Free är föreslaget redaktionellt datalager. Auth och databasens RLS/RPC ska kontrollera varje mutation. Klientens `arAdmin` är bara presentation. Ordredaktionens nuvarande filskrivning behöver ersättas av ett beständigt redaktionellt lager; en webbläsare eller Pages-funktion får inte antas kunna skriva permanent till repo-filer. Runredaktionens nuvarande klientstatus får inte presenteras som bevis på beständig lagring.

En godkänd publiceringsversion fryses som snapshot. Bygget läser detta snapshot och skapar alla publika sidor/index. Det ska inte falla tillbaka tyst till gamla lokala filer om aktuell databasexport misslyckas. Ren miljövariabelväxling till filkälla är inte en säker migrering av innehåll.

Publika bilder och andra filer som nu hämtas från Supabase Storage måste inventeras separat. Om de fortsätter hämtas därifrån följer Supabases egresskvot med till den publika driften. Målet är att lämpliga offentliga tillgångar kopieras till Pages vid publicering, med storleks- och rättighetskontroll.

### Publicera-knappen

Spara och Publicera är skilda tillstånd. Autosparning får inte starta nya byggen. En avgränsad behörighetskontrollerad gratisfunktion tar emot publiceringsbegäran, verifierar aktuell adminroll och utlöser byggkedjan. Deploy-hook-/API-hemligheter får inte finnas i klientpaketet. Begäran behöver spärr mot dubbelklick, kvotkontroll och en beständig status så att användaren kan se sparat, bygger, misslyckat och publicerat.

Byggkedjan väljs efter faktisk kontotillgång: Pages-byggen eller CI på gratisnivå. Flera projekt delar samma snapshot och release-ID. Även uppladdning och alla ändrade delprojekt räknas in i förbrukningsbudgeten. Om CI-minuter inte räcker ska lokal byggning/uppladdning kunna användas som gratis reserv; det är en reserv för publicering, inte en ersättning för webbredigeringen.

Flera Pages-projekt byter inte version atomiskt. Föreslaget flöde bygger och verifierar alla delar först, aktiverar innehållsdelarna och uppdaterar huvudsajtens index sist. Övergångsfönster, bakåtkompatibla dataformat, gamla klienter och återställning av samtliga projekt måste uttryckligen hanteras i senare plan. En delvis lyckad release får inte visas som helt publicerad.

### Bokmärken mellan underdomäner

localStorage delas inte automatiskt mellan olika origins. Befintlig ordlista på `www.fornsvenska.se` ska behållas med samma lagringsnyckel och kunna exporteras. Nya artikeldomäner får inte skapa sju fristående ordlistor.

En gemensam lagringslösning på huvudsajtens origin behöver provas, exempelvis en strikt ursprungskontrollerad meddelandebrygga. Den måste fungera på relevanta webbläsare och ha en tydlig reserv om inbäddad lagring blockeras. Ingen överföring till molndatabas eller nya personkonton antas. Centrala redaktörssessioner ska inte spridas över alla artikelvärdar för att lösa bokmärken.

### Kontakt och offentligt API

Kontaktformuläret kan använda en separat Pages-/Worker-funktion och befintlig Resend-tjänst inom deras gratisnivåer. Den ska avvisa orimliga storlekar, kontrollera spamskydd på servern och inte bli en öppen e-postrelay. Resend-hemligheten stannar på servern. Förbrukad kontaktkvot får inte hindra HTML-leverans eller ordbokssökning.

Runornas statiska JSON/GeoJSON och artikel-API går att generera ur samma snapshot. Befintliga query-filter, versionsval, CORS och OPTIONS är dock ett kontrakt som måste verifieras. Om kompatibiliteten kräver en funktion ska den avgränsas till det externa API:et; sajten ska själv använda statiska data. Kontraktsändringar ska redovisas innan genomförande, inte döljas som optimering.

## 5. Gratisbudget och verifieringskrav

| Resurs | Leverantörens uppgift 2026-10-30 | Konsekvens för modellen |
|---|---|---|
| Pages statiska tillgångar | Gratis och obegränsade anrop | Publik läsning och sökdata levereras utan Functions |
| Pages Free filer | 20 000 per projekt; 25 MiB per fil | Alla exporterade filer räknas; råa 42 MB-ordboken kan inte publiceras som en enda tillgång |
| Pages byggen | 500/månad på Free; 20 min timeout, en samtidig byggning | Batchad publicering och kontrollerad byggbudget; inga byggen per autosparning |
| Pages-projekt | Dokumenterad gräns 100/konto; nykonton kan begränsas initialt | Cirka nio projekt föreslås, inte skapade eller kontoverifierade |
| Pages redirects | 2 000 statiska + 100 dynamiska per fil | Prefixregler och täckningstest för alla ID:n |
| Pages Functions/Workers Free | Gemensamt 100 000 anrop/dag | Bara avgränsad administration/kontakt och eventuellt externt API, inte varje besök |
| Supabase Free | 500 MB DB, 1 GB fillagring, 5 GB egress + 5 GB cached egress; paus efter inaktivitet | Mät redaktionell storlek och exporttrafik. Redan publicerade sidor ska fungera även om redaktionen/DB är otillgänglig |
| Resend | Gratisnivå finns, dokumenterad dagsgräns 100 | Kontrollera även aktuell månadskvot och befintlig domänkonfiguration före val; inga betalningar aktiveras |

Ett fullständigt publiceringsvarv med huvudsajt och sju ordboksdelar kan kräva minst åtta projektbyggen; redaktörsbyggen, omkörningar och förhandsbyggen tillkommer. 500 är inte 500 fullständiga webbplatsreleaser. Förbrukning vid oförändrade delar och CI-/Direct Upload-villkor ska verifieras, inte antas.

Föreslagna provkriterier: högst 16 000 filer/projekt som intern marginal; inga tillgångar över 25 MiB; 0 publika funktionsanrop för huvudläsresor; 100 % av ordboks-ID:n har ägare och fullständig HTML. Mobilens nedladdning, minne och söktid ska mätas innan prestandabudget fastställs. Rådatafilens 10,2 MB gzip är inte ett godkänt paket att skicka till varje förstagångsbesökare.

## 6. Vad som är beslutat respektive återstår

**Bekräftat:** gratis drift, full HTML för varje ord, webbredigering med separat publicering, underdomäner med fungerande gamla länkar.

**Föreslagen modell:** statisk huvudsajt, sju statiska ordboksdelar, gemensam webbredaktion, Supabase som redaktionslager och små separata gratisfunktioner för nödvändiga mutationer/publicering/kontakt. Antal projekt, gruppnamn, CI och exakt lagringsbrygga är inte låsta implementationer.

**Måste verifieras före full ombyggnad:**

- Verkligt innehåll i produktion jämfört med filkällorna, inklusive redaktionella rättelser och moderna definitioner.
- Kontoåtkomst till Pages, Supabase och vald byggtjänst; faktiska gratisnivåer och förbrukning utan att kopiera hemligheter till dokument.
- En minimal molnprototyp för prefixredirect, specialtecken, frågesträng, canonical och riktig 404. Slumpmässiga okända ID:n får inte bli generiska 200-sidor.
- Fullständig lokal analys av ID-reglernas täckning och faktisk exportstorlek för minst största ordgruppen.
- Sökparitet, särskilt artikeltextsökning, ortografiska alias och uppslag från löptext.
- Beständig webbredigering, skyddade utkast, central ordlista över origins och en komplett publicering/återställning över flera projekt.
- Beslut om run-API-kompatibilitet och karta/bildkällors användningsvillkor. Extern trafik försvinner inte för att Next.js-servern försvinner.

## 7. Nästa leverans: underlag för den separata ombyggnadsplanen

Nästa plan ska utgå från denna kravbild och inte återinföra en ren JavaScript-artikelvy eller lokal redigering som huvudlösning. Den ska ge en annan AI etapper med avgränsningar, leveranser, beroenden och verifierbara godkännandekriterier. Tidiga prototyper ska kunna motbevisa modellens antaganden innan stor kodförändring görs.

Den ska också skilja lokalt verifierat från molnverifierat, bevara innehåll/källpolicy, hantera pågående arbete och dokumentera eventuell funktionsförändring. En HTTP-redirect eller ett demosvar är inte bevis på en fungerande artikel eller databaslagring. Driftsättning ska först ske på testadresser; DNS-flytt och avveckling av tidigare drift sker efter godkänd testversion.

## Källor och kodankare

Leverantörsfakta kontrollerade 2026-10-30. Kontrollera igen när genomförandet startar.

- [Pages-gränser](https://developers.cloudflare.com/pages/platform/limits/)
- [Statiska anrop och Pages Functions](https://developers.cloudflare.com/pages/functions/pricing/)
- [Pages redirects: splats, prioritet och begränsad proxy](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Pages-domäner och underdomäner](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Next.js 14 statisk export och funktioner som kräver server](https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports)
- [Supabase Free](https://supabase.com/pricing)
- [Resend-priser och dagsgräns](https://resend.com/pricing)

Kodankare: `app/layout.tsx`, `middleware.ts`, `app/ordbok/page.tsx`, `app/ordbok/[id]/page.tsx`, `lib/ordbok/ordbokServer.ts`, `lib/ordbok/ordbokDb.ts`, `lib/ordbok/bokmarken.ts`, `lib/archive.ts`, `lib/sitemapData.ts`, `lib/actions.ts`, `lib/resursActions.ts`, `lib/sidActions.ts`, `lib/ordbok/rattelseActions.ts`, `lib/ordbok/moderniseringActions.ts`, `components/admin/RunicEditorialAdmin.tsx`, `app/api/ordbok/uppslag/route.ts`, `app/api/kontakt/route.ts`, `app/api/runor/v1/route.ts`, `app/api/runor/v1/[slug]/route.ts`, `components/runor/RunorInteractiveMap.tsx`.
