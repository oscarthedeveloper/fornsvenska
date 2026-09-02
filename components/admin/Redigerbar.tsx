"use client";

import { useEffect, useRef } from "react";
import Inline from "@/components/dokument/Inline";
import {
  FORMATERINGSHANDELSE,
  type Formateringskommando,
  type Inlineformat,
  type Markeringsfarg,
} from "@/lib/markeringar";

/**
 * Ett textfält som redigeras där det står.
 *
 * Fältet är avsiktligt okontrollerat: React skriver bara om innehållet när
 * värdet ändras utifrån, aldrig medan man skriver. Annars hoppar markören
 * till början vid varje tangenttryckning.
 *
 * Fältet är ren text hela vägen — även formateringen. Ctrl/Cmd+B, I, U och E
 * lägger markörer runt markeringen (**fet**, *kursiv*, _understruken_,
 * `term`). Färgverktyget använder ==1|text== till ==8|text==. Inline tolkar
 * markörerna när texten visas. Fördelen: det som ligger i databasen är exakt
 * det som står i fältet, och inklistrad text kan aldrig smuggla in främmande
 * uppmärkning.
 */

const KOMMANDON: Record<string, Inlineformat> = {
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
function vaxlaFormat(el: HTMLElement, format: Inlineformat) {
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

/** Slår på, byter eller tar bort en färgmarkering runt den valda texten. */
function vaxlaMarkering(el: HTMLElement, farg: Markeringsfarg | 0) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.commonAncestorContainer)) return;

  const text = platttext(el);
  let start = forskjutning(el, range.startContainer, range.startOffset);
  let slut = forskjutning(el, range.endContainer, range.endOffset);

  while (start < slut && /\s/.test(text[start])) start++;
  while (slut > start && /\s/.test(text[slut - 1])) slut--;
  if (start === slut) return;

  let valt = text.slice(start, slut);
  let gammalFarg: number | null = null;
  let ersattStart = start;
  let ersattSlut = slut;

  /* Markören kan ligga utanför markeringen (när bara orden valts) eller ingå
     i den (när administratören har markerat hela den synliga råtexten). */
  const runt = text.slice(Math.max(0, start - 4), slut + 2);
  const runtTraff = runt.match(/^==([1-8])\|([\s\S]+)==$/);
  const helTraff = valt.match(/^==([1-8])\|([\s\S]+)==$/);

  if (runtTraff) {
    gammalFarg = Number(runtTraff[1]);
    valt = runtTraff[2];
    ersattStart = start - 4;
    ersattSlut = slut + 2;
  } else if (helTraff) {
    gammalFarg = Number(helTraff[1]);
    valt = helTraff[2];
  }

  if (farg === 0 && gammalFarg === null) return;
  const nyFarg = gammalFarg === farg ? 0 : farg;
  const fore = nyFarg ? `==${nyFarg}|` : "";
  const efter = nyFarg ? "==" : "";

  markera(el, ersattStart, ersattSlut);
  document.execCommand("insertText", false, `${fore}${valt}${efter}`);
  markera(el, ersattStart + fore.length, ersattStart + fore.length + valt.length);
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
  /** Tolka inlineformat och färgmarkeringar när fältet visas. */
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

  useEffect(() => {
    if (!redigerbar || !formatering) return;

    const formatera = (event: Event) => {
      const el = ref.current;
      if (!el) return;
      const kommando = (event as CustomEvent<Formateringskommando>).detail;
      if (!kommando) return;

      if (kommando.typ === "inline") vaxlaFormat(el, kommando.format);
      else vaxlaMarkering(el, kommando.farg);
    };

    document.addEventListener(FORMATERINGSHANDELSE, formatera);
    return () => document.removeEventListener(FORMATERINGSHANDELSE, formatera);
  }, [formatering, redigerbar]);

  /* Nycklarna tvingar fram ett nytt element när läget växlar. Utan dem
     återanvänder React samma div — och den innehåller redan en textnod som
     React inte känner till, eftersom fältet skriver innerText själv. Den
     noden blir kvar och texten syns dubbelt. */
  if (!redigerbar) {
    return (
      <Tag key="las" className={className}>
        {formatering ? <Inline text={varde} /> : varde}
      </Tag>
    );
  }

  return (
    <Tag
      key="red"
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
