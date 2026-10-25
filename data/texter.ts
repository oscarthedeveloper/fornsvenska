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
          { slug: "kristnu-balker-i", title: "Kristnu balkær, del I", kind: "doc", note: "Inledningen och dopet" },
          { slug: "kristnu-balker-ii", title: "Kristnu balkær, del II", kind: "doc", note: "Kyrkobyggnad och kyrkofrid" },
          { slug: "kristnu-balker-iii", title: "Kristnu balkær, del III", kind: "doc", note: "Klockfall, kyrkogård och prästens förfall" },
          { slug: "kristnu-balker-iv", title: "Kristnu balkær, del IV", kind: "doc", note: "Tiondedelning, lägerstad och sockenbygge" },
          { slug: "mandraps-balker-i", title: "Af mandrapi, del I", kind: "doc", note: "Dråpslysning, ättleidde och utländsk man" },
          { slug: "mandraps-balker-ii", title: "Af mandrapi, del II", kind: "doc", note: "Hemgång, ölstuga, allmänning och vådadöd" },
          { slug: "sara-balker", title: "Af særæ malum", kind: "doc", note: "Fulsår, lemlästning och skadetaxa" },
          { slug: "vada-sara-balker", title: "Af vaþæ sarum", kind: "doc", note: "Vådasår och läkekostnader" },
          { slug: "bardagha-balker", title: "Bardaghæ", kind: "doc", note: "Slagsmål, kvinnofrid och giftmord" },
          { slug: "orbota-mal", title: "Orbotæ mal", kind: "doc", note: "Nidingsverk och fredlöshet" },
          { slug: "arfda-balker", title: "Ærfþa balkær, del I", kind: "doc", note: "Arvsordning, kullar och Greklandsfararen" },
          { slug: "arfda-balker-ii", title: "Ærfþa balkær, del II", kind: "doc", note: "Samtidig död, makars bo och ättledning" },
          { slug: "giptar-balker", title: "Giptar bolkær", kind: "doc", note: "Fästning, hemgift, morgongåva och bannlysta led" },
          { slug: "raetlosa-balker", title: "Rætlosæ bolkær", kind: "doc", note: "Kungaval, Eriksgata, biskopsval och ärekränkning" },
          { slug: "iordhar-balker-i", title: "Iordþær bolkær, del I", kind: "doc", note: "Jordafång, köp, fastar, bördsrätt och byamål" },
          { slug: "iordhar-balker-ii", title: "Iordþær bolkær, del II", kind: "doc", note: "Tomträtt, allmänning, markskäl och skifte" },
          { slug: "mylnu-balker", title: "Huru mylnu skal gæræ", kind: "doc", note: "Kvarnbygge, dämning, kungsådra och vattenrätt" },
          { slug: "thiuua-balker-i", title: "Þiuuæ bollkær, del I", kind: "doc", note: "Stöld, rannsakning, lösöretak och tjuvs ed" },
          { slug: "thiuua-balker-ii", title: "Þiuuæ bollkær, del II", kind: "doc", note: "Laga tak, utländskt köp, trälars stöld och köpvittnen" },
          { slug: "fornaemis-sakir", title: "Fornæmix sakir", kind: "doc", note: "Åverkansmål, ekhuggning, redskapstillgrepp och åkarnam" },
          { slug: "fornamix-balker", title: "Fornamix bolkær", kind: "doc", note: "Hägnad, vallhjon, jakträtt, vildbin och legofolk" },
          { slug: "lecara-raetar", title: "Lecara rætar", kind: "doc", note: "Lekarerätten och gycklares ställning" },
          { slug: "conongs-balker", title: "Conongs bolkær", kind: "doc", note: "Landamäret mot Danmark och Danaholmen" },
          { slug: "horo-thing-lot", title: "Horo þing lot skal skiptæ", kind: "doc", note: "Tingslott och bonens skifte" },
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
