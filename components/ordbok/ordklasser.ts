/**
 * Mappning av Språkbankens LMF partOfSpeech-koder till läsbara svenska termer.
 */
export const ORDKLASS_ETIKETTER: Record<string, string> = {
  nn: "substantiv",
  vb: "verb",
  av: "adjektiv",
  ab: "adverb",
  pp: "preposition",
  pn: "pronomen",
  kn: "konjunktion",
  nl: "räkneord",
  in: "interjektion",
  al: "artikel",
};

export const MATCHTYP_ETIKETTER: Record<string, string> = {
  exact_headword: "Exakt uppslagsord",
  exact_variant: "Belagd variantform",
  prefix_headword: "Prefixträff",
  prefix_variant: "Variantprefix",
  alias_headword: "Teckenalias (þ/th/dh)",
  alias_variant: "Variant via teckenalias",
  ortho_candidate: "Ortografisk motsvarighet",
  inflected_candidate: "Böjningskandidat",
  article_text: "Träff i artikeltext",
};

export function formatOrdklassLista(koder: string[]): string {
  return koder.map((k) => ORDKLASS_ETIKETTER[k] ?? k).join(", ");
}

