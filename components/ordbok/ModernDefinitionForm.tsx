"use client";

import { useState, useTransition } from "react";
import type { ModerniseradDefinition, OrdbokPost } from "@/lib/ordbok/typer";
import {
  sparaModernDefinitionAction,
  taBortModernDefinitionAction,
} from "@/lib/ordbok/moderniseringActions";

export default function ModernDefinitionForm({
  post,
  befintligDefinition,
  onSpara,
  onAvbryt,
}: {
  post: OrdbokPost;
  befintligDefinition?: ModerniseradDefinition;
  onSpara?: (def?: ModerniseradDefinition) => void;
  onAvbryt?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const [glosorText, setGlosorText] = useState(
    befintligDefinition?.modernGlos.join(", ") ?? ""
  );
  const [kortForklaring, setKortForklaring] = useState(
    befintligDefinition?.kortForklaring ?? ""
  );
  const [pedagogiskNot, setPedagogiskNot] = useState(
    befintligDefinition?.pedagogiskNot ?? ""
  );
  const [modernMotsvarighet, setModernMotsvarighet] = useState(
    befintligDefinition?.modernMotsvarighet ?? ""
  );
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);
  const [sparades, setSparades] = useState(false);

  function hanteraSpara(e: React.FormEvent) {
    e.preventDefault();
    setFelmeddelande(null);
    setSparades(false);

    const glosor = glosorText
      .split(/[,;\n]+/)
      .map((g) => g.trim())
      .filter(Boolean);

    if (glosor.length === 0) {
      setFelmeddelande("Ange minst en modern snabbglosa (kommaseparerat).");
      return;
    }

    if (!kortForklaring.trim()) {
      setFelmeddelande("En lättfattlig sammanfattande förklaring måste anges.");
      return;
    }

    startTransition(async () => {
      const res = await sparaModernDefinitionAction({
        id: post.id,
        headwordDisplay: post.headwordDisplay,
        modernGlos: glosor,
        kortForklaring: kortForklaring.trim(),
        pedagogiskNot: pedagogiskNot.trim() || undefined,
        modernMotsvarighet: modernMotsvarighet.trim() || glosor[0],
        kalla: "kurerad_redaktionell",
        granskad: true,
      });

      if (!res.ok) {
        setFelmeddelande(res.fel ?? "Kunde inte spara modern definition.");
      } else {
        setSparades(true);
        if (onSpara) onSpara(res.definition);
      }
    });
  }

  function hanteraAterstall() {
    if (!confirm("Vill du ta bort den kurerade definitionen och återgå till automatisk ordboksextraktion?")) {
      return;
    }
    setFelmeddelande(null);
    startTransition(async () => {
      const res = await taBortModernDefinitionAction(post.id);
      if (!res.ok) {
        setFelmeddelande(res.fel ?? "Kunde inte ta bort definitionen.");
      } else {
        setSparades(true);
        if (onSpara) onSpara(undefined);
      }
    });
  }

  return (
    <form onSubmit={hanteraSpara} className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-ink pb-2">
        <div>
          <span className="nano opacity-60">Redaktionellt förklaringsstöd</span>
          <h2 className="font-serif text-[1.4rem] leading-tight">
            Redigera modernt förklaringsstöd för »{post.headwordDisplay}«
          </h2>
        </div>
        <span className="nano border border-ink/40 px-2 py-0.5 opacity-80">
          ID: {post.id}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="glosor-input" className="nano font-semibold flex items-center justify-between">
          <span>Moderna snabbglosor (kommaseparerade)</span>
          <span className="opacity-60 font-normal">T.ex. kung, monark, rikshärskare</span>
        </label>
        <input
          id="glosor-input"
          type="text"
          value={glosorText}
          onChange={(e) => setGlosorText(e.target.value)}
          required
          className="border border-ink bg-paper px-3 py-1.5 text-[0.95rem] outline-none focus:bg-panel"
          placeholder="kung, monark, rikshärskare"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="forklaring-input" className="nano font-semibold">
          Lättfattlig förklaring på modern svenska
        </label>
        <textarea
          id="forklaring-input"
          value={kortForklaring}
          onChange={(e) => setKortForklaring(e.target.value)}
          required
          rows={3}
          className="border border-ink bg-paper px-3 py-2 text-[0.84rem] outline-none focus:bg-panel leading-relaxed"
          placeholder="Kung, monark och rikets främste styresman..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="pedagogisk-input" className="nano font-semibold flex items-center justify-between">
          <span>Pedagogisk handledning / böjningsnot (valfri)</span>
          <span className="opacity-60 font-normal">Formlära, kasus, kontext</span>
        </label>
        <textarea
          id="pedagogisk-input"
          value={pedagogiskNot}
          onChange={(e) => setPedagogiskNot(e.target.value)}
          rows={2}
          className="border border-ink bg-paper px-3 py-2 text-[0.8rem] font-mono outline-none focus:bg-panel leading-relaxed"
          placeholder="Maskulint substantiv (a-stam). Böjs ofta ack. konung, gen. konungs, dat. konungi..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="modern-motsvarighet-input" className="nano font-semibold">
          Nutida standardsvensk motsvarighet (ett ord)
        </label>
        <input
          id="modern-motsvarighet-input"
          type="text"
          value={modernMotsvarighet}
          onChange={(e) => setModernMotsvarighet(e.target.value)}
          className="border border-ink bg-paper px-3 py-1.5 text-[0.85rem] outline-none focus:bg-panel"
          placeholder="kung"
        />
      </div>

      {felmeddelande && (
        <div className="p-3 bg-accent text-ink border border-ink micro">
          {felmeddelande}
        </div>
      )}

      {sparades && (
        <div className="p-2.5 bg-panel border border-ink text-ink micro flex items-center gap-2">
          <span className="text-accent font-semibold">✓</span> Den moderna förklaringen har sparats.
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-ink flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="micro bg-ink text-paper border border-ink px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isPending ? "Sparar …" : "Spara definition"}
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

        {befintligDefinition?.kalla === "kurerad_redaktionell" && (
          <button
            type="button"
            onClick={hanteraAterstall}
            disabled={isPending}
            className="nano border border-dashed border-ink/60 text-ink/80 px-3 py-2 hover:border-ink hover:text-ink hover:bg-accent/20 transition-colors"
          >
            Återgå till automatisk glosa
          </button>
        )}
      </div>
    </form>
  );
}
