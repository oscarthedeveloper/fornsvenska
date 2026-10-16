/**
 * Klientbaserad hantering av bokmärken och personlig ordlista (localStorage).
 *
 * Principer:
 * - Ingen koppling till databas eller inloggning — all studiedata lagras i användarens webbläsare.
 * - Synkroniseras direkt över alla öppna flikar och komponenter via BOKMARKEN_HANDELSE.
 * - Stöder export till Anki (TSV), CSV, formaterad text och JSON för säkerhetskopia.
 */

export interface SparatOrdbokOrd {
  id: string; // e.g. "soederwall--konunger-nn.1"
  headwordDisplay: string;
  sourceDataset: "soederwall" | "soederwall-supp";
  kallaId: "SOD1884" | "SOD-SUPP";
  homonymNumber?: number;
  partOfSpeech: string[];
  gramOriginal?: string;
  snippet: string;
  sparadDatum: string; // ISO 8601
  anteckning?: string;
  kallText?: {
    titel?: string;
    ord: string;
    meningFsv?: string;
    meningTolkning?: string;
  };
}

export const BOKMARKEN_STORAGE_KEY = "fornsvenska_sparade_ord_v1";
export const BOKMARKEN_HANDELSE = "fornsvenska:bokmarken-andrade";

export function arOrdSparat(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(BOKMARKEN_STORAGE_KEY);
    if (!raw) return false;
    const lista = JSON.parse(raw) as SparatOrdbokOrd[];
    return lista.some((p) => p.id === id);
  } catch {
    return false;
  }
}

export function hamtaSparadeOrd(): SparatOrdbokOrd[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOKMARKEN_STORAGE_KEY);
    if (!raw) return [];
    const lista = JSON.parse(raw) as SparatOrdbokOrd[];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function sparaOrd(post: SparatOrdbokOrd): void {
  if (typeof window === "undefined") return;
  try {
    const lista = hamtaSparadeOrd().filter((p) => p.id !== post.id);
    lista.unshift(post);
    window.localStorage.setItem(BOKMARKEN_STORAGE_KEY, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent(BOKMARKEN_HANDELSE, { detail: lista }));
  } catch (err) {
    console.error("Kunde inte spara ord i localStorage:", err);
  }
}

export function taBortSparatOrd(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const lista = hamtaSparadeOrd().filter((p) => p.id !== id);
    window.localStorage.setItem(BOKMARKEN_STORAGE_KEY, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent(BOKMARKEN_HANDELSE, { detail: lista }));
  } catch (err) {
    console.error("Kunde inte ta bort ord från localStorage:", err);
  }
}

export function uppdateraAnteckning(id: string, anteckning: string): void {
  if (typeof window === "undefined") return;
  try {
    const lista = hamtaSparadeOrd().map((p) =>
      p.id === id ? { ...p, anteckning: anteckning.trim() || undefined } : p
    );
    window.localStorage.setItem(BOKMARKEN_STORAGE_KEY, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent(BOKMARKEN_HANDELSE, { detail: lista }));
  } catch (err) {
    console.error("Kunde inte uppdatera anteckning i localStorage:", err);
  }
}

export function rensaAllaSparadeOrd(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(BOKMARKEN_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(BOKMARKEN_HANDELSE, { detail: [] }));
  } catch (err) {
    console.error("Kunde inte rensa sparade ord i localStorage:", err);
  }
}

export function exporteraSparadeOrd(
  lista: SparatOrdbokOrd[],
  format: "anki" | "csv" | "text" | "json"
): { data: string; mimeType: string; filnamn: string } {
  const tidsstampel = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    return {
      data: JSON.stringify(lista, null, 2),
      mimeType: "application/json;charset=utf-8",
      filnamn: `fornsvenska-ordlista-${tidsstampel}.json`,
    };
  }

  if (format === "anki") {
    // Anki TSV format: Framsida \t Baksida \t Taggar
    const rader = lista.map((p) => {
      // Framsida: uppslagsord, eventuellt kontextord
      const framsida = p.kallText
        ? `${p.kallText.ord} [${p.headwordDisplay}]`
        : p.headwordDisplay;

      // Baksida: HTML-formaterad för Anki-kort
      const baksidaDelar: string[] = [];
      const gram = [p.gramOriginal, p.partOfSpeech.join("/")].filter(Boolean).join(" · ");
      if (gram) baksidaDelar.push(`<em>${gram}</em>`);
      if (p.snippet) baksidaDelar.push(`<div>${p.snippet}</div>`);
      if (p.kallText?.meningFsv) {
        baksidaDelar.push(
          `<div style="margin-top:6px;font-size:0.9em;opacity:0.85;"><strong>Text:</strong> »${p.kallText.meningFsv}«</div>`
        );
      }
      if (p.kallText?.meningTolkning) {
        baksidaDelar.push(
          `<div style="font-size:0.85em;opacity:0.75;"><strong>Tolkning:</strong> ${p.kallText.meningTolkning}</div>`
        );
      }
      if (p.anteckning) {
        baksidaDelar.push(
          `<div style="margin-top:6px;font-size:0.85em;border-left:2px solid #FF5C39;padding-left:4px;"><strong>Not:</strong> ${p.anteckning}</div>`
        );
      }
      const kalla = p.sourceDataset === "soederwall" ? "Söderwall Huvudverk" : "Söderwall Supplement";
      baksidaDelar.push(`<div style="font-size:0.75em;color:#666;margin-top:4px;">${kalla}</div>`);

      const baksidaSanerad = baksidaDelar.join("<br>").replace(/\t/g, " ").replace(/\n/g, "");
      return `${framsida}\t${baksidaSanerad}\tfornsvenska soderwall`;
    });

    return {
      data: `#separator:tab\n#html:true\n#tags column:3\n${rader.join("\n")}`,
      mimeType: "text/tab-separated-values;charset=utf-8",
      filnamn: `fornsvenska-anki-${tidsstampel}.txt`,
    };
  }

  if (format === "csv") {
    // CSV med UTF-8 BOM för fullt stöd i Excel och Numbers
    const kolumner = [
      "Uppslagsord",
      "Källband",
      "Ordklass",
      "Grammatik",
      "Definition/Utdrag",
      "Anteckning",
      "Källtext (om sparad från utdrag)",
      "Sparad datum",
      "ID",
    ];

    const escaped = (val?: string) => `"${(val ?? "").replace(/"/g, '""')}"`;

    const rader = lista.map((p) => [
      escaped(p.headwordDisplay),
      escaped(p.sourceDataset === "soederwall" ? "Huvudverket" : "Supplementet"),
      escaped(p.partOfSpeech.join(", ")),
      escaped(p.gramOriginal),
      escaped(p.snippet),
      escaped(p.anteckning),
      escaped(
        p.kallText
          ? `${p.kallText.ord} i ${p.kallText.titel ?? "utdrag"}: ${p.kallText.meningFsv ?? ""}`
          : ""
      ),
      escaped(p.sparadDatum.slice(0, 10)),
      escaped(p.id),
    ]);

    const csvText = "\uFEFF" + [kolumner.join(";"), ...rader.map((r) => r.join(";"))].join("\r\n");
    return {
      data: csvText,
      mimeType: "text/csv;charset=utf-8",
      filnamn: `fornsvenska-ordlista-${tidsstampel}.csv`,
    };
  }

  // Klartext (printvänlig)
  const rader = [
    "FORNSVENSKA STUDIELABBET — PERSONLIG ORDLISTA",
    `Exportdatum: ${tidsstampel}`,
    `Antal sparade ord: ${lista.length}`,
    "----------------------------------------------------------------------",
    "",
    ...lista.map((p, i) => {
      const nummer = String(i + 1).padStart(2, "0");
      const gram = [p.gramOriginal, p.partOfSpeech.join("/")].filter(Boolean).join(" · ");
      const band = p.sourceDataset === "soederwall" ? "Huvudverket" : "Supplementet";
      const stycke = [
        `${nummer}. ${p.headwordDisplay} [${gram || "okänd ordklass"}] (${band})`,
        p.snippet ? `   Betydelse: ${p.snippet}` : null,
        p.kallText
          ? `   Kontext: »${p.kallText.ord}» i »${p.kallText.meningFsv ?? ""}» (${p.kallText.titel ?? "utdrag"})`
          : null,
        p.anteckning ? `   Anteckning: ${p.anteckning}` : null,
        `   URL: https://fornsvenska.se/ordbok/${encodeURIComponent(p.id)}`,
        "",
      ].filter(Boolean);
      return stycke.join("\n");
    }),
  ];

  return {
    data: rader.join("\n"),
    mimeType: "text/plain;charset=utf-8",
    filnamn: `fornsvenska-ordlista-${tidsstampel}.txt`,
  };
}

export function laddaNerFil(innehall: string, mimeType: string, filnamn: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([innehall], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filnamn;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
