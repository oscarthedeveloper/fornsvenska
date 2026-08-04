"use client";

import { useEffect, useRef } from "react";

/**
 * Ett textfält som redigeras där det står.
 *
 * Fältet är avsiktligt okontrollerat: React skriver bara om innehållet när
 * värdet ändras utifrån, aldrig medan man skriver. Annars hoppar markören
 * till början vid varje tangenttryckning.
 */
export default function Redigerbar({
  varde,
  onChange,
  redigerbar,
  className,
  platshallare,
  flerRader = false,
  as: Tag = "span",
}: {
  varde: string;
  onChange: (nytt: string) => void;
  redigerbar: boolean;
  className?: string;
  platshallare?: string;
  flerRader?: boolean;
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
    return <Tag className={className}>{varde}</Tag>;
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
