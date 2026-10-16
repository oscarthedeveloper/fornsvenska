# Etapp 1 — Inventering, fältmappning och provurval

Datum: 2026-10-16  
Status: Genomförd och verifierad mot nedladdade originalfiler.

---

## 1. Kör- och driftmiljö

- **Ramverk:** Next.js 14.2.5 (App Router), React 18.3.1, TypeScript 5.5.4, Tailwind CSS 3.4.7.
- **Datalager i projektet:** Projektet tillämpar en dubbel läsmodell (`lib/archive.ts`, `lib/resurser.ts`): i normalt driftläge (samt på Netlify utan tvingad databaskoppling) läses kanoniska filer på servern, medan Supabase kan aktiveras via `NEXT_PUBLIC_DATA_SOURCE=supabase`. I den aktuella arbetsmiljön saknas `.env.local`, vilket innebär att den lokala körningen och bygget (`npm run build`) måste fungera 100 % fristående på servern utan extern databasanslutning, samtidigt som ett idempotent SQL-schema (`supabase/ordbok.sql`) tillhandahålls för eventuell databasdrift.
- **Källvalidering:** `npm run validate:kallor` verifierar att varje fil i `Källor/` är registrerad exakt en gång i `data/kallor.ts`. Båda XML-filerna har placerats i `Källor/` och registrerats under `SOD1884` (huvudverket) och `SOD-SUPP` (supplementet).

---

## 2. Verifiering av nedladdade XML-filer

| Datamängd | Käll-ID | Fil | Storlek (byte) | SHA-256 | Angivet antal | Faktiskt antal `<LexicalEntry>` |
| --- | --- | --- | --- | --- | --- | --- |
| Huvudverket | `SOD1884` | `Källor/soederwall.xml` | 24 570 251 | `9eddf1d7f94dc34aa4a2b0620734dee7fe164a879df195ee96a2f6098f7ce1f4` | 22 572 | **22 572** |
| Supplementet | `SOD-SUPP` | `Källor/soederwall-supp.xml` | 16 188 687 | `58cb1e3e6370cff44a7aecd09c5bc89536d8f422ec92d8a2c5ac5055d843717f` | 19 172 | **19 172** |
| **Totalt** | | | **40 758 938** | | **41 744** | **41 744** |

---

## 3. Faktisk XML-struktur och fältmappning

Båda filerna följer Språkbankens LMF-dialekt (`<LexicalResource dtdVersion="16">` -> `<Lexicon>` -> `<LexicalEntry>`).

### 3.1 Element och attribut i `<LexicalEntry>`

1. **`<Lemma>`** (exakt 1 per post i båda filerna)
   - `<feat att="oldlemma" val="..." />` (valfri: 609 i huvudverket, 8 403 i supplementet). Markerar med asterisk (`*`) i supplementet att uppslagsordet är nytillkommet i supplementet.
   - **`<FormRepresentation>`** (exakt 1 per `<Lemma>`):
     - `<feat att="writtenForm" val="..." />`: Uppslagsordet. Finns på **samtliga** 41 744 poster. OBS: vissa uppslagsord har inledande eller avslutande mellanslag eller konjunktion, t.ex. `"ädhel och "`, `"þriska och "`, `"athänkilse  aa"`. Vi bevarar exakt sträng i `headwordOriginal` samt trimmad visningsform.
     - `<feat att="lemgram" val="..." />`: Källans unika lemgram-ID (t.ex. `fsvm--a..nn.1`). Finns på **samtliga** 41 744 poster och är **100 % unikt inom respektive XML-fil** (0 saknade, 0 dubletter inom samma fil). Däremot kan samma `lemgram`-sträng förekomma i både huvudverk och supplement (t.ex. `fsvm--a..nn.1`), varför postens globala ID måste kombinera datamängd och lemgram.
     - `<feat att="partOfSpeech" val="..." />`: 0, 1 eller 2 förekomster per post (20 015 i huvudverket, 17 003 i supplementet). Värden: `nn`, `vb`, `av`, `ab`, `pp`, `pn`, `kn`, `nl`, `in`, `al`. Saknas ofta på rena hänvisningsposter (där lemgrammet har `.e.`).
     - `<feat att="gram" val="..." />`: Källans tryckta grammatiketikett (t.ex. `"prep. adv."`, `"v."`, `"adj."`). Finns på 8 362 poster i huvudverket och 6 531 i supplementet.
     - `<feat att="information" val="..." />`: Utökad ordklass-/grammatiktext på 1 066 poster i huvudverket och 1 154 i supplementet (t.ex. `"prep. och adv. "`).
     - `<feat att="oldForm" val="..." />`: Förekommer 3 gånger i huvudverket (t.ex. `värdh(e)liker` på uppslagsordet `värdheliker`).

2. **`<WordForm>`** (0 eller 1 block per post: 12 009 i huvudverket, 10 965 i supplementet; innehåller totalt 48 108 resp. 29 897 `<feat>`-rader)
   - Representerar parentesblocket direkt efter uppslagsordet i den tryckta ordboken: böjningsändelser (`-ir`, `-ar`, `-onna`), stavningsvarianter (`aboot`, `abbet`, `aa-`), beläggsställen i formhuvudet (`aa Su 283 . `) samt sammansättningshänvisningar (`aþalkonu barn`).
   - **Viktig källobservation 1:** `<WordForm>` är **inte** en ren lista av rena stavningsvarianter! Många `<feat att="writtenForm" val="..." />` innehåller källförkortningar, sidnummer, parenteser eller ändelser med bindestreck (t.ex. `"abadysa GU C 20 s. 1) . f. abbedissa. "`, `"-an VKR 3 o. s. v.; Bir 4: 9"`).
   - **Viktig källobservation 2 (trasiga attribut i käll-XML):** I huvudverket (och enstaka fall i supplementet) finns MSD-taggar som `att="V0IPA**"`, `att="AF0USNI"`, och på ~14 rader finns enkelcitat inuti attributnamnet p.g.a. ett konverteringsfel hos Språkbanken, t.ex. `<feat att="V0IPA**' orth='delir" val="-ir . " />`.
   - **Konsekvens för import och sökning:**
     - För **artikelvisning** bevarar vi samtliga `<WordForm>`-rader i exakt ordning med deras grammatik- och `orth`-information så att ingenting i artikelhuvudet går förlorat.
     - För **variantsökning (`variantsOriginal` / söknycklar)** extraherar vi endast rena ordformer (samt `orth='...'`-attributets faktiska ordform som `delir`, `delar`, `skippith`) och filtrerar bort rena böjningsändelser som börjar med `-` samt bibliografiska referenser.

3. **`<Sense id="...">`** (0 till M per post: 34 407 i huvudverket, 21 802 i supplementet)
   - Kan innehålla:
     - Direkt `<feat att="text" val="..." />` (ofta betydelsenumrering som `"1) "`, `"2) "`, men i 38 fall i huvudverket och 98 fall i supplementet ligger **hela betydelsetexten** direkt på `<Sense><feat att="text" .../></Sense>` utan inre `<Definition>`!).
     - `<feat att="gram" val="..." />` (135 i huvudverket, 34 i supplementet).
     - `<feat att="writtenForm" val="..." />` (199 i huvudverket, 116 i supplementet).
     - **`<Definition>`**: Innehåller 1 eller flera `<feat att="text" val="..." />` (i 878 fall i huvudverket och 558 i supplementet finns **flera** `<feat att="text">` efter varandra i samma `<Definition>`, vilka måste konkateneras i ordning utan förlust).
   - **Poster utan `<Sense>`:** 432 poster i huvudverket och 593 i supplementet saknar helt `<Sense>`. Dessa har sitt innehåll i `<WordForm>` (antingen sammansättningshänvisningar som under `aþalkona` -> `aþalkonu barn`, eller kortare artiklar där parsern vid Språkbankens inkodning lagt definitionen i `<WordForm>`, t.ex. `soederwall-supp` `fsvm--abbadissa..e.1`). Ingen sådan post får tappas bort.

4. **Tryckta sidnummer och faksimillänkar:**
   - XML-filerna innehåller **inga sidnummer eller spaltnummer** till Söderwalls tryckta ordbok (endast citatens egna textförkortningar som `Bu 5`, `MB 2:179`, `SD NS 1:56`).
   - Enligt planens avsnitt 3.3 och Etapp 5 ska sidexakta länkar inte gissas. Vi länkar därför ärligt till verkets digitala källsida hos Språkbanken (med DOI) och till rätt band i Projekt Runeberg (`svmtsprk/1` A–L, `svmtsprk/2` M–T, `svmtsprk/3` Þ–Ö, `svmtsprk/4` Supplement) med tydlig uppgift om att bandlänken går till utgåvans bandöversikt.

---

## 4. Viktiga strukturella avvikelser i Språkbankens källfiler

Vid inventeringen upptäcktes tre väsentliga egenskaper i Språkbankens LMF-filer som måste dokumenteras och hanteras:

1. **Kapitlet `Ä` i Huvudverket ligger i `soederwall-supp.xml`:**
   - `soederwall.xml` (Huvudverket) har 0 uppslagsord på `ä` (efter `y` följer direkt `ö` och `þ/th`).
   - I `soederwall-supp.xml` finns däremot **två** fullständiga alfabetiska sviter under bokstaven `Ä`:
     - Index `17988–18319` (332 poster, `ä` till `äväruldsliker`): Saknar genomgående `<feat att="oldlemma" val="fsvm--*..." />` och har äldre stavning i definitionerna (`af`, `hvad`, `äfven`). Detta är **Huvudverkets Ä-kapitel** som hos Språkbanken råkat hamna i `soederwall-supp.xml` före supplementets eget Ä-kapitel!
     - Index `18320–18604` (285 poster, `ä` till `äxlan`): Innehåller supplementets Ä-artiklar (med `oldlemma`-markeringar för nya ord och 1900-talsstavning i definitionerna).
   - **Beslut:** Enligt principen att aldrig förvanska källans proveniens behåller vi posternas `sourceDataset` (`soederwall-supp`) exakt enligt källfilen, men dokumenterar och märker ut detta tydligt i gränssnittet och källinformationen så att användaren förstår varför både huvudverkets och supplementets `ä`-artiklar bär källfilsetiketten från supplementfilen (och vi kan även visa en förklarande notis på posterna `17988–18319`).

2. **Kapitlet `V` i Supplementet saknas i Språkbankens XML-fil:**
   - `soederwall.xml` har 1 387 poster på `V`. `soederwall-supp.xml` går direkt från `U` (`uxe`, index 17916) till `Y` (`yfre`, index 17917) och har 0 poster på `V`. Detta är en känd lucka i Språkbankens digitala LMF-utgåva av supplementet och redovisas öppet i ordbokens käll- och kvalitetsvy.

3. **Alfabetisk ordning och bokstaven `Þ (TH)`:**
   - I Söderwalls ordbok bildar `Þ` (inklusive ord stavade med `th-`, vilka är samsorterade med `þ-`) en egen bokstavssektion **allra sist i alfabetet, efter `Ö`** (`A B C D E F G H I J K L M N O P Q R S T U V Y Ä Ö Þ`).
   - Inom varje bokstavssektion är källans ordning den autentiska lexikografiska ordningen (där `þ` och `dh`/`th` inuti ord behandlas som likvärdiga).

---

## 5. Dokumenterat provurval (43 verkliga källposter)

Nedanstående 43 poster har valts ut som kontrollsvit för Etapp 2–6 (täcker homonymer, långa artiklar, korta hänvisningar, poster utan `<Sense>`, trasiga `orth=`-attribut, specialtecken `þ/ä/ö/q` samt överlapp mellan huvudverk och supplement):

| # | Datamängd | Index | Käll-ID (`lemgram`) | Uppslagsord | Ordklass / Gram | Antal `<WordForm>`-rader | Antal `<Sense>` | Kategori / Kontrollsyfte |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `soederwall` | 0 | `fsvm--a..nn.1` | `a` | `nn` | 3 | 1 | Homonym 1 av `a` (substantiv: å) |
| 2 | `soederwall` | 1 | `fsvm--a..e.2` | `a` | — | 0 | 1 | Homonym 2 av `a` (hänvisning till `ägha`) |
| 3 | `soederwall` | 2 | `fsvm--a..e.3` | `a` | — | 0 | 1 | Homonym 3 av `a` (hänvisning till `ä`) |
| 4 | `soederwall` | 3 | `fsvm--a..e.4` | `a` | `pp, ab` (`prep. adv.`) | 2 | 25 | Lång artikel (17,4 kB), Sense utan Definition i mom. 2 |
| 5 | `soederwall-supp` | 0 | `fsvm--a..nn.2` | `a` | `nn` (`oldlemma: *a`) | 0 | 1 | Supplement-homonym (`(bokstafven) a`) |
| 6 | `soederwall-supp` | 1 | `fsvm--a..nn.1` | `a` | `nn` | 0 | 1 | Supplement-tillägg till `a` (å, mindre älf) — delar lemgram med #1! |
| 7 | `soederwall-supp` | 2 | `fsvm--a..e.2` | `a` | `pp, ab` (`prep. adv.`) | 0 | 1 | Supplement-tillägg till prep./adv. `a` |
| 8 | `soederwall` | 8 | `fsvm--abbadissa..nn.1` | `abbadissa` | `nn` | 7 | 1 | Rika böjnings-/variantformer i `<WordForm>` |
| 9 | `soederwall-supp` | 4 | `fsvm--abbadissa..e.1` | `abbadissa` | — | 3 | 0 | **Saknar `<Sense>`**; hela artikeltexten ligger i `<WordForm>` |
| 10 | `soederwall` | 39 | `fsvm--aþalkona..nn.1` | `aþalkona` | `nn` | 2 | 0 | **Saknar `<Sense>`**; sammansättningshänvisning + specialtecken `þ` |
| 11 | `soederwall-supp` | 28 | `fsvm--aþalkona..nn.1` | `aþalkona` | `nn` | 2 | 0 | Motsvarande post i supplementet (identiskt lemgram) |
| 12 | `soederwall` | 52 | `fsvm--adhla..e.1` | `adhla` | — | 0 | 1 | Kort hänvisningsartikel (`, se ädhla.`) |
| 13 | `soederwall` | 2854 | `fsvm--dela..vb.1` | `dela` | `vb` (`v.`) | 9 | 7 | **Trasigt XML-attribut** (`att="V0IPA**' orth='delir"`) |
| 14 | `soederwall` | 2855 | `fsvm--dela..nn.2` | `dela` | `nn` | 6 | 1 | Homonym till `dela` (substantiv: tvist) |
| 15 | `soederwall` | 6854 | `fsvm--hava..vb.1` | `hava` | `vb` (`v.`) | 52 | 23 | Mycket lång artikel (22 kB) + `orth='haver` / `orth='havþe` |
| 16 | `soederwall` | 6855 | `fsvm--hava..vb.2` | `hava` | `vb` (`v.`) | 2 | 1 | Homonym 2 av `hava` |
| 17 | `soederwall` | 6856 | `fsvm--hava..nn.3` | `hava` | `nn` | 13 | 1 | Homonym 3 av `hava` (substantiv: ägodel) |
| 18 | `soederwall` | 9432 | `fsvm--konunger..nn.1` | `konunger` | `nn` | 111 | 11 | 111 `<WordForm>`-rader (omfattande stavnings- och kasusformer) |
| 19 | `soederwall` | 9433 | `fsvm--konunger..nn.2` | `konunger` | `nn` | 1 | 1 | Homonym 2 av `konunger` |
| 20 | `soederwall` | 10034 | `fsvm--lagh..nn.1` | `lagh` | `nn` | 81 | 12 | Central rättsterm med 81 formrader och 12 betydelsemoment |
| 21 | `soederwall` | 14274 | `fsvm--qvaþa..nn.1` | `qvaþa` | `nn` | 2 | 1 | Bokstaven `Q` + inre `þ` |
| 22 | `soederwall` | 20585 | `fsvm--vara..vb.1` | `vara` | `vb` (`v.`) | 1 | 1 | Homonym 1 av `vara` |
| 23 | `soederwall` | 20586 | `fsvm--vara..vb.2` | `vara` | `vb` (`v.`) | 2 | 3 | Homonym 2 av `vara` |
| 24 | `soederwall` | 20587 | `fsvm--vara..vb.3` | `vara` | `vb` (`v.`) | 7 | 11 | Homonym 3 av `vara` |
| 25 | `soederwall` | 20588 | `fsvm--vara..vb.4` | `vara` | `vb` (`v.`) | 142 | 14 | Homonym 4 av `vara` (32,8 kB, 142 formrader — ”att vara”) |
| 26 | `soederwall` | 20589 | `fsvm--vara..vb.5` | `vara` | `vb` (`v.`) | 1 | 1 | Homonym 5 av `vara` |
| 27 | `soederwall` | 20590 | `fsvm--vara..nn.6` | `vara` | `nn` | 0 | 1 | Homonym 6 av `vara` (substantiv) |
| 28 | `soederwall` | 21622 | `fsvm--värdheliker..e.1` | `värdheliker` | `oldForm: värdh(e)liker` | 0 | 1 | Använder `<feat att="oldForm" />` |
| 29 | `soederwall` | 21849 | `fsvm--ögha..nn.1` | `ögha` | `nn` | 22 | 6 | Bokstaven `Ö` i huvudverket |
| 30 | `soederwall` | 22067 | `fsvm--þing..nn.1` | `þing` | `nn` | 26 | 10 | Bokstaven `Þ` (placerad efter `Ö`) |
| 31 | `soederwall` | 22164 | `fsvm--tholomodhogher..av.1` | `tholomodhogher` | `av` (`adj.`) | 1 | 1 | `th-` samsorterat i `Þ`-kapitlet |
| 32 | `soederwall-supp` | 8 | `fsvm--abo..nn.1` | `abo` | `nn` (`oldlemma: *abo`) | 1 | 1 | Nytt uppslagsord i supplementet + förkortad variant `aa-` |
| 33 | `soederwall-supp` | 9 | `fsvm--abodh..nn.1` | `abodh` | `nn` | 1 | 1 | Supplementpost med variant `aaboodh` |
| 34 | `soederwall-supp` | 10 | `fsvm--abodh..nn.2` | `abodh` | `nn` (`oldlemma: *abodh`) | 0 | 1 | Homonym i supplementet |
| 35 | `soederwall-supp` | 376 | `fsvm--anger..nn.1` | `anger` | `nn` | 1 | 2 | `<Sense>` med `<feat att="writtenForm">` + multipla `<feat att="text">` i `<Definition>` |
| 36 | `soederwall-supp` | 740 | `fsvm--balker..nn.1` | `balker` | `nn` | 4 | 2 | `<Sense>` utan `<Definition>` (text direkt på `<Sense>`) |
| 37 | `soederwall-supp` | 1001 | `fsvm--beridha..vb.1` | `beridha` | `vb` (`v.`) | 2 | 2 | `<Sense>` utan `<Definition>` |
| 38 | `soederwall-supp` | 17996 | `fsvm--ädhla..nn.1` | `ädhla` | `nn` | 1 | 1 | Ä-svit 1 i `soederwall-supp.xml` (huvudverkets Ä-kapitel) |
| 39 | `soederwall-supp` | 18020 | `fsvm--ägha..vb.1` | `ägha` | `vb` (`v.`) | 52 | 9 | Ä-svit 1 (`ägha` v. från huvudverket, 17,8 kB) |
| 40 | `soederwall-supp` | 18326 | `fsvm--ädhla..av.3` | `ädhla` | `av` (`adj.`) | 0 | 1 | Ä-svit 2 (supplementets eget tillägg till `ädhla`) |
| 41 | `soederwall-supp` | 18331 | `fsvm--äffen..ab.1` | `äffen` | `ab` (`oldlemma: *äffen`) | 1 | 1 | Ä-svit 2, nytt ord i supplementet |
| 42 | `soederwall-supp` | 18341 | `fsvm--ägha..e.3` | `ägha` | — | 2 | 4 | Ä-svit 2 (`ägha` v. i supplementet) |
| 43 | `soederwall-supp` | 18750 | `fsvm--þak..nn.1` | `þak` | `nn` | 3 | 3 | `Þ`-kapitlet i supplementet |

---

## 6. Kontroll mot Projekt Runebergs faksimil

Ett urval av poster har kontrollerats mot Projekt Runebergs digitala faksimil (<https://runeberg.org/svmtsprk/>):
- **Band 1 (A–L, `svmtsprk/1/`):** Uppslagsorden `a` (s. 1), `abbadissa` (s. 2), `aþalkona` (s. 5), `dela` (s. 183), `hava` (s. 474), `konunger` (s. 679), `lagh` (s. 722).
- **Band 2:1 (M–T, `svmtsprk/2/`):** Uppslagsordet `qvaþa` (s. 224).
- **Band 2:2 (Þ–Ö, `svmtsprk/3/`):** I den tryckta utgåvan ligger `U`, `V`, `Y`, `Ä`, `Ö` och därefter `Þ (TH)` sist i bandet (`þing`, `tholomodhogher`). Detta bekräftar att placeringen av `Þ (TH)` sist i XML-filerna återger Söderwalls lexikografiska system, samt bekräftar att band 2:2 i trycket innehåller `Ä` (s. 1094 ff.), vilket styrker att de första 332 `Ä`-posterna i `soederwall-supp.xml` är huvudverkets `Ä`-kapitel som vid Språkbankens filuppdelning hamnat i supplementfilen.
- **Supplementet (`svmtsprk/4/`):** Bekräftar supplementposterna under `A`, `B`, `Ä` och `Þ`. Eftersom XML-filerna inte lagrar tryckt sid- eller spaltnummer skapas inga påhittade sidlänkar på enskilda artiklar; i stället länkas till verifierad bandöversikt och Språkbankens resurs-DOI.
