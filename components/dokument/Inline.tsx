import { Fragment } from "react";

/**
 * Enkel inline-uppmärkning i brödtexten:
 *   *kursiv*  och  [^1] för fotnotshänvisning.
 * Medvetet minimal — samma två former är allt adminläget behöver kunna
 * skriva in, och de går att lagra som ren text i databasen.
 */
export default function Inline({ text }: { text: string }) {
  const delar: React.ReactNode[] = [];
  const regex = /(\*[^*]+\*)|\[\^(\d+)\]/g;
  let senast = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > senast) delar.push(text.slice(senast, m.index));

    if (m[1]) {
      delar.push(<em key={i++}>{m[1].slice(1, -1)}</em>);
    } else {
      delar.push(
        <a key={i++} href={`#not-${m[2]}`} className="doc-note-ref">
          {m[2]}
        </a>
      );
    }
    senast = regex.lastIndex;
  }

  delar.push(text.slice(senast));

  return (
    <>
      {delar.map((d, k) => (
        <Fragment key={k}>{d}</Fragment>
      ))}
    </>
  );
}
