# Statusrapport: Transkription av Äldre Västgötalagen

Senast uppdaterad: 2026-10-22  
Aktuell gren: `main`  
Arbetsstatus: **PROJEKTET FULLBORDAT: 100,0 % av Äldre Västgötalagen (Cod. Holm. B 59) transkriberad, tolkad, annoterad och i full drift! Samtliga 165 källpunkter och alla 17 balkar/avsnitt (B01–B16) är slutkontrollerade, godkända och publicerade.**  

---

## 1. Genomförda etapper

### T00 – Säkra arbetsläget (Godkänd 2026-10-22)
- Arbetsgren: `main`.
- Utgångsläge i Git och textmaskineri kartlagt och säkrat.
- Reproducerbarhetskontroll: `python3 scripts/build_textdokument.py` gav noll diff mot `data/textdokument.ts`.
- Filhashar och startprotokoll arkiverade.

### T01 – Frys och identifiera källan (Godkänd 2026-10-22)
- Källmanifest upprättat: [`docs/vastgotalagen/kallmanifest.json`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/kallmanifest.json).
- Käll-ID: `AVG-MASKIN`.
- SHA-256 verifierad: `b1065ce2871bf49afa9f3bb046f0a1d053632bd48bffb110f13204cdf48f4f5b` (25 sidor, 330 564 bytes).
- Publik kopia i `public/bocker/vastgotalagen/` är 100 % byte-identisk.

### T02 – Inventera hela källstrukturen (Godkänd 2026-10-22)
- Råtext per sida extraherad och sparad i: `docs/vastgotalagen/kalltext-ra/sida-01.txt` t.o.m. `sida-25.txt`.
- Sidkarta upprättad: [`docs/vastgotalagen/sidkarta.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/sidkarta.md).
- Fullständigt segmentregister genererat: [`docs/vastgotalagen/tackning.json`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/tackning.json) (165 källsegment över 17 sektioner).

### T03 – Kartlägg befintliga utdrag mot källan (Godkänd 2026-10-22)
- Avvikelserapport upprättad: [`docs/vastgotalagen/avvikelser.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/avvikelser.md).
- Detaljerad kartläggningsmatris sparad: `docs/vastgotalagen/avvikelselista.json`.
- Samtliga 32 befintliga meningar lokaliserade till källställen och kopplade i `tackning.json`.

### T04 – Fastställ återgivningsprinciperna (Godkänd 2026-10-22)
- Transkriptionsregler fastställda: [`docs/vastgotalagen/transkriptionsregler.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/transkriptionsregler.md).
- Återgivningsprinciper för frågetecken (`?` -> `[Þ]`), lakuner (`{...}`) och bevarande av befintliga URL:er låsta.

### T05 – Ordna datamodell och en enda redigeringskälla (Godkänd 2026-10-22)
- Datamodell i `lib/text.ts` utökad med fält för källspårbarhet (`segmentId`, `kallreferens`, `avvikelser`, `balkId`, `pdfSidor`, `kallpunkt`, `kallaId`).
- Modulär källkatalog etablerad: `data/texter-kallor/vastgotalagen/`.
- Generatorn `scripts/build_textdokument.py` dynamiserad för modulär sammanfogning och reproducerbar generering.
- Dokumentation upprättad: [`docs/vastgotalagen/genereringsflode.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/genereringsflode.md).

### T06 – Skapa validering för Texter (Godkänd 2026-10-22)
- Textvalidator implementerad i [`scripts/validate-texter.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/scripts/validate-texter.ts) (`npm run validate:texter`).
- Negativ testsvit upprättad i [`tests/validate-texter.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/validate-texter.test.mjs) (6/6 tester godkända).

### T07 – Kalibrera med en pilot (Godkänd 2026-10-22)
- Pilotbatch genomförd för Kirkiu Bolkær Punkt 1–4 i `kristnu-balker-i`.
- Protokoll: [`docs/vastgotalagen/batcher/batch-001-pilot.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-001-pilot.md).

### T08 – Granska och komplettera Kirkiu, PDF-sida 1 (Godkänd 2026-10-22)
- Hela PDF-sida 1 (Punkt 1–7) slutförd och i drift.
- Kronologisk ordning i `kristnu-balker-ii` helt återställd till källtrogen följd.
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-002-t08.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-002-t08.md).

### T09 – Fortsätt Kirkiu, PDF-sida 2 (Godkänd 2026-10-22)
- Hela PDF-sida 2 (Punkt 8–15) slutförd och publicerad i [`kristnu-balker-iii`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/kristnu-balker-iii.json).
- Säkrad sidövergång vid punkt 15 §3 (`pdfSidor: [2, 3]`).
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-003-t09.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-003-t09.md).

### T10 – Slutför Kirkiu på PDF-sida 3 (Godkänd 2026-10-22)
- Kirkiu Bolkær Punkt 16–22 slutförd och publicerad i [`kristnu-balker-iv`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/kristnu-balker-iv.json).
- **Balk 1 (Kirkiu Bolkær) är därmed 100 % slutförd (22 av 22 punkter). Milstolpe M3 slutförd!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-004-t10.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-004-t10.md).

### T11 – Af mandrapi, PDF-sidor 3–5 (Godkänd 2026-10-22)
- Hela Balk 2 (*Af mandrapi*, Punkt 1–15) transkriberad i strikt källordning och publicerad i två dokument:
  - [`mandraps-balker-i`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/mandraps-balker-i.json) (del I, Punkt 1–6): dråpslysning, banemannens ed, endag och två tylfter, sägnarting, arvebot och ättebot (parentelsystemet), ättleidde män, hällbane, träls dråp, svear och smålänningar samt dråp på färsk gärning.
  - [`mandraps-balker-ii`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/mandraps-balker-ii.json) (del II, Punkt 7–15): sinnessjuk baneman, tjuvs dråp på bar gärning, hemgång och nödvärn på hörnstock, lösvitingar, sängdråp vid lägersmål, vapenvållande, ölstugudråp och gästabudsfrid (bröllop, fästningsöl, gravöl), byamäns och häradets kollektiva ansvar vid dråp på allmänning samt strikt ägaransvar för vådadöd vid kvarnhjul, brunnar, jaktspjut och husdjursbett.
- Säkrad sidövergång s. 3 -> s. 4 i Punkt 1 §3 (`pdfSidor: [3, 4]`).
- Källfrågetecken `?ings mæn`, `?a` och `?ær` transkriberade till `[Þ]` med textkritiska anmärkningar.
- **Balk 2 (Af mandrapi) är därmed 100 % slutförd (15 av 15 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-005-t11.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-005-t11.md).

### T12 – Af særæ malum, PDF-sida 6 (Godkänd 2026-10-22)
- Hela Balk 3 (*Af særæ malum*, Punkt 1–6) transkriberad i strikt källordning och publicerad i [`sara-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/sara-balker.json):
  - Fulsårsrekvisit (spik, spjälkning, linne och läkararvode), tingslysning vid tre ting och okulärbesiktning.
  - Skroksak (falsk anklagelse) med edgång av tre nämndemän från fjärdingen.
  - Rättslig jämställdhet i såramål för inländska män (svear) samt danskar och norrmän.
  - Den graderade fingertoppstaxan för hand, tumme, pekfinger, långfinger, ringfinger och lillfinger samt lemlästning av näsa, ögon, hår, tänder/tal, kastration och tår.
  - Ettårsfristen (`iamlangæ`) för fastställande av bestående lyte (`læst`).
  - Särregler för utländska köpmän (sydmän/tyskar och engelsmän), frigivna och trälar.
- Källans frågetecken `?ræl` återgivet som `[Þ]ræl` med textkritisk anmärkning i fältet `avvikelser`.
- **Balk 3 (Af særæ malum) är därmed 100 % slutförd (6 av 6 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-006-t12.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-006-t12.md).

### T13 – Af vaþæ sarum, PDF-sidor 6–7 (Godkänd 2026-10-22)
- Hela Balk 4 (*Af vaþæ sarum*, Punkt 1–5) transkriberad i strikt källordning och publicerad i [`vada-sara-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/vada-sara-balker.json):
  - Rekvisitet för våda ("Værþær eigh uaþæ sar. num baþir uili" – kräver båda parters enighet).
  - Genomstingning, huvudsår med synlig hjärnhinna, hugg i skenben och genom muskler.
  - Fullständig rättslig likställdhet mellan unga och gamla samt kvinnor och män.
  - Straffrättslig ansvarslindring för barn (presumeras alltid vara våda).
  - Träls vådasår med tidsgraderad sjukersättning till bonden per 8-dagarsperiod, läkarlön och menprövning efter arbetsförmåga.
  - Ättboren mans vådaskråma och reciprok jämned med sättargärd.
  - Strikt ägaransvar för hundbett och fänadsskador.
- **Balk 4 (Af vaþæ sarum) är därmed 100 % slutförd (5 av 5 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-007-t13.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-007-t13.md).

### T14 – Bardaghæ, PDF-sidor 7–8 (Godkänd 2026-10-22)
- Hela Balk 5 (*Bardaghæ*, Punkt 1–9) transkriberad i strikt källordning och publicerad i [`bardagha-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/bardagha-balker.json):
  - Misshandel, personfridsbrott, tingslysning på gärningsmannens gård och sjunätting på sjunde dagen.
  - Tingsgång och fällande vittnesmål av två tolfter samt arvingarnas inställelse med två tolfter.
  - Fjärdingsnämnd mot falsk anklagelse och bötesprocedur med fredlöshetsdom vid försummad bot.
  - Bötestaxa för utlänningar (engelsmän och tyskar), frigivna och trälar.
  - Omyndigas inbördes slagsmål och övergrepp av myndig man.
  - Kvinnofrid i äktenskapet vid hustrumisshandel vid ölbänk och i kyrka med 3 marker i särskild bot.
  - Svarteslag (bagatellslag utan blånad eller blodvite).
  - Värjemålsed med 24 nämndemän mot vrång dråpsanklagelse.
  - Boskifte vid ogäldad fred med skydd för hustruns tredjedel och morgongåva.
  - Dödstraff för giftmord och förgöring med 24 timmars lejd till skogs.
  - Preskriptionsfristen natt och år för sårfeber (*innan nath ok iamlangæ*).
- **Balk 5 (Bardaghæ) är därmed 100 % slutförd (9 av 9 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-008-t14.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-008-t14.md).

### T15 – Orbotæ mal, PDF-sida 8 (Godkänd 2026-10-22)
- Hela Balk 6 (*Orbotæ mal*, Inledningen t.o.m. § 10) transkriberad i strikt källordning och publicerad i [`orbota-mal`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/orbota-mal.json):
  - Nidingsverk och orbötesmål som ej kunde försonas med böter.
  - Påföljden total fredlöshet och förverkande av fast egendom, landsvist och lösöre (*firigiort landi ok lössum öræ*).
  - Platsfridsbrott i kyrka och på ting, brott mot svuren lejd och förlikning samt hämnd för rättmätigt avstraffad tjuv.
  - Överfall på sovande, binda någon vid träd i skogen, samt landsförräderi ("att bära sköld över tångbräckan" mot eget landskap).
  - Lönnmord på värnlösa under bad (*löghu*), bastu eller toalettbesök (*nöte þarwa*), samt skott genom takglugg (*lyuræ*).
  - Grov lemlästning (ögonutstickning, avskuren tunga, avhuggna händer eller fötter).
  - Kvinnofridens absoluta okränkbarhet ("hun .a. e friþ til mot ok til mæssu aldrigh æru sva mykil uigh i mællum mannæ").
  - Förrädiskt herremord (*lönær droten sin*).
  - Bordsgemenskapsbrott och knivöverfall vid ölbänk (*sitir vm knif ok kötsticki*).
  - Lönnlig boskapsslakt (*goruarghær*).
  - Sjöröveri och plundring ombord på ledungsskepp (*harskip... gyærs bunkabitær... standær a halsi ok a höfþi*).
- Källans frågetecken `?æt` i § 4 återgivet som `[Þ]æt` med textkritisk notis i `avvikelser`.
- **Balk 6 (Orbotæ mal) är därmed 100 % slutförd (1 av 1 källpunkt, 10 paragrafer).**
- **Milstolpe M4 (B02–B06) är därmed 100 % SLUTFÖRD!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-009-t15.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-009-t15.md).

### T16 – Ærfþær bolkær, PDF-sidor 8–11 (Godkänd 2026-10-22)
- Hela Balk 7 (*Ærfþær bolkær*, Punkt 1–25) transkriberad i strikt källordning och publicerad i två dokument:
  - [`arfda-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/arfda-balker.json) (del I, Punkt 1–12):
    - Den äldre URL:en `/texter/lagar/aldre-vastgotalagen/arfda-balker` bevarad och kompletterad med källtrogen fulltext och rättelser av 10 äldre fragmentariska utdrag (AVV-019–AVV-027).
    - Arvsföljden enligt det strikta parentelsystemet och klyvningsprincipen mellan fäderne och möderne.
    - Dotters arvsrätt vid sons frånfälle och delning mellan moder och kullar.
    - Tjugoveckorsfristen för havande änka, arvsfredning vid barnets dop (*far cristændom*), fosterfaders förmyndarskap och släktingarnas kontroll av kistans nycklar och gäld.
    - Tre på varandra följande äktenskap och boskifte mellan tre kullar med avräkning för möderne, hemföljd och morgongåva.
    - Arvsrätt för omgift kvinna och halvsyskon, mundgift dotter med giftomans samtycke.
    - Faderskapspresumtion (*"þæn skal barn æghæ ær huærriæ nat liggær hoss"*), horbarns och frillobarns rättsliga ställning.
    - Klostergåva, novisfrist och civil död efter natt och år (*ena nat ok iamlangæ*).
    - Förbud mot dödsdagsgåvor utan arvingens samtycke och spänningen mot kanonisk rätt (*"sva sigiæ lærþir mæn at eig ma ne uid kvæþæ mæþ gusz ræt"*).
    - Dråparens ovillkorliga förlust av arvsrätt.
    - Den berömda bestämmelsen om Romresan (ett års förvaltaransvar för bryte) och Greklandsfararen (arvsförlust för väringar i Bysans medan hustru och barn hemma skyddas).
  - [`arfda-balker-ii`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/arfda-balker-ii.json) (del II, Punkt 13–25):
    - Samtidig död (kommorientskap) vid sjukdom (husels mottagande), byamäns död under samma dygn, innebränning, skeppsbrott eller skogsfärd.
    - Utländska köpmäns (engelsmän och tyskar) arvsrätt, ettårsfrist samt danaarvets tillfallande till konung och biskop.
    - Styvmors förgöring av styvbarn för arvs skull och livstids fredlöshet.
    - Makars egendomsgemenskap, rätt till avkastning (*avaxt*) och hästföl i skogen.
    - Förvaltarens (brytens) redovisningsskyldighet och skydd mot tjuvsanklagelse för handsöl.
    - Änkans tredjedelsrätt och tre marker ur mannens lott vid bondens död, samt gemensamt gäldsansvar.
    - Likställd arvsrätt mellan handelsresande och hemmavarande bröder ("far annær broþer köpfærþum ok annar hemæ i asku sitær").
    - Ansvarsfrihet vid stöld av deponerat gods (*inlaght fæ*).
    - Kollationsplikt (återbäring av förskott på arv) för hemföljd mellan gifta och ogifta syskon.
    - Inlösen av skuldsatt man eller fånge ur annans hand (*or annörghom stad lösæ*).
    - Ättledning vid tinget av vidgånget frillobarn med subsidiär arvsrätt.
    - Landbos död före fardag, grödoersättning och besittningsskydd, samt arvsavräkning vid frigiven mans död.
- **Balk 7 (Ærfþær bolkær) är därmed 100 % slutförd (25 av 25 punkter).**
- **Över hälften av Äldre Västgötalagens källpunkter är nu slutgranskade och publicerade!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-010-t16.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-010-t16.md).

### T17 – Giptar bolker, PDF-sidor 11–13 (Godkänd 2026-10-22)
- Hela Balk 8 (*Giptar bolker*, Punkt 1–9) transkriberad i källordning och publicerad i ett samlat dokument:
  - [`giptar-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/giptar-balker.json) (Punkt 1–9, 16 segment).
- Särskilda rättsinstitut och sakrättsliga frågor:
  - Kungligt frieri utom riket och pantställelse (tolv marker guld eller två byar).
  - Bondesons frieri hos giftoman, fästningsstämma, utfästelse av hemgift och jord, vingåva samt sängledningens (*en bulstær ok vndir ena bleo*) konstitutiva verkan.
  - Kyrkligt bötesansvar till biskopen (tre marker) vid fästerån (*fæstæ ruf*).
  - Kvinnofridsbrott och brudrov med fyrdubbla böter (36 marker) och fullständig fredlöshet.
  - Frigiven mans giftermål med ättburen kvinna eller fostra, samt trälars samlevnad utan friköpsavgift för avkomman.
  - Anklagelse om lägersmål med huskvinna samt hustrus horanklagelse med nämndened (sju män ur nämnden) eller utdrivning i bara vardagskläder.
  - Änkas rättsliga särställning (*fingin fæst ænkia*) och mökränkning före bröllopsöl.
  - Rättsliga taxor för lägersmål med fri fostra, trälinna (*ambut*) med försörjningsplikt till återvunnen arbetsförmåga (dra handkvarn och mjölka ko), samt löskvinna (*löpukona*).
  - Släktskapshinder (*frænsim* / *impedimentum consanguinitatis*) med 24 edsmän och biskopligt tillstånd, samt böter till hustrun vid ogrundad skilsmässoansökan från bonden.
  - Blodskam, incest och parenticid (far/son, syskon, barnamord, kusiner) såsom reserverade påvliga fall (*casus papales*) som fordrar botgöringsresa till påven i Rom med biskopligt rekommendationsbrev.
  - Mårtensmässans mungötstider, tre formella kallelser till bröllopsöl, samt laga förfall vid akut sjukdom, innebrända brudkläder eller hemgångsrån.
- Textkritik: `?er sum skriptæ.` (s. 12 rad 44) diplomatariskt återgivet som `[Þ]er sum skriptæ.` med textkritisk redovisning.
- **Balk 8 (Giptar bolker) är därmed 100 % slutförd (9 av 9 punkter). Milstolpe M5 är fullbordad!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-011-t17.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-011-t17.md).

### T18 – Rætlosæ bolkær, PDF-sidor 13–15 (Godkänd 2026-10-22)
- Hela Balk 9 (*Rætlosæ bolkær*, Punkt 1–13) transkriberad i källordning och publicerad i ett samlat dokument:
  - [`raetlosa-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/raetlosa-balker.json) (Punkt 1–13, 18 segment).
- Särskilda rättsinstitut och sakrättsliga frågor:
  - Konungavalet och rikets författning: svearnas valrätt och avsättningsrätt (*SVeær egho konong at taka ok sva vrækæ*), Eriksgatan med gisslanutväxling vid Junabäck, kungaeden inför Allra götars ting och lagmannens domsrätt, samt kungslejd åt tre män.
  - Biskopsvalet: krav på infödd bondeson (*bonþæ svn væræ*), överlämnande av stav och ring (*staf ok gullfingini*) samt full behörighet före vigning.
  - Lagmansval och tingsnämnd: böndernas val av lagman bland sina egna, lagmannens konstitutiva betydelse för Allra götars ting, samt officiella rättshandlingar (ättledning och förlikning).
  - Fridsbrott: tredubbla niomarksböter för olovligt bosran (*at vsældu*) och husrån (*at vsoktu*).
  - Ärekränkning och nid: lagstadgad taxa för okvädingsord och nid mot fri man (hyndvalp, feghetsanklagelse i strid), grovt nid (passiv sodomi, tidelag, incest med modern) samt okvädingsord mot kvinna (häxridt på fägårdsgrind i trollhamn vid dagjämning, förgöring, hortuta, fosterfördrivning, barnamord) med obligatorisk prövning hos sockenprästen innan tingssak väcks.
  - Handrån och utmätning: tolvmannaed vid handrån samt grannkallelse och lagbunden panttagning (*nam*) vid skuldkrävande.
  - Skadegörelse på boskap: fäfälling (*feær fölengh*) med sjunätting, synvittnen och ersättning, samt kollektivt byaansvar vid kreatursdråp på annans mark.
  - Djurskador och herdevittnesbörd: herdens fulla vittnesgillhet oavsett fri eller ofri börd, fast skadeståndstaxa vid fall i brunn/dike samt stympningsböter för hästar.
  - Obligations- och sakrätt: låneregeln (*All lan skulu hel hem flyties*), husbondens begränsade ansvar för rymd träl, vårdplikt (culpa) och bevislämningar (*aflæstir*) vid legodjur, samt depositionsregler (*inlaght fæ*) vid stöld och rån.
- Textkritik: `?ættæ aru vkvæþins orþ` (s. 14 rad 7) och `?æn sum leghir` (s. 15 rad 8) diplomatariskt återgivna som `[Þ]ættæ aru vkvæþins orþ` och `[Þ]æn sum leghir` med textkritiska redovisningar i `avvikelser`.
- **Balk 9 (Rætlosæ bolkær) är därmed 100 % slutförd (13 av 13 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-012-t18.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-012-t18.md).

### T19 – Iordþær bolkær, PDF-sidor 15–18 (Godkänd 2026-10-22)
- Hela Balk 10 (*Iordþær bolkær*, Punkt 1–20) transkriberad i källordning och publicerad i två dokument:
  - [`iordhar-balker-i`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/iordhar-balker-i.json) (del I, Punkt 1–10, 13 segment): jordens fem fång (arv, hemgåva, hemföljd, köp, skötning), köpeavtal med odalsfastar (*oþolfæstir*) och styresfast, rituell umfärd (*vmfærþ*), sjunätting och klander, hembud och bördsrätt (*börþ*) vid månadstämma på tinget, förbud mot väggaköp (*væggiær köp*) mellan makar, omyndigas köp, makars enskilda jord och tillökning (*agærþ*), bönders absoluta vittnesföreträde över ländmän och biskop, pantsättning av jord med tre vintrars inlösenfrist innan förpantning (*foruæþiæ*), bolsköp och utskifte, byns indelning i åttungar, gärdestvång vid Kristi himmelsfärdsdag (*hælghaþorsdagh*), samt tjäldrastenar och takdroppsrätt (*opsædrup*).
  - [`iordhar-balker-ii`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/iordhar-balker-ii.json) (del II, Punkt 11–20, 14 segment): husflyttning och tomtgille, byavägar (sju alnar breda), likväg till kyrka och gräsväg, utgärdande, förbud mot husbygge i åkergärde med rätt att riva huset utan brandskada, utmarksbygge (*holmsköp*) och fägata (sju famnar bred) till allmänningen, intaga på samfälld mark med enhällighetskrav bland åttungsägare och revmätning (*repæ iorþ*) vid odelsskifte, allmänningstvister mellan by och torp, fullbyar och hednabys (gravhögsbys) hävd, markskäl med synemän från härad och land, intaga och träde mot grannby, vattenmitt i vattendrag (*i miþri uatnras*), enskifte i by, skymfordet *ormyliæ* (ormyrja) för gränsstensrubbning, samt förbudsmärke med vidjekvist och bast vid slåttertvist.
- Textkritik: Tre frågetecken i källan diplomatariskt återgivna som `[Þ]`: `?riþiæ` (s. 15 rad 22), `?aghar` (s. 17 rad 27) och `?erra` (s. 17 rad 42) med textkritiska redovisningar i `avvikelser`.
- **Balk 10 (Iordþær bolkær) är därmed 100 % slutförd (20 av 20 punkter). Milstolpe M6 är fullbordad!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-013-t19.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-013-t19.md).

### T20 – Huru mylnu skal gæræ, PDF-sida 18 (Godkänd 2026-10-22)
- Hela Balk 11 (*Huru mylnu skal gæræ*, Inledning–§ 8) transkriberad i källordning och publicerad i ett samlat dokument:
  - [`mylnu-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/mylnu-balker.json) (3 segment).
- Särskilda rättsinstitut och sakrättsliga frågor:
  - Grannelagsrätt och översvämningsskydd: förbud mot dämning som skadar (*spillis*) tomt, åker, äng, vägar, forta (byallmänning), äldre kvarnar eller fiskeverk; ensamrätt till fiske i kvarndamm.
  - Ödekvarnar och preskription: treårig förfallotid (*þrea uettær*); bevarande av timmerverk (stigbord, stolpar, trösklar, ränna/hjulhus) bryter preskriptionen med två tolfter.
  - Kungsådran i fornnordisk rätt: tidigaste kodifieringen i svensk rätt av principen att en tredjedel av strömfåran i allmänt vatten skall lämnas öppen (*þridiungær löss faræ af vattni*).
  - Landfäste och tillfart: krav på laga köp av landfäste på motstående strand med fastar och umfärd; rätt till väg framför kvarndörr vid intaga på allmänning.
  - Förbud mot omdirigering av naturliga vattenflöden (*fornu fari*) samt förbud mot mutor vid jordförvärv.
- **Balk 11 (Huru mylnu skal gæræ) är därmed 100 % slutförd (1 av 1 punkt).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-014-t20.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-014-t20.md).

### T21 – Þiuuæ bollkær, PDF-sidor 18–22 (Godkänd 2026-10-22)
- Hela Balk 12 (*Þiuuæ bollkær*, Punkt 1–19) transkriberad i källordning och publicerad i två dokument:
  - [`thiuua-balker-i`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/thiuua-balker-i.json) (del I, Punkt 1–9, 19 segment): stöldanklagelse för häst och lösöre, delat ansvar för fader och myndig son samt bryte och träl, handfången tjuv med den klassiska domsformeln till galge, torv och tjära (*til hogs ok til hangæ, til draps ok til döþæ, til torfs ok til tiæru*), gripande på allmän väg och griparelön, tjuvars tre slag (tjuv, medhjälpare, hälare), tre vitulösor (bar gärning) och tre värjemålseder, spårföljning till by och fällande i käft, husrannsakning i invisteshus med avklädda och barfota rannsakningsmän (*iuirlösir, lösgiurþir, barföttir*), husfruns nyckelmakt över kistor och kvinnors omyndighet (*ovormaghi*), böter för vägrad rannsakning, stöld ur uthus, samt laga tak och kvargsäte på farväg (*brötær tak*).
  - [`thiuua-balker-ii`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/thiuua-balker-ii.json) (del II, Punkt 10–19, 15 segment): klander av lån och sjunattastämma, de tre laga taken (brötartak, kvargsätetak, skälatak), köp av utländsk man med stämma vid landamärket mot Svealand och Danmark (*hinvagh kiægglu ællær i danmark*) och reciprocitetsprincipen (*[Þ]y lik lagh ok ræt sum vtlænskir man göra os. þylikæn uilium uir þem göræ*), återköpt stöldgods, gods fråntaget tjuv och vinningslön (*vnningia laghum*), stöld av dräktigt sto och fölsvittne (*fyls uat*), bortförande och stöld av träl eller trälinna med treskiftad bot, den fornsvenska rättsformeln för trälfödsel i vagga vid moderns spene (*iak födde han hemæ i husum ok hæskap þer diþi ok drak miolk af moþor spina. þær uar i klæþum uafþær ok i uaggu lagþer*), trälar på flyktstig (*löpstighum*), köpvittnen (*vin ok vittni*) vid lösöreköp av hästar, nöt, kläder och vapen, samt öppet torgköp (*torghköpe rættu*).
- Textkritik: 13 frågetecken i källan diplomatariskt återgivna som `[Þ]` (`?ætta`, `?riþi`, `?rear`, `?riþiæ`, `?rer`, `?riþiæ`, `?er`, `?or`, `?ry`, `?y`, `?riþi`, `?a`, `?y`) och redovisade i `avvikelser`.
- **Balk 12 (Þiuuæ bollkær) är därmed 100 % slutförd (19 av 19 punkter). Milstolpe M7 är fullbordad!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-015-t21.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-015-t21.md).

### T22 – Första avsnittet märkt 13, PDF-sida 22 (Godkänd 2026-10-22)
- Hela Balk 13a (*Fornæmix sakir*, Punkt 1–6) transkriberad i källordning och publicerad under separat rutt:
  - [`fornaemis-sakir`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/fornaemis-sakir.json) (16 segment): olovligt brukande av dragare på utmark, fällning av ollonbärande ek och undervid, rätten att kräva färd till stubben (*til stums at faræ*), beslag och panträtt hos träl och legoman (*þæt ær fiærme ær*), nödrätt att laga hjulaxel och vagnstång (*axsul, andurstang*), tillgrepp och begagnande av åkdon, seldon, harv (*ekiu*), repband (*tagbændu*), sexmansbåt (*siværings bat*) och räfsor (*riuu*), körning över oslagen äng och sörgate (*sörgatæ*), stöld av gärdesgårdsvirke och otidigt nedrivande före skörd (*fyr æn burghit ær*), schablonersättning för kreatursskada med tak vid ett åkerlass (*akærlass*), förbud mot våldsamt fråntagande av åkarnam (*akar nam*), uppsåtligt tjudrande på annans åker, nattbete med hund och herde i fridgärde (*friþgærþi*), samt oavsiktlig tjuderslitning och inlösen med ened (*eneþe*).
- Textkritik: 2 frågetecken i källan diplomatariskt återgivna som `[Þ]` (`?atta`, `?æn`) och redovisade i `avvikelser`.
- **Balk 13a (Fornæmix sakir) är därmed 100 % slutförd (6 av 6 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-016-t22.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-016-t22.md).

### T23 – Andra avsnittet märkt 13, PDF-sidor 23–24 (Godkänd 2026-10-22)
- Hela Balk 13b (*Fornamix bolkær*, Punkt 1–11) transkriberad i källordning och publicerad under separat rutt:
  - [`fornamix-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/fornamix-balker.json) (19 segment): stängselsyn och utgärden vid Kristi himmelsfärdsdag (*hælgha þorsdagh*), häst- och svinbök i uppkommen säd med skäppebot in natura, grässätens (*græssæti*) förlust av betesrätt på utmark, förbud mot tjuderfä i byhägn med dispens för prästens sockenhäst (*at huslæ allær oliæ*), smittskyddsförbud mot införsel av nötkreatur från Falbygden (*falby*), skarp distinktion mellan culpös tillsynsförsummelse (*vangömslu*) och force majeure (*ofævli*, blixtnedslag *asikkiæ*, brand, rån, björn och farsoter), vildbifynd (*koppo fund*), den berömda allittererande fornsvenska jakträttsformeln (*[Þ]æn a hæræ ær hændir, þæn a ræf ær refer, þæn a vargh ær vinþær, þæn a biorn ær betir, þæn a ælgh ær fællir, þæn a otær ær or a taker*) samt skydd för jaktfalkar märkta med varplar (*værpplæ*), förbud mot ekbarkning, skadegörelsebränder på utomhus förvarad egendom (hö, kvarnar, broar, virke) såsom rättslöshet (*rætlösæ*), herdevittnesbörd vid rovdjursangrepp med avläster (*aflæstir*) samt rituell placering av herdestav och hatt/kappa/ris vid fä dött i dy, samt fardagar vid påsk och mickelsmäss, städjeavtalets fullbordan genom måltidsgemenskap (*ætæt nætorþ ok daghor*) och ömsesidigt avtalsbrottsansvar för legodräng och husbonde.
- Textkritik: 1 frågetecken i källan diplomatariskt återgivet som `[Þ]` (`?æn a hæræ`) och redovisat i `avvikelser`.
- **Balk 13b (Fornamix bolkær) är därmed 100 % slutförd (11 av 11 punkter).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-017-t23.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-017-t23.md).

### T24 – Lecara rætar, PDF-sida 24 (Godkänd 2026-10-22)
- Hela Balk 14 (*Lecara rætar*, s. 24) transkriberad i källordning och publicerad under separat rutt:
  - [`lecara-raetar`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/lecara-raetar.json) (1 segment: `avg-b14-punkt01-seg001`): lekarnas och spelemännens rättslösa ställning utan mansbot (*vgilt*), det skymfliga provet med den rakade och smorda kvigsvansen uppför backen (*flytiæ up a bæsing, alt har af roppo rakæ ok siþæn smyriæ, sko nysmurþæ, huassi gesl*), talesättet *niutæ sum hundær græss*, samt jämförelsen med den hudstrukna frillan (*huskonæ hudstrukin*).
- Textkritik: 1 frågetecken i källan diplomatariskt återgivet som `[Þ]` (`?attæ ær lecara rætar`).
- **Balk 14 (Lecara rætar) är därmed 100 % slutförd (1 av 1 punkt).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-018-t24-t26.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-018-t24-t26.md).

### T25 – Conongs bolkær, PDF-sida 24 (Godkänd 2026-10-22)
- Hela Balk 15 (*Conongs bolkær*, s. 24) transkriberad i källordning och publicerad under separat rutt:
  - [`conongs-balker`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/conongs-balker.json) (1 segment: `avg-b15-punkt01-seg001`): landamäret mellan Sverige och Danmark under Emund Slemme och Sven Tveskägg, de tolv gränsgörarna från sex svenska folkland/landskap och sex danska landskap, resandet av de sex gränsstenarna (Suntrv as, Danæbæc, Kinnæ sten, Uracsnæs, Hvitæ sten, Brimsæ sten mellan Blekinge och Möre), samt Danaholmens delning i tre lotter mellan Uppsala konung, dana konung och Norges konung där ceremonielet med betsel och stigbygel skildras.
- Textkritik: 3 frågetecken i källan diplomatariskt återgivna som `[Þ]` (`?ættæ`, `?ridþi`, `?ridþiæ`).
- **Balk 15 (Conongs bolkær) är därmed 100 % slutförd (1 av 1 punkt).**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-018-t24-t26.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-018-t24-t26.md).

### T26 – Horo þing lot skal skiptæ, PDF-sidor 24–25 (Godkänd 2026-10-22)
- Hela Balk 16 (*Horo þing lot skal skiptæ*, s. 24–25) transkriberad i källordning och publicerad under separat rutt:
  - [`horo-thing-lot`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/data/texter-kallor/vastgotalagen/horo-thing-lot.json) (1 segment: `avg-b16-punkt01-seg001`): fördelningen av bötes- och tingslotter vid allramannatinget mellan Västergötlands åtta bon (Vadsbo, Kinds, Valle/Kåkind, Gudhems, Vilske/Ås/Mark, Lungs, Åsbo, Hålsiö, Skalunda och Vartofta), tre bo mot fem bo, samt den berömda kyrkorättsliga klausulen om Skara domkyrka (*firi at þer sculu crakæ ok flacæ mariu kirkiu i skarum*).
- Textkritik: 1 frågetecken i källan diplomatariskt återgivet som `[Þ]` (`?riði`).
- **Balk 16 (Horo þing lot skal skiptæ) är därmed 100 % slutförd (1 av 1 punkt). Milstolpe M8 och hela Äldre Västgötalagens transkriptionsprojekt är därmed fullbordat till 100,0 %!**
- Batchprotokoll: [`docs/vastgotalagen/batcher/batch-018-t24-t26.md`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/docs/vastgotalagen/batcher/batch-018-t24-t26.md).

---

## 2. Segmentstatistik och täckning
- **Inventerade källsegment i AVG:** 165
- **Slutkontrollerade och tolkade källpunkter:** 165 av 165 (B01: 22, B02: 15, B03: 6, B04: 5, B05: 9, B06: 1, B07: 25, B08: 9, B09: 13, B10: 20, B11: 1, B12: 19, B13a: 6, B13b: 11, B14: 1, B15: 1, B16: 1)
- **Täckningsgrad av hela lagverket:** **100,0 % av källpunkterna (165 av 165)**
- **Registrerade `Mening`-segment i drift i AVG:** 272 segment
  - `kristnu-balker-i` (B01, Pkt 1–4, s. 1): 14 segment
  - `kristnu-balker-ii` (B01, Pkt 5–7, s. 1): 10 segment
  - `kristnu-balker-iii` (B01, Pkt 8–15, s. 2–3): 21 segment
  - `kristnu-balker-iv` (B01, Pkt 16–22, s. 3): 10 segment
  - `mandraps-balker-i` (B02, Pkt 1–6, s. 3–4): 13 segment
  - `mandraps-balker-ii` (B02, Pkt 7–15, s. 5): 11 segment
  - `sara-balker` (B03, Pkt 1–6, s. 6): 10 segment
  - `vada-sara-balker` (B04, Pkt 1–5, s. 6–7): 8 segment
  - `bardagha-balker` (B05, Pkt 1–9, s. 7–8): 11 segment
  - `orbota-mal` (B06, Inledn–§ 10, s. 8): 4 segment
  - `arfda-balker` (B07 del I, Pkt 1–12, s. 8–10): 14 segment
  - `arfda-balker-ii` (B07 del II, Pkt 13–25, s. 10–11): 10 segment
  - `giptar-balker` (B08, Pkt 1–9, s. 11–13): 16 segment
  - `raetlosa-balker` (B09, Pkt 1–13, s. 13–15): 18 segment
  - `iordhar-balker-i` (B10 del I, Pkt 1–10, s. 15–16): 13 segment
  - `iordhar-balker-ii` (B10 del II, Pkt 11–20, s. 16–18): 14 segment
  - `mylnu-balker` (B11, Inledn–§ 8, s. 18): 3 segment
  - `thiuua-balker-i` (B12 del I, Pkt 1–9, s. 18–20): 19 segment
  - `thiuua-balker-ii` (B12 del II, Pkt 10–19, s. 20–22): 15 segment
  - `fornaemis-sakir` (B13a, Pkt 1–6, s. 22): 16 segment
  - `fornamix-balker` (B13b, Pkt 1–11, s. 23–24): 19 segment
  - `lecara-raetar` (B14, s. 24): 1 segment
  - `conongs-balker` (B15, s. 24): 1 segment
  - `horo-thing-lot` (B16, s. 24–25): 1 segment
- **Kvarstående källpunkter i inventeringen:** 0 (Noll) – Hela handskriftstexten är fullbordad!

---

## 3. Milstolpar
- **M1 (T00–T04): Säkra källan och inventera:** SLUTFÖRD
- **M2 (T05–T07): Infrastruktur och pilot:** SLUTFÖRD
- **M3 (T08–T10): Kirkiu Bolkær (B01, s. 1–3):** SLUTFÖRD
- **M4 (T11–T15): Balkarna B02–B06 (s. 3–8):** SLUTFÖRD
- **M5 (T16–T17): Balkarna B07–B08 (Arv och giftermål, s. 8–13):** SLUTFÖRD
- **M6 (T18–T19): Balkarna B09–B10 (Rætlosæ bolkær och Iordþær bolkær, s. 13–18):** SLUTFÖRD
- **M7 (T20–T21): Balkarna B11–B12 (Kvarnar och stöld, s. 18–22):** SLUTFÖRD
- **M8 (T22–T26): De avslutande balkarna (B13a–B16, s. 22–25):** SLUTFÖRD

---

## 4. Kvalitetsstatus
- `npm run validate:texter`: Godkänd (0 fel, 35 dokument, 159 sektioner, 377 meningar, 285 registrerade segment-ID).
- `npm run validate:kallor`: Godkänd (0 fel, 39 verk, 54 källfiler, 193 grammatikartiklar).
- `npx tsx --test tests/validate-texter.test.mjs`: Godkänd (6/6 tester).
- `npx tsc --noEmit`: Godkänd (0 fel).
- `npm run build`: Godkänd (34/34 statiska rutter).

---

## 5. Slutbedömning och sammanfattning
Hela transkriptionsprojektet för Äldre Västgötalagen (Cod. Holm. B 59) enligt Delsings utgåva (SSGL I) är framgångsrikt fullbordat:
1. **100 % källtrohet**: Samtliga 165 källpunkter, 25 PDF-sidor och 17 balkar/avsnitt är representerade utan textluckor eller godtyckliga förkortningar.
2. **Diplomatarisk precision**: Inga anakronistiska normaliseringar; alla källavvikelser och frågetecken är systematiskt dokumenterade och redovisade under `avvikelser`.
3. **Akademisk tolkning**: Varje segment har försetts med en trogen svensk översättning och en kultur- och rättshistorisk kommentar med förklaring av fornsvenska facktermer.
4. **Reproducerbarhet och robusthet**: All källtext redigeras i enskilda JSON-filer per balk under `data/texter-kallor/vastgotalagen/` och sammanställs automatiskt via `scripts/build_textdokument.py`.
5. **Noll defekter**: Samtliga validatorer, enhetstester, typkontroller och statiska webbplatsbyggen passerar med 0 fel och 0 varningar.

