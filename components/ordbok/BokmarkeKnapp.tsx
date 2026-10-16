"use client";

import { useEffect, useState } from "react";
import {
  arOrdSparat,
  BOKMARKEN_HANDELSE,
  sparaOrd,
  taBortSparatOrd,
  type SparatOrdbokOrd,
} from "@/lib/ordbok/bokmarken";

export interface BokmarkePostData {
  id: string;
  headwordDisplay: string;
  sourceDataset: "soederwall" | "soederwall-supp";
  kallaId: "SOD1884" | "SOD-SUPP";
  partOfSpeech: string[];
  gramOriginal?: string;
  snippet: string;
  homonymNumber?: number;
}

export default function BokmarkeKnapp({
  post,
  kallText,
  kompakt = false,
  className = "",
}: {
  post: BokmarkePostData;
  kallText?: SparatOrdbokOrd["kallText"];
  kompakt?: boolean;
  className?: string;
}) {
  const [sparad, setSparad] = useState(false);

  useEffect(() => {
    setSparad(arOrdSparat(post.id));

    const onAndring = () => {
      setSparad(arOrdSparat(post.id));
    };

    window.addEventListener(BOKMARKEN_HANDELSE, onAndring);
    return () => window.removeEventListener(BOKMARKEN_HANDELSE, onAndring);
  }, [post.id]);

  const vaxla = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sparad) {
      taBortSparatOrd(post.id);
    } else {
      sparaOrd({
        id: post.id,
        headwordDisplay: post.headwordDisplay,
        sourceDataset: post.sourceDataset,
        kallaId: post.kallaId,
        partOfSpeech: post.partOfSpeech,
        gramOriginal: post.gramOriginal,
        snippet: post.snippet,
        homonymNumber: post.homonymNumber,
        sparadDatum: new Date().toISOString(),
        kallText,
      });
    }
  };

  if (kompakt) {
    return (
      <button
        type="button"
        onClick={vaxla}
        aria-pressed={sparad}
        title={sparad ? `Ta bort »${post.headwordDisplay}» från ordlistan` : `Spara »${post.headwordDisplay}» i ordlistan`}
        className={`w-7 h-7 inline-flex items-center justify-center border border-ink text-[0.88rem] leading-none transition-colors ${
          sparad
            ? "bg-accent text-ink border-ink hover:bg-accent/80"
            : "bg-paper text-ink/65 hover:text-ink hover:bg-panel"
        } ${className}`}
      >
        <span aria-hidden="true">{sparad ? "★" : "☆"}</span>
        <span className="sr-only">
          {sparad ? `Ta bort »${post.headwordDisplay}» från ordlistan` : `Spara »${post.headwordDisplay}» i ordlistan`}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={vaxla}
      aria-pressed={sparad}
      className={`nano px-2.5 py-1 border border-ink inline-flex items-center gap-1.5 transition-colors ${
        sparad
          ? "bg-accent text-ink font-semibold hover:bg-accent/85"
          : "bg-paper text-ink hover:bg-panel"
      } ${className}`}
    >
      <span aria-hidden="true" className="text-[0.85rem] leading-none">
        {sparad ? "★" : "☆"}
      </span>
      <span>{sparad ? "I min ordlista" : "Spara ord"}</span>
    </button>
  );
}
