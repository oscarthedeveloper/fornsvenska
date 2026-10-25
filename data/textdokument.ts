import type { Textdokument } from "@/lib/text";

/**
 * Textinnehåll, nycklat på full sökväg under roten "texter".
 * Samtliga 14 dokument är fullständigt publicerade med autentisk
 * fornsvensk text, översättning, grammatisk analys och källhänvisningar.
 */
export const TEXTER_DOKUMENT: Record<string, Textdokument> = {
  "lagar/aldre-vastgotalagen/kristnu-balker-i": {
    "titel": "Kristnu balkær, del I",
    "underrubrik": "Äldre Västgötalagen, inledningen och dopet (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Balkens inledning fastslår den kristna trons och kyrkans primat i det västgötska lagsamhället. Texten är skriven på arkaisk äldre fornsvenska med fullt bevarat fyrkasussystem och strikt kongruens. Efter den högtidliga inledningen följer noggranna föreskrifter om hur ett nyfött barn skall föras till kyrkan och döpas, hur nöddop skall förrättas om barnet insjuknar på vägen, biskopens visitation och gengärd samt försoningsbot vid våldshandlingar i helgade rum.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 1 (Inledning och dopförberedelse)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Her byriarz laghbok væsgöta. Krister ær fyrst i laghum warum",
            "tolkning": "Här börjar västgötarnas lagbok. Kristus är främst i våra lagar.",
            "kommentar": "Her byriarz: reflexiv/mediopassiv presensform. Væsgöta: genitiv pluralis av folknamnet västgötar. laghum warum: dativ pluralis efter prepositionen i med lokativ funktion. Kongruerande possessivt pronomen warum. Subjektet Krister uppvisar fornsvensk nominativändelse -er.",
            "segmentId": "avg-b01-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "þa ær cristna var oc allir cristnir konongær",
            "tolkning": "Därnäst vår kristenhet och alla kristna konungar.",
            "kommentar": "cristna var: feminin nominativ singularis med efterställt possessivt pronomen. allir cristnir konongær: nominativ pluralis av starkt maskulint substantiv konongær (a-stam) med full kongruens i allir och starkt böjda cristnir.",
            "segmentId": "avg-b01-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "böndær oc allir bocarlær biscupær oc allir boclærðir mæn",
            "tolkning": "Bönder och alla bofasta män, biskopar och alla boklärda män.",
            "kommentar": "Nominativ pluralis: böndær (rotstam), bocarlær och biscupær (a-stammar på -ær), samt boclærðir mæn där participadjektivet kongruerar med oregelbundna rotstamssubstantivet mæn.",
            "segmentId": "avg-b01-punkt01-seg003",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "Varþær barn til kirkiu boret oc beþiz cristnu. þa scal faþir ok moðer fa guðfæþur oc guðmoþor oc salt oc uatn",
            "tolkning": "Varder barn buret till kyrka och bedes kristning, då skall fader och moder skaffa gudfader och gudmoder och salt och vatten.",
            "kommentar": "Konditionalt framställd huvudsats med inversion (varþær barn). Prepositionen til styr genitivformen kirkiu (svag ōn-stam). Passiv med varþær och perfekt particip boret (nom. sg. neutr.). Deponensen beþiz styr genitivobjektet cristnu. guðfæþur och guðmoþor: ackusativ singularis av fadderbeteckningarna; salt oc uatn: ackusativ singularis neutrum.",
            "segmentId": "avg-b01-punkt01-seg004",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "þæt scal bæræ til kirkiu þa scal a prést kallæ han skal a kirkiu bole boæ. barn scal brymsignæ firi utan kirkiu dyr",
            "tolkning": "Det skall bäras till kyrkan, då skall man kalla på präst; han skall bo på kyrkobolet. Barnet skall primsignas utanför kyrkodörren.",
            "kommentar": "bæræ: aktiv infinitiv med passivisk betydelse efter scal. a prést: ackusativ efter prepositionen a. a kirkiu bole: dativ singularis efter befintlighets-a. brymsignæ: kristet lånord (fornengelska primsignian). firi utan styr ackusativformen kirkiu dyr (ack. pl. neutr.).",
            "segmentId": "avg-b01-punkt01-seg005",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 1 (Dopritual, nöddop och lakun)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Siþen scal font wigyæ. prester barn döpæ. oc gudfaþir a haldæ. gudmoþer til namns sygiæ",
            "tolkning": "Sedan skall dopfunten vigas, prästen döpa barnet och gudfadern hålla i, och gudmodern säga namnet.",
            "kommentar": "Parallella infinitivsatser underställda hjälpverbet scal. til namns: genitiv efter prepositionen til.",
            "segmentId": "avg-b01-punkt01-seg006",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "prester scal byuþe husu lengi faþir oc moþer sculu vardvetæ",
            "tolkning": "Prästen skall påbjuda hur länge fader och moder skola vårda det.",
            "kommentar": "vardvetæ: sammansättning med urgermanskt varð ('vakt') och vita ('veta/iaktta'). sculu: presens pluralis, kongruerar med sammansatt subjekt.",
            "segmentId": "avg-b01-punkt01-seg007",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "Hændir þæt sot a vegh oc ma igh til kyrkiu coma. þa scal gudfaþir döpæ oc gudmoþer a haldæ. i vatn",
            "tolkning": "Händer det att sjukdom kommer på vägen och det icke kan komma till kyrkan, då skall gudfadern döpa och gudmodern hålla i vatten.",
            "kommentar": "sot: feminin nominativ singularis ('sjukdom'). Negationsadverbet igh är en västgötsk sidovariant till eigh. Nöddopets giltighet fastslås.",
            "segmentId": "avg-b01-punkt01-seg008",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"
          },
          {
            "fsv": "æn uatn ær til i namn faþurs oc suner oc andæs hælagha þa scal þét .j. kyrkiu gard gravæ {oc arf...}",
            "tolkning": "om vatten finns till hands, i faderns och sonens och den helige andes namn; dör det sedan skall det begravas på kyrkogården [och arv...]",
            "kommentar": "faþurs (stark genitiv på -s), suner (u-stamsgenitiv på -er), andæs hælagha (svag maskulin genitiv på -a med efterställt bestämt adjektiv). j kyrkiu gard: riktningsackusativ efter i. Slutorden {oc arf...} markerar handskriftens lakun vid bladförlusten i Holm B 59.",
            "segmentId": "avg-b01-punkt01-seg009",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1",
            "avvikelser": [
              "Källans lakun {oc arf...} bevarad exakt enligt transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 2 (Biskopens gengärd och gästning)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "{...ræ æn} gengyærd þerra brinder vp",
            "tolkning": "[...om] deras gengärd brinner upp.",
            "kommentar": "Inledande fragment {...ræ æn} härrör från källans lakun efter bladförlusten. gengyærd: den gästning och förplägnad som bönderna var skyldiga att tillhandahålla biskopen under hans visitation. brinder vp: intransitiv presens av brinna ('förstörs genom eld').",
            "segmentId": "avg-b01-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 2",
            "avvikelser": [
              "Inledande fragment {...ræ æn} bevarat med klamrar utan gissad rekonstruktion."
            ]
          },
          {
            "fsv": "Byscupi scal gengyærd geræ twar næter oc til quels hins þridia. med tolf mannum. sialuer han hin þrættandi. oc han drikki myod oc allir klerkar hans",
            "tolkning": "Åt biskopen skall gengärd göras för två nätter och till kvällen den tredje, med tolv män, han själv den trettonde; och han skall dricka mjöd och alla hans klerker.",
            "kommentar": "Byscupi: dativ singularis (mottagare av förplägnaden). sialuer han hin þrættandi: fornsvenskt räknesätt där den förnämste räknas sist i följet (följe om 12 + ledare). drikki: presens konjunktiv med preskriptiv innebörd ('må dricka/skall erhålla mjöd').",
            "segmentId": "avg-b01-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 3 & 4 (Nidingsverk i kyrka och landbornas tionde)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "3-4",
        "meningar": [
          {
            "fsv": "Uerder maþer .i. kyrkiu dræpin þet ær niþings værk. þa er kyrkia al vuighz",
            "tolkning": "Varder en man dräpt i en kyrka, det är ett nidingsverk; då är kyrkan helt och hållet avvigad.",
            "kommentar": "al vuighz: predikativ konstruktion med al ('helt') och genitivformen vuighz av participet ovigd (avhelgad, orenad genom blodsutgjutelse). niþings værk: förbrytelse som medförde fullständig fredlöshet och ära-förlust.",
            "segmentId": "avg-b01-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 3"
          },
          {
            "fsv": "Er þet firi tiu vitrum þa scal gyuæ byscupe þrer marker firir vilx oc natter gengerd. En a tiu vittrum. er. at þer hovodtiundaþo. oc uilia kyrkiu vighiæ letæ þa sculu þer. houodtiundæ",
            "tolkning": "Är det före tio vintrar (sedan förra reningen), då skall man giva biskopen tre marker för vigning och en natts gengärd. Men om det sker efter tio vintrar sedan de erlade huvudtionde och de vilja låta viga kyrkan, då skola de erlägga huvudtionde.",
            "kommentar": "firi tiu vitrum: tidsbestämning i dativ pluralis (vintrar = år). marker / marcher: fornsvenska mynt- och viktenheter. houodtiundæ: extraordinär tionde till kyrkans återinvigning.",
            "segmentId": "avg-b01-punkt03-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 3"
          },
          {
            "fsv": "Landbor sculu eigh. houodtiundæ gæræ mer en enu sinni. vten þer uili eller at þer falli .i. houod syndir",
            "tolkning": "Landbor skola icke erlägga huvudtionde mer än en enda gång, såvida de icke själva vilja eller de falla i huvudsynder.",
            "kommentar": "Landbor: arrendatorer/arrendebönder (nominativ pluralis). vten þer uili: undantagskonstruktion. houod syndir: ackusativ pluralis femininer av svåra synder som krävde kyrklig botgöring.",
            "segmentId": "avg-b01-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 4"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 1, Kirkiu Bolkær Punkt 1–4",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 55–58",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "WES1970",
        "lokalisering": "s. 14–17",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/kristnu-balker-ii": {
    "titel": "Kristnu balkær, del II",
    "underrubrik": "Äldre Västgötalagen, kyrkans bestånd, vigning och kyrkofrid (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra delen av kristendomsbalkens första blad i Äldre Västgötalagen reglerar kyrkobyggnadens invigning och altarsten, biskopens avgifter och konfirmation, de arkitektoniska kraven för att kyrkan skall behålla sin vigning vid reparationer samt straff och skadeståndsansvar vid inbrott och stöld av mässkärl. Texten återges här i strikt källordning enligt förlagan.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 5 (Altarsten, biskopens närvaro och kyrkobyggnadens avgifter)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "Værþer altæræ sten lös. þa scal prester byscup uid væræ. eller hetta uid sinum þrim marcum",
            "tolkning": "Varder altarsten lös, då skall prästen tillkalla biskopen eller sätta sina tre marker i pant.",
            "kommentar": "altæræ sten: sammansättning med genitivförled altæræ (av altare) till sten. hetta uid: sätta i pant, riskera böter om. sinum þrim marcum: dativ pluralis med possessivt pronomen.",
            "segmentId": "avg-b01-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 5"
          },
          {
            "fsv": "þa sculu bönder giuæ byscupi þrer marcher firi altæræ vixls oc natter gengerð",
            "tolkning": "Då skola bönderna giva biskopen tre marker för altarets invigning och en natts gengärd.",
            "kommentar": "bönder: rotstamspluralis. byscupi: dativ singularis som indirekt objekt. firi altæræ vixls: genitiv vixls av vígsla ('vigning'). natter gengerð: ackusativ/genitiv betecknande tidsmått för härbärge och förplägnad.",
            "segmentId": "avg-b01-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 5"
          },
          {
            "fsv": "Oc firi kyrkiu gærð allen. þrer marcher. firi s[...] kyrkiu gærd. tolf öra. oc firi stapul tolf öra",
            "tolkning": "Och för en hel kyrkobyggnad (vid nyinvigning) tre marker; för en [reparerad] kyrkobyggnad tolv örar, och för en klockstapel tolv örar.",
            "kommentar": "kyrkiu gærð allen: ackusativ singularis femininum av hela kyrkans uppförande. s[...]: lakun i källan, bevarad oförvanskad enligt transkriptionsreglerna. tolf öra: tolv örar (motsvarande 1½ mark). stapul: klockstapel.",
            "segmentId": "avg-b01-punkt05-seg003",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 5",
            "avvikelser": [
              "Källans lakun s[...] bevarad med klamrar utan gissad rekonstruktion."
            ]
          },
          {
            "fsv": "Crusszur oc klokchor. calka oc messufat. þa scal byscuper vighia firi tyundæ. þen. er bonder giuæ hanum oc börn fermæ",
            "tolkning": "Kors och klockor, kalkar och mässkärl skall biskopen viga för den tionde som bönderna giva honom, och konfirmera barn.",
            "kommentar": "Crusszur oc klokchor. calka oc messufat: framställda ackusativobjekt. firi tyundæ þen: för den ordinarie biskopstionden. börn fermæ: lånat från kyrkligt latin (firmare), konfirmera.",
            "segmentId": "avg-b01-punkt05-seg004",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 5"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 6 (Kyrkobyggnadens bestånd och underhåll)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "Taker kyrkia. at fyrnass. standæ stulpær. liggia sillir er helt dyrni. oc festiband",
            "tolkning": "Börjar en kyrka att åldras, men stolparna står, syllarna ligger, dörromfattningen och bindbjälken äro hela,",
            "kommentar": "fyrnass: deponent infinitiv ('åldras, förfalla'). stulpær: bärande stolpar i stavkonstruktionen. sillir: grundstockar/syllar. dyrni: dörromfattning (neutrum). festiband: bindbjälke.",
            "segmentId": "avg-b01-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 6"
          },
          {
            "fsv": "ligger kamber. hell. haltæræ sten. oc altare haui kikya vixl sinæ samu. þo at hana böte en þessi æru all hel",
            "tolkning": "takåsen ligger hel, altarstenen och altaret helt, då skall kyrkan behålla sin samma vigning, fastän man reparerar den, om dessa delar alla äro hela.",
            "kommentar": "kamber: takås. haltæræ sten: altarsten (med initialt h- i handskriften). kikya: skrivfel i källan för kyrkia, bevarat enligt transkriptionsreglerna. haui vixl sinæ samu: behålla sin ursprungliga invigning utan ny biskopsvigning.",
            "segmentId": "avg-b01-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 6",
            "avvikelser": [
              "Källans skrivfel 'kikya' bevarat oförändrat med textkritisk anmärkning."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 7 (Nidingsverk i kyrka, mässkärlsstöld och prästens ansvar)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "Uerdher kyrkia brutin oc mæssu fat stolen. þet er niþingsværk. þat er niv marcha sak. kyrky. swa hæreþe. sva konogge",
            "tolkning": "Varder en kyrka inbruten och mässkärl stulna, det är ett nidingsverk; det är en sak om nio marker: till kyrkan så, till häradet så, till konungen så.",
            "kommentar": "niþingsværk: vanärande brott mot kyrkofriden. niv marcha sak: nio markers böter med tredelning (3 marker vardera till kyrka, härad och kung).",
            "segmentId": "avg-b01-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 7"
          },
          {
            "fsv": "§.1. Varþer in gangit at opnom dorom. þa scal prester. gialdæ skaþa apter þen sum kyrkia fik til þes er þrer marcher. æru. oc eigh þy meræ at skaþi se mere gör",
            "tolkning": "§ 1. Varder det ingånget genom öppna dörrar, då skall prästen gälda tillbaka den skada som kyrkan led, upp till tre marker, och icke mer ändock att skadan gjordes större.",
            "kommentar": "at opnom dorom: instrumentell/lokativ dativ pluralis. Prästens vållande genom öppna dörrar begränsas till 3 markers skadeståndsansvar.",
            "segmentId": "avg-b01-punkt07-seg002",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 7 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 7 forts. (Inbrott under syll och återfunnet stöldgods)",
        "balkId": "B01",
        "pdfSidor": [
          1
        ],
        "kallpunkt": "7 §2-3",
        "meningar": [
          {
            "fsv": "§.2. Er grauit vndir syll. þa skal ecki prester værþæ",
            "tolkning": "§ 2. Är det grävt under syllen, då skall prästen intet svara för.",
            "kommentar": "Er grauit vndir syll: forcerat undergrävningsinbrott under grundstockarna frikallar prästen från ersättningsansvar.",
            "segmentId": "avg-b01-punkt07-seg003",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 7 §2"
          },
          {
            "fsv": "§.3. Spyrs vp scaþi. þa a presti böta þrer marcher. þagher kyrkia hauir sit alt",
            "tolkning": "§ 3. Spörjs skadan upp (återfinns stöldgodset), då äger man böta tre marker till prästen, så snart kyrkan har återfått allt sitt.",
            "kommentar": "Spyrs vp scaþi: mediopassiv/reflexiv preteritum-presens ('uppdagas, återfinns'). Skadeståndet återförs till prästen efter att kyrkans egendom återställts.",
            "segmentId": "avg-b01-punkt07-seg004",
            "kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 7 §3"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 1, Kirkiu Bolkær Punkt 5–7",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 113–115",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 14–17",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/kristnu-balker-iii": {
    "titel": "Kristnu balkær, del III",
    "underrubrik": "Äldre Västgötalagen, klockfall, kyrkogård och prästens förfall (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Tredje delen av kristendomsbalken i Äldre Västgötalagen reglerar vådaeld i kyrkobyggnad och prästens ljusansvar, ersättning för förlorade mässkärl, skadestånd vid fallande kyrkklockor, majoritetsbeslut vid prästval, kyrkogårdsfrid och gärdesgårdsunderhåll, företrädesordning mellan dop och dödssakrament, prästens laga förfall vid sjukbud samt arvoden vid likvaka och sockenbud.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 8–9 (Vådaeld och mässkärl)",
        "balkId": "B01",
        "pdfSidor": [
          2
        ],
        "kallpunkt": "8-9",
        "meningar": [
          {
            "fsv": "Brender up kyrkia þa skal prester böta. þrer markær. prester skal wardæ framlyvsum. oc þen baklyvsum er tænder",
            "tolkning": "Brinner en kyrka upp, då skall prästen böta tre marker. Prästen skall svara för framljusen, och den för bakljusen som tänder.",
            "kommentar": "Brender up kyrkia: inversionsinledd villkorssats. framlyvsum: dativ pluralis med lokativ funktion; ljusen i koret vid högaltaret. baklyvsum: ljusen i långhuset bland församlingen.",
            "segmentId": "avg-b01-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 8"
          },
          {
            "fsv": "§.1. Brender .i. kirkiu. scruþer af framlyvsum. gialdi prester apter hvat sum varþ er til þés þrer mærchær æru. eigh þy meræ at mere se skaþi gör",
            "tolkning": "§ 1. Brinner skrud i kyrkan av framljusen, gälde prästen åter vad den var värd, upp till tre marker, och icke mer ändock att skadan gjordes större.",
            "kommentar": "scruþer: skrudar/mässkläder (nominativ singularis maskulinum). gialdi: presens konjunktiv med preskriptiv innebörd. Ersättningsskyldigheten har ett legalt maxtak om tre marker.",
            "segmentId": "avg-b01-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 8 §1"
          },
          {
            "fsv": "§.2. Skil þem .a. bondæ oc presti. kaller prester. bondi tende. oc bonde kuaþer ne vid. byvþer firir sik tylftér éþ. at han tændi. eigh. þa er han hauir svoret. þa skal prester bötæ",
            "tolkning": "§ 2. Skiljer det dem emellan, bonden och prästen, så att prästen påstår att bonden tände och bonden nekar därtill, bjuder han för sig en tolftared att han icke tände; då han har svurit, då skall prästen böta.",
            "kommentar": "Skil þem a: opersonligt idiomatiskt uttryck ('om tvist uppstår'). kuaþer ne vid: bestrider med ed. tylftér éþ: edgång med tolv edgärdsmän.",
            "segmentId": "avg-b01-punkt08-seg003",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 8 §2"
          },
          {
            "fsv": "Bær prester messufat hém oc glatass. þer skal prester þem apter gialdæ sum þer varu. værð. med suornum eþe at þer varu eigh bætri",
            "tolkning": "Bär prästen mässkärl hem och de förloras, då skall prästen gälda dem åter efter vad de voro värda, med svuren ed att de icke voro bättre.",
            "kommentar": "glatass: reflexiv/mediopassiv infinitiv ('komma bort, förstöras'). suornum eþe: instrumentell dativ singularis ('under edsförpliktelse').",
            "segmentId": "avg-b01-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 9"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 10–11 (Klockfall och socknens prästval)",
        "balkId": "B01",
        "pdfSidor": [
          2
        ],
        "kallpunkt": "10-11",
        "meningar": [
          {
            "fsv": "Hængir klocka i. kyrkiu falder .i. hovod mannæ. böte sopn firi. niv marchum kirkiudroten iardeghendi en bana far",
            "tolkning": "Hänger klocka i kyrkan och faller i huvudet på en man så att han får bane, böte socknen nio marker för det till kyrkoägaren eller jordägaren.",
            "kommentar": "Hængir klocka: konditional paratax. böte sopn: sockenmännen bär det kollektiva ansvaret för klockstolens underhåll. en bana far: villkorssats med dödlig utgång.",
            "segmentId": "avg-b01-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 10"
          },
          {
            "fsv": "§.1. Falder klockæ rummi nider .i. hovoþ manni. böti sopcn marchum. þrim en han far banæ af",
            "tolkning": "§ 1. Faller klockkläppen ned i huvudet på en man så att han får bane därav, böte socknen tre marker.",
            "kommentar": "klockæ rummi: klockkläpp. sopcn: handskriftens variantstavning för socknen.",
            "segmentId": "avg-b01-punkt10-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 10 §1"
          },
          {
            "fsv": "§.2. Falder .i. hovod presti æller klocchæræ varþi sær sialvar. §.3. Brester klockæ firi þem. þa ér hvn vgild",
            "tolkning": "§ 2. Faller den i huvudet på präst eller klockare, svare de för sig själva. § 3. Brister klockan för dem under ringning, då är den ogill (utan skadeståndsansvar).",
            "kommentar": "varþi sær sialvar: yrkesansvar åvilar ringarna själva. vgild: rättsterm för sak eller skada som icke medför ersättningsskyldighet.",
            "segmentId": "avg-b01-punkt10-seg003",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 10 §2-3"
          },
          {
            "fsv": "§.4. En annar maþar felli. kloccho niþer bræster hvn viþer er hun værri en þrer marcher böte sum hun ær værð. oc iki mære. en þrer marcher. þo at hun se bættri",
            "tolkning": "§ 4. Men om en annan man fäller klockan ned så att den brister därvid, är den mindre värd än tre marker böte han vad den är värd, och icke mer än tre marker ändock att den vore bättre.",
            "kommentar": "felli: kausativt svagt verb ('orsakar att den faller'). Maxtak om 3 marker skyddar vållaren mot orimliga skadeståndsanspråk.",
            "segmentId": "avg-b01-punkt10-seg004",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 10 §4"
          },
          {
            "fsv": "Scill sopn valdi þer sum flere æru",
            "tolkning": "Skiljer det sockenmännen åt (vid prästval), råde de som flera äro (majoritetsprincipen).",
            "kommentar": "Scill sopn: opersonlig inversion. valdi: presens konjunktiv av valda/valia ('bestämma, råda'). Fornsvensk lagstadgad majoritetsdemokrati i sockenstämman.",
            "segmentId": "avg-b01-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 11"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 12–13 (Kyrkogårdsfrid, våld och hägnad)",
        "balkId": "B01",
        "pdfSidor": [
          2
        ],
        "kallpunkt": "12-13",
        "meningar": [
          {
            "fsv": "Værþer marder .i. kyrkiugardhi. dræpin ællær sargheþer. gialde biscupe þrer marcher. þa skal eighi tiþir uetæ. fyr æn hauir biscups lof til. num han hætti uid sinum þrim marchum. Biscuper skal viþ sopn mælæ. æn þær viþer þen vihit uan",
            "tolkning": "Varder en man dräpt eller sårad på kyrkogården, gälde man tre marker till biskopen; då skall man icke hålla gudstjänst förrän man har biskopens lov därtill, såvida prästen icke vill riskera sina tre marker. Biskopen skall tala till socknen, men bönderna till den som vanhelgelsen begick.",
            "kommentar": "marder: skrivfel i källan för maþer, bevarat i fsv. eighi tiþir uetæ: förbud mot tidegärd efter blodsutgjutelse på vigd mark. vihit uan: fornnordisk rättsformel för vanhelgelse av helgat rum.",
            "segmentId": "avg-b01-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 12",
            "avvikelser": [
              "Källans skrivfel 'marder' (för maþer) bevarat oförändrat med textkritisk anmärkning."
            ]
          },
          {
            "fsv": "§.1. Værþer maþer lustin .i. kyrkiugarþi. æller .i. har takin þa skal eigh prester mæssu sæghia fyr æn han hauir biscups lof til ællar hans lænsprests böte biscupi tolf öra. Æn þer mali. til þæs ær friþ bröt",
            "tolkning": "§ 1. Varder en man slagen på kyrkogården eller tagen i håret, då skall prästen icke säga mässa förrän han har biskopens eller hans prosts lov därtill; biskopen böte han tolv örar, och sockenmännen söke sak mot den som friden bröt.",
            "kommentar": "lustin: slagen (av liusta). .i. har takin: håravdrag (ærekränkande våldshandling). lænsprests: biskopens prost (kontraktsprost).",
            "segmentId": "avg-b01-punkt12-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 12 §1"
          },
          {
            "fsv": "§.2. Dylia sopnær mæn kalla eigh friþ brutin þa skal biscups lensprester se af sopnar mannum tylptar eþ biþia sær sva gud holl oc uatum sinum at þer eigh fridbrut giöt suat biscuper a sak. af",
            "tolkning": "§ 2. Dölja sockenmännen saken och säga att friden icke är bruten, då skall biskopens prost kräva en tolftared av sockenmännen, att Gud vare dem och deras vittnen huld så sant de icke gjorde något fridsbrott som biskopen äger böter för.",
            "kommentar": "Dylia: dölja, förneka sak. tylptar eþ: ed av tolv män. sær sva gud holl: traditionell fornsvensk edsvärjelseformel.",
            "segmentId": "avg-b01-punkt12-seg003",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 12 §2"
          },
          {
            "fsv": "kirkiu gard skal scipæ bolæ mælli slict a bol at gærþe. sum annat",
            "tolkning": "Kyrkogård skall skiftas emellan gårdarna, så att lika mycket hägnad lägges på varje gård som på en annan.",
            "kommentar": "scipæ bolæ mælli: fördela inhägnadsskyldigheten proportionellt mellan byns hemman (bol).",
            "segmentId": "avg-b01-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 13"
          },
          {
            "fsv": "Liggær kirkiugardær alþer open. þet er. þriggia marcha sak. þet a biscopér. Ligger þridiunger vpen. þæt ér siax oræ sak. þæt .a. biscopær. siþan a. hæræd firi balka han atta örtoghor. Oc e skal kirkiugarþær gilder varæ. baþi vinter oc somar",
            "tolkning": "Ligger kyrkogården alldeles öppen, det är en sak om tre marker; det äger biskopen. Ligger en tredjedel öppen, det är en sak om sex örar som tillfaller biskopen; sedan äger häradet åtta örtugar för varje balk. Och alltid skall kyrkogården vara fullgod både vinter och sommar.",
            "kommentar": "alþer open: helt ohägnad (3 markers böter till biskopen). þridiunger vpen: 6 örars böter. firi balka han: för varje ogillt balkled tillfaller 8 örtugar häradet. gilder: i fullgott och lagligt skick året om.",
            "segmentId": "avg-b01-punkt13-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 13"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 14 (Dop, sockenbud och prästens laga förfall)",
        "balkId": "B01",
        "pdfSidor": [
          2
        ],
        "kallpunkt": "14",
        "meningar": [
          {
            "fsv": "Barn þorf kristnu maþer huls. fyrra scal barn cristna æn man huslæ. þorf maþer oling. ok annar husl. þa skal fyrræ man huslæ æn olæ",
            "tolkning": "Tarvas barn kristning och man nattvard, skall man förr kristna barnet än husla mannen. Tarvas en man smörjelse och en annan nattvard, då skall man förr husla mannen än smörja.",
            "kommentar": "þorf: presens av þurfa ('behöva'). huslæ: meddela den sista nattvarden (viaticum). oling: den sista oljningen/smörjelsen. Teologisk rangordning: dop går före nattvard, som går före sista smörjelsen.",
            "segmentId": "avg-b01-punkt14-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 14"
          },
          {
            "fsv": "§.1. Barn far eigh kristnu maþer eigh husl. ællér öleng. ær prester forfallalös. þa ær han sæker at marchum þrim. viþ biscup oc þrim marchum vid saksöchenden",
            "tolkning": "§ 1. Får barn icke kristning eller man icke nattvard eller smörjelse därför att prästen är utan laga förfall, då är han förfallen till tre markers böter till biskopen och tre marker till målsäganden.",
            "kommentar": "forfallalös: utan giltig frånvaroorsak. sæker at marchum þrim: bötfälld till tre marker vardera till biskopen och målsäganden.",
            "segmentId": "avg-b01-punkt14-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 14 §1"
          },
          {
            "fsv": "§.2. Forfal prests æru æn biscuper hauir hanum buþ sænt oc ær bortfarin för. Annur æn han siukær ligher. [Þ]ridiæ æn han þighiændæ mæssu sighir. Fyardæ æn han ær i. sokn farin siukum. at hiælpæ",
            "tolkning": "§ 2. Prästens laga förfall äro om biskopen har sänt honom bud och han är bortrest förut; det andra om han ligger sjuk; det tredje om han håller tyst mässa; det fjärde om han är faren i socknen för att bistå de sjuka.",
            "kommentar": "[Þ]ridiæ: källans frågetecken '?' representerar versalt Thorn och återges enligt transkriptionsreglerna som [Þ]. þighiændæ mæssu: tyst mässa (missa secreta/kanonbönen), vilken icke fick avbrytas.",
            "segmentId": "avg-b01-punkt14-seg003",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 14 §2",
            "avvikelser": [
              "Källans frågetecken '?' transkriberat till [Þ] med textkritisk notering."
            ]
          },
          {
            "fsv": "§.3. Vr skal mæssufatum fara ok sivkum hialpæ. æn han sivngær æigh þighianda mæssu",
            "tolkning": "§ 3. Ur mässkläderna skall han stiga och hjälpa den sjuke, om han icke sjunger tyst mässa.",
            "kommentar": "Vr mæssufatum fara: prästen är skyldig att omedelbart avbryta en vanlig sjungen gudstjänst för att ila till en döende sockenbo.",
            "segmentId": "avg-b01-punkt14-seg004",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 14 §3"
          },
          {
            "fsv": "§.4. Skil þæm a bonda ok prest kallær bondi han forfallalösan. þa scal han væriæ sik a mote mæder siax prestum. at han laghæ forfall fæk",
            "tolkning": "§ 4. Skiljer det dem emellan, bonden och prästen, så att bonden kallar honom förfallolös, då skall han värja sig mot det med sex präster som edsmän, att han hade laga förfall.",
            "kommentar": "mæder siax prestum: sexmannaed av prästerliga ämbetsbröder för att fria från tjänstefelsansvar.",
            "segmentId": "avg-b01-punkt14-seg005",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 14 §4"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 15 (Sista smörjelsen, likvaka och biskopens bud)",
        "balkId": "B01",
        "pdfSidor": [
          2,
          3
        ],
        "kallpunkt": "15",
        "meningar": [
          {
            "fsv": "Prester scal bondæ ola oc bonda kono. bonda svn oc dottor hans ælstæ barn firi. tyunda sin. æn firi hiona huart er olia scal giui öra tva ok sva firi alla þa mæn eigh tyundæ sin ok öri firi lægher. staþ allum frælsum mannum. þem huls taca. ok ortogh firi natuaku",
            "tolkning": "Prästen skall smörja bonden och bondens hustru, bondens son och hans dotter och äldsta barn för sin tionde; men för vart och ett av tjänstehjonen som skall smörjas give man två örar, och likaså för alla de män som icke erlägga tionde, samt en öre för lägerstad för alla frälsemän som mottaga nattvard, och en örtug för nattvaka.",
            "kommentar": "hiona huart: tjänstehjon. lægherstaþ: gravplats på kyrkogården. natuaku: likvaka.",
            "segmentId": "avg-b01-punkt15-seg001",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 15"
          },
          {
            "fsv": "Eigh mæra þit fleræ vaki. Eigh ok flera vaka num prester uili. æller bondi uili. oc þy at þrer nætær liggi. lik inni. Vill han lengær læta inni liggia giui örtogh naat huaria",
            "tolkning": "Icke mera ändock att flera vaka. Icke heller må flera vaka såvida icke prästen eller bonden vill, och det om liket ligger inne i tre nätter. Vill han låta det ligga inne längre, give han en örtug för varje natt.",
            "kommentar": "Sedvanerättslig gräns vid tre nätters likvaka före begravning.",
            "segmentId": "avg-b01-punkt15-seg002",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 15"
          },
          {
            "fsv": "§.1. Gæster dör at bonda taki öris mun af fatum hans. oc giui presti firi lægherstad oc örtogh at natvaku. præster ær skyldugher gest at husla sum bondæ",
            "tolkning": "§ 1. Dör en gäst hos en bonde, tage man ett öres värde av hans kläder och give prästen för lägerstad och en örtug för nattvaka; prästen är skyldig att ge gästen nattvard likaväl som bonden.",
            "kommentar": "öris mun: ett öres värde ur den döde gästens tillhörigheter.",
            "segmentId": "avg-b01-punkt15-seg003",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 15 §1"
          },
          {
            "fsv": "§.2. Dör stafkarl. þa a prester pik ok screppu ok læghærstad",
            "tolkning": "§ 2. Dör en stavkarl (fattig tiggare), då äger prästen hans pikstav och skräppa och skall ge honom lägerstad.",
            "kommentar": "stafkarl: vandrande tiggare. Prästen bekostar begravningen mot tiggarens få personliga ägodelar.",
            "segmentId": "avg-b01-punkt15-seg004",
            "kallreferens": "AVG-MASKIN s. 2, Kirkiu Bolkær Punkt 15 §2"
          },
          {
            "fsv": "§.3. Sitær biscuper innan soknæ far bondi buþ hanum biþær ola sik. þa ær han skyldugher han at ola. haui half mark firir",
            "tolkning": "§ 3. Vistas biskopen inom socknen och bonden sänder bud till honom och beder honom smörja sig, då är han skyldig att smörja honom; för det må han erhålla en halv mark.",
            "kommentar": "Sidövergång: meningen börjar på s. 2 rad 46–47 och slutar på s. 3 rad 1. Återges intakt i samma segment enligt transkriptionsreglerna med pdfSidor: [2, 3].",
            "segmentId": "avg-b01-punkt15-seg005",
            "kallreferens": "AVG-MASKIN s. 2–3, Kirkiu Bolkær Punkt 15 §3"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 2–3, Kirkiu Bolkær Punkt 8–15",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 58–62",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 17–20",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/kristnu-balker-iv": {
    "titel": "Kristnu balkær, del IV",
    "underrubrik": "Äldre Västgötalagen, tiondedelning, sockenbygge och kyrkofrid (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Fjärde och avslutande delen av kristendomsbalken i Äldre Västgötalagen reglerar förbud mot prästerligt intrång i annans socken, åkertiondens tredelning mellan biskop, kyrka och fattiga, boskapstionde och långfredagsoffer, delning av lägerstadsavgifter vid begravning på annan ort, odalmarkernas församlingstillhörighet, vådablod på kyrkogården samt biskopens ensamrätt till bannlysning.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 16–17 (Sockengränser och tiondedelning)",
        "balkId": "B01",
        "pdfSidor": [
          3
        ],
        "kallpunkt": "16-17",
        "meningar": [
          {
            "fsv": "Ganger prester .i. sokn annars prests ber .i. bok ok stol ok læs iuir folké. þa ær han sakar. at marchum. þrim. gialdi tolf öræ . biscupi. ok tolf öræ presti",
            "tolkning": "Går en präst in i en annan prästs socken, bär dit bok och stola och läser över folket, då är han saker till tre marker: gälde tolv örar till biskopen och tolv örar till prästen.",
            "kommentar": "ber .i. bok ok stol: stola och mässbok som ämbetstecken. Förbudet skyddar sockenprästens territoriella och ekonomiska ensamrätt. Böterna om tre marker delas lika mellan biskopen och den förfördelade sockenprästen.",
            "segmentId": "avg-b01-punkt16-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 16"
          },
          {
            "fsv": "A acri scal tyundæ scipta. tacher prester. sva sum kiurkiæ ær til vigþ. siþan scal sciptæ .i. þrer lötæ. En a biscopær. Annan a kiurkia. [Þ]ridia væslirmæn",
            "tolkning": "På åkern skall man skifta tionden; prästen tager sin del så som kyrkan är invigd till. Sedan skall den skiftas i tre lotter: en äger biskopen, en annan kyrkan, den tredje de fattiga (väslingsmän).",
            "kommentar": "A acri scal tyundæ scipta: tionden skiftas direkt på tegen vid skörden. [Þ]ridia: källans frågetecken '?' representerar Thorn. væslirmæn: nödställda/fattiga (medeltida fattigvård genom tiondeandel).",
            "segmentId": "avg-b01-punkt17-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 17",
            "avvikelser": [
              "Källans frågetecken '?' transkriberat till [Þ] med textkritisk notering."
            ]
          },
          {
            "fsv": "§.1. prester a kuikkæn tyundæ allan. ok offær þet til cruszu fotæ kombær .a. langafreadaghi",
            "tolkning": "§ 1. Prästen äger all den levande tionden (boskapstionden), och det offer som kommer till korsfoten på långfredagen.",
            "kommentar": "kuikkæn tyundæ: den levande tionden (av kyk/kvick, dvs. småboskap och kalvar). cruszu fotæ: vid foten av kyrkans krucifix under långfredagens korstillbedjan.",
            "segmentId": "avg-b01-punkt17-seg002",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 17 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 18–19 (Begravning på annan ort och prästgåva)",
        "balkId": "B01",
        "pdfSidor": [
          3
        ],
        "kallpunkt": "18-19",
        "meningar": [
          {
            "fsv": "Bonde. dör .i. sokn. ok uill. annærstagd læghærstað hauæ. þa skal prester lik hans uighia ok til gardsliz fylghia eighi længræ num han uili. þa skal han halvæn læghærstad hauæ. ok haluæn þén prester uid liki takær",
            "tolkning": "Dör en bonde i socknen och vill hava lägerstad annorstädes, då skall prästen viga hans lik och följa det till gårdslidet, icke längre såvida han icke själv vill; då skall han hava halva lägerstadsavgiften, och halva den präst som mottager liket.",
            "kommentar": "gardsliz: gårdslidet (grind/färist vid bygränsen). Sockenprästen har ingen skyldighet att följa liktåget längre än till sockengränsen. Lägerstadsavgiften klyvs jämnt mellan församlingarna.",
            "segmentId": "avg-b01-punkt18-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 18"
          },
          {
            "fsv": "Æn presti vill. gipt gyuæ. þet ær tvar skæppur. ællær örtugh pænningæ",
            "tolkning": "Om man vill giva prästen gåva (vid vigsel), då är det två skäppor säd eller en örtug penningar.",
            "kommentar": "gipt gyuæ: sedvanerättsligt arvode eller frivillig gåva till prästen vid lysning/vigsel.",
            "segmentId": "avg-b01-punkt19-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 19"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 20 (Gårdshemvist, utmarker och kyrkotillhörighet)",
        "balkId": "B01",
        "pdfSidor": [
          3
        ],
        "kallpunkt": "20",
        "meningar": [
          {
            "fsv": "A maþer bol .i. by. aþrum ok far. afsædhum. þa skal han tyundæ lucæ presti ok kiurkiu sum bol ligger. ok kirkiugarþi. varþæ",
            "tolkning": "Äger en man gård i en by och brukar utmarker i en annan, då skall han gälda tionde till den präst och kyrka där gården ligger, och svara för kyrkogårdsmuren där.",
            "kommentar": "afsædhum: avsädesjord/utmarker. Gårdens stamfastighet (bol) styr kyrkotillhörighet och underhållsbörda.",
            "segmentId": "avg-b01-punkt20-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 20"
          },
          {
            "fsv": "§.1. Sar man enka aker til byiar. þa skal. præstins tiundæ lætæ aftær standæ. allæn. ællar bort. flytia",
            "tolkning": "§ 1. Sår man en enstaka åker som hör till en by, då skall man låta prästens tionde stå kvar i sin helhet eller föra den bort till kyrkan.",
            "kommentar": "enka aker: enstaka/avskild åkervret. Tiondesäden måste antingen reserveras på åkern eller levereras till prästgården.",
            "segmentId": "avg-b01-punkt20-seg002",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 20 §1"
          },
          {
            "fsv": "§.2. Bor bondi a odmarkær. söki. þingæt kirkiu ær hanum. þykkir næst varæ. æn han vill. sva. §.3. Eighi ma landboæ nöghæ at söchia or kirkiu by til annarrær kirkiu",
            "tolkning": "§ 2. Bor en bonde på ödemark, söke han kyrka dit det synes honom vara närmast, om han så vill. § 3. Landbo må icke tvingas att söka från sin kyrkby till en annan kyrka.",
            "kommentar": "odmarkær: utmark/ödemark. Nybyggare ges rätt att välja närmaste kyrka. landboæ nöghæ: nöga/tvinga landbo mot hans vilja.",
            "segmentId": "avg-b01-punkt20-seg003",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 20 §2-3"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær Punkt 21–22 (Vådablod och bannlysning)",
        "balkId": "B01",
        "pdfSidor": [
          3
        ],
        "kallpunkt": "21-22",
        "meningar": [
          {
            "fsv": "Æn vaþa bloð comber .i. kirkiugard. þa skal torvu skæræ mæð bloþi oc kastæ ur kirkiugærði. ok kirkiugærþér ær ækki. vskir. þy hældær",
            "tolkning": "Men om vådablod kommer på kyrkogården, då skall man skära upp torvan med blodet och kasta ut ur kyrkogården; och kyrkogården är icke ohelgad därför.",
            "kommentar": "vaþa bloð: oavsiktlig blodsutgjutelse (olycksfall till skillnad från våldsbrott). ækki vskir: icke oskär/ohelgad (kräver icke ny biskopsvigning).",
            "segmentId": "avg-b01-punkt21-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 21"
          },
          {
            "fsv": "Præstær ma ængin man fra kiurkiu vrakæ. num þen biscopær havir forboþét. vrækæ. böndær fridlösæn man. æn þer uilia. Orsaker ær prester vm þat",
            "tolkning": "Prästen må icke vräka någon man från kyrkan utom den som biskopen har förbjudit (bannlyst). Bönderna må vräka en fredlös man, om de så vilja; prästen är saklös om det sker.",
            "kommentar": "fra kiurkiu vrakæ: utvisa ur kyrkan. forboþét: formell kyrklig bannlysning som endast biskopen ägde utfärda. Världsligt fredlösa män må fördrivas av församlingens bönder.",
            "segmentId": "avg-b01-punkt22-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Kirkiu Bolkær Punkt 22"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 3, Kirkiu Bolkær Punkt 16–22",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 62–65",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 20–24",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/mandraps-balker-i": {
    "titel": "Af mandrapi, del I",
    "underrubrik": "Äldre Västgötalagen, dråpslysning, ättleidde, träl och utländsk man (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Första delen av dråpsbalken i Äldre Västgötalagen reglerar rättegångsförfarandet vid dödligt våld: dråpslysning vid tre på varandra följande ting, målsägandens rätt att utpeka baneman och medhjälpare, edgång med två tylfter och överedsmän, dom till fredlöshet på sägnartinget, böternas fördelning på ätten (arvebot och ättebot) samt rättsordningens särregler för ättledda frigivna trälar, träldråp och utländska män.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 1 (Dråpslysning och banord)",
        "balkId": "B02",
        "pdfSidor": [
          3
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Uærþær maþer dræpin ok af daghum takin. þa skal uighi a þingi lysæ oc frafal aruingiæ sigiæ. ok .a. adru. Æn a þridia eftyr mælæ ællær ær mal hans spilt. þa skal væghændi til þings faræ ok vtæn vider þing standi mæn til þings gæræ. griþær at bezas",
            "tolkning": "Varder en man dräpt och tagen av daga, då skall man lysa dråpet på tinget och kungöra arvingens frånfälle, och likaså på det andra tinget; men på det tredje skall man fullfölja talan, eljest är hans sak förspilld. Då skall banemannen fara till tings och stå utanför tinget medan man förhandlar på tinget för att begära frijd.",
            "kommentar": "af daghum takin: fast rättsformel för dödande. lysæ a þingi: formell kungörelse vid tre ting. væghændi: dråparen/banemannen. griþær: tingsfred (lejd).",
            "segmentId": "avg-b02-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1"
          },
          {
            "fsv": "[Þ]ings mæn skulu hanum loua þings gangu han skal uider þy banorþi gangæ. §.1. þa skal arui banæ næmnæ þæt ær. vald hans at giua þem banorð ær han vill. æn væghænder aru marghir til",
            "tolkning": "Tingsmännen skola lova honom tingsgång; han skall gå vid dråpsanklagelsen. § 1. Då skall arvingen nämna baneman; det är i hans makt att giva banord åt vem han vill, om dråparna äro flera.",
            "kommentar": "[Þ]ings mæn: källans frågetecken '?' transkriberat till [Þ]. banorð: officiell dråpsanklagelse. Målsäganden har exklusiv valrätt att utse vem som skall åtalas som huvuddråpare.",
            "segmentId": "avg-b02-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1 §1",
            "avvikelser": [
              "Källans frågetecken '?' transkriberat till [Þ] med textkritisk notering."
            ]
          },
          {
            "fsv": "þæn skal. mæþ barni bænæ næmpna. þy ær skyldastér a fæþærni. Hauir kona barn .i. knæ. þa skal hun banæ mæmpnæ. þa skal haldsbenð næmpnæ ok atuistær mæn. þer skulu fæm varæ ok en raþsbani",
            "tolkning": "Den skall nämna baneman tillsammans med barnet som är närmast skyld på fädernet. Har en kvinna barn i knä, då skall hon nämna baneman; då skall man nämna medhjälpare (hållsbjälpar) och närvaromän; de skola vara fem, och en rådsbane.",
            "kommentar": "barn .i. knæ: omyndigt barn i moders vård. haldsbenð: medhjälpare som höll offret under dråpet. atuistær mæn: närvarande på platsen med uppsåt. raþsbani: anstiftare/rådgivare.",
            "segmentId": "avg-b02-punkt01-seg003",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 1 forts. (Edgång, två tylfter och fredlöshet)",
        "balkId": "B02",
        "pdfSidor": [
          3,
          4
        ],
        "kallpunkt": "1 §2-5",
        "meningar": [
          {
            "fsv": "§.2. þa skal ændaghæ hem dömæ þæn sum allir mæn göræs afatir a þingi. þa skal a ænghæ þingshamna vittni bæræ lætæ",
            "tolkning": "§ 2. Då skall man hem till honom fastställa den endag som alla män enas om på tinget; då skall man på ändan bära tingshamnsvittne.",
            "kommentar": "ændaghæ: fastställd rättegångsdag för edgång och dom. þingshamna vittni: intyg av sex tingsmän att talan är lagligen anhängiggjord.",
            "segmentId": "avg-b02-punkt01-seg004",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1 §2"
          },
          {
            "fsv": "Iak var þa a þingi ok vir mæn siax. Sua kum dombær a mal þit. at þu skuldi hær standæ .i. dagh ok ritæ. a hændær hanum banorð mæþ tvænni tylptum. Sva se mær gud hull. ok uattum minum at sva kum dombær .a. mal þit sum iak bær nu vitni til",
            "tolkning": "\"Jag var då på tinget och vi sex män. Så föll dom i ditt mål, att du skulle stå här i dag och fästa banord på honom med två tylfter. Så vare mig Gud huld och mina vittnen, att så föll dom i ditt mål som jag nu vittnar om.\"",
            "kommentar": "Autentisk fornsvensk vittnesformel för sexmannanämnd på tinget.",
            "segmentId": "avg-b02-punkt01-seg005",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1 §2"
          },
          {
            "fsv": "þa skal arui sværriæ. Sva se mær guð hol ok uattum minum. at þu bart .a. han od ok æg. ok. þu ær sændær bani hans. ok sua gaf iak þær namni til a þingi. þa skal arui firi adræ tylft gangæ ok samulund sværiæ. Tolf mæn skulu .i. tylft standa ok et munhaf skal eptir tylpt huæria væræ. þyy mynhaf skulu æptir. tylptær eþ. hvænn. væræ guþ hylla at sær ok at græmya",
            "tolkning": "Då skall arvingen svärja: \"Så vare mig Gud huld och mina vittnen, att du bar udd och egg mot honom och du är hans sanna baneman, och så gav jag ditt namn på tinget.\" Då skall arvingen gå inför den andra tylften och svärja på samma sätt. Tolv män skola stå i tylften, och ett överedsvittne skall vara efter varje tylft; två överedsmän skola efter varje tylfted anropa Gud att vara sig huld eller vred.",
            "kommentar": "od ok æg: allittererande formel för vapenvåld. munhaf: överedsmän som bekräftar tylftens sanningshalt.",
            "segmentId": "avg-b02-punkt01-seg006",
            "kallreferens": "AVG-MASKIN s. 3, Af mandrapi Punkt 1 §2"
          },
          {
            "fsv": "§.3. [Þ]a skal arui til sægnarþings fara lætæ dömæ sic af þingi ok uita meþ vmstaþumannum. Biþia sva sær guþ hull. ok uattum sinum. at han uan þat alt a endaghæ til fridær hans sum lagh til sæghiæ. þa skal han a þing ganga afptar latæ döma friðlösæn han firi arva ok æptimælændæ. ok vgilðan þa skal han friþ flyiæ. ætæ hema a daghurþi. a sægnærþingi ok i. skoghæ at natværþi",
            "tolkning": "§ 3. Då skall arvingen fara till sägnartinget, låta döma sig rätt från tinget och bevisa med omgångsmän, bedja så Gud vare sig och sina vittnen huld att han fullgjorde allt det på endagen för hans fred som lagen föreskriver. Då skall han gå in på tinget igen och låta döma honom fredlös för arvingar och målsägande och ogill; då skall banemannen fly fredlös: äta frukost hemma på sägnartingsdagen och kvällsmat i skogen.",
            "kommentar": "Sidövergång från s. 3 till s. 4. [Þ]a: källans '?' transkriberat till [Þ]. ætæ hema a daghurþi... ok i skoghæ at natværþi: klassisk poetisk formel för den landsflyktiges fredlöshet.",
            "segmentId": "avg-b02-punkt01-seg007",
            "kallreferens": "AVG-MASKIN s. 3–4, Af mandrapi Punkt 1 §3",
            "avvikelser": [
              "Källans frågetecken '?' transkriberat till [Þ] med textkritisk notering."
            ]
          },
          {
            "fsv": "Liggiæ uið tolf marchær hæraðs hyfþingæ æn han sitær kuær ok værdhar han eigh ok fyuratighi mærkær hæræþi. ok þrer mærkar þæn ætær mæþ hanum. ok drikkær ok hauir mot mæð hanum hætæ þrer ok æru tvar sæxtan örtoghor .i. þriðiungh. huærn ællær num han læti bötær biuþa æti han nathorþ at saklösu",
            "tolkning": "Tolv marker ligge under häradshövdingen om han sitter kvar och häradshövdingen icke griper honom, och fyrtio marker till häradet, och tre marker böte den som äter med honom eller dricker eller har samkväm med honom; tre nätter må han dock äta kvällsmat saklöst om han låter bjuda böter.",
            "kommentar": "Böter för häradshövding och menigheten om de underlåter att fördriva eller bistår en fredlös baneman.",
            "segmentId": "avg-b02-punkt01-seg008",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 1 §3"
          },
          {
            "fsv": "§.4. Viliæ þer bötær takæ. þa skal bötæ niu markær arvæböt. oc tolf markær ættærbot. Sæx mærkær skal arui böta. sex mærkær skal ættin böta. þrer a fædrærnni ok þrer a mödærni. þa skal hin skyldasti öra tolf. þa þér ær næst öra sæx. þa þer ær næst. öra þrer. þæn þær ær næst half fæmtu örtöghr. §.5. Sva skulu allir bötæ. ok skulu sva alli taka. a huar halwu minna til sættæ mans. Bot skal skipta til sættæ mans. Iamnskildir allir þa skal slit kolder takæ sum koldr. Sæx mærkær skal arvi taka af ættærbot. ok sex. mærchær skal ættin takæ. þrer a fæðærni. ok þrer a möþærni",
            "tolkning": "§ 4. Vilja de taga emot böter, då skall man böta nio marker i arvebot och tolv marker i ättebot. Sex marker skall arvingen (dråparen) böta och sex marker skall ätten böta: tre på fädernet och tre på mödernet; då skall den närmaste fränden böta tolv örar, den därnäst sex örar, den därnäst tre örar och den därnäst fyra och en halv örtug. § 5. Så skola alla böta och så skola alla taga emot, hälften mindre för varje led till sjätte man. Bot skall skiftas till sjätte man; äro alla lika nära skylda, då skall kull taga lika som kull. Sex marker skall arvingen taga av ätteboten, och sex marker skall ätten taga: tre på fädernet och tre på mödernet.",
            "kommentar": "arvæböt: bot till målsäganden. ættærbot: bot som fördelas proportionellt över släkterna upp till sjätte man.",
            "segmentId": "avg-b02-punkt01-seg009",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 1 §4-5"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 2–3 (Ättleidd man och hällbane)",
        "balkId": "B02",
        "pdfSidor": [
          4
        ],
        "kallpunkt": "2-3",
        "meningar": [
          {
            "fsv": "Scal maþer ætlæddan man. aptær bötæ. þæn annöþoghær havir farit. han aptær bötæ mæþ niu marchum arvæ bot. ok sex. mærkum ættærbot. sva sum ættæþæn man. firi vtæn halvæ ættær bót. firir. þy at ætt hans ær half þrælær. ok frælsgiwar",
            "tolkning": "Skall man böta för en ättleidd man (frigiven träl som upptagits i ätten) som någon dräpt, då skall man böta för honom med nio marker i arvebot och sex marker i ättebot, såsom för en ättefödd man förutan halva ätteboten; ty hans ätt är till hälften trälar och friborerska.",
            "kommentar": "ætlæddan man: frigiven träl upptagen i fri ätt genom ättledning. Halverad ättebot (6 marker istället för 12) motiveras med hans trälbörd.",
            "segmentId": "avg-b02-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 2"
          },
          {
            "fsv": "Æn hall bana uil sökia ællær atuisær mén. þa skal þing uisa ok talu a þingi. wetæ ok þem lata endaghæ döma. þa skal þingsmannæ. vittni a endaghæ latæ baræ. ok sva a hauarium ændaghæ. þa skal þings mannæ vittni fyrst latæ baræ. siþan skal arvi. sværiæ. Sua se mær guþ hull. ok uattum minum. at þu hælt hanum undir od. ok æg. ok sva gaf iac þer namni til. a þingi",
            "tolkning": "Vill man söka sak mot hällbane (stenkastare) eller närvaromän, då skall man hänskjuta till tinget och föra talan på tinget och låta fastställa endag åt dem. Då skall man låta bära tingsmannavittne på endagen, och så på varje endag: först låta bära tingsmannavittne, och sedan skall arvingen svärja: \"Så vare mig Gud huld och mina vittnen, att du höll honom under udd och egg och så gav jag ditt namn på tinget.\"",
            "kommentar": "hall bana: stenkastare som vållat döden. Rättegångsförfarande och edgång vid stenkastningsdråp.",
            "segmentId": "avg-b02-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 3"
          },
          {
            "fsv": "§.1. Atvistær manni. skal þing uisa ok sva sværiæ a hændær hanum. Biðiæ sua sær gud holl ok uattum sinum at þu vært a vighuælli maþ vrassviliæ ok sua gaf iak þær næmpni til a þingi. §.2. Raszbana skal þing uisa vm sak þa. þu kallar han sannæn at væræ at han ræd han hælræþum. han skal uita firir a endaghæ mæð tylpt at fæþerni ok halua at möþerni. Falss. han at baþum þa skal han böta haluæ fæmtu mark. falss. han at tylpt böte þrer mark. falss. han at halvri böte tolf öra",
            "tolkning": "§ 1. Mot närvaroman skall man hänskjuta till tinget och så svärja mot honom: \"Be så Gud vare sig och sina vittnen huld, att du var på valplatsen med ond vilja och så gav jag ditt namn på tinget.\" § 2. Mot rådsbane skall man hänskjuta till tinget om den sak som du påstår honom vara skyldig till, att han rådde till dödande råd; han skall värja sig för det på endagen med en tylft på fädernet och en halv tylft på mödernet. Fälls han vid båda, då skall han böta fyra och en halv mark; fälls han vid tylften böte han tre marker; fälls han vid halva tylften böte han tolv örar.",
            "kommentar": "vrassviliæ: ond/fientlig avsikt vid närvaro på valplatsen. hælræþum: anstiftande dödsråd. haluæ fæmtu mark: fyra och en halv mark.",
            "segmentId": "avg-b02-punkt03-seg002",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 3 §1-2"
          },
          {
            "fsv": "§.3. Nu skal halss bani bötæ halui fæmtu mærk. þær .a. akki konongær sak .a. eigh a razbænd. ok eigh a halss. bænd. Atvist a saksökæ örtogh ok oræ fæm. sva. a konongær sva. a hæræd. §.4. Mæþ þingi skal hælghis bot ok tacæ ok eigh. næmæ til",
            "tolkning": "§ 3. Nu skall hållsbane böta fyra och en halv mark; där äger konungen inga böter, varken av rådsbanar eller hållsbjälpar. För närvaro äger målsäganden fem örar och en örtug, likaså konungen och likaså häradet. § 4. Med tingsdom skall helgbot tagas och icke genom godtycklig uppgörelse.",
            "kommentar": "Botbelopp för medgärningsmän. Konungen saknar bötesrätt mot medhjälpare utan erhåller endast andel vid närvaro.",
            "segmentId": "avg-b02-punkt03-seg003",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 3 §3-4"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 4–5 (Träls dråp, svensk man och smålänning)",
        "balkId": "B02",
        "pdfSidor": [
          4
        ],
        "kallpunkt": "4-5",
        "meningar": [
          {
            "fsv": "þrel drapér man. ættæþen. han ma eigh. heta þés bani. Bonde skal böta aruæ. bot ok ættar bot. eigh friþ flyia. num han uili. eigh böta",
            "tolkning": "Dräper en träl en ättefödd (fri) man, må trälen icke heta hans baneman; bonden (trälens herre) skall böta arvebot och ättebot, och icke fly fredlös såvida han icke vägrar att böta.",
            "kommentar": "Trälen saknar rättslig personlighet. Husbonden bär fullt skadeståndsansvar.",
            "segmentId": "avg-b02-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 4"
          },
          {
            "fsv": "Dræpær maþar svænskan man. eller smalenskæn innan kongsrikis. man eigh. væstgöskan böte firi atta örtogher. ok þrættan markær. ok ænga ætar bot. §.1. Niu markær. a konongær a mandrapi ok sva allir mæn",
            "tolkning": "Dräper en man en svensk man (svea/upplänning) eller en smålänning, en man inom kungariket som icke är västgöte, böte han för det åtta örtugar och tretton marker, och ingen ättebot. § 1. Nio marker äger konungen vid mandråp, och likaså alla män.",
            "kommentar": "Den berömda rättsregeln som visar Västergötlands särställning i riket: svear och smålänningar betraktas som utbölingar vars ätter icke tillerkänns ättebot.",
            "segmentId": "avg-b02-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 5"
          },
          {
            "fsv": "§.2. Dræpar kona man. þa skal mælæ. a man. þén skyldæstæ. han skal botum varþæ ællær frid flyia. §.3. Dræpar maþær danskan man. allæ noræn man böte niv markum. §.4. Dræpær maþær vtlændskan man. eigh ma frid flyia. or landi sinu. oc .j. æth. hans",
            "tolkning": "§ 2. Dräper en kvinna en man, då skall man föra talan mot den man som är henne närmast skyld; han skall svara för böterna eller fly fredlös. § 3. Dräper en man en dansk man eller en norrman, böte han nio marker. § 4. Dräper en man en utländsk man, må han icke fly fredlös ur sitt land och in i dennes hemland.",
            "kommentar": "Kvinnans målsman bär bötesansvaret. Dansk och norsk mansbot är 9 marker.",
            "segmentId": "avg-b02-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 5 §2-4"
          },
          {
            "fsv": "§.5. Dræpær maþær vtlænskan prest. böte sæ mykit firi sum hærlænskan man. Præstær skal .i. bondalaghum væræ. §.6. Varþær suþærman dræpin allær ænskær maþær. þa skal böta firi marchum fiurum. þem sakinæ sökir. ok tvar. marchar konongi. bondæ hvar gaf. þer af aþrum sin. ræt. §.7. Dræpær maþær þrél manss. böte firi markum þrem. num han uiti han fiughurræ markæ værdan. þa skal sva bötæ ængin a. þær sak a vtæn saksökæn",
            "tolkning": "§ 5. Dräper en man en utländsk präst, böte han så mycket för honom som för en infödd (härländsk) man; prästen skall vara i bondelag. § 6. Varder en tysk (suderman) dräpt eller en engelsk man, då skall man böta för honom fyra marker till den som söker saken, och två marker till konungen; var och en bonde gav här den andre hans rätt. § 7. Dräper en man en annans träl, böte han för det tre marker, såvida han icke bevisar honom vara värd fyra marker; då skall han så böta; ingen äger sak därvid utom målsäganden.",
            "kommentar": "suþærman: tysk. ænskær: engelsman. Träls värdering fastställd till 3–4 marker.",
            "segmentId": "avg-b02-punkt05-seg003",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 5 §5-7"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 6 (Dråp på färsk gärning)",
        "balkId": "B02",
        "pdfSidor": [
          4
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "Dræpær maþær man varþær han siþen dræpin a fotum hanum liggi a værkum sinum. böti huarti konongi allær hæræþi",
            "tolkning": "Dräper en man en man och varder han sedan dräpt på hans fötter (på färsk gärning vid liket), då ligge han ogill på sina gärningar; ingen böte för honom, varken till konungen eller till häradet.",
            "kommentar": "a fotum hanum: på färsk gärning över liket. liggi a værkum sinum: omedelbart rättmätigt dråp i nödvärn som medför fullständig ansvarsfrihet.",
            "segmentId": "avg-b02-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 4, Af mandrapi Punkt 6"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 3–4, Af mandrapi Punkt 1–6",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 68–72",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 25–28",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/mandraps-balker-ii": {
    "titel": "Af mandrapi, del II",
    "underrubrik": "Äldre Västgötalagen, hemgång, ölstuga, okänd baneman och vådadöd (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra delen av dråpsbalken i Äldre Västgötalagen behandlar dråp av sinnessjuka män, nödvärnsdråp vid hemgång och överfall av lösvitingar, på bar gärning gripet äktenskapsbrott, vapenansvar och dråp i ölstuga, byamännens och häradets kollektiva ansvar vid dråp på allmänning samt strikt ägaransvar för vådadöd vållad av kvarnhjul, brunnar, jaktspjut och husdjur.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 7–8 (Galen man och dråp på tjuv)",
        "balkId": "B02",
        "pdfSidor": [
          5
        ],
        "kallpunkt": "7-8",
        "meningar": [
          {
            "fsv": "Dræpær galin man man löpær or bandum bötæ han aptær mæd niv markum",
            "tolkning": "Dräper en galen man en man och löper ur banden, böte hans ätt för honom med nio marker.",
            "kommentar": "galin man: sinnessjuk person. Ättens tillsynsansvar vid försummad bindning regleras med nedsatt bot (nio marker).",
            "segmentId": "avg-b02-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 7"
          },
          {
            "fsv": "Takær maþær alt sæman þiuf oc þiuft. hauir stolet til tvæggiæ oræ. ællær þrem örum. meræ. bindi handær a bak ok föri sva til þingss. lati tva mæn bæræ vittni a hændær hanum. at æn ær þiwær at þyft þeræ. ok uiti æptir mæþ tylptær eþe. lati siþæn dómæ. vgildæn han til vgs ok til hangæ. til torf ok til tyæru. vgildæn firi arvæ ok æptir mælændæ",
            "tolkning": "Tager man en tjuv samman med stöldgodset, och har han stulit till ett värde av två örar eller tre örar eller mera, binde man hans händer på ryggen och före honom så till tings; låte två män bära vittnesmål mot honom att han är skyldig till den stölden, och styrke det därefter med en tolftared. Låte sedan döma honom ogill till yxa och till galge, till torva och till tjära, ogill för arvingar och målsägande.",
            "kommentar": "alt sæman þiuf oc þiuft: tagen på bar gärning med godset. til vgs ok til hangæ, til torf ok til tyæru: arkaisk allittererande fyrfaldig dödsstraffsformel.",
            "segmentId": "avg-b02-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 8"
          },
          {
            "fsv": "Værþær maþær stolen fæér sins far eptir standær þiuvær mötæ gitær eighi sinu nait fyr æn han dræpær han. þa skal döþum sak giuæ döma vgildæn han a þingi",
            "tolkning": "Varder en man bestulen på sin boskap, sätter efter och möter tjuven, och kan icke återfå sitt förrän han dräper honom, då skall han giva den döde sak och låta döma honom ogill på tinget.",
            "kommentar": "Rättmätigt dråp vid förföljande av boskapstjuv som bjuder motstånd.",
            "segmentId": "avg-b02-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 8"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 9–11 (Hemgång, lösviting och dråp i säng)",
        "balkId": "B02",
        "pdfSidor": [
          5
        ],
        "kallpunkt": "9-11",
        "meningar": [
          {
            "fsv": "Far maþær hem at manni. væittar hanum hemsokn. dræpær han af sær a hyrnustokkæ sinum giui döþum sak dömi vgildæn han a þingi",
            "tolkning": "Far en man hem till en man och vållar honom hemsökelse, och dräper husbonden honom i nödvärn på sin hörnstock, give han den döde sak och låte döma honom ogill på tinget.",
            "kommentar": "hemsokn: grovt hemfridsbrott. hyrnustokkæ: husets grundknut/tröskel. Oinskränkt nödvärnsrätt i eget bo.",
            "segmentId": "avg-b02-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 9"
          },
          {
            "fsv": "Gærs maþær lösvittingær liggær a skoghum ok rænir. dræpær maþær man af sær. giui döþum sak dömi vgildæn han. a þingi",
            "tolkning": "Gör sig en man till lösviting, ligger i skogarna och rånar, och dräper en man honom till sitt fredande, give han den döde sak och låte döma honom ogill på tinget.",
            "kommentar": "lösvittingær: fredlös stråtrövare som vistas i skogen.",
            "segmentId": "avg-b02-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 10"
          },
          {
            "fsv": "Dræpær maþær man. i siangu hos kono sinni. ællær annarstad laglika maþ vittnum takin taki. bulstær oc blæiur. föri til þings lati sea blod ok bænð. giui döþum sak. ok uittni mæd tuanni tylftum. næmdar mans uittnum ok hærasshöfþingæ. ok læggi siþan vgildæn han a þingi",
            "tolkning": "Dräper en man en man i sängen hos sin hustru eller annorstädes lagligen gripen med vittnen, tage han bolstrar och lakan, före till tings och låte se blod och band; give han den döde sak och vittne med två tylfter, nämndemans vittne och häradshövdingens, och lägge sedan honom ogill på tinget.",
            "kommentar": "Dråp på bar gärning vid lägersmål med annans hustru. Beviskrav på förevisande av sängkläder inför tinget.",
            "segmentId": "avg-b02-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 11"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 12–13 (Vapenansvar och ölstuga)",
        "balkId": "B02",
        "pdfSidor": [
          5
        ],
        "kallpunkt": "12-13",
        "meningar": [
          {
            "fsv": "Haldær maþær a uakni. sinu löpær maþær a. far af banæ. böti firi niv markum. §.1. Fællir maþær træ a man far af bana böti firi niv markum. §.2. Skiutær man vp a lopt kombær niþ i. hovoþ manni far af. bana. böta firi niv markum",
            "tolkning": "Håller en man i sitt vapen och en man springer därpå och får bane därav, böte han nio marker. § 1. Fäller en man ett träd över en man så att han får bane därav, böte han nio marker. § 2. Skjuter en man upp mot taket och pilen kommer ned i huvudet på en man som får bane därav, böte han nio marker.",
            "kommentar": "Vållande och olycksdråp med vapen och fällande föremål; fast bot om nio marker.",
            "segmentId": "avg-b02-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 12"
          },
          {
            "fsv": "Dræpær. man man i. ölstuvu. þær skulu banæ fa ællær bötæ firi markum. niv. §.1. [Þ]ær æru. þry öl. ær iammykit. skal bötæ at. þral sunr þiængn. Æit ær brullöp annat giftæröl. þridiæ ær ærvitöl",
            "tolkning": "Dräper en man en man i en ölstuga, skola gästerna antingen utlämna banemannen eller böta nio marker. § 1. Där äro tre gästabud vid vilka boten är lika stor, vare sig för träls son eller fri thégn: ett är bröllop, det andra fästningsöl, det tredje är gravöl (arvöl).",
            "kommentar": "[Þ]ær æru: källans '?' återgivet som [Þ]. De tre gästabudens allmänna och klassöverskridande frid.",
            "segmentId": "avg-b02-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 13",
            "avvikelser": [
              "Källans frågetecken '?' transkriberat till [Þ] med textkritisk notering."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 14 (Dråp på allmänning och okänd gärningsman)",
        "balkId": "B02",
        "pdfSidor": [
          5
        ],
        "kallpunkt": "14",
        "meningar": [
          {
            "fsv": "Værþær maþær vtæn garzliþ. dræpin. þa skulu grænnæ bötæ firi.niv marchum. ællær banæ. fæ. þær skal bænæ til þings. föræ hanum griþær æftæ til þings ok fra. han skal viþ banorþi ganga æghi siþæn friþ dax ok nattær til skogs",
            "tolkning": "Varder en man dräpt utanför bygränsen, då skola grannarna böta nio marker eller skaffa fram banemannen; då skall banemannen föras till tings och givas lejd till tings och därifrån; han skall gå vid dråpsanklagelsen och äger sedan ingen fred, dag eller natt, utan skall till skogs.",
            "kommentar": "Byamännens kollektiva ansvar för dråp begånget på byns territorium.",
            "segmentId": "avg-b02-punkt14-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 14"
          },
          {
            "fsv": "§.1. Værþær maþær dræpin. þriggiæ by markum. kallær huar þærræ sik eig .i. mark. æghæ. þa skulu þer. værriæ sik mæþ. tvenni tylptum. Værþær en hvar full. þa skal þen aptær bötæ. Værþæ þær allir fulir. þa skulu þer allir aptær bötæ. niu markum. ællær ok banæn fa siþen skulu. þer allir marku mælli sin skiptæ. §.2. Værþær boræn a mark a byrd ma se bloð ok bænd hinnugh sum dræpit var. þa skal. þen böta sum. þa mark .a",
            "tolkning": "§ 1. Varder en man dräpt på tre byars allmänning och påstår var och en att dråpet icke skedde på dess mark, då skola de värja sig med två tylfter. Fälls en by vid eden, då skall den böta; fällas alla, då skola de alla gemensamt böta nio marker eller skaffa fram banemannen; sedan skola de skifta marken emellan sig. § 2. Varder ett lik buret in på en bys mark och man kan se blod och spår dit där dråpet skedde, då skall den böta på vars mark dråpet begicks.",
            "kommentar": "Gränsdragningstvister och brottsplatsundersökning med ledning av blodspår.",
            "segmentId": "avg-b02-punkt14-seg002",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 14 §1-2"
          },
          {
            "fsv": "§.3. Værþær maþær dræpin .a. aldra götæ marku vita mæn eigh banæ. til giui sak. þem. by þer næstæ. Vil han igh uiþ banorþæ gangæ. þa giui sak. þem by þær ær næst. han skal væriæ sik mæð. tvem tylptum sva skal ok hin. þriði sik væriæ. þa þer æru allir værdir. þa skal hæræþ bötæ. þét næst ær. ok þingæt sökær fang. þæt skal bötæ niv markum. ællær banæ fa",
            "tolkning": "§ 3. Varder en man dräpt på alla götars allmänning och vet man ingen baneman därtill, give man sak mot den by som ligger närmast; vill den byn icke kännas vid dråpet, give man sak mot nästa by, som skall värja sig med två tylfter; så skall ock den tredje värja sig. Då de alla hava värjt sig, då skall det härad böta som ligger närmast och dit tingsrätten söker fäste; det skall böta nio marker eller skaffa fram banemannen.",
            "kommentar": "aldra götæ marku: landskapets gemensamma allmänning. Successiv prövning från by till härad.",
            "segmentId": "avg-b02-punkt14-seg003",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 14 §3"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Af mandrapi Punkt 15 (Vådadöd och djuransvar)",
        "balkId": "B02",
        "pdfSidor": [
          5
        ],
        "kallpunkt": "15",
        "meningar": [
          {
            "fsv": "Faldær maþær vndir mylnohivl. fær. þær banæ af. böte þrim markum. þæn ær. mylnu .a. §.1. Faldér maþær i. brun. ællær diki. ællær af. fiskigarþi. far bana af bötæ firi þrim markum. þen ær .a",
            "tolkning": "Faller en man under kvarnhjul och får bane därav, böte den tre marker som äger kvarnen. § 1. Faller en man i en brunn eller ett dike eller från ett fiskeverk och får bane därav, böte tre marker den som äger anläggningen.",
            "kommentar": "Strikt ägaransvar vid farliga inrättningar; fast olycksbot om tre marker.",
            "segmentId": "avg-b02-punkt15-seg001",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 15"
          },
          {
            "fsv": "§.2. Gangær maþær a. biorn spiut. ællær ok ælgspiut. far bana af. böte fyri markum III. þæn ær .a. §.3. Resir maþær træ. vp. fælder niþar. far maþær banæ af. böti. firi. markum III. þæn up resti",
            "tolkning": "§ 2. Går en man på ett björnspjut eller älgspjut (gillrat jaktspjut) och får bane därav, böte för det tre marker den som äger det. § 3. Reser en man upp ett träd och fäller ned det, och får en man bane därav, böte för det tre marker den som reste upp det.",
            "kommentar": "Ansvar för gillrade jaktvapen och skogsavverkning.",
            "segmentId": "avg-b02-punkt15-seg002",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 15 §2-3"
          },
          {
            "fsv": "§.4. Stangær. þiur huggær runi. bitær. hundær far af. bænæ böte. firi III. markum",
            "tolkning": "§ 4. Stångar en tjur, hugger en galt eller biter en hund så att någon får bane därav, böte för det tre marker den som äger djuret.",
            "kommentar": "Stangær þiur huggær runi bitær hundær: allittererande och rytmisk lagformel för husdjursvållande.",
            "segmentId": "avg-b02-punkt15-seg003",
            "kallreferens": "AVG-MASKIN s. 5, Af mandrapi Punkt 15 §4"
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 5, Af mandrapi Punkt 7–15",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 72–76",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 28–32",
        "stod": "analys"
      }
    ]
  },
  "lagar/aldre-vastgotalagen/sara-balker": {
    "titel": "Af særæ malum",
    "underrubrik": "Äldre Västgötalagen, fulsår, lyten, lemlästning och bötestaxa (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Såramålsbalken (Af særæ malum) i Äldre Västgötalagen reglerar uppsåtliga kroppsskador, den formella processen för fulsår med tingslysning och sårabesiktning, skroksak (falsk anklagelse), skadeståndsrätt för inländska män, danskar, norrmän och utlänningar, samt en detaljerad graderad botstaxa för lemlästning av hand, enskilda fingrar, tår, näsa, ögon, hår, tänder och kastration med ett års prövotid för bestående men.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Af særæ malum Punkt 1 (Fulsår och tingslysning)",
        "balkId": "B03",
        "pdfSidor": [
          6
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Uærþær maþær a manni sar. þa skal sarum lysa a þingi þy fyrstæ. væt eigh hvat hældr æptir mælir quikum ællær döþom. ok a adru þingi. æn .a. þriðiæ æptir mælæ. ællær. ær mal hans spilt. þa skal han sar synæ.",
            "tolkning": "Varder en man sårad av en man, då skall man lysa såret på det första tinget — man vet icke om man fullföljer talan för en levande eller död — och likaså på det andra tinget; men på det tredje skall man fullfölja talan, eljest är hans sak förspilld. Då skall han visa upp såret.",
            "kommentar": "lysa a þingi: formell kungörelse av såret inför tingsmenigheten. quikum ællær döþom: man vet ännu inte om den sårade överlever eller avlider (vilket ändrar saken till dråp). sar synæ: okulärbesiktning av såret på tinget.",
            "segmentId": "avg-b03-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 1"
          },
          {
            "fsv": "þa skulu þingsmæn vittni vm bæræ. æn þét ær fulsæri. þorf viþ spik ok spiær. lin ok lækirsgæf. þa ær þæt. fulsæri. þa skal þem latæ. dömæ endaghæ ok vitæ .a. hændær hanum. mæd tvem tylptum. ok. þriðiæ þingsmannæ vittni. byþia sva sær gud hol ok vattum sinum at han ær sandær maþær hans ok sva gaf iak þar næmni til a þingi. þa skal þæn. ær farghaþi laghæ buþ firi sær hauæ. IX. markær a sægnærþingi. bötær fram bæræ. ok tækkiumæn kræfiæ. þa skal han sik frid lösæ dömæ bötæ. viþ hæræþ. IX. markær ok sva uiþ konong. Er han sændær at sak. þa skal hæræþ hanum vt. dömæ ællar skal han friþ fly.",
            "tolkning": "Då skola tingsmännen bära vittnesbörd om huruvida det är fulsår: kräver det fläsk och spjälor, linne och läkarlön, då är det fulsår. Då skall man låta döma en förfallodag för dem och fälla saken mot honom med två tolfter och som tredje tingsmännens vittnesmål. Han skall bedja så sig Gud huld och sina vittnen, att han är hans rätte sårman, 'och så gav jag där namn till på tinget'. Då skall den som sårade hava lagbud för sig: nio marker på stämningstinget, bära fram böterna och kräva borgesmän. Då skall han döma sig fri från fredlöshet och böta nio marker till häradet och likaså till konungen. Är han fälld till saken, då skall häradet döma honom fredlös, eller skall han fly för freden.",
            "kommentar": "fulsæri: allvarligt, livshotande sår med fyra lagfästa kriterier: spik (fläsk/fett till sårsalva), spiær (spjälor vid benbrott), lin (förband) och lækirsgæf (läkararvode). farghaþi: sårade, tillfogade kroppsskada. sægnærþingi: utsatt svarsting. tækkiumæn: borgesmän som går i borgen för böternas gäldande. vt dömæ: döma fredlös.",
            "segmentId": "avg-b03-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Af særæ malum Punkt 2–3 (Skroksak och landsomfattande sårabot)",
        "balkId": "B03",
        "pdfSidor": [
          6
        ],
        "kallpunkt": "2-3",
        "meningar": [
          {
            "fsv": "Værdær skroksak giuin saræ mal. þa skal a þingi. næmd gæræ. tryggiæ mannæ af fiarþungi þæs at sværiæ at han ær eigh sændær saræmaþær hans ok eigh var maþ væsviliæ. a vighualli.",
            "tolkning": "Varder falsk anklagelse given i såramål, då skall man på tinget tillsätta en nämnd av tre män från fjärdingen till att svära på att han icke är hans rätte sårman och icke var med illvilligt uppsåt på stridsplatsen.",
            "kommentar": "skroksak: diktad, grundlös anklagelse. fiarþungi: fjärding (administrativ fjärdedel av häradet). væsviliæ: ond vilja/illasinnat uppsåt. vighualli: stridsplatsen (av vig 'strid, vapenskifte').",
            "segmentId": "avg-b03-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 2"
          },
          {
            "fsv": "Innæn konongrikiss maþær iamgildær at sarum sum hærlænskær maþær. §.1. Danski ok norin æghu bötær a sarum sum hærlænskær maþær.",
            "tolkning": "Inländsk man från sveariket är jämngill i såramål med en härländsk västgöte. § 1. Dansk och norrman äga böter för sår såsom en härländsk man.",
            "kommentar": "Innæn konongrikiss maþær: undersåte i det svenska kungadömet utanför Västergötland. hærlænskær: infödd västgöte. Danski ok norin: danskar och norrmän ges samma rättsliga skydd vid sår som landskapets egna män.",
            "segmentId": "avg-b03-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Af særæ malum Punkt 4 (Lemlästning, fingrar, anlete och prövotid för lyte)",
        "balkId": "B03",
        "pdfSidor": [
          6
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "Huggar maþær hand af man. bötæ niv markær. firi sar. ok. III. markær firi læst. §.1. Huggær maþær þumulfingær. af manni bötæ. IX. markær firi sær ok tolf öræ. firi læst. Firi. þæn þær. nest. IX. markær firi sær ok sæx. öræ. firi læst. Firi længstæ fingær. IX. markær firi sar. ok half mark firi læst. Firi. þæn. þær. ær næst. IX. markær firi sær. ok tva. öræ firi læst. Firi litlæn fingær. IX. markær firi sær. ok. oræ firi læst.",
            "tolkning": "Hugger en man handen av en man, böte nio marker för såret och tre marker för lytet. § 1. Hugger en man tumfingret av en man, böte nio marker för såret och tolv örar för lytet; för det finger som är nästintill: nio marker för såret och sex örar för lytet; för det längsta fingret: nio marker för såret och en halv mark för lytet; för det som är näst därefter: nio marker för såret och två örar för lytet; för lillfingret: nio marker för såret och en öre för lytet.",
            "kommentar": "læst: bestående lyte eller men. Notera den matematiskt genomtänkta och hierarkiska botstaxan för handens fingrar: tumme (12 örar), pekfinger (6 örar), långfinger (en halv mark = 4 örar), ringfinger (2 örar) och lillfinger (1 öre).",
            "segmentId": "avg-b03-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 4"
          },
          {
            "fsv": "§.2. Huggér næsær af. manni. bötæ. þræa markær firi læst. ok. IX. markær firi sær. §.3. Huggær öghæ. vr höfþi. manni. bötæ. III. markær firi ögha. ok. IX. markær firi sær. §.4. Huggær maþær har. af manni bötæ. III. markær firi læst. ok. IX. markær firi sar. §.5. Lystær. tændær. vr hösþi. læstir mal. hans. bötæ. III. markær firi læst. ok. IX. markær firi sar. §.6. Gældir. man. IX. markær firi læst. ok. IX. firi. sar. §.7. Huggær. tær af. manni. sva skal firir tær. sum firi fingræ.",
            "tolkning": "§ 2. Hugger man näsan av en man, böte tre marker för lytet och nio marker för såret. § 3. Hugger man ögat ur huvudet på en man, böte tre marker för ögat och nio marker för såret. § 4. Hugger en man håret av en man, böte tre marker för lytet och nio marker för såret. § 5. Slår man tänderna ur huvudet och lyter hans tal, böte tre marker för lytet och nio marker för såret. § 6. Kastrerar man en man, gälde nio marker för lytet och nio för såret. § 7. Hugger man tårna av en man, skall det gälla för tår likasom för fingrar.",
            "kommentar": "hösþi: skrivarform/variant för höfþi (huvud). læstir mal: fördärvar talförmågan. Gældir man: snöper eller kastrerar (gör till gälling); medför dubbla maxböter: 9 marker för såret och 9 marker för lytet.",
            "segmentId": "avg-b03-punkt04-seg002",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 4"
          },
          {
            "fsv": "§.8. Læstir skulu til iamlangæ standæ. þa skal a sea æn læst ær ok læstær bot vt takæ. Slikt skal væþæ læst væræ sum uilia. læst.",
            "tolkning": "§ 8. Lyten skola stå till prövning i ett helt år; då skall man bese om lytet består och uttaga lytesboten. Sådant skall vådalyte vara som uppsåtligt lyte.",
            "kommentar": "iamlangæ: en tidsrymd av ett fullt år ('jämnt så lång tid'), under vilken kroppsskadan får läka innan lytet slutligt bedöms. væþæ læst: men vållat av våda (olyckshändelse).",
            "segmentId": "avg-b03-punkt04-seg003",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 4"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Af særæ malum Punkt 5–6 (Utländska köpmän, frigivna och trälar)",
        "balkId": "B03",
        "pdfSidor": [
          6
        ],
        "kallpunkt": "5-6",
        "meningar": [
          {
            "fsv": "Værþær suþær maþær ællær ænskær maþær sar. þeir. æghu. at botum örtogh min æn ælliw. oræ. ok konongær örtogh ok öra fem. ok sva frælsgui. bondæ hvar. gaf þær aþrum af sin ræt.",
            "tolkning": "Varder en sydman eller en engelsk man sårad, äga de i böter en örtug mindre än elva örar, och konungen en örtug och fem örar; och likaså en frigiven man. Varje bonde gav där den andre av sin rätt.",
            "kommentar": "suþær maþær: sydman (tysk). ænskær maþær: engelsman. örtogh min æn ælliw oræ: tio örar och två örtugar. frælsgui: frigiven träl (frigesgiven). Bestämmelsen belyser utländska gästers och frigivnas rättsliga ställning i förhållande till de friborna bönderna.",
            "segmentId": "avg-b03-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 5"
          },
          {
            "fsv": "[Þ]ræl. far sar. botæ maþær firi. mark. ækki æghu fleri mæn sak a. æn saksölæ.",
            "tolkning": "Får en träl sår, böte man en mark för honom; icke äga flera män sak däri än målsäganden.",
            "kommentar": "saksölæ: sakägaren, målsäganden (trälens herre som äger rätten till boten). [Þ]ræl: handskriftsutgåvan har initialt frågetecken för versalt Þ.",
            "avvikelser": [
              "Källans inledande frågetecken '?ræl' återges som '[Þ]ræl'."
            ],
            "segmentId": "avg-b03-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 6"
          },
          {
            "fsv": "§.1. Vétir fræsgiui sar ællær þrell. mans ætbornum manni þa skal han sökiæ til ugils. vil han hældær bötær takæ æn. værk a uinnæ. bötæ. hanum firi. markum. III.",
            "tolkning": "§ 1. Tillfogar en frigiven man eller en annans träl sår på en ättboren man, då skall han söka honom till ogill; vill han hellre taga böter än arbeta av skadan, böte för honom med tre marker.",
            "kommentar": "Vétir: vållar, tillfogar (presens av väta). ætbornum manni: fullmyndig fri odalman med ättens bördsrätt. til ugils: att dräpa eller straffa ogillt utan bötesplikt. værk a uinnæ: avtjäna skulden genom tvångsarbete.",
            "segmentId": "avg-b03-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 6, Af særæ malum Punkt 6"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/vada-sara-balker": {
    "titel": "Af vaþæ sarum",
    "underrubrik": "Äldre Västgötalagen, vådasår, läkekostnader, barn och djurskador (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Vådasåramålsbalken (Af vaþæ sarum) i Äldre Västgötalagen reglerar oavsiktliga kroppsskador som tillfogats genom olyckshändelse. Balken stadgar att vådarekvisitet kräver ömsesidigt samtycke av båda parter, fastställer full rättslig likställdhet mellan unga och gamla samt kvinnor och män, behandlar barns ansvarsfrihet från uppsåtligt brott, reglerar sjukpenning och läkekostnader vid skada på träl, samt fastställer ersättningsskyldighet och strikt ägaransvar för skador vållade av hundar och fänad.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Af vaþæ sarum Punkt 1 (Genomstingning, huvudsår och parternas enighet om våda)",
        "balkId": "B04",
        "pdfSidor": [
          6
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Uærþær maþær gönum læghær ællær særghæþæar gulfæ mælli at vaþa bötæ firi. III. markum þær sum .i. kum. ok. þrim. þer sum. vr. com. §.1. Værdær maþær huggin .i. houod. ma seiæ hinnu. kallæ baþi uaþa. bötæ firi markum. III.",
            "tolkning": "Varder en man stungen tvärs igenom eller sårad mellan golvplankorna av våda, böte tre marker där vapnet trängde in och tre marker där det trängde ut. § 1. Varder en man huggen i huvudet så att hjärnhinnan syns, och kalla båda det för våda, böte tre marker.",
            "kommentar": "gönum læghær: genomstungen av stickvapen (spjut eller svärd). gulfæ mælli: mellan golvtiljorna. ma seiæ hinnu: benbrott i skallen så att hjärnhinnan syns. kallæ baþi uaþa: båda parter måste vara överens om vådan, annars gäller uppsåtligt såramål.",
            "segmentId": "avg-b04-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 6, Af vaþæ sarum Punkt 1"
          },
          {
            "fsv": "§.2. Mötes æg ok læggær. bote firi tolf öræ. §.3. Læggær maþær gönom uaþuæ manss böte firi sæx. öræ. þær sum i kom. ok. VI. þær sum .v. com. §.4. Far maþær uaþæ sær ytyr hvarhhin. þæt æru. VI örær æn væþa sar. ær. Værþær eigh uaþæ sar. num baþir uili.",
            "tolkning": "§ 2. Mötas egg och skenben, böte tolv örar. § 3. Stöter man genom en mans muskel, böte sex örar där det trängde in och sex där det trängde ut. § 4. Får en man vådasår på ömse sidor, är boten sex örar om det är ett vådasår. Det varder icke vådasår med mindre än att båda vilja det.",
            "kommentar": "læggær: benpipa eller skenben. uaþuæ: muskel (fornisl. vöðvi). ytyr hvarhhin: på ömse sidor eller ömsesidigt. num baþir uili: central grundprincip: vådaregler kan endast tillämpas om kärande och svarande är eniga därom.",
            "segmentId": "avg-b04-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 6, Af vaþæ sarum Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Af vaþæ sarum Punkt 2 (Likställdhet i sårabot samt barns vållande)",
        "balkId": "B04",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "Slikt skal vngum bötæ firi uaþa sar sum gamblum. Slikt skal firi kono sar bötæ sum karmans. Slict skal kona bötæ sum takæ.",
            "tolkning": "Lika skall man böta för vådasår på unga som på gamla. Lika skall man böta för kvinnosår som för karlmans sår. Lika skall kvinna böta som taga emot böter.",
            "kommentar": "Principen om fullständig rättslig likställdhet vid vådasår oberoende av ålder och kön. Kvinnan tillerkänns samma sårabot som mannen och åläggs samma ersättningsplikt.",
            "segmentId": "avg-b04-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 2"
          },
          {
            "fsv": "§.1. Vætir barn barnni. sar. þæt ma eigh annæt. hetæ æn uaþi. þæt skal slicæ vaþæ. böt takæ sum tald ær. siax öræ. §.2. Dræpær barn. barn bötæ firi. IX. markum.",
            "tolkning": "§ 1. Vållar ett barn ett barn sår, må det icke heta annat än våda; det skall taga sådan vådabot som är uppräknad: sex örar. § 2. Dräper ett barn ett barn, böte för det med nio marker.",
            "kommentar": "Vætir: tillfogar, vållar (presens av väta). Barn under myndighetsålder tillerkänns rättslig ansvarslindring: handlingar mellan barn presumeras alltid sakna uppsåt och bedöms som våda.",
            "segmentId": "avg-b04-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Af vaþæ sarum Punkt 3 (Träls vådasår, sjukpenning, läkarlön och lyte)",
        "balkId": "B04",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "Þræl far væþæ sar ma eighi firi bonda byærghas liggær attæ daghæ. þa skal bötæ örtogh. liggær han sextan dagha. böte tvar örtoghær. liggær han fiura dagha ok tyughu. skal böte öræ. þy at han længær liggi. far ikki meræ firi þæt.",
            "tolkning": "Får en träl vådasår så att han icke kan arbeta för bonden och ligger sjuk i åtta dagar, då skall man böta en örtug; ligger han sexton dagar, böte två örtugar; ligger han tjugofyra dagar, skall böta en öre. Fastän han ligger längre, får han icke mera för det.",
            "kommentar": "ma eighi firi bonda byærghas: kan inte utföra dagsverken åt bonden. Sjukersättning utbetalas till trälens ägare per åttadagarsperiod med tak vid 24 dagar (en öre = tre örtugar).",
            "segmentId": "avg-b04-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 3"
          },
          {
            "fsv": "§.1. Lækis gæf. þa firi latæ. þæt æru. þrir örær ikki meræ. num han þoræ sværiæ mæd tylptær eþé at han gaf half mark. §.2. Mætæ skal þræls læstir sua myklu sum han ær. værri. sua myklu skal minna bötæ ok firi fralsgiuæ.",
            "tolkning": "§ 1. Läkarlön skall man gälda därför: det är tre örar och icke mera, såvida han icke vågar svära med tolftared på att han gav en halv mark. § 2. Man skall värdera trälens lyte efter hur mycket sämre han är vorden i arbetsförmåga; så mycket mindre skall man ock böta för frigiven man.",
            "kommentar": "Lækis gæf: läkararvode. num han þoræ sværiæ: verifiering med tolftared av faktiska läkarkostnader. Mætæ skal þræls læstir: lytet bedöms utilitaristiskt efter nedsatt arbetsförmåga och försäljningsvärde.",
            "segmentId": "avg-b04-punkt03-seg002",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Af vaþæ sarum Punkt 4–5 (Ättboren mans vådaskråma, jämned och djurskador)",
        "balkId": "B04",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "4-5",
        "meningar": [
          {
            "fsv": "Æn ætborin man fa vaþæ. skenu þarf hvarti uiþ spik ællær sper. þa a han iamnæþér eþ mæþ sættærgærþ. Sva se mær gud holl. oc vattum minum. at iak gaf þær slikæ sak sum. þu giuær nu mær. þa uildi iæc slikum rætti. vna sum nu föræ. iak. þær fram.",
            "tolkning": "Får en ättboren man en vådaskråma som varken behöver fläsk eller spjäla, då äger han jämned med sättargärd: 'Så vare mig Gud huld och mina vittnen, att om jag gav dig sådan sak som du nu giver mig, då ville jag nöja mig med sådan rätt som jag nu för fram för dig'.",
            "kommentar": "skenu: ytlig rispa eller skråma som ej utgör fulsår. iamnæþér eþ: jämned med reciprok rättviseprincip. sættærgærþ: privat förlikningsuppgörelse utanför det formella tinget.",
            "segmentId": "avg-b04-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 4"
          },
          {
            "fsv": "Sarghar hundær ællær annar fænæþer. þa skal bötæ öræ tva. firi sar ok öra þrea firi kiursgæf. num han þoré uitæ til half. mark mæþ tylptær eþe.",
            "tolkning": "Skadar en hund eller annan fänad någon, då skall ägaren böta två örar för såret och tre örar för läkedomskuren, såvida han icke törs styrka med tolftared att kuren kostade ända till en halv mark.",
            "kommentar": "kiursgæf: läkedomskur (av kura/kyra). Strikt principalansvar för husdjur och boskap: två örar i skadeersättning till den skadade jämte ersättning för faktisk läkekostnad.",
            "segmentId": "avg-b04-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Af vaþæ sarum Punkt 5"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/bardagha-balker": {
    "titel": "Bardaghæ",
    "underrubrik": "Äldre Västgötalagen, slagsmål, fridsbrott, kvinnofrid och giftmord (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Slagsmålsbalken (Bardaghæ) i Äldre Västgötalagen reglerar misshandel och överfall som icke medfört sår, formell tingslysning och sjunätting, fredlöshetsproceduren med fällande vittnesmål av två tolfter, graderade böter för utlänningar och trälar, omyndigas slagsmål, hustrumisshandel vid ölbänk och i kyrka, svarteslag, skydd mot vrång dråpsanklagelse, boskifte och skydd för hustruns lott vid ogäldad fred, dödsstraff för giftmord och trolldom med frist till skogs, samt den klassiska preskriptionstiden natt och år för sårfeber.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Bardaghæ Punkt 1 (Misshandel, tingslysning, sjunätting och fredlöshet)",
        "balkId": "B05",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Uærþær maþær barþær ok friþir a brutin. þa skal han saku latæ lysæ .i. garþ hans ok syunættingh latæ göræ at siundæ daghi. scal syunættingh haldæ sanna siunættings gyarþ mæd þem. an þer uilia. þa skal latæ bæræ asynæ uittni. at somi hans uar skærdær ok manhælghi hans brutit. Annær skal skærscutæ vittni uetæ. þa skal þing uisæ aldra götæ.",
            "tolkning": "Varder en man slagen och hans fred bruten, då skall han låta lysa saken på dennes gård och låta hålla sjunätting på sjunde dagen; han skall hålla sjunätting och sann sjunättingsgärd med dem om de vilja. Då skall han låta frambära synvittnesbörd om att hans ära blev kränkt och hans manhelgd bruten. En annan skall styrka vittnesbördet med faste-ed. Då skall man hänskjuta till alla götars ting.",
            "kommentar": "friþir a brutin: personlig fridskränkning. lysæ i garþ: formellt tillkännagivande på gärningsmannens gård. syunættingh: undersökningsmöte på sjunde dagen efter dådet. manhælghi: den personliga friden och okränkbarheten som fri man. þing uisæ aldra götæ: hänskjuta till landstinget.",
            "segmentId": "avg-b05-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 1"
          },
          {
            "fsv": "þa skal þem letæ endaghæ dömæ þingsmannæ uittni lætæ bæræ vittnæ a héndær hanum bardaghæ maþ tvenni tylptum. þa skulu hörængiær æptir gangæ tvænni tylptum. þa skal læghæ vnd firi sær. hauæ æn han vil friþ sin hægnæ. fiarðungs næmd æn han ær. lughin sakar.",
            "tolkning": "Då skall man för dem fastställa endag på tinget och låta tingsmännens vittnesmål fälla saken mot honom för slagsmål med två tolfter; då skola hans arvingar träda fram med två tolfter. Då skall han hava laga ursäkt för sig om han vill freda sin fred: en fjärdingsnämnd om han är falskeligen anklagad.",
            "kommentar": "tvenni tylptum: 24 edsmän som vittnar mot svaranden. hörængiær: arvingar eller nära släktingar som träder fram till stöd för saken. fiarðungs næmd: tolvmannanämnd från häradets fjärding för att avvärja falsk anklagelse (lughin sakar).",
            "segmentId": "avg-b05-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 1"
          },
          {
            "fsv": "§.1. Æn læghæ bötær vill biuþæ þæt æru atta örtoghær ok fæm mærkær. Örtogh min æn ælliw öræ. þa a. haræþ sva .a. konongær. A sægnær þingi. skal han laghæ buþ firi sær haua latæ þöma sik i. friþ æptir. §.2. Vill. han eigh bötær biuþa þa skal saksökæ latæ dömæ sic af þingi mæþ vmstaþu mannum. vitæ. þæs at han inti alt a endæghæ til friþær hans. þæt ær lagh sighiæ. latæ siþæn dömæ han fridlösæn af þingi.",
            "tolkning": "§ 1. Vill han bjuda laga böter, då äro de åtta örtugar och fem marker; en örtug mindre än elva örar äger häradet och likaså konungen. På sägnartinget skall han hava laga bud för sig och låta döma sig i fred därefter. § 2. Vill han icke bjuda böter, då skall målsäganden låta döma sig ut från tinget med kringstående tingsmän, och styrka att han fullgjort allt på endagen för hans fred som lagen säger; låte sedan döma honom fredlös från tinget.",
            "kommentar": "atta örtoghær ok fæm mærkær: lagstadgad bötesmängd för slagsmålsbrott. vmstaþu mannum: kringstående tingsmenighet som bevittnar fredlöshetsdomen.",
            "segmentId": "avg-b05-punkt01-seg003",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Bardaghæ Punkt 2–3 (Böter för utlänningar och trälar; omyndigas slagsmål)",
        "balkId": "B05",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "2-3",
        "meningar": [
          {
            "fsv": "Bær maþær ænskan man ællær sundirskæn bötæ firi saksökæ örtugh min æn. siu öræ. ok. IIII. örtoghor konongær. §.1. Slikæ samu æru frælsgiuæ bötær ok. siax örer. æru þrals æn barþær ær.",
            "tolkning": "Slår en man en engelsk man eller en sydlänning (tysk), böte till målsäganden en örtug mindre än sju örar, och fyra örtugar till konungen. § 1. Detsamma äro böterna för en frigiven man, och sex örar äro trälens böter om han varder slagen.",
            "kommentar": "sundirskæn: sunderländsk man (tysk). Boten för utländska köpmän och frigivna är sex örar och två örtugar till målsäganden samt fyra örtugar till konungen; för träl utgår sex örar till husbonden.",
            "segmentId": "avg-b05-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 2"
          },
          {
            "fsv": "Diungær maghændæ maþær ouormaghæ böte firi öræ. tvæ. Slikt skal ovormaghi bötæ sum takæ. §.1. Bæriæss. ovormagha tver. far annar værræ af bötæ firi öræ tuæ.",
            "tolkning": "Dänger en myndig man en omyndig, böte därför två örar. Lika skall omyndig böta som taga emot böter. § 1. Slåss två omyndiga och får den ene värre skada därav, böte två örar.",
            "kommentar": "Diungær: slår kraftigt, dänger. maghændæ maþær: fullmyndig man. ouormaghæ: omyndig person (barn eller person under förmyndarskap). Barns inbördes slagsmål regleras med schabloniserad bot om två örar vid ojämnt utfall.",
            "segmentId": "avg-b05-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Bardaghæ Punkt 4–5 (Kvinnofrid i äktenskapet samt svarteslag)",
        "balkId": "B05",
        "pdfSidor": [
          7
        ],
        "kallpunkt": "4-5",
        "meningar": [
          {
            "fsv": "Lystær bondæ kono sinæ. i. ölbénk. bötæ hænni. III. markær. lystær han hanæ i kiurkiu bötæ hænnæ. III. markær. liggi aptær til bos taki. or huat þem skil hælþér hughær ællær hæl.",
            "tolkning": "Slår en bonde sin hustru vid ölbänken, böte till henne tre marker; slår han henne i kyrkan, böte till henne tre marker. Böterna skola ligga kvar i boet; hon tager ut dem när de skiljas, antingen genom död eller skilsmässa.",
            "kommentar": "Hustrumisshandel på allmän plats (ölstuga/gästabud eller kyrka) bestraffas med tre marker som tillfaller hustrun personligen som säreget gods vid äktenskapets upplösning genom skilsmässa ('hughær') eller död ('hæl').",
            "segmentId": "avg-b05-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 4"
          },
          {
            "fsv": "Far maþær uaþæ hug. værþær huarti blat ællær bloþukt. þæt kallær suartæ slagh. a. eki. ræt .a.",
            "tolkning": "Får en man ett vådahugg som varken varder blått eller blodigt, det kallas svarteslag; det äger man ingen rätt till.",
            "kommentar": "suartæ slagh: ett slag som varken lämnar blånad eller blodsutgjutelse. Sådana bagatellskador åsamkade av våda ger ingen rätt till böter.",
            "segmentId": "avg-b05-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 7, Bardaghæ Punkt 5"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Bardaghæ Punkt 6–7 (Falsk dråpsanklagelse och boskifte vid ogäldad fred)",
        "balkId": "B05",
        "pdfSidor": [
          8
        ],
        "kallpunkt": "6-7",
        "meningar": [
          {
            "fsv": "Varþær manni vrang banæ sak giuin. þa skal hæræþshöfþingi væriæ han med tvenni tylptum. næmdær mannæ af hæræþi.",
            "tolkning": "Varder falsk dråpsanklagelse given mot en man, då skall häradshövdingen värja honom med två tolfter nämndemän från häradet.",
            "kommentar": "vrang banæ sak: oriktig eller illvillig anklagelse för dråp. Häradshövdingen utser en dubbel tolft (24 nämndemän) ur häradet för att rentvå den oskyldigt anklagade.",
            "segmentId": "avg-b05-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Bardaghæ Punkt 6"
          },
          {
            "fsv": "Ær friþær mans u böttær. þa skal boskipti kræfiæ ok skildir lucæ ængin meræ. æn til þrigiæ markæ. þa skal konæ takæ þridiungh sin. ok. III. markær at hindradax. gæf. þa arvi takæ þæt alt sum æptir ær. siþan skal þén lot æptir ær skiptæ .i. þry. takar en lot saksökæn. annæn konongær þriþiæ hæræþ.",
            "tolkning": "Är en mans fred ogäldad, då skall man kräva boskifte och skulder betalas, dock inga mera än upp till tre marker. Då skall hustrun taga sin tredjedel och tre marker i morgongåva; sedan tager arvingen allt det som är kvar. Därefter skall den lott som är kvar skiftas i tre delar: en lott tager målsäganden, den andra konungen, den tredje häradet.",
            "kommentar": "friþær mans u böttær: när en fredlös man inte har betalat sina fredslösensböter. Boskifte förrättas där hustruns giftorätt (en tredjedel) och morgongåva (hindradax gæf) skyddas före konfiskation till målsägande, kung och härad.",
            "segmentId": "avg-b05-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Bardaghæ Punkt 7"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Bardaghæ Punkt 8–9 (Giftmord och sårfeber inom natt och år)",
        "balkId": "B05",
        "pdfSidor": [
          8
        ],
        "kallpunkt": "8-9",
        "meningar": [
          {
            "fsv": "Kona firigær manni. fællir hana lukt hærasznæmd. þa skal hun haua griþ til skogs. dax ok nattær. þa skal latæ dömæ hanæ. vgill. firi arva. ok eptimælændæ ok dræpæ þær næst.",
            "tolkning": "Förgör en kvinna en man (med trolldom eller gift), och fäller en fulltalig häradsnämnd henne, då skall hon hava lejd till skogs i en dag och en natt; då skall man döma henne ogill för arvingar och målsägande, och dräpa henne därefter.",
            "kommentar": "firigær manni: förgör en man genom trolldom eller förgiftning. lukt hærasznæmd: sluten, enhällig häradsnämnd. griþ til skogs dax ok nattær: ett dygns frist att fly till skogs innan hon får dräpas ogillt.",
            "segmentId": "avg-b05-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Bardaghæ Punkt 8"
          },
          {
            "fsv": "Far maþær sarr liggær. i længi gangær i mælli. ok dör i þérri giuær arui sak þem ær sargæþi ok kallær han banæ væræ. þa skal han væriæ sik mæþ luctri hæræssnæmd æn han dör innan nath ok iamlangæ. gangær þær iuir. þa böti ængtæ falls han at sak bötæ manin aptær.",
            "tolkning": "Får en man sår, ligger sjuk länge, är uppe emellanåt och dör i sotesäng, och ger arvingen sak åt den som sårade honom och kallar honom baneman, då skall denne värja sig med sluten häradsnämnd om han dör inom natt och år; går det därutöver, böte intet, men fälls han till saken, böte för mannen.",
            "kommentar": "gangær i mælli: är uppe och går mellan sjukperioderna. dör i þérri: dör i sotesäng/feber. innan nath ok iamlangæ: den klassiska medeltida tidsfristen natt och år (ett år och en dag) för orsakssamband mellan våld och död.",
            "segmentId": "avg-b05-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Bardaghæ Punkt 9"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/orbota-mal": {
    "titel": "Orbotæ mal",
    "underrubrik": "Äldre Västgötalagen, nidingsverk, landsförräderi, kvinnofrid och fredlöshet (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Orbötesmålen (Orbotæ mal) i Äldre Västgötalagen upptar den fornsvenska rättens mest avskyvärda brott: nidingsverken. Dessa handlingar ansågs så djupt vanhedrande och samhällsomstörtande att de inte kunde sonas med mansbot, utan medförde ovillkorlig fredlöshet samt fullständig konfiskation av jord, landsvist och lösöre. Katalogen omfattar mord på fredade platser (kyrka och ting), brott mot svuren lejd, blodshämnd för tjuv, landsförräderi ('att bära sköld över tångbräckan'), lönnmord på sovande eller värnlösa i bad och bastu, grov lemlästning, absolut förbud mot kvinnofridsbrott, förrädiskt herremord, svek vid matbordet ('att sitta om kniv och köttstycke'), boskapsslakt i smyg ('gorvarg') och sjöröveri på ledungsskepp ('bunkabit').",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Orbotæ mal (Kyrkofrid, tingsfrid, lejd och landsförräderi)",
        "balkId": "B06",
        "pdfSidor": [
          8
        ],
        "kallpunkt": "intro-5",
        "meningar": [
          {
            "fsv": "Dræpær maþær man i kirkiu. þæt ær niþingsværk. orbötæ mal. §.1. Dræpær maþær man i þingi. þær ær niþingsvark. §.2. Gangær maþær a griþ a göræ sæt. hæmnir maþær þiufs. hæmnir maþær ræpsingær a þingi mæþ sarum ællær meþ drape allar mæþ brænnu. þæt ær niþingsværk firigiort landi ok lössum öræ.",
            "tolkning": "Dräper en man en man i kyrkan, det är nidingsverk och orbötesmål. § 1. Dräper en man en man på tinget, det är ett nidingsverk. § 2. Bryter man lejd och ingången förlikning; hämnas man en tjuv; hämnas man laga näpst ådömd på tinget med sår, med dråp eller med mordbrand, det är nidingsverk; då har man förverkat jord och lösöre.",
            "kommentar": "orbötæ mal: brott som icke kan sonas med böter utan medför fredlöshet och konfiskation. griþ a göræ sæt: svuren lejd och fastställt förlikningsavtal. hæmnir þiufs: hämnd för en lagligen avstraffad tjuv. firigiort landi ok lössum öræ: fullständig förlust av all fast egendom och lösegendom.",
            "segmentId": "avg-b06-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Orbotæ mal Inledning–§ 2"
          },
          {
            "fsv": "§.3. Hugger maþær baþær hændær af manni. Dræpær maþær souen man. þæt ær niþinsværk. §.4. [Þ]æt ær niþingsværk at bæræ sculd iuir þangbréccu hæriær a sit eigh land firir giort iord lansuist ok lösum örum. §.5. Bindær maþær man i skoghæ viþ træ. þæt ér niþingsværk.",
            "tolkning": "§ 3. Hugger man båda händerna av en man; dräper man en sovande man, det är nidingsverk. § 4. Det är nidingsverk att bära sköld över tångbräckan och härja sitt eget land; då har man förverkat jord, landsvist och lösöre. § 5. Binder man en man i skogen vid ett träd, det är ett nidingsverk.",
            "kommentar": "souen man: överfall på sovande räknas som fegt lönnmord. bæræ sculd iuir þangbréccu: landsförräderi genom att leda fientlig flotta/här över havsstranden (tångbräckan) mot det egna landskapet. lansuist: rätt att vistas i landet (landsförvisning). Bindær viþ træ: att lämna någon bunden till svält eller vilddjur i ödemarken.",
            "avvikelser": [
              "Källans inledande frågetecken '?æt' i § 4 återges som '[Þ]æt'."
            ],
            "segmentId": "avg-b06-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 8, Orbotæ mal § 3–§ 5"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Orbotæ mal (Lönnmord, lemlästning, kvinnofrid, husbonde, ölbänk, gorvarg och bunkabit)",
        "balkId": "B06",
        "pdfSidor": [
          8
        ],
        "kallpunkt": "6-10",
        "meningar": [
          {
            "fsv": "§.6. Skytær maþær in at lyuræ ok dræpær man. Dræpær .i. löghu. ællær i. bastughu. dræpær. þa han nöte þarwa sinæ. Stingir vt bæþin öghun. a manni. Skiær tungu ör höfþi manni. Hoggær af baþa fötær af manni. Dræpær maþær kono. þæt ær niþingsværk alt. hun .a. e friþ til mot ok til mæssu aldrigh æru sva mykil uigh i mællum mannæ.",
            "tolkning": "§ 6. Skjuter man in genom rökluckan och dräper en man; dräper i badet eller i bastun; dräper då någon förrättar sina naturbehov; sticker ut båda ögonen på en man; skär tungan ur huvudet på en man; hugger båda fötterna av en man; dräper man en kvinna, det är allt nidingsverk. Hon äger alltid fred till möte och till mässa; aldrig råder så stor fejd mellan män.",
            "kommentar": "lyuræ: ljuren, takgluggen/rökluckan i eldhuset. löghu... bastughu... nöte þarwa: lönnmord på värnlösa under bad eller toalettbesök. Dræpær kono: kvinnofriden är ovillkorlig och helig; kvinnor står utanför fejd och äger frid på väg till sockenmöte eller gudstjänst.",
            "segmentId": "avg-b06-punkt01-seg003",
            "kallreferens": "AVG-MASKIN s. 8, Orbotæ mal § 6"
          },
          {
            "fsv": "§.7. Dræpær maþær lönær droten sin. þæt ær niþingsværk. §.8. Dræpærmaþær man i ölbenk mæþ knivi. sitir vm knif ok kötsticki. mæþ hanum þæt ær niþingsværk. §.9. Huggær man bu mans niþær gærs at goruarghær. þæt ær niþingsværk. §.10. Lopær maþær a harskip ok gyærs bunkabitær. maþær standær a halsi ok a höfþi ok hæriær man. þæt ær niþingsværk.",
            "tolkning": "§ 7. Dräper man i lönndom sin herre, det är ett nidingsverk. § 8. Dräper man en man vid ölbänken med kniv medan man delar kniv och köttstycke med honom, det är ett nidingsverk. § 9. Hugger man ned en mans boskap och gör sig till gorvarg, det är ett nidingsverk. § 10. Löper man ombord på härskepp och gör sig till bunkabit; om man står i fören och i aktern och härjar man, det är ett nidingsverk.",
            "kommentar": "lönær droten sin: lönnligt herremord (allvarligt trohetsbrott). sitir vm knif ok kötsticki: brott mot bordsgemenskapen och gästabudsfriden. goruarghær: lönnlig slaktare av annans boskap (av gor 'inälvor' och varg 'dråpare'). harskip... bunkabitær: sjöröveri på krigsskepp (bunkabit = den som hugger eller biter i däckstofterna under plundringståg; standær a halsi ok a höfþi = agerar skeppshövding i för och akter vid härnadståg mot landsmän).",
            "segmentId": "avg-b06-punkt01-seg004",
            "kallreferens": "AVG-MASKIN s. 8, Orbotæ mal § 7–§ 10"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/arfda-balker": {
    "titel": "Ærfþa balkær, del I",
    "underrubrik": "Äldre Västgötalagen, arvsordning, kullar och Greklandsfararen (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Första delen av ärvdabalken i Äldre Västgötalagen fastställer arvsföljden enligt det strikta nordiska parentelsystemet, där barn och efterkommande utesluter sidoarvingar och fädernet skiljs från mödernet. Balken reglerar moderns och döttrars arvsrätt, fördelning mellan olika barnkullar, havande änkas rätt till gården och fostermors förmyndarskap, arvsdelning vid flera på varandra följande äktenskap, arvsrätt för mundgift dotter och frillobarn, inträde i kloster, förbud mot dödsdagsgåvor utan arvingens samtycke, dråpares förlust av arvsrätt, samt den berömda paragrafen om Rom- och Greklandsfararen.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 1–2 (Arvsföljden och moderns arv)",
        "balkId": "B07",
        "pdfSidor": [
          8
        ],
        "kallpunkt": "1-2",
        "meningar": [
          {
            "fsv": "Svn ær faþurs arvi. Ær eig svn. þa ær dottær. Ær eig dottær þa ær faþir. Ær eig faþir þa ær moþer. þa ær broþer. Ær eig broþér. þa er. systir. Ær eig systir. þa æru sunærbörn. Ær eig sunærbörn þa ær dottor börn. Ær eig dottor börn. þa æru broþor börn. Ær eig broþorbörn. þa æru systör börn. Ær eig. systor börn. þa ær faþurfaþir. Ær moþor moþær. ok faþur broþær. þa takar moþor moþer. ok faþur broþer gangær fra.",
            "tolkning": "Son är faders arvinge. Finns ej son, då är dotter arvinge. Finns ej dotter, då är fader. Finns ej fader, då är moder; därefter är broder. Finns ej broder, då är syster. Finns ej syster, då äro söners barn arvingar. Finns ej söners barn, då äro döttrars barn. Finns ej döttrars barn, då äro bröders barn. Finns ej bröders barn, då äro systrars barn. Finns ej systrars barn, då är farfader. Finnas mormoder och farbroder, då tager mormoder arv och farbroder viker undan.",
            "kommentar": "Den klassiska arvsordningen i Västgötalagen enligt parentelprincipen. Notera den successiva uppräkningen och hur kvinnliga linjer i rakt nedstigande led går före sidoarvingar.",
            "segmentId": "avg-b07-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Ærfþa balkær Punkt 1"
          },
          {
            "fsv": "Moþir takar syna arf. til enge sun dör. þa gange dotter til ok taki slit sum moþir af ærvi. §.1. Havir moþir tua collæ dör enge sun. af aþrum coll. þa skvlu dötær til gangæ. ær vm faþur æru maþ hanum. skiptæ viþ moþor sinæ ærvi. taki slickt huarin sum annur.",
            "tolkning": "Modern tager söners arv till dess ende sonen dör; då träde dotter till och tage sådan del som modern av arvet. § 1. Har en moder två kullar och dör en son av den andra kullen, då skola döttrar träda till som hava samma fader som han, och skifta arvet med modern; varenda en tage lika mycket som den andra.",
            "kommentar": "Moþir takar syna arf: moderns arvsrätt efter söner samt samverkan mellan moder och helsystrar vid halvsyskons död i olika kullar.",
            "segmentId": "avg-b07-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 8, Ærfþa balkær Punkt 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 3–4 (Morföräldrar, kullar och havande änka)",
        "balkId": "B07",
        "pdfSidor": [
          9
        ],
        "kallpunkt": "3-4",
        "meningar": [
          {
            "fsv": "Moþor faþir. ok faþur moþer. þer æru iamnærvi. Moþorbroþer ok faþur systir. þer æru iamnærve. Dottor sun ok svnædottir. þer æru iamnærvi. Systur sun ok broþor dottir. þer æru iamnærvi. §.1. Kollum skal ærvi skiptæ. sundær i tu. halft a fæþærni. ok halft a moþærni. æn baþir æru iamnskyldir.",
            "tolkning": "Morfar och farmor, de äro jämnarvingar. Morbror och faster, de äro jämnarvingar. Dotterson och sondotter, de äro jämnarvingar. Systerson och brorsdotter, de äro jämnarvingar. § 1. Mellan kullarna skall arv skiftas sönder i två delar, hälften på fädernet och hälften på mödernet, om båda äro lika nära skylda.",
            "kommentar": "Kollum skal ærvi skiptæ: klyvningsprincipen där arvet delas lika mellan fädernes- och mödernesidan vid jämbördiga släktskapsförhållanden.",
            "segmentId": "avg-b07-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 3"
          },
          {
            "fsv": "Sitær konæ i bo dör bonde kallæs havandæ. varæ. hon skal i bo sittia tyughu ukur. þa skal a seæ æn hun ær havande. þa skal bo skiptæ skal hun a bolæ sittiæ. til fardaghæ næstu. Ær bonde döþer firi fardagha. þa hun af faræ. havir hun sat. þa nyute þes far hun barn far cristændom. þa huir hun ærv hægnæt. §.1. Bondæ a sun kona ær maþ barni dighær þa skulu þer baþ i bo sittiæ.",
            "tolkning": "Sitter en kvinna i boet när bonden dör och sägs vara havande, skall hon sitta kvar i boet i tjugo veckor; då skall man se efter om hon är havande. Då skall boet skiftas, och hon skall sitta på gården till nästa fardag. Är bonden död före fardag, då skall hon fara därifrån; har hon sått, njute hon av det; får hon ett barn och det får kristning (dop), då har hon fredat arvet. § 1. Har bonden en son och kvinnan är havande, då skola de båda sitta kvar i boet.",
            "kommentar": "tyughu ukur: tjugo veckors väntetid för att fastställa havandeskap. far cristændom: om barnet föds levande och döps, ärver det fadern och modern ärver barnet om det därefter avlider.",
            "segmentId": "avg-b07-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 4"
          },
          {
            "fsv": "§.2. Kona giftiss bort fræ barnum sinum. eghu barn ambut ællær þræll. þa ma þem firi bo sætiæ. þa mughu fæþærnis frænþer skiptæ or barnæ lot. Faþur broþir barnæ mæli mælæ. ok fostræ skal firi bo sitiæ. Moþer skal raþæ arkær. lyklum ok lætæ skyldir takæ. ok skyldir lukæ. Ær moþorfaþir. til þa skal raþa ok eig faþur broþer. Ær faþurfaþir til þa skal han raþæ. ok eig modorfaþir. Eigh gitær moþor uidær bo skilt num folstra se til. firi at sættiæ. Moþir skal til faræ. þrysvar a iamlangæ bos at vittiæ. æn bryti firi sitir.",
            "tolkning": "§ 2. Gifter sig en kvinna bort från sina barn och äga barnen en trälinna eller träl, må man sätta dem att sköta boet; då må fädernefränderna skifta ut barnens lott. Farbrodern skall föra barnens talan och en fostrare skall sitta för boet. Modern skall råda över kistans nycklar och låta uppbära fordringar och betala skulder. Finns morfar, skall han råda och icke farbror; finns farfar, skall han råda och icke morfar. Modern kan icke skilja sig från boet utan att fostrare finnes att sätta däröver. Modern skall fara dit tre gånger om året för att bese boet om en förvaltare sitter däröver.",
            "kommentar": "Förmyndarskapsregler och tillsyn av omyndiga barns egendom vid moderns omgifte. Fostrarens och farbrödernas roller jämte mor- och farföräldrars företrädesrätt.",
            "segmentId": "avg-b07-punkt04-seg002",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 4"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 5–7 (Tre kullar, omgifte och mundgift dotter)",
        "balkId": "B07",
        "pdfSidor": [
          9
        ],
        "kallpunkt": "5-7",
        "meningar": [
          {
            "fsv": "Maþær far sær aþalkono gætær uiþ barn dör sv. fær aþra gætær viþ barn. far hina þriðiu. þör. bondé. þa en konæ er livændi. þa skal af takæ. hemfylgh sinæ alt þét ær vnöt ær. hun ællær hænær börn. þa skal hin ælsti koldær boskipti. kræfiæ. takær af þriþiung af bono. þa takar hin annær koldær sit mæþæri ok læggær aptær til skiptis siðæn takær han af sin þriþiung. hvat. þæt ær hældær konæ ællær hin yngsti. kolder. þa skal þæt aptær til lægiæ. takær siþan af sin þriþiung. þa skal af allum hindradaxgæf lucæ. Tax eig fæ til. þa skal slikt enum af uatæ. sum aþrum.",
            "tolkning": "Tager en man sig en äkta hustru och avlar barn med henne och dör hon; tager en annan och avlar barn; tager den tredje och dör bonden medan den hustrun lever: då skall hon eller hennes barn taga undan sin hemföljd, allt som är orört. Då skall den äldsta kullen kräva boskifte och taga en tredjedel av boet; då tager den andra kullen sitt möderne och lägger tillbaka till skifte och tager sedan sin tredjedel; vare sig det är hustrun eller den yngsta kullen, skall det läggas tillbaka och tages sedan dess tredjedel. Därefter skall morgongåva betalas åt alla. Förslår icke egendomen, skall avdrag göras lika för den ene som för den andre.",
            "kommentar": "Komplicerat boskifte mellan tre på varandra följande barnkullar efter samma fader med avräkning för möderne, hemföljd och hindradagsgåvor.",
            "segmentId": "avg-b07-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 5"
          },
          {
            "fsv": "Gyptis kona aþrum manni gyptis þridia sin. dör konæ a barn .i. hæskæp. þa skal þen yngsti. koldær arf takæ. lösæ öræ alla ok iord þa ær köpt .i. garþi. §.1. Gyptis konæ far eig börn .i. efstu giftu. þa giftis hun allum barnum sinum aptær til alfs.",
            "tolkning": "Gifter sig en kvinna med en andre man och gifter sig en tredje gång, och dör kvinnan och har barn i det sista giftet, då skall den yngsta kullen taga arv: alla lösören och den jord som är köpt till gården. § 1. Gifter sig en kvinna och får icke barn i det sista giftet, då gifter hon sig åter till hälften med alla sina barn.",
            "kommentar": "hæskæp: sista giftet (av efsta skep). Barn i det sista boet ärver förvärvad jord och lösören framför äldre kullar.",
            "segmentId": "avg-b07-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 6"
          },
          {
            "fsv": "En bonde gyptir dotur sinæ mæþ mund ok mæþ mælæ. skal vitæ mæþ tvænni tylptum. en þem skil .a. at hun var sva gyft. sum lægh sigiæ ok þy æghu. barn ærf at lægmæli.",
            "tolkning": "Gifter en bonde bort sin dotter med mund och med giftomålsmans talan, skall det styrkas med två tolfter om det blir tvist därom, att hon var så gift som lagen säger; och därför äga barnen arv efter lagens föreskrift.",
            "kommentar": "mæþ mund ok mæþ mælæ: lagligt äktenskap med brudköp/mundr och giftomannens formella samtycke.",
            "segmentId": "avg-b07-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 7"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 8–9 (Horbarn, frillobarn och klostergåva)",
        "balkId": "B07",
        "pdfSidor": [
          9
        ],
        "kallpunkt": "8-9",
        "meningar": [
          {
            "fsv": "Gangær mæþr fran kono sinni mungiptri i siang annarrar kono aflar barn. þæt ér horbarn. takær eig. at lægmæli fæþærni sit. §.1. Mæle þær frændær bondæ eptir han döþæn vid kono hans mundgypftæ at han atti eig barn. þættæ. þæn skal barn æghæ ær huærriæ nat liggær hoss. ok gyptær ær til mæþ lagmælum. §.2. Kona .a. slokifrillu son. ok annan aþalkono son. þer skulu baþir hænnær arf takæ. slikt hvar sum annar.",
            "tolkning": "Går en man från sin lagvigda hustru i en annan kvinnas säng och avlar barn, det är ett horbarn; det tager icke fädernearv efter lag. § 1. Påstår bondens fränder efter hans död gentemot hans lagvigda hustru att han icke var fader till detta barn, skall den äga barnet som ligger hos henne varje natt och är gift med henne enligt lag. § 2. Har en kvinna en son med en lönnfrilla och en son med äkta man, skola de båda taga hennes arv, den ene lika mycket som den andre.",
            "kommentar": "Pater est-regeln formuleras pregnant: den äkta maken presumeras vara fader till barnet ('þæn skal barn æghæ ær huærriæ nat liggær hoss'). Moderns alla barn ärver däremot hennes möderne oavsett börd.",
            "segmentId": "avg-b07-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 8"
          },
          {
            "fsv": "§.3. Lægz maþær viþ. kono giætær viþ barn. þæt ær aþalkono barn. æn han fæstir hana siþen ok far mæþ laghum. far han hana siþæn mæþ mund. ok mæþ mæli. gætær ok barn. þæt ær aþalkonobarn. skiutær þa kono af handum. sær. ma eig. bo hænni. mæþ guss rætti. stiæls siþæn ok aflær barn. þæt ær frillu barn. takær mæþærni. ok eig fæþærni.",
            "tolkning": "§ 3. Ligger en man hos en kvinna och avlar barn med henne, är det ett äkta barns rätt om han fäster henne därefter och gifter sig lagligen; får han henne därefter med mund och giftermålstal och avlar barn, är det äkta barn. Skjuter han sedan kvinnan ifrån sig och kan icke bo med henne enligt Guds rätt, men smyger sedan till henne och avlar barn, det är frillobarn; det tager möderne och icke fäderne.",
            "kommentar": "Legitimation genom efterföljande äktenskap samt barns status efter skilsmässa och otillåtna förbindelser.",
            "segmentId": "avg-b07-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 8"
          },
          {
            "fsv": "Giuær maþær sik i klostær. han skal fæ skiptæ viþ aruæ sinæ. taki han en lot. ok annan skal arvi taka. sva marghir. ærvær æru i sva margha lyti skal skiptæ. giuiss han mæþ sinum lot in. Dör han i klostré. þa ær kloster hans arui. §.1. Vill han or faræ firi iamlangadægh. þæt ær vald hans. Ær han ena nat ok iamlangæ. þa ma han eig or faræ. ok engsins mans arf takæ. ok. ikki skulu frændær hans værkum værþæ.",
            "tolkning": "Giver en man sig in i kloster, skall han skifta egendom med sina arvingar: han tage en lott och arvingen tager en lott; så många arvingarna äro, i så många lotter skall skiftas; han giver sig in med sin lott. Dör han i klostret, är klostret hans arvinge. § 1. Vill han träda ut före ett års tid, står det i hans makt; har han varit där ett år och en natt, må han icke träda ut, icke taga någon mans arv, och hans fränder skola icke ansvara för hans gärningar.",
            "kommentar": "Novitiatet och det civila dödsbegreppet vid klosterlöften. Efter natt och år inträder fullständig rättsverkan: munkens förmögenhet stannar i klostret och släktingarna befrias från allt ansvar för hans handlingar.",
            "segmentId": "avg-b07-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 9, Ærfþa balkær Punkt 9"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 10–12 (Dödsdagsgåva, arvsdråp och Greklandsfararen)",
        "balkId": "B07",
        "pdfSidor": [
          9,
          10
        ],
        "kallpunkt": "10-12",
        "meningar": [
          {
            "fsv": "A dözsdæghi ma ikki fra aruæ giuæ at laghmæli. num arvi. quædær sialvær ia viþr. sva sigiæ. lærþir mæn at eig ma ne uid kvæþæ mæþ gusz ræt.",
            "tolkning": "På sin dödsdag må man icke giva något bort från arvingen enligt lag, såvida icke arvingen själv svarar ja därtill; så säga de lärde männen (prästerna) att man icke må säga nej därtill enligt Guds rätt.",
            "kommentar": "Spänningen mellan landskapslagens skydd för ättens arvsrätt och den kanoniska rättens strävan att främja själagåvor och testamenten till kyrkan på dödsbädden.",
            "segmentId": "avg-b07-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 9–10, Ærfþa balkær Punkt 10"
          },
          {
            "fsv": "Dræpær maþær man wil hava arf hans. han skal iki arvi hans væræ. Sighir han at han drap han mæþ vaþæ værki. han skal væria sik mæþ luktri hæræsz namd. Varþær han varþær han skal arf takæ. Fals han at laghum þa skal annær þær arf takæ. þæn dræpæ ær skyldæstær.",
            "tolkning": "Dräper en man en man för att få hans arv, skall han icke vara hans arvinge. Säger han att han dräpte honom av våda, skall han värja sig med en sluten häradsnämnd. Värjer han sig, skall han taga arv; fälls han efter lag, skall den andre taga arv som är närmast skyld den dräpte.",
            "kommentar": "Arvslöshet på grund av brott: arvinge som uppsåtligen dräper arvlåtaren mister ovillkorligen all arvsrätt.",
            "segmentId": "avg-b07-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 11"
          },
          {
            "fsv": "Far maþær af landi sætær brytiæ firi bo. sighir at han skal. gangæ til roms. þa skal bryti bo varþa til iamlangæ. siþan skal arvi varþæ. ok iki bryti længær num arvi uili.",
            "tolkning": "Far en man ur landet, sätter en förvaltare för sitt bo och säger att han skall gå till Rom, då skall förvaltaren svara för boet under ett års tid; därefter skall arvingen svara för det och icke förvaltaren längre, om icke arvingen vill.",
            "kommentar": "Romresan: pilgrimsfärd till Rom med ett års förvaltaransvar innan arvingarna övertar boet.",
            "segmentId": "avg-b07-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 12"
          },
          {
            "fsv": "§.1. Far maþær af. landi. sytær huspreæ i bo. havir i knæ ok annat i kviþi. far cristindom vændir han hæl ok nakkæ at hemkynnum ok stighær fotum af fostær landi. þær skulu arvær væræ. er skyldasti. uaru hanum þa han heman for en han kombær eig aftær til hemkynnæ. §.2. Ingsinss manss arv takær hæn mæn i girklandi sitær.",
            "tolkning": "§ 1. Far en man ur landet medan hustrun sitter i boet, har ett barn i knä och ett annat i kvedet som får kristning (dop); vänder han häl och nacke åt hembygden och stiger med fötterna från fosterlandet, då skola de vara hans arvingar som voro honom närmast skylda då han for hemifrån, om han icke kommer tillbaka till hembygden. § 2. Ingen mans arv tager han medan han sitter i Grekland.",
            "kommentar": "Den berömda passusen om Greklandsfararen (väringen i Bysans). Den som lämnar fosterlandet förlorar rätten att uppbära arv hemma så länge han kvarstannar i Grekland, och hemmavarande hustru och barns rättigheter skyddas.",
            "segmentId": "avg-b07-punkt12-seg002",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 12"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/arfda-balker-ii": {
    "titel": "Ærfþa balkær, del II",
    "underrubrik": "Äldre Västgötalagen, samtidig död, makars bo, hemföljd och ättledning (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra delen av ärvdabalken i Äldre Västgötalagen reglerar arvsordningen vid samtidig död (kommorientskap) i sjukdom, husbrand och skeppsbrott, utländska köpmäns arv och danaarv, arvsförlust vid förgöring av styvbarn, makars gemensamma rätt till avkastning av arvegods och skogshästar, förvaltarens (brytens) redovisningsplikt och skydd mot tjuvsanklagelse, änkans lott och gäldsansvar, handelsresande och hemmavarande bröders likställdhet, kollationsplikt för hemföljd, inlösen av gäldbunden man, ättledning av frillobarn samt landbos och frigivnas arvsförhållanden.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 13–15 (Samtidig död, utlänningar och arvsförlust)",
        "balkId": "B07",
        "pdfSidor": [
          10
        ],
        "kallpunkt": "13-15",
        "meningar": [
          {
            "fsv": "Ligia mæn tver siuker baþir i eno husi. ær huar annars arvi. liuir annar sua længi æftir annan. at han viþ husli takar. þa ær han hans arvi. §.1. Dor maþær i by. annar i. aþrum by baþir a eno dögri. faræ mæn i mote sighir. hvar aþrum þöþæ þerræ hvarghi þerræ ær annærs arvi. §.2. Brannæ mæn tver inni. baþir sænþær hvarghi þerra ar annars arvi. §.3. Drukknæ tuer baþir a enu skipi. hvarghi þærra ær annars arve. §.4. Skilias mæn hemæ. far annar a skip allær til skgs. dör hin ær hemæ var ok þen findþær döþen ær heman for. ok vet eigh a hvat dögre ær han do. hvarghi þerræ ær annars arvi.",
            "tolkning": "Ligga två män sjuka båda i samma hus och är var och en den andres arvinge, och lever den ene så länge efter den andre att han mottager sista smörjelsen/nattvarden (husel), då är han dennes arvinge. § 1. Dör en man i en by och den andre i en annan by båda under samma dygn, och män fara emot varandra och kungöra deras död, är ingendera den andres arvinge. § 2. Brinna två män inne båda tillsammans, är ingendera den andres arvinge. § 3. Drunkna två båda på samma skepp, är ingendera den andres arvinge. § 4. Skiljas män åt hemma, och den ene far på skepp eller till skogs, och dör den som var hemma medan den som for hemifrån påträffas död och man vet icke under vilket dygn han dog, är ingendera den andres arvinge.",
            "kommentar": "Samtidig död (kommorientskap): detaljerade bevisregler vid sjukdom, brand, skeppsbrott eller skogsfärd för att avgöra om arvsrätt hunnit övergå mellan släktingar. Endast om den ene bevisligen överlevde till husels mottagande övergår arvet.",
            "segmentId": "avg-b07-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 13"
          },
          {
            "fsv": "Dör maþær anskær i landi ær eigh þæn skyldesti hos. þa skal harf hans standæ til iamlangæ. ær eigh þa arvi komen. þa skal konongær arf takæ biscupær æn prestær ær. §.1. Dör þydiskær maþær ær egh barn til. þa skal konongær arf takæ byskopær æn prestær ær. þæt kallær danæ arf. §.2. Dör maþær na egh arvæ hans. þa ér konongær. arvi hans",
            "tolkning": "Dör en engelsk man i landet och är den närmaste arvingen icke närvarande, skall hans arv stå orört under ett års tid; har arvingen icke kommit då, skall konungen taga arvet, men biskopen om han är präst. § 1. Dör en tysk man och har icke barn, skall konungen taga arvet, men biskopen om han är präst; det kallas danaarv. § 2. Dör en man och man icke finner hans arvingar, då är konungen hans arvinge.",
            "kommentar": "Utländska personers kvarlåtenskap i Västergötland med ett års frist för arvingar, samt danaarv (herrelöst gods) som tillfaller kronan eller kyrkan.",
            "segmentId": "avg-b07-punkt14-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 14"
          },
          {
            "fsv": "Sva ær an kona firiger stiupbarni sinu. vill sinum barnum arf vnnæ. væri sik mæþ hærærs næmd falz hvn þa hauir hvn firigiort sær ok friþi sinum. Vill egh sun hænnar latæ hanæ friþ flya. þa skal han frændum bötæ sum þer uiliæ ær eghu þem allær taki hanæ þær han fa.",
            "tolkning": "Likaså är om en kvinna förgör sitt styvbarn för att unna sina egna barn arvet: hon värje sig med häradsnämnd; fälls hon, då har hon förverkat liv och fred. Vill hennes son icke låta henne fly fredlös, skall han böta till fränderna såsom de vilja som äga talan, eller tage de henne varhelst de finna henne.",
            "kommentar": "Förgiftning eller mord på styvbarn i syfte att styra arvsföljden: medför livstids fredlöshet och fullständig arvsförlust.",
            "segmentId": "avg-b07-punkt15-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 15"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 16–18 (Makars bo, brytens redovisning och änkans lott)",
        "balkId": "B07",
        "pdfSidor": [
          10,
          11
        ],
        "kallpunkt": "16-18",
        "meningar": [
          {
            "fsv": "Siþan ær hion tu komæ saman takkær annat þerræ arf. förer. i bo læx til brytstokss. far iki giald firi þæt sum liuær a þæt svm arf tok. þæt sum af födis æghu þæt bæþi. §.1. Stoþ hors i skoghum gangæ all. þy fyl. sum af föþæs æghv þer baþi. §.2. Takær maþær bo at arvi. ma eigh brity firi væræ ællær drghiæ skulu . baþi hion avaxt aghæ. Zy biþær maþær sær kono þærræ ær til arff standér. þy gipftær bondæ þæm manni. dottor sinæ ær til arfs standær. at þer viliæ baþi afvæxt æghæ.",
            "tolkning": "Sedan två makar hava kommit samman och tager den ene av dem arv och för in i boet och lägger till brytstocken, får den överlevande icke ersättning från den som tog arvet; det som föds därav äga de båda. § 1. Hästflock som går i skogarna: de föl som födas därur äga de båda. § 2. Tager man bo i arv och må icke förvaltare eller dräng sitta därför, skola båda makarna äga avkastningen. Därför friar en man till en kvinna som står till arv, och därför gifter bonden bort sin dotter till en man som står till arv, emedan de båda vilja äga avkastningen.",
            "kommentar": "Gemensam giftorätt i boets avkastning (avaxt), föl och boskap under bestående äktenskap.",
            "segmentId": "avg-b07-punkt16-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 16"
          },
          {
            "fsv": "Farr bryti firi bo mans. han ær miskunnær maþær bonþæ þæs ær bo .a. riþær i ok rændær or. far iki vtan tylptær eþ. firi at han havir alt or bo. þæt ær han atti. §.1. Bonþe kallær han havæ lön bo bæggiæ þerræ ok bort skutit. þa skal uitæ firi mæþ tylptær eþi. at han havir alt fram laght. han mæ eigh. þiuvær at hetæ. þat ær handsalt fa.",
            "tolkning": "Står en förvaltare (bryte) för en mans bo, är han i bondens nåd vars bo det är; rider han dit och tömmer boet, får han intet därur utan tolftared på att han tagit allt ur boet vad han själv ägde. § 1. Påstår bonden att han i smyg förskingrat deras bådas bo, skall han värja sig med tolftared på att han lagt fram allt; han må icke heta tjuv för det som givits med handslag.",
            "kommentar": "Förvaltarens (brytens) redovisningsplikt vid avflyttning och skydd mot tjuvsanklagelse för handsöl.",
            "segmentId": "avg-b07-punkt17-seg001",
            "kallreferens": "AVG-MASKIN s. 10, Ærfþa balkær Punkt 17"
          },
          {
            "fsv": "Dör bondæ huspreæ livir. bo a iorþo hans dör firi fardaghæ. þa skal hun til sinna iorð faræ ok halft viþ landboæ. bö sit havæ. han a at vitæ til arffæstu ok eigh længær. Kona takær þriðiung .i. bo ok þrer mærkær af hans lot siþen tymber ok myllu reþe. þæt skal alt skiptæ sva sum bo. §.1. Skyldir skulu baþir lucæ. ok baþi kræfiæ slikt huart sum i. bo a hvat þær fyr görær. wrþu æn þer samæn komo allær siþæn vtæn mandrap eit. §.2. Saræ bötær ok bardagha bötær mutur ok vingævæ agho þer baþi lukæ ok sva takæ.",
            "tolkning": "Dör bonden medan hustrun lever och boet står på hans jord och dör han före fardag, då skall hon fara till sin egen jord och hava sitt bo till hälften med landbon; denne äger att bruka jorden till arvsfäste och icke längre. Hustrun tager en tredjedel i boet och tre marker ur hans lott; sedan timmer och kvarnredskap, allt det skall skiftas såsom boet. § 1. Skulder skola de båda betala och båda kräva in efter vad var och en äger i boet, antingen skulderna uppkommo innan de kommo samman eller därefter, förutom en mansdråpsbot. § 2. Såraböter, slagsmålsböter, mutor och vingåvor skola de båda betala och likaså taga emot.",
            "kommentar": "Änkans tredjedelsrätt i lösöret, tre marker ur mannens lott samt reglering av gemensamt betalningsansvar för gäld och skadestånd.",
            "segmentId": "avg-b07-punkt18-seg001",
            "kallreferens": "AVG-MASKIN s. 10–11, Ærfþa balkær Punkt 18"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 19–21 (Handelsbröder, stöld och hemföljd)",
        "balkId": "B07",
        "pdfSidor": [
          11
        ],
        "kallpunkt": "19-21",
        "meningar": [
          {
            "fsv": "Farr annær broþer köpfærþum ok annar hemæ i asku sitær baþir aghu þer iammykit af arvi. 20. Inlaght fæ værþær bort stolet. ok bondæ fæ mæþ. gialdi iki firi. skal uitæ mæd tylptær eþe. at hans fæ var mæþ stolet.",
            "tolkning": "Far den ene brodern på köpmansfärder medan den andre sitter hemma i askan (sköter hemgården), äga de båda lika mycket av arvet. Punkt 20. Varder deponerat gods bortstulet och bondens eget gods likaså, gälde han intet därför; han skall styrka med tolftared att hans eget gods blev stulet samtidigt.",
            "kommentar": "Arvsrättslig likställdhet mellan bröder oberoende av yrkesbana, samt ansvarsfrihet vid stöld av deponerat gods verifierad med tolftared.",
            "segmentId": "avg-b07-punkt19-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Ærfþa balkær Punkt 19–20"
          },
          {
            "fsv": "Havir faþir hemfylghz gört svni sinum falþer faþir fra. þa skal aptær til skiptis bæra viþ þæn sum vgiptær ær. hanum skal slikan samu lot af gæræ sum þæn hafþi þem til bos sum giptær ær. sva skulu dötær sum synir skiptæ æn þer æru arvær hauir af iorþv salt þan ær giptær ær. þæt skal i hans lot standæ þa ær skiptæ. §.1. Dör sun giptær af garþi. a eig barn ok aru þer skild at faþir ok moþer at bo sinu þa skal faþir. arf takæ. ok eig modér. Faþir skal iord latæ hem fylghia moþir ma iki iorþ giua fran rættum skæptarva. §.2. Dör sun. a barn æptir sik. ær hanum hem giuit a boli iorþ. þæt æghu barn vitu til ok eig til flerræ. ær eghi num et bol. þa far eigh vitu til þæs. Æru tvar. stuwur ok toptergarþær i malli. þa æru þæt tu bol. kallær til enkæ akærss. æller enka éng. þar a iki. uitu til num þæn uili ær han kallær þem giuæ. §.3. Skuldum skal skiptæ svm bo. Æ. þingi skal viþ halss örum takæ ok sva fram sækæ.",
            "tolkning": "Har en fader givit hemföljd åt sin son och faller fadern ifrån, då skall det bäras tillbaka till skifte gentemot den son som är ogift; åt denne skall göras en lika stor lott till boet som den gifte fick. Så skola döttrar skifta liksom söner om de äro arvingar. Har den som är gift sålt av jorden, skall det avräknas på hans lott när man skiftar. § 1. Dör en gift son borta från gården och har icke barn och äro fadern och modern skilda till sitt bo, då skall fadern taga arv och icke modern; fadern skall låta jord åtfölja hemföljden, men modern må icke giva jord bort från rätta skaftarvingen. § 2. Dör en son och efterlämnar barn, och har jord givits honom hemma på gården, äga barnen rätt därtill och icke till mera; finns endast en gård, få de icke rätt därtill; finnas två stugor och tomtgärdsgård däremellan, äro det två gårdar; gör han anspråk på en enskild åker eller enskild äng, äger han icke rätt därtill med mindre än att givaren vill det. § 3. Skulder skola skiftas såsom boet. På tinget skall man taga emot halsören och föra saken vidare.",
            "kommentar": "Kollationsplikt för hemföljd och förskott på arv, jorddelning på bol samt skaftarvingars företrädesrätt.",
            "segmentId": "avg-b07-punkt21-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Ærfþa balkær Punkt 21"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær Punkt 22–25 (Inlösen, ättledning, landbo och frigiven)",
        "balkId": "B07",
        "pdfSidor": [
          11
        ],
        "kallpunkt": "22-25",
        "meningar": [
          {
            "fsv": "Vill maþær man or annörghom stad lösæ. han skal siunætting firi. þan göræ ær han havir. handamælli. byuþæ þem tva öræ gullz. ællær tvar mærkær vægnær vittni til latæ bæræ a sivnættingi. at han ær. hanum sua skiuldær at an a at lösæ han mæd laghmæli ok uitæ mæþ tylptær eþi. Siþæn far eigh vart num han kalli barn sit væræ. Haldær han æptir sægnær þing. þa hætti viþ sinum. IX. markum.",
            "tolkning": "Vill man lösa en man ur annans gäldbundna våld, skall han utlysa sjunätting inför den som har honom i händerna, och bjuda honom två örar guld eller två marker vägda penningar; låte bära vittnesbörd på sjunättingen att han är honom så nära skyld att han äger lösa honom efter lag, och styrke det med tolftared. Sedan kan den andre icke hindra det såvida han icke påstår att det är hans eget barn; behåller han honom efter sägnartinget, sätter han nio marker på spel.",
            "kommentar": "Inlösen av skuldsatt man eller fånge ur annans hand (or annörghom stad lösæ) med guld eller vägt silver.",
            "segmentId": "avg-b07-punkt22-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Ærfþa balkær Punkt 22"
          },
          {
            "fsv": "Æt leþer maþær aþal kono barn allær viþgangit a þingi. þa takær. þæt arf hans ok eigh hin han ætleddhe. Er sun til ællær dottir. faþir ællær moþer. boþer ællær systir. þa far ækki þæn af arvi ær ætledde. Er ingin þerræ til þa skall þæn takæ ær ætledde.",
            "tolkning": "Ättleder man ett barn av en fri kvinna eller ett vidgånget barn på tinget, då tager barnet hans arv och icke den som ättledde det. Finnes son eller dotter, fader eller moder, broder eller syster, då får den som ättleddes intet av arvet; finnes ingen av dem, då skall den taga arv som ättleddes.",
            "kommentar": "Ättledning vid tinget av vidgånget frillobarn: subsidiär arvsrätt efter arvlåtarens bröstarvingar, föräldrar och helsyskon.",
            "segmentId": "avg-b07-punkt23-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Ærfþa balkær Punkt 23"
          },
          {
            "fsv": "Dör landboe firi fardaghæ. þa æru tver löter loll af bolæ hans. Dör kona hans. þa ær þriþiunger lös af bolæ hans. Er rughi sait a bole. þa skal þæn ær bol a gialda arwumn. iammarghar skæppur sum a ær sait. §.1. Dör lanærdroten þa skal lanboe kuar sitia til fæstæ hans ær int ællær arvæ lukæ hanum til gef. sinæ. 25. Dör frælsgiui kalla þer ær han æghu til tuæggiæ lotæ giptan væræ. þa skulu þer gialdæ kono hans mark. at hindradagx gief. æn þer þoræ vitæ han tvæggiæ lotæ giptan.",
            "tolkning": "Dör en landbo före fardag, äro två lotter lösta från hans gård; dör hans hustru, är en tredjedel löst från hans gård; är råg sådd på gården, skall den som äger gården gälda arvingarna lika många skäppor som såtts. § 1. Dör jordägaren (landdrotten), skall landbon sitta kvar till dess hans arrendeavtal har löpt ut eller arvingarna lösa honom för hans givna fästepenning. Punkt 25. Dör en frigiven man och påstå de som ägde honom att han var frigiven endast till två tredjedelar, då skola de gälda hans hustru en mark i morgongåva om de våga svära på att han var frigiven till två lotter.",
            "kommentar": "Landbos arvs- och avtalsrätt vid dödsfall före fardag, ersättning för sådd säd, besittningsskydd mot arvingar samt arvsrätt för frigiven man och hans hustru.",
            "segmentId": "avg-b07-punkt24-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Ærfþa balkær Punkt 24–25"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/giptar-balker": {
    "titel": "Giptar bolkær",
    "underrubrik": "Äldre Västgötalagen, fästning, giftorätt, morgongåva och bannlysta led (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Giftermålsbalken (Giptar bolkær) i Äldre Västgötalagen reglerar äktenskapets ingående och förmögenhetsrättsliga verkningar i det medeltida Västergötland. Balken spänner över kungligt frieri och pantgods, bondesonens formella fästningsstämma hos giftomannen med hemgift, vingåva och sängledning, dryga böter för brudrov och kvinnofridsbrott, frigivnas och trälars giftermål, anklagelse om otrohet och nämndened, fästning av änkor gentemot möar, lägersmålstaxor för olika samhällsklasser, kyrkliga släktskapshinder och skilsmässa, reserverade påvliga fall vid blodskam och parenticid med botfärd till Rom, samt bryggningstider vid Mårtensmässa, laga förfall vid bröllop och trolovningsbrott.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 1 (Konungens frieri och brudfärd)",
        "balkId": "B08",
        "pdfSidor": [
          11
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "1. Konongær vil sær kono biþia. Ær þæt vtæn konongrikiz. þa skal mæn sinæ latæ faræ. ok ærændi sit vrakæ ok fæst takæ. þa skal konongær brudfærþ gen gæræ. þa skal konongær gen fara ok giua tolf mærkær gulz allær tvæ byæ at væþium sætiæ.",
            "tolkning": "Vill konungen bedja sig en kvinna till äkta, och är det utom konungariket, då skall han låta sina män fara och sitt ärende uträtta och fästning taga. Då skall konungen göra brudfärd till mötes; då skall konungen fara till mötes och giva tolv marker guld eller sätta två byar till pant.",
            "kommentar": "biþia kono: formell anhållan om giftermål via sändebud. vtæn konongrikiz: utom riket, dvs. utländsk furstlig förbindelse. ærændi sit vrakæ: fullborda sitt uppdrag (fsv. vræka = driva, uträtta). fæst takæ: mottaga fästningslöftet av brudens giftoman. brudfærþ gen gæræ: rusta följe för att möta brudtåget. at væþium sætiæ: pantsätta egendom (två byar eller tolv marker guld) såsom säkerhet för morgongåva eller livgeding.",
            "segmentId": "avg-b08-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 11, Giptar bolker Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 2 (Bondesons frieri, fästning, vingåva och fästerån)",
        "balkId": "B08",
        "pdfSidor": [
          11,
          12
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. Bondæ son vil sær kono bydiæ. han skal hin skyldæstæ at hittæ. ok bön sinæ byriæ. han fæstnæþær stæmnu leggæ a hænni skal til fæ sighiæ næmnæ iord æn til ær. ok alt þæt giuæ vill. þrear markær skal lagha vingæf. uæræ. þaghar firi fæst ær skilt ok handum saman takit. þa ær tilgævær allær intær. æn vingævær eigh fyr æn þer komæ bæþi a en bulstær ok vndir ena bleo.",
            "tolkning": "Vill en bondeson bedja sig en kvinna till äkta, skall han uppsöka den närmaste giftomannen och framföra sin bön. Han skall utsätta fästningsstämma för henne; därtill skall han utfästa lösören, nämna jord om han äger sådan, och allt vad han vill giva. Tre marker skall laga vingåva vara. Så snart det är avtalat om fästningen och man tagit varandra i hand, då är hemgiften gällande i allo, men vingåvan dock icke förrän de kommit båda på samma bolster och under samma lakan.",
            "kommentar": "hin skyldæstæ: den närmaste fränden (fader eller broder) som innehar giftomannaskapet. fæstnæþær stæmnu: lagstadgad fästningsstämma med vittnen. til fæ sighiæ: tillförsäkra hemgift och lösören. handum saman takit: handsöl som juridiskt fullbordar trolovningsavtalet. vingæf: vingåva, mannens personliga gåva till bruden, bunden vid sängledningen (en bulstær ok vndir ena bleo: samma bolster och under samma lakan).",
            "segmentId": "avg-b08-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 11–12, Giptar bolker Punkt 2"
          },
          {
            "fsv": "§.1. Af fæstæ ruf a biscopær. III. markær.",
            "tolkning": "§ 1. För fästerån (bruten trolovning) äger biskopen tre marker.",
            "kommentar": "fæstæ ruf: fästerån, dvs. oberättigat brytande av ingånget fästningsavtal, vilket ansågs som ett kyrkorättsligt brott mot trohetseden och böttes till biskopen.",
            "segmentId": "avg-b08-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 2 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 3 (Bortförande av annans fästekvinna)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Værþær fæsti konæ manss takin .a. IX. markær þæn skyldastæ ok sva fæstimaþær. ok sva konongær ok sva ællir. mæn. boe hæne aldrigh. þer skulu friþær hans eghæ uald. kome aldrigh i friþ. fyr. æn þer uiliæ ær sak sökiæ.",
            "tolkning": "Varder en mans fästekvinna bortförd med våld, äger den närmaste giftomannen nio marker, och likaså fästmannen, och likaså konungen, och likaså alla män (häradet). Han må aldrig sammanbo med henne. De skola råda över hans fred; han komme aldrig i fred förrän de vilja det som söka saken.",
            "kommentar": "fæsti konæ takin: brudrov och kvinnofridsbrott mot trolovad kvinna. Gärningsmannen beläggs med fyrdubbla niomarksböter (sammanlagt 36 marker) fördelade på giftoman, fästman, konung och häradsmän, samt fullständig fredlöshet utan rätt att någonsin äkta kvinnan.",
            "segmentId": "avg-b08-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 4 (Frigiven mans giftermål, hindradagsgåva och huskvinna)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Far frælsgiui ættaþæ kono. þa ær mark uin gæf. ok mark hindradaxgæf. barn þerræ skolu ætboren væræ. §.1. hurn staþ hindradaxgæf. ær. þa ær þriþiungs. skipti a fæ þerræ ær eigh hindradax gæf givin. þa skal hvn up takæ. þriðiung ok. III. markær.",
            "tolkning": "Tager en frigiven man en friboren kvinna till äkta, då är vingåvan en mark och hindradagsgåvan en mark; deras barn skola vara ättburna. § 1. Oavsett vad hindradagsgåvan är, skiftas deras egendom i tredjedelar; är ingen hindradagsgåva given, då skall hon taga upp en tredjedel och därtill tre marker.",
            "kommentar": "frælsgiui: frigiven man (libertinus). ættaþæ kono: friboren kvinna av fri ätt. hindradaxgæf: morgongåva given på hindradagen (morgonen efter bröllopsnatten). hurn staþ: 'oavsett hurdan/hur stor än'. þriþiungs skipti: änkans lagstadgade tredjedel i boet.",
            "segmentId": "avg-b08-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 4–§1"
          },
          {
            "fsv": "§.2. Far frælsgiui. fostro. giffs eigh vin gæf ællær hindradax gæf. þa giptis. hun til hælfnings. §.3. Vill þræll fa huskono giui tva öræ til þem ær hana a. ækki kiæpsir i barnum.",
            "tolkning": "§ 2. Tager en frigiven man en fostra (halvfri kvinna) till äkta och gives varken vingåva eller hindradagsgåva, då giftes hon till hälften (hälftendelning i boet). § 3. Vill en träl taga en huskvinna (trälinna), give han två örar till den som äger henne; ingen köpeskilling utgår för barnen.",
            "kommentar": "fostro: fostrad kvinna i huset, av lägre stånd. til hælfnings: giftorätt till halva boet i stället för morgongåva. huskono: ofri kvinna/trälinna i hushållet. ækki kiæpsir i barnum: ingen särskild friköpsavgift för avkomman, som följer moderns ofria tillstånd hos husbonden.",
            "segmentId": "avg-b08-punkt04-seg002",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 4 §2–3"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 5 (Lägersmål med huskvinna och anklagelse om hustrus otrohet)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Giuær maþær manni sak. at han havir lighæt hos huskono hans. þa skal firi gangæ tilptær eþ. ællær bötæ. VI. öræ.",
            "tolkning": "Beskyller en man en annan för att hava legat hos hans huskvinna, då skall en tolftared gå därför, eller också böte han sex örar.",
            "kommentar": "huskono: trälkvinna/tjänarinna i huset. Husbonden företräder henne och uppbär skadestånd för fridskränkning i huset.",
            "segmentId": "avg-b08-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 5"
          },
          {
            "fsv": "§.1. Havir konæ hor giort ok givær bondæ kono sinni sak. þa væri sik. mæþ siv mannum af næmdinni. Værdær hun varþ böte hænni. III. markær. þem skal aptær til bos lagiæ. ægæ hun þem huat þem skil hæl ællær hughær. Verþer hun eigh varþ. þa skal hun gangæ fræ bo ok boslöt .i. hvarþax clæþum sinum.",
            "tolkning": "§ 1. Har en kvinna begått hor och anklagar bonden sin hustru för sådan sak, då värje hon sig med sju män ur nämnden. Varder hon friad, böte han tre marker till henne; dem skall han lägga tillbaka i boet, och hon skall äga dem vare sig de skiljas genom döden eller sämjan brister. Varder hon icke friad, då skall hon gå från bo och boslott i endast sina vardagskläder.",
            "kommentar": "hor: äktenskapsbrott. siv mannum af næmdinni: kvalificerad reningsed ur tingsnämnden. hæl ællær hughær: fornnordisk allitterationsformel; 'vare sig döden skiljer dem åt (hæl) eller sinnet/viljan (hughær)'. Verþer hun eigh varþ: fälls hon förlorar hon all giftorätt och morgongåva och utdrivs med blott sina vardagskläder.",
            "segmentId": "avg-b08-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 5 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 6 (Änkas fästning, mökränkning, lägersmål och trälkvinna)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Fæstir maþær ænkiu ok flytær hem ok lægs hos ok aslær hanni barn þar a ængin sak .a. Værþær. barn siþæn föt. öl ær giört. þæt ær aþalkono barn. þy hetir fingin fæst ænkia. §.1. Fæstir maþær mö. gær viþ lönþær læghær han ær. sakær at. sex markum uid faþur hænnær. §.2. Ligær maþær uid kono ok fæstir hana siþæn mælir vingæf þa ær læghær böt.",
            "tolkning": "Fäster en man en änka, flyttar hem till henne, lägrar henne och avlar barn med henne, då har ingen talerätt mot detta; varder barnet sedan fött och fästningsöl är gjort, är det ett äkta barns rätt, därför heter det 'fången fäst änka'. § 1. Fäster en man en mö och bedriver lönnligt lägersmål med henne före bröllopet, är han skyldig sex marker till hennes fader. § 2. Ligger en man hos en kvinna och fäster henne sedan och utfäster vingåva, då är lägersmålet sonat.",
            "kommentar": "fingin fæst ænkia: änkans rättsliga särställning där samlägret efter fästning ger barnet full äktenskaplig börd om ölet firas. lönþær læghær: hemligt samlag med trolovad mö före bröllopsölet, vilket kränker faderns giftomansmyndighet. mælir vingæf: utfäster vingåva och legaliserar förbindelsen.",
            "segmentId": "avg-b08-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 6–§2"
          },
          {
            "fsv": "§.3. Liggær viþ fralsæ fostro bötæ tolf öræ. firi ambut VI. öræ. firi ætborna kono. sex markær þen barn .a. vid ambut. han skal varþæ hanni. til þæs ær hun gitær kuærn draghit. ok ko molkæt. Dör hun af barni bötæ han. III. markær. §.4. En löpæ kono læghær skal. væria mæþ tilptar eþe. baþe ætbornær annöþogher.",
            "tolkning": "§ 3. Ligger man hos en fri fostra bötes tolv örar; för trälinna (ambut) sex örar; för en ättburen kvinna sex marker. Den som avlar barn med en trälinna skall sörja för henne till dess hon förmår draga handkvarn och mjölka ko. Dör hon i barnsäng, böte han tre marker. § 4. Lägersmål med löskvinna (löpukona) skall värjas med tolftared, vare sig hon är ättburen eller nödställd.",
            "kommentar": "ambut: trälinna (fsv. ambót). kuærn draghit ok ko molkæt: traditionellt rättsligt kriterium för återvunnen arbetsförmåga efter barnsbörd. Dör af barni: död i barnsäng medförde skadeståndsansvar gentemot husbonden. löpæ kono: löskvinna utan fast hushåll.",
            "segmentId": "avg-b08-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 6 §3–4"
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 7 (Släktskapshinder och skilsmässa på grund av kognation)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "7. Tals frænsim mællin hionæ tveggiæ. þa skal a þingi tæliæ. ok biscups lof til fa. at væriæ mæþ tvanni tylptum biþiæ sva sær guþ hull. ok vattum sinum at frændsim vkur ær sva skyuld sum nu havir. iak taltt. þa ma iak eigh boa hanni. at gusz rætti. Givær bondé sær sialvær sak. kallar sik sva skyldæ kono hava at sinni kono at han ma eigh bo hænni at gusz rætti. þa fulli þæt mæþ tvænni tylptum. værþær han fælþær þa skal han botæ hænni.",
            "tolkning": "Uppstår tal om förbjuden frändskap mellan två makar, då skall det uppräknas på tinget och biskopens lov inhämtas därtill, att värja sig med två tolfter och bedja så Gud vara sig huld och sina vittnen, att vår frändskap är så nära som jag nu har uppräknat, så att jag icke må sammanbo med henne efter Guds rätt. Beskyller bonden sig själv och påstår sig hava en kvinna så nära besläktad till hustru att han icke må sammanbo med henne efter Guds rätt, då fullgöre han det med två tolfter; fälles han i eden, då skall han böta till henne.",
            "kommentar": "frænsim: förbjuden släktskap enligt kanonisk rätt (impedimentum consanguinitatis). biscups lof: biskoplig jurisdiktion i äktenskapsmål. tvanni tylptum: 24 edsmän som bekräftar släktskapsträdet. Givær bondé sær sialvær sak: bonden försöker på egen hand få äktenskapet upplöst; misslyckas eden döms han till böter till hustrun för vanära och övergivande.",
            "segmentId": "avg-b08-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 7"
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 8 (Blodskam, incest och grova frändedråp – pilgrimsbot till Rom)",
        "balkId": "B08",
        "pdfSidor": [
          12
        ],
        "kallpunkt": "8",
        "meningar": [
          {
            "fsv": "8. Liggær maþær hos dottor sinni. þæt mal skal af landi bort skiptæ ok til roms. Egho faþghar tver ena kono. Egho bröþær tver ena kono. Eghv bröþvngær tvær enæ kono. Eghu systrungær tver ena kono. Egho moþghur tva en man. Egho systær tua en man. Egho systrungur ællær bröþvngor tvar en man. þæt ær firnærværk.",
            "tolkning": "Ligger en man hos sin dotter, skall det målet hänskjutas bort ur landet och till Rom. Hava far och son haft samma kvinna, hava två bröder haft samma kvinna, hava två kusiner på fädernet (brödrungar) haft samma kvinna, hava två kusiner på mödernet (systrungar) haft samma kvinna; hava mor och dotter haft samme man, hava två systrar haft samme man, hava två kusiner haft samme man: allt sådant är nidingsdåd (firnærværk).",
            "kommentar": "firnærværk: oerhörda försyndelser och incestuösa förbindelser i de kanoniskt förbjudna leden (afinitet och konsangvinitet). Dessa utgjorde reserverade påvliga fall (casus papales) som icke kunde försonas i hemlandet utan fordrade botgöringsresa till Rom.",
            "segmentId": "avg-b08-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 8"
          },
          {
            "fsv": "§.1. Myrþir kona barn sit. Dræpær svn faþur sin. Ellær faþir son sin. Allær broþir broþor sin. Ellær bröþrungær broþrung sin. Allær systrungi systrung sin. Allær faþur faþur sin. Allær moþer faþur sin. Allær svnarsun sin. Allær dottorsvn sin. Allær broþor son sin. Allær systur. svn sin. Allum slikum malum skal af landi skiptæ mæþ brevi til pavæns i rom þer skulu af pavanum bref takæ. ok aptær til byscups föræ latæ han sea huilkæ miskun þer fingu. biscuper skal þem bref fa firi tyundæ sin. §.2. Af allum firnaruærkum. a biskupær. þrer markær. [Þ]er sum skriptæ. brut gæræ. þer eghu biscupi. III. markær.",
            "tolkning": "§ 1. Mördar en kvinna sitt barn, dräper en son sin fader, eller en fader sin son, eller en broder sin broder, eller en brorson sin farbror, eller en systerson sin morbror, eller farfar, eller morfar, eller sonson, eller dotterson, eller brorson, eller systerson: i alla sådana mål skall saken hänskjutas ur landet med brev till påven i Rom; de skola mottaga brev från påven och föra tillbaka till biskopen och låta honom se vilken nåd de fingo; biskopen skall giva dem brev för deras tionde. § 2. Av alla nidingsdåd äger biskopen tre marker. De som begå skriftemålsbrott äro skyldiga biskopen tre marker.",
            "kommentar": "Parenticid och grova frändedråp krävde biskopligt rekommendationsbrev och pilgrimsfärd till påvestolen för absolution. skriptæ brut: försummelse av ålagd kyrkobot och skriftemål böttes till biskopen med tre marker. Textkritisk notis: Källan har '?er sum skriptæ.' på s. 12 rad 44; frågetecknet är här diplomatariskt återgivet som [Þ] enligt transkriptionsreglerna.",
            "segmentId": "avg-b08-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 12, Giptar bolker Punkt 8 §1–2",
            "avvikelser": [
              "Källtexten har '?er sum skriptæ.' på s. 12 rad 44; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Giptar bolkær Punkt 9 (Bröllopstider vid Mårtensmässa, laga förfall och trolovningsbrott)",
        "balkId": "B08",
        "pdfSidor": [
          13
        ],
        "kallpunkt": "9",
        "meningar": [
          {
            "fsv": "9. Svnnudaghin þæn ær næst ær æptir martens mæssu dagh. at qvældi þa æru mungæts tiþir lagh taknær. §.1. Hæptir bonde fæsti kono mansz þa skal bruþmæn til gæræ. a mungats tiþæ daghi. tva mæn til garsz. gæræ. griþær at beþæs. þa skal hvar þerræ aþrum grid sækæ. i gard ok or. þa skal klæþi miætæ ok siþæn firi gipt skiliæ. §.2. Sva ær firi gipt at skiliæ. þaghær þer kumæ baþi a en bulstær ok vnþir ena bleo. þa a hvn þridiungh i bo. ok. III. markær at hindradax gæf. af hans lot.",
            "tolkning": "Söndagen som är närmast efter Mårtensmässodagen på aftonen, då äro bryggningstiderna laga fastställda. § 1. Fäster en bonde en mans fästekvinna, skall han utse brudmän; på ölbryggningsdagen skall han sända två män till gården för att begära fred; då skall vardera parten söka fred hos den andre, i gården och utanför gården; då skall brudkläderna måttas och sedan upprättas villkoren för giftermålet. § 2. Så skola giftermålsvillkoren förstås: så snart de komma båda på samma bolster och under samma lakan, äger hon en tredjedel i boet och tre marker i hindradagsgåva ur hans lott.",
            "kommentar": "martens mæssu dagh: Mårtensmässodagen den 11 november. Hösten efter skörd och slakt var den sedvanliga tiden för ölbrygd (mungæt) och bröllopsfester. bruþmæn: brudgumssvenner/brudfölje. grid: formell fred under gästabudet. klæþi miætæ: brudklädernas måttning och tillskärning. en bulstær ok vnþir ena bleo: den rituella sängledningen som gav hustrun full giftorätt till en tredjedel i boet samt morgongåvan.",
            "segmentId": "avg-b08-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 13, Giptar bolker Punkt 9–§2"
          },
          {
            "fsv": "§.3. Svn han hanum sinæ fæstikono a þrim laghæ ölstæmpnum. þa ær han sakar at. IX. markum viþ saksokiæ. ok sua viþ konong ok sva viþ allæ mæn. §.4. Sva skal bonde byudæ fæstikono. at laghum at þrim ölstæmnum sva sum. beþæs §.5. þæt ær laghæ forfal manz ok kono at þer siuk æru ællær bruþ vaþir inni brænþær. þær ær forfal bæggiæ. þerræ æn þiufnæþær ællær bosran havir iuir gangit. Æn han latær þing. visæ. þa skal tva mæn a þingi. lata forfal bæræ. Vill. han eigh at þy litæ. þa skal a endaghæ mæþ. tylptær eþe. ok tuænni vittnum biþia sva sær guþ holl. ok vat sinni. at han fæk laghæ forfæll. ok þy ma iak eigh giptæ þær hanæ.",
            "tolkning": "§ 3. Förvägrar han honom hans fästekvinna vid tre laga ölstämmor, då böte han nio marker till målsäganden, och likaså till konungen och likaså till alla män. § 4. Så skall en bonde bjuda till sin fästekvinna enligt lag vid tre ölstämmor såsom det begäres. § 5. Detta är laga förfall för man och kvinna: att de äro sjuka eller att brudkläderna brunnit inne; där är förfall för dem båda om stöld eller hemgångsrån övergått dem. Men vill han hänskjuta till tinget, skall han låta två män vittna om förfallet på tinget. Vill han icke nöja sig därmed, skall han på endagen med en tolftared och två vittnen svära, och bedja Gud och sitt vittne vara sig huld, att han fick laga förfall och att 'därför förmår jag icke gifta henne till dig'.",
            "kommentar": "Svn han: förvägrar/tredskas han. ölstæmpnum: fastställda bröllopsdagar. Tre kallelser fordrades innan böter inträdde. laghæ forfal: godtagbara juridiska hinder (litis contestatio) såsom akut sjukdom, vådeld där brudkläderna brunnit upp (bruþ vaþir inni brænþær) eller rån och stöld. endaghæ: fastställd svarsdag på tinget med tolftared.",
            "segmentId": "avg-b08-punkt09-seg002",
            "kallreferens": "AVG-MASKIN s. 13, Giptar bolker Punkt 9 §3–5"
          },
          {
            "fsv": "§.6. Vill han væriæ firi hanum. þa skal firi gangæ mæþ tvænni tylptum biþiæ sva sær guþ holl ok uattum sinum. at frænsim þerræ ær sva skylþ at þer mughv eigh bo mæþ gusz rætti. ællær sifskapær. §.7. Kvæþær han ne viþ kallæss eigh fæst havæ þa skal han firi ganga mæþ tvannum tylptum. biþiæ sva sær guþ holl ok vattum sinum at han fæsti hana eigh sva sum lagh sighiæ i landi þæssu.",
            "tolkning": "§ 6. Vill han värja sig emot honom, skall han träda fram med två tolfter och bedja Gud och sina vittnen vara sig huld, att deras släktskap eller svågerskap är så nära att de icke förmå sammanbo efter Guds rätt. § 7. Svarar han nej och säger sig icke hava fäst henne, då skall han träda fram med två tolfter och svära, och bedja Gud och sina vittnen vara sig huld, att han icke fäste henne såsom lagen säger i detta land.",
            "kommentar": "tvænni tylptum: 24 edsmän för att bevisa släktskapshinder (frænsim) eller svågerskap (sifskapær) som upphäver trolovningen, alternativt förneka att giltig fästning alls ägt rum enligt landets lag.",
            "segmentId": "avg-b08-punkt09-seg003",
            "kallreferens": "AVG-MASKIN s. 13, Giptar bolker Punkt 9 §6–7"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/raetlosa-balker": {
    "titel": "Rætlosæ bolkær",
    "underrubrik": "Äldre Västgötalagen, kungaval, Eriksgata, biskopsval, ärekränkning och rättslösa ting (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Konstitutionell rätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Rättslösabalken (Rætlosæ bolkær) i Äldre Västgötalagen är ett av de mest berömda och centrala dokumenten i svensk stats- och rättshistoria. Balken inleds med det klassiska grundlagsstadgandet om svearnas rätt att välja och avsätta konung ('SVeær egho konong at taka ok sva vrækæ'), kungens eriksgata över Junabäck till Allra götars ting med utväxling av gisslan, kunglig trohetsed samt lagmannens dom. Därefter regleras biskopsvalet av landets bönder och investitur med stav och ring, lagmannens ämbete och tingsnämnd, stränga straff för bosran och husrån, en detaljerad katalog över okvädingsord och nid mot män och kvinnor (tidelag, sodomi, feghet, häxeri och fosterfördrivning), handrån, utmätning och grannkallelse vid gäld, fäskador och herdevittnesbörd, låneregler, rymda trälar, vårdplikt vid legodjur och deposition.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 1 (Konungavalet, Eriksgatan vid Junabäck, tingseden och konungadomen)",
        "balkId": "B09",
        "pdfSidor": [
          13
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "1. SVeær egho konong at taka ok sva vrækæ. han skal mæþ gislum ovan fara ok i. östrægötland. þa skal han sændi mæn hingæt til aldragöta þings. þa skal laghmaþær gislæ skiptæ. tua sunnan af landi. ok tua norþæn af lanþe. siþan skal aþra fiuræ mæn af landi gæræ med þem. þer skulu til iunæbækær. motæ faræ. Östgöta gisla skulu þingat fylgiæ ok vittni bæræ at han ær sva inlændær sum lægh þerræ. sigiæ. þa skal alþragötæ. þing i gen hanum næmnæ þa han til þings kombær þa skal han sic allum götom trolekæn sværiæ at han skal eigh ræt lægh a landi varu brytæ. þa skal lagmaþær han fyrst til konungs dömæ ok siþen aþrir. þer. ær han biþar.",
            "tolkning": "Svearna äga konung att taga och så vräka. Han skall med gisslan fara ovanifrån och in i Östergötland; då skall han sända män hit till allra götars ting. Då skall lagmannen utse gisslan: två söderifrån landet och två norrifrån landet; sedan skall man sända andra fyra män från landet med dem; de skola fara till Junabäck till mötes. Östgötarnas gisslan skola följa dit och bära vittnesbörd om att han är så intagen i landet som deras lagar säga. Då skall allra götars ting utlysas till möte med honom; när han kommer till tinget, då skall han svära alla götar trohetsed, att han icke skall bryta rätt lag i vårt land. Då skall lagmannen först döma honom till konung och sedan de andra som han beder.",
            "kommentar": "SVeær egho konong at taka ok sva vrækæ: fornsvensk konstitutionell grundformel; svearna hade företräde vid kungavalet vid Mora stenar, men valet krävde godkännande av landskapens ting. iunæbækær: Junabäck vid Jönköping, gränsflod mellan Östergötland och Småland/Västergötland där gisslan utväxlades under eriksgatan. aldragöta þing: Allra götars ting (landstinget vid Skara). trolekæn sværiæ: kungaeden att upprätthålla landskapets lagar. lagmaþær han fyrst til konungs dömæ: lagmannens formella hyllning och domsrätt å västgötarnas vägnar.",
            "segmentId": "avg-b09-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 13, Rætlosæ bolkær Punkt 1"
          },
          {
            "fsv": "§.1. Konungær skal þa þrim mannum friþ giuæ þem ær eig hava niþingsværk giort.",
            "tolkning": "§ 1. Konungen skall då giva fred åt tre män, sådana som icke hava gjort nidingsverk.",
            "kommentar": "friþ giuæ: kunglig benådningsrätt (kungslejd) vid tronbestigningen, undantaget för nidingsdåd (niþingsværk).",
            "segmentId": "avg-b09-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 13, Rætlosæ bolkær Punkt 1 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 2 (Biskopsval och investitur)",
        "balkId": "B09",
        "pdfSidor": [
          13
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. En biscup skal taka. þa skal konungær allandæ at spyriæ huarn þer uiliæ hava han skal bonþæ svn væræ. þa skal konongær hanum staf i hand sæliæ ok gullfingini siþan skal han i kirkiu leþæ. ok i biskups stol sættiæ. þa ær fulkomen til valdær vten uixlt.",
            "tolkning": "Skall man taga en biskop, då skall konungen spörja alla landsmän vem de vilja hava; han skall vara en bondeson. Då skall konungen överlämna stafven i hans hand och guldringen; sedan skall man leda honom i kyrkan och sätta honom i biskopsstolen. Då är han fullkomlig i sin makt och myndighet även utan vigning.",
            "kommentar": "bonþæ svn væræ: stadgande om att biskopen måste vara friboren infödd man (bondeson) av västgötsk ätt. staf ok gullfingini: investitur med biskopsstav och ring genom kungen å menighetens vägnar. fulkomen til valdær vten uixlt: världsligt tillträde till biskopsstol och gods före kanonisk vigning (vixlt).",
            "segmentId": "avg-b09-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 13, Rætlosæ bolkær Punkt 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 3 (Lagmansval, tingsnämnd och Allra götars ting)",
        "balkId": "B09",
        "pdfSidor": [
          13
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Bondæ sun skal lagmaþer væræ. þy skulu allir bonder ualdæ mæþ gusz miskvn. §.1. konongær skal næmd firi sik sætiæ ok lagmaþer a þingi. §.2. þæt hetir. e aldragötæ þing ær laghmaþer ær .a. þær ma folk. ætleþæ. ok sættum lysæ.",
            "tolkning": "En bondeson skall vara lagman, därför skola alla bönder välja honom med Guds misskund. § 1. Konungen skall sätta nämnd för sig och lagmannen på tinget. § 2. Det heter alltid allra götars ting där lagmannen är närvarande; där må man ättleda folk och lysa förlikningar.",
            "kommentar": "Bondæ sun skal lagmaþer væræ: lagmannens demokratiska och folkliga förankring bland landskapets bönder. næmd firi sik sætiæ: tingsnämndens inrättande vid kungligt tingsbesök. e aldragötæ þing ær laghmaþer ær .a.: lagmannens personliga närvaro konstituerar landstinget, där officiella rättshandlingar såsom ättledning (ætleþæ) och formella förlikningar (sættum lysæ) äger rum.",
            "segmentId": "avg-b09-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 13, Rætlosæ bolkær Punkt 3–§2"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 4 (Bosran och husrån)",
        "balkId": "B09",
        "pdfSidor": [
          13
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Takær maþær bo mansz vp at vsældu. þæt ær þrénni. IX. marka sak. a. IX. markær saksöki ok giald firi. bo. sit mæþ suornom eþe. IX. markær konongær ok. IX. markær allir. mæn. §.1. Huggær maþær hus vp manss at vsoktu. þæt ær. þrenni IX. markær. a. IX. markær saksökæ. ok sva konongær ok sva allir mæn.",
            "tolkning": "Plundrar en man en mans bo utan laga dom (utan att det är förverkat), det är en tre gånger nio markers sak: nio marker äger målsäganden jämte ersättning för sitt bo med edgång; nio marker äger konungen och nio marker alla män (häradet). § 1. Hugger man upp en mans hus utan laga rannsakning, det är tre gånger nio marker: nio marker äger målsäganden, och likaså konungen och likaså alla män.",
            "kommentar": "at vsældu: utan laga dom eller laga förverkande (fsv. osælt = icke förverkat). Takær bo vp: bosran, egenmäktig plundring av gård och bohag. Huggær hus vp at vsoktu: våldsamt upphuggande av annans hus utan föregående laga sak. Båda brotten straffas med tredubbla niomarksböter (27 marker).",
            "segmentId": "avg-b09-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 13, Rætlosæ bolkær Punkt 4–§1"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 5 (Okvädingsord, nid och ärekränkning)",
        "balkId": "B09",
        "pdfSidor": [
          13,
          14
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Kallær maþær man bykkiuhuælp har ær. þæt sighir. han þu koþ hæn. Iak skyrskutæ þy at þu kallæþe mik vkuæþins orþ. þæt ær sextanörtoghæ sak i hvan lot. han skal hanum þing uisæ at skyrskutæ vittni latæ bæræ at endagha ok vitæ mæþ tylptær eþe. biþi sva sær guþ holl. ok vattum sinum at þu kallaþe mik. vkuæþins orþ. ok þu æst sandær at sak þerri. ær iak giuar þær Sva skal vkuæþins orþ sökiæ ok firnær orþ. §.1. Kallær maþær annæn frælsgivæ. þæn ætboren ær ællær sigir iak. sa at þu rant en firi enom ok hafþi spyut a baki. þæt ær vkuaþins orþ. þrænni sextanortoghæ sak. §.2. Iak sa at maþær sarþ þik hvar ær þæt. þu koþ han. Iak skyrskutæ þy at þu kallæþe mik vkvaþins orþ. ok firnær orþ. þæt ær sexstanortoghæ sak. i hvan þriþiung.",
            "tolkning": "Kallar en man en annan för 'hyndvalp': 'Hör här!', säger denne, 'du ljuger!' — 'Jag skärskjuter till vittne att du kallade mig med okvädingsord.' Det är en sak om sexton örtugar till vardera lotten. Han skall stämma honom till tinget och låta skärskjutningsvittnen framträda på endagen och styrka saken med en tolftared; han skall bedja så Gud och sina vittnen vara sig huld att 'du kallade mig med okvädingsord och du är skyldig till den sak jag lägger dig till last'. Så skola okvädingsord och nidord sökas. § 1. Kallar man en annan för frigiven träl som är ättburen, eller säger: 'Jag såg att du flydde en för en och bar spjutet på ryggen', det är okvädingsord och en sak om tre gånger sexton örtugar. § 2. 'Jag såg att en man lägrade (sodomerade) dig', 'Var är det?', 'Du ljuger!', 'Jag skärskjuter till vittne att du kallade mig med okvädingsord och nidord.' Det är en sak om sexton örtugar till vardera tredjedelen.",
            "kommentar": "bykkiuhuælp: hyndvalp (hundvalp), starkt nedsättande ärekränkning. skyrskutæ: skärskjuta till vittne (åberopa kringstående vittnen på stället). rant en firi enom ok hafþi spyut a baki: grov feghetsanklagelse i strid. sarþ þik: anklagelse om passiv homosexuell underkastelse, det grövsta nidet i germansk och fornnordisk rätt (fornvästnordiska argr/ergi).",
            "segmentId": "avg-b09-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 13–14, Rætlosæ bolkær Punkt 5–§2"
          },
          {
            "fsv": "§.3. Iak sa at þu atti þin viliæ. viþ ko. ællar mæræ. þæt ær firnær orþ. þrannisaxtanörtogæ sak. þæt skal sökia a hændær hanum. kumbær eigh ne viþ. §.4. Iac sa at þv atti moþor þina. þæt ær firnær orþ. ok þrennisextanortoghæ sak ok kombær eigh ne viþ.",
            "tolkning": "§ 3. 'Jag såg att du hade din vilja med en ko eller ett sto', det är nidord (firnær orþ) och en sak om tre gånger sexton örtugar; det skall sökas mot honom om han icke nekar därtill. § 4. 'Jag såg att du lägrade din moder', det är nidord och tre gånger sexton örtugars sak om han icke nekar därtill.",
            "kommentar": "firnær orþ: oerhörda nidord som anklagade motparten för dödssynder och nidingsdåd, såsom tidelag (atti viliæ viþ ko ællar mæræ) och incest med modern (atti moþor þina).",
            "segmentId": "avg-b09-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 5 §3–4"
          },
          {
            "fsv": "§.5. [Þ]ættæ aru vkvæþins orþ kono. Iak sa at þu reet a quiggrindu lösharæþ. ok i trols ham þa alt var iamrist nat ok daghér. kallær hanæ kunna firigæræ kono ællær. ko. þæt ær. vkuaþins ord. kallær kono hortutu. þæt ær vkuaþins ord. kallar kono haua at faþur sin ællær strukit hava barn sit fra sær allær hava myrt sit barn. þættæ æru firnær orþ. §.6. All þassi synda mal skal fyrst uiþ præst sin talæ ok eigh braþæ vp mæþ awnd ællær vrez uiliæ num han sæki sik at þrim markum. hete þrer ok æru tuar.",
            "tolkning": "§ 5. Detta äro okvädingsord mot en kvinna: 'Jag såg att du red på fägårdsgrinden med utslaget hår och i trollhamn då det var dagjämning mellan natt och dag'; kallar man henne förmögen att förgöra kvinna eller ko, det är okvädingsord; kallar man en kvinna för 'hortuta' (sköka), det är okvädingsord; påstår man en kvinna hava lägrat sin fader, eller hava fördrivit sitt foster (strukit barn sitt från sig) eller hava mördat sitt barn, detta äro nidord. § 6. Alla dessa syndamål skall man först tala om med sin präst och icke hasta upp i avund eller vrede, såvida han icke vill utsätta sig för tre markers böter; må det heta tre men vara två.",
            "kommentar": "reet a quiggrindu lösharæþ: klassisk fornnordisk föreställning om häxridt (trollhamn på fägårdsgrind vid dagjämning). hortutu: fsv. hortuta (hora/sköka). strukit hava barn: avsiktlig fosterfördrivning. All þassi synda mal skal fyrst uiþ præst sin talæ: kyrkorättslig prövning hos sockenprästen innan formell tingsanklagelse fick resas för att förhindra falsk ryktesspridning. Textkritisk notis: Källan har '?ættæ aru vkvæþins orþ' på s. 14 rad 7; frågetecknet återgivet som [Þ] enligt transkriptionsreglerna.",
            "segmentId": "avg-b09-punkt05-seg003",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 5 §5–6",
            "avvikelser": [
              "Källtexten har '?ættæ aru vkvæþins orþ' på s. 14 rad 7; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 6 (Handrån)",
        "balkId": "B09",
        "pdfSidor": [
          14
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Rænir maþær man handran. þa skal han væriæ. sik mæþ tolf manna eþe ok tvæggiæ mannæ vittnum. af þem tolf ok siþan i tylft standæ. Falz han at böte þræni sæxtanortoghær.",
            "tolkning": "Rånar en man en annan med handrån (rycker gods ur hans hand), då skall han värja sig med tolvmannaed och två mäns vittnesbörd ur de tolv och sedan stå i tolften. Fälles han därtill, böte han tre gånger sexton örtugar.",
            "kommentar": "handran: rån ur någons hand med våld på öppen plats. Värjemålsed med tolv man varav två fungerar som edgärdsmän/vittnen.",
            "segmentId": "avg-b09-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 6"
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 7 (Skuldkrävande och panttagning)",
        "balkId": "B09",
        "pdfSidor": [
          14
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "7. En maþær krævær man skuld þa skal han a grænnæ hans kallæ latæ þem uid væræ ok höræ at han kræuær han skuld. þa mæ han næmæ han siþæn æn han vill. A han skyld at kræfiæ. þa ma han sökiæ han til sum lægh sighiæ. ok éþ sin a ouan æn þem skil vm at han a hanum eig meræ at gialdæ. Kuæþær hin ne viþ kallær sik eig. æghæ hanum. skyld at gialdæ. þa skal han suæriæ mæþ tolf mannum at han a eig hanum skyld at gialdæ ællær gæf at lönæ. Bær han þryt viþ böte þrænni saxtanörtoghær ok skyldþinæ. §.1. Naam skal lösæ mæþ skuld mæþ tylptær eþe.",
            "tolkning": "Kräver en man en annan på skuld, då skall han tillkalla dennes grannar och låta dem vara närvarande och höra att han kräver honom på skulden; sedan må han taga pant (näma) hos honom om han vill. Har han skuld att kräva, må han söka honom såsom lagen säger och lägga sin ed därtill om de tvista om huruvida han icke har mer att gälda honom. Svarar den andre nej och påstår sig icke vara honom skyldig att gälda, då skall han svära med tolv män att han icke är skyldig att gälda eller återgälda gåva. Bryter han detta, böte han tre gånger sexton örtugar och gälde därtill skulden. § 1. Nam (tagen pant) skall lösas med gäldande av skulden jämte tolftared.",
            "kommentar": "a grænnæ kallæ: grannars närvaro som legalt vittneskrav vid formell utmätning och betalningsanmaning. næmæ: nam, egenmäktig men lagreglerad panttagning hos gäldenären. gæf at lönæ: vedergällning för mottagen gåva i ett sedvanerättsligt gåvoutbytessystem.",
            "segmentId": "avg-b09-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 7–§1"
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 8 (Skadegörelse på boskap och fäfälling)",
        "balkId": "B09",
        "pdfSidor": [
          14
        ],
        "kallpunkt": "8",
        "meningar": [
          {
            "fsv": "8. Dræpær maþær hors ællær nöt firi manni. vetir feær fölengh. þæ skal han siunætting firi hanum giæræ latæ ok synær. vittni a hændær latæ baræ biþi sva sær guþ holl at iak sa at þu drapt fæ hans ok vete hanum fearfölængh. Syþan skal han firi tylpt gangæ. biþiæ sva sær guþ holl. ok vatt sinni. at þv uete mær fearfölingh ok þv drapt fæ mit. ok þu æst sandær at sak þerre. siþæn skal han aptær gialdæ. mæþ. svornom eþe. ok .a. ovan þrænni saxtanörtoghær. Er eig a synar vittni. til væri sik mæþ tolf mannum. Æn þær fæ ær dræpit. ær tueggiæ öræ ær vært. ællær tvem örum. bættræ. þæt ær full fearföling. Æn þæt ær værræ æn tver örær. þa skal þæt tvægildi. atær gialdæ sua huart. sum vært ær.",
            "tolkning": "Dräper en man häst eller nötboskap för en man och vållar fäfälling, då skall han låta hålla sjunätting för honom och låta frambära synvittnesbörd mot honom; vittnet bedje så Gud vara sig huld att 'jag såg att du dräpte hans fä och vållade honom fäfälling'. Sedan skall han träda fram med en tolftared och bedja så Gud och sitt vittne vara sig huld, att 'du vållade mig fäfälling och du dräpte mitt fä och du är skyldig till denna sak'. Sedan skall han gälda fäet tillbaka med svuren ed och därtill böta tre gånger sexton örtugar. Finns ej synvittne därtill, värje han sig med tolv män. Är det dräpta fäet värt två örar eller mer än två örar, då är det full fäfälling; men är det värt mindre än två örar, då skall det gäldas åter med tvådubbla värdet alltefter vad det är värt.",
            "kommentar": "feær fölengh: fäfälling, avsiktligt dödande eller lemlästande av annans boskap. synær vittni: ögonvittnesbörd som bekräftas vid sjunätting. full fearföling: kvalificerad skadegörelse vid djurvärde överstigande två örar.",
            "segmentId": "avg-b09-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 8"
          },
          {
            "fsv": "§.1. Værþær dræpit hors ællær nöt a byar marku. annærs byær. vet eig hvar drap. þa skal han siunætting giaræ firi enum þerra ok haldæ firi allum. ok vittni latæ bæræ a sivnættingi. at þæt fik þær fiorlæsting. a marku þerræ af handæuarkum. mannæ ok þy æghu. þer þæt. mæþ laghum aptar bötæ.",
            "tolkning": "§ 1. Varder häst eller nöt dräpt på en annan bys mark och man icke vet vem som dräpte det, då skall han hålla sjunätting för en av byamännen och det gälle mot dem alla, och låta frambära vittnesbörd på sjunättingen om att det fick fäskada där på deras mark genom människohand; och därför äro de skyldiga att böta det åter enligt lag.",
            "kommentar": "a byar marku: kollektivt ansvar för byamännen vid dråp på annans kreatur på byns utmark då gärningsmannen är okänd.",
            "segmentId": "avg-b09-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 8 §1"
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 9 (Djurskador, fall i brunn och hästskada)",
        "balkId": "B09",
        "pdfSidor": [
          14
        ],
        "kallpunkt": "9",
        "meningar": [
          {
            "fsv": "9. Dræpær fæ annat ok bær hirþinge vittni. gialdi helt firi mæþ svornum eþe ok taki han þæt dræpnæ ællær nyti hold ok hvþ taki halsgildi. þæt ær atti af þem sum drap. I þæssu male ær hirþingi fulþer vittnismaþær hvæt hældær. han ær fræls allær þræl. Syns hanum giald þa skal siunattings. til giaræ. lætæ bæræ asynær uittni. þa skal ræþæ wætti ok kræfiæ bokær syns hanum rætmæli. þa skal skyrskutæ. Biþi sva sær gud holl. at fæ þit drap mit fæ. mæþ synær uittni. ok sva gaf iak þær sak til. Far han eigh sokn fræmt mæþ laghæ uittnum. þa skal þæn ær sak ær givin. væriæ. sik mæþ tolf mannum. biþiæ sær sva guþ hol. at eigh drap mit fæ. þit fæ. ok iak eigh sanddær at þæ sak. þv giuær mæ.",
            "tolkning": "Dräper ett fä ett annat och herden bär vittnesbörd därom, gälde ägaren fullt värde med svuren ed och tage det dräpta djuret eller tillgodogöre sig kött och hud; tage halsgille, det är en åttondedel av värdet på det djur som dräpte. I detta mål är herden ett fullgiltigt vittne vare sig han är fri man eller träl. Vägrar han betalning, skall man hålla sjunätting och frambära synvittnesbörd; då skall man framlägga vittnesbördet och kräva böter; synes saken laglig, skall man skärskjuta till vittne och bedja så Gud vara sig huld att 'ditt fä dräpte mitt fä'. Vinner han icke framgång med laga vittnen, då skall svaranden värja sig med tolv män och bedja så Gud vara sig huld att 'icke dräpte mitt fä ditt fä och jag är icke skyldig till den sak du lägger mig till last'.",
            "kommentar": "hirþingi fulþer vittnismaþær: herdens unika rättsställning såsom fullgiltigt vittne oberoende av fri eller ofri börd. halsgildi: ersättning motsvarande en åttondedel av det dräpande djurets värde. Syns hanum giald: vägras skadeersättning utlyses sjunätting.",
            "segmentId": "avg-b09-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 9"
          },
          {
            "fsv": "§.1. Faldær. fæ .i. mans handæværki. i brun all diki. ællær. annur þylik værk ok far þær banæ af. þa skal bötæ. VI. öræ firi hæst. half mark. firi oxæ ok sua firi ko. ok hors. Sva skal þæt sökiæ ok væriæ. sua sum fæ havi fæ dræpit. §.2. Flögher fæ i gærþi sva at ængin æltir far banæ af liggi vgilt. Æn flögher or gærþi gialdi hin aptær. gærþ .a. Æltir nokor or gærþi fa þær banæ af. ær til asynæ vittni gialde þæn sum a ælti sva sum mælt ær æn i diki laghi döt. samæleþ sokiæ ok væriæ. §.3. Æn maþær læstir hæst. ællær halataghl ok stingær vt öghæ gialdi öræ. ællær væri sic mæþ tylptær eþe.",
            "tolkning": "§ 1. Faller fä i en mans grävda verk, i en brunn eller ett dike eller andra dylika anläggningar och får sin bane därav, då skall han böta sex örar för en häst, en halv mark för en oxe och likaså för en ko och ett sto. Så skall det sökas och värjas liksom om fä hade dräpt fä. § 2. Springer fä in i en hägnad utan att någon jagar det och får sin bane därav, ligge det ogillt; men springer det ut ur hägnaden och skadas, gälde hägnadens ägare ersättning. Jagar någon ut djuret ur hägnaden och det omkommer därigenom och finns synvittne därtill, gälde den som jagade det på samma sätt som om det låge dött i ett dike; sökas och värjas på samma sätt. § 3. Skadar man en häst, antingen dess svanstagel (skär av svansen) eller sticker ut dess öga, gälde en örtug eller värje sig med tolftared.",
            "kommentar": "mans handæværki: anläggningsansvar för brunnar och diken. flögher i gærþi: olyckor vid hägnader och gärdesgårdar. liggi vgilt: förlusten bärs utan skadestånd om djuret självmant språng in. halataghl ok stingær vt öghæ: illvillig stympning av häst belagd med böter eller tolftared.",
            "segmentId": "avg-b09-punkt09-seg002",
            "kallreferens": "AVG-MASKIN s. 14, Rætlosæ bolkær Punkt 9 §1–3"
          }
        ]
      },
      {
        "rubrik": "Sektion 10",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 10 (Låneregeln)",
        "balkId": "B09",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "10",
        "meningar": [
          {
            "fsv": "10. All lan skulu hel hem flyties þem sum læþi firi vtæn al genmæli.",
            "tolkning": "Alla lån skola återbäras oskadade hem till den som lånade ut, utan varje genmäle.",
            "kommentar": "All lan skulu hel hem flyties: klassisk fornsvensk obligationsrättslig maxim om låntagarens strikta återlämningsplikt i oskadat skick.",
            "segmentId": "avg-b09-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Rætlosæ bolkær Punkt 10"
          }
        ]
      },
      {
        "rubrik": "Sektion 11",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 11 (Rymda och lånade trälar)",
        "balkId": "B09",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "11",
        "meningar": [
          {
            "fsv": "11. Löpær dræll bort allær ambut fra lawarþi sinum ok gör nokon skaþa. dræpær. stial allær rænir. eig skal lauarþær. skæþæ. gialda num han aptær fa hion sit. Far þem aptær böte afgærþir þerræ sum lagh sigiæ én asynær vittni æru til ællær þiufnæþær i handum takin ær eigh þæt til. væri mæþ nekuaþum sum lægh sighia. §.1. Lanar maþær manni þræl sin svari hin sakum ær uiþ lani havir takit. e mæþæn han ær i hans varþnæde.",
            "tolkning": "Rymmer en träl eller trälinna bort från sin husbonde och gör någon skada, dräper, stjäl eller rånar, skall husbonden icke gälda skadan såvida han icke återfår sitt hjon. Får han dem tillbaka, böte han för deras förbrytelser såsom lagen säger, om synvittnen finnas eller tjuvgods gripits på bar gärning; finnes icke det, värje han sig med förnekande ed såsom lagen säger. § 1. Lånar man ut sin träl till en man, svare den för sakerna som har tagit emot lånet, så länge trälen är i hans vård.",
            "kommentar": "lawarþi: husbonde (fsv. lavardher, jfr eng. lord). Huvudprincipen om husbondens begränsade principalansvar för rymda trälars brott intill dess han återfår trälen i sitt hushåll.",
            "segmentId": "avg-b09-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Rætlosæ bolkær Punkt 11–§1"
          }
        ]
      },
      {
        "rubrik": "Sektion 12",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 12 (Legodjur och vårdansvar)",
        "balkId": "B09",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "12",
        "meningar": [
          {
            "fsv": "12. [Þ]æn sum leghir af bondæ hæst. ællær öxa. allær. ko. han skal varþæ firi vangömslö. þæt ær þiuuær. vatn. dyi. klavi ok annur þylik. §.1. Firi fars. fæ. afæfli. þæt ær. biorn. allær. quesæ. firi varghi. skal uarþæ sum firi. wangömslö. æn eig far aflæstir af. þæt ær. sex öræ firi hæst. halfmark firi oxa ok hors far han aflæstir gialdi iki firi vargh.",
            "tolkning": "Den som lejer häst, oxe eller ko av en bonde, han skall svara för vårdslöshet (vanrykt): det är tjuvar, drunkningsvatten, dyn och moras, klave och annat dylikt. § 1. För fäets rovdjursskada och övermakt — det är björn, varg eller pest/vilddjursbett (quesa) — skall han svara liksom för vårdslöshet om icke lämningar (öron eller skinn) förevisas; böterna äro sex örar för häst och en halv mark för oxe och sto; förevisar han lämningarna, gälde han intet för vargen.",
            "kommentar": "vangömslö: vårdslös förvaring (culpa) där lejaren bär bevisbördan. klavi: kvävning i bindsle eller klave. quesæ: vilddjurssting, bett eller akut djursjukdom. aflæstir: bevislämningar (avskurna öron eller skinn) som styrkte att djuret rivits av rovdjur utan lejarens vållande. Textkritisk notis: Källan har '?æn sum leghir' på s. 15 rad 8; frågetecknet återgivet som [Þ] enligt transkriptionsreglerna.",
            "segmentId": "avg-b09-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Rætlosæ bolkær Punkt 12–§1",
            "avvikelser": [
              "Källtexten har '?æn sum leghir' på s. 15 rad 8; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 13",
        "hanvisning": "Cod. Holm. B 59, Rætlosæ bolkær Punkt 13 (Deposition och förvaring av gods)",
        "balkId": "B09",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "13",
        "meningar": [
          {
            "fsv": "13. Læggær maþær manni fæ sit in til gætslu. þa ma þæt fæ eigh tapas af þem uiþ takar hwærtti mæþ styld ællær mæþ rani num bondæ. þæs fæ ær uiþr takær allær kostær værþa maþ taknir aftær skal han gialdæ. Læggi fram þæt han uill. ok maþ tylptær eþ at han fæk eig meræ hans. fæ at gætslu æn han havir nu fram laghat.",
            "tolkning": "Lämnar en man sitt gods in till förvaring hos en man, då må det godset icke förloras av den som tog emot det varken genom stöld eller genom rån, såvida icke den bondes eget gods som tog emot det också bortrövas; eljest skall han gälda det tillbaka. Han framlägge vad han vill och svärje med en tolftared att han icke mottog mer av dennes gods till förvaring än han nu har lagt fram.",
            "kommentar": "til gætslu: deposition (depositum). Förvararens strikta ansvar hävs endast om hans egna tillhörigheter samtidigt stulits vid samma inbrott eller rån. Tvist om depositiets storlek avgörs genom förvararens tolftared.",
            "segmentId": "avg-b09-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Rætlosæ bolkær Punkt 13"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/iordhar-balker-i": {
    "titel": "Iordþær bolkær, del I",
    "underrubrik": "Äldre Västgötalagen, jordafång, köp, fastar, bördsrätt och byamål (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Fastighetsrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Första delen av Jordabalken (Iordþær bolkær) i Äldre Västgötalagen fastställer de fundamentala grundreglerna för fast egendom i det medeltida Västergötland. Texten inleds med den berömda uppräkningen av jordens fem lagliga fång: arv, sons hemgåva, dotters hemföljd, köp och skötning. Vidare regleras det högtidliga köpeavtalet inför fastar och styresfast med rituell umfärd kring ägorna, hembud och bördsrätt gentemot arvingar vid månadstämma på tinget, förbud mot sämjeköp mellan makar (väggaköp), pantsättning med tre vintrars inlösenfrist, vittnesföreträde där bönder går före ländmän i byamål, samt byns indelning i åttungar, gärdestvång vid Kristi himmelsfärdsdag och tomtgränsens tjäldrastenar med rätt till takdropp.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 1 (Jordens fem fång)",
        "balkId": "B10",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "1. Fæm æru fang iorþær. Et ær arvær. Annæt ær. hemgæf sunær. [Þ]riþiæ ær hemfylgð. dottor. Fiærþæ ær köp. Fæmtæ ær sköting.",
            "tolkning": "Fem äro jordens laga fång: Ett är arv; det andra är sons hemgåva; det tredje är dotters hemföljd; det fjärde är köp; det femte är skötning.",
            "kommentar": "Fæm æru fang iorþær: den klassiska fornsvenska uppdelningen av laga fång till fast egendom. hemgæf sunær: förskott på arv till son vid giftermål eller etablering. hemfylgð dottor: hemgift till dotter. sköting: skötning, formlig överlåtelse genom att jord läggs i mottagarens sköte inför vittnen. Textkritisk notis: Källan har '?riþiæ' på s. 15 rad 22; frågetecknet återgivet som [Þ] enligt transkriptionsreglerna.",
            "segmentId": "avg-b10-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Iordþær bolkær Punkt 1",
            "avvikelser": [
              "Källtexten har '?riþiæ' på s. 15 rad 22; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 2 (Köp, fastar, umfärd och klander)",
        "balkId": "B10",
        "pdfSidor": [
          15
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. Köpe skal taka at þæs hænde ær iord sæl umfærd at varþæ. ok han tua af hændi værþi at værþæ. þer allir skulu takæ i hand baþvm þem þa ær ok köpfæstum bundit. Ryvi mæþ. III. markum þæn ryuæ uill. Comber eig köpruui uid sin farit ær þa siunætting garæ firi þem svm vmfærþ værþær ok allum þem ær ioþ æghu i by skal gangæ um akræ. ok ængiær. ok sua aptær a topt siþæn. Illiz þa ennor staþér. þa skal þen variæ ær iorþ sæl æn fyr illiz æn umfærþ kombær .a. Illiz siþæn þa skal þæn varþæ sum köpir. Attæ skulu oþolfæstir varæ. niunde styrisfæstær. Siu nattæ gamall skal siunattingær. væræ. Sa skal iorþ. væriæ. ær .a. maþ tuænni tylptum. ok tuænni vittnum skal iorþ væriæ. Siunætting skal uisæ þem manni ær köpæ varþæþæ æn annættvægiæ quæls værþ ællær vmfærþ firi hanum. Siunattingh skal firi hanum halþæ þor han uitæ firi mæþ tylptær eþe at han eigh köpe. værþaþe. þa ær han uarþær. falz han böta. III. markær firi köpruf.",
            "tolkning": "Köparen skall taga å säljarens vägnar en man som borgar för umfärden, och säljaren skall taga två män ur sin hand som borga för köpeskillingen; alla dessa skola taga i hand med båda parterna, då är köpet bundet med fastar. Den som vill bryta köpet bryte det med tre marker. Brytes köpet icke då det ingicks, skall man utlysa sjunätting inför den som borgar för umfärden och alla dem som äga jord i byn; man skall gå omkring åkrar och ängar och så tillbaka till tomten sedan. Klandras jorden annorstädes, skall säljaren försvara den om klandret sker innan umfärd ägt rum; klandras den därefter, skall köparen försvara den. Åtta skola odalsfastarna vara och den nionde styresfasten. Sju nätter gammal skall sjunättingen vara. Den skall värja jorden som äger den, med två tolfter och två vittnen. Sjunätting skall utlysas för den man som borgade för köpet om antingen köpeskillingen eller umfärden uteblir inför honom; fälles han, böte han tre marker för köpbrott.",
            "segmentId": "avg-b10-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 15, Iordþær bolkær Punkt 2",
            "kommentar": "oþolfæstir: odalsfastar, fastighetsvittnen ur bygden. styrisfæstær: ordförande bland fastarna. vmfærþ: rituell inspektionsgång kring fastighetens alla rågångar. köpruf: böter för kontraktsbrott."
          },
          {
            "fsv": "§.1. Illiz arftakin iorþ hana skal væriæ. mæþ ærfþær vittnum. Tver mæn skulu vittni bæræ ok i tylpt standæ. Sva skal uittni bæræ. Bær iak. þæs vittni ok uir mæn tver at þu tokt iorþ þæssæ at arvi. at v iltu mæþ vittni borno binþum. uit slikt svm lagh sighiæ. þa skal han firi tylpt ganga at biþiæ svæ guþ holl ok uattum sinum. at iac tok iorþ þæssæ at arvi ok at v iltu. ok iac a ok þu ikki vættæ .i. §.2. Illiz iorþ at þem köpt havir. þa skal han værnæ mæþ tuanni tylptum ok tuanni vittnum. biþi sva sær guþ holl. ok uattum sinum at iak köptæ iorþ. þæssæ maþ fæst ok mæþ vmfærþ at v iltu. ok sva svm lagh sighiæ ok iak. a ok þv iki vætæ i. þa skal firi. aþræ tylpt gangæ ok sværiæ samalund. köpæ vittni skal latæ bæræ. i tylfpt hvarri. tvæggiæ manna.",
            "tolkning": "§ 1. Klandras arvtagen jord, skall den värjas med arvsvittnen; två män skola bära vittnesbörd och stå i tolften. Så skall vittnesbörd bäras: 'Jag bär vittnesbörd därom och vi två män, att du tog denna jord i arv utan klander, och vi binda det med framburet vittne såsom lagen säger.' Då skall han träda fram inför tolften och bedja så Gud och sina vittnen vara sig huld: 'Att jag tog denna jord i arv och utan klander, och jag äger den och du äger intet däri.' § 2. Klandras jord hos den som har köpt, då skall han värja med två tolfter och två vittnen: 'Att jag köpte denna jord med fastar och med umfärd utan klander och såsom lagen säger, och jag äger och du äger intet däri'; sedan skall han gå fram inför den andra tolften och svära på samma sätt; köpvittnen skall han låta framträda med två män i vardera tolften.",
            "segmentId": "avg-b10-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 15, Iordþær bolkær Punkt 2 §1–2",
            "kommentar": "Illiz: klandras (fsv. illa = klandra, anfäkta äganderätten). at v iltu: oklandrad, i fredlig besittning. Tvåpassprövning med dubbla tolfter och köpvittnen garanterar lagfartens orubblighet."
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 3 (Bördsrätt, månadstämma och sämjeköp)",
        "balkId": "B10",
        "pdfSidor": [
          15,
          16
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Æn sæliæ uill iorþ sinæ þa skal biuþæ arvæ sinum siunatting skal firi arva gæræ. ok sva biuþa hanum iorþ at köpæ. Siþæn skal þing uisæ ok manæþær stæmnu skulu þingmæn þem gæræ. Combær han til at köpæ iorþ a manæþær stæmnu. þæt ær vald. kombær han eigh. þa skal han til þings faræ læti þömæ sær at sæliæ þem mæst biuþær værþ firi. Sva skal konæ lagh byþæ sum karmaþar",
            "tolkning": "Vill man sälja sin jord, då skall man hembjuda den åt sin arvinge; sjunätting skall man utlysa för arvingen och så bjuda honom att köpa jorden. Sedan skall man hänskjuta till tinget och tingsmännen skola sätta en månads frist för dem. Kommer han till att köpa jorden vid månadstämman, då är saken avgjord; kommer han icke, då skall säljaren fara till tinget och låta döma sig rätt att sälja till den som bjuder mest för den. På samma sätt skall en kvinna hembjuda jorden enligt lag som en karl.",
            "segmentId": "avg-b10-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 15–16, Iordþær bolkær Punkt 3",
            "kommentar": "biuþæ arvæ sinum: bördsrätt (börþ / naustr), släktingarnas lagstadgade förköpsrätt till ättejord. manæþær stæmnu: lagstadgad betänketid om en månad på tinget innan jorden fick avyttras till utomstående."
          },
          {
            "fsv": "§.1. Eig skal a slæt faræ num vili hvat þæt ær maþær ællær konæ æn i bo sitær. §.2. Eig ma maþær af kono sinni iorþ köpæ mæþ laghmæli. þæt kallær. væggiær köp. Köpe bonde iorþ i iorþ æn han. vill. §.3. Sa svm iorþ sæl sialuær skal han. köpfæstum. bindæ. ok uiþ vmfærþ uæræ. hvat þæt ær hældér kona ællær barn. ællær maþær. a þingi skal owormaghæ köpæ lysæ. §.4. Maþær köpe mæþ lösom örom ok uill sæliæ vid lösom örom han skal þem lægbiudæ ær han köpte af. han skal sua firi iorþ lukæ sum þa ær til buþit. Vill han i iord skiptæ. þa skal han lag eigh biuþæ.",
            "tolkning": "§ 1. Ingen skall drivas bort från sitt hemman mot sin vilja, vare sig man eller kvinna, så länge denne sitter i boet. § 2. Ingen man må köpa jord av sin hustru enligt lag, det kallas 'väggaköp' (sämjeköp inom husets väggar); dock må bonden byta jord mot jord med henne om han vill. § 3. Den som säljer jord skall själv binda köpet med fastar och närvara vid umfärden, vare sig det är kvinna, barn eller man; på tinget skall omyndigs köp kungöras. § 4. Köper man jord med lösören och vill sälja åter mot lösören, skall han hembjuda den åt den han köpte av; denne skall betala för jorden vad som då bjudits; vill han byta mot annan jord, behöver han icke hembjuda.",
            "segmentId": "avg-b10-punkt03-seg002",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 3 §1–4",
            "kommentar": "væggiær köp: väggaköp, förbjudet köp mellan makar under bestående äktenskap till skydd för hustruns egendom. owormaghæ köpæ lysæ: offentlig tingslysning vid omyndigs jordtransaktioner för att förhindra förskingring."
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 4 (Makars jord, lösören och tillökning)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Konæ sæl iorþ sinæ ællær maþær laggær eig .i. bo. köpir sæ iorþ aþræ. þæt ær þæs þerræ ær iorþæ wærþi. atti. §.1. Köpir maþær iorþo sinni gær agærþ till. mæþ fæ. bæggiæ þerræ. þaghær. bo. skiptis. þa skal sva marhæ oræ. aptær til skiptis læggiæ sum agærþ. var. §.2. Skil a hion tu. ær iorþ mæþ lösom örom köpt kallæs annat eigh eghæ. þæt. a vitu baþvm þem uil uitæ til egho. §.3. Værþær iorþ farin siþæn hion tv komæ samæn þa ær hun bæggiæ þerræ.",
            "tolkning": "Säljer en kvinna eller en man sin jord och lägger icke köpeskillingen i det gemensamma boet utan köper sig annan jord, då tillhör den jorden den av dem som ägde köpeskillingen. § 1. Köper en man till sin jord och gör tillökning med bådas gemensamma gods, då skall vid boskiftet så många örar läggas tillbaka till delning som tillökningen kostade. § 2. Tvista två makar om jord som köpts med lösören och påstår den ene att den andre icke äger del däri, då äger den vittnesbörd som vill styrka äganderätten för båda. § 3. Förvärvas jord sedan två makar kommit samman, då tillhör den dem båda.",
            "segmentId": "avg-b10-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 4–§3",
            "kommentar": "agærþ: tillökning eller förbättring av fastighet med gemensamma medel. Subrogationsprincipen: egendom som träder i stället för enskild jord förblir enskild, medan förvärv under äktenskapet blir makars gemensamma egendom."
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 5 (Vittnesföreträde: biskop, ländman och bonde)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Biskupær a vitu firi kononge. ok lændær maþær firi biscupi. ok bonde firi allum. þem. Egho böndær by. ok annan lændir. mæn skil þem a. þa æghu bönþer uitu ok eigh lændir mæn. bya þerræ mælli. Boæ bönþær i by mæþ lendum manni. eig mughu þer uitu mistæ. þy hældær.",
            "tolkning": "Biskopen äger vittnesföreträde framför konungen, och ländmannen framför biskopen, men bonden äger företräde framför dem alla. Äga bönder en by och ländmän en annan och skiljer det dem emellan, då äga bönderna vittnesbörd mellan byarna och icke ländmännen. Bo bönder i samma by som en ländman, förlora de icke heller då sitt vittnesbörd.",
            "segmentId": "avg-b10-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 5",
            "kommentar": "bonde firi allum þem: den häpnadsväckande västgötska rättsregeln om den självägande bondens absoluta vittnesföreträde i lokala jordamål framför såväl ländmän, biskop som konung."
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 6 (Jordapant och förpantning)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Vill maþær iorþ at væþium takæ þa skal. vmfærþ til þeræ skiliæ hanum sua iorþ til vaþia sum lagh til sighia. Lösær han innæn þriggiæ vintra. þa ær eigh iorþ foruæþiæ standær hun þrea vinter ællær þrim længær. þa ær forvæþia. §.1. Læggær maþær annvr. væþ. gull ællær silvær. þa skal han gæræ siunatting firi hanum ok halþa at lösæ uæþ sit ok kuld kræfiæ. Han skal skyld lucæ eþ sin eptir at skuld ær eig mere æn nu ar fram lagþ. Vil eig skyld lukæ ok eig lagh gangæ. þa skal vaþium halþæ ok til þings föræ latæ dömæ sær at sæliæ.",
            "tolkning": "Vill man taga jord till pant, då skall umfärd avtalas därtill och jorden pantsättas såsom lagen säger. Löser han den inom tre vintrar, då är jorden icke förpantad; står den tre vintrar eller längre än tre vintrar, då är den förpantad (förverkad). § 1. Lämnar man andra panter, i guld eller silver, då skall han hålla sjunätting för honom för att lösa sin pant och kräva skulden; gäldenären skall betala skulden och svära ed att skulden icke är större än vad som framlagts; vill han varken betala skulden eller gå edgång efter lag, då skall borgenären behålla panten, föra den till tinget och låta döma sig rätt att sälja den.",
            "segmentId": "avg-b10-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 6–§1",
            "kommentar": "foruæþiæ: förpantad egendom, panträtt som efter tre vintrars utebliven inlösen förvandlas till definitiv äganderätt eller försäljningsrätt genom tingsdom."
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 7 (Bolsköp, utskifte och tomt med åttung)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "7. Köpir maþær bol. æru af köptir. akrær skil þem a han eig vitu num til ennær skipt. þa skal sær firi gangé ær bol. a mæþ tvem tylptum. ok biþi sva sær guþ holl ok uattum sinum at skipt þæssi var aldrigh farin af bole þæssu mæþ fæst ællær mæþ vmfærþ ok eig afhænd sum lagh sighiæ.",
            "tolkning": "Köper man ett bol (ett helt hemman) och äro åkrar frånköpta, och tvista de därom, då äger han icke vittnesbörd annat än till enas skifte; då skall den som äger bolet träda fram med två tolfter och bedja så Gud och sina vittnen vara sig huld: 'Att detta skifte aldrig avhändes från detta bol med fastar eller med umfärd, och icke avhändes såsom lagen säger.'",
            "segmentId": "avg-b10-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 7",
            "kommentar": "bol: odalhemman, stamgård. Tvist om frånsålda tegar eller skiften avgörs med dubbla tolfter till skydd för hemmanets integritet."
          },
          {
            "fsv": "§.1. Kallær annær. sik hauæ herft skipt ok annar copt. sa a vitu ær ærst kallæs havæ. §.2. Kallær annar vtskipt eghæ ok annar a bol. sa a uitu ær bol a. Vtskiptir ok garþær. þær skulu all til toptær at lagmæli. §.3. Hauir maþær topt i by ok oræss land ok sex lassa æng. þa a han uitu til vtskiptæ attundæ löter attungz til löf ok lok vndir viþær. A maþær eig meæ firi en atundær löt attungx far iki uitæt a han.",
            "tolkning": "§ 1. Påstår den ene sig hava ärvt ett skifte och den andre att han har köpt, då äger den vittnesbörd som först påstår sig innehava det. § 2. Påstår den ene sig äga utskifte och den andre att det hör till bolet, då äger den vittnesbörd som äger bolet; utskiften och gärden skola alla ligga till tomten enligt lag. § 3. Har en man tomt i byn och två plogland (oræss land) samt äng om sex lass hö, då äger han vittnesbörd till utskifte av en åttondedel av en åttung till lövtäkt och vedfång; äger han icke mer än en åttondedels lott av en åttung, må intet frånkännas honom med vittnesbörd.",
            "segmentId": "avg-b10-punkt07-seg002",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 7 §1–3",
            "kommentar": "vtskiptir: utägor utanför byns ordinarie tegskifte. oræss land: plogland (fsv. oræss land = oxdraget land, areal måttad efter ett plogspänn). attundæ löter attungz: minsta legala brukningsenhet för fullständiga byarättigheter."
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 8 (Åttungar och byorganisation)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "8",
        "meningar": [
          {
            "fsv": "8. Attungum skal by byggiæ. Fiurir væghær skulu af by rinnæ. Liþ ok garþa ok bror skal attungum. skiptæ.",
            "tolkning": "Efter åttungar skall by byggas. Fyra vägar skola löpa ut ur byn. Grindar, gärdesgårdar och broar skola skiftas efter åttungar.",
            "segmentId": "avg-b10-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 8",
            "kommentar": "Attungum skal by byggiæ: byalagens grundläggande förvaltnings- och skattesystem i medeltidens Götalandskap; åttungen (1/8 av ett bol eller attungatal) styrde byns ansvar för gemensamma anläggningar såsom vägar, broar och hägnader."
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 9 (Gärdesgårdstvång och Kristi himmelsfärdsdag)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "9",
        "meningar": [
          {
            "fsv": "9. Hittis at kirkiugarþær ok toptærgarþar. þa sokn gærþæ. ok eig top Hittis a akær ok topt. sa skal gærþæ ær topt .a. §.2. Garþær skal standæ mælli topt ok akræ lukttær a hælghaþorsdagh. Halfgærþi mællin toptæ. tvæggiæ. han skal e. gildær væræ. æn hvarghin böte firi utæn annær kærir a annæn.",
            "tolkning": "Mötas kyrkogård och tomtgård, då skall socknen hägna och icke tomten; mötas åker och tomt, skall den hägna som äger tomten. § 2. Gärdesgård skall stå stängd mellan tomt och åker senast på Kristi himmelsfärdsdag (helatorsdag). Halvgärde mellan två tomter skall alltid vara i laga skick, men ingendera parten böte såvida icke den ene klandrar den andre.",
            "segmentId": "avg-b10-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 9–§2",
            "kommentar": "Garþær lukttær a hælghaþorsdagh: traditionell vårlig stängseldag för att skydda nysådda åkrar mot betande boskap. Halfgærþi: gemensamt stängselansvar mellan grannar."
          }
        ]
      },
      {
        "rubrik": "Sektion 10",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 10 (Tjäldrastenar och takdropp)",
        "balkId": "B10",
        "pdfSidor": [
          16
        ],
        "kallpunkt": "10",
        "meningar": [
          {
            "fsv": "10. Tialdru. stenæ. skal tua i iorþ grawæ. þriþiæ a læggiæ. þer skulu vitni bæræ ar i iorþ liggiæ. §.1. hus skal sva nær tyaldru. sættiæ at stuþer rum ær mællum ok opsædrup.",
            "tolkning": "Tjäldrastenar (rågångsstenar på tomtgräns) skall man gräva två i jorden och lägga den tredje ovanpå; de skola bära vittnesbörd där de ligga i jorden. § 1. Hus skall sättas så nära tjäldran att det finnes utrymme för stöttor och takdropp (opsædrup) emellan.",
            "segmentId": "avg-b10-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 16, Iordþær bolkær Punkt 10–§1",
            "kommentar": "Tialdru stenæ: tjäldrastenar, medeltida gränsröse av tre stenar (två som fotstenar och en hjärtsten ovanpå) som utvisade tomtens exakta rågång. opsædrup: rätten till takdropp och väggutrymme gentemot grannens tomtgräns."
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/iordhar-balker-ii": {
    "titel": "Iordþær bolkær, del II",
    "underrubrik": "Äldre Västgötalagen, tomträtt, allmänning, markskäl, revning och skifte (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Fastighetsrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra delen av Jordabalken (Iordþær bolkær) i Äldre Västgötalagen behandlar byns interna organisation och dess yttre gränser. Balken omfattar husflyttning och förvandling av tomt till åker, byavägarnas bredd (sju alnar) och fredade likvägar till kyrkan, fägator till allmänningen (sju famnar), förbud mot nybyggen i åkergärden, strikta villkor för intaga på byamark och uppmätning med revlina vid odelsskifte, allmänningstvister mellan byar och forntida hednabyar, rågångar och synemän vid markskäl, mittgräns vid vattendrag, stränga straff för rubbande av gränsstenar (ormyrja / ormyliæ), samt förbudsmärken med vidjekvist vid slåttertvist.",
    "sektioner": [
      {
        "rubrik": "Sektion 11",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 11 (Husflyttning och tomtgille)",
        "balkId": "B10",
        "pdfSidor": [
          16,
          17
        ],
        "kallpunkt": "11",
        "meningar": [
          {
            "fsv": "11. Flytær annar maþær hus sin af topfto ok yrkir toft. þa hetir hakær ok eig toft. Sökiæ skal garþ af hændi sær þæn ær mælli war toftæ gildæn ok eig vgildæn.",
            "tolkning": "Flyttar en man sina hus från tomten och uppodlar tomten, då heter det åker och icke tomt. Han skall avbörda sig stängselskyldigheten för det gärde som stod mellan tomterna i laga gillt och icke ogillt skick.",
            "segmentId": "avg-b10-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 16–17, Iordþær bolkær Punkt 11",
            "kommentar": "hakær ok eig toft: när bebyggelsen viker för odling ändras tomtens rättsliga status till åkermark, varvid stängselskyldigheten mot grannarna omfördelas."
          }
        ]
      },
      {
        "rubrik": "Sektion 12",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 12 (Byavägar, likväg till kyrka och gräsväg)",
        "balkId": "B10",
        "pdfSidor": [
          17
        ],
        "kallpunkt": "12",
        "meningar": [
          {
            "fsv": "12. Rændær væghær toftæ mælli. han skal siu alnnæ breþær varæ. A maþær wægh iuir toft mans. han skal þæn. vægh hanum af læggiæ. sum han uill. eig i dæk ællær y dy. ællær i fiall vp. Halvæn vægh skal huar þerræ. mælli. toftæ. læggiæ.",
            "tolkning": "Löper väg mellan tomter, skall den vara sju alnar bred. Har man vägrätt över annans tomt, skall ägaren anvisa honom den väg han vill, dock icke genom sänka eller dy eller uppför berg. Halva vägbredden skall vardera grannen upplåta mellan tomterna.",
            "segmentId": "avg-b10-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 12",
            "kommentar": "siu alnnæ breþær: lagstadgad bredd för byavägar (ca 4 meter). Halvæn vægh: grannars ömsesidiga skyldighet att bidra med mark till samfälld väg."
          },
          {
            "fsv": "§.1. Ligwægh skal til kirkiu læggiæ. eigh ma lik iuir toft mans faræ olouandis num han se sakær at. þrænni sextanortoghom. §.2. Græswæghær skal til byær liggiæ. sa skal þrannisæxtanorthoghor bötæ ær vp yrkir.",
            "tolkning": "§ 1. Likväg skall läggas till kyrkan; icke må lik föras över annans tomt utan lov, såvida han icke vill plikta tre gånger sexton örtugar. § 2. Gräsväg skall ligga till byn; den skall böta tre gånger sexton örtugar som plöjer upp den.",
            "segmentId": "avg-b10-punkt12-seg002",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 12 §1–2",
            "kommentar": "Ligwægh: hävdvunnen kyrkväg för begravningståg. olouandis: olovlig överträdelse av annans tomtfrid vid likfärd var strängt bötfälld."
          }
        ]
      },
      {
        "rubrik": "Sektion 13",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 13 (Utgärdande, åkerbygge, holmsköp och fägata)",
        "balkId": "B10",
        "pdfSidor": [
          17
        ],
        "kallpunkt": "13",
        "meningar": [
          {
            "fsv": "13. Far maþær a akær sin ællær. æng sinæ at boæ. þa skal skal han sialwær sik vtgærþæ. A maþær gard firi hanum. þa skal han sökiæ up han mæþ siunæ ting. ok tolf mannæ eþe ok uittni latæ bæræ at garþær þænni stændær firi toft hans sua at han ma eig utuæghum næ. Kastér han eig garþ vp firi siunættings dagh böte. þrennesaxtanortohær. ok hinn taki up garþ æptir. þings domæ ok lati domæ sær garþ. at varþvetæ e mæþæn toft hans vindær. §.1. Flytær af bygd sinæ. þa skal han sokiæ garþ af handum sær sua sum fyr a latæ dömæ hanum gildæn gard ok eig vgildæn. §.2. Husær maþær i akærgærþi. þær sum aþrir grannæ æghu iorþ kring vm þa ma han eig þær boæ mæþ laghmæli. þer skulu hanum siunætting gæræ ok in haldæ. vitni latæ bæræ at han bor akargærþi ok gær klöstroþ iuir akær ok æng. þy ma han eig at lægmæli. hær boæ. þa skal þing uisæ latæ hem dömæ endaghæ vittnæ mæþ tuanni tylptum. latæ dömæ af garþ a sægnær þingi. brytæ af ok eig brænnæ.",
            "tolkning": "Far en man ut på sin åker eller sin äng för att bygga och bo, då skall han själv hägna in sig. Står en mans gärdesgård för honom, skall han kalla honom med sjunätting och tolvmannaed och låta vittna om att gärdet står för hans toft så att han icke kan nå utvägar; river han icke upp gärdet före sjunättingsdagen, böte han tre gånger sexton örtugar, och den andre rive upp gärdet efter tingsdom och låte döma sig rätt att behålla gärdet så länge hans tomt står där. § 1. Flyttar han från sin bebyggelse, skall han avbörda sig gärdet såsom förr och låta döma sig ha lämnat ett gillt gärde och icke ogillt. § 2. Bygger man hus inne i ett åkergärde där andra grannar äga jord runt omkring, då må han icke bo där enligt lag; de skola hålla sjunätting mot honom och vittna om att han bor i åkergärdet och vållar tramp och skada (klöstroþ) över åker och äng; därför må han icke bo där enligt lag. Då skall man hänskjuta till tinget, fastställa endag, vittna med två tolfter och på sägnartinget döma honom bort från gärdet: riva ned huset men icke bränna det.",
            "segmentId": "avg-b10-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 13–§2",
            "kommentar": "Husær i akærgærþi: förbud mot enskilt bebyggande inom byns gemensamma åkermark som hindrade grannarnas odling och orsakade tramp (klöstroþ). brytæ af ok eig brænnæ: laglig rätt att riva olovligt uppfört hus utan skadegörelse genom brand."
          },
          {
            "fsv": "§.3. Bröþær skiptæ iorþ sinni. husær annær ut a akær ællær æng a grasiæþri. liggær teghær viþ tegh. han .a. iamna vitu uiþ þæn i by bor. §,4, Byggir han ut a mark byar gærþi um kring sik sialuær. Byggir a sa marku gærþir um kring sik .a. III. vitter. ællær. III. vittrum længær a oxæ byrþi til skogss. til vndir viþær ok til fængans ængyn a vitu innæn gard hanum ok han ingæ utæn garþ til almannigs þæt kallar holmsköp han ma eig i bælgh bindæ. Viliæ grannær intaku takæ firi hanum. þa skulu þer hanum gatu læggiæ til almænnigs siv famnæ breþæ. þer skulu garþæ gærþæ ær iorþ egho ut til almænnigs.",
            "tolkning": "§ 3. Skifta bröder sin jord och bygger den ene ut på åker eller äng vid gräsvallen, och teg ligger vid teg, då äger han samma vittnesbörd som den som bor kvar i byn. § 4. Bygger han ut på utmarken och sätter gärdesgård kring sig själv i tre vintrar eller längre än tre vintrar, har han rätt till oxbörda ur skogen, till virke och gärdsle; ingen äger vittnesbörd innanför hans gärde och han äger intet utanför gärdet mot allmänningen; det kallas 'holmsköp', han må icke binda det i säck (kräva utvidgad rätt). Vilja grannarna göra intaga framför honom, skola de lägga en fägata åt honom till allmänningen, sju famnar bred; de skola hägna gärdesgårdarna som äga jorden ut mot allmänningen.",
            "segmentId": "avg-b10-punkt13-seg002",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 13 §3–4",
            "kommentar": "holmsköp: enskild nyodling/torp på utmarken med hävd efter tre vintrar men begränsad rätt till skogsfång (oxæ byrþi). gatu til almænnigs: fägata, samfälld fädrevsväg mellan åkergärdena till utmarken (sju famnar bred)."
          }
        ]
      },
      {
        "rubrik": "Sektion 14",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 14 (Intaga på byamark och revning vid odelsskifte)",
        "balkId": "B10",
        "pdfSidor": [
          17
        ],
        "kallpunkt": "14",
        "meningar": [
          {
            "fsv": "14. Eig mæ takæ intaku. num alli uili þer ær eghu attundæ lot af attungi. [Þ]aghar in ær takit. þa skal sa valdæ oþolskipti ær uill. gæræ siunættings firi ens garþi ok haldæ. firi allum þem iorþ æghu i by. þa skal þing uisæ ok lata. hem endaghæ dömæ. þingsmænna vittni. a endaghæ latæ bæræ ok sværiæ æptir at sva kom dombær. a mal hans a þingi at han skuldi hær standæ i dagh ok repæ iorþ i attungi. siþen .i. attungæ. ær repæt. þa skal þing sighia ok lötæ a sægnær þingi. æn eigh uill fyr. Siþæn lata dömæ sua attungi hvarium sum lotær fal mæþ þings uittni sua skulu allir sin i mællin skipæ bæþi garþ ok iorþ. en eig uiliæ. ællær.",
            "tolkning": "Ingen må göra intaga på samfälld mark såvida icke alla vilja det som äga en åttondedels lott av en åttung. Så snart intagan är gjord, skall den som vill råda över odelsskiftet utlysa sjunätting framför ens gård och det gälle mot alla dem som äga jord i byn; då skall man hänskjuta till tinget och låta döma dem en endag; tingsmännens vittnesbörd skall frambäras på endagen och sväras att 'så föll domen på tinget att man i dag skulle stå här och revmäta (repæ) jorden efter åttungar'. När jorden är revmätt i åttungar, skall man lysa ting och lotta på sägnartinget om man ej vill förr; sedan låte man döma åt varje åttung såsom lotten föll med tingsvittnen; så skola alla skifta sinsemellan, både gärden och jord, om de icke vilja annorlunda.",
            "segmentId": "avg-b10-punkt14-seg001",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 14",
            "avvikelser": [
              "Källtexten har '?aghar in ær takit' på s. 17 rad 27; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ],
            "kommentar": "intaku: odling på byns samfällda mark. oþolskipti: skifte av ätte- och odalsjord. repæ iorþ: uppmätning med revlina (rep) vid tegskifte och solskifte. Textkritisk notis: Källan har '?aghar in ær takit' på s. 17 rad 27; frågetecknet återgivet som [Þ] enligt transkriptionsreglerna."
          }
        ]
      },
      {
        "rubrik": "Sektion 15",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 15 (Allmänningstvist, fullby och hednaby)",
        "balkId": "B10",
        "pdfSidor": [
          17
        ],
        "kallpunkt": "15",
        "meningar": [
          {
            "fsv": "15. En man kallar sik aghæ a fær marku. ær eig garþær vm kvæþæ grænnar ne vid. kallæ allæ. þem egha. þa æghv þer vitu ær allum þem uiliæ uitæ til egnær. væria med tvænni tylptum ok tvænni uittnum. biþiæ sua sær guþ holl. ok uattum sinum at iord þæssi. ær o skil vm ær almænnigær. aldræ grænnæ. ok eig enæng þin.",
            "tolkning": "Påstår en man sig äga mark på utmarken där ingen gärdesgård står om, och svara grannarna nej och påstå sig alla äga den, då äga de vittnesbörd som vilja tillkänna den åt dem alla; de värje saken med två tolfter och två vittnen och bedja så Gud och sina vittnen vara sig huld: 'Att denna jord som det tvistas om är alla grannars allmänning och icke din enskilda äga.'",
            "segmentId": "avg-b10-punkt15-seg001",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 15",
            "kommentar": "almænnigær: samfälld utmark gentemot enskild tillägnelse (enæng). Tvist avgörs med två tolfter till förmån för byamännens allmänning."
          },
          {
            "fsv": "§.1. Skil a þorp ok by vm almænning. þa a byr vitu ok eig þorp. Half tylft. af fæstu. skal i by. uæræ æn gitær sik uitæt til fullbyær. Tver iorþærghændi. i tylft hvarri skulu vittni. bæræ æn han ær höghæ byr. ok af heþnu bygdær. þa skulu tver iarþeghændi af þem eig baru uittni hvar firi sinni tylft gangæ biþi sua sær gud holl ok uattum sinum. at byr. þænni havir varit fullbyr bæþi i heþnu ok kristnu. ok þy a han iamnæ vitu viþ by þin at laghmale. A. en maþær allæn by ær kiurkiæ .i. ok half boændæ mannæ. þa ma uitæ han til fulz byær.",
            "tolkning": "§ 1. Skiljer det mellan torp och by om allmänning, då äger byn vittnesbörd och icke torpet. En halv tolft jordägare skall finnas i byn om den skall kunna hävda sig såsom fullby; två jordägande män i vardera tolften skola bära vittnesbörd. Är det en högby (gravhögsby) som varit bebyggd från heden tid, då skola två jordägare som icke buro vittnesbörd gå fram i spetsen för vardera tolften och bedja så Gud och sina vittnen vara sig huld: 'Att denna by har varit fullby både i hedendomen och i kristendomen, och därför äger den samma vittnesbörd som din by enligt lag.' Äger en enda man en hel by där kyrka finnes och hälften av bönderna, må han hävda den som fullby.",
            "segmentId": "avg-b10-punkt15-seg002",
            "kallreferens": "AVG-MASKIN s. 17, Iordþær bolkær Punkt 15 §1",
            "kommentar": "fullbyr: fullvärdig by med fulla tings- och allmänningsrättigheter, till skillnad från utflyttade ensamgårdar eller torp. höghæ byr ok af heþnu bygdær: fornby med gravhögar från hednisk tid, vars ålder gav obestridlig hävd."
          }
        ]
      },
      {
        "rubrik": "Sektion 16",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 16 (Markskäl, gränsmärken och syn)",
        "balkId": "B10",
        "pdfSidor": [
          17,
          18
        ],
        "kallpunkt": "16",
        "meningar": [
          {
            "fsv": "16. Skil mæn vm marker skial byæ mælli. þa skulu þer skyal se sin i mællin. ganga huar byr i sit mærki ær han kallær i. [Þ]erra skal hvarghum innæn garz. kallæ þær sum standit havir þrea vætær ok þim. længær. þær a byr uitu firir. þer skulu saman gangæ. ok vittni. latæ bæræ .i. stad þæn sum han kallær .i. Værþær annær vittnum. siþæri. sa skal vitu. orþ æghæ. hava baþi iammargh uittni. þa skal hæræþ a syn til næmnæ af þingi sæmbér a synær mannum a þa skal þem lagh dömæ ær asyn vittnær mæþ. sæms þem eig a. þa skal lanz a syn næmnæ ok lösæ mælli. þerræ. §.1. Skil a land ok hæræþ. land skal uitu eghæ ok þe hæræz skulu uitu eghæ. ær eig sökiæ fang til. skal væriæ mæþ tvænni tylptum næmdæ. mannæ. §.2. Skil a hæræd oc by þa. a hæræd vitu.",
            "tolkning": "Tvista män om markskäl mellan byar, då skola de besiktiga rågången sinsemellan och vardera byn gå till det gränsmärke som den åberopar; ingendera må åberopa mark innanför gärde där det stått i tre vintrar eller längre; där äger byn vittnesbörd för sin hävd. De skola gå samman och låta frambära vittnesbörd på det ställe som vardera åberopar; kommer den ene med vittnen senare, äger han vittnesbörd; hava båda lika många vittnen, då skall häradssyn tillsättas från tinget; enas synemännen, dömes efter vad synen vittnar; enas de icke, tillsättes landssyn som avgör saken. § 1. Skiljer det mellan landskap och härad, äger landskapet vittnesbörd och de härader som icke söka fång; det skall värjas med två tolfter nämndemän. § 2. Skiljer det mellan härad och by, då äger häradet vittnesbörd.",
            "segmentId": "avg-b10-punkt16-seg001",
            "kallreferens": "AVG-MASKIN s. 17–18, Iordþær bolkær Punkt 16–§2",
            "avvikelser": [
              "Källtexten har '?erra' på s. 17 rad 42; frågetecknet återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ],
            "kommentar": "marker skial: gräns mellan byar på skog och utmark. hæræþ a syn ok lanz a syn: lokal häradssyn respektive överordnad landssyn (lagmannens syn) vid olösliga gränstvister. Textkritisk notis: Källan har '?erra' på s. 17 rad 42; frågetecknet återgivet som [Þ] enligt transkriptionsreglerna."
          }
        ]
      },
      {
        "rubrik": "Sektion 17",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 17 (Intaga, träde, grässpärre och vattenmitt)",
        "balkId": "B10",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "17",
        "meningar": [
          {
            "fsv": "17. Vil by takæ in mark sinæ gen byær mark annærri. þer skulu gard gærþæ ær in uiliæ takæ. ok söki siþæn haluæn sær af handum gilldén ok eig vgildæn. §.1. Vill maþær træþi up taka þa skal han garz gærþæ. ær up uil taka. söke siþæn sær. af hande gildæn ok eig vgildæn. Træþir maþær enka akær gærþi sialvær vm kring. §.2. Vil maþær sæ löt sinæ hégnæ. þa skal han garþ mælli fæ lötæ gæræ eigh ma han ællær intakæ. num han se saker at þrænni saxtænörtoghum. ok hetir græsspæri sa byr ær sua gærid.",
            "tolkning": "Vill en by göra intaga på sin mark gentemot grannbyns mark, skola de hägna gärdesgård som vilja taga in, och sedan kräva att grannbyn övertager halva gärdet i gillt och icke ogillt skick. § 1. Vill man uppodla träde, skall den hägna som vill taga upp, och sedan kräva att motparten övertager sitt hägnadsansvar. Lägger man ensam en åker i träde, hägne han själv runt om. § 2. Vill man hägna sin sädeslott, skall man sätta gärde mellan säd och fäbete; eljest må man icke göra intaga såvida man icke vill böta tre gånger sexton örtugar; och heter den byn 'grässpärre' som så gör (stänger ute andras betesrätt).",
            "segmentId": "avg-b10-punkt17-seg001",
            "kallreferens": "AVG-MASKIN s. 18, Iordþær bolkær Punkt 17–§2",
            "kommentar": "træþi: trädesjord i tvåsädessystemet. græsspæri: olaga utestängande av samfällt bete genom olovlig inhägnad."
          },
          {
            "fsv": "§.3. Rændær vatn mælli tuæggiæ markæ gærþi hvar at sinu oðælli ok mötæs i miþri uatnras.",
            "tolkning": "§ 3. Rinner vatten mellan två marker, hägne vardera intill sitt odal och mötas i midten av vattenfåran.",
            "segmentId": "avg-b10-punkt17-seg002",
            "kallreferens": "AVG-MASKIN s. 18, Iordþær bolkær Punkt 17 §3",
            "kommentar": "i miþri uatnras: den urgamla principen om vattenmitt (kungsådra och mittgräns i vattendrag) mellan angränsande fastigheter."
          }
        ]
      },
      {
        "rubrik": "Sektion 18",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 18 (Enskifte i by och råmärken)",
        "balkId": "B10",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "18",
        "meningar": [
          {
            "fsv": "18. A maþær enkæ skipt i by. aþrum. þer æghu vitu. ær i by. boæ huru mykil hun skal uaræ. hun hetir uitulös iorþ an hun ær eig rend ok stend. eig mæ þy at hvaru allæ bort uitæ at lagnmæli.",
            "tolkning": "Äger en man enskilt skifte i en annan by, då äga byamännen som bo i byn vittnesbörd om hur stor den lotten skall vara; den jorden kallas 'vittneslös jord' om den icke är försedd med rågång och gränsstenar; dock må man icke fördenskull frånkänna honom all jorden enligt lag.",
            "segmentId": "avg-b10-punkt18-seg001",
            "kallreferens": "AVG-MASKIN s. 18, Iordþær bolkær Punkt 18",
            "kommentar": "enkæ skipt: enskild teg eller äga belägen inom en annans bys skifteslag. rend ok stend: försedd med gränsrenar (diken) och råstenar."
          }
        ]
      },
      {
        "rubrik": "Sektion 19",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 19 (Flyttning av tjäldrar och ormyrja)",
        "balkId": "B10",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "19",
        "meningar": [
          {
            "fsv": "19. Æn tyaldrur uil flytiæ æn vranct kallar liggiæ. þa skal siunatting til gæræ. ok þing uisæ ok endaghæ latæ hem dömæ. þor væriæ mæþ tuænni tylptum. sa ær vid han delir. at tyaldræ. þæssi liggær ræt ok vræt eighi. §.1. Hvar sum brytær vp ren ok sten han hetir i aþrum mannum ormyliæ han ær saker at trænni sextanörtoghum.",
            "tolkning": "Vill man flytta tjäldrastenar och påstår att de ligga orätt, då skall man utlysa sjunätting, hänskjuta till tinget och fastställa endag; den som tvistar mot honom må värja med två tolfter att denna tjäldra ligger rätt och icke orätt. § 1. Var och en som river upp rågångsren och gränssten, han kallas bland andra män 'ormyrja' (ormyliæ); han är skyldig böter om tre gånger sexton örtugar.",
            "segmentId": "avg-b10-punkt19-seg001",
            "kallreferens": "AVG-MASKIN s. 18, Iordþær bolkær Punkt 19–§1",
            "kommentar": "ormyliæ: fsv. ormyli / ormyrja, ett oerhört skymford för den som i smyg rubbar gränsstenar eller plöjer bort rågångsrenar, belagt med dryga böter."
          }
        ]
      },
      {
        "rubrik": "Sektion 20",
        "hanvisning": "Cod. Holm. B 59, Iordþær bolkær Punkt 20 (Slåttertvist och förbudsmärke)",
        "balkId": "B10",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "20",
        "meningar": [
          {
            "fsv": "20. Slar maþær æng mans cumbær hin at ær a han skal taka uiþi quist bitæ bast a ok sætiæ sua i þet ær laghæ forbud ma eigh vndæan takæ num han sækti sik at þrænni sextan örtoghum. þér skal hö a æng ladæ til þes ær þer æru sattir.",
            "tolkning": "Slår en man en annans äng och kommer ägaren till, skall denne taga en vidjekvist, binda bast om och sticka ned i marken; det är laga förbudsmärke; slåttermannen må icke föra bort höet utan att böta tre gånger sexton örtugar; där skall höet läggas i lada på ängen till dess de äro förlikta.",
            "segmentId": "avg-b10-punkt20-seg001",
            "kallreferens": "AVG-MASKIN s. 18, Iordþær bolkær Punkt 20",
            "kommentar": "laghæ forbud: formellt förbudsmärke i marken med vidjekvist och bast som belägger det skördade höet med kvarstad tills äganderättstvisten är löst."
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/mylnu-balker": {
    "titel": "Huru mylnu skal gæræ",
    "underrubrik": "Äldre Västgötalagen, kvarnbygge, dämning, kungsådra och vattenrätt (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Vattenrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Kvarnbalken (Huru mylnu skal gæræ) i Äldre Västgötalagen utgör en av de allra äldsta kodifieringarna av svensk vattenrätt och miljörätt. Balken reglerar anläggandet av vattenkvarnar med hänsyn till grannars tomter, åkrar, ängar, vägar, forta (byallmänning) och äldre vattenverk. Texten fastställer den berömda kungsådrans föregångare — att en tredjedel av strömfåran i allmänt vatten alltid måste lämnas öppen medan två tredjedelar må dämmas —, krav på laga köp av landfäste på motstående strand, treårig förfallotid för ödelagda kvarnställen innan de må återtas, vägrätt framför kvarndörren vid intaga på allmänning, samt ett ovillkorligt förbud mot att avleda vatten ur dess urgamla fåra till förfång för andra.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Huru mylnu skal gæræ Inledning–§ 1 (Kvarnanläggning, dämning och fiskeverk)",
        "balkId": "B11",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "intro-1",
        "meningar": [
          {
            "fsv": "Uill maþær mylnu gæræ han ma eig sua gæræ at topt annærs manss spillis eig akri. eig æng eig væghum mannæ. eig forta grannæ. ok eig mylnu þerre ær för var gör eig fiski uærkum. §.1. fiskigarþi ma ok eig sua gæræ at þem ælþri fiskigarþi spillir. Eig ma fiskiæ .i. stæmmum manss annar æn þæn ær .a. eigh i diki. annar manss.",
            "tolkning": "Vill en man bygga en kvarn, må han icke göra det så att en annans tomt skadas, ej åker, ej äng, ej människors vägar, ej grannars forta (fägata/byallmänning), och ej den kvarn som förr var byggd, ej heller fiskeverk. § 1. Fiskegård må man icke heller göra så att den skadar en äldre fiskegård. Ingen annan må fiska i en mans kvarndamm än den som äger den, och ej i en annans dike.",
            "kommentar": "forta: byallmänning, öppen gata eller fägata mellan gårdarna. stæmmum: uppdämt vatten/kvarndamm. Förbud mot uppdämning som orsakar dämvattenskada eller översvämning på uppströms belägen tomt, åker, väg eller äldre kvarnar och fiskeverk.",
            "segmentId": "avg-b11-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 18, Huru mylnu skal gæræ Inledning–§ 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Huru mylnu skal gæræ § 2–§ 3 (Ödekvarnar, timmerverk och syn)",
        "balkId": "B11",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "2-3",
        "meningar": [
          {
            "fsv": "§.2. Mylnu staþer ligær öþe. þrea uettær allær þrim vættrum længær æru fang af roten. þa sa wald at takæ ær uill. Sighir sua þén ær mylnustaþ atti. at fang æru eigh al af roten viti mæþ tvænni tylptum at stiborþ. stoþu ok stulpær. ok dræskulli la ok holagh. Æ a maþær mylnustaþ. mæþæn. þe fang æru. all vroten. Sa maþær a mylnu stad. ær fyrst gær uærk a hvat. þæt ær hældæ a aldra götæ æng. ællær alþra grænnæ. §.3. Delæ mæn vm mylnu stad kallær huar sik eghæ. þa skal asyn til næmnæ. þen skal lagh fa vittnum uærþær siþæri havæ baþir iammargh vitni. þa skal lanz asyn næmnæ til ok skiliæ mælli. þerræ.",
            "tolkning": "§ 2. Ligger ett kvarnställe öde i tre vintrar eller längre än tre vintrar och äro virket och anläggningen bortmultnade, då har den rätt att taga det som vill. Säger den så som ägde kvarnstället att virket icke är helt förmultnat, då styrke han med två tolfter att stigbord (dammluckor), stolpar och trösklar samt ränna och hjulhus ännu voro bevarade; alltid äger man kvarnstället så länge detta timmerverk icke är helt multnat. Den mannen äger kvarnstället som först uppför anläggning där, vare sig det är på alla götars allmänning eller alla grannars. § 3. Tvista män om ett kvarnställe och påstår sig vardera äga det, då skall syn tillsättas; den skall få laglig rätt som senare framträder med vittnen; hava båda lika många vittnen, skall landssyn tillsättas och avgöra emellan dem.",
            "kommentar": "stiborþ: stigbord, rörlig dammlucka för att reglera vattenpådraget. stulpær: bärande stolpar i dammen. dræskulli: tröskel i dämmet. holagh: hjulhus eller vattenränna. öþe þrea uettær: treårig preskriptionstid för övergivet kvarnställe. lanz asyn: landssyn (lagmannens syn) vid oenighet bland lokala synemän.",
            "segmentId": "avg-b11-punkt01-seg002",
            "kallreferens": "AVG-MASKIN s. 18, Huru mylnu skal gæræ § 2–§ 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Huru mylnu skal gæræ § 4–§ 8 (Kungsådra, landfäste, kvarndörr och vattenfåra)",
        "balkId": "B11",
        "pdfSidor": [
          18
        ],
        "kallpunkt": "4-8",
        "meningar": [
          {
            "fsv": "§.4. Gær maþær mylnu i almænnisz vattni a annar maþær eing annænuagh þa skal þridiungær löss faræ af vattni æn tua löte ma han stæmnæ. eig iuir a land num han fa landfæstu mæþ fæst ok vmfærþ laghæ. §.5. Takæ grænnær almænnig in firi mylnu dörom. þa skal han sær uæghær kræfiæ. þer skulu hanum uægh læggiæ. Gaar maþær þæt eig laghskiptæ þer iorþo lyutær annær firi mylnu dorom. þa ær mylnæ han vnit. §.6. Maþer gær myulnu. a æng sinni liggær grænnæ almænnigær i gen annanuagh. a byr annær. þa skal han landfæstu köpæ af þem ær þær a iorþ i by. §.7. Vatn skal eigh vændæ af fornu fari. aþrum manni til andmarkæ aþruvis æn fyr hauir runnit. §.8. Iorþ ma eigh at mutu takæ.",
            "tolkning": "§ 4. Bygger man kvarn i allmänt vatten och äger en annan äng på andra sidan, då skall en tredjedel av vattnet löpa fritt (kungsådran), men två tredjedelar må han dämma; han må icke dämma över på annans land såvida han icke erhållit laga landfäste med fastar och umfärd. § 5. Göra grannarna intaga på allmänning framför kvarndörrarna, då skall han kräva väg och de skola lägga väg för honom; sker icke lagligt skifte där och tillfaller jorden framför kvarndörrarna en annan, då har han dock vunnit kvarnen. § 6. Bygger man kvarn på sin egen äng och grannarnas allmänning eller en annan by ligger mittemot på andra sidan ån, då skall han köpa landfäste av dem som äga jorden i den byn. § 7. Vatten skall man icke vända ur sin gamla fåra till annans förfång, annorlunda än det förr har runnit. § 8. Jord må man icke taga med mutor.",
            "kommentar": "þridiungær löss faræ af vattni: tidigaste föregångaren till kungsådran i svensk rätt (fri genomströmning för fisk och båtled). landfæstu: servitut/rättighet att fästa dammfäste i motstående strandbrink. Vatn eigh vændæ af fornu fari: strikt förbud mot att leda om naturliga vattendrag.",
            "segmentId": "avg-b11-punkt01-seg003",
            "kallreferens": "AVG-MASKIN s. 18, Huru mylnu skal gæræ § 4–§ 8"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/thiuua-balker-i": {
    "titel": "Þiuuæ bollkær, del I",
    "underrubrik": "Äldre Västgötalagen, stöld, husrannsakning, lösöretak och tjuvs ed (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Straffrätt och processrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Första delen av Tjuvbalken (Þiuuæ bollkær) i Äldre Västgötalagen behandlar ett av medeltidens allra allvarligaste brott och dess processuella hantering. Texten inleds med anklagelse för stöld av häst och klenoder, särskiljer straffansvaret när fader och son eller bryte och träl stjäl tillsammans, samt fastställer den berömda allittererande domsformeln till galge, torv och tjära för handfången tjuv. Vidare ges en utförlig reglering av stöldens tre parter (tjuv, medhjälpare och hälare), spårföljning till by och gård, det ceremoniella rannsakningsförfarandet i invisteshus med avklädda rannsakningsmän, husfruns nyckelmakt över låsta kistor, samt förfarandet med laga tak och kvargsäte vid påträffande av stöldgods.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 1 (Stöldanklagelse för häst och bötessatser)",
        "balkId": "B12",
        "pdfSidor": [
          18,
          19
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "[Þ]ætta ær. þiuuæ bollkær. 1. Giuær maþær manni þiufs sak firir hæst ællær annæn grip ok fas aptær gripær spiltær allær. sprængdær. gialdæ aptær mæþ suornom eþe. æn falz at ok fullær þiufs bötær.",
            "tolkning": "Detta är Tjuvbalken. 1. Giver en man en annan tjuvsak för en häst eller annan klenod, och fås klenoden åter fördärvad eller sprängriden, gälde han åter med svuren ed; men fälles han därtill, böte han ock fulla tjuvsböter.",
            "kommentar": "þiufs sak: anklagelse om stöld. gripær: lösöre, kreatur eller dyrgrip (jfr fornisländska gripr). spiltær allær sprængdær: skadad eller sprängriden/överansträngd. gialdæ aptær mæþ suornom eþe: ersättningsskyldighet fastställd genom svuren värjemålsed. falz at: fälls för brottet (passiv presens av fælla). fullær þiufs bötær: fulla böter för stöld. Textkritisk notis: Rubriken på s. 18 inleds med '?ætta ær. þiuuæ bollkær' där frågetecknet återgivits som [Þ].",
            "segmentId": "avg-b12-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 18–19, Þiuuæ bollkær Punkt 1",
            "avvikelser": [
              "Källrubriken på s. 18 har '?ætta ær. þiuuæ bollkær'; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 2 (Stöld i gemensamhet: fader och son, bryte och träl)",
        "balkId": "B12",
        "pdfSidor": [
          19
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. Stiælæ tuer faþghær værþæ taknir mæþ hænge faþir vppi. ok sun æn maghændi. maþær ær.",
            "tolkning": "2. Stjäla två fädgar (fader och son tillsammans) och varda de gripna med tjuvgodset: hänge fadern däruppe, och sonen om han är en myndig man.",
            "kommentar": "faþghær: fader och son (kollektiv substantivbildning). maghændi maþær: myndig och rådande person, i motsats till omyndig (ovormaghi). Fadern bär det primära ansvaret som husfader och hängs ovillkorligen; sonen hängs endast om han uppnått myndig ålder och full rättskapacitet.",
            "segmentId": "avg-b12-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 2"
          },
          {
            "fsv": "§.1 Gangær at stialæ bryti. ok þræl. bryti skal vppi hængiæ. ok eigh dræl.",
            "tolkning": "§ 1. Gå en bryte (gårdsförvaltare) och en träl att stjäla: bryten skall hängas däruppe, och icke trälen.",
            "kommentar": "bryti: fri förvaltare av annans gård med full rättskapacitet. dræl: träl (med ortografisk växling d/þ i handskriften). Trälen hängs icke därför att han saknar rättssubjektivitet och hans herre svarar för honom, medan den frie bryten drabbas av fullt dödsstraff.",
            "segmentId": "avg-b12-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 2 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 3 (Handfången tjuv, tingsdom, dödsstraff och vägfynd)",
        "balkId": "B12",
        "pdfSidor": [
          19
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Taker maþær þiuf sin ok þiuft mæþ bindi þiuf a bak ok leþe til þings. mæþ tua vittnismæn þa ær vittnæ a þinge. han sannæn þiuf væræ. mæþ tolf mannum. af þingi gangæ. þæs at sværiæ at han ær fuldær þiuér. þy ær han varþær lif sit latæ. Siþæn skal han dömæ til hogs ok til hangæ. til draps ok til döþæ. til torfs ok til tiæru. vgildæn firi arvæ ok æftimælændæ sva firi kiurky. sum firi gonungæ.",
            "tolkning": "3. Griper en man sin tjuv och tjuvgodset med honom, binde han tjuven på ryggen och lede till tinget med två vittnesmän, de som vittna på tinget att han är sann tjuv. Med tolv män gånge han av tinget för att svärja att han är full tjuv, varför han är värd att mista sitt liv. Sedan skall han dömas till hugg och till galge, till dråp och till död, till torv och till tjära, ogill för arvingar och målsägande, så inför kyrka som inför konung.",
            "kommentar": "bindi þiuf a bak: binde händerna bakom ryggen (klassisk handfångningsprocedur). tolf mannum af þingi gangæ: tolvmannanämnd som avlägger fällande vittnesed. Arkaisk rimmande och allittererande domsformel: 'til hogs ok til hangæ, til draps ok til döþæ, til torfs ok til tiæru, vgildæn firi arvæ ok æftimælændæ'. Tjuven mister sitt liv och begravs under torv och tjära i ovigd jord utan mansbot åt arvingarna.",
            "segmentId": "avg-b12-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 3"
          },
          {
            "fsv": "§.1 Værþær þiuuær takin a vægh ok eigh af þem ær firi styld ær wrþin. þa skal han þiuf hem mæþ sær lædæ ok bud sændæ þem svm þiuvær þær ær. Havir han hans sannæn þiuf fingit. taki mark firi þiuf. ok tva öræ firi þiuft. En þæn sum stolen ær kallær þiuft eigh uæræ sinæ. ok eigh þiuf haui þæn sum i handum havir þiuf til þings. Dömiss þæþæn til konongsgarz bonde skils viþ þiuf saklös a þingi.",
            "tolkning": "§ 1. Varder en tjuv tagen på allmän väg och icke av den som blivit bestulen, då skall han leda tjuven hem med sig och sända bud till den vars tjuven är. Har han funnit dennes sanne tjuv, tage han en mark för tjuven och två örtugar för tjuvgodset. Men om den som blivit bestulen påstår att tjuvgodset icke är hans och ej heller tjuven, föra den som har tjuven i sina händer denne till tinget. Dömes därifrån till konungsgården; bonden skiljs från tjuven saklös på tinget.",
            "kommentar": "Reglering av gripande av tjuv på bar gärning av tredje man. Griparen erhåller en mark i griparelön och två örtugar för tillvarataget stöldgods. Om den bestulne förnekar att det är hans stöldgods, överlämnas tjuven till konungens fogde vid tinget.",
            "segmentId": "avg-b12-punkt03-seg002",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 3 § 1"
          },
          {
            "fsv": "§.2 Takær maþær þiuf annærs manss a væg ok eig. sin. latær lösæn at laglöso þa kallæ mæn þæn lottakæræ uæræ þiufnæþær.",
            "tolkning": "§ 2. Griper en man en annans tjuv på vägen och icke sin egen och släpper honom lös mot lagen, då kalla män denne för lottagare (medbrottsling) i tjuvnaden.",
            "kommentar": "lottakæræ uæræ þiufnæþær: medbrottsling / delaktig i stölden. Den som olagligen friger en gripen tjuv presumeras ha andel i tjuvgodset.",
            "segmentId": "avg-b12-punkt03-seg003",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 3 § 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 4 (Tjuvars tre slag, tre vitulösor och tre värnseder)",
        "balkId": "B12",
        "pdfSidor": [
          19
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Sva ær i lahum talt at þrir æru þiuuær. En ær. þæn ær stial ok takar. Annær raþær i hænþar þivfi. [Þ]riþi takar uiþr. þær æru allir ena lund sakir.",
            "tolkning": "4. Så är i lagen sagt att tre äro tjuvar: En är den som stjäl och tager; en annan råder i händer på tjuven (förmedlar/hjälper); den tredje tager emot (hälare). De äro alla på samma sätt sakskyldiga.",
            "kommentar": "Laglig tredelning av stöldbrottet: gärningsmannen (stial ok takar), medhjälparen/förmedlaren (raþær i hænþar þivfi) och mottagaren/hälaren (takar uiþr). Alla drabbas av likvärdigt straffansvar. Textkritisk notis: Källan har '?riþi' på s. 19 rad 14; återgivet som [Þ]riþi.",
            "segmentId": "avg-b12-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 4",
            "avvikelser": [
              "Källtexten har '?riþi' på s. 19 rad 14; frågetecknet återgivet som [Þ]."
            ]
          },
          {
            "fsv": "§.1 [Þ]rear ærv þiufs vitulösor. En æn i handi takar. Annur æn or husi draghær. [Þ]riþiæ æn leþess til gaarsz ok grinþær. Gitær hvarghin sik orþiufæ giort.",
            "tolkning": "§ 1. Tre äro tjuvs vitulösor (handlingar på bar gärning som beröva tjuven värjemålsrätt): En, om man griper i handen; en annan, om man drager ut ur huset; den tredje, om det ledes till gård och grind. Ingen av dem förmår göra sig fri från tjuvsak.",
            "kommentar": "vitulösor: faktiska omständigheter som gör den misstänkte 'vitulös' (bevislös/utan rätt att avlägga värjemålsed, ty gärningen är manifest och handfången). Textkritisk notis: Källan har '?rear' på s. 19 rad 15 och '?riþiæ' på s. 19 rad 16; återgivna som [Þ]rear och [Þ]riþiæ.",
            "segmentId": "avg-b12-punkt04-seg002",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 4 § 1",
            "avvikelser": [
              "Källtexten har '?rear' och '?riþiæ' på s. 19 rad 15–16; frågetecknen återgivna som [Þ]."
            ]
          },
          {
            "fsv": "§.2 [Þ]rer æru þiufs vitur. En at iak stal eigh fæ þit ok eigh þyftis iak .a. Annur at iak ræþ eig fæ þit i hanþær. þiuvi. [Þ]riþiæ at iak ær eigh viþertaku. þiuvær þin. Ok væri sik sum saghæt ær.",
            "tolkning": "§ 2. Tre äro tjuvs vitur (laga värjemålseder): En, att 'jag icke stal ditt fä och icke gjorde mig skyldig till tjuvnad därå'; en annan, att 'jag icke rådde ditt fä i tjuvs händer'; den tredje, att 'jag icke är din mottagare (hälare)'. Och värje sig såsom sagt är.",
            "kommentar": "vitur: svurna värjemålseder med lagfästa edsföreskrifter svarande mot de tre tjuvskategorierna i huvudpunkten. Textkritisk notis: Källan har '?rer' på s. 19 rad 17 och '?riþiæ' på s. 19 rad 18; återgivna som [Þ]rer och [Þ]riþiæ.",
            "segmentId": "avg-b12-punkt04-seg003",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 4 § 2",
            "avvikelser": [
              "Källtexten har '?rer' och '?riþiæ' på s. 19 rad 17–18; frågetecknen återgivna som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 5 (Spårföljning, rannsakningsordning och husfruns lås)",
        "balkId": "B12",
        "pdfSidor": [
          19
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Værþær maþær stolen vrækær fiæt æptir fællir .i. kæfti. fyrst skal by letæ. A grænnæ skal kallæ. þer skulu mæþ gangæ. Leþer eigh fiæt or by. þa skal ranssakæ. Eig mughv grænnær ranzsak syniæ. Grænnær skulu i garþ gangæ þæs fyrst ær næst ær grun a han skal rum kallæ ok beþez ransak. Bonþe skal eig ranssak syniæ æn han ær sialuær hemæ. han skal vpp latæ sin inuistær hus þæt ær kornskyæmmæ ok matskammæ ok symnskæmmæ þy þru æru inuistar hus. En annur hus bæþi laþa ok nöthus þæt heter vthus þo at las se firi.",
            "tolkning": "5. Varder en man bestulen, följer han spåret och fäller det i käft (till inhägnad eller bytomt): först skall byn genomsökas. Han skall kalla på grannarna; de skola gå med. Leder spåret icke ut ur byn, då skall rannsakas. Grannar må icke vägra rannsakning. Grannarna skola gå in i den gård först som är närmast misstänkt; han skall ropa rum (be om fri tillgång) och begära rannsakning. Bonden må icke vägra rannsakning om han själv är hemma. Han skall öppna sina invisteshus (bostadshus): det är kornhärbre, visthus och sovhärbre, ty dessa tre äro invisteshus. Men andra hus, både lada och fähus, det kallas uthus, även om lås är för.",
            "kommentar": "vrækær fiæt æptir: driver/följer spåret efter tjuven. fællir .i. kæfti: spåret fälls i inhägnad/grindöppning (käft). rum kallæ: formellt krav på tillträde för laga husrannsakning inför grannar. Uppdelningen mellan inuistær hus (kornskyæmmæ, matskammæ, symnskæmmæ) och vthus har avgörande straffrättslig betydelse för bevisbördan och hemfriden.",
            "segmentId": "avg-b12-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 5"
          },
          {
            "fsv": "§.1. Nu skal bonde hus vpp lætæ. Nu skal bonde þæn sins hauir mist ok annar mæþ hanum ingangæ þæn ær þer troæ baþir. Baþir skulu þer iuirlösir uæræ ok lösgiurþir. ok barföttir bundit brökær uiþ knæ. ok sua ingangæ. [Þ]er skulu letæ i þem hvsum hittir sit inni vndir las ok lykki. ær þet hult halmi. þæ ær sa þiuuær at. þa skal þiuf takæ þem saklöst firi þy. at han ær sanþær þiuuær ok hvarghin gitær han þerre sak mæþ laghum rundit. Vil han uiþ gangæ at han ær sandær þiuvær. þa skal bondin vald eghæ sa ær sak giuær at takæ bötær firi skaþæ sin. ok eighit aptær ok a þæt sum lagh sighiæ. þa ma bonde uiþ han sættæs at saklöso þo eigh fyr an firir hæraszhöfþingæ. utæn han far burghæn firir. böte sak sinæ uiþ land ok gonong sum lagh sighiæ. Vill han eigh uiþar gangæ. þa skal þiuf a bak bindæ ok til þingsz föræ eigh ma fyr lösæn latæ num viþ liggi fiuratighi mærkær. Takar maþær bundin þiuf mæþ rani. af manni. han skal skirskutæ firi næstu manni ok i næstæ by. at han ær þiufs sins ræntær ok þy ær hin sakær at. XL. markum.",
            "tolkning": "§ 1. Nu skall bonden öppna husen. Nu skall den bonde som mist sitt eget och en annan gå in med honom, den som de båda lita på. Båda skola de vara utan överplagg, obältade och barfota, med byxorna bundna vid knäna, och så gå in. De skola leta i dessa hus; finner han sitt gods därinne under lås och lycka och är det dolt under halm, då är den mannen tjuv däröver. Då må han taga den tjuven saklöst, emedan han är sann tjuv och på intet vis förmår han avvärja den saken med lag. Vill han erkänna att han är sann tjuv, då skall den anklagande bonden ha rätt att taga böter för sin skada och sitt eget åter och därtill vad lagen säger; då må bonden förlikas med honom saklöst, dock ej förrän inför häradshövdingen, såvida han ej ställer borgen för att böta sin sak till landet och konungen såsom lagen säger. Vill han icke erkänna, då skall tjuven bindas på ryggen och föras till tinget; man må icke släppa honom lös förrän det gäller fyrtio marker. Tager en man med rån en bunden tjuv från en man, skall han lysa inför närmaste man och i nästa by att han har blivit rånad på sin tjuv, och därför är den andre förfallen till fyrtio marker.",
            "kommentar": "iuirlösir... lösgiurþir... barföttir bundit brökær uiþ knæ: rannsakningsmännens klädesdräkt kontrollerades strängt för att utesluta att stöldgods smugglades in för att fälla en oskyldig granne. Hittas godset dolt under halm och lås är tjuven handfången utan värjemålsrätt. Rån av bunden tjuv bestraffas med 40 markers fredsbrottsböter. Textkritisk notis: Källan har '?er' på s. 19 rad 29; återgivet som [Þ]er.",
            "segmentId": "avg-b12-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 5 § 1",
            "avvikelser": [
              "Källtexten har '?er' på s. 19 rad 29; frågetecknet återgivet som [Þ]."
            ]
          },
          {
            "fsv": "§.2. Nu æn hittir i luctu allær læstu kari. ark ællær kistu þær havir husprea likil til þa ær hvsprea þiuuær. Vill eigh bonde laghbötæ þa skal hvspreo takæ. ok a bak bindæ til þings föræ firi allær götæ ællær firi hæræþ. Vill þa bonde lösæ hospreo sinæ mæþ laghum rættum. þa skal kono lösæ latæ firi þy at konæ ær ovormaghi hvn a eigh hug ok eigh hangæ utæn firi trolskap.",
            "tolkning": "§ 2. Men om man finner godset i ett tillslutet eller låst käril, ark eller kista som husfrun har nyckel till, då är husfrun tjuv. Vill bonden icke böta enligt lag, då skall man taga husfrun och binda på ryggen och föra till tinget inför alla götar eller inför häradet. Vill då bonden lösa sin husfru med laglig rätt, då skall kvinnan lösas, ty en kvinna är omyndig (ovormaghi); hon skall varken huggas eller hängas, utom för trolldom.",
            "kommentar": "husprea likil til: husfrun rådde över nycklarna till hemmets kistor och skrin. Påträffas tjuvgods där bär hon det materiella ansvaret, men som kvinna och omyndig (ovormaghi) är hon fredad från dödsstraff och lemlästning ('hvn a eigh hug ok eigh hangæ'), utom vid trolldom (trolskap).",
            "segmentId": "avg-b12-punkt05-seg003",
            "kallreferens": "AVG-MASKIN s. 19, Þiuuæ bollkær Punkt 5 § 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 6 (Vägrad rannsakning, häradshövdingens nämnd och edgång)",
        "balkId": "B12",
        "pdfSidor": [
          19,
          20
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Far bonde æftir sinv. sins hanum ranszsak. þa skal han mæþ vittnum beþæz firi þy at han ma eigh hanum syniæ ranszsak þa han ær sialvær hemæ. syns hanum ranzsak þa dragher han þiufsku a sik. þa skal skirkutæ firi grannum at nu ær ranzsak svnd. þa kallær bonde han þiuf sin. þy at han sundi ranzsak. Nu kuaþær han ne viþ. þa skal sa sighiæ til sinum hæræszhöfþingæ han skal þing til namnæ ok næmd sætiæ ok at spyria hvi han ranzsak sundi. en kallar sik eigh þiuf han ær sakær at þranni sæxtanörtoghom.",
            "tolkning": "6. Far en bonde efter sitt gods och nekas han rannsakning, då skall han med vittnen begära det, ty man må icke neka honom rannsakning då man själv är hemma. Nekas han rannsakning, drager denne tjuvnad över sig; då skall man kungöra inför grannarna att rannsakning nu är vägrad. Då kallar bonden honom för sin tjuv, emedan han vägrade rannsakning. Säger han nu nej därtill, då skall den andre anmäla till sin häradshövding; han skall sammankalla ting och tillsätta nämnd och spörja varför han vägrade rannsakning. Om han säger sig icke vara tjuv, är han förfallen till tre sextonörtugar (sex marker).",
            "kommentar": "syns hanum ranzsak: vägras rannsakning. Den som nekar laga rannsakning presumeras vara tjuv ('dragher han þiufsku a sik'). Vägran kostar 3 sextonörtugar (6 marker) i processuell bot.",
            "segmentId": "avg-b12-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 19–20, Þiuuæ bollkær Punkt 6"
          },
          {
            "fsv": "§.1 Nu ær þæt böt at ranzsak. sundi. Nu standær sak open su at han ær þiuvær kallaþær. han skal væriæ sik mæþ tvæni tylptum ok. IIIIor. mannæ forræþe. falz han böte sum lagh sighiæ.",
            "tolkning": "§ 1. Nu är det bötfällt att han vägrade rannsakning. Nu står saken öppen så att han är kallad tjuv; han skall värja sig med två tylfter och fyra mäns förmäle. Fälles han, böte han såsom lagen säger.",
            "kommentar": "Efter att boten för vägrad rannsakning erlagts kvarstår själva tjuvsaken. Den anklagade måste värja sig genom stor edgång: 2 tylfter (24 edsmän) med fyra mäns förmäle/ledning (IIIIor. mannæ forræþe).",
            "segmentId": "avg-b12-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 6 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 7 (Stöld ur uthus, åbörd och edgång)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "7. Nu ær vtuistær hvs. giuær hin sak ær sins hauir mist. þu kom þær at. þu havir ualdit ællær hion þin ær þu at male at mælæ. þa sa bonde bundin viþ vitu suæri mæþ tuenni tylftum ok. IIIIor. mannæ forreþe. at þet kum þær hvarti mæþ uitu ællær valdi minu ællær þerræ iak a mæle at mælæ. þæt ær abryrþ ok eigh wlti iak þiufnæþe þem.",
            "tolkning": "7. Nu gäller det uthus: anklagar den som har mist sitt gods och säger: 'Du kom därvid; du har vållat det eller dina husfolk som du har målsmanskap över', då är bonden bunden till ed; han svärje med två tylfter och fyra mäns förmäle att 'det kom dit varken med mitt vetande eller mitt vållande, ej heller med deras som jag har målsmanskap över; det är påbörd (lös beskyllning) och icke vållade jag den tjuvnaden'.",
            "kommentar": "vtuistær hvs: uthusbyggnader (lada, fähus). Eftersom uthus icke åtnjöt samma slutna hemfrid som invisteshus krävdes formlig värjemålsed mot åbörd (abryrþ = obestyrkt beskyllning) med 24 edsmän och 4 föresvurna.",
            "segmentId": "avg-b12-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 7"
          },
          {
            "fsv": "§.1. Vitir bonde bondæ at han abyrd upp a han bar væri sik mæþ tuænni tylptum.",
            "tolkning": "§ 1. Beskyller en bonde en annan bonde för att han lade påbörd på honom, värje sig denne med två tylfter.",
            "kommentar": "Motanklagelse för falsk eller obefogad påbörd (ärekränkande anklagelse) avvärjs likaledes med två tylfters ed (24 edsmän).",
            "segmentId": "avg-b12-punkt07-seg002",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 7 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 8 (Återfående av klenod, kvargsäte och hemfött fä)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "8",
        "meningar": [
          {
            "fsv": "8. Hittir maþær grip sin. þa skal han tak firi bezass. bonde skal eig tak synia num han sakær se. þa skal bonde til takæ biþiæ man kuarsætu firi þiuf stolet þa skal siunatting firi þem garæ ær i tak gik ok haldæ firi þem hæst havir i handum.",
            "tolkning": "8. Finner en man sin klenod, då skall han begära laga tak (kvarstad). Bonden må icke vägra tak, såvida han ej vill bli sakfälld. Då skall bonden till taket bedja en man om kvargsäte för det tjuvstulna; då skall sjunattastämma sättas för den som gick i borgen och gälla för den som har hästen i sina händer.",
            "kommentar": "tak: kvarstad/laga handläggning vid återkrav av stöldgods. kuarsætu: kvargsäte, godset kvarstannar hos innehavaren mot borgen fram till rättslig prövning. siunatting: sjunattastämma (laga frist om sju dygn).",
            "segmentId": "avg-b12-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 8"
          },
          {
            "fsv": "§.1. þiuftolet skal leþæ til þriþia salæ a þriðiæ salæ skal sit lösæ ællær sværiæ mæþ tylptær eþe ok tuæggia manna vittnum at þæt uar hemæ föt oþ þær drak ok diþi myolk ok moþor spinæ ok iac a. ok þv ikki i. [Þ]or eigh þæs sværiæ. þa skal hin til gangæ ær sit havir kænt. ok sværiæ mæþ tylptær eþe ok tvænni vittnum at þænni gripær uar fra mær stolen ok huarghi sankændi iak fyr æn hær iak a ok þu iki.",
            "tolkning": "§ 1. Det tjuvstulna skall ledas till tredje säljaren; hos tredje säljaren skall han lösa sitt eller svärja med tylfted och två mäns vittne att 'det var hemma fött och där drack det och diade mjölk ur moderns spene, och jag äger och du icke'. Tör han icke svärja det, då skall den träda fram som har känt igen sitt och svärja med tylfted och två vittnen att 'denna klenod var stulen från mig och ingenstädes kände jag igen den förr än här; jag äger och du icke'.",
            "kommentar": "þriþia salæ: fångesman i tredje led (auktor/hemulskedja). Den berömda fornsvenska formeln för djurs härstamning: 'hemæ föt oþ þær drak ok diþi myolk ok moþor spinæ ok iac a ok þv ikki i'. Textkritisk notis: Källan har '?or' på s. 20 rad 16; återgivet som [Þ]or.",
            "segmentId": "avg-b12-punkt08-seg002",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 8 § 1",
            "avvikelser": [
              "Källtexten har '?or' på s. 20 rad 16; frågetecknet återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 9 (Möte på farväg, brötartak och kvargsätetak)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "9",
        "meningar": [
          {
            "fsv": "9. Hittir maþær grip sin a farnum vægh. þa skal hin i handum hauir brötær tak firir fa af bofastum mannum vm syv nætær til hus ok til hems. þa skal hin æptir fara ær sit hauir kænt. þa skal kuarsætu tak firi beþæss af bolfastum manni. taksætær han firi rani þa skal lösæ þær sum staþit ær num fylswat firir gangi. taki skal grip framnit havæ. kombær eigh fram. þa ær eigh tak laglika gangit. þa ær han sakær at tvænni sæxtanörtoghum. ællær væri sik mæþ tylptær eþe. ok tvægiæ manna vittni.",
            "tolkning": "9. Finner en man sin klenod på allmän farväg, då skall den som har den i händerna få brötartak av bofasta män om sju nätter till hus och hem. Då skall den efterfölja som har känt igen sitt; då skall kvargsätetak begäras av en bofast man. Sätter han tak för rån, då skall man lösa där som godset står, såvida icke fölsvittne går före. Den som tagit i tak skall ha klenoden framförd; kommer den icke fram, då har taket icke gått lagligt till; då är han förfallen till två sextonörtugar (fyra marker), eller ock värje sig med tylfted och två mäns vittne.",
            "kommentar": "farnum vægh: allmän väg / stråkväg. brötær tak: säkerhet under färd till hemmet. Den som innehar godset har rätt att resa hem under borgan av bofasta män innan saken utreds.",
            "segmentId": "avg-b12-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 9"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/thiuua-balker-ii": {
    "titel": "Þiuuæ bollkær, del II",
    "underrubrik": "Äldre Västgötalagen, laga tak, utländskt köp, trälars stöld och köpvittnen (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Handelsrätt, sakrätt och processrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra delen av Tjuvbalken (Þiuuæ bollkær) i Äldre Västgötalagen reglerar lösöreköp, gränsöverskridande rättsförhållanden och stöld av ofria. Balken fastställer de tre laga taken (brötartak, kvargsätetak och skälatak), processen vid köp från utländska män med stämma vid landamärket mot Svealand och Danmark, samt den berömda reciprocitetsprincipen i internationell privaträtt. Vidare behandlas stöld av dräktigt sto och fölsvittne, bortförande av trälar med den gripande vittnesformeln om uppfödning i vagga vid moderns spene, flyktande trälar på löpstighum, samt det ovillkorliga kravet på köpvittnen (vinar) och skyddet vid öppet torgköp.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 10 (Klander av lån, tak och sjunattastämma)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "10",
        "meningar": [
          {
            "fsv": "10. En maþær kænnir grip sin i annærs mans handum kallær sa sik at lane havær takit ær i handum havir. þa skal æftir fara ær sik kællær eighæ ok tak firi beþæs af þem ar i handum hauir. han ma eigh synnia num han sæki sik taksætær han firi raan þær skal lösæ ær stæþær ællær væriæ firi hemæföt. syunatting skal firi gæræ at lösæ mæþ laghæ vittnum. æn eigh vindær hin lagha uærn firi.",
            "tolkning": "10. Känner en man igen sin klenod i en annans händer och säger den som har den i händerna att han har tagit den som lån, då skall den efterfölja som säger sig äga och begära tak av den som har den i händerna. Han må icke vägra om han ej vill fällas till sak. Sätter han tak för rån, skall man lösa där den står eller värja såsom hemfött fä. Sjunattastämma skall sättas för att lösa med laga vittnen, om den andre ej framlägger laga värn.",
            "kommentar": "at lane havær takit: invändning om att godset innehas med lånerätt (prekarium eller lån). Förfarandet för att skilja mellan lån, stöld och rån medelst sjunattastämma och hemfödslovittne.",
            "segmentId": "avg-b12-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 10"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 11 (De tre laga taken: brötartak, kvargsätetak och skälatak)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "11",
        "meningar": [
          {
            "fsv": "11. [Þ]ry æru laghæ tak. et ær brötar tak til hus ok til hems. Annæz ær kuarsætu tak mæþ þem sæmbær. a baþum. þriþiæ ær skiælæ tak firi lanð ok galman þet ma eigh bonde aþrum syniæ num han sæki sik.",
            "tolkning": "11. Tre äro laga tak: Ett är brötartak till hus och till hem; det andra är kvargsätetak när båda parter enas därom; det tredje är skälatak inför landsmän och allmoge (galman); detta må en bonde icke vägra en annan om han ej vill fällas till sak.",
            "kommentar": "Klassisk kodifiering av de tre formerna av laga kvarstad (tak): brötar tak (reselejd/hemfärdsskydd), kuarsætu tak (godset står kvar mot borgen) och skiælæ tak (bevisbunden säkerhetskvarstad). Textkritisk notis: Källan har '?ry' på s. 20 rad 29; återgivet som [Þ]ry.",
            "segmentId": "avg-b12-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 11",
            "avvikelser": [
              "Källtexten har '?ry' på s. 20 rad 29; frågetecknet återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 12 (Köp av utländsk man, gränsstämma och ömsesidig rätt)",
        "balkId": "B12",
        "pdfSidor": [
          20
        ],
        "kallpunkt": "12",
        "meningar": [
          {
            "fsv": "12. Taksætær maþær grip sin kallær hin i handum hauir sik hauæ köpt af vtlænskum manni. ok ær vin innæn lanz. þa skal han syunatting firi hanum gæræ. ær i handum hauir grip. han skal sinum salæ bud fa. kumbær han til uil vinnæ firi. hemæ föt. þer a han vitu til. Kumbær han eigh. þa skal han uita til sins mæþ tylptær eþe ok tvæggiæ mannæ vittnum.",
            "tolkning": "12. Gör en man tak på sin klenod och säger den som har den i händerna att han har köpt den av en utländsk man, och köpvittnet (vinen) är inom landet, då skall sjunattastämma sättas för honom som har klenoden i händerna; han skall sända bud till sin säljare. Kommer denne och vill vittna om att den är hemfödd, då har han vittnesrätt därtill. Kommer han icke, då skall ägaren styrka sin rätt med tylfted och två mäns vittne.",
            "kommentar": "vtlænskum manni: man från annat landskap eller rike. vin: köpvittne (vīn). salæ bud fa: sända bud till säljaren för hemul/auktorisation.",
            "segmentId": "avg-b12-punkt12-seg001",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 12"
          },
          {
            "fsv": "§.1. Æru baþir utlænzkir. þer uid hauæ köpt þa skulu þer fiughurra natta stæmnv gæræ kumi þa allir til þæs landæmærkiz ar þæm ær næst. Sali ok vin. ok þæn i hændi havir. ok þæn ær illir. þær skal væriæ firi hemæ föt ællær laghvm lösæ.",
            "tolkning": "§ 1. Äro de båda utländska som köpt av varandra, då skola de sätta fyranättersstämma; komme då alla till det landamärke (gränsmärke) som är dem närmast: säljare och köpvittne och den som har klenoden i hand och den som klandrar. Där skall den värjas såsom hemfödd eller lösas med lagen.",
            "kommentar": "fiughurra natta stæmnv: fyradagarsfrist. landæmærkiz: landskapsgränsen, där rättsliga tvister mellan invånare i olika lagsagor förhandlades vid gränssten eller gränsmärke.",
            "segmentId": "avg-b12-punkt12-seg002",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 12 § 1"
          },
          {
            "fsv": "§.2. Köpæss þer vid annar i varu landi. ok annar hinvagh kiægglu. ællær i danmark. þa skal manæþær stæmnu til gæræ ok leþiss til landæmærkiz. ok giers annattuigiæ lösis sum lagh sighia ællær væri þen i handum hauir. [Þ]y lik lagh ok ræt sum vtlænskir man göra os. þylikæn uilium uir þem göræ.",
            "tolkning": "§ 2. Göra de köp med varandra, den ene i vårt land och den andre hinsides Käckle (Käglan/Tiveden) eller i Danmark, då skall en månads stämma utsättas och möte ske vid landamärket, och varde klenoden antingen löst såsom lagen säger eller värje den som har i hand. Slik lag och rätt som utländska män göra oss, slikt vilja vi göra dem.",
            "kommentar": "hinvagh kiægglu: hinsides Käglan (skogsryggen Käglan mot Svealand). danmark: Danmark (innefattande Halland och Skåne). Formulerar den historiska reciprocitetsprincipen: '[Þ]y lik lagh ok ræt sum vtlænskir man göra os. þylikæn uilium uir þem göræ'. Textkritisk notis: Källan har '?y' på s. 20 rad 42; återgivet som [Þ]y.",
            "segmentId": "avg-b12-punkt12-seg003",
            "kallreferens": "AVG-MASKIN s. 20, Þiuuæ bollkær Punkt 12 § 2",
            "avvikelser": [
              "Källtexten har '?y' på s. 20 rad 42; frågetecknet återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 13 (Återköpt stöldgods och gränsgång mellan landskap)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "13",
        "meningar": [
          {
            "fsv": "13. Tapær maþær grip sin köpir aptær ok kænnir eigh þa. kænniss viþ siþæn. þa skal hans vin vid uaræ flyti hinum grip ær hanum faldi. Ok illi þæn grip ær firi uar guldin. ok leþe siþen til þriþia salæ þer skal fyls wath firi gangæ. ællær lösæ mæþ laghum. En varir landa kænnæ sin grip i aþru landi. ællær utlænskir mæn i uaru landi þa skal syunattingh til gæræ. ok lösæ grip sin mæþ þrim mannum æn skal þæn væriæ ær grip illir. Annær hans landi mæþ hanum. [Þ]riþi af þy landi ær havir grip sin i kænt. Löst skal hin latæ ær i handum havir mæþ þæssi uitu. num væriæ uili mæþ tylptær eþe. at i hanss gardi þer var þænni gripær hemæ föder. ok þv at han ok þu iki i. þor han eigh þet suæriæ. þa skal hin til uita mæþ þrim mannum at han a þæn grip ok þu iki. Leþe til þriþiæ mansz ællær böte sum lagh sighia.",
            "tolkning": "13. Förlorar en man sin klenod och köper den åter utan att känna igen den då, men känner igen den sedan, då skall hans köpvittne vara tillstädes och återföra klenoden till den som sålde den åt honom, och klandra den klenod som gavs i betalning, och leda den sedan till tredje säljaren. Där skall fölsvittne gå före eller lösas med lagen. Men om våra landsmän känna igen sin klenod i ett annat land, eller utländska män i vårt land, då skall sjunattastämma sättas och klenoden lösas med tre män, och den skall värja som klandrar klenoden: en annan landsman med honom och den tredje från det land där klenoden igenkändes. Lös skall den lämna som har klenoden i händerna mot detta vittnesbörd, såvida han ej vill värja sig med tylfted att klenoden var hemfödd i hans gård och att han äger den och du icke. Tör han icke svärja det, då skall den andre intyga med tre män att han äger klenoden och du icke. Lede han till tredje man eller böte såsom lagen säger.",
            "kommentar": "Reglering av godtroförvärv och återkrav när den ursprunglige ägaren ovetande köpt tillbaka sin egen stulna egendom. Rättegång med tremannanämnd sammansatt över landskapsgränserna. Textkritisk notis: Källan har '?riþi' på s. 21 rad 6; återgivet som [Þ]riþi.",
            "segmentId": "avg-b12-punkt13-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 13",
            "avvikelser": [
              "Källtexten har '?riþi' på s. 21 rad 6; frågetecknet återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 14 (Gods fråntaget tjuv, lysning och vinningslön)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "14",
        "meningar": [
          {
            "fsv": "14. Hittir man grip sin i þivfs haptum ællær altir þiuf af. þa skal han lysæ sum lagh sighiæ ok gieræ sik orþiuvæ. Kombær hin aptir ær kannir sit þa skal han til gængæ mæþ tylptær eþe ok tuæggiæ manna vittnum biþi sva sær guþ hollæn ok uattum sinum at iak hitti þennæ grip i þiufs handum. ællær ælti iak þiuf af. þy æm iæk verþer vnnitigiæ laghæ. ok lysti firi fyrstæ mots manni ok næstæ by. ok þriþiæ þingi. þy æm iak uarþær orþiuua at varæ. þa skal hin til gangæ ær grip sin hauir kænt ok sværiæ at gripær sar var fran mæær stolen ok huarghi sankiændi iak fyr ær hær ok iak a ok þu iki. [Þ]a skal þen löst hauir grip sin luca tva öræ firi hæst at vnningia laghum æn han steþer han vtan haraz ok öre en han innan hæræz lösir ok eigh þy meræ at flere se an en maþær a.",
            "tolkning": "14. Finner en man sin klenod i tjuvs förvar eller jagar tjuven därifrån, då skall han lysa såsom lagen säger och göra sig fri från tjuvsak (orþiuua). Kommer då den efter som känner igen sitt, skall denne gå fram med tylfted och två mäns vittne: bedje så Gud vara sig och sina vittnen huld att 'jag fann denna klenod i tjuvs händer, eller jagade jag tjuven därifrån; därför är jag värd vinningslön enligt lag, och lyste inför förste mötande man och i nästa by och på tredje tinget; därför är jag värd att vara fri från tjuvnad'. Då skall den träda fram som har känt igen sin klenod och svärja att 'den klenoden var stulen från mig och ingenstädes kände jag igen den förr än här, och jag äger och du icke'. Då skall den som löst ut sin klenod erlägga två örtugar för häst i vinningslön om han finner den utanför häradet, och en örtug om han löser den inom häradet, och icke mer även om de äro flera än en häst som man äger.",
            "kommentar": "vnningia laghum: vinningslön / bärgelön för tillvarataget stöldgods (två örtugar utom häradet, en örtug inom häradet). Strikt formell lysningsplikt: för förste mötande man, i närmaste by och på tre ting i rad för att undgå tjuvnadsansvar. Textkritisk notis: Källan har '?a' på s. 21 rad 19; återgivet som [Þ]a.",
            "segmentId": "avg-b12-punkt14-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 14",
            "avvikelser": [
              "Källtexten har '?a' på s. 21 rad 19; frågetecknet återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 15 (Stulet sto och fölsvittne)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "15",
        "meningar": [
          {
            "fsv": "15. Varþær hyrsæ stolen ok ær eigh i fol. uærþær i fol siþæn annær far at köpæ. Hittir hin sit at stæþiæ han skal taksætiæ ok syunatting til gæræ ok lösæ sit mæþ laghum æn eigh gangær fyls uat firir hin skal fyl hauæ ær föt hauir hema.",
            "tolkning": "15. Varder ett sto stulet som icke är dräktigt med föl, och varder det dräktigt sedan en annan har köpt det: finner då den förre sitt sto, skall han sätta i tak och göra sjunattastämma och lösa sitt med lagen; såvida icke fölsvittne går före, skall den ha fölet som har fött det hemma.",
            "kommentar": "hyrsæ: sto (hyssa/hross). i fol: dräktig med föl. fyls uat: fölsvittne (intyg om var fölet avlats och fötts). Äganderätten till fölet tillfaller den som fött upp det i sitt hägn om dräktigheten uppstått efter stölden.",
            "segmentId": "avg-b12-punkt15-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 15"
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 16 (Bortförande och stöld av träl eller trälinna)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "16",
        "meningar": [
          {
            "fsv": "16. Stiæll maþær þræl manz ællær ambut löpær bort faar hin æptir ær a far sit eighit aptær ok leþer aptær a hand hanum ær han þiuf kallær til garþ. ok til grinder mæþ vittnum. þæt at han gitær eigh þiufsak rundit mæþ laghum rættum hanum skal bötæ firi þa þiufsak atta örtoghor min æn fiurar markær. sua konongi ok sua allum mannum.",
            "tolkning": "16. Stjäl en man en annans träl eller löper en trälinna bort, far då ägaren efter och får sitt eget åter, och återför trälen till honom som han kallar tjuv, till gård och grind med vittnen: om denne icke förmår avvärja tjuvsaken med laglig rätt, skall han böta för den tjuvsaken åtta örtugar mindre än fyra marker, likaså till konungen och likaså till allmogen.",
            "kommentar": "Stöld av ofri arbetskraft (träl eller ambut). Bötessatsen är treskiftad: 'atta örtoghor min æn fiurar markær' (3 marker = 24 örtugar, minus 8 örtugar = 16 örtugar eller 2 marker) vardera till målsäganden, konungen och häradet (allum mannum).",
            "segmentId": "avg-b12-punkt16-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 16"
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 17 (Klander av träl och vittnesed om födsel i vagga)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "17",
        "meningar": [
          {
            "fsv": "17. Stæþær maþær þræl sin ællær ambut . kallær fra sæ stolet uæræ ællær rantakit. þa skal han taksætiæ. þa skal syunatting firi þem gæræ sum i tak gæk taki skal þæn uæræ viþ siunatting ar i handum hauir. Sa a vittni ær i handum hauir æn uittni fæss. Vittni firi hemæ föt mæþ tylptær eþe. ok tvæggiæ mannæ vittnum. Biþi sua sær guð holl. ok vattum sinum at iak födde han hemæ i husum ok hæskap þer diþi ok drak miolk af moþor spina. þær uar i klæþum uafþær ok i uaggu lagþer. þy a iak han ok þu iki. falz han. þa skal hin sit hauir taksæt suæriæ mæþ tylptar eþe ok tuæggiæ mannæ uittnum at þanni maþær allær. konæ uar fra mær stolen ælllær rantær. ok huarghi þa rætkændi iak han fyr æn hær . iak a ok þu iki i.",
            "tolkning": "17. Finner en man sin träl eller trälinna och säger den vara från sig stulen eller råntagen, då skall han sätta i tak. Då skall sjunattastämma sättas för den som gick i borgen; till sjunattastämman skall den inställa klenoden som har den i händerna. Den har vittnesföreträde som har i händerna om vittnen finnas. Han vittne för hemfött fä med tylfted och två mäns vittne; bedje så Gud och sina vittnen vara sig huld: 'att jag födde honom hemma i mina hus och hushåll, där diade han och drack mjölk ur moderns spene, där var han svept i kläder och lagd i vagga; därför äger jag honom och du icke'. Fälles han, då skall den som satte i tak svärja med tylfted och två mäns vittne att 'denne man eller kvinna var från mig stulen eller rånad, och ingenstädes rättkände jag honom förr än här; jag äger och du icke'.",
            "kommentar": "En av de mest gripande fornnordiska rättsformlerna: 'iak födde han hemæ i husum ok hæskap þer diþi ok drak miolk af moþor spina. þær uar i klæþum uafþær ok i uaggu lagþer. þy a iak han ok þu iki'. Vittnesbördet om spädbarnsvård och uppfödning i hushållet utgjorde det yttersta beviset för äganderätt till en träl född av en trälkvinna på gården.",
            "segmentId": "avg-b12-punkt17-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 17"
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 18 (Träl gripen på flykt och vinningslön)",
        "balkId": "B12",
        "pdfSidor": [
          21
        ],
        "kallpunkt": "18",
        "meningar": [
          {
            "fsv": "18. Takær maþær þræll allær. ambut a löpstighum. þa skal lysæ sum lagh sighia hin skal lucæ firi vnningiæ lagh tua öræ innan lanz half mark utæn lanz. Vinni til sum lagh ær.",
            "tolkning": "18. Griper en man en träl eller trälinna på flyktstig (löpstighum), då skall han lysa såsom lagen säger; den som äger skall gälda i vinningslön två örtugar inom landet och en halv mark (fyra örtugar) utom landet. Han bevise sin rätt såsom lagen föreskriver.",
            "kommentar": "löpstighum: på flykt / flyktstig. Hittelön/vinningslön (vnningiæ lagh) för infångad förrymd träl: två örtugar inom landskapet, en halv mark (4 örtugar) utanför landskapet.",
            "segmentId": "avg-b12-punkt18-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 18"
          }
        ]
      },
      {
        "rubrik": "Sektion 10",
        "hanvisning": "Cod. Holm. B 59, Þiuuæ bollkær Punkt 19 (Köpvittnen, vingång, fä- och vapenköp samt torgköp)",
        "balkId": "B12",
        "pdfSidor": [
          21,
          22
        ],
        "kallpunkt": "19",
        "meningar": [
          {
            "fsv": "19. þræl ok ambut þem. skal vingæ. Bonde ær til vinordz biþin þæss ær sæl ok hins ær köpir. þa skal sa vingæ ær til uinordz ær biþin. Bonde skal værþe sa ær sæl. þræl ok ambut. þem ær köpir bæþi ny ok naþær þar næstu firi brote. æn firi griþum allæn aldær.",
            "tolkning": "19. Träl och trälinna, dem skall man köpa med köpvittne (vingæ). En bonde är ombedd om köpvittnesord av den som säljer och den som köper; då skall den bekräfta köpet som är ombedd om köpvittnesord. Bonden skall gå i borgen, den som säljer träl eller trälinna, till förmån för köparen: både ny och nåder (under den närmaste månaden) för fallandesot (broti), men för dråp och fredsbrott för all tid.",
            "kommentar": "vingæ: bekräfta köp med köpvittne (vīn). ny ok naþær: under den närmaste månaden från nymåne till nedan. firi brote: garanti mot fallandesot/epilepsi. firi griþum allæn aldær: evig garanti mot tidigare begångna fredsbrott och dråp begångna av den sålde trälen.",
            "segmentId": "avg-b12-punkt19-seg001",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 19"
          },
          {
            "fsv": "§.1. [Þ]y skal uin takæ til alþræ köpæ at han skal orþiuua gæra um al köp. Vil hin han þiuf kallæ. þa skal uin vittnæ ok þer tver samæn mæþ tylptær eþe. at iak köpti grip þænnæ. mæþ vin ok mæþ vittni. sva sum lagh varu. ok þy ualt iak eigh sak þerre. þu giuær mær.",
            "tolkning": "§ 1. Därför skall man taga köpvittne (vin) vid alla köp, att han skall göra köparen fri från tjuvnad (orþiuua) vid alla köp. Vill någon kalla honom tjuv, då skall köpvittnet vittna och de två samman med en tylfts ed: 'att jag köpte denna klenod med köpvittne och med vittnen såsom lagen föreskrev, och därför vållade jag icke den sak som du tillmäler mig'.",
            "kommentar": "orþiuua gæra: göra köparen saklös mot anklagelse om stöldgodsförvärv. Köpvittnet (vīn) fungerade som personlig garant och mededshjälpare vid köp av lösöre. Textkritisk notis: Källan har '?y' på s. 21 rad 37; återgivet som [Þ]y.",
            "segmentId": "avg-b12-punkt19-seg002",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 19 § 1",
            "avvikelser": [
              "Källtexten har '?y' på s. 21 rad 37; frågetecknet återgivet som [Þ]."
            ]
          },
          {
            "fsv": "§.2. Horss ok nöt hof fæ ok hornfæ. skapat klæþi ok skiept uakn. þem skal köpæ ok sæliæ mæþ vin ok vittni.",
            "tolkning": "§ 2. Häst och nöt, hovfä och hornfä, tillskurna kläder och skaftade vapen: dem skall man köpa och sälja med köpvittne och vittnen.",
            "kommentar": "Lagstadgad förteckning över dyrare lösöregrupper som ovillkorligen fordrade formellt köpvittne (vin ok vittni): hästar och nötkreatur (hof fæ ok hornfæ), färdigsydda kläder och skaftade vapen.",
            "segmentId": "avg-b12-punkt19-seg003",
            "kallreferens": "AVG-MASKIN s. 21, Þiuuæ bollkær Punkt 19 § 2"
          },
          {
            "fsv": "§.3. Dikur swærþ ok oskapaþ klæþi ok alt þæt i boþom liggær. ok þæt a torghe köpess vtæn boþær sva sum i. Illir ennor þy. þa skal han haua tuæggiæ mannæ uittni ok tylptær eþ. þæss. at sværiæ at han köpte torghköpe rættu ok þy ær han eigh þiuuær at.",
            "tolkning": "§ 3. Deger svärd (dyrbart prytt svärd) och otillskurna kläder (tygstycken) och allt det som ligger i salubodar, och det som köps på torget utanför bodar såsom ett stycke: klandrar någon detta, då skall han ha två mäns vittne och tylfted att svärja att han köpte med rätt torgköp, och därför är han icke tjuv däröver.",
            "kommentar": "Dikur swærþ: kostbart, prytt svärd. oskapaþ klæþi: tygstycken/väv i stycke. torghköpe rættu: torgköp på marknadsplats med publik omsättning åtnjöt särskilt rättsskydd; köparen frias från tjuvsak genom att svärja att godset köpts i öppen handelsbod eller på torget.",
            "segmentId": "avg-b12-punkt19-seg004",
            "kallreferens": "AVG-MASKIN s. 21–22, Þiuuæ bollkær Punkt 19 § 3"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/fornaemis-sakir": {
    "titel": "Fornæmix sakir",
    "underrubrik": "Äldre Västgötalagen, åverkansmål, ekhuggning, redskapstillgrepp, gärdesgårdsbrott och åkarnam (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Sakrätt och skadeståndsrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Första avsnittet märkt 13 (Fornæmix sakir / Åverkansmål I) i Äldre Västgötalagen behandlar förnäm och åverkan — det vill säga olovligt brukande eller tillgrepp av annans egendom utan stölduppsåt, samt skadegörelse på skog, åkrar och hägnader. Balken reglerar olovligt brukande av dragare på utmark, fällning av ollonbärande ekar och undervid med besiktning vid stubben, tillgrepp och begagnande av åkerredskap, båtar och seldon, körning över oslagen äng och gröda med den skärpta påföljden för sörgate (uppkörd väg), nedrivning och brott på gärdesgårdar, sädesskador orsakade av inträngande fä, samt förfarandet vid åkarnam (laglig kvarstad på bar gärning i åker) och otillåtet tjudrande på annans mark.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 1 (Olovligt brukande av dragdjur)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "[Þ]atta ær fornæmix sakir. 1. Marghær æru fornæmiz sakir. En ær þæssi. at takær maþær öknöte. manz. a löt uti o louandisz ok akær mæþ allær riþær. þa ær han sakær at þrænni saxtanörtoghum.",
            "tolkning": "Detta är åverkansmål. 1. Många äro åverkanssakerna: En är denna, att tager en man en annans dragare ute på betet utan lov och kör därmed eller rider, då är han förfallen till tre sextonörtugar (sex marker).",
            "kommentar": "fornæmix sakir: åverkansmål / olovligt tillgrepp utan stölduppsåt (jfr fornisländska fornámi). öknöte: dragare, arbetsdjur (arbetshäst eller dragoxe). a löt uti: ute på betesmarken/utmarken. o louandisz: olovandes, utan lov. þrænni saxtanörtoghum: tre sextonörtugar (3 × 16 örtugar = 48 örtugar = 6 marker). Textkritisk notis: Rubriken på s. 22 rad 42 har '?atta'; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna.",
            "segmentId": "avg-b13a-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 1",
            "avvikelser": [
              "Källrubriken på s. 22 har '?atta'; frågetecknet diplomatariskt återgivet som [Þ]."
            ]
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 2 (Ekhuggning, undervid och besiktning vid stubben)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. Huggær maþær ek þa sum aldin bær oloewændiss. þa ær han sakar at sex örom. Huggær. han þrear ællær þrim flerra. þa ar þæt þrænni saxtanörtogha sak. Huggir vndir uiþu þa ær þæt atta örtogho sak. vtan skoghær se lagaþer i hæræz ræpst. þa böte. þrænni örtoghær.",
            "tolkning": "2. Hugger en man en ek som bär ollon utan lov, då är han förfallen till sex örar. Hugger han tre eller fler än tre, då är det en sak om tre sextonörtugar. Hugger han undervid (småträd), då är det en sak om åtta örtugar, såvida icke skogen är fredad genom häradsräfst; då böte han tre örtugar.",
            "kommentar": "aldin bær: bär ollon (ollonskog/ekeskog åtnjöt särskilt rättsskydd för svinbetet). sex örom: 6 örar (18 örtugar) för enstaka ek; 3 sextonörtugar (48 örtugar = 6 marker) för tre eller fler ekar. vndir uiþu: undervid, buskar eller mindre träd. hæræz ræpst: häradsräfst, allmän domstolsrannsakning.",
            "segmentId": "avg-b13a-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 2"
          },
          {
            "fsv": "§.1. Möter maþær manni hauir fang læst. klandær firi hanum. kallær sin væræ. beþiss til stums at faræ. þa skal han fylghiæ. ær han sandær at sak böte atta örtoghær saksöke enom firir vndiruiþ ok sax öræ firir aldinuid syn han til stums at faræ. þa ær þæt rætlösæ.",
            "tolkning": "§ 1. Möter en man en man som har ett trälass och klandrar inför honom och säger det vara sitt, och begär att fara till stubben: då skall han följa med. Är han sann till saken, böte han åtta örtugar till målsäganden ensam för undervid och sex örar för ollonträd; nekar han att fara till stubben, då är det rättslöshet.",
            "kommentar": "til stums at faræ: fara till stubben för okulärbesiktning på plats i skogen för att passa samman virket på lasset med den fällda trädstubben. syn han til stums at faræ: vägran att låta besiktiga stubben betraktas som trotsig rättslöshet (rætlösæ).",
            "segmentId": "avg-b13a-punkt02-seg002",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 2 § 1"
          },
          {
            "fsv": "§.2. Takar maþær man i skoghi sinum. þræl ællær. legho man. taki af hanum öxse ællær öknöte. þæt ær fiærme ær. Takær maþær viþ stuf bondæ ællær bondæ sun. þa a sa fang ær eghur .a. taki af hanum fang at saklösu. söke sydæn vm skoghær hug æn han uil.",
            "tolkning": "§ 2. Griper en man en man i sin skog, en träl eller legoman: tage han från honom yxan eller dragaren, det som är förmer (värdefullare). Griper man en bonde eller bondeson vid stubben, då äger skogsägaren virket; han tage virket från honom saklöst och söke honom sedan för skogshugg om han vill.",
            "kommentar": "Rätt till omedelbar kvarstad/pant i gärningsmannens verktyg eller dragare när en ofri eller legoman påträffas på bar gärning i skogen. Påträffas en fri bonde eller bondeson återtages endast virket och talan väcks på tinget.",
            "segmentId": "avg-b13a-punkt02-seg003",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 2 § 2"
          },
          {
            "fsv": "§.3. Akær maþær gönom skogh manz. bræstær axsul manz. ællær andurstang huggi at saklösu bæþi.",
            "tolkning": "§ 3. Kör en man genom en annans skog och brister hans axel eller lundstång: hugge han bådadera saklöst.",
            "kommentar": "Nödrätt vid färd genom annans skog: den resande har rätt att strafffritt fälla virke för att reparera trasig hjulaxel (axsul) eller vagnstång (andurstang).",
            "segmentId": "avg-b13a-punkt02-seg004",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 2 § 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 3 (Åverkan på dragdjur, åkdon, båtar och redskap)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Takar maþær a andrum dæghi hæst ællær. oxsæ wang allær slæþæ skip stiornfast molkær. ko manz. all þe æru full fornæmi skal bötæ firi sax öræ. öre firi ekiu. tua firi tagbændu. half mark firi siværings bat. örtogh firi riuu. firi tuar. tvar örtoghær. firi þreær allær þrim fleræ. þæt ær fult fornæmi sax öræ.",
            "tolkning": "3. Tager en man på annandagen häst eller oxe, vagn eller släde, roddbåt som ligger förtöjd, eller mjölkar en mans ko: alla dessa äro fulla åverkanssaker; han skall böta sex örar. En öre för åkerharv (ekiu), två för repbunden sele (tagbændu), en halv mark för sexmansbåt (siværings bat), en örtug för räfsa, för två räfsor två örtugar, för tre eller fler än tre räfsor: det är fullt förnäm, sex örar.",
            "kommentar": "full fornæmi: full åverkan / olovligt brukande belagt med 6 örar (18 örtugar). Detaljerad bötestaxa för olika lantbruks- och sjöfartsredskap: ekiu (harv/sladd), tagbændu (repsele/tågband), siværings bat (sexmansbåt med tre par åror) och riuu (räfsa).",
            "segmentId": "avg-b13a-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 4 (Körning över oslagen äng och sörgate)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Akær maþær iuir æng uslægnæ. allær ivir akar siþæn vp ær runnit. böte örtogh firi huart hiul. Akær annut sinni böte þrænni sextanörtoghor. þy at þa hetir sörgatæ.",
            "tolkning": "4. Kör en man över oslagen äng eller över åker sedan säden har skjutit upp: böte en örtug för varje hjul. Kör han en andra gång, böte tre sextonörtugar, emedan det då heter sörgata (sörspår).",
            "kommentar": "uslægnæ: oslagen slåtteräng. vp ær runnit: grödan har grott och skjutit upp. firi huart hiul: en örtug per vagnshjul (vanligen 4 örtugar för fyrhjulig vagn). sörgatæ: uppkörd och nedtrampad väg genom växande gröda; upprepad körning betraktas som grov åverkan belagd med 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13a-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 4"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 5 (Gärdesgårdsvirke, nedrivning före skörd och fäskada)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Takar maþær garþ manz gialdi firi þrænni saxtanörtoghor. Takar maþær fang manz huggin i skoghi ællær annærstaþ. gialdi þranni saxtanörtoghær. æn han falz at.",
            "tolkning": "5. Tager en man en annans gärdesgårdsvirke, gälde tre sextonörtugar. Tager en man en annans virke som är hugget i skogen eller annorstädes, gälde tre sextonörtugar om han fälles därtill.",
            "kommentar": "Stöld eller olovligt tillgrepp av virke ur uppförd gärdesgård eller hugget virke i skog. Boten är 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13a-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 5"
          },
          {
            "fsv": "§.1. [Þ]æn sum förir sin gar af akrum fyr æn burghit ær gialdi aptær allæn þæn scaþ. þær gangær gönum ok a ovan þrænni saxtanörtoghor þem enum skaþæn far eigh conongi. eigh allum mannum.",
            "tolkning": "§ 1. Den som river ned sitt gärde från åkrarna innan säden är bärgad, ersätte all den skada som sker därigenom, och därutöver tre sextonörtugar till honom ensam som lidit skadan, icke till konungen och icke till allmogen.",
            "kommentar": "fyr æn burghit ær: innan skörden är bärgad från samfällda åkrar. Otidigt nedrivande av stängsel leder till skadeståndsansvar samt full bot som odelat tillfaller målsäganden. Textkritisk notis: Källan har '?æn sum förir' på s. 22 rad 26; återgivet som [Þ]æn sum förir.",
            "segmentId": "avg-b13a-punkt05-seg002",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 5 § 1",
            "avvikelser": [
              "Källtexten har '?æn' på s. 22 rad 26; frågetecknet återgivet som [Þ]."
            ]
          },
          {
            "fsv": "§.2. Brytær maþær annars garþ far bonde skaþæ gönom gialdi hin ær bröt atta örtoghær hællær hin ær garþ a. æn han findær eigh hin ær bröt.",
            "tolkning": "§ 2. Bryter en man en annans gärdesgård så att bonden lider skada därigenom, gälde den som bröt åtta örtugar, eller ock den som äger gärdet om han icke finner den som bröt.",
            "kommentar": "Skada orsakad av stängselbrott. Gärningsmannen bötar åtta örtugar; kan gärningsmannen inte anträffas svarar gärdesgårdens ägare strikt för brister i stängselhållet.",
            "segmentId": "avg-b13a-punkt05-seg003",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 5 § 2"
          },
          {
            "fsv": "§.3. Löpær fæ innangærþiz at helum garþi þæn sum fæ a læggi fram slikt sum han uill ok suæri æptir. mæþ eneþe sinum æn minni ær skaþi gör æn til akærlass. Kallær annær væræ meræ æn akærlass. þa gialdi atær akærlass ok eigh mera þy at meri se skaþi gör.",
            "tolkning": "§ 3. Löper fä in i gärdet över hel gärdesgård: den som äger fäet lägge fram så mycket som han vill och svärje därefter med sin ened om skadan är mindre än ett åkerlass; påstår den andre att den är mer än ett åkerlass, då gälde han åter ett åkerlass och icke mer, även om skadan vore större.",
            "kommentar": "akærlass: schablonmått och maximitak för ersättning vid kreatursskada på åker. Djurägaren svär med ened om skadans belopp.",
            "segmentId": "avg-b13a-punkt05-seg004",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 5 § 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Fornæmix sakir Punkt 6 (Åkarnam, otillåtet tjuder och nattbete i fridgärde)",
        "balkId": "B13a",
        "pdfSidor": [
          22
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Takær maþær akar nam fra kono ællær manni gialdi þrænni saxtanörtoghær. allær væri sik mæþ tylptær eþe. Akar nam skal æltæ fra manni ok eigh takæ.",
            "tolkning": "6. Tager en man åkarnam från kvinna eller man, gälde tre sextonörtugar, eller värje sig med tylfted. Åkarnam skall jagas från mannen och icke tagas med våld.",
            "kommentar": "akar nam: intagande av djur som gör skada på åker eller äng för att hållas i pant tills skadan reglerats. Våldsamt fråntagande av åkarnam är belagt med 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13a-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 6"
          },
          {
            "fsv": "§.1. Hittir maþær grip mansz a akri lysi sum aþrum þiufnæþ. gangær uid sum a löse sum annæt akarnam.",
            "tolkning": "§ 1. Finner en man en annans djur på sin åker, lyse han det såsom annan tjuvnad; vidgår ägaren detta, löse han det såsom annat åkarnam.",
            "kommentar": "Lysningsplikt vid anträffat djur på åker för att undgå beskyllning om stöld eller olaga besittning.",
            "segmentId": "avg-b13a-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 6 § 1"
          },
          {
            "fsv": "§.2. Latær maþær hæst i tiuþær a akær mansz ællær æng böte þrænni saxtanörtoghor. ællær uari sik mæþ tylptær eþe.",
            "tolkning": "§ 2. Sätter en man sin häst i tjuder på en mans åker eller äng, böte tre sextonörtugar, eller värje sig med tylfted.",
            "kommentar": "Uppsåtligt tjudrande av häst på annans gröda eller slåtteräng straffas strängt med 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13a-punkt06-seg003",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 6 § 2"
          },
          {
            "fsv": "§.3. Haldær maþær fæ sit i friþgærþi annarræ mannæ mæþ hund ok mæþ hiþæ. III. ællær III. flerre. þa væri sik mæþ tylptær eþe. þa æn han falz. þa böte þranni sæxtanörtoghær.",
            "tolkning": "§ 3. Håller en man sitt fä på andras fridlysta betesmark (friþgærþi) med hund och herde, tre eller fler än tre nätter: då värje sig med tylfted; fälles han, böte tre sextonörtugar.",
            "kommentar": "friþgærþi: fredad hägnad eller reserverat bete. Otillåten betning med vaktande hund och herde (hiþæ) under tre eller flera nätter är ett allvarligt intrång som fordrar tylfted eller 6 markers bot.",
            "segmentId": "avg-b13a-punkt06-seg004",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 6 § 3"
          },
          {
            "fsv": "§.4. Latær maþær grip sin i tiuþær vm dagh ok uarþær lös liggær a hældæ allær fiætur gangær i akær mansz ok uarþær intakin. þa löse mæþ eneþe sinum.",
            "tolkning": "§ 4. Sätter en man sitt djur i tjuder om dagen och blir det löst och ligger på grimma eller fätter, och går in i en mans åker och intages: då löse han det med sin ened.",
            "kommentar": "hældæ allær fiætur: grimma eller fotsnara/boja. Om djuret oavsiktligt slitit sig och anträffas med grimman på löses det ut med djurägarens ened (eneþe) utan böter.",
            "segmentId": "avg-b13a-punkt06-seg005",
            "kallreferens": "AVG-MASKIN s. 22, Fornæmix sakir Punkt 6 § 4"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/fornamix-balker": {
    "titel": "Fornamix bolkær",
    "underrubrik": "Äldre Västgötalagen, stängselsyn, vallhjon, jakträtt, vildbin, mordbrand och legofolk (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Sakrätt, arbetsrätt och jaktlagstiftning"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Andra avsnittet märkt 13 (Fornamix bolkær / Åverkansmål II) i Äldre Västgötalagen reglerar byalagets gemensamma hägnad, boskapsskötsel, skogsfång och arbetsavtal. Balken fastställer gärdesgårdstvång vid Kristi himmelsfärdsdag, åkerbök av svin och häst, grässätens förlust av betesrätt, prästens rätt till sockenhäst i gärdet för sockenbud (husla och olja), samt det forntida smittskyddsförbudet mot införsel av fä från Falbygden. Vidare innehåller balken den klassiska ansvarsfördelningen mellan herdens vårdslöshet (vangömsla) och övermakt (ofævli), fynd av vildbin (koppofynd), den berömda allittererande jakträttsformeln för vilt, förbud mot ekbarkning och skadegörelsebränder, herdevittnesbörd vid kadaverfynd, samt fardagar (påsk och mickelsmäss) och ömsesidiga avtalsbrottssanktioner för legofolk.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 1 (Utgärden, led och gärdesgårdssyn vid Kristi himmelsfärdsdag)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "1. Utgarþær allir ok liþ skulu uæræ firi. ok gild vm hælgha þorsdagh. Liggær lid ugilt þær ær sax öræ sak. öre firi enkæ gap a utgardhum. attæ ortoghær firi bolgar.",
            "tolkning": "1. Alla utgärden och grindar (led) skola vara för och gilda vid Kristi himmelsfärdsdag (helga torsdag). Ligger ett led ogillt, då är det en sak om sex örar; en öre för varje öppning (gap) i utgärden; åtta örtugar för bolstergärde.",
            "kommentar": "hælgha þorsdagh: Kristi himmelsfärdsdag var den lagstadgade fristen då samtliga byns inhägnader kring inägor och slåtteräng måste vara synade och iståndsatta. liþ: grind/fäled. bolgar: bolstergärde (huvudgärdesgård kring inägorna). enkæ gap: enstaka stängselöppning.",
            "segmentId": "avg-b13b-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 2 (Hästvältrande och svinbök i uppkommen säd)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "2",
        "meningar": [
          {
            "fsv": "2. Væltær hestær. rotær svin a akri vprunnum. bote firir slickt korn sum a ær sat. skæppv firir huæriæ þriðiu valtran ællær þriþiu rotæn.",
            "tolkning": "2. Vältrar sig häst eller rotar svin i uppkommen åker: böte med samma slags korn som där är sått, en skäppa för var tredje vältrande eller var tredje bökning.",
            "kommentar": "akri vprunnum: åker där sädden grott och skjutit strå. skæppv: skäppa (fornsvenskt spannmålsmått). Ersättning in natura med samma kornslag för tramp- och bökskador.",
            "segmentId": "avg-b13b-punkt02-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 3 (Grässäte och förlust av betesrätt)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "3",
        "meningar": [
          {
            "fsv": "3. Sitær græssæti i by mansz a hvarti i garþum allær lidum eigh eng ok eigh akær. þa a han eigh mæþ laghum utængarz at hawæ nokot þæt ær kuikændis ær num han sæki sik at þrænnisaxtanörtoghum.",
            "tolkning": "3. Sitter en grässäte (inhyseshjon utan jord) i en mans by och äger varken i gärden eller led, varken äng eller åker: då har han icke enligt lag rätt att ha något kreatur utom gärdesgården, såvida han ej vill plikta tre sextonörtugar (sex marker).",
            "kommentar": "græssæti: grässäte, jordlös person eller inhysing som bebor stuga på annans tomt utan odelsandel i byns mark. Betesrätten på byns utmark tillkommer uteslutande hemmansägare; olovlig betning straffas med 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13b-punkt03-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 3"
          }
        ]
      },
      {
        "rubrik": "Sektion 04",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 4 (Tjuderfä och prästens sockenhäst)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "4",
        "meningar": [
          {
            "fsv": "4. Eig a tiuþærfæ i gærþi at gangæ ulowandiss num han sæki sik viþ allæ grannæ at attaörtoghum.",
            "tolkning": "4. Inget tjuderfä har rätt att gå i gärdet utan lov, såvida han ej vill plikta mot alla grannarna med åtta örtugar.",
            "kommentar": "Förbud mot att släppa tjudrat fä i byns inhägnad utan samfällt grannelov; boten är 8 örtugar.",
            "segmentId": "avg-b13b-punkt04-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 4"
          },
          {
            "fsv": "§.1. Præstær a meþ laghum en hæst i garþi at havæ firi þy. at han skal i sokn riþæ æn braþlikæ kumæ buþ bondæ at huslæ allær oliæ.",
            "tolkning": "§ 1. Prästen har enligt lag rätt att ha en häst i gärdet, emedan han skall rida i socknen om det hastigt kommer bud från en bonde för att ge sista smörjelsen eller bereda till döden (husla eller olja).",
            "kommentar": "huslæ: ge sakramentet / sista nattvarden (viaticum). oliæ: ge sista smörjelsen (unctio extrema). Prästens pastorala plikt vid dödsbud ger honom laglig dispens att hålla beteshäst redo inom byns hägn.",
            "segmentId": "avg-b13b-punkt04-seg002",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 4 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 05",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 5 (Inköp av fä från Falbygden och smittskydd)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "5",
        "meningar": [
          {
            "fsv": "5. Chöper man fæ af falby. vrakær hem vlowandisz grannum þa skal niþær guggæ sum stæþær.",
            "tolkning": "5. Köper en man fä från Falbygden och driver hem utan lov från grannarna: då skall det huggas ned där det står.",
            "kommentar": "falby: Falbygden. niþær guggæ: huggas ned / avlivas direkt på stället. Ett av Nordens tidigaste veterinärmedicinska smittskyddsstadganden för att hindra spridning av boskapspest och mjältbrand genom okontrollerad djurflytt.",
            "segmentId": "avg-b13b-punkt05-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 5"
          }
        ]
      },
      {
        "rubrik": "Sektion 06",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 6 (Ansvarsfördelning för fä: vårdslöshet gentemot övermakt)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "6",
        "meningar": [
          {
            "fsv": "6. Foþær fæ ok leghu fæ tækkiu fæ ok nam fæ. þy skal warþæ firi aldri vangömslu. fult ok klaui. byargh ok bro. vatn ok dy. varghi ok þiuvi. þæssi æru al wangömslæ. þem skal aptær bötæ mæþ typltær eþe.",
            "tolkning": "6. Foderfä och legofä, tackfä (mottaget fä) och namfä (pantfä): för dessa skall man svara mot all vårdslöshet (vangömslu). Fåll och klave, berg och bro, vatten och gyttja (dy), varg och tjuv: alla dessa äro vårdslöshet; för dem skall man ersätta med tylfted.",
            "kommentar": "Klassisk uppräkning av förmögenhetsrättsliga skadefall som tillskrivs herdens eller fodervärdens culpa/vårdslöshet (wangömslæ). Vargangrepp och drunkningsolyckor presumeras bero på bristande tillsyn.",
            "segmentId": "avg-b13b-punkt06-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 6"
          },
          {
            "fsv": "§.1. Firi ofævli skal eigh warþæ. þæssi æru ofævli asikkiæ. eldær. raan byorn. stingær ok starui.",
            "tolkning": "§ 1. För övermakt (ofævli) skall man icke svara; dessa äro övermakt: blixtnedslag (asikkiæ), eldsvåda, rån, björn, stingsjuka och svält/farsot (starui).",
            "kommentar": "ofævli: force majeure / oundviklig övermakt som befriar från skadeståndsansvar. asikkiæ: blixtnedslag (egentligen 'as-syn/asablot', gudsdom). björn (som ansågs oövervinnelig för herden), rån och dödliga epidemier.",
            "segmentId": "avg-b13b-punkt06-seg002",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 6 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 07",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 7 (Koppofynd, den klassiska jakträttsformeln och falkjakt)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "7",
        "meningar": [
          {
            "fsv": "7. Hittir maþær koppo fund a annærs mansz éng sæmbær þem .a. þa a halft sa ær stok hitti ok halft sa ær aghu a. Skil þem a þa a sar uitu ær æng a suæriæ mæþ tylptær eþe ok tuæggiæ mannæ vittum at stok þænnæ þu klandær mærkti iak fyrræ. þy a iak ok þv eigh.",
            "tolkning": "7. Finner en man ett koppofynd (vildbisvärm i ihåligt träd) på en annans äng och enas de därom, då äger den hälften som fann stocken och den hälften som äger marken. Skiljer dem åt, då har ängsägaren vittnesföreträde att svärja med tylfted och två mäns vittne att 'denna stock som du klandrar märkte jag förr; därför äger jag och du icke'.",
            "kommentar": "koppo fund: fynd av vilda bin och honung i ihåligt träd (kopp). Hälftendelning mellan upphittare och markägare om sämja råder; eljest vittnesföreträde för markägaren.",
            "segmentId": "avg-b13b-punkt07-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 7"
          },
          {
            "fsv": "§.1. [Þ]æn a hæræ ær hændir þæn a ræf ær refer. þæn a vargh ær vinþær þæn a biorn ær betir þæn a ælgh ær fællir. þæn a otær ær or a taker.",
            "tolkning": "§ 1. Den äger hare som fångar (händer); den äger räv som river; den äger varg som övervinner; den äger björn som biter (sårar först); den äger älg som fäller; den äger utter som tager ur å.",
            "kommentar": "Den odödliga fornsvenska allittererande jakträttsformeln som fastställer tillägnelsekriterierna för vilt. Textkritisk notis: Källan har '?æn a hæræ' på s. 23 rad 20; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna.",
            "segmentId": "avg-b13b-punkt07-seg002",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 7 § 1",
            "avvikelser": [
              "Källtexten har '?æn a hæræ' på s. 23 rad 20; frågetecknet diplomatariskt återgivet som [Þ]."
            ]
          },
          {
            "fsv": "§.2. Hittir þæn koppofund ær. a lagha lot i skoghæ haui allæn koppofund eghi ma huggæ ek niþ vtæn grannæ lof. Hittir maþær hökæ a skoghi sinum allær a almanningi bindær værpplæ vm fötær eig ma annær bort takæ num han sæki sik at þrænni sæxtanörtoghum.",
            "tolkning": "§ 2. Finner den ett koppofynd som äger laga lott i skogen, have han hela koppofyndet; dock må han icke hugga ned ek utan grannars lov. Finner en man hökar i sin skog eller på allmänning och binder varplar (fotremmar) om fötterna: då må ingen annan taga bort dem, såvida han ej vill plikta tre sextonörtugar.",
            "kommentar": "værpplæ: varplar, läderremmar om fötterna på unga jaktfalkar i boet som tecken på inmutning för falkjakt. Stöld av märkt falkunge bötar 3 sextonörtugar (6 marker).",
            "segmentId": "avg-b13b-punkt07-seg003",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 7 § 2"
          }
        ]
      },
      {
        "rubrik": "Sektion 08",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 8 (Barka ollonbärande ek och undervid)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "8",
        "meningar": [
          {
            "fsv": "8. Flar maþær enæ ek aldinbæræ i skoghe manss. þæt ær sæx öra sak hæn han kombær eigh. dulum viþ. Flar maþær þreæ. allær. III. flere þæt ær. þrænni saxtanörtoghæ sak. Flar vndirviþv til las. viþær þæt ær. sax öræ sak. Flar han. III. lass allær. III. flerre böte þrannisæxtanörtoghær. Kvæþæer maþær ne viþ þa skal hanum uisa siunatting. væri sik mæþ tolf mannum.",
            "tolkning": "8. Flår (barkar) en man en ollonbärande ek i en mans skog, det är en sak om sex örar om han icke förnekar det. Flår en man tre eller fler än tre, det är en sak om tre sextonörtugar. Flår han undervid till ett lass virke, det är en sak om sex örar; flår han tre lass eller fler än tre, böte han tre sextonörtugar. Säger en man nej därtill, då skall man sätta sjunattastämma för honom; värje sig med tolv män.",
            "kommentar": "flar: flår, avbarkar ek för garvämnen (vilket dödade trädet och förstörde ollonbetet). Boten graderas från 6 örar till 3 sextonörtugar (6 marker) med tolvmannaned vid förnekande.",
            "segmentId": "avg-b13b-punkt08-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 8"
          }
        ]
      },
      {
        "rubrik": "Sektion 09",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 9 (Skadegörelsebränder på hö, kvarnar, broar och virke)",
        "balkId": "B13b",
        "pdfSidor": [
          23
        ],
        "kallpunkt": "9",
        "meningar": [
          {
            "fsv": "9. Brænnir maþær hö manss a æng vti. þæt ær rætlösæ. þa skal sökiæ til mæþ sivnattingi hin skal variæ sik mæþ tylptar eþe. ok tvæggiæ mannæ vittnum. at iak brændi eigh hö þit ok eigh ær iak sanþær at sak þerre þu giuær mær.",
            "tolkning": "9. Bränner en man en mans hö ute på äng, det är rättslöshet (våldsdåd). Då skall man söka med sjunattastämma; den andre skall värja sig med tylfted och två mäns vittne: att 'jag icke brände ditt hö och icke är jag sann till den sak som du tillmäler mig'.",
            "kommentar": "Mordbrand på höstackar ute på slåtteräng betraktas som grovt våldsdåd (rætlösæ) som fordrar tylfted och två vittnen.",
            "segmentId": "avg-b13b-punkt09-seg001",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 9"
          },
          {
            "fsv": "§.1. sva ær vm al þy mal annur æn brænnir mylnu ællær v fiskigarþ. risgarþ. bro ællær fang manss huggin i skoghe. þæt ær alt rætlösæ. þæt skal alt aftær gialdæ mæþ suornom eþe. at þæt var eigh bætræ ok ouan a þranisaxtanörtoghær.",
            "tolkning": "§ 1. Likaså är om alla andra sådana mål, om man bränner kvarn eller fiskegård, risgärde, bro eller en mans virke hugget i skog: det är allt rättslöshet; allt detta skall gäldas åter med svuren ed att det icke var bättre (värderingsed), och därutöver tre sextonörtugar.",
            "kommentar": "Uppsåtlig brand på vattenverk, gärden, broar eller virke medför skadeersättning fastställd med ed samt 3 sextonörtugar (6 marker) i bot.",
            "segmentId": "avg-b13b-punkt09-seg002",
            "kallreferens": "AVG-MASKIN s. 23, Fornamix bolkær Punkt 9 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 10",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 10 (Rovdjursangrepp, herdeansvar och avläster)",
        "balkId": "B13b",
        "pdfSidor": [
          23,
          24
        ],
        "kallpunkt": "10",
        "meningar": [
          {
            "fsv": "10. Takæ diur fæ fran hirþingiæ far eigh aflæstir aftær hætti viþ sva mykli leghu sum han skuldi hauæ firi þæt fæ far han aflæstir aftær vari saklös.",
            "tolkning": "10. Taga vilda djur fä från en herde och får han icke lämningar (avläster/kadaverdelar) åter: böte han med så mycket i lön som han skulle ha för det fäet; får han lämningar åter, vare han saklös.",
            "kommentar": "aflæstir: avläster (rester, skinn, öron eller ben av det rivna djuret som bevisar att det fallit offer för rovdjur). Får herden inte fram avläster dras skadan från hans lön.",
            "segmentId": "avg-b13b-punkt10-seg001",
            "kallreferens": "AVG-MASKIN s. 23–24, Fornamix bolkær Punkt 10"
          },
          {
            "fsv": "§.1. Liggær fæ i dyæ döt. þa skal hirþingi staf sin hos stingæ hat sin vndir hovoþ læggiæ. allær kapu. allær. ris. vnþir brytæ. þær skulu vittni bæræ at vangömslæ hans gek eigh at.",
            "tolkning": "§ 1. Ligger fä dött i dy (kärr): då skall herden sticka sin stav bredvid, lägga sin hatt under huvudet eller kappa eller bryta ris därunder; dessa skola bära vittne om att det icke skedde genom hans vårdslöshet.",
            "kommentar": "staf sin hos stingæ... hat sin vndir hovoþ læggiæ: arkaisk bevisprocedur i skog och mark. Herden lämnar sina personliga plagg och stav vid det omkomna djuret för att säkra platsen och bevisa att han inte övergett hjorden genom vangömsla.",
            "segmentId": "avg-b13b-punkt10-seg002",
            "kallreferens": "AVG-MASKIN s. 24, Fornamix bolkær Punkt 10 § 1"
          }
        ]
      },
      {
        "rubrik": "Sektion 11",
        "hanvisning": "Cod. Holm. B 59, Fornamix bolkær Punkt 11 (Fardagar, städjeavtal, legofolk och avtalsbrott)",
        "balkId": "B13b",
        "pdfSidor": [
          24
        ],
        "kallpunkt": "11",
        "meningar": [
          {
            "fsv": "11. Laghæ stæmnudaghæer æru tver. Paskær ok mikyalsmæssæ.",
            "tolkning": "11. Laga flyttningsdagar (stämnodagar) äro två: påsk och mickelsmäss (29 september).",
            "kommentar": "Paskær ok mikyalsmæssæ: de två lagstadgade till- och frånträdesdagarna för tjänstehjon och jordbruksavtal i medeltida svensk rätt.",
            "segmentId": "avg-b13b-punkt11-seg001",
            "kallreferens": "AVG-MASKIN s. 24, Fornamix bolkær Punkt 11"
          },
          {
            "fsv": "§.1. Fæstir maþær leghoman ær eigh gangin a wist hans. þa ær þæt vitæ hans mæþ tylptær eþe. ok tvæggiæ mannæ uittnum at iak fæstis eigh mæþ þær ok ængin staþvæ giorþi iak uið. þor han eigh þæt suæriæ. luki vp sva myklæ legho sum hanum var mælt. Gangær han a uist hans ætæt nætorþ ok daghor þa kombær han eigh laghum uiþ. luki up sua myklæ legho sum hanum uar mælt. ok böte þranni þrannisaxtanörtoghær ovan a. Hvar haldær sin bonde hauir lagkklandæt sin legho man. böte þranni saxtanörtoghær.",
            "tolkning": "§ 1. Städjer en man en legodräng och har denne icke trätt i hans tjänst (vist): då är det dennes värjemål med tylfted och två mäns vittne att 'jag lejde mig icke hos dig och inget städjeavtal slöt jag med dig'. Tör han icke svärja det, gälde han så stor lön som avtalats åt honom. Har han trätt i hans tjänst och ätit kvällsmat och dagsmål, då gitter han icke avvärja med lag; gälde han så stor lön som avtalats och böte tre sextonörtugar därutöver. Håller en bonde en annans legoman som blivit lagligen klandrad, böte han tre sextonörtugar.",
            "kommentar": "ætæt nætorþ ok daghor: fullbordat tjänsteavtal genom deltagande i hushållets måltider (nattvard och dagsmål). Avtalsbrott från legodrängens sida bestraffas med förverkad lön samt 3 sextonörtugar (6 marker) i bot. Likaledes bötar den bonde som olovligen härbärgerar annans legodräng.",
            "segmentId": "avg-b13b-punkt11-seg002",
            "kallreferens": "AVG-MASKIN s. 24, Fornamix bolkær Punkt 11 § 1"
          },
          {
            "fsv": "§.2. Hætti bondi sliku samu viþær æn an vrakær bröt legho man af hæskap ok af uist sinni. Geri huemledær sik vreþæn.",
            "tolkning": "§ 2. Våge bonden detsamma om han driver bort sin legoman ur sitt hushåll och sin tjänst. Göre vemhelst sig vred därmed.",
            "kommentar": "Ömsesidigt avtalsansvar: husbonden svarar för samma påföljd om han utan laga skäl fördriver sin legoman under tjänsteåret.",
            "segmentId": "avg-b13b-punkt11-seg003",
            "kallreferens": "AVG-MASKIN s. 24, Fornamix bolkær Punkt 11 § 2"
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/lecara-raetar": {
    "titel": "Lecara rætar",
    "underrubrik": "Äldre Västgötalagen, lekarerätten och gycklares ställning (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Skymfrätt och ståndsrätt"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Fjortonde balken (Lecara rætar) i Äldre Västgötalagen reglerar gycklares, spelmännens och de kringvandrande underhållarnas rättslösa ställning i det medeltida bondesamhället. Texten fastställer att misshandel mot en lekare är ogill, och vid sårskada underkastas lekaren det berömda skymfliga provet med den nysmorda otämjda kvigan uppför backen: förmår han hålla henne i svansen under piskrappen får han behålla djuret, men gitter han icke hålla henne have han endast skam och skada.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Lecara rætar (Lekarerätten och den smorda kvigans svans)",
        "balkId": "B14",
        "pdfSidor": [
          24
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "[Þ]attæ ær lecara rætar. Uarþær lekæri barþær þæt skal e vgilt uaræ. Varþær lekari sargaþær þen sum mæþ gihu gangar allær mæþ fiþlu far allær bambu. þa skal kuighu taka otamæ ok flytiæ up a bæsing. þa skal alt har af roppo rakæ. ok siþæn smyriæ. þa skal hanum fa sko nysmurþæ. þa skal lekærin takæ quighuna vm roppo. maþær skal til huggæ mæþ huassi gesl. Gitær han haldit. þa skal han hauæ þæn goþa grip. ok niutæ sum hundær græss. Gitær han eigh haldit. havi ok þole þæt sum han fek skama ok skaþæ biði alþrigh halldær ræt æn huskonæ hudstrukin. E. a variændi vit ok skyldæsti arf at takæ.",
            "tolkning": "Detta är lekarerätten. Varder en lekare (gycklare/spelman) slagen, skall det städse vara ogillt (utan mansbot). Varder en lekare sårad, den som går med giga eller far med fela eller trumma: då skall man taga en otämjd kviga och föra upp på en backe (bäsäng). Då skall man raka allt håret av svansen och sedan smörja den. Då skall man ge honom nysmorda skor. Då skall lekaren fatta kvigan om svansen; en man skall tillhugga med en vass piska. Gitter han hålla henne, då skall han ha den goda klenoden och njuta den såsom hund njuter gräs. Gitter han icke hålla henne, have och tåle det som han fick: skam och skada; bedje aldrig mer om rätt än en hudstruken frilla. Städse har svaranden vittnesbörd och den närmast skylde rätt att taga arv.",
            "kommentar": "lekæri: lekare, gycklare eller kringvandrande musiker (gihu = giga, fiþlu = fela, bambu = trumma). Dessa saknade ätteskydd och åtnjöt ingen mansbot (vgilt). Den förnedrande ceremonin med den rakade och smorda kvigsvansen (roppo) uppför kullen och talesättet 'niutæ sum hundær græss' understryker lekarnas sociala och rättsliga utanförskap i landskapslagarna. Textkritisk notis: Rubriken inleds med '?attæ ær lecara rætar' på s. 24 rad 14; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna.",
            "segmentId": "avg-b14-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 24, Lecara rætar",
            "avvikelser": [
              "Källrubriken på s. 24 har '?attæ ær lecara rætar'; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/conongs-balker": {
    "titel": "Conongs bolkær",
    "underrubrik": "Äldre Västgötalagen, landamäret mot Danmark och Danaholmen (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Statsrätt och gränstraktat"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Femtonde balken (Conongs bolkær) i Äldre Västgötalagen innehåller det berömda landamäret mellan Sverige och Danmark — en av Nordens äldsta bevarade gränstraktater. Texten skildrar hur kung Emund Slemme i Uppsala och Sven Tveskägg i Danmark lät tolv nämndemän från de svenska och danska landskapen sätta sex gränsstenar från Södra åsen till Brömsebro mellan Blekinge och Möre, samt reglerar Danaholmens delning mellan Sveariket, Danmark och Norge där danakonungen höll den svenske kungens betsel och den norske kungen hans stigbygel.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Conongs bolkær (Gränsdragningen mellan Sverige och Danmark samt Danaholmen)",
        "balkId": "B15",
        "pdfSidor": [
          24
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "[Þ]ættæ ær conongs bolkær. Emundær slemæ var conongær i vpsalum ok sven tiuguskiæg i dan mark. þer sattu ristir mællir sverikis ok danmark. þa næmdus af sweriki. cakaldi af tindæ landi. Botn af fiærðrundæ landi. Gasi af væstmannæ landi. Grimaldi af östrægötlandi. Nænnir af smalandum. Thorsten af væstrægiötlandi. Tolle af iutlandi. Toti ok toki af iutlandi. Gymkil af sialandi. Dan af skani. Grimtun af hallandi. þer tolf sættu sæx stenæ mællir rikiænnæ. Fyrsti sten a suntrv asi. Annær i danæbæc. [Þ]ridþi kinnæ sten. Fiarði i uracsnæsi. Fæmti hvitæ sten. Sætti brimsæ sten. mællir blecongs. ok möre. Danæ holmbær ær skiptær i þre löte. A en lot vpsalæ conongær. Annæn a dana conongær. [Þ]ridþiæ lot a noregs conongær. da ær stæmnæ þerræ vær. þa hælt danæ conongær i beszle vpsalæ conongsz. Æn noræn conongær i istæd hans.",
            "tolkning": "Detta är Konungsbalken. Emund Slemme var konung i Uppsala och Sven Tveskägg i Danmark; de satte gränsmärken mellan Sverige och Danmark. Då nämndes från Sverige: Kakaldi från Tiundaland, Botn från Fjärdhundraland, Gase från Västmanland, Grimalde från Östergötland, Nänner från Småland, Torsten från Västergötland. Tolle från Jylland, Tote och Toke från Jylland, Gymkil från Själland, Dan från Skåne, Grimtun från Halland. Dessa tolv satte sex stenar mellan rikena: Första stenen på Södra åsen; den andra i Danabäck; den tredje Kinnasten; den fjärde i Vraknes; den femte Vita sten; den sjätte Brimsesten, mellan Blekinge och Möre. Danaholmen är skiftad i tre lotter: En lott äger Uppsala konung; en annan äger danakonungen; den tredje lotten äger Norges konung. Då det var deras stämma, då höll danakonungen i Uppsala konungs betsel, och den norske konungen i hans stigbygel.",
            "kommentar": "Landamäret mellan Sverige och Danmark (Danaholmsöverenskommelsen). Texten åberopar kungarna Emund Slemme och Sven Tveskägg samt tolv gränsgörare (sex svenska från folklanden och Götalandskapen och sex danska). De sex gränsstenarna sträcker sig från väster till öster: Suntrv as (Södra åsen i Halland/Småland), Danæbæc, Kinnæ sten, Uracsnæs, Hvitæ sten samt Brimsæ sten (Brömsebro mellan det danska Blekinge och det svenska Möre). Vid Danaholmen i Göta älvs mynning möttes de tre rikena. Textkritisk notis: Rubriken och två meningar har frågetecken i källan: '?ættæ ær conongs bolkær' (s. 24 rad 22), '?ridþi kinnæ sten' (s. 24 rad 28) och '?ridþiæ lot' (s. 24 rad 30); samtliga diplomatariskt återgivna som [Þ].",
            "segmentId": "avg-b15-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 24, Conongs bolkær",
            "avvikelser": [
              "Källtexten har '?ættæ', '?ridþi' och '?ridþiæ' på s. 24 rad 22, 28 och 30; samtliga frågetecken diplomatariskt återgivna som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/aldre-vastgotalagen/horo-thing-lot": {
    "titel": "Horo þing lot skal skiptæ",
    "underrubrik": "Äldre Västgötalagen, tingslott och bonens skifte (Cod. Holm. B 59)",
    "kallaId": "AVG-MASKIN",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Holm. B 59"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1280"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag / Förvaltningsrätt och tingstaxor"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Äldre västgötska"
      },
      {
        "nyckel": "Utgåva",
        "varde": "Schlyter, SSGL I / Delsing"
      }
    ],
    "ingress": "Sextonde balken (Horo þing lot skal skiptæ) i Äldre Västgötalagen avslutar själva lagtexten med stadganden om hur tingslotten och allmänna pålagor fördelas mellan Västergötlands åtta traditionella bon och härader vid allramannatinget. Texten innehåller bland annat den kulturhistoriskt ovärderliga bestämmelsen att Skåningsborna uppbär Dalbons lott emedan de ha skyldighet att underhålla och täcka domkyrkan i Skara ('firi at þer sculu crakæ ok flacæ mariu kirkiu i skarum').",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Horo þing lot skal skiptæ (Tingslott och bonens skifte vid allramannatinget)",
        "balkId": "B16",
        "pdfSidor": [
          24,
          25
        ],
        "kallpunkt": "1",
        "meningar": [
          {
            "fsv": "Hær sighær horo þing lot skal skiptæ bo mællum a aldræmannæ þingi. Vaðsbo. þæt ær helt bo. takar slit madær sum. madær. Kinda hareð halft. bo. Valla haræd ok kakind. halft bo. takar tua löte ualla haræþ ok þridiungin cakin. Guðems bo. guðems haræd ok frökinshæræþ. halft. bo. takar fæmtungin frokinshæræd ok fiura löte. guðems hæræd. Vilshæræd ashæræd. ok mark. þæt ær halft bo. takar marc fæmtungin oc siðæn skiptis i tu mællir uilskæhæræd. ok ashæræd. Lung bo. skal skiptæ driðiungum. En þridiungin ær alfhæræd ok barcnahæræd ok laskæhæræd. taka tuæ löte barcnahæræd oc þre löte. alshæræd ok laskæhæræd. Annær þriðiungær. ær giæsini ok vidðunhæræd. ok ballæbygð. takar fæmtungin viðunhæræd. ok ballæbygð. ok fiura löte giæsini siðan takar fæmtungin ballæbygd uið viðunhæræd. [Þ]riði þriðiungær af lung bo. ær colanshæræd. oc all vtlandin. tuer löter ær colandshæræd. oc þriðiungær vt landin. Nu byriæs asbo skanungshæræd halft bo. asuhæræd. vistæhæræd ok nordal halft bo. takær nordal attundæ lot. siþan takar tua löte asuhæræd. ok driðiungin. uistahæræd. hær taka scanungs bor dalbo. lot. firi at þer sculu crakæ ok flacæ. mariu kirkiu i skarum. Nu byriæs holæsio bo. allir oc biarkæhæræd. halft. bo. floðnæhæræd. oc viniæhæræd. halft bo. Nu byriæs skalandæ bo. tuer löter. qualni ok þriðiungær. væbohæræd oc alt syndal. Nu byriæs uartoptæ bo vartoptæ hæræd halft bo. ræðuægh. ok kind halft bo. takær hwært. þerræ halft. Fyrst skiptæ. þry bo. viþ fæm bo. vartoptæ bo. guðems bo. ok lung bo. þe þry. taka halft. við hin fæm.",
            "tolkning": "Här sägs hur tingslott skall skiftas boen emellan på allramannatinget. Vadsbo, det är ett helt bo; det tar likt man för man. Kinds härad är ett halvt bo. Valle härad och Kåkind är ett halvt bo: Valle härad tar två lotter och tredingen Kåkind. Gudhems bo: Gudhems härad och Frökinds härad är ett halvt bo; Frökinds härad tar femtedelen och fyra lotter Gudhems härad. Vilske härad, Ås härad och Mark, det är ett halvt bo: Mark tar femtedelen och sedan skiftas det i två delar mellan Vilske härad och Ås härad. Lungs bo skall skiftas i tredingar: En treding är Ale härad och Barne härad och Laske härad; Barne härad tar två lotter och tre lotter Ale härad och Laske härad. Den andra tredingen är Gäsene och Veden härad och Bollebygd: Veden härad och Bollebygd tar femtedelen och fyra lotter Gäsene; sedan tar Bollebygd femtedelen mot Veden härad. Tredje tredingen av Lungs bo är Kållands härad och alla Utlanden; två lotter är Kållands härad och en treding Utlanden. Nu börjas Åsbo: Skånings härad är ett halvt bo; Åse härad, Viste härad och Nordal är ett halvt bo; Nordal tar åttonde lotten; sedan tar Åse härad två lotter och Viste härad tredingen; här tar Skåningsborna Dalbons lott, därför att de skola timra och spåna Sankta Maria kyrka i Skara. Nu börjas Hålsiö bo: Ale och Bjärke härad är ett halvt bo; Flundre härad och Väne härad är ett halvt bo. Nu börjas Skalunda bo: två lotter Kålland och en treding Vadsbo härad och hela Söndral. Nu börjas Vartofta bo: Vartofta härad är ett halvt bo; Redväg och Kind är ett halvt bo; vartdera av dem tar hälften. Först skifta tre bo mot fem bo: Vartofta bo, Gudhems bo och Lungs bo, dessa tre taga hälften mot de andra fem.",
            "kommentar": "Stadgande om fördelningen av tingslott och pålagor vid allramannatinget mellan de traditionella åtta boen i Västergötland (Vadsbo, Gudhems bo, Lungs bo, Åsbo, Hålsiö bo, Skalunda bo, Vartofta bo och Kinds/andra boindelningar). Notera den unika kulturhistoriska och kyrkliga klausulen: 'firi at þer sculu crakæ ok flacæ. mariu kirkiu i skarum' (därför att de skola timra/kräka och spåna/flaka Sankta Maria kyrka, domkyrkan i Skara). Källans inledande frågetecken '?riði' på sid. 24 rad 41 har återgetts diplomatariskt som '[Þ]riði'.",
            "segmentId": "avg-b16-punkt01-seg001",
            "kallreferens": "AVG-MASKIN s. 24–25, Horo þing lot skal skiptæ",
            "avvikelser": [
              "Källtexten har '?riði þriðiungær af lung bo' på s. 24 rad 41; frågetecknet diplomatariskt återgivet som [Þ] i enlighet med transkriptionsreglerna."
            ]
          }
        ]
      }
    ],
    "fotnoter": []
  },
  "lagar/upplandslagen/foretalet": {
    "titel": "Företalet",
    "underrubrik": "Upplandslagen (1296), Land skal mæþ laghum byggias",
    "meta": [
      {
        "nyckel": "Stadfäst",
        "varde": "1296 av kung Birger Magnusson"
      },
      {
        "nyckel": "Huvudredaktör",
        "varde": "Birger Persson (lagman)"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Klassisk uppländska"
      },
      {
        "nyckel": "Texttyp",
        "varde": "Lagföretal"
      }
    ],
    "ingress": "Upplandslagens kungliga stadfästelse och företal från 1296 är ett av den fornsvenska litteraturens främsta stilistiska monument. Företalet inleds med den berömda sentensen 'Land skal mæþ laghum byggias' och motiverar lagbokens tillkomst med att fred och rättvisa måste råda över råstyrka och godtycke. Språkligt visar texten en fulländad klassisk fornsvensk syntax med mästerlig balans mellan huvud- och bisatser, konjunktivanvändning och pregnant ordförråd.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Upplandslagens företal (Rättsprincipen)",
        "meningar": [
          {
            "fsv": "Land skal mæþ laghum byggias oc æigh mæþ wælldzs wærkum",
            "tolkning": "Land skall med lag byggas och icke med våldsverk.",
            "kommentar": "mæþ laghum: dativ pluralis av lagh styrd av mæþ i instrumentell funktion. byggias: syntetisk mediopassiv (s-passiv) i infinitiv efter hjälpverbet skal. wælldzs wærkum: dativ pluralis med genitivförled."
          },
          {
            "fsv": "Þy at þa ær landi bæzt þa ær lagh fylghias",
            "tolkning": "Ty då är det bäst för landet när lagen efterlevs.",
            "kommentar": "Þy at: kausal underordnande konjunktion ('emedan, ty'). landi: dativ singularis med benefaktiv funktion vid komparativt predikativ bæzt. fylghias: s-passiv i presens."
          },
          {
            "fsv": "En þær ængin lagh æru þa ær rangt firi rætt haldit",
            "tolkning": "Men där inga lagar finnas, där hålles orätt för rätt.",
            "kommentar": "ængin lagh: neutrum pluralis i nominativ av nekande pronomenet ængin kongruerande med lagh. firi rætt haldit: ackusativ efter firi; haldit är perfekt particip i neutrum singularis."
          },
          {
            "fsv": "Var þæt æigh lagh a landi þa hafþi hin mest sum mest matti fa",
            "tolkning": "Vore det icke lag i landet, då finge den mest som mest förmådde ta.",
            "kommentar": "Var: preteritum konjunktiv i irrealis-villkorssats. hafþi och matti: preteritum i konditionalt hypotetiskt sammanhang ('hade, förmådde')."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Upplandslagens företal (Stadfästelsen)",
        "meningar": [
          {
            "fsv": "Firi þy samnadhis allir Tiundalanz mæn Attundalanz oc Fiaþrundalanz at gæra en ræt",
            "tolkning": "Därför samlades alla män i Tiundaland, Attundaland och Fjädrundaland för att göra en gemensam lag,",
            "kommentar": "samnadhis: reflexiv/mediopassiv preteritum. Tiundalanz: genitiv singularis som attributiv förled till mæn. at gæra: infinitivfras med avsiktsbetydelse."
          },
          {
            "fsv": "oc badhu Birghir Pærs sun laghman i Tiundalandi saman læsa the gamblu lagh",
            "tolkning": "och bådo Birger Persson, lagman i Tiundaland, att sammanläsa de gamla lagarna,",
            "kommentar": "badhu: starkt verb i preteritum pluralis (av biþia). Birghir Pærs sun: ackusativobjekt med patronymikon i genitiv. the gamblu lagh: bestämd form i ackusativ pluralis neutrum med svagt adjektiv gamblu."
          },
          {
            "fsv": "oc gæra af thém allum en ræt sum skælicast var oc allum nyttokast",
            "tolkning": "och göra av dem alla en lag som skäligast var och för alla nyttigast.",
            "kommentar": "af thém allum: dativ pluralis efter af. skælicast och nyttokast: superlativer i predikativ ställning med neutrumändelse -t."
          },
          {
            "fsv": "Thænnæ ræt hafwum wi Birghir mæþ guz naþum konungær i Sweriki stadfæst",
            "tolkning": "Denna lag hava vi, Birger, med Guds nåd konung i Sverige, stadfäst.",
            "kommentar": "Thænnæ ræt: ackusativ singularis maskulinum i framställd position. hafwum wi: presens pluralis med 1 pers. pluralis-ändelse -um kongruerande med majestätssubjektet wi."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 56 och 115",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "NOR1904",
        "lokalisering": "§ 447",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 9–12",
        "stod": "analys"
      }
    ]
  },
  "lagar/upplandslagen/kyrkiu-balker": {
    "titel": "Kyrkiu balkær",
    "underrubrik": "Upplandslagen (1296), Trosbekännelse och sockenkyrka",
    "meta": [
      {
        "nyckel": "Stadfäst",
        "varde": "1296"
      },
      {
        "nyckel": "Genre",
        "varde": "Landskapslag"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Klassisk uppländska"
      },
      {
        "nyckel": "Texttyp",
        "varde": "Kyrkorätt"
      }
    ],
    "ingress": "Kyrkobalken i Upplandslagen förenar kanonisk rätt med landskapets traditionella tingstraditioner. Till skillnad från Äldre Västgötalagens mer korthuggna bestämmelser inleds Upplandslagens kyrkobalk med en utförlig och formfulländad fornsvensk trosbekännelse, följd av detaljerade bestämmelser om sockenmännens plikt att bygga och underhålla kyrka och klockstapel samt betala tionde.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Upplandslagen, Kyrkiu balkær §1 (Trosbekännelsen)",
        "meningar": [
          {
            "fsv": "Nu skulu allir mæn viþer ganga at gudh ær en oc ængin ær annar firi utan han",
            "tolkning": "Nu skola alla män erkänna att Gud är en och att ingen annan finnes utom honom.",
            "kommentar": "viþer ganga: partikelverb med betydelsen 'erkänna, bekänna'. gudh ær en: predikativ räkneordsform i maskulin nominativ. firi utan han: ackusativobjekt efter prepositionsförbindelsen."
          },
          {
            "fsv": "Han ær skapare himils oc iorþar oc allra þerra luti sum skapadir æru",
            "tolkning": "Han är skapare av himmel och jord och alla de ting som skapade äro.",
            "kommentar": "himils oc iorþar: genitiv singularis av maskulin a-stam och feminin rotstam styrda av substantivet skapare. allra þerra luti: genitiv pluralis med kongruerande pronomina. skapadir æru: passiv omsättning med particip i nominativ pluralis maskulinum."
          },
          {
            "fsv": "Þy næst skal hvar maþer troa a sancta maria guz moþor oc a alla guz hælghu mæn",
            "tolkning": "Därnäst skall var man tro på sankta Maria, Guds moder, och på alla Guds heliga män.",
            "kommentar": "troa a: prepositionsstyrning med ackusativ. guz moþor: apposition i ackusativ singularis med genitivattributet guz. alla guz hælghu mæn: ackusativ pluralis med svagt böjd adjektivform hælghu."
          },
          {
            "fsv": "I thessom troo skal hvar maþer liva oc döa oc sinom kristindomi halda",
            "tolkning": "I denna tro skall var man leva och dö och hålla sin kristendom.",
            "kommentar": "I thessom troo: dativ singularis med demonstrativt pronomen. sinom kristindomi: dativobjekt styrt av verbet halda med reflexivt possessivpronomen."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Upplandslagen, Kyrkiu balkær §2 (Sockenkyrkan och tionden)",
        "meningar": [
          {
            "fsv": "Bønder skulu kirkiu gæra up af nyiu oc halda henne viþ mæþ allom tholkom redha",
            "tolkning": "Bönder skola bygga kyrka upp av nyo och underhålla henne med alla därtill hörande ting.",
            "kommentar": "kirkiu: ackusativ singularis av svag feminin ōn-stam. henne: dativ/ackusativobjekt vid halda viþ. mæþ allom tholkom redha: dativ pluralis med instrumentell betydelse."
          },
          {
            "fsv": "Þær skal standa kirkia oc klockostapul oc præstgardher firi prestinum",
            "tolkning": "Där skall stå kyrka och klockstapel och prästgård för prästen.",
            "kommentar": "Tre samordnade subjektsled i nominativ singularis: kirkia (fem.), klockostapul (mask. a-stam) och præstgardher (mask. a-stam). firi prestinum: preposition med dativ i bestämd form."
          },
          {
            "fsv": "Prester skal messa siunga hwarn sunnodagh oc allar hælghur mæþ rætto",
            "tolkning": "Prästen skall sjunga mässa varje söndag och alla helgdagar med rätta.",
            "kommentar": "hwarn sunnodagh: tidsackusativ i maskulinum singularis (ack. av hwar och sunnodagh). allar hælghur: tidsackusativ pluralis femininum."
          },
          {
            "fsv": "Allir bönder skulu tiunda gæra af korni oc fæ oc allom tholkom arwaxt",
            "tolkning": "Alla bönder skola göra tionde av korn och boskap och all sådan årsväxt.",
            "kommentar": "af korni oc fæ: prepositionen af styr dativformerna korni (neutr.) och fæ (neutr.). arwaxt: rotstamsackusativ/dativ för skörd."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 115–120",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "NOR1904",
        "lokalisering": "§ 405–412",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "LIN2024",
        "lokalisering": "s. 14",
        "stod": "analys"
      }
    ]
  },
  "lagar/magnus-erikssons-landslag": {
    "titel": "Magnus Erikssons landslag",
    "underrubrik": "Konungabalken (omkr. 1350), Valet vid Mora sten och konungens ed",
    "meta": [
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1350"
      },
      {
        "nyckel": "Utfärdare",
        "varde": "Kung Magnus Eriksson"
      },
      {
        "nyckel": "Genre",
        "varde": "Rikslagbok"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Yngre klassisk fornsvenska"
      },
      {
        "nyckel": "Texttyp",
        "varde": "Statsrätt"
      }
    ],
    "ingress": "Magnus Erikssons landslag (omkr. 1350) är det medeltida Sveriges första riksomfattande lagbok. Konungabalken slår fast att Sveriges kungarike är ett valrike och föreskriver den ceremoniella valprocessen vid Mora sten på gränsen mellan Uppland och Södermanland. Texten visar språket vid 1300-talets mitt, där rikets samlade lagmän och allmoge ger rätten åt den nyvalde konungen under utväxlande av bindande eder.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Konungabalken §1–4 (Valet vid Mora sten)",
        "meningar": [
          {
            "fsv": "Swerikis rike ær af hedhnum oc kristnum samansat oc ær egh ærfdharike vtan valrike",
            "tolkning": "Sveriges rike är av hedningar och kristna sammansatt och är icke ett arvsrike utan ett valrike.",
            "kommentar": "Swerikis: genitiv singularis med genitivsuffix -s. egh ærfdharike vtan valrike: predikativa nominativformer av neutrala sammansättningar med -rike."
          },
          {
            "fsv": "Nu skal konung vælia a Mora þingi firi allom landamannom",
            "tolkning": "Nu skall man välja konung på Mora ting inför alla landsmän.",
            "kommentar": "konung: ackusativobjekt framställt före infinitiven vælia. a Mora þingi: prepositionell dativfras. firi allom landamannom: dativ pluralis efter firi."
          },
          {
            "fsv": "Fyrst skal laghman af Uplandandom konung til namns næmna",
            "tolkning": "Först skall lagmannen i Uppland nämna konungen vid namn.",
            "kommentar": "laghman: maskulin nominativ singularis (subjekt). konung: ackusativ singularis (objekt). til namns: genitivfras efter til med adverbial betydelse."
          },
          {
            "fsv": "Sidhæn skulu the aþrir laghmæn saman samtykkia medh allom thera almogha",
            "tolkning": "Sedan skola de andra lagmännen samtycka tillsammans med all sin allmoge.",
            "kommentar": "the aþrir laghmæn: nominativ pluralis med bestämd artikel och numeruskongruens i predikatet skulu samtykkia. medh allom thera almogha: dativ efter medh."
          },
          {
            "fsv": "Swa skal konung taka riket mæþ them ræt sum Swerigis lagh vtuisa",
            "tolkning": "Så skall konungen mottaga riket med den rätt som Sveriges lagar utvisa.",
            "kommentar": "konung: här i nominativ med bortfallet slut-r (tidigt tecken på yngre fornsvensk förenkling). Swerigis lagh vtuisa: pluralis i subjekt och verb."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Konungabalken §5–8 (Konungens ed)",
        "meningar": [
          {
            "fsv": "Þa skal konunger swæria allom landamannom ath han skal styrkia helgho kirkio ræt",
            "tolkning": "Då skall konungen svära alla landsmän att han skall styrka den heliga kyrkans rätt,",
            "kommentar": "swæria: infinitiv av starkt verb (klass VI). allom landamannom: indirekt dativobjekt. helgho kirkio ræt: genitivattribut i svag form före ackusativobjektet ræt."
          },
          {
            "fsv": "oc halda landzsens ræt oc logh vidh hwarn man fattighan oc rikan",
            "tolkning": "och upprätthålla landets rätt och lag för var man, fattig och rik,",
            "kommentar": "landzsens: dubbelt bestämd genitivform (land-s-ens). fattighan oc rikan: starka ackusativformer av adjektiv kongruerande med hwarn man."
          },
          {
            "fsv": "oc ængin ologh a land leggia vtan medh almoghans wilia oc iatilsom",
            "tolkning": "och inga olagar lägga över landet utom med allmogens vilja och bifall.",
            "kommentar": "ængin ologh: ackusativ pluralis neutrum. almoghans wilia: genitiv singularis följt av ackusativobjekt efter medh."
          },
          {
            "fsv": "Han skal wæria riket firi vtlenzskom hærom oc vtlendskom konungom",
            "tolkning": "Han skall värja riket för utländska härar och utländska konungar.",
            "kommentar": "firi vtlenzskom hærom: dativ pluralis efter firi med separativ betydelse ('mot, för')."
          },
          {
            "fsv": "Gör han swa thydhe gudh hanum oc helgha domar sum han a hand halder",
            "tolkning": "Gör han så, hjälpe honom Gud och de heliga reliker som han håller sin hand på.",
            "kommentar": "thydhe: optativ konjunktiv i presens ('hjälpe, vare nådig'). helgha domar: nominativ pluralis av helgedomar/reliker med attribut."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "LIN2024",
        "lokalisering": "s. 9 och 14–17",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 120–125",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "WES1970",
        "lokalisering": "s. 12–15",
        "stod": "analys"
      }
    ]
  },
  "urkunder/sdhk-4512": {
    "titel": "SDHK 4512",
    "underrubrik": "Jordabytesbrev från 1339, Södermanland / Uppland",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Riksarkivet, SDHK-nr 4512"
      },
      {
        "nyckel": "Datering",
        "varde": "1339–1340"
      },
      {
        "nyckel": "Genre",
        "varde": "Medeltidsbrev / Diplom"
      },
      {
        "nyckel": "Språk",
        "varde": "Klassisk fornsvenska"
      }
    ],
    "ingress": "Diplomet SDHK 4512 upprättades vid ett jordabyte mellan frälsemän i östra Mellansverige under kung Magnus Erikssons regeringstid (omkr. 1339). Texten ger ett autentiskt prov på den klassiska fornsvenskans formella kanslispråk, där noggrannhet i gränsdragningar, rättsliga förbehåll och garantier krävde en exakt kasusböjning och en väl inarbetad rättsretorik.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "SDHK 4512 (Inledning och bytesgods)",
        "meningar": [
          {
            "fsv": "Allom them thetta bref see ælla høra helsar jak Karl i Holmum æwinnelica medh warom herra",
            "tolkning": "Alla dem som ser eller hör detta brev hälsar jag, Karl i Holm, evinnerligen med Vår Herre.",
            "kommentar": "Allom them: dativ pluralis som direkt objektsform vid hälsningsverbet. thetta bref: ackusativ singularis neutrum vid see ælla høra. medh warom herra: dativ efter medh."
          },
          {
            "fsv": "Gør jak them allom witerlikt ath jak hafwir gort eeth laghlikt iordhabyti medh heþerlikom manne Peter i Aaby",
            "tolkning": "Gör jag för dem alla veterligt att jag har gjort ett lagligt jordabyte med hederlige mannen Peter i Åby,",
            "kommentar": "them allom: dativ. laghlikt iordhabyti: ackusativ singularis neutrum. heþerlikom manne: dativ singularis maskulinum efter medh."
          },
          {
            "fsv": "swa ath jak hafwir latit hanum mina iordh i Westraby medh husum oc akrom oc ængium",
            "tolkning": "så att jag har lämnat honom min jord i Västraby med hus, åkrar och ängar,",
            "kommentar": "mina iordh: ackusativ singularis femininum. medh husum oc akrom oc ængium: klassisk dativ pluralis med ändelsen -um efter medh."
          },
          {
            "fsv": "oc i fyllistu ther firi takit hans gooz i Østraby medh allom tholkom tillaghum sum ther til høra",
            "tolkning": "och till fullo därför tagit hans gods i Östraby med alla sådana tillägor som därtill hör.",
            "kommentar": "i fyllistu: dativ efter i. hans gooz: ackusativ singularis neutrum. medh allom tholkom tillaghum: dativ pluralis femininum."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "SDHK 4512 (Avhändelse och fastebrev)",
        "meningar": [
          {
            "fsv": "Thy afhænder jak thetta fornæmpda gooz mik oc minom arfwom oc tileghnar thet fornæmpdom Peter",
            "tolkning": "Därför avhänder jag mig och mina arvingar detta förenämnda gods och tillägnar det förenämnde Peter,",
            "kommentar": "afhænder: partikelverb med reflexivt pronomen mik och minom arfwom i dativ. fornæmpda gooz: ackusativ neutrum."
          },
          {
            "fsv": "til æwærdhelica ægho fritt oc ohindrat firi hwarss mans aatal",
            "tolkning": "till evärdlig ägo, fritt och ohindrat för var mans klander.",
            "kommentar": "til æwærdhelica ægho: prepositionen til med bibehållen genitiv/ackusativkonstruktion. hwarss mans: genitiv singularis vid aatal."
          },
          {
            "fsv": "Oc hemolar jak hanum thetta sama gooz firi allom theskyns krafum æpther landzins laghum",
            "tolkning": "Och hemlar jag honom detta samma gods mot alla slags krav efter landets lagar.",
            "kommentar": "hemolar: juridiskt fackverb ('garantera äganderätt'). firi allom theskyns krafum: dativ pluralis. æpther landzins laghum: dativ pluralis efter æpther."
          },
          {
            "fsv": "Til thess meræ wisso hafwa wi bedhit hæredzhøfþingan hengia sith insigle firi thetta bref",
            "tolkning": "Till dess mera visso hava vi bett häradshövdingen hänga sitt sigill för detta brev.",
            "kommentar": "Til thess meræ wisso: fast bekräftelseformel i genitiv singularis. sith insigle: ackusativ neutrum."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "DFA2009",
        "lokalisering": "s. 4–8 och 31",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "NYL2015",
        "lokalisering": "s. 6–10",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "ALL2023",
        "lokalisering": "s. 5–12",
        "stod": "analys"
      }
    ]
  },
  "urkunder/sdhk-1121": {
    "titel": "SDHK 1121",
    "underrubrik": "Gåvobrev (SDHK 21846 / Nylinder 2015), Bengta Eriksdotters donation till Uppsala domkyrka",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Riksarkivet, pergament"
      },
      {
        "nyckel": "Datering",
        "varde": "18 oktober 1432"
      },
      {
        "nyckel": "Utfärdare",
        "varde": "Bengta Eriksdotter i Stockholm"
      },
      {
        "nyckel": "Genre",
        "varde": "Gåvobrev / Diplom"
      },
      {
        "nyckel": "Språk",
        "varde": "Yngre fornsvenska"
      }
    ],
    "ingress": "Detta gåvobrev från 1432 (utgivet och analyserat av Nylinder 2015 utifrån Riksarkivets original) uppvisar en dramatisk brytningstid i det svenska språksystemet. Änkan Bengta donerar sitt stenhus vid Skomakarporten och en trädgård i Staffan Grytgjutaress gränd i Stockholm till Uppsala domkyrka mot livstidsförsörjning (en läst korn årligen). Texten visar hur fyrkasussystemets ändelser viker i löpande text samtidigt som stelnade diplomformler bevarar arkaiska böjningar.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "SDHK 21846, rad 1–6 (Donationen i Stockholm)",
        "meningar": [
          {
            "fsv": "For allom them thetta breff høra eller see kænnis jak bencta erikxdotther foordhom erikx than radhman j stokholm husfrw",
            "tolkning": "För alla dem som hör eller ser detta brev tillkännager jag, Bengta Eriksdotter, fordom Erik Thans, rådmannen i Stockholms, hustru",
            "kommentar": "For allom them: dativ pluralis efter for. kænnis jak: mediopassiv i betydelsen 'erkänner jag'. foordhom erikx than radhman: ojämn kasusböjning där genitivändelsen -s står på förnamnet men saknas på titeln radhman."
          },
          {
            "fsv": "gudh hans siæl nadhe mik hafua eptir mina radhe gifuit och wnt domkirkene j vpsala mith stenhws liggiandhe j stokholm wæstan mwr",
            "tolkning": "Gud förbarme hans själ, mig hava efter mitt råd gett och unnat domkyrkan i Uppsala mitt stenhus, liggande i Stockholm väster om muren",
            "kommentar": "gudh hans siæl nadhe: optativ konjunktivsats. mik hafua: ackusativ med infinitiv. domkirkene: dativ singularis femininum bestämd form vid verben gifua oc unna."
          },
          {
            "fsv": "næst sunnan widher mællan husit som nisse praall nw inne boor och gathune som kallas skomakaraporter",
            "tolkning": "närmast söderut mellan huset som Nisse Praal nu bor uti och gatan som kallas Skomakarporten",
            "kommentar": "mællan husit och gathune: prepositionen mællan styr i klassisk fornsvenska genitiv, men här styr den ackusativ/grundform, vilket markerar kasussystemets upplösning. skomakaraporter: äldsta belägget för detta stockholmsnamn."
          },
          {
            "fsv": "och min trægardh ther nidher fra j staffans grythagiwthara grændh trætighi alna langhan och wæstan mwr liggiande",
            "tolkning": "och min trädgård där nedanför i Staffan Grytgjutaress gränd, trettio alnar lång och väster om muren liggande",
            "kommentar": "min trægardh: ackusativ singularis maskulinum. trætighi alna langhan: ackusativändelse -an på adjektivet langhan i måttsbestämning (relikt av äldre kongruens)."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "SDHK 21846, rad 7–14 (Livränta och själagagn)",
        "meningar": [
          {
            "fsv": "j swa matto ath vpsala domkirkia skall mik arlika j min liiffs thima ena læst koorn mik till fodho gifua",
            "tolkning": "i så måtto att Uppsala domkyrka skall mig årligen under min livstid en läst korn mig till föda ge",
            "kommentar": "j swa matto: dativ singularis i stelnad formel. j min liiffs thima: prepositionen j styr här ackusativ (thima) medan liiffs står i genitiv. ena læst koorn: måttsobjekt i ackusativ."
          },
          {
            "fsv": "tha gifuir jak thæth fornæmpdhe vpsala domkirkio for mina ælskelika bønder frændra och forældra siælar",
            "tolkning": "då ger jag det ovannämnda till Uppsala domkyrka för mina kära bönders, fränders och föräldrars själar",
            "kommentar": "fornæmpdhe vpsala domkirkio: dativform. for mina ælskelika bønder: prepositionsfras där plurala genitiver blandas med oblika former."
          },
          {
            "fsv": "theth huset och gardhen till domkirkene nyttho oc bæzsta sælia oc skipa epthir stadsens wilkor",
            "tolkning": "det huset och gården till domkyrkans nytta och bästa att sälja och förvalta efter stadens villkor",
            "kommentar": "till domkirkene nyttho: prepositionen till styr genitivformen nyttho (svag feminin genitiv)."
          },
          {
            "fsv": "gudhi till æro och mina forældra siælagagn Ty affhendir jac mik och minom arfuom fornæmpda stenhws och gardh",
            "tolkning": "Gud till ära och mina föräldrars själagagn; därför avhänder jag mig och mina arvingar ovannämnda stenhus och gård",
            "kommentar": "gudhi: dativ singularis ('Gud till ära'). Ty affhendir jac mik: formelartad avhändelse i presens."
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "SDHK 21846, rad 14–20 (Besegling och vittnen)",
        "meningar": [
          {
            "fsv": "och hemolar oc tileghnar fornæmpde vpsala domkirkio epthir thy som forscrifuat staar",
            "tolkning": "och hemlar och tillägnar förenämnda Uppsala domkyrka efter det som föreskrivet står.",
            "kommentar": "hemolar oc tileghnar: juridiskt parverb styrande dativobjektet vpsala domkirkio."
          },
          {
            "fsv": "Till hwilkis mere wisso och skææll bidher jak hedherlika mæn herra johan mynther borghamæstara j stokholm ath han henghe sith incigle ffor thetta breff",
            "tolkning": "Till vilkets mera visso och skäl ber jag hederlige mannen herr Johan Mynter, borgmästare i Stockholm, att han hänger sitt sigill under detta brev",
            "kommentar": "Till hwilkis: genitiv singularis av relativpronomenet. henghe: presens konjunktiv i att-sats."
          },
          {
            "fsv": "a mina wægna mædhan jak ey siælff incigle hafuer",
            "tolkning": "på mina vägnar, emedan jag icke själv har något sigill.",
            "kommentar": "a mina wægna: dativ pluralis i fast idiom. jak ey siælff incigle hafuer: SOV-ordföljd (objekt före finit verb)."
          },
          {
            "fsv": "Datum stokholmis anno domini millesimo quadringentesimo tricesimo secundo die beati luce ewangeliste",
            "tolkning": "Givet i Stockholm i Herrens år 1432, på den salige evangelisten Lukas dag.",
            "kommentar": "Latinsk dateringsformel (18 oktober 1432) typisk för medeltida diplom."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "NYL2015",
        "lokalisering": "s. 12–16",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "ALL2023",
        "lokalisering": "s. 15–20",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "DFA2009",
        "lokalisering": "s. 12–14",
        "stod": "analys"
      }
    ]
  },
  "urkunder/formler": {
    "titel": "Brevformler",
    "underrubrik": "Återkommande diplomformler i medeltida urkunder",
    "meta": [
      {
        "nyckel": "Källkorpus",
        "varde": "Svenskt Diplomatarium (SDHK)"
      },
      {
        "nyckel": "Period",
        "varde": "1300–1400-tal"
      },
      {
        "nyckel": "Genre",
        "varde": "Diplomatik / Rättsformler"
      },
      {
        "nyckel": "Funktion",
        "varde": "Formelanalys"
      }
    ],
    "ingress": "Medeltidens diplomatariska skrifter konstruerades utifrån en sträng retorisk och juridisk kanon som härstammade från den kontinentala kanslitraditionen (ars dictaminis). De fornsvenska skrivarna utvecklade fasta idiomatiska vändningar för brevets olika delar: hälsning (salutatio), kungörelse (publicatio), sakframställning (dispositio), avhändelse (renuntiatio) och bekräftelse (corroboratio). Genom att studera dessa formler kan man se hur språkliga mönster konserverades långt efter att de börjat vika i det levande talspråket.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Diplomformler: Salutatio & Publicatio",
        "meningar": [
          {
            "fsv": "Alla the thetta breff høra eller see helsar iak N æwinnelica medh warom herra",
            "tolkning": "Alla dem som detta brev hör eller ser hälsar jag N evinnerligen med Vår Herre.",
            "kommentar": "Salutatio-formel: Alla the representerar framställt ackusativ/dativobjekt före hälsningspredikatet."
          },
          {
            "fsv": "Bekænnis iak medh thessu mino nerwarando opno brefue och gør witherlikt allom mannom",
            "tolkning": "Bekänner jag med detta mitt närvarande öppna brev och gör veterligt för alla män",
            "kommentar": "Publicatio-formel: medh thessu mino nerwarando opno brefue uppvisar fullständig dativ singularis neutrum på -u/-o."
          },
          {
            "fsv": "swa wæl epterkomandom som nærwarandom thet iak hafwir saalt oc vplatit",
            "tolkning": "såväl för efterkommande som närvarande att jag har sålt och upplåtit",
            "kommentar": "Participer i dativ pluralis (-andom) som mottagare av kungörelsen."
          },
          {
            "fsv": "medh friom wilia fullom skælom och beradhno modhe",
            "tolkning": "med fri vilja, fulla skäl och berått mod.",
            "kommentar": "Allittererande och rytmisk tricolon i ren dativ singularis: -om/-o markerar maskulin och feminin dativ."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Diplomformler: Renuntiatio & Eviktion",
        "meningar": [
          {
            "fsv": "Thy afhænder iak mik oc minom arfwom thetta forscriffna gooz oc tileghnar thet N oc hans arfwom",
            "tolkning": "Därför avhänder jag mig och mina arvingar detta föreskrivna gods och tillägnar det N och hans arvingar",
            "kommentar": "Renuntiatio: standardklausul i Magnus Erikssons stadslag och landslag för fastebrevs giltighet."
          },
          {
            "fsv": "til æwærdhelica ægho fritt oc frelst firi hwarss mans hynder oc aathaal",
            "tolkning": "till evärdlig ägo, fritt och frälst för var mans hinder och klander.",
            "kommentar": "Juridisk garantiformel med allitteration (fritt oc frelst) och genitivstyrning vid klander."
          },
          {
            "fsv": "oc gifwir iak häradzhøfþinganom fulla makt at fasta thetta gooz epther landzins laghum",
            "tolkning": "och ger jag häradshövdingen full makt att fastefara detta gods efter landets lagar,",
            "kommentar": "häradzhøfþinganom: bestämd dativ singularis maskulinum som indirekt objekt."
          },
          {
            "fsv": "hwat ther ær af alder tillighat hafwir oc mæþ rættu tilliggia bør",
            "tolkning": "vad som därtill av ålder har legat och med rätta bör tillhöra.",
            "kommentar": "Traditionell tillbehörsklausul för fast egendom."
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Diplomformler: Corroboratio & Eskatokoll",
        "meningar": [
          {
            "fsv": "Til thess mere wisso bætre oc høghre forwaring later iak mith incigle hengia firi thetta breff",
            "tolkning": "Till dess mera visso, bättre och högre säkerhet låter jag mitt sigill hängas under detta brev,",
            "kommentar": "Corroboratio-formel: Til thess mere wisso är en fast genitivkonstruktion; incigle är lånord från medellågtyskans insegel."
          },
          {
            "fsv": "oc hafwer iak bidhit ærligha oc welbyrdogha mæn ath the hengia thera incigle her firi til witnisbyrdh",
            "tolkning": "och har jag bett ärliga och välbördiga män att de hänger sina sigill här under till vittnesbörd,",
            "kommentar": "welbyrdogha mæn: lågtyskt lånord välbördig; thera incigle står som ackusativ pluralis neutrum."
          },
          {
            "fsv": "mædhan jak ey siælff incigle hafwer",
            "tolkning": "emedan jag icke själv har eget sigill.",
            "kommentar": "Standardmotivering när utfärdaren saknade eget sigill och anlitade borgmästare eller lagman."
          },
          {
            "fsv": "Datum et actum anno domini millesimo quadringentesimo ipso die beati martini",
            "tolkning": "Givet och utfärdat i Herrens år 1400 på själva salige Martins dag.",
            "kommentar": "Avslutande latinsk eskatokoll-formel med helgondag som tidsfästning."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "NYL2015",
        "lokalisering": "s. 18–22",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "DFA2009",
        "lokalisering": "s. 12–15",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "ALL2023",
        "lokalisering": "s. 22–25",
        "stod": "analys"
      }
    ]
  },
  "runinskrifter/uppland/u-240": {
    "titel": "U 240",
    "underrubrik": "Lingsbergsstenen, Vallentuna socken, Uppland",
    "meta": [
      {
        "nyckel": "Signum",
        "varde": "U 240"
      },
      {
        "nyckel": "Ristningstyp",
        "varde": "Runsten (granit)"
      },
      {
        "nyckel": "Stil",
        "varde": "Pr3 (Urnesstil)"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1020–1050"
      },
      {
        "nyckel": "Ristare",
        "varde": "Tillskriven Åsmund Kåresson"
      }
    ],
    "ingress": "Lingsbergsstenen (U 240) står vid Lingsbergs gård i Vallentuna socken i Uppland. Den är en av de vackraste och bäst bevarade runstenarna i mellersta Uppland, ristad med den 16-typiga yngre runraden i en elegant ormslinga. Inskriften hedrar fadern Halvdan och brodern Fader och belyser den sena runsvenskans (tidiga fornsvenskans) grammatiska system: full kasus- och numeruskongruens, rik nominalböjning och fasta minnesformler.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "U 240 (Runinskrift och minnesformel)",
        "meningar": [
          {
            "fsv": "tanr * auk * huskar- * auk * suin * litu * risa * stin * þina * iftiR * halftan * faþur * sin",
            "tolkning": "Dan och Huskarl och Sven läto resa denna sten efter Halvdan, sin fader,",
            "kommentar": "tanr * auk * huskar- * auk * suin: tre samordnade maskulina personnamn i nominativ singularis. litu: preteritum pluralis av starka verbet láta, med full numeruskongruens med det tredelade subjektet. stin * þina: ackusativ singularis maskulinum. iftiR: preposition styrande ackusativformerna halftan och faþur sin (r-stam)."
          },
          {
            "fsv": "auk * iftiR * foþur * bruþur * sin",
            "tolkning": "och efter Fader, sin broder.",
            "kommentar": "foþur: personnamnet Fôður i ackusativ singularis (här använt som egennamn). bruþur sin: ackusativ singularis av r-stammen bróðir med possessivt pronomen."
          },
          {
            "fsv": "kuþ * hialbi * ant * þæiRa * auk * kus * muþiR",
            "tolkning": "Gud hjälpe deras ande och Guds moder.",
            "kommentar": "kuþ: nominativ singularis (subjekt). hialbi: presens konjunktiv (optativ böneformel). ant: ackusativ singularis av feminin i-stam (ǫnd 'själ/ande'). kus muþiR: samordnat subjekt i nominativ singularis."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Normaliserad fornsvensk läsning och syntax",
        "meningar": [
          {
            "fsv": "ÞæiR ristu runaR þæiRaR æftiR goða mæn",
            "tolkning": "De ristade dessa runor efter goda män.",
            "kommentar": "Normaliserad fornsvensk form: runaR þæiRaR står i ackusativ pluralis femininum (ō-stam). æftiR goða mæn: ackusativ pluralis med adjektivattribut."
          },
          {
            "fsv": "Faðir ok bróðir áttu heima í Lingsbergi",
            "tolkning": "Fader och broder ägde sitt hem i Lingsberg.",
            "kommentar": "Släktskapsorden faðir ok bróðir i nominativ singularis; áttu är preteritum pluralis av preteritopresentiska verbet eiga."
          },
          {
            "fsv": "Stæinn stændr á bergi at minnum um aldr",
            "tolkning": "Stenen står på berget till minne genom tiderna.",
            "kommentar": "stændr: presens 3 pers. singularis med i-omljud (standa > stændr). at minnum: dativ pluralis efter at i betydelsen 'till åminnelse'."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "VIK-GRAM",
        "lokalisering": "s. 429–435",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "MAR2018-RUN",
        "lokalisering": "s. 8–15",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "MAR2016",
        "lokalisering": "s. 12–18",
        "stod": "analys"
      }
    ]
  },
  "runinskrifter/uppland/u-489": {
    "titel": "U 489",
    "underrubrik": "Morby, Lagga socken, Uppland (Öpir)",
    "meta": [
      {
        "nyckel": "Signum",
        "varde": "U 489"
      },
      {
        "nyckel": "Ristare",
        "varde": "Öpir (signerad: ybiR risti)"
      },
      {
        "nyckel": "Datering",
        "varde": "Omkr. 1070–1100"
      },
      {
        "nyckel": "Genre",
        "varde": "Runstensmonument över brobygge"
      },
      {
        "nyckel": "Sockentillhörighet",
        "varde": "Lagga socken, Uppland"
      }
    ],
    "ingress": "Morbystenen (U 489) är rest av en kvinna, Gullaug, till minne av sin make Gudlaug och dottern Gillaug i samband med att hon lät bygga broar för deras själar. Ristningen är signerad av Öpir, den utan jämförelse mest produktive runmästaren i det sena 1000-talets Uppland. Texten är ett utomordentligt vittnesbörd om kvinnors rättsliga och ekonomiska handlingsutrymme i det tidigmedeltida Sverige och uppvisar tydlig feminin nominalböjning.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "U 489 (Gullaugs brobygge och minnesord)",
        "meningar": [
          {
            "fsv": "kulauh + lit + kiara + bryiR + þisaR + furi + kuþlauhs + bonta + sins + salu",
            "tolkning": "Gullaug lät göra dessa broar för Gudlaugs, sin mans, själ",
            "kommentar": "kulauh: nominativ singularis femininum (subjekt). lit: preteritum 3 pers. singularis (singulariskongruens). bryiR þisaR: ackusativ pluralis av feminina rotstammen brú (med omljud och r-plural) samt demonstrativet þessar. furi: styr här genitiv: kuþlauhs (stark mask. gen. på -s), bonta (svag mask. gen. på -a) och salu (svag fem. gen. på -u)."
          },
          {
            "fsv": "uk + kilauhaR + tutur + sinaR",
            "tolkning": "och Gillaugs, sin dotters.",
            "kommentar": "kilauhaR: stark feminin genitiv singularis på -aR (ō-stam). tutur sinaR: genitiv singularis av r-stammen dóttir med possessivt pronomen."
          },
          {
            "fsv": "ybiR + risti",
            "tolkning": "Öpir ristade.",
            "kommentar": "ybiR: nominativ singularis maskulinum (a-stam). risti: preteritum 3 pers. singularis av svaga verbet rista (klass I)."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Normaliserad fornsvensk läsning och analys",
        "meningar": [
          {
            "fsv": "Broagærð var mikit gæfuværk i fornum sið oc kristnum",
            "tolkning": "Brobygge var ett stort barmhärtighetsverk i forna tider och kristna.",
            "kommentar": "Broagærð: feminin nominativ singularis; att bygga broar för de dödas själar var en kristen botgöringshandling i sen vikingatid."
          },
          {
            "fsv": "Móðir sýndi kærleik dóttr sinni ok bónda sínum",
            "tolkning": "Modern visade kärlek åt sin dotter och sin make.",
            "kommentar": "dóttr sinni: dativ singularis av r-stammen med reflexivt possessiv; bónda sínum: dativ singularis av svaga maskulinet bóndi."
          },
          {
            "fsv": "Runir þessar standa mannum til sýnar um langan aldur",
            "tolkning": "Dessa runor stå människorna till åsyn genom långa tider.",
            "kommentar": "mannum: dativ pluralis med avseendebetydelse. til sýnar: genitiv singularis efter prepositionen til. um langan aldur: ackusativ med tidsutsträckning."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "MAR2018-RUN",
        "lokalisering": "s. 16–22",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "MAR2016",
        "lokalisering": "s. 18–25",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "VIK-GRAM",
        "lokalisering": "s. 438–442",
        "stod": "analys"
      }
    ]
  },
  "runinskrifter/gotland/g-104": {
    "titel": "G 104",
    "underrubrik": "Källunge kyrka, Gotland, medeltida runinskrift",
    "meta": [
      {
        "nyckel": "Signum",
        "varde": "G 104"
      },
      {
        "nyckel": "Fyndplats",
        "varde": "Källunge kyrka, Gotland"
      },
      {
        "nyckel": "Datering",
        "varde": "1200-talet"
      },
      {
        "nyckel": "Dialekt",
        "varde": "Medeltida forngutniska"
      },
      {
        "nyckel": "Texttyp",
        "varde": "Byggnadsinskrift i kalksten"
      }
    ],
    "ingress": "Inskriften G 104 i Källunge kyrka på Gotland är ett unikt dokument över det forngutniska språket under medeltiden. Gotländskan intog en särställning i det fornnordiska språkområdet genom att bevara de gamla urnordiska diftongerna (ai, au, oy) intakta utan östnordisk monoftongering, uppvisa arkaisk vokalbalans och bevara ålderdomliga böjningsändelser som försvunnit på fastlandet.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "G 104 (Källunge kyrka, byggnadsinskrift)",
        "meningar": [
          {
            "fsv": "þisa : kirkio : gærþu : þeir : botuiþr : auk : laufrans : firi : sial : sina",
            "tolkning": "Denna kyrka gjorde de, Botvid och Lavrans, för sin själ,",
            "kommentar": "þisa kirkio: ackusativ singularis femininum av forngutniskans kirkio (motsvarande fsv. kirkiu). gærþu þeir: preteritum pluralis med efterställt personligt pronomen. botuiþr auk laufrans: samordnade mansnamn i nominativ. firi sial sina: ackusativ efter firi."
          },
          {
            "fsv": "gupi : til : lofs : oc : sancte : petre : til : æro",
            "tolkning": "Gud till lov och sankte Per till ära.",
            "kommentar": "gupi: dativ singularis av gup (forngutniskt uttal med bevarad frikativa och ändelse -i). sancte petre: dativform av apostelnamnet."
          },
          {
            "fsv": "huer : sum : þetta : les : biþi : firi : þaim : sum : kirkio : gierþu",
            "tolkning": "Var och en som detta läser, bede för dem som kyrkan gjorde.",
            "kommentar": "huer sum: forngutniskt relativt pronomen ('vem som än, var och en som'). biþi: presens konjunktiv (optativ). firi þaim: dativ pluralis av pronomenet þeir."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Forngutnisk grammatik och jämförelse",
        "meningar": [
          {
            "fsv": "Gutniska tungan helt aldre diftonga i ordum sum stain oc auga oc royda",
            "tolkning": "Den gutniska tungan behöll äldre diftonger i ord som sten, öga och röda.",
            "kommentar": "Illustrerar den forngutniska diftongbevaringen: stain (fsv. sten), auga (fsv. øgha), royda (fsv. røþa). helt: starkt preteritum singularis."
          },
          {
            "fsv": "Gutnalag vitnar um allra guta friþ oc lagh a landi her",
            "tolkning": "Gutalagen vittnar om alla gotlänningars frid och lag här i landet.",
            "kommentar": "Gutnalag: nominativ singularis (Gutalagen). allra guta: genitiv pluralis av folknamnet guti (gotlänning)."
          },
          {
            "fsv": "Þeir heldu siðum sinum oc skatt gæfu svea konungi",
            "tolkning": "De högtidlighöllo sina seder och skatt gåvo de sveakonungen.",
            "kommentar": "heldu siðum sinum: dativ pluralis styrt av halda. skatt gæfu svea konungi: ackusativobjekt följt av preteritum pluralis gæfu och indirekt dativobjekt svea konungi."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "NOR1904",
        "lokalisering": "§ 21–25 och § 400–405",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "VIK-GRAM",
        "lokalisering": "s. 450–455",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "MAR2018-RUN",
        "lokalisering": "s. 25–28",
        "stod": "analys"
      }
    ]
  },
  "religios-prosa/fornsvenska-legendariet": {
    "titel": "Fornsvenska legendariet",
    "underrubrik": "Helgonlegender ur Cod. Bureanus och Cod. Holm. A 34",
    "meta": [
      {
        "nyckel": "Handskrift",
        "varde": "Cod. Bureanus (omkr. 1350) / Cod. Holm. A 34"
      },
      {
        "nyckel": "Genre",
        "varde": "Hagiografi / Religiös prosa"
      },
      {
        "nyckel": "Språk",
        "varde": "Klassisk fornsvenska"
      },
      {
        "nyckel": "Förlaga",
        "varde": "Legenda Aurea"
      }
    ],
    "ingress": "Det fornsvenska legendariet (översatt från latinska förlagor som Jacobus de Voragines Legenda Aurea) lade grunden för den medeltida svenska berättarprosan och skapade ett rikt abstrakt och teologiskt ordförråd. Berättelserna om helgonens liv, martyrskap och mirakler spreds över hela Norden och traderades i ståtliga handskrifter såsom Codex Bureanus (Kungliga biblioteket, Stockholm). Texten uppvisar en elegant klassisk fornsvensk syntax med utvecklad hypotax och fast kasusbruk.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Bureanus (Johannes abbas kallelse)",
        "meningar": [
          {
            "fsv": "Johannes abbas hafthe gudhlica systor oc lærthe hon han først at forlata værlinna fafængo",
            "tolkning": "Abboten Johannes hade en gudfruktig syster, och hon lärde honom först att överge världens fåfänglighet",
            "kommentar": "hafthe: svagt preteritum av hava. gudhlica systor: ackusativ singularis femininum av r-stammen systir med kongruerande adjektiv. værlinna: genitiv singularis med suffigerad bestämd artikel (världens). fafængo: ackusativ singularis av svag feminin īn-stam."
          },
          {
            "fsv": "oc giwas i klostir oc tiena gudhi alla sina lifdaga mæþ reinlifi oc fasto",
            "tolkning": "och ge sig i kloster och tjäna Gud alla sina livsdagar med renlevnad och fasta.",
            "kommentar": "giwas: reflexiv infinitiv (s-form). tiena gudhi: verbet tiena styr dativobjektet gudhi. alla sina lifdaga: tidsackusativ i pluralis maskulinum. mæþ reinlifi oc fasto: dativ efter mæþ."
          },
          {
            "fsv": "Han giorthe som hon rædh oc blef i klostreno fyra aar oc tiwghu swa at han alrigh wt gik af thy",
            "tolkning": "Han gjorde som hon rådde och förblev i klostret i tjugofyra år, så att han aldrig gick ut därifrån.",
            "kommentar": "giorthe: preteritum av gæra. rædh: starkt preteritum singularis av raþa. i klostreno: dativ singularis neutrum i bestämd form (-eno). af thy: pronominell dativ singularis efter af."
          },
          {
            "fsv": "Hon astundathe mykit at se han oc skreff hanom ofta bref bidhiande han koma til sik",
            "tolkning": "Hon åstundade mycket att se honom och skrev honom ofta brev, bedjande honom komma till sig.",
            "kommentar": "astundathe: svagt preteritum (klass II). skreff hanom: starkt preteritum (klass I) med indirekt dativobjekt hanom. bidhiande: presens particip som styr ackusativ och infinitiv."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Bureanus (Den andliga kampen)",
        "meningar": [
          {
            "fsv": "Um thu vilt ey koma til mic tha scal iac ændelica koma til thiin",
            "tolkning": "Om du icke vill komma till mig, då skall jag sannerligen komma till dig.",
            "kommentar": "Konditionalsats med konjunktionen Um ('om'). til mic och til thiin: personliga pronomen efter prepositionen til (här med ackusativ/genitivform)."
          },
          {
            "fsv": "Johannes hørdhe thætta oc drøfthis mykit sighiande mz sik at værldzins kærlek matte ey hindra guz thianisto",
            "tolkning": "Johannes hörde detta och bedrövades mycket, sägande inom sig att världens kärlek icke månde hindra Guds tjänst.",
            "kommentar": "drøfthis: deponent/reflexivt preteritum. sighiande mz sik: participialfras. værldzins kærlek: genitivattribut före subjektet kærlek. matte: preteritum av mega."
          },
          {
            "fsv": "Tha for han til hennar mz twæm brøþrom oc taladhe gudhlik ord mz miklom kærleke",
            "tolkning": "Då for han till henne med två bröder och talade gudfruktiga ord med stor kärlek.",
            "kommentar": "til hennar: genitiv singularis av personliga pronomenet hon styrd av til. mz twæm brøþrom: dativ pluralis med räkneordet två och r-stammen bróðir. mz miklom kærleke: dativ singularis maskulinum."
          },
          {
            "fsv": "Systirin thakkadhe gudhi oc glæddis i andanom af hans hælghu nærwæru",
            "tolkning": "Systern tackade Gud och gladdes i anden av hans heliga närvaro.",
            "kommentar": "Systirin: bestämd nominativ singularis femininum. thakkadhe gudhi: styr dativobjekt. glæddis: deponent preteritum. i andanom: bestämd dativ singularis av svag maskulin an-stam."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "HJO2017",
        "lokalisering": "s. 11–18 och 90–99",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "COL1913",
        "lokalisering": "s. 3–7 och 276–278",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 58–59",
        "stod": "analys"
      }
    ]
  },
  "religios-prosa/birgitta": {
    "titel": "Birgittas uppenbarelser",
    "underrubrik": "Fornsvensk översättning från Vadstena (Cod. Holm. A 5a & Oxenstiernianus)",
    "meta": [
      {
        "nyckel": "Författare",
        "varde": "Den heliga Birgitta (1303–1373)"
      },
      {
        "nyckel": "Handskrift",
        "varde": "Vadstena kloster, Cod. Holm. A 5a / Cod. Oxenstiernianus"
      },
      {
        "nyckel": "Datering",
        "varde": "1380-talet"
      },
      {
        "nyckel": "Genre",
        "varde": "Mystik / Uppenbarelselitteratur"
      },
      {
        "nyckel": "Språk",
        "varde": "Yngre klassisk fornsvenska"
      }
    ],
    "ingress": "Den heliga Birgittas uppenbarelser (Revelationes) intar en särställning i svensk litteratur- och språkhistoria. Uppenbarelserna dikterades av Birgitta på fornsvenska, översattes till latin av hennes biktfäder och återöversattes till fornsvenska i Vadstena kloster under 1380-talet. Vadstenaspråket kom genom klostrets omfattande skriptorium och spridning att fungera som en senmedeltida rikssvensk skriftspråksnorm. Texten präglas av ett intensivt bildspråk, teologisk precision och en syntax i övergången mot yngre fornsvenska.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Revelationes, Bok VII: Kristi födelsesyn",
        "meningar": [
          {
            "fsv": "Iak sa ena iomfru hafwande et barn i sino qwithe lysande swa som solin",
            "tolkning": "Jag såg en jungfru havande ett barn i sitt sköte, lysande såsom solen,",
            "kommentar": "sa: starkt preteritum singularis av sia (klass V). ena iomfru: ackusativ singularis med obestämd artikel. hafwande et barn: presens particip med ackusativobjekt. i sino qwithe: dativ singularis neutrum efter i. lysande swa som solin: bestämd form solin i nominativ."
          },
          {
            "fsv": "oc thetta barn fæddis af henne vtan sorgh oc vtan allo kyns pinilse",
            "tolkning": "och detta barn föddes av henne utan sorg och utan allsköns plåga.",
            "kommentar": "fæddis: passivt preteritum av fødha. af henne: dativ singularis av pronomenet efter af. vtan allo kyns pinilse: genitivattribut (allsköns) vid ackusativobjektet pinilse (svag feminin īn-stam)."
          },
          {
            "fsv": "Tha föll iomfrun a knæ oc badh til thet wælsignadha barnet medh mykilli idhkeleik oc ræzlo",
            "tolkning": "Då föll jungfrun på knä och bad till det välsignade barnet med stor hängivenhet och vördnad.",
            "kommentar": "föll: starkt preteritum (klass VII). iomfrun: bestämd nominativ. til thet wælsignadha barnet: bestämd ackusativ neutrum med svagt böjt particip. medh mykilli idhkeleik: dativ singularis femininum efter medh."
          },
          {
            "fsv": "Hon sagdhe wælkommin min gudh oc min herra oc min sötaste sun",
            "tolkning": "Hon sade: Välkommen, min Gud och min herre och min sötaste son!",
            "kommentar": "sagdhe: svagt preteritum av sighia. wælkommin: predikativt adjektiv i maskulin nominativ. min gudh oc min herra oc min sötaste sun: vokativa/nominativa led med superlativformen sötaste."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Revelationes, Bok I: Kristi tilltal",
        "meningar": [
          {
            "fsv": "Sidhæn taladhe drotzklicast herra ihesus kristus til mik oc sagdhe",
            "tolkning": "Sedan talade den allra herrligaste herre Jesus Kristus till mig och sade:",
            "kommentar": "drotzklicast: arkaisk superlativbildning till drottin ('furstligast, allra herrligast'). herra ihesus kristus: nominativ singularis."
          },
          {
            "fsv": "Iak ær himilsins oc iordhinnar skapare oc mik ær giffwin all makt a himli oc a iordhu",
            "tolkning": "Jag är himlens och jordens skapare, och mig är given all makt i himlen och på jorden.",
            "kommentar": "himilsins oc iordhinnar: dubbelt bestämda genitiver. mik: indirekt dativobjekt i passiv konstruktion. all makt: nominativ singularis femininum kongruerande med predikativet giffwin. a himli oc a iordhu: dativ singularis efter prepositionen a."
          },
          {
            "fsv": "Hwi forlater thu mic min skapilse oc ælskar hællir thænna blindadha wærld",
            "tolkning": "Varför överger du mig, min skapelse, och älskar hellre denna blindade värld?",
            "kommentar": "forlater och ælskar: presens 2 pers. singularis. min skapilse: vokativ/apposition till subjektet thu. thænna blindadha wærld: ackusativ singularis femininum med demonstrativet thænna och svagt böjt particip."
          },
          {
            "fsv": "Wænde thik til mik medh allo thino hiærta oc iak scal miskunda thik swa som faþir sinom suni",
            "tolkning": "Vänd dig till mig av allt ditt hjärta, och jag skall förbarma mig över dig såsom en fader över sin son.",
            "kommentar": "Wænde thik: imperativ singularis med reflexivt pronomen i ackusativ. medh allo thino hiærta: dativ singularis neutrum (hjärta är n-stam). miskunda thik: verbet miskunda styr reflexivt/objekt. sinom suni: dativ singularis av u-stammen sun med possessivt pronomen."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AHR2021",
        "lokalisering": "s. 12–25",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 58–60",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "WES1970",
        "lokalisering": "s. 20–25",
        "stod": "analys"
      }
    ]
  }
};
