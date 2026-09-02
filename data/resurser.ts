import type { Hylla, Resurs } from "@/lib/resurstyper";

/**
 * Demomaterial. Visas bara när Supabase inte är konfigurerat, så att sidan
 * går att titta på lokalt utan databas. Med databas är biblioteket tomt tills
 * du lägger till din första hylla i redigeringsläget.
 */

const larobocker: Resurs[] = [
  {
    id: "demo-noreen",
    hyllaId: "demo-borja",
    typ: "larobok",
    titel: "Altschwedische Grammatik",
    forfattare: "Adolf Noreen",
    ar: "1904",
    utgivare: "Niemeyer, Halle",
    tillganglighet: 5,
    lank: "https://archive.org",
    beskrivning:
      "Standardverket för fornsvensk formlära. Tung men fullständig; de flesta senare framställningar hänvisar hit.",
    versioner: [],
    position: 0,
  },
  {
    id: "demo-wessen",
    hyllaId: "demo-borja",
    typ: "larobok",
    titel: "Svensk språkhistoria I: Ljudlära och ordböjningslära",
    forfattare: "Elias Wessén",
    ar: "1968",
    tillganglighet: 3,
    beskrivning:
      "Den vanliga ingången till fornsvenskan på svenska. Andra delen behandlar syntaxen.",
    versioner: [],
    position: 1,
  },
];

const uppsatser: Resurs[] = [
  {
    id: "demo-kasus",
    hyllaId: "demo-kasus",
    typ: "examensarbete",
    titel: "Det fornsvenska kasussystemets förändring under 1400-talet",
    tillganglighet: 5,
    beskrivning: "Uppsats om kasussammanfallets förlopp i brevmaterial.",
    versioner: [],
    position: 0,
  },
  {
    id: "demo-dativ",
    hyllaId: "demo-kasus",
    typ: "examensarbete",
    titel: "En korpusundersökning av dativanvändning i äldre svenska",
    tillganglighet: 5,
    versioner: [],
    position: 1,
  },
];

export const DEMO_HYLLOR: Hylla[] = [
  {
    id: "demo-borja",
    titel: "Att börja med",
    note: "Grundläggande framställningar av fornsvenskan",
    position: 0,
    resurser: larobocker,
  },
  {
    id: "demo-kasus",
    titel: "Kasus och böjning",
    note: "Uppsatser om kasussystemets upplösning",
    position: 1,
    resurser: uppsatser,
  },
];

/**
 * Fasta fulltexter som hör till sajten, inte till en viss Supabase-installation.
 * De läggs därför till även när resten av biblioteket kommer från databasen.
 */
export const FASTA_SKRIFTER: Resurs[] = [
  {
    id: "vastgotalagen-maskintext",
    hyllaId: null,
    typ: "skrift",
    titel: "Äldre Västgötalagen — fullständig maskintext",
    forfattare: "Lars-Olof Delsing",
    ar: "c:a 1280",
    utgivare: "Cod. Holm. B 59",
    lank: "/bocker/vastgotalagen/vastgotalagen-maskintext.pdf",
    tillganglighet: 5,
    beskrivning:
      "Hela Äldre Västgötalagen i maskinläsbar transkription efter Collin och Schlyters utgåva (SSGL I). Texten är inskriven av Lars-Olof Delsing vid Lunds universitet.",
    position: 0,
    versioner: [],
    bok: {
      sokvag: "/resurser/vastgotalagen",
      pdf: "/bocker/vastgotalagen/vastgotalagen-maskintext.pdf",
      sidor: 25,
    },
  },
];
