import { Fragment } from "react";
import Inline from "@/components/dokument/Inline";

/**
 * Texten i en skriftversion.
 *
 *   ==ordet==            markeras med versionens första ton
 *   ==ordet|Pronomen==   markeras med den ton etiketten Pronomen fått
 *
 * Etiketterna får sin ton i den ordning de först dyker upp i texten, och
 * listas som teckenförklaring ovanför läsaren. Övrig uppmärkning (*kursiv*,
 * [^1]) tolkas som vanligt av Inline.
 *
 * Tomrad bryter stycke, precis som i resten av sajten.
 */

const MARKERING = /==([^=\n]+?)==/g;

/** Etiketterna i den ordning de förekommer — bestämmer tonerna. */
export function etiketterI(text: string): string[] {
  const funna: string[] = [];
  const regex = new RegExp(MARKERING.source, "g");
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    const skiljetecken = m[1].lastIndexOf("|");
    if (skiljetecken < 0) continue;
    const etikett = m[1].slice(skiljetecken + 1).trim();
    if (etikett && !funna.includes(etikett)) funna.push(etikett);
  }

  return funna;
}

function tolkaStycke(text: string, etiketter: string[]): React.ReactNode[] {
  const delar: React.ReactNode[] = [];
  const regex = new RegExp(MARKERING.source, "g");
  let senast = 0;
  let nyckel = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > senast) {
      delar.push(<Inline key={nyckel++} text={text.slice(senast, m.index)} />);
    }

    const skiljetecken = m[1].lastIndexOf("|");
    const ord = skiljetecken < 0 ? m[1] : m[1].slice(0, skiljetecken);
    const etikett = skiljetecken < 0 ? "" : m[1].slice(skiljetecken + 1).trim();
    const ton = etikett ? Math.max(0, etiketter.indexOf(etikett)) % 5 : 0;

    delar.push(
      <mark key={nyckel++} className="mark-sent" data-mark={ton} title={etikett || undefined}>
        {ord}
      </mark>
    );

    senast = regex.lastIndex;
  }

  delar.push(<Inline key={nyckel++} text={text.slice(senast)} />);
  return delar;
}

export default function MarkeradText({
  text,
  etiketter,
}: {
  text: string;
  etiketter: string[];
}) {
  const stycken = text.split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-4">
      {stycken.map((stycke, i) => (
        <p key={i} className="skrift-text">
          {tolkaStycke(stycke, etiketter).map((d, k) => (
            <Fragment key={k}>{d}</Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
