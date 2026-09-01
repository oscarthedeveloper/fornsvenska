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

export const DEMO_SKRIFTER: Resurs[] = [
  {
    id: "demo-vgl",
    hyllaId: null,
    typ: "skrift",
    titel: "Äldre Västgötalagen, Rättlösabalken",
    ar: "c:a 1280",
    utgivare: "Cod. Holm. B 59",
    tillganglighet: 4,
    beskrivning:
      "Den äldsta bevarade svenska handskriften på folkspråk. Utdraget nedan är inledningen till Rättlösabalken.",
    position: 0,
    versioner: [
      {
        id: "grund",
        etikett: "Grundtext",
        note: "Normaliserad stavning, inga markeringar.",
        innehall:
          "Dræpær maþær svænskan man eller smalænskan, innan konongsrikis man, þa skal han bötæ firi hanum þrea marker. Dræpær maþær danskan man allæ noræn man, þa skal han bötæ atta örtogher ok þrettan marker.",
      },
      {
        id: "pron",
        etikett: "Pronomen",
        note: "Alla pronomen är markerade.",
        innehall:
          "Dræpær maþær svænskan man eller smalænskan, innan konongsrikis man, þa skal ==han|Pronomen== bötæ firi ==hanum|Pronomen== þrea marker. Dræpær maþær danskan man allæ noræn man, þa skal ==han|Pronomen== bötæ atta örtogher ok þrettan marker.",
      },
      {
        id: "verb",
        etikett: "Verb",
        note: "Alla finita verb är markerade.",
        innehall:
          "==Dræpær|Verb== maþær svænskan man eller smalænskan, innan konongsrikis man, þa ==skal|Verb== han ==bötæ|Verb== firi hanum þrea marker. ==Dræpær|Verb== maþær danskan man allæ noræn man, þa ==skal|Verb== han ==bötæ|Verb== atta örtogher ok þrettan marker.",
      },
    ],
  },
];
