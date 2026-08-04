import type { Node } from "@/lib/typer";

/**
 * Innehållsträdet för Grammatik.
 *
 * Detta är tills vidare den enda datakällan. När Supabase kopplas in byts
 * enbart funktionerna i lib/archive.ts ut — vyerna rör aldrig den här filen
 * direkt, och nodformen är densamma som den tänkta databastabellen:
 *   nodes(id, parent_id, slug, title, kind, note, position)
 */
export const GRAMMATIK: Node[] = [
  {
    slug: "ljudlara",
    title: "Ljudlära",
    kind: "folder",
    note: "Vokalism, konsonantism, ljudlagar",
    children: [
      { slug: "vokaler", title: "Vokalsystemet", kind: "doc", note: "Långa och korta vokaler" },
      { slug: "konsonanter", title: "Konsonantsystemet", kind: "doc", note: "Klusiler, frikativor" },
      { slug: "ljudlagar", title: "Ljudlagar", kind: "folder", note: "Regelbundna förändringar",
        children: [
          { slug: "omljud", title: "Omljud", kind: "doc", note: "i-, u- och a-omljud" },
          { slug: "brytning", title: "Brytning", kind: "doc", note: "e > ia, iæ" },
          { slug: "vokalbalans", title: "Vokalbalans", kind: "doc", note: "Ändelsevokalernas växling" },
        ],
      },
    ],
  },
  {
    slug: "ortografi",
    title: "Ortografi",
    kind: "folder",
    note: "Skrivbruk i handskrifterna",
    children: [
      { slug: "handskriftsbruk", title: "Handskriftsbruk", kind: "doc", note: "Varianter mellan skrivare" },
      { slug: "forkortningar", title: "Förkortningstecken", kind: "doc", note: "Abbreviaturer och suspensioner" },
    ],
  },
  {
    slug: "substantiv",
    title: "Substantiv",
    kind: "folder",
    note: "Genus, numerus, kasus",
    children: [
      {
        slug: "fyrkasussystemet",
        title: "Fyrkasussystemet",
        kind: "folder",
        note: "Kasusens funktion och former",
        children: [
          { slug: "nominativ", title: "Nominativ", kind: "doc", note: "Subjektskasus" },
          { slug: "genitiv", title: "Genitiv", kind: "doc", note: "Possessiv och partitiv" },
          { slug: "dativ", title: "Dativ", kind: "doc", note: "Indirekt objekt, prepositioner" },
          { slug: "ackusativ", title: "Ackusativ", kind: "doc", note: "Direkt objekt, riktning" },
        ],
      },
      { slug: "starka", title: "Starka substantiv", kind: "doc", note: "a-, i-, u-stammar" },
      { slug: "svaga", title: "Svaga substantiv", kind: "doc", note: "n-stammar" },
      { slug: "bestamd-form", title: "Bestämd form", kind: "doc", note: "Suffigerad artikel" },
    ],
  },
  {
    slug: "adjektiv",
    title: "Adjektiv",
    kind: "folder",
    note: "Stark och svag böjning",
    children: [
      { slug: "stark-bojning", title: "Stark böjning", kind: "doc", note: "Obestämd ställning" },
      { slug: "svag-bojning", title: "Svag böjning", kind: "doc", note: "Efter bestämning" },
      { slug: "komparation", title: "Komparation", kind: "doc", note: "-ari, -aster" },
    ],
  },
  {
    slug: "pronomen",
    title: "Pronomen",
    kind: "folder",
    note: "Personliga, demonstrativa, relativa",
    children: [
      { slug: "personliga", title: "Personliga pronomen", kind: "doc", note: "Med dualis" },
      { slug: "demonstrativa", title: "Demonstrativa pronomen", kind: "doc", note: "þænne, sa" },
      { slug: "relativa", title: "Relativa pronomen", kind: "doc", note: "þer, sum" },
    ],
  },
  { slug: "rakneord", title: "Räkneord", kind: "doc", note: "Grund- och ordningstal" },
  {
    slug: "verb",
    title: "Verb",
    kind: "folder",
    note: "Konjugation, modus, tempus",
    children: [
      { slug: "starka-verb", title: "Starka verb", kind: "doc", note: "Sju avljudsklasser" },
      { slug: "svaga-verb", title: "Svaga verb", kind: "doc", note: "Tre klasser" },
      { slug: "preteritopresentia", title: "Preteritopresentia", kind: "doc", note: "skulu, mughu, vita" },
      { slug: "modus", title: "Modus", kind: "doc", note: "Indikativ, konjunktiv, imperativ" },
    ],
  },
  { slug: "adverb", title: "Adverb", kind: "doc", note: "Bildning och komparation" },
  {
    slug: "prepositioner",
    title: "Prepositioner",
    kind: "folder",
    note: "Rektion och betydelse",
    children: [
      { slug: "med-dativ", title: "Prepositioner med dativ", kind: "doc", note: "i, a, af, mæþ" },
      { slug: "med-ackusativ", title: "Prepositioner med ackusativ", kind: "doc", note: "Riktning och mål" },
    ],
  },
  { slug: "konjunktioner", title: "Konjunktioner", kind: "doc", note: "Samordning och underordning" },
  {
    slug: "syntax",
    title: "Syntax",
    kind: "folder",
    note: "Satsbyggnad i lagspråket",
    children: [
      { slug: "ordfoljd", title: "Ordföljd", kind: "doc", note: "Huvudsats och bisats" },
      { slug: "bisatser", title: "Bisatser", kind: "doc", note: "Villkor och relativ" },
      { slug: "negation", title: "Negation", kind: "doc", note: "æi, ængin, aldrigh" },
    ],
  },
];
