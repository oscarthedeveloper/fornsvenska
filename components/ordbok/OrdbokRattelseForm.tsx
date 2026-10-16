"use client";

import { useState, useTransition } from "react";
import type { OrdbokGranskningsstatus, OrdbokPost, OrdbokRattelse } from "@/lib/ordbok/typer";
import {
  sparaOrdbokRattelseAction,
  taBortOrdbokRattelseAction,
} from "@/lib/ordbok/rattelseActions";
import OrdbokRattelseDiff from "./OrdbokRattelseDiff";

const SPECIAL_TECKEN = ["þ", "ð", "æ", "ø", "ä", "ö", "å", "Þ", "Æ", "Ø"];

export default function OrdbokRattelseForm({
  post,
  befintligRattelse,
  onSpara,
  onAvbryt,
}: {
  post: OrdbokPost;
  befintligRattelse?: OrdbokRattelse;
  onSpara?: (rattelse?: OrdbokRattelse) => void;
  onAvbryt?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const [headwordOverride, setHeadwordOverride] = useState(
    befintligRattelse?.headwordDisplayOverride ?? post.headwordDisplay
  );
  const [reviewStatus, setReviewStatus] = useState<OrdbokGranskningsstatus>(
    befintligRattelse?.reviewStatus ?? "rattad_med_kallstod"
  );
  const [kallstod, setKallstod] = useState(befintligRattelse?.kallstod ?? "");
  const [note, setNote] = useState(befintligRattelse?.note ?? "");
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);
  const [sparades, setSparades] = useState(false);

  function laggTillTecken(tecken: string) {
    setHeadwordOverride((prev) => prev + tecken);
  }

  function hanteraSpara(e: React.FormEvent) {
    e.preventDefault();
    setFelmeddelande(null);
    setSparades(false);

    if (!kallstod.trim()) {
      setFelmeddelande("Källstöd måste anges (t.ex. faksimilband, sida eller handskrift).");
      return;
    }

    if (!note.trim()) {
      setFelmeddelande("Redaktionell notering eller motivering måste anges.");
      return;
    }

    startTransition(async () => {
      const res = await sparaOrdbokRattelseAction({
        id: post.id,
        headwordDisplayOverride: headwordOverride.trim() !== post.headwordOriginal ? headwordOverride.trim() : undefined,
        reviewStatus,
        kallstod: kallstod.trim(),
        note: note.trim(),
      });

      if (!res.ok) {
        setFelmeddelande(res.fel ?? "Kunde inte spara rättelsen.");
      } else {
        setSparades(true);
        if (onSpara) onSpara(res.rattelse);
      }
    });
  }

  function hanteraAterstall() {
    if (!confirm("Är du säker på att du vill ta bort rättelsen och återställa posten till källans original?")) {
      return;
    }
    setFelmeddelande(null);
    startTransition(async () => {
      const res = await taBortOrdbokRattelseAction(post.id);
      if (!res.ok) {
        setFelmeddelande(res.fel ?? "Kunde inte återställa posten.");
      } else {
        setSparades(true);
        if (onSpara) onSpara(undefined);
      }
    });
  }

  const utkastRattelse: Partial<OrdbokRattelse> = {
    headwordDisplayOverride: headwordOverride,
    reviewStatus,
    kallstod,
    note,
  };

  return (
    <form onSubmit={hanteraSpara} className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-ink pb-2">
        <div>
          <span className="nano opacity-60">Redaktionellt gränssnitt</span>
          <h2 className="font-serif text-[1.4rem] leading-tight">
            Rätta eller verifiera ordbokspost
          </h2>
        </div>
        <span className="nano border border-ink/40 px-2 py-0.5 opacity-80">
          ID: {post.id}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="hw-input" className="nano font-semibold flex items-center justify-between">
          <span>Visningsuppslagsord</span>
          <span className="opacity-60 font-normal">Original: »{post.headwordOriginal}«</span>
        </label>
        <div className="flex gap-2">
          <input
            id="hw-input"
            type="text"
            value={headwordOverride}
            onChange={(e) => setHeadwordOverride(e.target.value)}
            required
            className="flex-1 border border-ink bg-paper px-3 py-1.5 font-serif text-[1.1rem] outline-none focus:bg-panel"
            placeholder="Uppslagsord"
          />
        </div>

        {/* Specialteckenknappar */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="nano opacity-50 mr-1">Infoga:</span>
          {SPECIAL_TECKEN.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => laggTillTecken(t)}
              className="nano border border-ink/40 bg-panel px-2 py-0.5 hover:border-ink hover:bg-paper transition-colors font-mono"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Granskningsstatus */}
      <div className="flex flex-col gap-1.5">
        <label className="nano font-semibold">Redaktionell status</label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-start gap-2 border border-ink p-2.5 bg-panel cursor-pointer hover:bg-paper/50">
            <input
              type="radio"
              name="status"
              value="rattad_med_kallstod"
              checked={reviewStatus === "rattad_med_kallstod"}
              onChange={() => setReviewStatus("rattad_med_kallstod")}
              className="mt-0.5 accent-accent"
            />
            <div>
              <span className="nano font-semibold block">Rättad med källstöd</span>
              <span className="text-[0.68rem] leading-tight opacity-75 block">
                Uppslagsord eller form korrigerad mot faksimil/handskrift.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2 border border-ink p-2.5 bg-panel cursor-pointer hover:bg-paper/50">
            <input
              type="radio"
              name="status"
              value="redaktionellt_verifierad"
              checked={reviewStatus === "redaktionellt_verifierad"}
              onChange={() => setReviewStatus("redaktionellt_verifierad")}
              className="mt-0.5 accent-accent"
            />
            <div>
              <span className="nano font-semibold block">Redaktionellt verifierad</span>
              <span className="text-[0.68rem] leading-tight opacity-75 block">
                Postens källtext kontrollerad och bekräftad mot förlagan.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Källstöd */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="kallstod-input" className="nano font-semibold flex items-center justify-between">
          <span>Dokumenterat källstöd (obligatoriskt)</span>
          <span className="opacity-60 font-normal">Faksimil, band, sida, handskrift</span>
        </label>
        <textarea
          id="kallstod-input"
          value={kallstod}
          onChange={(e) => setKallstod(e.target.value)}
          required
          rows={2}
          className="border border-ink bg-paper px-3 py-2 text-[0.78rem] font-mono outline-none focus:bg-panel leading-relaxed"
          placeholder="T.ex. Söderwall Bd 1 s. 42 (faksimil Runeberg svmtsprk/1/0048.html), jfr även SDHK 14205"
        />
      </div>

      {/* Redaktionell motivering */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-input" className="nano font-semibold flex items-center justify-between">
          <span>Redaktionell notering / motivering</span>
          <span className="opacity-60 font-normal">Vad ändrades och varför?</span>
        </label>
        <textarea
          id="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
          rows={2}
          className="border border-ink bg-paper px-3 py-2 text-[0.78rem] outline-none focus:bg-panel leading-relaxed"
          placeholder="T.ex. Korrigerat uppenbart OCR-fel i Språkbankens XML; förlagan har 'þ' istället för 'd'."
        />
      </div>

      {/* Live diff-förhandsgranskning */}
      <div className="flex flex-col gap-1 pt-1">
        <span className="nano opacity-60">Förhandsgranskning av differentiering:</span>
        <OrdbokRattelseDiff
          post={post}
          rattelse={utkastRattelse}
          kompakt
        />
      </div>

      {felmeddelande && (
        <div className="p-3 bg-accent text-ink border border-ink micro">
          {felmeddelande}
        </div>
      )}

      {sparades && (
        <div className="p-2.5 bg-panel border border-ink text-ink micro flex items-center gap-2">
          <span className="text-accent font-semibold">✓</span> Ändringen är sparad och indexet är uppdaterat.
        </div>
      )}

      {/* Knapprad */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-ink flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="micro bg-ink text-paper border border-ink px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Sparar …" : "Spara rättelse"}
          </button>

          {onAvbryt && (
            <button
              type="button"
              onClick={onAvbryt}
              className="micro border border-ink bg-panel px-3 py-2 hover:bg-paper transition-colors"
            >
              Stäng
            </button>
          )}
        </div>

        {befintligRattelse && (
          <button
            type="button"
            onClick={hanteraAterstall}
            disabled={isPending}
            className="nano border border-dashed border-ink/60 text-ink/80 px-3 py-2 hover:border-ink hover:text-ink hover:bg-accent/20 transition-colors"
          >
            Återställ till källans original
          </button>
        )}
      </div>
    </form>
  );
}
