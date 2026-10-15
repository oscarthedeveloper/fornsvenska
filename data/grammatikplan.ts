/**
 * Käll- och produktionsplan för grammatikträdet.
 *
 * Reglerna är kumulativa: en artikel ärver basverk från sin huvuddel och får
 * mer specialiserade källor från längre prefix. Detta är en arbetsplan, inte
 * en färdig källhänvisning; publicerad text kräver fortfarande exakta sidor.
 */
export interface Kallplanregel {
  prefix: string;
  kallor: string[];
  uppgift: string;
}

export const KALLPLAN_REGLER: Kallplanregel[] = [
  { prefix: "introduktion", kallor: ["PET-SJUHUNDRA", "AHR2021", "ADA2015"], uppgift: "Avgränsning, källkritik och texttyper" },
  { prefix: "introduktion/kallor-och-texttyper", kallor: ["COL1913", "AVG-MASKIN"], uppgift: "Konkreta typer av primärmaterial och editioner" },

  { prefix: "ljudlara", kallor: ["NOR1904", "PET-SJUHUNDRA"], uppgift: "Systematisk ljudlära och morfofonologi" },
  { prefix: "ljudlara/vokaler/diftonger", kallor: ["VIK-GRAM"], uppgift: "Runsvensk och nordisk jämförelse" },
  { prefix: "ljudlara/konsonanter/thorn-och-t", kallor: ["HOR2016"], uppgift: "Kronologi, geografi och grafemdistribution" },

  { prefix: "ortografi", kallor: ["PET-SJUHUNDRA", "AHR2021", "COL1913"], uppgift: "Skrift, handskrifter och editionsprinciper" },
  { prefix: "ortografi/runor-och-latinskrift", kallor: ["VIK-GRAM", "MAR2018-RUN"], uppgift: "Runtecken och medeltida runmaterial" },
  { prefix: "ortografi/alfabet-och-grafem", kallor: ["HOR2016"], uppgift: "þ och konkurrerande skrivningar" },

  { prefix: "morfologins-grunder", kallor: ["NOR1904", "PET-SJUHUNDRA"], uppgift: "Terminologi, böjningskategorier och paradigmläsning" },

  { prefix: "substantiv", kallor: ["NOR1904", "PET-SJUHUNDRA"], uppgift: "Basparadigm och systemöversikt" },
  { prefix: "substantiv/fyrkasussystemet", kallor: ["LIN2024", "ALL2023"], uppgift: "Kasusfunktioner och systemförändring" },
  { prefix: "substantiv/fyrkasussystemet/dativ", kallor: ["HOL2015", "DFA2009", "NYL2015", "HJO2017", "HOP2021"], uppgift: "Dativrektion, former och bortfall" },
  { prefix: "substantiv/fyrkasussystemet/genitiv", kallor: ["LIN2024", "DFA2009", "HOP2021"], uppgift: "Genitivfunktioner och s-genitivens expansion" },
  { prefix: "substantiv/fyrkasussystemet/ackusativ", kallor: ["NYL2015", "HJO2017", "DFA2009"], uppgift: "Ackusativfunktioner och expansion" },
  { prefix: "substantiv/starka", kallor: ["MAR2018-RUN", "MAR2016", "VIK-GRAM"], uppgift: "Stamklasser och belagda runformer" },
  { prefix: "substantiv/svaga", kallor: ["MAR2018-RUN", "VIK-GRAM"], uppgift: "Svaga stamklasser" },
  { prefix: "substantiv/svaga/svaga-maskuliner-e-a", kallor: ["SAN2013"], uppgift: "Variationslingvistisk analys av -e/-a" },
  { prefix: "substantiv/bestamd-form", kallor: ["SKR2012", "STR2015"], uppgift: "Slutartikel och definitmarkering" },
  { prefix: "substantiv/runsvenska-former", kallor: ["MAR2016", "VIK-GRAM"], uppgift: "Runsvenska feminina former" },
  { prefix: "substantiv/medeltida-runinskrifter", kallor: ["MAR2018-RUN"], uppgift: "Medeltida runbelägg" },
  { prefix: "substantiv/substantivens-forandring", kallor: ["ALL2023", "HOL2015", "SAN2013"], uppgift: "Diakron sammanfattning" },

  { prefix: "adjektiv", kallor: ["NOR1904", "PET-SJUHUNDRA", "VIK-GRAM"], uppgift: "Paradigm, kongruens och komparation" },
  { prefix: "adjektiv/adjektivens-forandring", kallor: ["ALL2023", "DFA2009", "HJO2017", "HOP2021"], uppgift: "Kasus- och kongruensförlust" },
  { prefix: "adjektiv/adjektiviska-particip", kallor: ["DFA2009", "HOP2021"], uppgift: "Participens nominala böjning" },

  { prefix: "pronomen", kallor: ["NOR1904", "PET-SJUHUNDRA", "VIK-GRAM"], uppgift: "Pronominala paradigm" },
  { prefix: "pronomen/personreferens", kallor: ["HOL2018"], uppgift: "Referensval och informationsstruktur" },
  { prefix: "pronomen/pronomensystemets-forandring", kallor: ["ALL2023", "DFA2009", "HOP2021", "HOL2018"], uppgift: "Kasusbortfall och referensmönster" },

  { prefix: "rakneord", kallor: ["NOR1904", "PET-SJUHUNDRA", "VIK-GRAM"], uppgift: "Former, böjning och kongruens" },
  { prefix: "rakneord/rakneord-i-fras", kallor: ["ALL2023"], uppgift: "Räkneord i kasusanalys" },

  { prefix: "verb", kallor: ["NOR1904", "PET-SJUHUNDRA", "VIK-GRAM"], uppgift: "Konjugationer och grundparadigm" },
  { prefix: "verb/person-och-numerus", kallor: ["HOR2022"], uppgift: "Personkongruens och dess avveckling" },
  { prefix: "verb/modus", kallor: ["NOR2011"], uppgift: "Konjunktivens distribution och förändring" },
  { prefix: "verb/hjalpverb/bliva", kallor: ["LOE2013", "SKR-ENG-BLIVA"], uppgift: "Betydelseförändring och passiv hjälpverbsfunktion" },
  { prefix: "verb/hjalpverb/varda", kallor: ["LOE2013", "SKR-ENG-BLIVA"], uppgift: "Kopula och passiv i konkurrens med bliva" },
  { prefix: "verb/diates-och-reflexivitet/perifrastisk-passiv", kallor: ["LOE2013", "SKR-ENG-BLIVA"], uppgift: "Perifrastiska passivkonstruktioner" },
  { prefix: "verb/verbbojningens-forandring", kallor: ["HOR2022", "NOR2011"], uppgift: "Person-, numerus- och modusutjämning" },

  { prefix: "adverb", kallor: ["NOR1904", "PET-SJUHUNDRA"], uppgift: "Adverbbildning och komparation" },
  { prefix: "adverb/lagom", kallor: ["FRY2024"], uppgift: "Belägg och grammatikaliseringsanalys" },

  { prefix: "prepositioner", kallor: ["NOR1904", "PET-SJUHUNDRA", "ALL2023", "HOL2015"], uppgift: "Kasusrektion och diakron förändring" },
  { prefix: "konjunktioner", kallor: ["NOR1904", "PET-SJUHUNDRA", "NOR2011"], uppgift: "Samordning, underordning och at-satser" },
  { prefix: "negation", kallor: ["KHU2024", "BER-EJ"], uppgift: "Former, syntaktisk distribution och grammatikalisering" },

  { prefix: "ordbildning", kallor: ["NOR1904", "PET-SJUHUNDRA", "WES1970"], uppgift: "Avledning, sammansättning och kontakt" },
  { prefix: "ordbildning/namnbildning", kallor: ["MAR2020"], uppgift: "Binamnens morfologi" },
  { prefix: "ordbildning/ordklassvaxling", kallor: ["FRY2024", "LOE2013"], uppgift: "Lexikalisering och grammatikalisering" },

  { prefix: "syntax", kallor: ["PET-SJUHUNDRA", "NOR1904"], uppgift: "Syntaktisk basbeskrivning" },
  { prefix: "syntax/nominalfras/definitmarkering", kallor: ["STR2015", "SKR2012"], uppgift: "Definitmarkering med adjektivattribut" },
  { prefix: "syntax/ordfoljd/ov-vo", kallor: ["HOL2024"], uppgift: "OV/VO i dialog och relation" },
  { prefix: "syntax/ordfoljd/kilkonstruktion", kallor: ["ANK2023"], uppgift: "Kilhierarki och syntaktiska villkor" },
  { prefix: "syntax/subjektsloshet", kallor: ["HAK2008", "ANK2023"], uppgift: "Typer av subjektslöshet och deras förändring" },
  { prefix: "syntax/bisatser/at-satser", kallor: ["NOR2011"], uppgift: "Konjunktiv i deklarativa at-satser" },
  { prefix: "syntax/informationsstruktur", kallor: ["HOL2018", "HOL2024"], uppgift: "Referens och ledplacering" },

  { prefix: "forandring-och-variation", kallor: ["PET-SJUHUNDRA"], uppgift: "Tvärgående diakron syntes" },
  { prefix: "forandring-och-variation/kasussammanfallet", kallor: ["ALL2023", "LIN2024", "HOL2015", "DFA2009", "NYL2015", "HJO2017", "HOP2021"], uppgift: "Syntes av hela det lokala kasusmaterialet" },
  { prefix: "forandring-och-variation/kasus-i-diplom", kallor: ["ALL2023", "DFA2009", "NYL2015", "HOP2021"], uppgift: "Diplomstudier och transkriberade belägg" },
  { prefix: "forandring-och-variation/kasus-i-lagsprak", kallor: ["LIN2024", "AVG-MASKIN"], uppgift: "Lagspråk och primärbelägg" },
  { prefix: "forandring-och-variation/kasus-i-religios-prosa", kallor: ["HJO2017"], uppgift: "Tungulus som fallstudie" },
  { prefix: "forandring-och-variation/geografisk-variation", kallor: ["ALL2023", "HOR2016"], uppgift: "Regional spridning av förändringar" },
  { prefix: "forandring-och-variation/genrevariation", kallor: ["HOL2015", "HOL2024", "HOL2018"], uppgift: "Texttyp och stil" },
  { prefix: "forandring-och-variation/personkongruensens-avveckling", kallor: ["HOR2022"], uppgift: "Diakron och typologisk syntes" },
  { prefix: "forandring-och-variation/bestamdhetens-grammatikalisering", kallor: ["SKR2012", "STR2015"], uppgift: "Artikelutveckling" },
  { prefix: "forandring-och-variation/tyskt-inflytande", kallor: ["WES1970", "LOE2013", "HOL2024", "HOR2016"], uppgift: "Kontaktförklaringar med uttryckta reservationer" },
  { prefix: "forandring-och-variation/morfologisk-datering", kallor: ["ALL2023", "HOR2016", "AHR2021"], uppgift: "Dateringskriterier och metodiska begränsningar" },

  { prefix: "studieverktyg", kallor: ["PET-SJUHUNDRA", "AVG-MASKIN"], uppgift: "Källbundna studie- och analysmetoder" },
  { prefix: "studieverktyg/kasusanalys", kallor: ["NYL2015", "HJO2017"], uppgift: "Reproducerbara analyssteg och tvetydiga fall" },
  { prefix: "studieverktyg/textlasning", kallor: ["COL1913", "AHR2021"], uppgift: "Utgåva, handskrift och läsning" },
];

export const ARTIKELMALL = [
  "Lärandemål",
  "Källäge och avgränsning",
  "Regel eller systemöversikt",
  "Paradigm eller strukturtabell",
  "Kommenterade primärbelägg",
  "Variation och osäkra fall",
  "Historisk utveckling där källorna medger det",
  "Övningar med källbundet facit",
] as const;

export function kallorForArtikel(sokvag: string): string[] {
  return [
    ...new Set(
      KALLPLAN_REGLER
        .filter((regel) => sokvag === regel.prefix || sokvag.startsWith(`${regel.prefix}/`))
        .flatMap((regel) => regel.kallor)
    ),
  ];
}

export function produktionsprioritet(sokvag: string): 1 | 2 | 3 | 4 {
  if (
    sokvag.startsWith("morfologins-grunder") ||
    sokvag.startsWith("substantiv") ||
    sokvag.startsWith("adjektiv") ||
    sokvag.startsWith("pronomen") ||
    sokvag.startsWith("rakneord") ||
    sokvag.startsWith("verb")
  ) return 1;
  if (sokvag.startsWith("introduktion") || sokvag.startsWith("ljudlara") || sokvag.startsWith("ortografi")) return 2;
  if (sokvag.startsWith("adverb") || sokvag.startsWith("prepositioner") || sokvag.startsWith("forandring-och-variation")) return 2;
  if (sokvag.startsWith("syntax") || sokvag.startsWith("negation") || sokvag.startsWith("konjunktioner")) return 3;
  return 4;
}

