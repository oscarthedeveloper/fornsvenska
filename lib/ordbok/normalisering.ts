/**
 * Normalisering, sökalias och lexikografisk sortering för Söderwalls ordbok.
 *
 * Principer (Etapp 3):
 * 1. Bevara alltid þ, æ, ø, ä, ö och å i visningen.
 * 2. Normalisera Unicode (NFC) och skiftläge i söknycklar utan att ändra originalet.
 * 3. Hantera historiska teckeninmatningar (t.ex. th <-> þ, dh <-> þ, æ -> ä, ø -> ö, w -> v)
 *    som separata, dokumenterade sökalias — så att exakta källträffar alltid rangordnas före
 *    alternativa teckenmatchningar.
 * 4. Söderwalls alfabetiska ordning:
 *    A B C D E F G H I J K L M N O P Q R S T U V Y Ä Ö Þ
 *    Observera att i Söderwalls ordbok ligger alla uppslagsord som börjar på "th-"
 *    inordnade i kapitlet Þ (efter Ö), och inuti ord samsorteras þ med dh/th.
 */

export const SODERWALL_ALFABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "Y",
  "Ä",
  "Ö",
  "Þ",
] as const;

export const ORDNINGSVARDEN: Record<string, string> = {
  a: "01",
  b: "02",
  c: "03",
  d: "04",
  e: "05",
  f: "06",
  g: "07",
  h: "08",
  i: "09",
  j: "10",
  k: "11",
  l: "12",
  m: "13",
  n: "14",
  o: "15",
  p: "16",
  q: "17",
  r: "18",
  s: "19",
  t: "20",
  u: "21",
  v: "22",
  w: "22",
  x: "23",
  y: "24",
  z: "25",
  å: "26",
  ä: "27",
  æ: "27",
  ö: "28",
  ø: "28",
  þ: "29",
};

/**
 * Grundnormalisering: NFC, trim, gemener och komprimerade mellanslag.
 * Bevarar þ, ä, ö, å men mappar ligaturerna æ -> ä och ø -> ö då Söderwalls
 * uppslagsord använder ä och ö medan användare ibland skriver æ/ø.
 */
export function normaliseraSokterm(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/^\*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Genererar dokumenterade ortografiska alias för ett ord eller en sökfråga.
 *
 * Regler:
 * - æ -> ä, ø -> ö, ð -> dh, w -> v
 * - þ -> th och þ -> dh (för ord med þ så att inmatning med th/dh matchar)
 * - th -> þ (för ord med th så att inmatning med þ matchar)
 * - dh -> þ (för inre dh/þ-växling som aþalkona / adhalkona)
 * - dubbelskrivna vokaler/konsonanter ändras INTE automatiskt här för att undvika falska träffar.
 */
export function genereraOrtografiskaAlias(ord: string): string[] {
  const bas = normaliseraSokterm(ord)
    .replace(/æ/g, "ä")
    .replace(/ø/g, "ö")
    .replace(/ð/g, "dh")
    .replace(/w/g, "v");

  if (!bas) return [];

  const resultat = new Set<string>();
  resultat.add(bas);

  if (bas.includes("þ")) {
    resultat.add(bas.replace(/þ/g, "th"));
    resultat.add(bas.replace(/þ/g, "dh"));
    // Om ordet börjar på þ och även har inre þ (t.ex. þriþi -> thridhi)
    if (bas.startsWith("þ") && bas.slice(1).includes("þ")) {
      resultat.add("th" + bas.slice(1).replace(/þ/g, "dh"));
    }
  }

  if (bas.includes("th")) {
    resultat.add(bas.replace(/th/g, "þ"));
  }

  if (bas.includes("dh")) {
    resultat.add(bas.replace(/dh/g, "þ"));
    if (bas.startsWith("th") && bas.includes("dh")) {
      resultat.add("þ" + bas.slice(2).replace(/dh/g, "þ"));
    }
  }

  // Ta bort exakt grundform om den är identisk med indata
  resultat.delete(normaliseraSokterm(ord));
  return [...resultat];
}

/**
 * Bestämmer vilken bokstavssektion (A–Ö eller Þ) ett uppslagsord tillhör i Söderwalls ordbok.
 *
 * I Söderwall placeras alla ord som inleds med "þ" eller "th" (med tre undantag av yngre
 * lånord i huvudverket: "theatrum", "theologus", "throne", samt "tvingilse" i supplementets
 * Þ-kapitel) under bokstaven Þ. Vi respekterar även postens faktiska placering om källindex
 * skickas in, och faller annars tillbaka på regeln nedan.
 */
export function beraknaBokstavssektion(
  headword: string,
  dataset?: "soederwall" | "soederwall-supp",
  sourceIndex?: number
): string {
  // I huvudverket börjar Þ-kapitlet vid index 22001 (þa)
  if (dataset === "soederwall" && typeof sourceIndex === "number" && sourceIndex >= 22001) {
    return "Þ";
  }
  // I supplementet börjar Þ-kapitlet vid index 18745 (þa)
  if (dataset === "soederwall-supp" && typeof sourceIndex === "number" && sourceIndex >= 18745) {
    return "Þ";
  }

  const ren = normaliseraSokterm(headword).replace(/^[^a-zåäöæøþ]+/, "");
  if (!ren) return "A";
  if (ren.startsWith("þ") || ren.startsWith("th")) return "Þ";

  const forsta = ren[0]
    .replace("æ", "ä")
    .replace("ø", "ö")
    .replace("w", "v")
    .toUpperCase();

  if ((SODERWALL_ALFABET as readonly string[]).includes(forsta)) {
    return forsta;
  }
  return "A";
}

/**
 * Beräknar en deterministisk sorteringsnyckel som placerar bokstavssektionerna i
 * Söderwalls ordning (A..Ö, sist Þ) och inom varje sektion sorterar th/þ och dh/þ samlat.
 */
export function beraknaSorteringsnyckel(
  headword: string,
  dataset?: "soederwall" | "soederwall-supp",
  sourceIndex?: number,
  homonymNumber?: number
): string {
  const sektion = beraknaBokstavssektion(headword, dataset, sourceIndex);
  const sektionsIndex = SODERWALL_ALFABET.indexOf(
    sektion as (typeof SODERWALL_ALFABET)[number]
  );
  const sektionsKod = String(sektionsIndex >= 0 ? sektionsIndex + 1 : 99).padStart(2, "0");

  // Normalisera ordets inre tecken enligt Söderwalls samsorteringsprincip:
  // Inledande th -> þ (i Þ-kapitlet), inre þ -> dh så att aþalkona och adhalhus sorteras rätt
  let ren = normaliseraSokterm(headword).replace(/[().*,-]/g, "");
  if (sektion === "Þ" && ren.startsWith("th")) {
    ren = "þ" + ren.slice(2);
  }
  if (ren.length > 1) {
    ren = ren[0] + ren.slice(1).replace(/þ/g, "dh");
  }

  let teckenkoder = "";
  for (const ch of ren) {
    if (ch === " ") {
      teckenkoder += "00";
    } else {
      teckenkoder += ORDNINGSVARDEN[ch] ?? "90";
    }
  }

  const dsRank = dataset === "soederwall-supp" ? "2" : "1";
  const homRank = String(homonymNumber ?? 0).padStart(2, "0");
  const idxRank = String(sourceIndex ?? 0).padStart(5, "0");

  return `${sektionsKod}:${teckenkoder}:${dsRank}:${homRank}:${idxRank}`;
}
