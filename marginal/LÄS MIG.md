# Marginal

En lokal anteckningsapp i fristående HTML, inspirerad av Fornsvenskas formspråk. Inga installationer, konton, externa bibliotek eller internetanslutningar behövs.

Dokumentvyn är grunden för hela appens utseende. Bokhylla, arbetsytor, sökning och arkiv delar samma svarta registerpanel, korallfärgade accenter, Newsreader- och Martian Mono-typografi och vita rutade ark. På lapptavlan kan lapparna placeras fritt.

Appen fyller fönstret från kant till kant. Varje studierum har en **lapptavla** för flyttbara lappar och en **dokumenthylla** för övriga anteckningar.

## Öppna

Dubbelklicka på `index.html` och öppna den i Safari, Chrome eller Firefox på din Mac. Använd samma fil och samma webbläsare nästa gång. Appen är en HTML-app i webbläsaren, inte en installerad macOS-app.

Det första biblioteket innehåller tydligt angivna exempel som du kan skriva över eller lägga undan. Skapa ett eget studierum med plusknappen vid **Mina studierum**.

## Arbeta

- Skapa bokrum, ämnesrum eller skrivprojekt. Böcker kan ha författare och utgåva.
- Använd det kompakta registret till vänster för att öppna både rum och enskilda anteckningar. I smala fönster öppnas registret med **Bibliotek** uppe till vänster.
- Byt mellan **Lapptavla** och **Dokumenthylla** med flikarna i rummet. Navbarens **Lappar** och **Dokument** samt registerpanelens genvägar leder också till respektive arbetsyta i det aktuella rummet.
- På **Lapptavla** skapar **Ny lapp** en lapp direkt på tavlan. Skriv direkt i lappen och placera den fritt. Befintliga lappar behåller sina tidigare placeringar.
- På **Dokumenthylla** väljer du **Nytt dokument** för att skapa ett dokument, en kapitelreflektion, ett citat eller en läsmarkör (**Här slutade jag**). Anteckningarna visas som kort på hyllan. Ett klick öppnar anteckningens egen sida.
- Öppna en lapp på en egen sida med pilen i hörnet eller genom att dubbelklicka på lappens ram. Alla anteckningssidor har ett kompakt dokumentträd.
- Dokumentsidan följer Fornsvenskas dokumentvy: svart sidopanel, korallfärgad registerrad, vitt rutat dokumentark och samma lokalt inbäddade typsnitt, Newsreader och Martian Mono.
- Befintliga anteckningar öppnas i läsvy. Välj **Redigera** för att skriva och **Läs dokument** för att se den formaterade texten. Nya dokument öppnas direkt i skrivvyn.
- Dokumentträdet visar rummen och deras anteckningar. Använd det, eller **Föregående / Nästa** längst ned, för att byta anteckning. I smala fönster öppnar du trädet med **Dokumentträd**.
- Varje anteckning och arbetsyta har en egen adress i HTML-filens adressfält. Omladdning återöppnar samma sida; webbläsarens bakåt-/framåtknappar fungerar. **Tillbaka** tar dig till rätt lapptavla eller dokumenthylla och bevarar även sökningen eller arbetsytans rullningsläge.
- Dra kort i handtaget `⠿`. Handtaget kan även flyttas med piltangenterna; håll Skift för större steg.
- Använd textverktygen för rubriker, fetstil, kursiv, listor, citat och överstrykningar. Verktygen infogar enkel Markdown. **Läs dokument** visar formateringen.
- Sök med fältet uppe till höger eller `⌘K`. Sökningen omfattar text, titlar, källhänvisningar och rum. Kryssa i **Sök även i arkivhyllan** för undanlagt material.
- Öppna **Rummet** för att byta namn, välja färg eller lägga undan hela rummet. En enskild anteckning läggs undan i dess skrivvy.
- **Arkivhyllan** bevarar innehåll och placeringar. Öppna ett undanlagt rum och välj **Ta fram rummet**, eller öppna en undanlagd anteckning och välj **Ta fram**.

## Lagring och säkerhetskopior

Ändringar sparas automatiskt i webbläsarens `localStorage`. Inget skickas till någon server. Appens innehållssäkerhetspolicy blockerar nätverksanrop. Typsnitt och ikoner finns lokalt eller i HTML-filen.

Typsnitten distribueras under SIL Open Font License 1.1. Fullständiga licenser finns inbäddade i HTML-filen och i mappen `licenses`.

**Webbläsarlagring är inte samma sak som en vanlig dokumentfil.** Anteckningarna skrivs inte in i själva HTML-filen. Rensad webbplatsdata, privat surfning, flyttad HTML-fil, annan webbläsarprofil eller byte av webbläsare kan göra biblioteket otillgängligt. Lagringsutrymmet är begränsat och varierar mellan webbläsare. Ett felmeddelande visas om sparandet misslyckas; exportera då innan du stänger.

Använd **Säkerhetskopia → Hämta hela biblioteket** regelbundet. JSON-filen innehåller samtliga rum, anteckningar, källhänvisningar, arkivstatusar och kortplaceringar. Spara den utanför iCloud Drive eller andra synkade mappar om du vill att den endast ska finnas på datorn.

En säkerhetskopia kan läsas in i appen. Importen lägger till nya exemplar utan att ersätta befintliga anteckningar. Enskilda anteckningar kan också exporteras som läsbara Markdown-filer (`.md`).

Öppna bara ett appfönster åt gången. Appen varnar om biblioteket ändras i ett annat fönster.

## Första versionens omfattning

Den här versionen fokuserar på skrivande vid en fysisk bok. Varje anteckning hör till ett rum och kan flyttas till ett annat. Samma anteckning på flera skrivbord, länkar mellan anteckningar, separata marginalkommentarer, bilder/bilagor och automatiska historiska versioner ingår inte ännu.

Gränssnittet fungerar i mindre fönster; själva skrivbordet kan rullas både vågrätt och lodrätt. Hela HTML-filen kan flyttas till en annan mapp, men exportera först biblioteket och importera det från den nya platsen om webbläsaren inte känner igen lagringen.
