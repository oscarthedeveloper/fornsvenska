# Innehållsplan för grammatiken

`data/grammatik.ts` är den kanoniska innehållsarkitekturen. Den omfattar 193
planerade artiklar i 38 mappar. Trädet är både en ämnesindelning och en möjlig
studieordning.

## Redaktionella principer

- Morfologin är kärnan: substantiv, adjektiv, pronomen, räkneord och verb får
  separata systematiska delar.
- Form, funktion och förändring hålls isär. Ett kasus behandlas exempelvis som
  både böjningskategori, syntaktisk funktion och historiskt föränderligt system.
- Runsvenska, äldre fornsvenska, yngre fornsvenska och senare svenska märks
  uttryckligen.
- Översiktsartiklar ger systemet; underartiklar ger paradigm, undantag och
  belägg.
- Tvärgående forskningsfrågor samlas dessutom under Förändring och variation,
  så att de inte splittrar grundframställningen.
- Pedagogiska artiklar och övningar får bara använda regler och exempel som kan
  spåras till den registrerade källkorpusen.

## Huvuddelar

1. Att studera fornsvenska
2. Ljudlära
3. Ortografi och textläsning
4. Morfologins grunder
5. Substantiv
6. Adjektiv
7. Pronomen och determinativer
8. Räkneord
9. Verb
10. Adverb
11. Prepositioner
12. Konjunktioner och subjunktioner
13. Negation
14. Ordbildning
15. Syntax
16. Förändring och variation
17. Studieverktyg

## Produktionsordning

### Prioritet 1 — morfologisk kärna

Morfologins grunder, hela nominalsystemet och hela verbsystemet. Inom denna
grupp skrivs substantiv och kasus först eftersom källkorpusen är starkast där.

### Prioritet 2 — nödvändiga förkunskaper och synteser

Introduktion, ljudlära, ortografi, adverb, prepositioner samt tvärgående
artiklar om förändring och variation.

### Prioritet 3 — syntaktisk utbyggnad

Syntax, negation och konjunktioner. Dessa delar använder de specialiserade
syntaktiska studierna men ska fortsatt länka tillbaka till morfologin.

### Prioritet 4 — kompletterande system

Ordbildning och studieverktyg. De byggs endast så långt det befintliga
källmaterialet räcker.

## Artikelmall

Varje artikel planeras med följande enheter:

1. lärandemål;
2. källäge och avgränsning;
3. regel eller systemöversikt;
4. paradigm eller strukturtabell;
5. kommenterade primärbelägg;
6. variation och osäkra fall;
7. historisk utveckling där källorna medger det;
8. övningar med källbundet facit.

`data/grammatikplan.ts` kopplar varje artikel till relevanta registrerade verk.
Kopplingen är en läs- och produktionsplan; den färdiga texten måste fortfarande
ha sidexakta hänvisningar enligt `KALLPOLICY.md`.

## Databas

Det lokala trädet används direkt när Supabase inte är konfigurerat. En redan
fylld Supabase-installation uppdateras innehållsbevarande med
`npm run sync:grammar-tree`. Skriptet skapar saknade noder och uppdaterar
strukturmetadata men skriver aldrig över dokumentinnehåll och raderar aldrig
äldre noder automatiskt. `SEED_FORCE=1` ska inte användas för detta eftersom
det tömmer roten och kan radera redaktionellt innehåll.

