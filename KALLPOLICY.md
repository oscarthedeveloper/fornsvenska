# Källpolicy för Fornsvenska Studielabbet

Denna policy gäller allt grammatiskt innehåll. Målet är inte bara en lång
grammatik, utan en grammatik där varje regel, form och tolkning kan kontrolleras
mot det lokala källmaterialet.

## 1. Sluten källkorpus

Endast verk i `data/kallor.ts` får användas. Ett verk identifieras med ett
stabilt käll-ID; filnamnet är aldrig dess identitet. En ny fil får inte användas
förrän den har klassificerats och lagts till i registret.

Registret skiljer mellan:

- primärkällor och textutgåvor, som belägger en faktisk språkform;
- vetenskapliga sekundärkällor, som belägger analys och generalisering;
- handböcker, som används för systematiska översikter och paradigm;
- arbetsunderlag, som hjälper redaktionen att hitta ämnen men inte ensamt får
  belägga ett publicerat påstående;
- perifert material, som bara används inom sitt uttryckliga ämnesområde.

Källnivåerna anger funktion, inte att alla påståenden i en viss kategori är
ofelbara. Ett primärbelägg visar att en form förekommer i en bestämd text; det
visar inte ensamt hur vanlig eller allmängiltig formen är.

## 2. Dubbletter

Flera filer kan representera samma verk. De registreras under samma käll-ID och
får relationen `exakt-dubblett` eller `innehallsdubblett`. Sådana filer räknas
aldrig som flera oberoende källor.

## 3. Minsta tillåtna hänvisning

Varje hänvisning måste innehålla:

1. käll-ID;
2. exakt lokalisering: sida och vid behov paragraf, tabell, bilaga, inskrift,
   diplomnummer, handskriftsblad eller motsvarande;
3. stödtyp: primärbelägg, regel, paradigm, analys, bakgrund eller metod.

Formuleringar som "avsnittet om substantiv" eller enbart en boktitel är inte
tillräckliga i publicerat innehåll. PDF-sida och tryckt sida måste särskiljas när
de inte sammanfaller.

## 4. Vad som ska beläggas

Följande innehållsenheter ska alltid ha minst en strukturerad hänvisning:

- ingressens faktapåståenden;
- primärtext och citat;
- grammatiska regler och undantag;
- paradigm och andra tabeller;
- historiska, geografiska och genremässiga påståenden;
- tolkningar av enskilda språkformer;
- sammanfattande observations- och nyckelrutor.

Rubriker och rena navigationsfält behöver ingen hänvisning.

## 5. Primärbelägg och analys hålls isär

När ett exempel analyseras ska hänvisningen normalt skilja mellan:

- källan till själva textformen; och
- källan till den grammatiska analysen.

En maskintext eller transkription får citeras som primärbelägg, men en egen
analys får inte presenteras som om den stod i utgåvan. Om en sekundärkälla både
återger och analyserar materialet anges dess exakta sida och textens identitet.

## 6. Variation och generalisering

Ett resultat från ett enda diplom, en enda handskrift eller en enda genre får
inte utan stöd formuleras som en regel för hela fornsvenskan. Artikeln ska ange
relevant period, ort, genre och materialstorlek när källan gör det.

Runsvenska, klassisk fornsvenska, yngre fornsvenska, äldre nysvenska,
fornvästnordiska och normaliserade jämförelseformer får inte blandas i samma
paradigm utan tydlig märkning.

## 7. Citat och normalisering

Direkta citat återges efter källan. Redaktionen ska ange om formen är:

- diplomatarisk eller normaliserad;
- translittererad eller transkriberad;
- rekonstruerad;
- emenderad;
- hämtad ur en modern sekundärkälla i stället för direkt ur primärtexten.

OCR-text betraktas som sökhjälp. Stavning, specialtecken, tabeller och
sidreferenser kontrolleras mot den synliga PDF-sidan före publicering.

## 8. Oenighet och osäkerhet

Om källorna ger olika analyser ska grammatiken redovisa skillnaden och knyta
varje tolkning till rätt källa. Redaktionen får inte skapa en kompromiss som
ingen källa stöder. Osäkra belägg markeras som osäkra.

## 9. Publiceringsgrind

`npm run validate:kallor` kontrollerar att:

- varje fil i `Källor` är registrerad exakt en gång;
- deklarerade verk och filer finns;
- byte-identiska dubbletter är uttryckligen markerade;
- käll-ID:n är unika;
- publicerade grammatikdokument har strukturerade hänvisningar och exakta
  lokaliseringar;
- alla faktabärande block, ingresser och citat är källkopplade.

Utkast får sparas med varningar för att ofärdigt arbete ska kunna bevaras.
Samma brister är blockerande fel så snart utkaststatus tas bort.

## 10. Arbetsgång för nytt innehåll

1. Välj ämne och identifiera relevanta registrerade verk.
2. Läs hela det relevanta avsnittet, inklusive noter, tabellrubriker och
   materialbeskrivning.
3. Registrera hänvisningarna med exakta lokaliseringar.
4. Skriv regeln utan att gå längre än källornas belägg.
5. Lägg till primärbelägg och skilj det från analysen.
6. Kör källvalidering och TypeScript-kontroll.
7. Ta bort utkaststatus först när inga källvarningar återstår.

Den redaktionella källplanen för samtliga planerade grammatikartiklar finns i
`data/grammatikplan.ts`. Den pekar ut relevanta verk men ersätter aldrig den
sidexakta hänvisningen i den färdiga artikeln.

