import type { Node } from "@/lib/typer";

/**
 * Innehållsträdet för Texter. Långa texter delas i flera dokument — därför
 * ligger t.ex. Kristnu balkær som två delar under samma mapp.
 */
export const TEXTER: Node[] = [
  {
    slug: "lagar",
    title: "Lagar",
    kind: "folder",
    note: "Landskapslagar i handskrift",
    children: [
      {
        slug: "aldre-vastgotalagen",
        title: "Äldre Västgötalagen",
        kind: "folder",
        note: "Cod. Holm. B 59",
        children: [
          { slug: "kristnu-balker-i", title: "Kristnu balkær, del I", kind: "doc", note: "Inledningen" },
          { slug: "kristnu-balker-ii", title: "Kristnu balkær, del II", kind: "doc", note: "Fortsättning" },
          { slug: "arfda-balker", title: "Ærfþa balkær", kind: "doc", note: "Arvsregler" },
        ],
      },
      {
        slug: "upplandslagen",
        title: "Upplandslagen",
        kind: "folder",
        note: "Stadfäst 1296",
        children: [
          { slug: "foretalet", title: "Företalet", kind: "doc", note: "Land skal mæþ laghum byggias" },
          { slug: "kyrkiu-balker", title: "Kyrkiu balkær", kind: "doc" },
        ],
      },
      { slug: "magnus-erikssons-landslag", title: "Magnus Erikssons landslag", kind: "doc", note: "Omkring 1350" },
    ],
  },
  {
    slug: "urkunder",
    title: "Urkunder och brev",
    kind: "folder",
    note: "Svenskt diplomatarium",
    children: [
      { slug: "sdhk-4512", title: "SDHK 4512", kind: "doc", note: "Jordabyte, 1300-talet" },
      { slug: "sdhk-1121", title: "SDHK 1121", kind: "doc", note: "Gåvobrev" },
      { slug: "formler", title: "Brevformler", kind: "doc", note: "Återkommande vändningar" },
    ],
  },
  {
    slug: "runinskrifter",
    title: "Runinskrifter",
    kind: "folder",
    note: "Medeltida runmaterial",
    children: [
      { slug: "uppland", title: "Uppland", kind: "folder", note: "U-nummer",
        children: [
          { slug: "u-240", title: "U 240", kind: "doc" },
          { slug: "u-489", title: "U 489", kind: "doc" },
        ],
      },
      { slug: "gotland", title: "Gotland", kind: "folder", note: "G-nummer",
        children: [{ slug: "g-104", title: "G 104", kind: "doc" }],
      },
    ],
  },
  {
    slug: "religios-prosa",
    title: "Religiös prosa",
    kind: "folder",
    note: "Legendarium och uppenbarelser",
    children: [
      { slug: "fornsvenska-legendariet", title: "Fornsvenska legendariet", kind: "doc", note: "Helgonlegender" },
      { slug: "birgitta", title: "Birgittas uppenbarelser", kind: "doc", note: "Fornsvensk översättning" },
    ],
  },
];
