# Genomförandeplan: färre funktionsanrop med bibehållen besökarupplevelse

Datum: 2026-10-25. Status: plan, inte genomförd optimering.

## Uppdrag och beslutskriterium

Minska Netlifys serverfunktionsanrop utan att försämra innehåll, navigering, hastighet, sökning, ordboksuppslag, PDF-läsning, runsida eller redaktionens arbete. Befintliga URL:er, specialtecken och visuella uttryck bevaras. Ingen ändring får räknas som framgång enbart därför att anropsantalet minskar: funktion, aktualitet, tillgänglighet och säkerhet måste också verifieras.

Planen ändrar inte abonnemang eller publicerar kod. Användarens gällande instruktioner styr senare driftsättning. Produktionsåtgärder ska ha färdig verifieringsrapport och återställningsväg. Aktuell arbetskopia innehåller omfattande pågående ändringar, även i textmaterialet; dessa får inte återställas eller skrivas över.

## Verifierat nuläge

Netlifys inloggade gränssnitt visade 25 oktober:

- En aktiv produktionsfunktion: `Next.js Server Handler`, `___netlify-server-handler`.
- 146 418 av 125 000 anrop för perioden 1 oktober–1 november.
- 6 av 100 timmars sammanlagd körtid.
- Varning att alla projekt kommer att pausas och återställas nästa månad, alternativt direkt efter uppgradering. Detta är kontots visade besked, inte bevis för att varje publik adress redan slutat svara.
- Loggen visar anrops-ID, tid och minne men inte vilken route eller klient som orsakat anropet. Trafikorsaken är fortfarande okänd.

Kod som granskats:

| Plats | Observation | Betydelse |
|---|---|---|
| `app/layout.tsx` | Anropar `hamtaSession()` i gemensam serverlayout | Sessionsberoende kan påverka alla underliggande sidor. |
| `lib/session.ts`, `lib/supabase/server.ts` | Använder autentisering och `cookies()` | Får inte ingå i en delad publik cache. |
| Startsida, Texter, Grammatik, Resurser | Explicit `force-dynamic` | Kandidater för förändring, men direktiven är inte enda hindret. |
| `lib/archive.ts`, `lib/sidor.ts`, `lib/resurser.ts` | Val mellan filer och Supabase | Faktisk produktionskonfiguration måste verifieras; innehållskälla får inte bytas för att förenkla cache. |
| `lib/actions.ts` | Adminprövning och bred `revalidatePath('/', 'layout')` | Skrivskydd ska bestå; invalidation kan behöva begränsas efter beroendekartläggning. |
| `lib/sidActions.ts`, `lib/resursActions.ts` | Har redan sidinvalidation | Återanvänd fungerande mönster, verifiera aktuell adapter. |
| `app/api/ordbok/uppslag/route.ts` | Publikt GET-uppslag efter query-parametern `ord` | Kandidat för korrekt nycklad cache och återanvändning i klienten. |
| `middleware.ts` | Bred matchning och sessionsförnyelse | Granska separat; middleware körs via Netlifys Edge Functions och ska inte automatiskt räknas som orsaken till serverfunktionskvoten. |

React `cache()` i datalagret innebär inte i sig att ett svar återanvänds mellan besök. En snabbare databasanropstid minskar inte nödvändigtvis antalet debiterade funktionsanrop.

## Målarkitektur

Offentligt innehåll ska kunna renderas och återanvändas utan användarens session. Inloggningsstatus och redigeringsfunktioner hanteras separat med bibehållen serverkontroll av varje skyddad åtgärd. Personuppgifter, administratörsinnehåll och sessionssvar får aldrig hamna i gemensam cache.

Prioriterad lösning är en hybrid inom befintlig Next.js-applikation:

- Filbaserade lässidor förgenereras där det är praktiskt.
- Databasbaserat publikt innehåll får en separat sessionsoberoende läsväg och kontrollerad invalidation.
- Personliga och administrativa svar fortsätter vara dynamiska och privata.
- Offentliga uppslag återanvänds när deras resultat faktiskt är samma för alla användare.
- Klientinteraktioner, karta och ordbok behålls; ingen stor databas flyttas till varje besökares webbläsare som genväg.

Ingen generell `force-static`, publik cacheheader över hela appen eller fullständig statisk export införs utan beroendeanalys. Det kan annars dölja autentisering, bryta serveråtgärder eller ge fel innehåll. Global avstängning av länkförhandsladdning är inte förstahandsåtgärden eftersom navigeringen kan bli långsammare.

## Etapper

Alla etapper nedan är planerade. Varje etapp dokumenterar ändringar, verifiering, kvarstående frågor och nästa startpunkt i `docs/drift/STATUS.md` när genomförandet börjar.

### E01 – Säkra utgångspunkt och konfiguration

Registrera Git-status och avgränsa egna ändringar. Dokumentera låsta Next.js-/React-versioner, faktisk Netlify-adapter från byggloggen, datakälla och miljöskillnader utan att skriva ut hemligheter. Kontrollera kontoåtkomst och om förhandsbyggen är möjliga under kvotstoppet.

Leverans: nulägesprotokoll, lista över berörda filer och återställningsbar utgångspunkt.
Grind: inga antaganden om att lokala data eller miljöinställningar motsvarar produktionen. Om Netlify blockerar testdeploy: fortsätt lokalt men markera molnverifieringen som blockerad.

### E02 – Mät besökarresor före ändring

Mät anonym förstagångsbesökare, återkommande besökare och inloggad redaktör. Använd produktionsbygge lokalt och, när möjligt, kontrollerad Netlify-förhandsmiljö. Registrera dokument-/RSC-/API-anrop, förhandsladdning, svarstider, överförda byte, konsolfel och relevant funktionsstatistik.

Resor: startsida → textmapp → text → ordboksuppslag → nästa text; grammatiksida → hänvisning; resurssökning → bok/PDF; runsida → filter → detalj → tillbaka; inloggning → redigering → spara → anonym kontroll → utloggning.

Leverans: reproducerbara steg, testdata och mätvärden. Minst fem kalla och fem varma körningar för centrala läsresor på samma enhet/nätprofil.
Grind: skilj nätverksförfrågningar från faktiskt registrerade funktionskörningar. Samla inga sessionstoken, råa cookies eller onödiga personuppgifter i rapporten.

### E03 – Kartlägg routes och cachehinder

Inventera alla pages, layouts, route handlers, server actions och middleware. Följ `cookies`, `headers`, `searchParams`, databasåtkomst, adminberoenden och klientanrop. Klassificera varje route som publik stabil, publik föränderlig, query-beroende eller privat. Kontrollera även ordbok och runsida; utgå inte från att endast de fyra observerade sidorna är dynamiska.

Leverans: routematris med datakälla, rendering, cachepolicy, aktualitetskrav och invalidationshändelser.
Grind: hela rotlayoutens beroendekedja är känd. Trafiktoppar tillskrivs inte robotar eller kodfel utan belägg.

### E04 – Separera session från offentlig layout

Gör en liten prototyp av publik sessionsoberoende layout och separat adminfunktion. Välj mellan en klientbaserad, delad sessionsprovider och tydligt avskild administrativ layout efter test av befintlig inline-redigering. Behåll redigerarens befintliga arbetsflöde; ny extra inloggning per sida är inte acceptabelt.

Undvik att ersätta varje sidrendering med ett nytt sessions-API-anrop per navigation. Återanvänd klientens sessionstillstånd, uppdatera vid in-/utloggning och tokenförnyelse, och verifiera rollen på servern för alla mutationer. Klientens adminflagga får bara styra presentationen.

Leverans: testad prototyp och beslut med motivering.
Grind: anonym sida saknar sessionsberoende; inloggad redaktör kan fortfarande redigera. Ingen blinkande adminpanel, innehållsförskjutning eller delad cache med persondata.

### E05 – Inför säker offentlig dataläsning

Separera offentliga läsningar från den cookieberoende Supabase-klienten när databaskällan används. Verifiera publiceringsstatus och RLS. Bevara ordning, länkar och metadata. Använd inte service-role i klienten och anta inte att ett fält kallat `utkast` redan utgör åtkomstskydd.

Vid databasfel får en gammal filfallback inte oavsiktligt cachas som lyckad, aktuell publicering under lång tid. Definiera sist fungerande innehåll, felloggning och återhämtning.

Leverans: testad publik läsväg med samma innehåll som före ändringen.
Grind: två användarsessioner och anonym klient får rätt separerade resultat. Ingen ändrad datakälla eller utökad läsbehörighet sker för att uppnå cacheträffar.

### E06 – Optimera startsidan som pilot

Ta bort dynamiktvång först när E04–E05 är klara. Prova förgenerering för filkälla och återvaliderad rendering för databasversionen. Behåll animationer, typsnitt och interaktioner.

Leverans: fungerande pilot med före/efter-mätning.
Grind: buildrapport och verkliga svar visar avsedd rendering. Upprepade varma besök ger tydlig minskning av serverkörningar, inte bara kortare körtid. Ingen visuell eller funktionell regression.

### E07 – Texter och Grammatik

Generera alla befintliga mapp- och dokumentsökvägar där det passar, inklusive optional catch-all-roten. Bevara 404 för felaktiga adresser och källhänvisningar. Bestäm hur nya databasnoder blir nåbara utan att ett gammalt byggmanifest låser ute dem. Behåll sidofält, brödsmulor och föregående/nästa.

Leverans: optimerade läsroutes och automatiserad kontroll av samtliga befintliga dokumentadresser.
Grind: fullständigt innehåll finns i initial HTML, specialtecken och ordklick fungerar, direktlänk och omladdning ger samma dokument. Ingen massiv klientnedladdning av hela textsamlingen.

### E08 – Resursbibliotek och PDF-läsning

Återanvänd publika biblioteksdata utan att förlora sökning, hash-länkar, omslag eller läsarstatus. Kontrollera stora PDF:ers range requests och befintlig läsposition. Utvärdera statiska filer och headers separat från serverfunktionskvoten.

Leverans: fungerande bibliotek med färre onödiga serverkörningar.
Grind: filtrering är lika snabb, bok öppnas på rätt ställe och PDF-behavior försämras inte. Försök inte spara anrop genom att förladda alla PDF:er.

### E09 – Ordboksuppslag och sökning

Kartlägg parametrar och resultatversion innan cache införs. Cache-nyckeln ska skilja relevanta ordformer och filter. Bevara språkligt betydelsefulla tecken. Inför begränsad klientcache och deduplicering av samtidiga identiska uppslag; avbryt eller ignorera föråldrade svar när ett nytt ord väljs.

Pröva cache för offentliga GET-svar enligt adapterstödet. Cachning av personliga rättelser, adminvyer eller fel som lyckade svar förbjuds. Invalidationen måste följa ordboksuppdateringar. Lägg inte hela ordboken i webbläsaren.

Leverans: identiska sökresultat med minskat upprepat arbete.
Grind: snabba ordbyten visar alltid rätt ord; omladdning, fel, tom träff och specialtecken är testade. Upprepade uppslag blir inte långsammare.

### E10 – Runsida, förhandsladdning och middleware

Mät kartans filter, animationer, URL-uppdatering och detaljnavigation. Kontrollera om uppspelning orsakar servernavigation; ändra endast när detta verifierats. Behåll delbara länkar och tillbaka/framåt.

Pröva selektiv förhandsladdning endast på bevisat kostsamma vyer med många länkar. Mät navigationens svarstid före/efter. Granska middleware-matchning och sessionsförnyelse utan att ta bort skydd för server actions eller relevanta routes. Edge-anrop rapporteras separat.

Leverans: avgränsade åtgärder där mätning visar nytta.
Grind: karta och tangentbordsstyrning fungerar oförändrat; långvarig redigerarsession förnyas korrekt. Inga generella botspärrar eller CAPTCHA för vanliga läsare införs som standardlösning.

### E11 – Aktualitet och redaktionell invalidation

Definiera invalidation för ändra, skapa, flytta och radera dokument, ändra titel/ordning, uppdatera startsida, resurser och ordbok. Inkludera beroenden: träd, syskonnavigation, listor och detaljvyer. Ersätt bred rotinvalidation bara när rätt smalare beroenden är bevisade.

Mål: redaktören ser sparat innehåll direkt efter lyckat svar; en ny anonym läsning visar det inom högst 10 sekunder i kontrolltest. Redovisa separat vad som händer i redan öppna flikar. Om detta inte klaras ska publiceringens cachemodell ändras, inte fördröjningen döljas. Lägg inte global polling på alla besökare.

Leverans: händelse→invalidation-matris och tester i två separata webbläsarsessioner.
Grind: inga fantomrader, kvarvarande borttagna dokument eller blandade versioner. Nekad mutation invaliderar inte offentlig cache.

### E12 – Samlad funktions-, säkerhets- och tillgänglighetskontroll

Kör befintliga relevanta tester, `npm run validate:kallor`, `npx tsc --noEmit` och `npm run build`. Dokumentera befintliga orelaterade fel separat. Lägg till meningsfulla regressionstester för route-täckning, behörighet, aktualitet och cacheseparation.

Testa alla besökarresor från E02 på mobil och desktop, med långsamt nät, kall/varm cache, in-/utloggning samt öppna flikar. Prova även utgången session, databasfel och misslyckad sparning. Kontrollera tangentbord, fokus, reduced motion och konsolfel.

Leverans: godkännanderapport med evidens.
Grind: samtliga obligatoriska funktioner fungerar. Inga förlorade redigeringar, oavsiktligt publika data, trasiga URL:er eller nya bestående JavaScript-fel.

### E13 – Verifiera på Netlify och förbered återställning

Kör samma mätningar på en tillgänglig förhandsmiljö med dokumenterad adapterversion. Prova både första anropet efter deploy och upprepade anrop. Netlify anger att även förgenererade sidor kan kräva en funktionskörning första gången efter deploy; målet är inte ett obestyrkt löfte om noll körningar.

Kontrollera CDN-/cacheheaders och faktiska funktionskörningar, HTML respektive RSC, query-varianter och användarsessioner. Lägg inte manuella generella cacheheaders över Next.js interna svar; cachevariationer måste hanteras korrekt.

Leverans: Netlify-verifiering och dokumenterad tidigare fungerande deploy/commit samt återställningssteg. Efter rollback ska nytt innehåll och cacheversion kontrolleras igen.
Grind: besökarupplevelsen godkänd och anropsminskning visad. Om kvotstopp hindrar deploy är etappen blockerad; lokal framgång är inte molnverifiering.

### E14 – Kontrollerad lansering och uppföljning

När publicering är auktoriserad: börja med pilotändringen och kontrollera innan återstående grupper förs ut. Återställ direkt vid behörighetsläcka, innehållsförlust, bruten läsning eller sparning. Vid tydlig hastighetsregression, pausa vidare utrullning och åtgärda eller återställ.

Mät efter första timmen, efter ett dygn och efter sju dygn när trafik finns. Detta är kontrollpunkter för genomförandet, ingen automation är skapad. Jämför anrop per relevant besökarresa och trafikmix, inte bara totalsiffror före/efter. Skilj kallstarter, deployeffekter och robottrafik från normal användning.

Leverans: slutrapport med faktisk minskning, kvalitetsutfall, öppna risker och förvaltningsanvisning.
Grind: inga konstaterade regressioner och rimlig månadsprognos. Redan förbrukade anrop återställs inte av optimeringen.

## Mätbara kvalitetskrav

Följande är föreslagna godkännandegränser, inte uppmätta resultat:

| Område | Krav |
|---|---|
| Funktion och innehåll | Alla centrala resor godkända; samma publika innehåll och URL:er. |
| Säkerhet | Inga privata data i delad cache; alla skrivåtgärder verifierar behörighet på servern. |
| Läsbarhet | Text finns utan att behöva vänta på klienthämtning; oförändrade tecken, rubriker och länkar. |
| Visuell stabilitet | Ingen ny synlig layoutförskjutning; CLS-mål högst 0,1. |
| Laddning | LCP-mål högst 2,5 s i avtalad mobilprofil; median får inte försämras mer än 10 % mot samma baslinje. |
| Interaktion | Ingen mätbar återkommande försämring över 10 % i navigation eller uppslag. Vid mätbrus upprepas jämförelsen. |
| Aktualitet | Sparning bekräftas sanningsenligt; ny anonym läsning uppdateras inom kontrollmålet 10 s. |
| Serveranrop | Riktmärke minst 80 % färre vid upprepade anonyma läsresor, verifierat på Netlify; faktisk effekt rapporteras även om målet inte nås. |
| Total resursåtgång | Inga stora ökningar av klient-JS, bandbredd, byggtid eller databasbelastning som döljer en flyttad kostnad. |

Fem testkörningar ger en första jämförelse men inte en säker p95. Använd fler observationer för percentiler och redovisa urval och mätmiljö. En låg funktionskvot får aldrig prioriteras framför säkerhet eller korrekt innehåll.

Planera exempelvis för högst 80 000 anrop per period som intern varningsnivå om 125 000-gränsen kvarstår. Detta är marginal, inte en garanti: kraftigt ökad trafik kan kräva annan kapacitet även efter god optimering. Beräkna prognosen från flera representativa dygn och antal återstående perioddagar. Utred missbruk först när trafikdata stöder det.

## Vad nästa AI ska göra först

Läs denna plan och aktuell Git-status. Skapa nulägesprotokollet och routematrisen E01–E03. Ändra inte `force-dynamic` överallt i ett enda steg. Implementera och verifiera separationen av session och publik rendering före pilot på startsidan. Bevara pågående arbete med texter och runor. Dokumentera exakt vilka steg som är färdiga, lokalt testade respektive verifierade på Netlify.

## Referenser

Kontrollerade 2026-10-25. Använd dokumentation som stämmer med installerad version vid genomförandet.

- [Next.js 14: Caching](https://nextjs.org/docs/14/app/building-your-application/caching): dynamiska beroenden, cachelager och invalidation.
- [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/): adapter, stöd för rendering, cache och middleware. Faktisk adapterversion måste kontrolleras i projektets bygglogg.
- [Functions usage and billing](https://docs.netlify.com/build/functions/usage-and-billing/): mätning av anrop och funktionsanvändning.
- [Projektets användning](https://app.netlify.com/projects/fornsvenska/functions?tab=usage): kontospecifika siffror och period, kräver inloggning.
