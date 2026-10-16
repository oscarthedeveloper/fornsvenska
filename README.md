# Fornsvenska Studielabbet

Mall för en självstudieplattform i fornsvenska (1225—1526). Detta är
**startsidan** — byggd som ett textkritiskt instrumentpanel snarare än en
romantisk-nationell pastisch.

## Kom igång

```bash
npm install
npm run dev
```

Öppna http://localhost:3000

## Struktur

```
app/
  layout.tsx        Typsnitt (Newsreader, Martian Mono, Noto Sans Runic) + metadata
  globals.css       Palett, typskalor, hörnparenteser, ringanimation
  start.css         Startsidan: komposition, 3D-djup, skanning och rörelse
  page.tsx          Startsidan: renderar components/start/Startsida
components/
  start/Startsida.tsx  Rubrik, spalter och knapp — allt redigerbart
  start/Runsten.tsx    Runrad, punktmoln och yttre transkriberingsbana
  start/Runsten3D.tsx  Bildfront och tolv djuplager i en CSS-3D-kropp
  start/useTilt.ts     Rörelseslingan: pekarlutning och tröghet
public/
  runsten-hero.png     Högupplöst frilagd granityta
  Toppnav.tsx       Navigeringen — samma på alla sidor
  ColophonStrip.tsx Svarta remsor högst upp och längst ned (undersidorna)
  LeftPanel.tsx     Gamla startsidans vänsterpanel — används inte längre
  InstrumentPanel.tsx Gamla startsidans instrumentpanel — används inte längre
  RunicWheel.tsx    Inline-SVG med medeltidsrunraden — används inte längre
  Mark.tsx          Triangelmärket i navigeringen
```

De tre gamla panelerna ligger kvar orörda ifall något av dem ska tillbaka.

## Designregler att hålla fast vid när sidan växer

- **Fem färger, inga fler.** `--paper #FDFBEF`, `--panel #FFFFFF`,
  `--ink #111111`, `--accent #FF5C39`, `--azure #3EB8F0`.
- **Två typsnitt.** Newsreader (serif) endast till rubrik och stora siffror,
  Martian Mono till allt annat. Ingen grotesk någonstans.
- **Inga dekorativa gradienter, skuggor eller rundade hörn.** Stenens naturliga
  djupskugga och skannerljusets glöd är funktionella undantag.
- **Azurblått är enbart bakgrundsfärg** — aldrig text på papper.
- **Runorna är medeltidsrunor**, inte urnordisk futhark. Klassen `.rune`
  laddar Noto Sans Runic; utan den blir glyferna tofu.
- **Rörelse används sparsamt.** Runstenen gör en entré och går därefter in i
  en långsam skanningscykel. All rörelse stannar vid `prefers-reduced-motion`.

## Startsidan

Rubrik, två korta spalter, en knapp — och en monumental runsten som glider in
snett nedifrån vänster. Stenen står diagonalt från nedre vänster mot övre
höger. Basen fortsätter utanför bildens nederkant: föremålet är helt, men
kamerans utsnitt är medvetet för litet för det.

**All text på startsidan är redigerbar på plats.** Rubrik, båda spalterna och
knapptexten sparas i tabellen `sidor` under slug `start`
(`supabase/startsida.sql`, `lib/sidor.ts`, `lib/sidActions.ts`). Utan databas,
eller innan något skrivits, gäller standardtexten i `lib/sidtyper.ts` — sidan
ska aldrig stå tom för att en fråga misslyckades.

### Stenens djup och material

Fronten är ett frilagt, högupplöst granitföremål med kristallkorn, vittring,
sprickor och verklig kantskuggning. Bakom fronten ligger tolv alfamaskerade
kopior i en `transform-style: preserve-3d`-kropp. När stenen vrids med
pekaren bildar de en mörk, fysisk kant i stället för att hela föremålet ser ut
som ett platt fotografi. Ingen WebGL eller extern 3D-motor behövs.

### Rörelsen

`components/start/useTilt.ts` håller **en enda** rAF-slinga för stenens
rotation. Värdena skrivs direkt som CSS-variabler på scenen — aldrig genom
React-tillstånd. Pekaren styr med eftersläpning, dragning ger en liten vridning
med tröghet, och efter ett par sekunders stillhet börjar stenen röra sig svagt.

### Skanningen och läsningen

Efter entrén sveper ett blått strukturljus längs stenen. Ett koordinatnät och
punktmoln byggs fram i samma riktning. Runorna går upp längs vänsterkanten,
över hjässan och ned längs högerkanten. Den latinska translittereringen skrivs
progressivt i en parallell bana **utanför** siluetten. Hela sekvensen upprepas
långsamt.

### Att tänka på

- `animation-fill-mode: backwards`, inte `both`. Efter inanimationen måste
  elementens egna regler gälla igen, annars låser sluttillståndet fast
  transformen och parallaxen slutar fungera.
- Vid `prefers-reduced-motion` startar rAF-slingan aldrig. Stenen visas direkt
  och hela translittereringen ligger stilla runt föremålet.

## Responsivt

| Bredd | Beteende |
|---|---|
| ≥900px | Exakt en skärmhöjd utan scroll, även på låg desktop |
| ≤899px | Spalterna staplas och sidan får en kort mobilscroll |
| ≤520px | Stenen förstoras och fortsätter långt utanför vänsterkanten |

## Höjdmedveten typskala

Rubriken och statistiksiffran skalas med `min(vw, vh)`, inte enbart med `vw`.
Anledningen: rubriken har bara halva viewportens bredd att breda ut sig på,
medan vänsterpanelens vertikala budget är fast (navbar + ögonbrynsrad +
tagline + statistikblock). På breda men låga fönster spiller ett rent
vw-baserat värde över navigeringen. Samma logik styr paddingar och radavstånd
i hero-blocket.

Statistiknoten mäts i stället mot **cellens** bredd med container queries
(`cqw` i `.stat-lines`), så att den alltid håller sig på exakt två rader.

## Grammatik-arkivet (`/grammatik`)

Två vyer över samma träd, växling uppe till höger:

- **Arkiv** (förvald) — hängmappar med flikar som växlar sida varannan rad och
  överlappar uppåt. Klick på en mapp ersätter stapeln med mappens innehåll och
  brödsmulraden visar var man är. Fickan längst fram bär mappens namn.
- **Träd** — hela hierarkin med streckade förbindelselinjer och en notkolumn
  till höger, i stil med en filträdsutskrift.

Flikarnas silhuett ritas med `clip-path` (två lager: ett svart som ger 1px
kontur och ett papperfärgat ovanpå). Axlarna är därför vinklade i stället för
rundade — `clip-path` kan inte rundas, men formen skalar korrekt i alla
bredder. Vill du ha rundade axlar som i referensbilden går det att byta till
en border-baserad flik med `border-radius`.

### Mappfärger

Arkivet är undantaget från startsidans femfärgsregel: mapparna cirkulerar
genom sex dämpade toner (`--folder-1` … `--folder-6` i `globals.css`), som
alla ligger över 15:1 mot `--ink`. Hovring bleker ytan mot `--panel`, som om
mappen dras fram ur skåpet. Startsidan rör aldrig dessa variabler.

Vyvalet (arkiv eller träd) sparas i `localStorage` under `fsv:arkivvy` och
följer med tillbaka från ett dokument. Arkivvyn är förvald tills något annat
valts. Servern renderar alltid arkivvyn och effekten byter direkt efter
montering — därför kan ett kort ögonblick av arkivvyn synas innan trädvyn
slår igenom.

### Datalager

`lib/archive.ts` är enda vägen till innehållet och alla funktioner är redan
asynkrona, trots att källan just nu är `data/grammatik.ts`. När Supabase
kopplas in byts bara funktionskropparna — ingen vy skrivs om. Nodformen
motsvarar den tänkta tabellen:

```
nodes(id, parent_id, slug, title, kind, note, position)
```

### Sidramar

Startsidan har kvar sin egen låsta ram (`.viewport-lock` styr scroll-låset).
Undersidorna använder `components/SiteFrame.tsx`: samma kolofonremsor och
azurblå navigering, men ramen växer med innehållet.

## Grammatik-dokument (`/grammatik/.../dokument`)

Rutat ark på ett hårfint linjeraster, med en kompakt mörk sidebar till
vänster som visar hela trädet och markerar var man står. Sidebaren finns
**endast** inne i ett dokument — arkivet är fortfarande vägen in i materialet.

Brödtexten är antikva (Newsreader). Monospace behålls i etiketter, sidebar,
paradigmtabeller, metadata och kolofon, så släktskapet med startsidan finns
kvar utan att långa grammatikavsnitt blir tunga att läsa.

### Block

Ett dokument är en lista block, inte en textmassa — det är förberett för
adminläget, där varje block ska kunna läggas till, redigeras och tas bort
för sig:

| Typ | Innehåll |
|---|---|
| `rubrik` | h2/h3 i antikva |
| `stycke` | brödtext |
| `spalter` | tvåspaltssystemet: smal spalt med fornsvenskt utdrag, bred spalt med förklaring |
| `tabell` | paradigmtabell i monospace, valfri markerad rad |
| `obs` | OBS-ruta med etikettflik |
| `nycklar` | nyckel/värde-rader |
| `fargnyckel` | liten förklaringsruta för dokumentets färgmarkeringar |
| `flikar` | flikar där varje flik bär en egen blocklista |

Flikblocket är till för paradigm som hör ihop men inte ska ligga under
varandra — personliga pronomen med en flik per person, en flik per genus.
En flik innehåller vad som helst utom fler flikar; blocklistan är samma
komponent som dokumentets huvudflöde (`components/dokument/Blocklista.tsx`),
och den ritar flikblocket själv för att de annars skulle importera varandra
i ring.

### Uppmärkning i texten

| Skrivs | Blir | Kortkommando |
|---|---|---|
| `**fet**` | fet | Ctrl/Cmd + B |
| `*kursiv*` | kursiv | Ctrl/Cmd + I |
| `***båda***` | fet kursiv | B och I efter varandra |
| `_understruken_` | understruken | Ctrl/Cmd + U |
| `` `term` `` | fornsvenskt formord i monospace | Ctrl/Cmd + E |
| `==1|laghum varum==` | transparent överstrykning, färg 1–8 | Formatera → färg |
| `[^1]` | fotnotshänvisning | — |
| `\*` | tecknet självt | — |

Kortkommandona verkar i alla redigerbara fält: markera text och tryck, tryck
igen för att ta bort. Undantaget är dokumentets titel och mappnamnen i
arkivet — de är också nodens namn i sidebar, brödsmulor och trädvy, där
markörerna hade synts som tecken. Markörerna lagras som ren text i databasen — det som
står i fältet är exakt det som ligger i `content`.

Färgpaletten öppnas med **Formatera** i adminlisten. Markera först ett ord
eller en fras och välj sedan en av de åtta färgerna. Samma färg igen tar bort
markeringen; en annan färg byter den. Blocket **Färgnyckel** kan infogas var
som helst och visar både färgnamn och betydelse, så informationen aldrig bärs
av enbart färg.

Markörerna måste sitta tätt intill texten, `*så här*` och inte `* så här *`.
Det är inte kosmetik: asterisk framför ett ord betyder rekonstruerad form i
språkhistoria, och `*wiþer ok *bonde` ska inte bli kursiv text. Behövs en
asterisk mitt i en formatering skrivs den `\*`.

Fotnoterna listas under rubriken Källor längst ned på arket.

Dokument utan innehåll renderas med ett tomt ark och en förklaring i stället
för att gå sönder — så arkivet kan innehålla fler poster än vad som är skrivet.

## Resursbibliotek (`/resurser`)

Katalogen visar alla verk i `data/kallor.ts`, grupperade på hyllor, tillsammans
med extra resurser från databasen. Källuppgifter, filer och hänvisande
grammatikartiklar visas i detaljpanelen. Sökningen omfattar även ämnen och
käll-ID. `/kallor` omdirigerar till `/resurser`; länkar med käll-ID öppnar
motsvarande post. De fasta källposterna redigeras i källregistret.

**Hyllor.** Fria rader som du själv namnger och flyttar. Resurserna står på
en planka och rullar i sidled — en hylla ska se ut som en hylla, inte som ett
rutnät. Resurser vars hylla tagits bort hamnar under Osorterat i stället för
att försvinna.

**Omslag.** Laddas upp till Supabase storage (bucketen `resurser`). Saknas
bild ritas ett typografiskt standardomslag: typ, titel och upphov mot en
dämpad ton som härleds ur titeln, så att samma resurs alltid ser likadan ut.

**Tillgänglighet** graderas 1–5 och handlar om hur svårt materialet är att
komma över, inte om kvalitet: 1 nästan omöjlig, 5 fritt tillgänglig online.
Finns en läsbar utgåva på nätet läggs länken på resursen.

**Skriftkammaren.** Lagar, brev och diplom har inga omslag och skulle bli
tomma rutor på en hylla. De får därför en egen avdelning där kortet ser ut
som ett dokument, och öppnas i en läsare *i samma vy* — aldrig i ett nytt
fönster, eftersom hela poängen är att hoppa mellan versionerna av samma text
utan att tappa stället.

Varje skrift kan ha flera versioner som ligger som flikar. Texten skrivs med
en egen markering ovanpå den vanliga uppmärkningen:

| Skrivs | Blir |
|---|---|
| `==ordet==` | markerat med versionens första ton |
| `==ordet\|Verb==` | markerat, och etiketten Verb får en egen ton i teckenförklaringen |

Tomrad bryter stycke. Etiketterna får sina toner i den ordning de först
förekommer, och listas automatiskt ovanför texten.

Databasen sätts upp med `supabase/resursbibliotek.sql`, som är separat från
`schema.sql` och kan köras om utan skada.

## Texter (`/texter`)

Samma arkiv som Grammatik — hängmappar och trädvy delar komponenter, och båda
rötterna går genom `lib/archive.ts`. Trädet rymmer lagar, urkunder och brev,
runinskrifter och religiös prosa; långa texter ligger som flera dokument under
samma mapp (t.ex. Kristnu balkær del I och II).

### Textdokument

Två **lika breda** spalter: utdraget till vänster, översättning och tolkning
till höger. Utdraget delas i sektioner om ungefär fem meningar, och varje
mening analyseras för sig.

Meningarna färgmarkeras med fem dämpade överstrykningstoner (`--mark-1` …
`--mark-5`). Färgerna skiljer meningarna åt inom en sektion och återanvänds
mellan sektioner, precis som du beskrev. Varje mening bär dessutom ett nummer,
både i utdraget och på brickan framför tolkningen — färgen ensam får aldrig
bära informationen, för läsare som inte skiljer tonerna åt.

Innehåll som inte är genomarbetat märks med `utkast: true` och får en liten
Utkast-bricka vid rubriken.

## Innehållet i databasen

Från och med nu läser sajten från Supabase när nycklarna finns i `.env.local`,
annars från filerna i `data/`. Se **SUPABASE.md** för uppsättningen.

Mappar och dokument ligger i samma tabell, `nodes`, med dokumentinnehållet som
JSONB i kolumnen `content` — exakt samma form som TypeScript-typerna i `lib/`.
Ett separat blocktabell hade gett finare versionshantering, men för en sajt med
en författare är JSONB enklare att både skriva och läsa, och hela dokumentet
sparas ändå i ett svep.

Skrivskyddet ligger i databasen (radsäkerhet), inte i gränssnittet:
redigeringsknapparna döljs för utomstående, men även om någon skickade en
förfrågan direkt avvisas den om användaren saknas i tabellen `admins`.
## Källsystem

Projektets källregister finns i `data/kallor.ts`. Redaktionella krav på
proveniens, exakta lokaliseringar och publiceringskontroll beskrivs i
[`KALLPOLICY.md`](./KALLPOLICY.md).

Den fullständiga grammatikarkitekturen och produktionsordningen beskrivs i
[`INNEHALLSPLAN.md`](./INNEHALLSPLAN.md); artikel–källkopplingarna finns i
`data/grammatikplan.ts`.

Kontrollera källregistret och alla lokala grammatikdokument med:

```bash
npm run validate:kallor
```
