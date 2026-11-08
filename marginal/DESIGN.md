# Marginals formspråk med dokumentvyn som grund

Analysen utgår från projektets faktiska komponenter och CSS, samt en visuell jämförelse med den lokalt exporterade artikeln **Vad är fornsvenska?**. Startsidan har ett annat visuellt syfte och används inte som mall för dokumenten.

| Del | Fornsvenskas implementation | Tillämpning i Marginal |
| --- | --- | --- |
| Appens yta | `components/SiteFrame.tsx`: inramad sidlayout med kolofon och navigering | Marginal fyller hela fönstret utan yttre marginal eller ram. Den svarta toppraden och märket i navbaren är borttagna. Dokumentarken behåller sitt papper och sin läsbredd. |
| Dokumentträd | `components/dokument/DocSidebar.tsx`: 236 px bredd, 26 px registerrad, täta hierarkiska rader | Samma bredd och registerhöjd. Rum är mappar, anteckningar är dokument. Det valda dokumentet markeras med korallfärg och `aria-current="page"`. |
| Trädets typografi | `.doc-tree-row`: 0,56 rem monospace, radavstånd 1,75 och bokstavsavstånd 0,03 em | Samma typografiska värden, prickade indenteringslinjer och ellips för långa namn. |
| Dokumentark | `components/dokument/DocumentView.tsx`: högst 900 px, 2,6 rem yttre dokumentmarginal, 3 rem sidpadding och 3,2 rem vertikal padding | Samma mått på stora skärmar, med anpassade marginaler i mindre fönster. |
| Papper | `.doc-sheet` i `app/globals.css`: vitt ark, 23 × 23 px rutnät i 7 % svart, 1 px ram och diskret skugga | Samma raster, ram och skugga. Bakgrunden runt arket har pappersfärgen `#FDFBEF`. |
| Färger | Svärta `#111111`, korall `#FF5C39`, pappersfärg `#FDFBEF` | Samma färger i dokumentvyn. |
| Typsnitt | `app/layout.tsx`: Newsreader och Martian Mono | Samma typsnitt, inbäddade från projektets lokala fontfiler, med licenser. Ingen extern hämtning vid användning. |
| Läshierarki | Serifrubrik 2–3 rem, brödtext 1,02 rem / 1,62, underrubriker 1,45 och 1,18 rem | Samma skala. Monospace används till etiketter och metadata, serif till löpande text. |
| Dokumenthuvud | Brödsmulor, titel, kompakt underrad, heldragen linje och streckade metadatafält | Samma uppbyggnad, med studierum, sida/kapitel/vers och senaste ändringsdatum. |
| Källor och syskon | Källhänvisningar och länkar till föregående/nästa dokument efter innehållet | Bokens uppgifter och anteckningens hänvisning visas tillsammans. Föregående/nästa byter anteckning inom rummet. |

## Samma form genom hela biblioteket

Dokumentvyn är nu den gemensamma visuella grunden för hela appen. Skrivbord, bokhylla, alla anteckningar, sökresultat, arkivhylla och dialoger använder samma färger, typsnitt och linjer. De gemensamma variablerna i HTML-filens `:root` styr också dokumentvyn.

- Alla sidor fyller fönstret från kant till kant. En gemensam låg navbar och svart sidfot håller ihop appen, utan yttre ram, kolofonremsa eller Marginal-märke i navbaren.
- Bibliotekets navigation är ett kompakt svart register på 236 px med korallfärgad rubrikrad. Under rummen visas anteckningarna som länkar med samma prickade indenteringslinjer som i dokumentträdet.
- Bokhyllan, anteckningslistorna, arkivet och sökresultaten presenteras på vita rutade ark med samma högsta bredd, raster, marginaler och rubrikskala som dokumenten.
- Varje studierum har två arbetsytor. **Lapptavlan** är en whiteboard för enbart lappar, med fri placering och direkt skrivande. **Dokumenthyllan** visar dokument, kapitelreflektioner, citat och läsmarkörer som kort, på samma sätt som rum på bokhyllan.
- Lapparna liknar mindre dokumentark med vitt rutat papper, tunna svarta ramar, seriftext, kompakta registerrader och streckade hänvisningsfält. Dokumenthyllans kort visar typ, titel, textutdrag, hänvisning och datum.
- Mapparnas färg används på flikar och lapparnas färg i registerraden. Färgen kompletterar det gemensamma vita pappret i stället för att byta hela sidans uttryck.
- Nya rum, val av anteckningstyp och säkerhetskopiering använder samma fyrkantiga knappar, korallfärg och dokumentpapper.

I smala fönster är registret öppningsbart. I bredare fönster ligger det på samma plats och har samma bredd som dokumentvyns sidopanel.

## Navigation och redigering

Anteckningar har egna sidor genom hashadresser, exempelvis `index.html#/anteckning/<id>`. Det ger riktiga navigationssteg, direktlänkar och stöd för omladdning och bakåt/framåt utan att kräva en server. HTML-filen kan fortfarande öppnas lokalt.

Lapptavlan har adressen `#/rum/<id>/lappar` och dokumenthyllan `#/rum/<id>/dokument`. Omladdning och återgång från en anteckning bevarar rätt arbetsyta och rullningsläge. Nya lappar placeras på tavlan, och nya dokument öppnas i skrivläge med dokumenthyllan som arbetsyta att återvända till.

Uppdelningen bygger på de befintliga anteckningstyperna. Tidigare sparade placeringar för lappar behålls, och anteckningar behöver inte flyttas eller importeras manuellt. Arkivering fungerar för båda arbetsytorna.

Läsvyn är utgångspunkt för befintliga anteckningar, så dokumentets utseende syns direkt. **Redigera** öppnar skrivläget på samma sida. Ändringar sparas när användaren skriver och när hen byter sida. Att bara läsa ändrar inte anteckningens ändringsdatum.

Dokumentets färg bevaras i lappens registerrad på skrivbordet. Dokumentets läsark är vitt, precis som i Fornsvenska. I smala fönster visas dokumentträdet som en öppningsbar panel för att behålla en användbar textbredd.

## Avgränsning

Den befintliga lagringsnyckeln och biblioteksformatet behålls. Tidigare anteckningar behöver därför inte importeras på nytt. Fornsvenskas avancerade grammatikblock, fotnotssystem och parallelltexter är inte kopierade; förändringen gäller appens gemensamma formspråk och navigation.
