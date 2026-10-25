import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { TEXTER } from "../data/texter";
import { TEXTER_DOKUMENT } from "../data/textdokument";
import { KALLOR } from "../data/kallor";
import type { Node } from "../lib/typer";
import type { Mening, Sektion, Textdokument } from "../lib/text";

export interface ValideringsResultat {
  fel: string[];
  varningar: string[];
  statistik: {
    antalDokumentITrad: number;
    antalDokumentIStore: number;
    antalSektioner: number;
    antalMeningar: number;
    antalSegmentId: number;
  };
}

export function valideraTexter(options?: {
  overrideDokument?: Record<string, Textdokument>;
  overrideTrad?: Node[];
  overrideKallor?: { id: string }[];
  ignoreraGeneratorSynk?: boolean;
}): ValideringsResultat {
  const fel: string[] = [];
  const varningar: string[] = [];
  const projektrot = process.cwd();

  const dokStore = options?.overrideDokument ?? TEXTER_DOKUMENT;
  const trad = options?.overrideTrad ?? TEXTER;
  const kallor = options?.overrideKallor ?? KALLOR;
  const giltigaKallIdn = new Set(kallor.map((k) => k.id));

  // 1. Samla alla dokument-noder från navigationsträdet
  const tradDokumentSokvagar: string[] = [];
  function traverseraTrad(noder: Node[], foralderStig = "") {
    for (const nod of noder) {
      const aktuellStig = foralderStig ? `${foralderStig}/${nod.slug}` : nod.slug;
      if (nod.kind === "doc") {
        tradDokumentSokvagar.push(aktuellStig);
      }
      if (nod.children && nod.children.length > 0) {
        traverseraTrad(nod.children, aktuellStig);
      }
    }
  }
  traverseraTrad(trad);

  const tradSet = new Set(tradDokumentSokvagar);
  const storeNycklar = Object.keys(dokStore);
  const storeSet = new Set(storeNycklar);

  // 1a. Kontrollera att alla dokument i trädet finns i dokument-storen
  for (const stig of tradDokumentSokvagar) {
    if (!storeSet.has(stig)) {
      fel.push(`Dokument saknas i TEXTER_DOKUMENT: "${stig}" är deklarerad i trädet men saknar textinnehåll.`);
    }
  }

  // 1b. Kontrollera att alla nycklar i dokument-storen finns i trädet
  for (const nyckel of storeNycklar) {
    if (!tradSet.has(nyckel)) {
      fel.push(`Okänd dokumentsökväg i TEXTER_DOKUMENT: "${nyckel}" finns inte i navigationsträdet.`);
    }
  }

  // 2. Kontrollera generator-synk mot data/texter-kallor/vastgotalagen/
  if (!options?.ignoreraGeneratorSynk) {
    const vgKatalog = path.join(projektrot, "data", "texter-kallor", "vastgotalagen");
    try {
      const filer = readdirSync(vgKatalog).filter((f) => f.endsWith(".json"));
      for (const fil of filer) {
        const fullFil = path.join(vgKatalog, fil);
        const filData = JSON.parse(readFileSync(fullFil, "utf-8")) as Textdokument & { dokumentStig?: string };
        const basename = path.basename(fil, ".json");
        const stig = filData.dokumentStig ?? `lagar/aldre-vastgotalagen/${basename}`;
        const storeDok = dokStore[stig];
        if (!storeDok) {
          fel.push(`Osynkad generator: källfilen "${fil}" motsvarar "${stig}" som saknas i TEXTER_DOKUMENT.`);
          continue;
        }
        // Jämför rubrik, antal sektioner och meningar
        if (storeDok.titel !== filData.titel) {
          fel.push(`Osynkad generator: Titel i "${fil}" ("${filData.titel}") matchar inte TEXTER_DOKUMENT ("${storeDok.titel}"). Kör python3 scripts/build_textdokument.py.`);
        }
        if (storeDok.sektioner.length !== filData.sektioner.length) {
          fel.push(`Osynkad generator: Antal sektioner i "${fil}" (${filData.sektioner.length}) skiljer sig från TEXTER_DOKUMENT (${storeDok.sektioner.length}). Kör python3 scripts/build_textdokument.py.`);
        }
      }
    } catch {
      // Om katalogen inte finns i testmiljö, ignorera
    }
  }

  // 3. Validera dokument, sektioner, meningar, källor och segment-ID
  let totaltSektioner = 0;
  let totaltMeningar = 0;
  const anvandaSegmentIdn = new Map<string, string>(); // segmentId -> plats

  const otillatnaMonster = [
    /\bTODO\b/i,
    /\bFIXME\b/i,
    /exakt text fylls efter kontroll/i,
    /\bplatshållare\b/i,
  ];

  for (const [stig, dok] of Object.entries(dokStore)) {
    if (!dok.titel || !dok.titel.trim()) {
      fel.push(`Dokument "${stig}" saknar titel.`);
    }

    // Käll-ID på dokumentnivå
    if (dok.kallaId && !giltigaKallIdn.has(dok.kallaId)) {
      fel.push(`Ogiltig källa: Dokument "${stig}" refererar till oregistrerat kallaId "${dok.kallaId}".`);
    }

    if (!dok.sektioner || dok.sektioner.length === 0) {
      fel.push(`Dokument "${stig}" saknar sektioner.`);
      continue;
    }

    dok.sektioner.forEach((sektion: Sektion, sIdx: number) => {
      totaltSektioner++;
      const sekPlats = `${stig} -> Sektion ${sIdx + 1} (${sektion.rubrik ?? "utan rubrik"})`;

      // Kontrollera pdfSidor
      if (sektion.pdfSidor) {
        for (const sida of sektion.pdfSidor) {
          if (!Number.isInteger(sida) || sida < 1) {
            fel.push(`Ogiltigt sidnummer i ${sekPlats}: sidor måste vara positiva heltal (fick ${sida}).`);
          }
          if (dok.kallaId === "AVG-MASKIN" && sida > 25) {
            fel.push(`Ogiltigt sidnummer i ${sekPlats}: AVG-MASKIN omfattar endast 25 sidor (fick ${sida}).`);
          }
        }
      }

      if (!sektion.meningar || sektion.meningar.length === 0) {
        fel.push(`${sekPlats} saknar meningar.`);
        return;
      }

      sektion.meningar.forEach((m: Mening, mIdx: number) => {
        totaltMeningar++;
        const menPlats = `${sekPlats} -> Mening ${mIdx + 1}`;

        if (!m.fsv || !m.fsv.trim()) {
          fel.push(`Tom fornsvensk text i ${menPlats}.`);
        }
        if (!m.tolkning || !m.tolkning.trim()) {
          fel.push(`Tom tolkning i ${menPlats}.`);
        }

        // Kontrollera platshållare
        for (const monster of otillatnaMonster) {
          if (monster.test(m.fsv)) {
            fel.push(`Förbjuden platshållare funnen i fsv (${menPlats}): "${m.fsv}".`);
          }
          if (monster.test(m.tolkning)) {
            fel.push(`Förbjuden platshållare funnen i tolkning (${menPlats}): "${m.tolkning}".`);
          }
        }

        // Segment-ID validering
        if (m.segmentId) {
          if (anvandaSegmentIdn.has(m.segmentId)) {
            const tidigare = anvandaSegmentIdn.get(m.segmentId);
            fel.push(`Dubbel primärkoppling / dubblerat segment-ID "${m.segmentId}": används i både ${tidigare} och ${menPlats}.`);
          } else {
            anvandaSegmentIdn.set(m.segmentId, menPlats);
          }

          if (m.segmentId.startsWith("avg-") && !/^avg-b\d{2}[a-z]?-punkt\d{2}(-seg\d{3})?$/.test(m.segmentId)) {
            fel.push(`Felaktigt segment-ID-format i ${menPlats}: "${m.segmentId}". Förväntat format: "avg-bXX-punktYY-segZZZ" eller "avg-bXXa-punktYY-segZZZ".`);
          }
        }
      });
    });

    // Kontrollera fotnoter
    if (dok.fotnoter) {
      for (const fn of dok.fotnoter) {
        if (fn.kallaId && !giltigaKallIdn.has(fn.kallaId)) {
          fel.push(`Ogiltig källa i fotnot: Dokument "${stig}" fotnot ${fn.id} refererar till oregistrerat kallaId "${fn.kallaId}".`);
        }
      }
    }
  }

  return {
    fel,
    varningar,
    statistik: {
      antalDokumentITrad: tradDokumentSokvagar.length,
      antalDokumentIStore: storeNycklar.length,
      antalSektioner: totaltSektioner,
      antalMeningar: totaltMeningar,
      antalSegmentId: anvandaSegmentIdn.size,
    },
  };
}

if (process.argv[1] && process.argv[1].endsWith("validate-texter.ts")) {
  const resultat = valideraTexter();
  console.log(`Validering av Texter:`);
  console.log(`  Dokument i träd / store: ${resultat.statistik.antalDokumentITrad} / ${resultat.statistik.antalDokumentIStore}`);
  console.log(`  Sektioner: ${resultat.statistik.antalSektioner}`);
  console.log(`  Meningar: ${resultat.statistik.antalMeningar}`);
  console.log(`  Explicit registrerade segment-ID: ${resultat.statistik.antalSegmentId}`);

  if (resultat.varningar.length > 0) {
    console.warn(`\nVarningar (${resultat.varningar.length}):`);
    for (const v of resultat.varningar) {
      console.warn(`  - ${v}`);
    }
  }

  if (resultat.fel.length > 0) {
    console.error(`\nFel (${resultat.fel.length}):`);
    for (const f of resultat.fel) {
      console.error(`  - ${f}`);
    }
    process.exit(1);
  }

  console.log(`\nTextvalideringen godkänd: inga felaktigheter upptäcktes.`);
}
