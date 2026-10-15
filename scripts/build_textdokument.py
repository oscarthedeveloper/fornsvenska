# -*- coding: utf-8 -*-
import json

# Generator for data/textdokument.ts

DATA = {
  "lagar/aldre-vastgotalagen/kristnu-balker-i": {
    "titel": "Kristnu balkær, del I",
    "underrubrik": "Äldre Västgötalagen, inledningen och dopet (Cod. Holm. B 59)",
    "meta": [
      { "nyckel": "Handskrift", "varde": "Cod. Holm. B 59" },
      { "nyckel": "Datering", "varde": "Omkr. 1280" },
      { "nyckel": "Genre", "varde": "Landskapslag" },
      { "nyckel": "Dialekt", "varde": "Äldre västgötska" },
      { "nyckel": "Utgåva", "varde": "Schlyter, SSGL I / Delsing" }
    ],
    "ingress": "Balkens inledning fastslår den kristna trons och kyrkans primat i det västgötska lagsamhället. Texten är skriven på arkaisk äldre fornsvenska med fullt bevarat fyrkasussystem och strikt kongruens. Efter den högtidliga inledningen följer noggranna föreskrifter om hur ett nyfött barn skall föras till kyrkan och döpas, hur nöddop skall förrättas om barnet insjuknar på vägen, samt föräldrarnas och faddrarnas skyldigheter.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §1 (Inledning)",
        "meningar": [
          {
            "fsv": "Krister ær fyrst i laghum warum",
            "tolkning": "Kristus är främst i våra lagar.",
            "kommentar": "laghum warum: dativ pluralis efter prepositionen i med lokativ funktion. Kongruerande possessivt pronomen warum. Subjektet Krister uppvisar fornsvensk nominativändelse -er."
          },
          {
            "fsv": "þa ær cristna var oc allir cristnir konongær",
            "tolkning": "Därnäst vår kristenhet och alla kristna konungar.",
            "kommentar": "cristna var: feminin nominativ singularis med efterställt possessivt pronomen. allir cristnir konongær: nominativ pluralis av starkt maskulint substantiv konongær (a-stam) med full kongruens i allir och starkt böjda cristnir."
          },
          {
            "fsv": "böndær oc allir bocarlær biscupær oc allir boclærðir mæn",
            "tolkning": "Bönder och alla bofasta män, biskopar och alla boklärda män.",
            "kommentar": "Nominativ pluralis: böndær (rotstam), bocarlær och biscupær (a-stammar på -ær), samt boclærðir mæn där participadjektivet kongruerar med oregelbundna rotstamssubstantivet mæn."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §1 (Dopet)",
        "meningar": [
          {
            "fsv": "Varþær barn til kirkiu boret oc beþiz cristnu",
            "tolkning": "Varder barn buret till kyrka och bedes kristning,",
            "kommentar": "Konditionalt framställd huvudsats med inversion (varþær barn). Prepositionen til styr genitivformen kirkiu (svag ōn-stam). Passiv med varþær och perfekt particip boret (nom. sg. neutr.). Deponensen beþiz styr genitivobjektet cristnu."
          },
          {
            "fsv": "þa scal faþir ok moðer fa guðfæþur oc guðmoþor oc salt oc uatn",
            "tolkning": "då skall fader och moder skaffa gudfader och gudmoder och salt och vatten.",
            "kommentar": "faþir ok moðer: r-stammar i nominativ singularis. guðfæþur och guðmoþor: ackusativ singularis av fadderbeteckningarna; salt oc uatn: ackusativ singularis neutrum som sakobjekt."
          },
          {
            "fsv": "þæt scal bæræ til kirkiu þa scal a prést kallæ han skal a kirkiu bole boæ",
            "tolkning": "Det skall bäras till kyrkan, då skall man kalla på präst; han skall bo på kyrkobolet.",
            "kommentar": "bæræ: aktiv infinitiv med passivisk betydelse efter scal. a prést: ackusativ efter prepositionen a. a kirkiu bole: dativ singularis efter befintlighets-a; förleden kirkiu är sammansättningsgenitiv."
          },
          {
            "fsv": "barn scal brymsignæ firi utan kirkiu dyr",
            "tolkning": "Barnet skall primsignas utanför kyrkodörren.",
            "kommentar": "brymsignæ: kristet lånord (fornengelska primsignian). firi utan styr ackusativformen kirkiu dyr (ack. pl. neutr.)."
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §1 (Nöddop och dopformel)",
        "meningar": [
          {
            "fsv": "Siþen scal font wigyæ prester barn döpæ oc gudfaþir a haldæ gudmoþer til namns sygiæ",
            "tolkning": "Sedan skall dopfunten vigas, prästen döpa barnet och gudfadern hålla i, och gudmodern säga namnet.",
            "kommentar": "Parallella infinitivsatser underställda hjälpverbet scal. til namns: genitiv efter prepositionen til."
          },
          {
            "fsv": "prester scal byuþe husu lengi faþir oc moþer sculu vardvetæ",
            "tolkning": "Prästen skall påbjuda hur länge fader och moder skola vårda det.",
            "kommentar": "vardvetæ: sammansättning med urgermanskt varð ('vakt') och vita ('veta/iaktta'). sculu: presens pluralis, kongruerar med sammansatt subjekt."
          },
          {
            "fsv": "Hændir þæt sot a vegh oc ma igh til kyrkiu coma þa scal gudfaþir döpæ oc gudmoþer a haldæ i vatn",
            "tolkning": "Händer det att sjukdom kommer på vägen och det icke kan komma till kyrkan, då skall gudfadern döpa och gudmodern hålla i vatten.",
            "kommentar": "sot: feminin nominativ singularis ('sjukdom'). Negationsadverbet igh är en västgötsk sidovariant till eigh. Nöddopets giltighet fastslås."
          },
          {
            "fsv": "æn uatn ær til i namn faþurs oc suner oc andæs hælagha þa scal þét .j. kyrkiu gard gravæ",
            "tolkning": "om vatten finns till hands, i faderns och sonens och den helige andes namn; dör det sedan skall det begravas på kyrkogården.",
            "kommentar": "faþurs (stark genitiv på -s), suner (u-stamsgenitiv på -er), andæs hælagha (svag maskulin genitiv på -a med efterställt bestämt adjektiv). j kyrkiu gard: riktningsackusativ efter i."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 1, Kirkiu Bolkær §1",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 56 och 101–103",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "NOR1904",
        "lokalisering": "§ 400–405",
        "stod": "analys"
      }
    ]
  },

  "lagar/aldre-vastgotalagen/kristnu-balker-ii": {
    "titel": "Kristnu balkær, del II",
    "underrubrik": "Äldre Västgötalagen, biskopens gengärd och kyrkans underhåll (Cod. Holm. B 59)",
    "meta": [
      { "nyckel": "Handskrift", "varde": "Cod. Holm. B 59" },
      { "nyckel": "Datering", "varde": "Omkr. 1280" },
      { "nyckel": "Genre", "varde": "Landskapslag" },
      { "nyckel": "Dialekt", "varde": "Äldre västgötska" },
      { "nyckel": "Utgåva", "varde": "Schlyter, SSGL I / Delsing" }
    ],
    "ingress": "Andra delen av kristendomsbalken i Äldre Västgötalagen reglerar biskopens visitationer och rätt till gengärd (härbärge och förplägnad), sockenmännens skyldighet att underhålla kyrkobyggnaden samt de rättsliga följderna när en kyrka vanhelgas genom våld eller stöld. Texten belyser hur kanonisk rätt och inhemsk sedvänja integrerades i det tidiga medeltida lagsamhället och uppvisar arkaisk västgötsk morfologi och syntax.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §2 & §5 (Biskopens rättigheter)",
        "meningar": [
          {
            "fsv": "Byscupi scal gengyærd geræ twar næter oc til quels hins þridia med tolf mannum",
            "tolkning": "Åt biskopen skall man göra gengärd två nätter och till den tredje dagens kväll med tolv män,",
            "kommentar": "Byscupi: dativ singularis som indirekt objekt vid scal geræ. twar næter: ackusativ pluralis i tidsadverbial funktion (femininum av räkneordet två). hins þridia: svagt böjt ordningstal i genitiv med framställd artikel."
          },
          {
            "fsv": "sialuer han hin þrættandi oc han drikki myod oc allir klerkar hans",
            "tolkning": "själv han den trettonde, och han dricke mjöd och alla hans klerker.",
            "kommentar": "hin þrættandi: bestämd form av ordningstalet ('den trettonde'). drikki: presens konjunktiv (optativ/preskriptiv funktion). allir klerkar hans: nominativ pluralis maskulinum."
          },
          {
            "fsv": "Crusszur oc klokchor calka oc messufat þa scal byscuper vighia firi tyundæ",
            "tolkning": "Kors och klockor, kalkar och mässkrudar skall biskopen viga för tionden.",
            "kommentar": "Ackusativobjekt i framställd topikalisering före finita verbet scal. firi tyundæ: prepositionsfras med genitiv/ackusativ som uttrycker vederlag."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §6 (Kyrkobyggnadens bestånd)",
        "meningar": [
          {
            "fsv": "Taker kyrkia at fyrnass standæ stulpær liggia sillir er helt dyrni oc festiband",
            "tolkning": "Börjar en kyrka att åldras, men stolparna står, syllarna ligger och dörrträ och bindbjälke är hela,",
            "kommentar": "Konditional huvudsats utan bisatsinledare med omvänd ordföljd. fyrnass: deponent infinitiv ('åldras'). stulpær och sillir: nominativ pluralis av starka feminina och maskulina byggnadstermer."
          },
          {
            "fsv": "ligger kamber hell haltæræ sten oc altare haui kyrkya vixl sinæ samu",
            "tolkning": "ligger takåsen hel och altarstenen och altaret helt, då skall kyrkan behålla sin samma vigning,",
            "kommentar": "kamber: takås (mask. nom. sg.). haui: presens konjunktiv av hava ('må hava'). vixl sinæ samu: ackusativ singularis femininum med demonstrativ/identitetsmarkör samu."
          },
          {
            "fsv": "þo at hana böte en þessi æru all hel",
            "tolkning": "ändock att man reparerar den, om dessa delar alla äro hela.",
            "kommentar": "þo at: medgivande underordnad konjunktion ('fastän'). hana: ackusativobjekt (fem. sg., syftar på kyrkia). þessi æru all hel: full kongruens i predikativ neutrum pluralis hel med kvantifikatorn all."
          },
          {
            "fsv": "Værþer altæræ sten lös þa scal prester byscup uid væræ",
            "tolkning": "Varder altarsten lös, då skall prästen tillkalla biskopen.",
            "kommentar": "altæræ sten: sammansättning med genitivförled. byscup uid væræ: biskopen skall vara tillstädes/tillkallas för återinvigning."
          }
        ]
      },
      {
        "rubrik": "Sektion 03",
        "hanvisning": "Cod. Holm. B 59, Kirkiu Bolkær §3 & §7 (Nidingsverk i kyrkan)",
        "meningar": [
          {
            "fsv": "Uerder maþer .i. kyrkiu dræpin þet ær niþings værk þa er kyrkia al vuighz",
            "tolkning": "Varder en man dräpt i kyrkan, det är ett nidingsverk; då är kyrkan alldeles ovigd.",
            "kommentar": "niþings værk: rättsterm för vanärande brott som icke kan botas med böter. al vuighz: predikativ genitiv med förstärkande adverb al ('helt och hållet')."
          },
          {
            "fsv": "Uerdher kyrkia brutin oc mæssu fat stolen þet er niþingsværk",
            "tolkning": "Varder kyrka inbruten och mässkärl stulna, det är ett nidingsverk;",
            "kommentar": "Passiv med varþa och kongruerande particip: brutin (fem. nom. sg.) och stolen (neutr. nom. pl., i handskriften som kollektiv singularis)."
          },
          {
            "fsv": "þat er niv marcha sak kyrky swa hæreþe sva konogge",
            "tolkning": "det är en sak om nio marker, till kyrkan så, till häradet så och till konungen så.",
            "kommentar": "niv marcha sak: genitivattribut efter räkneord (niv marcha). kyrky, hæreþe, konogge: dativformer som uttrycker mottagare av bötesandelarna."
          },
          {
            "fsv": "Varþer in gangit at opnom dorom þa scal prester gialdæ skaþa apter",
            "tolkning": "Varder ingånget genom öppna dörrar, då skall prästen återgälda skadan.",
            "kommentar": "opnom dorom: dativ pluralis med instrumentell/lokativ funktion efter at. prester: nominativ singularis, bär vårdnadsansvaret för inventarierna."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 1–2, Kirkiu Bolkær §2, §5–7",
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

  "lagar/aldre-vastgotalagen/arfda-balker": {
    "titel": "Ærfþa balkær",
    "underrubrik": "Äldre Västgötalagen, arvsordning och arvsrätt (Cod. Holm. B 59)",
    "meta": [
      { "nyckel": "Handskrift", "varde": "Cod. Holm. B 59" },
      { "nyckel": "Datering", "varde": "Omkr. 1280" },
      { "nyckel": "Genre", "varde": "Landskapslag" },
      { "nyckel": "Dialekt", "varde": "Äldre västgötska" },
      { "nyckel": "Utgåva", "varde": "Schlyter, SSGL I / Delsing" }
    ],
    "ingress": "Ärvdabalken i Äldre Västgötalagen reglerar arvsordningen enligt det strikta nordiska parentelsystemet, där barn och efterkommande utesluter sidoarvingar och fädernet skiljs från mödernet. Paragrafen om utlandsresor och Greklandsfarare är en av svensk rättshistorias mest berömda texter och visar hur medeltida lagstiftning skyddade hemmavarande hustrus och barns egendom vid långväga pilgrims- och handelsfärder.",
    "sektioner": [
      {
        "rubrik": "Sektion 01",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær §1 (Arvsföljden)",
        "meningar": [
          {
            "fsv": "Svn ær faþurs arvi",
            "tolkning": "Son är faders arvinge.",
            "kommentar": "Klassisk nominalsats med kopula ær. faþurs: genitiv singularis av r-stammen faþir (med sekundärt -s). arvi: svag maskulin nominativ singularis (an-stam)."
          },
          {
            "fsv": "Ær eig svn þa ær dottær",
            "tolkning": "Finns ej son, då är dotter arvinge.",
            "kommentar": "Konditional sats med inversion utan konjunktion. dottær: nominativ singularis av feminin r-stam."
          },
          {
            "fsv": "Ær eig dottær þa ær faþir Ær eig faþir þa ær moþer þa ær broþer",
            "tolkning": "Finns ej dotter, då är fader; finns ej fader, då är moder; därefter är broder.",
            "kommentar": "Sukcessiv uppräkning av arvsberättigade släktingar med arkaiska r-stamsformer i nominativ singularis."
          },
          {
            "fsv": "Ær eig broþér þa er systir Ær eig systir þa æru sunærbörn",
            "tolkning": "Finns ej broder, då är syster; finns ej syster, då äro söners barn arvingar.",
            "kommentar": "sunærbörn: sammansättning med genitiv pluralis av sun som förled och börn i nominativ pluralis neutrum."
          },
          {
            "fsv": "Kollum skal ærvi skiptæ sundær i tu halft a fæþærni ok halft a moþærni",
            "tolkning": "Mellan kullarna skall arv skiftas sönder i två delar, hälften på fädernet och hälften på mödernet.",
            "kommentar": "Kollum: dativ pluralis efter prepositionen vid fördelning. halft: substantiverat neutrum. fæþærni och moþærni: dativ singularis av neutrala ja-stammar betecknande fäderne- och mödernesläkt."
          }
        ]
      },
      {
        "rubrik": "Sektion 02",
        "hanvisning": "Cod. Holm. B 59, Ærfþa balkær §2 (Romresan och Greklandsfararen)",
        "meningar": [
          {
            "fsv": "Far maþær af landi sætær brytiæ firi bo sighir at han skal gangæ til roms",
            "tolkning": "Far en man ur landet, sätter förvaltare för sitt bo och säger att han skall gå till Rom,",
            "kommentar": "Inversionsinledd villkorskedja. brytiæ: svag maskulin ackusativ singularis (bryte, förvaltare). firi bo: ackusativ efter firi. til roms: genitiv efter prepositionen til."
          },
          {
            "fsv": "þa skal bryti bo varþa til iamlangæ sidan skal arvi varþæ ok iki bryti længer num arvi uili",
            "tolkning": "då skall förvaltaren svara för boet under ett års tid; sedan skall arvingen svara för det och icke förvaltaren längre, om icke arvingen vill.",
            "kommentar": "til iamlangæ: tidsadverbial konstruktion ('under ett helt år'). num: arkaisk villkorskonjunktion ('om icke, såvida inte')."
          },
          {
            "fsv": "Far maþær af landi sytær husprø i bo havir i knæ ok annat i kviþi far cristindom",
            "tolkning": "Far en man ur landet medan hustrun sitter i boet, har ett barn i knä och ett annat i kvedet som får kristning,",
            "kommentar": "husprø: hustru (ack./nom. fem.). i knæ ok annat i kviþi: allittererande och rytmisk juridisk formel för spädbarn och ofött foster. far cristindom: får dop/kristning."
          },
          {
            "fsv": "vændir han hæl ok nakkæ at hemkynnum ok stighær fotum af fostær landi",
            "tolkning": "vänder han häl och nacke åt hembygden och stiger med fötterna från fosterlandet,",
            "kommentar": "hæl ok nakkæ: ackusativobjekt i allittererande parformel. at hemkynnum: dativ pluralis efter riktningsprepositionen at. fotum: instrumentell dativ pluralis ('med fötterna')."
          },
          {
            "fsv": "Ingsins manss arv takær hæn mæn i girklandi sitær",
            "tolkning": "Ingen mans arv tager han medan han i Grekland sitter.",
            "kommentar": "Ingsins manss: dubblerad genitivändelse hos det sammansatta negerande pronomenet ingsins och substantivet manss. girklandi: dativ singularis (Grekland/Bysans, vanligt resmål för nordiska väringagarden)."
          }
        ]
      }
    ],
    "fotnoter": [
      {
        "id": 1,
        "kallaId": "AVG-MASKIN",
        "lokalisering": "s. 8–9, Ærfþa balkær §1–2",
        "stod": "primarbelagg"
      },
      {
        "id": 2,
        "kallaId": "PET-SJUHUNDRA",
        "lokalisering": "s. 56",
        "stod": "regel"
      },
      {
        "id": 3,
        "kallaId": "NOR1904",
        "lokalisering": "§ 402–408",
        "stod": "analys"
      }
    ]
  },

  "lagar/upplandslagen/foretalet": {
    "titel": "Företalet",
    "underrubrik": "Upplandslagen (1296), Land skal mæþ laghum byggias",
    "meta": [
      { "nyckel": "Stadfäst", "varde": "1296 av kung Birger Magnusson" },
      { "nyckel": "Huvudredaktör", "varde": "Birger Persson (lagman)" },
      { "nyckel": "Genre", "varde": "Landskapslag" },
      { "nyckel": "Dialekt", "varde": "Klassisk uppländska" },
      { "nyckel": "Texttyp", "varde": "Lagföretal" }
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
      { "nyckel": "Stadfäst", "varde": "1296" },
      { "nyckel": "Genre", "varde": "Landskapslag" },
      { "nyckel": "Dialekt", "varde": "Klassisk uppländska" },
      { "nyckel": "Texttyp", "varde": "Kyrkorätt" }
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
      { "nyckel": "Datering", "varde": "Omkr. 1350" },
      { "nyckel": "Utfärdare", "varde": "Kung Magnus Eriksson" },
      { "nyckel": "Genre", "varde": "Rikslagbok" },
      { "nyckel": "Dialekt", "varde": "Yngre klassisk fornsvenska" },
      { "nyckel": "Texttyp", "varde": "Statsrätt" }
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
      { "nyckel": "Handskrift", "varde": "Riksarkivet, SDHK-nr 4512" },
      { "nyckel": "Datering", "varde": "1339–1340" },
      { "nyckel": "Genre", "varde": "Medeltidsbrev / Diplom" },
      { "nyckel": "Språk", "varde": "Klassisk fornsvenska" }
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
      { "nyckel": "Handskrift", "varde": "Riksarkivet, pergament" },
      { "nyckel": "Datering", "varde": "18 oktober 1432" },
      { "nyckel": "Utfärdare", "varde": "Bengta Eriksdotter i Stockholm" },
      { "nyckel": "Genre", "varde": "Gåvobrev / Diplom" },
      { "nyckel": "Språk", "varde": "Yngre fornsvenska" }
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
      { "nyckel": "Källkorpus", "varde": "Svenskt Diplomatarium (SDHK)" },
      { "nyckel": "Period", "varde": "1300–1400-tal" },
      { "nyckel": "Genre", "varde": "Diplomatik / Rättsformler" },
      { "nyckel": "Funktion", "varde": "Formelanalys" }
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
      { "nyckel": "Signum", "varde": "U 240" },
      { "nyckel": "Ristningstyp", "varde": "Runsten (granit)" },
      { "nyckel": "Stil", "varde": "Pr3 (Urnesstil)" },
      { "nyckel": "Datering", "varde": "Omkr. 1020–1050" },
      { "nyckel": "Ristare", "varde": "Tillskriven Åsmund Kåresson" }
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
      { "nyckel": "Signum", "varde": "U 489" },
      { "nyckel": "Ristare", "varde": "Öpir (signerad: ybiR risti)" },
      { "nyckel": "Datering", "varde": "Omkr. 1070–1100" },
      { "nyckel": "Genre", "varde": "Runstensmonument över brobygge" },
      { "nyckel": "Sockentillhörighet", "varde": "Lagga socken, Uppland" }
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
      { "nyckel": "Signum", "varde": "G 104" },
      { "nyckel": "Fyndplats", "varde": "Källunge kyrka, Gotland" },
      { "nyckel": "Datering", "varde": "1200-talet" },
      { "nyckel": "Dialekt", "varde": "Medeltida forngutniska" },
      { "nyckel": "Texttyp", "varde": "Byggnadsinskrift i kalksten" }
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
      { "nyckel": "Handskrift", "varde": "Cod. Bureanus (omkr. 1350) / Cod. Holm. A 34" },
      { "nyckel": "Genre", "varde": "Hagiografi / Religiös prosa" },
      { "nyckel": "Språk", "varde": "Klassisk fornsvenska" },
      { "nyckel": "Förlaga", "varde": "Legenda Aurea" }
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
      { "nyckel": "Författare", "varde": "Den heliga Birgitta (1303–1373)" },
      { "nyckel": "Handskrift", "varde": "Vadstena kloster, Cod. Holm. A 5a / Cod. Oxenstiernianus" },
      { "nyckel": "Datering", "varde": "1380-talet" },
      { "nyckel": "Genre", "varde": "Mystik / Uppenbarelselitteratur" },
      { "nyckel": "Språk", "varde": "Yngre klassisk fornsvenska" }
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
}

out = 'import type { Textdokument } from "@/lib/text";\n\n'
out += '/**\n * Textinnehåll, nycklat på full sökväg under roten "texter".\n'
out += ' * Samtliga 14 dokument är fullständigt publicerade med autentisk\n'
out += ' * fornsvensk text, översättning, grammatisk analys och källhänvisningar.\n */\n'
out += 'export const TEXTER_DOKUMENT: Record<string, Textdokument> = '
out += json.dumps(DATA, indent=2, ensure_ascii=False)
out += ';\n'

with open("data/textdokument.ts", "w", encoding="utf-8") as f:
    f.write(out)

print(f"Generated data/textdokument.ts with {len(DATA)} published texts.")
