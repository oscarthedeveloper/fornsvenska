import { Fragment } from "react";

/**
 * Inline-uppmärkning i brödtexten:
 *
 *   **fet**        Ctrl/Cmd+B
 *   *kursiv*       Ctrl/Cmd+I
 *   ***båda***
 *   _understruken_ Ctrl/Cmd+U
 *   `term`         Ctrl/Cmd+E — fornsvenskt formord eller ändelse, i monospace
 *   ==1|text==     transparent färgmarkering, färg 1–8
 *   [^1]           hänvisning till fotnot
 *   \*             omvänt snedstreck ger tecknet självt
 *
 * Allt lagras som ren text i databasen, exakt det adminläget skriver in.
 * Uppmärkningen får nästlas: **fet med *kursiv* i**.
 *
 * Markörerna måste sluta tätt intill texten — *så här*, inte * så här *.
 * Det är inte kosmetik: asterisk framför ett ord betyder rekonstruerad form
 * i språkhistoria, och *wiþer ok *bonde ska inte bli kursiv text.
 */

/**
 * Ordningen är betydelsebärande: *** före ** före *.
 * De två mönster som innehåller bakåtfnutt skrivs som vanliga strängar —
 * i en mall-literal måste fnutten flyktas, och \` är ett ogiltigt uttryck
 * i ett unicode-reguljäruttryck.
 */
const MONSTER = [
  "\\\\([\\\\*_`\\[])",
  String.raw`==([1-8])\|(?=\S)([\s\S]*?\S)==`,
  String.raw`\*\*\*(?=\S)([\s\S]*?[^\s*])\*\*\*`,
  String.raw`\*\*(?=\S)([\s\S]*?[^\s*])\*\*`,
  String.raw`\*(?=\S)([^*\n]*?[^\s*])\*`,
  String.raw`_(?=\S)([^_\n]*?[^\s_])_`,
  "`([^`\\n]+?)`",
  String.raw`\[\^(\d+)\]`,
].join("|");

/** Sant om tecknet ingår i ett ord — lösa understreck inuti ord får stå kvar. */
const ORDTECKEN = /[\p{L}\p{N}]/u;

function tolka(text: string): React.ReactNode[] {
  const delar: React.ReactNode[] = [];
  const regex = new RegExp(MONSTER, "gu");
  let senast = 0;
  let nyckel = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    // Understreck mitt i ett ord — snake_case, translittereringar — är text.
    if (
      m[7] !== undefined &&
      ((m.index > 0 && ORDTECKEN.test(text[m.index - 1])) ||
        ORDTECKEN.test(text[regex.lastIndex] ?? ""))
    ) {
      regex.lastIndex = m.index + 1;
      continue;
    }

    if (m.index > senast) delar.push(text.slice(senast, m.index));
    const k = nyckel++;

    if (m[1] !== undefined) {
      delar.push(m[1]);
    } else if (m[2] !== undefined) {
      delar.push(
        <mark key={k} className="doc-highlight" data-highlight={m[2]}>
          {tolka(m[3])}
        </mark>
      );
    } else if (m[4] !== undefined) {
      delar.push(
        <strong key={k}>
          <em>{tolka(m[4])}</em>
        </strong>
      );
    } else if (m[5] !== undefined) {
      delar.push(<strong key={k}>{tolka(m[5])}</strong>);
    } else if (m[6] !== undefined) {
      delar.push(<em key={k}>{tolka(m[6])}</em>);
    } else if (m[7] !== undefined) {
      delar.push(
        <span key={k} className="doc-understruken">
          {tolka(m[7])}
        </span>
      );
    } else if (m[8] !== undefined) {
      delar.push(
        <span key={k} className="doc-term">
          {m[8]}
        </span>
      );
    } else {
      delar.push(
        <a key={k} href={`#not-${m[9]}`} className="doc-note-ref">
          {m[9]}
        </a>
      );
    }

    senast = regex.lastIndex;
  }

  delar.push(text.slice(senast));
  return delar;
}

export default function Inline({ text }: { text: string }) {
  return (
    <>
      {tolka(text).map((d, k) => (
        <Fragment key={k}>{d}</Fragment>
      ))}
    </>
  );
}
