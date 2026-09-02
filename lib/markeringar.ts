/** Gemensam palett och kommandon för dokumentens inline-formatering. */

export const MARKERINGSFARGER = [
  { id: 1, namn: "Röd" },
  { id: 2, namn: "Orange" },
  { id: 3, namn: "Gul" },
  { id: 4, namn: "Grön" },
  { id: 5, namn: "Turkos" },
  { id: 6, namn: "Blå" },
  { id: 7, namn: "Lila" },
  { id: 8, namn: "Rosa" },
] as const;

export type Markeringsfarg = (typeof MARKERINGSFARGER)[number]["id"];
export type Inlineformat = "fet" | "kursiv" | "understruken" | "term";

export type Formateringskommando =
  | { typ: "inline"; format: Inlineformat }
  | { typ: "markering"; farg: Markeringsfarg | 0 };

export const FORMATERINGSHANDELSE = "fornsvenska:formatera";

export function markeringsnamn(farg: Markeringsfarg) {
  return MARKERINGSFARGER.find((post) => post.id === farg)?.namn ?? "Färg";
}
