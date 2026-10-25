# Transkriptions- och återgivningsregler för Äldre Västgötalagen

Version: 1.0  
Datum: 2026-10-22  
Etapp: **T04 – Fastställ återgivningsprinciperna**  
Källunderlag: `Källor/Västgötalagen i maskintext.pdf` (AVG-MASKIN, Lars-Olof Delsing / Collin & Schlyter, SSGL I)

---

## 1. Grundläggande textfilosofi

1. **Källtrohet mot den digitala maskintexten:**
   Texten i fältet `fsv` ska vara en exakt, källtrogen återgivning av den lokala maskintexten. Vi gör ingen egen fri normalisering och ingen moderniserande stavningsreform. Bokstäverna `þ`, `ð`, `æ`, `ø`, `ö`, `u/v`, `i/j` och stavningsvarianterna `ok/oc` bevaras precis som de står i källfilen.
2. **Layoutrensning utan textförlust:**
   PDF-sidfötter (`Page 1`, `Page 2` etc.) och marginalnoter som hör till PDF-formatet rensas bort. Mjuka radbrytningar inom satser sammanfogas med ett enkelt blanksteg.
3. **Avstavningar och bindestreck:**
   Ett bindestreck vid radslut i PDF:en tas endast bort om det är en renodlad typografisk radavstavning av ett sammansatt eller enkelt ord (t.ex. `kirkiu- / dyr` → `kirkiu dyr`). Om bindestrecket återfinns i förlagans handskriftsåtergivning bevaras det.

---

## 2. Hantering av särskilda källtecken

### 2.1 Frågetecken (`?`) i källan
- **Bakgrund:** I källfilens textlager förekommer tecknet `?` 24 gånger i brödtext och 7 gånger i rubriker (t.ex. `# 3 ?ætta ær af særæ malum bolkar.`, `?ræl.`, `?æn`, `?ry`). Källanalysen visar entydigt att detta uppstått vid konvertering av versalt Thorn (`Þ` / `Th`).
- **Regel:**
  - I råtextfilerna (`kalltext-ra/`) bevaras `?` 100 % oförvanskat.
  - I den redigerade fornsvenska lästexten `fsv` återges tecknet inom klammer som **`[Þ]`** (t.ex. `[Þ]ætta`, `[Þ]ræl`, `[Þ]æn`).
  - Varje förekomst flaggas i segmentets metadata (`harFragetecken: true`) och redovisas i avvikelseloggen.
  - På så vis garanteras både filologisk stringens (användaren ser att källan har en teckenersättning) och korrekt sökbarhet/läsbarhet.

### 2.2 Källans lakuner och skador (`{...}`)
- **Bakgrund:** På PDF-sida 1 finns två fysiska lakuner i källan: `{oc arf...}` och `{...ræ æn}`, vilket avspeglar bladförlusten i handskriften Holm B 59.
- **Regel:**
  - Klamrarna och textfragmenten `{oc arf...}` och `{...ræ æn}` bevaras exakt i `fsv`.
  - Ingen text får gissas eller fyllas i ur minnet i `fsv`.
  - I tolkningen markeras lakunen med `[...]` och förklaras med en saklig fotnot: *"Textlucka i handskriften Cod. Holm. B 59 efter dopavsnittet."*

---

## 3. Segmentering och meningsindelning

1. **Strukturenhet:**
   - Varje numrerad punkt i källan (t.ex. `1.`, `2.`, `§. 1.`) utgör ett källsegment (`segment`).
   - Inom en källpunkt delas texten vid naturliga syntaktiska gränser till enskilda `Mening`-poster för visningsgränssnittet.
2. **Kriterier för meningsdelning:**
   - En `Mening` ska rymma en självständig rättslig regel, villkorssats eller definitionsled.
   - En villkorsbisats (`Varþær barn...`, `Hændir þæt...`) får inte skiljas från sin huvudsats/påföljd (`þa scal...`) om det gör regeln obegriplig.
   - Bötesbelopp och rättsverkan måste alltid hänga samman med handlingen de avser.

---

## 4. Tolkningsprinciper (Svenska)

1. **Mål:** Tolkningen ska vara begriplig, saklig modern svenska som förmedlar rättsregeln utan onödig arkaisering men med bevarande av textens juridiska precision.
2. **Historiska rättstermer:**
   - Termer som *gengärd*, *ledung*, *bryte*, *bocarlar*, *tinglott* behålls som facktermer och förklaras i ordlistan eller i en kort fotnot.
   - Påhittade moderna juridiska termer (t.ex. "vårdnadshavare" för *guðfaþir*) får inte användas.
3. **Trohet mot aktör och verkan:**
   - Tolkningen måste strikt följa källans aktörer (vem gör vad, vem betalar till vem).
   - Inga motiv eller moraliserande tillägg får tillföras.

---

## 5. Grammatiska och sakliga kommentarer

1. **Valfrihet och relevans:** Kommentarer är ett separat analyslager och läggs endast till där fornsvenskans formlära, syntax eller rättshistoriska kontext fordrar belysning.
2. **Spårbarhet och belägg:**
   - Varje grammatiskt påstående (t.ex. om kasus, oblika former eller böjning) ska vila på faktisk litteratur (t.ex. Wessén, Noreen, Schlyter).
   - Inga påhittade källhänvisningar eller allmänna svepande referenser får förekomma.

---

## 6. Förhållandet mellan befintliga utdrag och sammanhängande balkar

1. **Beständiga URL:er:**
   De tre etablerade adresserna under `/texter/lagar/aldre-vastgotalagen/` bevaras:
   - `/kristnu-balker-i`
   - `/kristnu-balker-ii`
   - `/arfda-balker`
2. **Systematisk källutgåva:**
   - Den fullständiga lagen byggs upp balk för balk (B01–B16) i strikt källordning.
   - De befintliga tre utdragen behålls som tematiska studieavsnitt med tydlig hänvisningslänk till den kompletta balken.
   - Varje segment i `tackning.json` har en primär plats i den fullständiga balken, samt eventuell referens till de pedagogiska utdragen via `dokumentkopplingar`.

---

## 7. Verifiering och tvåpasskontroll

Varje batch ska genomgå en obligatorisk tvåpasskontroll före godkännande:
1. **Pass 1 (Källtrohet):** Rad-för-rad-jämförelse mellan råtext/sidbild och `fsv`. Kontroll av specialtecken, skiljetecken och siffror.
2. **Pass 2 (Tolkning & Koherens):** Kontroll av att översättningen troget återger källans aktörer, negationer och belopp, samt att länkar och ID:n är giltiga.
