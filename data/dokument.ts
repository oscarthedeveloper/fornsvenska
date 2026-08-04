import type { Dokument } from "@/lib/dokument";

/**
 * Dokumentinnehåll, nycklat på full sökväg under roten.
 *
 * Innehållet nedan är exempelinnehåll som du ersätter via admin. Blockformen
 * är densamma som den tänkta Supabase-tabellen:
 *   blocks(id, document_id, position, type, payload jsonb)
 */
export const GRAMMATIK_DOKUMENT: Record<string, Dokument> = {
  "substantiv/fyrkasussystemet/dativ": {
    titel: "Dativ",
    underrubrik: "Indirekt objekt, prepositionsrektion och kvarlevande former",
    utkast: true,
    meta: [
      { nyckel: "Kasus", varde: "Dativ" },
      { nyckel: "Ordklass", varde: "Substantiv" },
      { nyckel: "Period", varde: "Äldre fsv. 1225—1375" },
      { nyckel: "Belägg", varde: "Laghandskrifter, urkunder" },
    ],
    citat: {
      text:
        "Krister ær fyrst i laghum warum þa ær cristna var oc allir cristnir konongær",
      kalla: "Äldre Västgötalagen, Kristnu balkær",
    },
    ingress:
      "Dativen är det kasus som håller sig längst och tydligast i fornsvenskan, framför allt i pluralis, där ändelsen -um är svår att förväxla med något annat. I laghandskrifterna bärs den upp av prepositionerna och av det indirekta objektet.",
    block: [
      {
        typ: "rubrik",
        niva: 2,
        text: "Dativ efter preposition",
      },
      {
        typ: "spalter",
        utdrag:
          "Krister ær fyrst i laghum warum",
        utdragKalla: "Äldre Västgötalagen",
        kommentar:
          "Prepositionen *i* står här med dativ och anger befintlighet: *i lagarna våra*. Både substantivet *laghum* och det possessiva *warum* bär dativändelsen -um, vilket är regel — attributet kongruerar med huvudordet i kasus, numerus och genus.[^1] Skulle prepositionen ange riktning in i något skulle ackusativ ha stått i stället.",
      },
      {
        typ: "spalter",
        utdrag: "Land skal mæþ laghum byggias",
        utdragKalla: "Upplandslagen, företalet",
        kommentar:
          "Samma ändelse, men här efter *mæþ* i instrumental betydelse: *med lagar skall land byggas*. Att -um håller sig så väl i pluralis beror på att ändelsen är stavelsebärande och betonad nog för att inte reduceras lika snabbt som singularis -i.",
      },
      {
        typ: "rubrik",
        niva: 2,
        text: "Paradigm: stark maskulin a-stam",
      },
      {
        typ: "tabell",
        rubrik: "fiskær (m.), a-stam",
        kolumner: ["Kasus", "Singularis", "Pluralis"],
        rader: [
          ["Nominativ", "fiskær", "fiskar"],
          ["Genitiv", "fisks", "fiska"],
          ["Dativ", "fiski", "fiskum"],
          ["Ackusativ", "fisk", "fiska"],
        ],
        markeraRad: 2,
      },
      {
        typ: "obs",
        etikett: "Obs",
        text:
          "Dativ singularis -i faller tidigt samman med den ändelselösa formen, medan pluralis -um lever kvar långt in i yngre fornsvenska. När du daterar en handskrift är därför pluralformerna ett säkrare stöd än singularformerna.",
      },
      {
        typ: "rubrik",
        niva: 2,
        text: "Indirekt objekt",
      },
      {
        typ: "stycke",
        text:
          "Utan preposition markerar dativen mottagaren vid verb som *giva*, *sighia* och *gælda*. Ordföljden är fri nog att mottagaren kan stå både före och efter det direkta objektet, och det är då kasusändelsen — inte platsen i satsen — som avgör tolkningen.[^2]",
      },
      {
        typ: "nycklar",
        poster: [
          { nyckel: "Typiska prepositioner", varde: "i, a, af, mæþ, at, undir" },
          { nyckel: "Säkraste kännetecken", varde: "-um i pluralis" },
          { nyckel: "Vanlig förväxling", varde: "genitiv pluralis -a" },
        ],
      },
    ],
    fotnoter: [
      {
        id: 1,
        text:
          "A. Noreen, Altschwedische Grammatik (Halle 1904), avsnittet om substantivens och adjektivens böjning.",
      },
      {
        id: 2,
        text:
          "C. J. Schlyter (utg.), Corpus iuris Sueo-Gotorum antiqui, band 1: Westgöta-Lagen.",
      },
    ],
  },

  "substantiv/fyrkasussystemet/nominativ": {
    titel: "Nominativ",
    underrubrik: "Subjektskasus och den maskulina ändelsen -ær",
    utkast: true,
    meta: [
      { nyckel: "Kasus", varde: "Nominativ" },
      { nyckel: "Ordklass", varde: "Substantiv" },
      { nyckel: "Period", varde: "Äldre fsv. 1225—1375" },
    ],
    ingress:
      "Nominativen är utgångsformen i ordböcker och paradigm. I fornsvenskan är den inte omarkerad: starka maskuliner bär ändelsen -ær, som senare faller bort och därmed suddar ut gränsen mot ackusativen.",
    block: [
      {
        typ: "spalter",
        utdrag: "þa ær cristna var oc allir cristnir konongær",
        utdragKalla: "Äldre Västgötalagen",
        kommentar:
          "*konongær* står i nominativ som predikatsfyllnad, och *allir cristnir* kongruerar med det. Att ändelsen -ær syns här men saknas i yngre handskrifter är ett av de tydligaste dateringskriterierna.",
      },
    ],
    fotnoter: [],
  },
};
