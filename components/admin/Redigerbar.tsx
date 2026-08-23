"use client";

import { useEffect, useRef } from "react";
import Inline from "@/components/dokument/Inline";

/**
 * Ett textfält som redigeras där det står.
 *
 * Fältet är avsiktligt okontrollerat: React skriver bara om innehållet när
 * värdet ändras utifrån, aldrig medan man skriver. Annars hoppar markören
 * till början vid varje tangenttryckning.
 *
 * Fältet är ren text hela vägen — även formateringen. Ctrl/Cmd+B, I, U och E
 * lägger markörer runt markeringen (**fet**, *kursiv*, _understruken_,
 * `term`) och tar bort dem igen om de redan står där. Inline tolkar dem när
 * texten visas. Fördelen: det som ligger i databasen är exakt det som står i
 * fältet, och inklistrad text kan aldrig smuggla in främmande uppmärkning.
 */

type Format = "fet" | "kursiv" | "understruken" | "term";

const KOMMANDON: Record<string, Format> = {
  b: "fet",
  i: "kursiv",
  u: "understruken",
  e: "term",
};

/** Alla textnoder i ordning — fältet innehåller bara text och radbrytningar. */
function textnoder(el: HTMLElement): Text[] {
  const gang = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const noder: Text[] = [];
  let n: Node | null;
  while ((n = gang.nextNode())) noder.push(n as Text);
  return noder;
}

/** Fältets text sedd som en enda sträng — samma vy som markeringen ger. */
function platttext(el: HTMLElement): string {
  return textnoder(el)
    .map((n) => n.data)
    .join("");
}

/** Antal tecken från fältets början fram till en punkt i markeringen. */
function forskjutning(el: HTMLElement, nod: Node, offset: number): number {
  const r = document.createRange();
  r.selectNodeContents(el);
  r.setEnd(nod, offset);
  return r.toString().length;
}

/** Markerar tecknen [start, slut) räknat i plattextens koordinater. */
function markera(el: HTMLElement, start: number, slut: number) {
  const noder = textnoder(el);
  const punkt = (mal: number): [Node, number] => {
    let kvar = Math.max(0, mal);
    for (const nod of noder) {
      if (kvar <= nod.data.length) return [nod, kvar];
      kvar -= nod.data.length;
    }
    const sista = noder[noder.length - 1];
    return sista ? [sista, sista.data.length] : [el, 0];
  };

  const r = document.createRange();
  const [a, ao] = punkt(start);
  const [b, bo] = punkt(slut);
  r.setStart(a, ao);
  r.setEnd(b, bo);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(r);
}

/** Hur många gånger markören upprepas omedelbart före respektive efter. */
function antalRunt(
  text: string,
  start: number,
  slut: number,
  tecken: string,
  tak: number
) {
  let fore = 0;
  while (fore < tak && text[start - fore - 1] === tecken) fore++;
  let efter = 0;
  while (efter < tak && text[slut + efter] === tecken) efter++;
  return Math.min(fore, efter);
}

/**
 * Slår på eller av ett format runt markeringen.
 *
 * Stjärnorna räknas i klump: en stjärna är kursiv, två fet, tre båda. Därför
 * kan fet slås av utan att kursiven inuti går sönder.
 */
function vaxlaFormat(el: HTMLElement, format: Format) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.commonAncestorContainer)) return;

  const text = platttext(el);
  let start = forskjutning(el, range.startContainer, range.startOffset);
  let slut = forskjutning(el, range.endContainer, range.endOffset);

  // Krymp markeringen till själva ordet. Markörerna måste sitta tätt intill
  // texten för att Inline ska tolka dem, och en markering med musen tar
  // nästan alltid med ett blanksteg för mycket.
  while (start < slut && /\s/.test(text[start])) start++;
  while (slut > start && /\s/.test(text[slut - 1])) slut--;

  const valt = text.slice(start, slut);

  const tecken = format === "understruken" ? "_" : format === "term" ? "`" : "*";
  const stjarnor = tecken === "*";
  const nuvarande = antalRunt(text, start, slut, tecken, stjarnor ? 3 : 1);

  let ny: number;
  if (!stjarnor) {
    ny = nuvarande ? 0 : 1;
  } else if (format === "fet") {
    ny = nuvarande >= 2 ? nuvarande - 2 : nuvarande + 2;
  } else {
    ny = nuvarande === 1 || nuvarande === 3 ? nuvarande - 1 : nuvarande + 1;
  }

  const markor = tecken.repeat(ny);

  // Ta med de gamla markörerna i markeringen och skriv om hela klumpen i ett
  // svep, så att ändringen blir ett enda steg i webbläsarens ångra-historik.
  markera(el, start - nuvarande, slut + nuvarande);
  document.execCommand("insertText", false, `${markor}${valt}${markor}`);

  const nyStart = start - nuvarande + markor.length;
  markera(el, nyStart, nyStart + valt.length);
}

export default function Redigerbar({
  varde,
  onChange,
  redigerbar,
  className,
  platshallare,
  flerRader = false,
  formatering = true,
  as: Tag = "span",
}: {
  varde: string;
  onChange: (nytt: string) => void;
  redigerbar: boolean;
  className?: string;
  platshallare?: string;
  flerRader?: boolean;
  /** Tolka **fet**, *kursiv*, _understruken_, `term` och [^1] när fältet visas. */
  formatering?: boolean;
  as?: "span" | "div" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.innerText !== varde) el.innerText = varde;
  }, [varde, redigerbar]);

  if (!redigerbar) {
    return (
      <Tag className={className}>
        {formatering ? <Inline text={varde} /> : varde}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      data-tom={varde ? undefined : "1"}
      data-platshallare={platshallare}
      className={`redigerbar ${className ?? ""}`}
      onPaste={(e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (formatering && (e.metaKey || e.ctrlKey) && !e.altKey) {
          const format = KOMMANDON[e.key.toLowerCase()];
          if (format) {
            e.preventDefault();
            vaxlaFormat(e.currentTarget as HTMLElement, format);
            return;
          }
        }
        if (!flerRader && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") (e.currentTarget as HTMLElement).blur();
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText.replace(/ /g, " ").trim();
        if (text !== varde) onChange(text);
      }}
    />
  );
}
