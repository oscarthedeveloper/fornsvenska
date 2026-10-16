/**
 * Kandidatgenerering för klicka-på-ord-uppslagning i fornsvenska lästexter (/texter)
 * samt utökad böjnings-/stavningsuppslagning mot Söderwalls ordbok.
 *
 * Principer:
 * - Ingen automatisk gissning presenteras någonsin som om den vore källans eget uppslagsord.
 * - Varje kandidat bär en uttrycklig matchningskategori:
 *   1. "exact": Exakt samma ordform (endast skiftläges-/NFC-normaliserad).
 *   2. "ortho": Dokumenterad ortografisk/paleografisk växling (t.ex. æ -> ä/a, ø -> ö,
 *      ð <-> þ <-> dh, c -> k, kv -> qv, u -> v före vokal).
 *   3. "inflected": Källtrogen böjnings- eller ändelsekandidat (t.ex. dativ pl. -um/-om,
 *      presens/plural -ir/-ar/-er/-ær, bestämd artikel -in/-en/-it/-et/-inum,
 *      passiv/reflexiv -s/-z/-is/-his).
 */

import { normaliseraSokterm } from "./normalisering";

export interface OrdKandidat {
  form: string;
  kind: "exact" | "ortho" | "inflected";
  forklaring?: string;
}

/**
 * Rensar ett klickat ord från eventuell inline-uppmärkning (**fet**, *kursiv*,
 * ==1|...==, [^1]) och skiljetecken.
 */
export function rensaKlickatOrd(raOrd: string): string {
  return raOrd
    .replace(/^==[1-8]\|/, "")
    .replace(/==$/, "")
    .replace(/\[\^\d+\]/g, "")
    .replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
    .normalize("NFC")
    .trim();
}

function basOrtografi(ord: string): string {
  return ord
    .normalize("NFC")
    .toLowerCase()
    .replace(/é/g, "e")
    .replace(/á/g, "a")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ý/g, "y")
    .replace(/æ/g, "ä")
    .replace(/ø/g, "ö")
    .replace(/œ/g, "ö")
    .replace(/w/g, "v")
    .trim();
}

/**
 * Genererar ordnade uppslagskandidater (exact -> ortho -> inflected) för en
 * fornsvensk ordform i en lästext.
 */
export function genereraUppslagskandidater(raOrd: string): OrdKandidat[] {
  const rent = rensaKlickatOrd(raOrd);
  if (!rent) return [];

  const exactForm = normaliseraSokterm(rent);
  const sedda = new Map<string, OrdKandidat>();

  const laggTill = (
    form: string,
    kind: OrdKandidat["kind"],
    forklaring?: string
  ) => {
    const f = form.trim().toLowerCase();
    if (!f || f.length < 1) return;
    if (!sedda.has(f)) {
      sedda.set(f, { form: f, kind, forklaring });
    }
  };

  // 1. Exakt normaliserad form
  laggTill(exactForm, "exact");

  // 2. Ortografiska kandidater (handskriftsstavning -> Söderwalls normaliserade huvudord)
  const bas = basOrtografi(rent);
  laggTill(bas, "ortho", "Ortografisk normalisering (æ/ä, ø/ö, w/v)");

  if (bas === "j") {
    laggTill("i", "ortho", "Handskriftsvariant j för prepositionen/pronomenet i");
  }
  if (bas === "niv") {
    laggTill("nio", "ortho", "Vokalisering niv → nio");
  }
  if (bas === "iki" || bas === "igh" || bas === "eigh") {
    laggTill("eighi", "ortho", "Negationsadverb (igh/iki/eighi)");
    laggTill("äkke", "ortho", "Negationsadverb (iki → äkke)");
    laggTill("ei", "ortho", "Negationsadverb (ei)");
  }
  if (bas.startsWith("brymsign")) {
    laggTill("primsigna", "ortho", "Äldre västgötsk form brymsignæ → primsigna");
  }
  if (/^all(ir|är|er|a|um|om|t|an|ra|o|u)?$/.test(bas)) {
    laggTill("alder", "inflected", "Böjd form av adjektivet alder (all, hel)");
  }
  if (bas === "þät" || bas === "þet" || bas === "thät") {
    laggTill("þän", "inflected", "Neutrum sg. av demonstrativa pronomenet þän");
  }
  if (bas === "scal" || bas === "skal" || bas === "sculu" || bas === "skulu") {
    laggTill("skula", "inflected", "Presens av hjälpverbet skula (skola)");
  }
  if (bas === "ma" || bas === "maghu" || bas === "matte") {
    laggTill("magha", "inflected", "Böjd form av hjälpverbet magha (förmå, må)");
  }
  if (bas === "är" || bas === "äru" || bas === "var" || bas === "varo") {
    laggTill("vara", "inflected", "Böjd form av verbet vara");
  }

  // Omljudda plural-/oblikformer samt starka verbformer i fornsvenskan
  const OREGELBUNDNA_FORMER: Record<string, { lemma: string[]; beskrivning: string }> = {
    män: { lemma: ["man", "maþer"], beskrivning: "Omljudd plural (män/mæn) av man / maþer" },
    mannum: { lemma: ["man", "maþer"], beskrivning: "Dativ pluralis (-um) av man / maþer" },
    manna: { lemma: ["man", "maþer"], beskrivning: "Genitiv pluralis (-a) av man / maþer" },
    böker: { lemma: ["bok"], beskrivning: "Omljudd plural (böker) av bok" },
    föter: { lemma: ["foter"], beskrivning: "Omljudd plural (föter) av foter" },
    händer: { lemma: ["hand"], beskrivning: "Omljudd plural (händer) av hand" },
    hondum: { lemma: ["hand"], beskrivning: "U-omljudd dativ pluralis (hondum) av hand" },
    londum: { lemma: ["land"], beskrivning: "U-omljudd dativ pluralis (londum) av land" },
    loghum: { lemma: ["lagh"], beskrivning: "U-omljudd dativ pluralis (loghum) av lagh" },
    bröþer: { lemma: ["broþir"], beskrivning: "Omljudd plural av broþir" },
    brödher: { lemma: ["broþir"], beskrivning: "Omljudd plural av broþir" },
    möþer: { lemma: ["moþir"], beskrivning: "Omljudd plural/oblik av moþir" },
    mödher: { lemma: ["moþir"], beskrivning: "Omljudd plural/oblik av moþir" },
    fäþer: { lemma: ["faþir"], beskrivning: "Omljudd plural/oblik av faþir" },
    fäþur: { lemma: ["faþir"], beskrivning: "Oblik singularis av faþir" },
    dötter: { lemma: ["dotter"], beskrivning: "Omljudd plural av dotter" },
    nätter: { lemma: ["nat"], beskrivning: "Omljudd plural av nat" },
    tok: { lemma: ["taka"], beskrivning: "Starkt preteritum sg. (tok) av taka" },
    toko: { lemma: ["taka"], beskrivning: "Starkt preteritum pl. (toko) av taka" },
    toku: { lemma: ["taka"], beskrivning: "Starkt preteritum pl. (toku) av taka" },
    gik: { lemma: ["ganga"], beskrivning: "Starkt preteritum sg. (gik) av ganga" },
    gingo: { lemma: ["ganga"], beskrivning: "Starkt preteritum pl. (gingo) av ganga" },
    fik: { lemma: ["fa"], beskrivning: "Starkt preteritum sg. (fik) av fa" },
    fingo: { lemma: ["fa"], beskrivning: "Starkt preteritum pl. (fingo) av fa" },
    gav: { lemma: ["giva"], beskrivning: "Starkt preteritum sg. (gav) av giva" },
    gaf: { lemma: ["giva"], beskrivning: "Starkt preteritum sg. (gaf) av giva" },
    gavo: { lemma: ["giva"], beskrivning: "Starkt preteritum pl. (gavo) av giva" },
    bar: { lemma: ["bära"], beskrivning: "Starkt preteritum sg. (bar) av bära" },
    baru: { lemma: ["bära"], beskrivning: "Starkt preteritum pl. (baru) av bära" },
    boret: { lemma: ["bära"], beskrivning: "Perfekt particip neutr. (boret) av bära" },
    borin: { lemma: ["bära"], beskrivning: "Perfekt particip (borin) av bära" },
    varþ: { lemma: ["varþa"], beskrivning: "Starkt preteritum sg. (varþ) av varþa" },
    vardh: { lemma: ["varþa"], beskrivning: "Starkt preteritum sg. (vardh) av varþa" },
    vurþo: { lemma: ["varþa"], beskrivning: "Starkt preteritum pl. (vurþo) av varþa" },
    kom: { lemma: ["koma"], beskrivning: "Starkt preteritum sg. (kom) av koma" },
    komo: { lemma: ["koma"], beskrivning: "Starkt preteritum pl. (komo) av koma" },
    for: { lemma: ["fara"], beskrivning: "Starkt preteritum sg. (for) av fara" },
    foro: { lemma: ["fara"], beskrivning: "Starkt preteritum pl. (foro) av fara" },
    stodh: { lemma: ["standa"], beskrivning: "Starkt preteritum sg. (stodh) av standa" },
    stodo: { lemma: ["standa"], beskrivning: "Starkt preteritum pl. (stodo) av standa" },
    la: { lemma: ["liggia"], beskrivning: "Starkt preteritum sg. (la) av liggia" },
    lagho: { lemma: ["liggia"], beskrivning: "Starkt preteritum pl. (lagho) av liggia" },
    sa: { lemma: ["se", "sea"], beskrivning: "Starkt preteritum sg. (sa) av se / sea" },
    sagho: { lemma: ["se", "sea"], beskrivning: "Starkt preteritum pl. (sagho) av se / sea" },
    baþ: { lemma: ["biþia"], beskrivning: "Starkt preteritum sg. (baþ) av biþia" },
    badh: { lemma: ["biþia"], beskrivning: "Starkt preteritum sg. (badh) av biþia" },
    böþ: { lemma: ["biuþa"], beskrivning: "Starkt preteritum sg. (böþ) av biuþa" },
    bödh: { lemma: ["biuþa"], beskrivning: "Starkt preteritum sg. (bödh) av biuþa" },
    veit: { lemma: ["vita"], beskrivning: "Preterito-presentiskt presens (veit) av vita" },
    vet: { lemma: ["vita"], beskrivning: "Preterito-presentiskt presens (vet) av vita" },
    viste: { lemma: ["vita"], beskrivning: "Preteritum (viste) av vita" },
  };

  const oreg = OREGELBUNDNA_FORMER[bas];
  if (oreg) {
    for (const lem of oreg.lemma) {
      laggTill(lem, "inflected", oreg.beskrivning);
    }
  }

  const orthoFormer = new Set<string>([bas]);

  // Västgötalagens ändelsevokal -æ (som i bas blivit -ä) -> -a, samt -ær -> -ar/-er/-ir
  for (const x of [...orthoFormer]) {
    if (x.endsWith("ä") && x.length >= 3) {
      orthoFormer.add(x.slice(0, -1) + "a");
    }
    if (x.endsWith("är") && x.length >= 4) {
      orthoFormer.add(x.slice(0, -2) + "ar");
      orthoFormer.add(x.slice(0, -2) + "er");
      orthoFormer.add(x.slice(0, -2) + "ir");
      orthoFormer.add(x.slice(0, -2));
    }
    if (x.endsWith("äs") && x.length >= 4) {
      orthoFormer.add(x.slice(0, -2) + "as");
    }
    if (x.startsWith("c")) {
      orthoFormer.add("k" + x.slice(1));
    }
    if (x.startsWith("kv")) {
      orthoFormer.add("qv" + x.slice(2));
    }
    if (x.includes("c")) {
      orthoFormer.add(x.replace(/c/g, "k"));
    }
  }

  // Dental-, labial- och vokalväxlingar (ð/þ/dh/d, u/v, ia/iä, gy/ghi)
  for (const x of [...orthoFormer]) {
    if (x.includes("ð")) {
      orthoFormer.add(x.replace(/ð/g, "þ"));
      orthoFormer.add(x.replace(/ð/g, "dh"));
      orthoFormer.add(x.replace(/ð/g, "d"));
    }
    if (x.includes("þ")) {
      orthoFormer.add(x.replace(/þ/g, "th"));
      orthoFormer.add(x.replace(/þ/g, "dh"));
    }
    if (x.includes("th")) {
      orthoFormer.add(x.replace(/th/g, "þ"));
    }
    if (x.includes("dh")) {
      orthoFormer.add(x.replace(/dh/g, "þ"));
    }
    if (x.includes("d") && !x.includes("dh")) {
      orthoFormer.add(x.replace(/d/g, "þ"));
      orthoFormer.add(x.replace(/d/g, "dh"));
    }
    if (/^u[aäåeioöuy]/.test(x)) {
      orthoFormer.add("v" + x.slice(1));
    }
    if (
      x.includes("ua") ||
      x.includes("uä") ||
      x.includes("ue") ||
      x.includes("ui") ||
      x.includes("lu") ||
      x.includes("fu") ||
      x.includes("fw") ||
      x.includes("fv")
    ) {
      orthoFormer.add(
        x
          .replace(/u([aäei])/g, "v$1")
          .replace(/lu/g, "lv")
          .replace(/f[uvw]/g, "v")
      );
    }
    if (x.startsWith("sv")) {
      orthoFormer.add("su" + x.slice(2));
    }
    if (x.includes("ia") && !x.includes("iä")) {
      orthoFormer.add(x.replace(/ia/g, "iä"));
    }
    if (x.includes("gy") || x.includes("ky")) {
      orthoFormer.add(x.replace(/gy/g, "ghi").replace(/ky/g, "ki"));
      orthoFormer.add(x.replace(/gy/g, "g").replace(/ky/g, "k"));
    }
    if (x.includes("yu")) {
      orthoFormer.add(x.replace(/yu/g, "iu"));
    }
    if (x.includes("byscup") || x.includes("biskup") || x.includes("biscup")) {
      orthoFormer.add("biskuper");
      orthoFormer.add("biskoper");
    }
    if (x.includes("konong") || x.includes("konogg")) {
      orthoFormer.add("konunger");
    }
    if (x.includes("bönd")) {
      orthoFormer.add("bonde");
    }
    if (x.includes("bocarl") || x.includes("bokarl")) {
      orthoFormer.add("bokarl");
    }
    if (x.includes("e")) {
      orthoFormer.add(x.replace("e", "ä"));
    }
  }

  for (const oform of orthoFormer) {
    laggTill(oform, "ortho", `Ortografisk motsvarighet till »${rent}»`);
  }

  // 3. Böjnings- och ändelsekandidater (inflected -> grundform i Söderwall)
  const suffixTabell: [string, string[], string][] = [
    // Bestämda substantivformer (dativ/genitiv/plural)
    ["innar", ["", "a", "ia", "e", "er"], "Bestämd genitiv sg. fem. (-innar)"],
    ["ennar", ["", "a", "ia", "e", "er"], "Bestämd genitiv sg. fem. (-ennar)"],
    ["unnar", ["a", "ia", "e", ""], "Bestämd genitiv sg. svagt fem. (-unnar)"],
    ["onnar", ["a", "ia", "e", ""], "Bestämd genitiv sg. svagt fem. (-onnar)"],
    ["omin", ["", "e", "a", "er"], "Bestämd dativ pluralis (-omin)"],
    ["omen", ["", "e", "a", "er"], "Bestämd dativ pluralis (-omen)"],
    ["umin", ["", "e", "a", "er"], "Bestämd dativ pluralis (-umin)"],
    ["umen", ["", "e", "a", "er"], "Bestämd dativ pluralis (-umen)"],
    ["inum", ["", "er", "e", "i", "a"], "Bestämd dativ sg. mask. (-inum)"],
    ["enum", ["", "er", "e", "a"], "Bestämd dativ sg. mask. (-enum)"],
    ["inom", ["", "er", "e", "a"], "Bestämd dativ sg. mask. (-inom)"],
    ["enom", ["", "er", "e", "a"], "Bestämd dativ sg. mask. (-enom)"],
    ["anom", ["a", "e", "", "er"], "Bestämd dativ sg. (-anom)"],
    ["inu", ["", "a", "ia", "e"], "Bestämd dativ sg. neutr./fem. (-inu)"],
    ["enu", ["", "a", "ia", "e"], "Bestämd dativ sg. neutr./fem. (-enu)"],
    ["inir", ["", "er", "e", "a"], "Bestämd nominativ pluralis mask. (-inir)"],
    ["enir", ["", "er", "e", "a"], "Bestämd nominativ pluralis mask. (-enir)"],
    ["inar", ["", "a", "er", "e"], "Bestämd pluralis (-inar)"],
    ["enar", ["", "a", "er", "e"], "Bestämd pluralis (-enar)"],
    ["una", ["a", "ia", "e", ""], "Bestämd oblik sg. fem. (-una)"],
    ["ona", ["a", "ia", "e", ""], "Bestämd oblik sg. fem. (-ona)"],
    ["ina", ["", "a", "ia", "er", "e"], "Bestämd ackusativ sg. fem./mask. (-ina)"],
    ["ena", ["", "a", "ia", "er", "e"], "Bestämd ackusativ sg. fem./mask. (-ena)"],
    ["ins", ["", "er", "e", "a"], "Bestämd genitiv sg. mask./neutr. (-ins)"],
    ["ens", ["", "er", "e", "a"], "Bestämd genitiv sg. mask./neutr. (-ens)"],

    // Verb: presens particip, svagt preteritum och perfekt particip
    ["andis", ["a", "ia", "as"], "Presens particip passiv/genitiv (-andis)"],
    ["endis", ["a", "ia", "as"], "Presens particip passiv/genitiv (-endis)"],
    ["andi", ["a", "ia"], "Presens particip (-andi)"],
    ["ande", ["a", "ia"], "Presens particip (-ande)"],
    ["inde", ["a", "ia"], "Presens particip (-inde)"],
    ["adhis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-adhis)"],
    ["aþis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-aþis)"],
    ["adis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-adis)"],
    ["dhis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-dhis)"],
    ["þis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-þis)"],
    ["tis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-tis)"],
    ["dis", ["a", "ia", "as"], "Svagt preteritum passiv/deponens (-dis)"],
    ["adher", ["a", "ia"], "Perfekt particip nom. sg. mask. (-adher)"],
    ["aþer", ["a", "ia"], "Perfekt particip nom. sg. mask. (-aþer)"],
    ["adhi", ["a", "ia"], "Svagt preteritum 3 sg. (-adhi)"],
    ["aþi", ["a", "ia"], "Svagt preteritum 3 sg. (-aþi)"],
    ["adi", ["a", "ia"], "Svagt preteritum 3 sg. (-adi)"],
    ["adhe", ["a", "ia"], "Svagt preteritum 3 sg. (-adhe)"],
    ["aþe", ["a", "ia"], "Svagt preteritum 3 sg. (-aþe)"],
    ["ade", ["a", "ia"], "Svagt preteritum 3 sg. (-ade)"],
    ["adhu", ["a", "ia"], "Svagt preteritum 3 pl. (-adhu)"],
    ["aþu", ["a", "ia"], "Svagt preteritum 3 pl. (-aþu)"],
    ["adho", ["a", "ia"], "Svagt preteritum 3 pl. (-adho)"],
    ["aþo", ["a", "ia"], "Svagt preteritum 3 pl. (-aþo)"],
    ["dhi", ["a", "ia"], "Svagt preteritum 3 sg. (-dhi)"],
    ["þi", ["a", "ia"], "Svagt preteritum 3 sg. (-þi)"],
    ["dhe", ["a", "ia"], "Svagt preteritum 3 sg. (-dhe)"],
    ["þe", ["a", "ia"], "Svagt preteritum 3 sg. (-þe)"],
    ["dhu", ["a", "ia"], "Svagt preteritum 3 pl. (-dhu)"],
    ["þu", ["a", "ia"], "Svagt preteritum 3 pl. (-þu)"],
    ["dho", ["a", "ia"], "Svagt preteritum 3 pl. (-dho)"],
    ["þo", ["a", "ia"], "Svagt preteritum 3 pl. (-þo)"],
    ["ti", ["a", "ia"], "Svagt preteritum 3 sg. (-ti)"],
    ["te", ["a", "ia"], "Svagt preteritum 3 sg. (-te)"],
    ["di", ["a", "ia"], "Svagt preteritum 3 sg. (-di)"],
    ["de", ["a", "ia"], "Svagt preteritum 3 sg. (-de)"],

    // Adjektiv: komparativ och superlativ
    ["aster", ["er", "", "a"], "Superlativ nom. sg. mask. (-aster)"],
    ["ister", ["er", "", "a"], "Superlativ nom. sg. mask. (-ister)"],
    ["ari", ["er", "", "a"], "Komparativ (-ari)"],
    ["are", ["er", "", "a"], "Komparativ (-are)"],

    // Allmänna kasus-, numerus- och modusändelser
    ["his", ["a", "as", ""], "Passiv/deponens preteritum (-dhis/-his)"],
    ["is", ["a", "as", ""], "Passiv/deponens (-is)"],
    ["as", ["a", ""], "Passiv/deponens eller genitiv (-as)"],
    ["zs", ["", "er", "e"], "Genitiv (-zs)"],
    ["um", ["", "a", "er", "e", "i"], "Dativ pluralis/singularis (-um)"],
    ["om", ["", "a", "er", "e", "i"], "Dativ pluralis/singularis (-om)"],
    ["ir", ["", "er", "a", "ia"], "Plural eller presens (-ir)"],
    ["ar", ["", "er", "a", "e"], "Plural, genitiv eller presens (-ar)"],
    ["er", ["", "a", "ia", "e", "ir"], "Nominativ sg. eller presens (-er)"],
    ["or", ["a", "ir", "er"], "Plural av svagt fem. eller r-stam (-or)"],
    ["ur", ["a", "ir", "er"], "Oblik/plural av svagt fem. eller r-stam (-ur)"],
    ["u", ["a", "e", "o", ""], "Oblik form av svagt subst./adj. (-u)"],
    ["o", ["a", "e", ""], "Oblik form (-o)"],
    ["a", ["", "er", "e", "ia"], "Böjningsändelse (-a)"],
    ["i", ["", "e", "a", "er", "ia"], "Dativ sg. eller konjunktiv (-i)"],
    ["e", ["", "a", "er", "i"], "Dativ sg. eller konjunktiv (-e)"],
    ["s", ["", "er", "e"], "Genitiv (-s)"],
    ["z", ["", "a", "ia", "er"], "Genitiv eller passiv/deponens (-z)"],
    ["ss", ["", "a"], "Genitiv eller passiv (-ss)"],
    ["et", ["", "a"], "Bestämd form neutr. eller part. pret. (-et)"],
    ["it", ["", "a"], "Bestämd form neutr. eller part. pret. (-it)"],
    ["at", ["a", ""], "Supinum / part. pret. neutr. av svagt verb (-at)"],
    ["in", ["", "a", "er"], "Bestämd form eller part. pret. (-in)"],
    ["en", ["", "e", "a", "er"], "Bestämd form eller part. pret. (-en)"],
    ["an", ["a", "e", "", "er"], "Ackusativ sg. mask. eller bestämd form (-an)"],
    ["n", ["", "er"], "Ackusativ sg. mask. (-n)"],
    ["t", ["", "er"], "Neutrum sg. (-t)"],
  ];

  for (const oform of orthoFormer) {
    const oregOform = OREGELBUNDNA_FORMER[oform];
    if (oregOform) {
      for (const lem of oregOform.lemma) {
        laggTill(lem, "inflected", oregOform.beskrivning);
      }
    }

    for (const [suf, ersattningar, beskrivning] of suffixTabell) {
      if (oform.length >= suf.length + 2 && oform.endsWith(suf)) {
        const stam = oform.slice(0, -suf.length);
        for (const rep of ersattningar) {
          laggTill(stam + rep, "inflected", beskrivning);
        }
      }
    }
    if (oform.length >= 3) {
      laggTill(
        oform + "er",
        "inflected",
        "Söderwalls uppslagsform med maskulint nominativ-er"
      );
      laggTill(
        oform + "ber",
        "inflected",
        "Söderwalls uppslagsform med inskotts-b (-ber)"
      );
      laggTill(oform + "a", "inflected", "Grundform på -a");
    }
  }

  return [...sedda.values()];
}
