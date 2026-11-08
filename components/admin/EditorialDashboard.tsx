"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  hamtaRedaktionsOversiktAction,
  hamtaUtkastListaAction,
  begarPubliceringAction,
  aterstallUtkastAction,
} from "@/lib/editorial/editorialActions";
import type {
  EditorialDomain,
  EditorialDraftRecord,
  EditorialOverview,
} from "@/lib/editorial/types";

const DOMAIN_LINKS: Record<EditorialDomain, { href: string; label: string }> = {
  startsida: { href: "/", label: "Startsida" },
  trad_och_block: { href: "/texter", label: "Arkivträd" },
  texter: { href: "/texter", label: "Texter" },
  resurser: { href: "/resurser", label: "Resurser" },
  ordbok: { href: "/ordbok", label: "Ordbok" },
  runor: { href: "/admin/runor", label: "Runredaktion" },
};

export default function EditorialDashboard() {
  const [oversikt, setOversikt] = useState<EditorialOverview | null>(null);
  const [drafts, setDrafts] = useState<EditorialDraftRecord[]>([]);
  const [valdDoman, setValdDoman] = useState<EditorialDomain | "alla">("alla");
  const [laddar, setLaddar] = useState(true);
  const [publicerar, setPublicerar] = useState(false);
  const [meddelande, setMeddelande] = useState<{ typ: "framgang" | "fel" | "info"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  async function laddaData() {
    setLaddar(true);
    try {
      const [ovRes, drRes] = await Promise.all([
        hamtaRedaktionsOversiktAction(),
        hamtaUtkastListaAction(valdDoman === "alla" ? undefined : valdDoman),
      ]);

      if (ovRes.ok && ovRes.overview) {
        setOversikt(ovRes.overview);
      }
      if (drRes.ok) {
        setDrafts(drRes.drafts);
      }
    } catch {
      setMeddelande({ typ: "fel", text: "Kunde inte ladda redaktionsstatus." });
    } finally {
      setLaddar(false);
    }
  }

  useEffect(() => {
    laddaData();
  }, [valdDoman]);

  function hanteraPublicera() {
    if (publicerar) return;
    if (!confirm("Vill du publicera alla godkända redaktionella ändringar till den publika sajten?")) {
      return;
    }

    setPublicerar(true);
    setMeddelande({ typ: "info", text: "Initierar publiceringspipeline och verifierar byggkedjan …" });

    startTransition(async () => {
      const idempotencyKey = `pub-${Date.now()}`;
      const res = await begarPubliceringAction(idempotencyKey);
      if (res.ok) {
        setMeddelande({
          typ: "framgang",
          text: `Publicering lyckades! Release ${res.activeReleaseId} har aktiverats. ${res.publishedCount ?? 0} poster uppdaterades.`,
        });
        await laddaData();
      } else {
        setMeddelande({
          typ: "fel",
          text: res.error || "Publiceringen misslyckades. Befintlig aktiv version förblir intakt.",
        });
      }
      setPublicerar(false);
    });
  }

  function hanteraAterstall(draft: EditorialDraftRecord) {
    if (!draft.history || draft.history.length <= 1) {
      alert("Det finns ingen tidigare revision att återställa till.");
      return;
    }
    const tidigareRev = draft.draftRevision - 1;
    const orsak = prompt(
      `Ange orsak för återställning av »${draft.title}« till revision ${tidigareRev}:`,
      "Återställning efter redaktionell granskning"
    );
    if (!orsak) return;

    startTransition(async () => {
      const res = await aterstallUtkastAction({
        domain: draft.domain,
        id: draft.id,
        targetRevision: tidigareRev,
        reason: orsak,
      });

      if (res.ok) {
        setMeddelande({
          typ: "framgang",
          text: `»${draft.title}« har återställts till revision ${tidigareRev}.`,
        });
        await laddaData();
      } else {
        setMeddelande({
          typ: "fel",
          text: res.error || "Kunde inte återställa posten.",
        });
      }
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Meddelandebanner */}
      {meddelande && (
        <div
          role="alert"
          className={`p-3.5 border text-[0.8rem] leading-relaxed flex items-center justify-between ${
            meddelande.typ === "framgang"
              ? "bg-emerald-50 border-emerald-600 text-emerald-950"
              : meddelande.typ === "fel"
              ? "bg-red-50 border-red-600 text-red-950"
              : "bg-amber-50 border-amber-600 text-amber-950"
          }`}
        >
          <span>{meddelande.text}</span>
          <button
            type="button"
            onClick={() => setMeddelande(null)}
            className="nano underline ml-4 hover:opacity-75"
          >
            Stäng
          </button>
        </div>
      )}

      {/* Huvudöversikt: Publiceringscentral */}
      <section className="border border-ink bg-panel p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/30 pb-4">
          <div>
            <span className="nano opacity-60">Etapp CF09 · Publiceringsmodell</span>
            <h2 className="font-serif text-[1.4rem] leading-tight mt-0.5">
              Samlad webbredaktion & publiceringscentral
            </h2>
            <p className="text-[0.75rem] leading-relaxed opacity-75 mt-1 max-w-2xl">
              Autosparade utkast isoleras automatiskt från publika läsare tills de godkänns och publiceras.
              Publiceringen bygger deterministiskt och aktiverar alla 8 Cloudflare Pages-delprojekt atomärt.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <button
              type="button"
              onClick={hanteraPublicera}
              disabled={publicerar || isPending}
              className={`micro px-4 py-2 border border-ink text-paper transition-all ${
                publicerar || isPending
                  ? "bg-ink/50 cursor-not-allowed"
                  : "bg-ink hover:bg-ink/80 active:translate-y-0.5"
              }`}
            >
              {publicerar ? "Bygger & driftsätter …" : "Publicera webbplatsen"}
            </button>
            <div className="flex items-center gap-2 nano opacity-70">
              <span>Månadskvot:</span>
              <strong className="font-mono">
                {oversikt?.monthlyBuildCount ?? 0}/{oversikt?.monthlyBuildQuota ?? 28}
              </strong>
              <span>körningar</span>
            </div>
          </div>
        </div>

        {/* Statusrutor för aktiv release & väntande ändringar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-ink/20 p-3 bg-paper">
            <span className="nano opacity-50 block">Aktiv publik release</span>
            <span className="font-mono text-[0.8rem] font-bold block truncate" title={oversikt?.activeReleaseId}>
              {oversikt?.activeReleaseId ?? "Hämtar …"}
            </span>
            <span className="text-[0.68rem] opacity-65 block mt-0.5">
              100 % statisk distribution från edge
            </span>
          </div>

          <div className="border border-ink/20 p-3 bg-paper">
            <span className="nano opacity-50 block">Opublicerade utkast</span>
            <span className="text-[1.2rem] font-serif font-bold text-amber-900 block">
              {oversikt?.totalUnpublishedCount ?? 0}
            </span>
            <span className="text-[0.68rem] opacity-65 block mt-0.5">
              Väntar på granskning/publicering
            </span>
          </div>

          <div className="border border-ink/20 p-3 bg-paper">
            <span className="nano opacity-50 block">Separation & RLS</span>
            <span className="text-[0.8rem] font-medium text-emerald-900 block">
              ✓ 0 publika DB-anrop
            </span>
            <span className="text-[0.68rem] opacity-65 block mt-0.5">
              Utkast skyddade mot data- och sökläckage
            </span>
          </div>
        </div>
      </section>

      {/* De 6 innehållsdomänerna */}
      <section className="flex flex-col gap-3">
        <h3 className="font-serif text-[1.15rem]">Innehållsdomäner ({oversikt ? Object.keys(oversikt.domains).length : 6})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {oversikt &&
            Object.entries(oversikt.domains).map(([domainKey, d]) => (
              <div
                key={domainKey}
                className={`border p-3.5 flex flex-col justify-between transition-colors ${
                  valdDoman === domainKey
                    ? "border-ink bg-panel ring-1 ring-ink"
                    : "border-ink/30 bg-panel hover:border-ink"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[0.95rem]">{d.domainName}</span>
                    {d.unpublishedCount > 0 ? (
                      <span className="nano bg-amber-100 border border-amber-500 text-amber-950 px-1.5 py-0.5">
                        {d.unpublishedCount} utkast
                      </span>
                    ) : (
                      <span className="nano bg-emerald-50 border border-emerald-400 text-emerald-900 px-1.5 py-0.5">
                        Synkad
                      </span>
                    )}
                  </div>
                  <span className="text-[0.7rem] opacity-70">
                    Totalt {d.totalCount} poster · {d.draftRevisionsCount} samlade revisioner
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-ink/15">
                  <button
                    type="button"
                    onClick={() => setValdDoman(domainKey as EditorialDomain)}
                    className="nano underline opacity-80 hover:opacity-100"
                  >
                    Visa utkast
                  </button>
                  <Link
                    href={DOMAIN_LINKS[domainKey as EditorialDomain]?.href || "/admin"}
                    className="nano border border-ink/40 px-2 py-0.5 bg-paper hover:bg-ink hover:text-paper transition-colors"
                  >
                    Öppna yta →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Utkasttabell och revisionshistorik */}
      <section className="border border-ink bg-panel p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-[1.15rem]">
              Redaktionella utkast & sparade revisioner
            </h3>
            <span className="nano opacity-65">
              {valdDoman === "alla" ? "Visar samtliga domäner" : `Filtrerat på domän: ${valdDoman}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValdDoman("alla")}
              className={`nano px-2.5 py-1 border border-ink ${
                valdDoman === "alla" ? "bg-ink text-paper" : "bg-paper hover:opacity-75"
              }`}
            >
              Alla
            </button>
            <button
              type="button"
              onClick={laddaData}
              disabled={laddar}
              className="nano px-2.5 py-1 border border-ink bg-paper hover:opacity-75 disabled:opacity-40"
            >
              Uppdatera
            </button>
          </div>
        </div>

        {laddar ? (
          <div className="p-8 text-center body-mono text-[0.8rem] opacity-60">
            Laddar redaktionsregister …
          </div>
        ) : drafts.length === 0 ? (
          <div className="p-8 text-center body-mono text-[0.8rem] opacity-60">
            Inga sparade utkast hittades.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[0.75rem]">
              <thead>
                <tr className="border-b border-ink/40 bg-ink/5 nano opacity-80">
                  <th className="p-2">Domän</th>
                  <th className="p-2">Titel / Post-ID</th>
                  <th className="p-2">Sparad av</th>
                  <th className="p-2">Revision</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Sparad tid</th>
                  <th className="p-2 text-right">Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((d) => (
                  <tr key={`${d.domain}-${d.id}`} className="border-b border-ink/15 hover:bg-ink/[0.02]">
                    <td className="p-2">
                      <span className="nano font-mono bg-paper border border-ink/30 px-1 py-0.5">
                        {d.domain}
                      </span>
                    </td>
                    <td className="p-2 font-medium">
                      <span title={d.id}>{d.title}</span>
                      {d.sourceCitation && (
                        <span className="block text-[0.65rem] opacity-60 truncate max-w-xs">
                          Källa: {d.sourceCitation}
                        </span>
                      )}
                    </td>
                    <td className="p-2 opacity-80">{d.savedBy}</td>
                    <td className="p-2 font-mono">
                      <span>rev {d.draftRevision}</span>
                      {d.publishedRevision && (
                        <span className="opacity-50 text-[0.68rem] block">
                          (pub: rev {d.publishedRevision})
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {d.dirty ? (
                        <span className="nano bg-amber-100 border border-amber-600 text-amber-950 px-1.5 py-0.5 font-bold">
                          Opublicerad
                        </span>
                      ) : (
                        <span className="nano bg-emerald-50 border border-emerald-500 text-emerald-900 px-1.5 py-0.5">
                          Publicerad
                        </span>
                      )}
                    </td>
                    <td className="p-2 opacity-70">
                      {d.savedAt ? new Date(d.savedAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={DOMAIN_LINKS[d.domain]?.href || "/"}
                          className="nano underline opacity-75 hover:opacity-100"
                        >
                          Visa
                        </Link>
                        {d.history && d.history.length > 1 && (
                          <button
                            type="button"
                            onClick={() => hanteraAterstall(d)}
                            className="nano border border-ink/40 px-1.5 py-0.5 bg-paper hover:bg-ink hover:text-paper transition-colors"
                            title="Återställ till föregående revision"
                          >
                            Återställ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
