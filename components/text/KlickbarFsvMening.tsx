"use client";

import { Fragment } from "react";
import { rensaKlickatOrd } from "@/lib/ordbok/kandidater";

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

const ORDTECKEN = /[\p{L}\p{N}]/u;
const ORD_SEGMENT_REGEX = /([\p{L}\p{M}]+(?:-[\p{L}\p{M}]+)*)/gu;

export interface KlickatOrdKontext {
  ord: string;
  rensatOrd: string;
  meningFsv: string;
  meningTolkning: string;
  meningKommentar?: string;
  sektionRubrik?: string;
  sektionHanvisning?: string;
  meningNr: number;
}

function tokeniseraText(
  text: string,
  aktivtRensatOrd: string | null,
  onSelectWord?: (ord: string) => void
): React.ReactNode[] {
  if (!onSelectWord) return [text];

  const delar = text.split(ORD_SEGMENT_REGEX);
  return delar.map((del, idx) => {
    if (idx % 2 === 1) {
      const rensat = rensaKlickatOrd(del).toLowerCase();
      const arValt =
        Boolean(aktivtRensatOrd) &&
        rensat.length > 0 &&
        rensat === aktivtRensatOrd?.toLowerCase();

      return (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectWord(del)}
          data-valt-ord={arValt ? "1" : undefined}
          title={`Slå upp »${del}» i Söderwalls ordbok`}
          className={`inline p-0 m-0 border-0 bg-transparent font-inherit text-inherit leading-inherit cursor-pointer rounded-[1px] transition-colors duration-[120ms] hover:underline hover:decoration-accent hover:decoration-1 hover:underline-offset-[3px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent ${
            arValt
              ? "bg-ink text-paper px-1 -mx-0.5 no-underline"
              : ""
          }`}
        >
          {del}
        </button>
      );
    }
    return del;
  });
}

function tolkaKlickbar(
  text: string,
  aktivtRensatOrd: string | null,
  onSelectWord?: (ord: string) => void
): React.ReactNode[] {
  const delar: React.ReactNode[] = [];
  const regex = new RegExp(MONSTER, "gu");
  let senast = 0;
  let nyckel = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (
      m[7] !== undefined &&
      ((m.index > 0 && ORDTECKEN.test(text[m.index - 1])) ||
        ORDTECKEN.test(text[regex.lastIndex] ?? ""))
    ) {
      regex.lastIndex = m.index + 1;
      continue;
    }

    if (m.index > senast) {
      delar.push(
        ...tokeniseraText(
          text.slice(senast, m.index),
          aktivtRensatOrd,
          onSelectWord
        )
      );
    }
    const k = `m-${nyckel++}`;

    if (m[1] !== undefined) {
      delar.push(m[1]);
    } else if (m[2] !== undefined) {
      delar.push(
        <mark key={k} className="doc-highlight" data-highlight={m[2]}>
          {tolkaKlickbar(m[3], aktivtRensatOrd, onSelectWord)}
        </mark>
      );
    } else if (m[4] !== undefined) {
      delar.push(
        <strong key={k}>
          <em>{tolkaKlickbar(m[4], aktivtRensatOrd, onSelectWord)}</em>
        </strong>
      );
    } else if (m[5] !== undefined) {
      delar.push(
        <strong key={k}>
          {tolkaKlickbar(m[5], aktivtRensatOrd, onSelectWord)}
        </strong>
      );
    } else if (m[6] !== undefined) {
      delar.push(
        <em key={k}>{tolkaKlickbar(m[6], aktivtRensatOrd, onSelectWord)}</em>
      );
    } else if (m[7] !== undefined) {
      delar.push(
        <span key={k} className="doc-understruken">
          {tolkaKlickbar(m[7], aktivtRensatOrd, onSelectWord)}
        </span>
      );
    } else if (m[8] !== undefined) {
      delar.push(
        <span key={k} className="doc-term">
          {tokeniseraText(m[8], aktivtRensatOrd, onSelectWord)}
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

  if (senast < text.length) {
    delar.push(
      ...tokeniseraText(text.slice(senast), aktivtRensatOrd, onSelectWord)
    );
  }
  return delar;
}

export default function KlickbarFsvMening({
  text,
  aktivtRensatOrd = null,
  onSelectWord,
}: {
  text: string;
  aktivtRensatOrd?: string | null;
  onSelectWord?: (ord: string) => void;
}) {
  return (
    <>
      {tolkaKlickbar(text, aktivtRensatOrd, onSelectWord).map((d, k) => (
        <Fragment key={k}>{d}</Fragment>
      ))}
    </>
  );
}
