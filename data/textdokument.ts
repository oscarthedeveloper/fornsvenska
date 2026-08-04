import type { Textdokument } from "@/lib/text";

/**
 * Textinnehåll, nycklat på full sökväg under roten "texter".
 * Exempelinnehåll — ersätts via admin.
 */
export const TEXTER_DOKUMENT: Record<string, Textdokument> = {
  "lagar/aldre-vastgotalagen/kristnu-balker-i": {
    titel: "Kristnu balkær, del I",
    underrubrik: "Äldre Västgötalagen, inledningen",
    utkast: true,
    meta: [
      { nyckel: "Handskrift", varde: "Cod. Holm. B 59" },
      { nyckel: "Datering", varde: "Omkr. 1280" },
      { nyckel: "Genre", varde: "Landskapslag" },
      { nyckel: "Utgåva", varde: "Schlyter, CIS I" },
    ],
    ingress:
      "Balkens första rader slår fast trosbekännelsens plats i lagen. Språket är ålderdomligt även för sin tid: kasusändelserna står kvar helt, och ordföljden är fri på ett sätt som senare försvinner.",
    sektioner: [
      {
        rubrik: "Sektion 01",
        hanvisning: "Kristnu balkær, inledningsraderna",
        meningar: [
          {
            fsv: "Krister ær fyrst i laghum warum",
            tolkning: "Kristus är främst i våra lagar.",
            kommentar:
              "laghum warum: dativ pluralis efter prepositionen i, med kongruerande possessivt attribut.",
          },
          {
            fsv: "þa ær cristna var oc allir cristnir konongær",
            tolkning:
              "Därnäst vår kristenhet och alla kristna konungar.",
            kommentar:
              "Läsningen är omdiskuterad; cristna var kan också föras till följande sats. Nominativ pluralis allir cristnir kongruerar med konongær.",
          },
        ],
      },
      {
        rubrik: "Sektion 02",
        hanvisning: "Jämförande belägg",
        meningar: [
          {
            fsv: "Land skal mæþ laghum byggias",
            tolkning: "Land skall byggas med lag.",
            kommentar:
              "Upplandslagens företal. Samma dativkonstruktion som ovan, här efter mæþ i instrumental betydelse.",
          },
        ],
      },
    ],
    fotnoter: [
      {
        id: 1,
        text: "C. J. Schlyter (utg.), Corpus iuris Sueo-Gotorum antiqui, band 1: Westgöta-Lagen.",
      },
      {
        id: 2,
        text: "A. Noreen, Altschwedische Grammatik (Halle 1904).",
      },
    ],
  },
};
