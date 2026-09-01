"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TYPER,
  TYPNAMN_FLERTAL,
  type Bibliotek,
  type Resurs,
  type Resurstyp,
} from "@/lib/resurstyper";
import {
  flyttaHylla,
  flyttaResurs,
  skapaHylla,
  skapaResurs,
  sparaHylla,
  sparaResurs,
  taBortHylla,
  taBortResurs,
  type Svar,
} from "@/lib/resursActions";
import { useAdmin } from "@/components/admin/AdminContext";
import Knapp from "@/components/admin/Knapp";
import Hylla from "./Hylla";
import Skriftkammare from "./Skriftkammare";
import SkriftLasare from "./SkriftLasare";
import ResursPanel from "./ResursPanel";

type Filter = Resurstyp | "allt";

/**
 * Resursbiblioteket i sin helhet.
 *
 * Tillståndet ligger här och sparas en kort stund efter senaste ändringen,
 * precis som i dokumentvyn — annars hade varje tangenttryckning blivit en
 * förfrågan. Strukturändringar (ny hylla, borttagen resurs) går i stället
 * direkt och hämtar om sidan, så att positionerna kommer från databasen.
 */
export default function ResursBibliotek({ initial }: { initial: Bibliotek }) {
  const router = useRouter();
  const { redigerar, setStatus, setFelmeddelande } = useAdmin();

  const [bibliotek, setBibliotek] = useState<Bibliotek>(initial);
  const [valdId, setValdId] = useState<string | null>(null);
  const [oppenId, setOppenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("allt");
  const [sok, setSok] = useState("");

  useEffect(() => setBibliotek(initial), [initial]);

  /* På smal skärm ligger panelen under hyllorna. Utan det här ser man inte
     att ett klick gjorde något alls. */
  const panel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!valdId) return;
    if (window.matchMedia("(min-width: 1100px)").matches) return;
    panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [valdId]);

  const vantande = useRef(
    new Map<string, { timer: ReturnType<typeof setTimeout> | null; delar: Record<string, unknown> }>()
  );

  const rapportera = useCallback(
    (svar: Svar) => {
      if (svar.ok) {
        setStatus("sparat");
        setFelmeddelande(null);
      } else {
        setStatus("fel");
        setFelmeddelande(svar.fel ?? "Okänt fel");
      }
    },
    [setStatus, setFelmeddelande]
  );

  /** Kör en strukturändring och hämtar om sidan när den gått igenom. */
  const kor = useCallback(
    async (uppgift: () => Promise<Svar>) => {
      setStatus("sparar");
      const svar = await uppgift();
      rapportera(svar);
      if (svar.ok) router.refresh();
      return svar;
    },
    [rapportera, router, setStatus]
  );

  /** Fördröjd sparning per post, med de ändrade fälten samlade. */
  const sparaSnart = useCallback(
    (nyckel: string, delar: Record<string, unknown>, spara: (d: Record<string, unknown>) => Promise<Svar>) => {
      const post = vantande.current.get(nyckel) ?? { timer: null, delar: {} };
      post.delar = { ...post.delar, ...delar };
      if (post.timer) clearTimeout(post.timer);
      post.timer = setTimeout(async () => {
        const attSpara = post.delar;
        vantande.current.delete(nyckel);
        setStatus("sparar");
        rapportera(await spara(attSpara));
      }, 700);
      vantande.current.set(nyckel, post);
    },
    [rapportera, setStatus]
  );

  useEffect(() => {
    const kvar = vantande.current;
    return () => {
      kvar.forEach((p) => p.timer && clearTimeout(p.timer));
    };
  }, []);

  /* ------------------------------------------------------------ ändringar */

  const andraResurs = (id: string, delar: Partial<Resurs>) => {
    setBibliotek((b) => ({
      ...b,
      hyllor: b.hyllor.map((h) => ({
        ...h,
        resurser: h.resurser.map((r) => (r.id === id ? { ...r, ...delar } : r)),
      })),
      skrifter: b.skrifter.map((r) => (r.id === id ? { ...r, ...delar } : r)),
    }));

    sparaSnart(`resurs:${id}`, delar as Record<string, unknown>, (d) =>
      sparaResurs(id, d as Partial<Resurs>)
    );
  };

  const andraHylla = (id: string, delar: { titel?: string; note?: string }) => {
    setBibliotek((b) => ({
      ...b,
      hyllor: b.hyllor.map((h) => (h.id === id ? { ...h, ...delar } : h)),
    }));

    sparaSnart(`hylla:${id}`, delar as Record<string, unknown>, (d) =>
      sparaHylla(id, d as { titel?: string; note?: string })
    );
  };

  /* ---------------------------------------------------------------- urval */

  const allaResurser = useMemo(
    () => [...bibliotek.hyllor.flatMap((h) => h.resurser), ...bibliotek.skrifter],
    [bibliotek]
  );

  const vald = allaResurser.find((r) => r.id === valdId) ?? null;
  const oppen = bibliotek.skrifter.find((r) => r.id === oppenId) ?? null;

  const matchar = (r: Resurs) => {
    if (filter !== "allt" && r.typ !== filter) return false;
    if (!sok.trim()) return true;
    const n = sok.trim().toLowerCase();
    return [r.titel, r.forfattare, r.utgivare, r.ar, r.beskrivning]
      .filter(Boolean)
      .some((f) => (f as string).toLowerCase().includes(n));
  };

  const hyllor = bibliotek.hyllor
    .map((h) => ({ ...h, resurser: h.resurser.filter(matchar) }))
    .filter((h) => h.resurser.length > 0 || (redigerar && filter === "allt" && !sok));

  const skrifter = bibliotek.skrifter.filter(matchar);
  const visaKammare =
    skrifter.length > 0 || (redigerar && filter === "allt" && !sok) || filter === "skrift";

  const antal = {
    resurser: allaResurser.length,
    hyllor: bibliotek.hyllor.length,
    skrifter: bibliotek.skrifter.length,
  };

  return (
    <div className="resurssida">
      <div className="resursinnehall">
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <h1 className="display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.1]">
                Resursbibliotek
              </h1>
              <p className="nano opacity-50">
                Läroböcker, uppsatser, avhandlingar och skrifter — med besked om
                hur svårt varje sak är att komma över
              </p>
            </div>

            <label className="resurssok">
              <span className="sr-only">Sök i biblioteket</span>
              <input
                type="search"
                value={sok}
                onChange={(e) => setSok(e.target.value)}
                placeholder="Titel, författare, handskrift"
                className="nano"
              />
            </label>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {(["allt", ...TYPER] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                className="chip micro"
                data-vald={filter === f ? "1" : undefined}
                onClick={() => setFilter(f)}
              >
                {f === "allt" ? "Allt" : TYPNAMN_FLERTAL[f]}
              </button>
            ))}
          </div>
        </div>

        {!bibliotek.harDatabas && (
          <p className="nano opacity-55 border border-dashed border-ink px-3 py-2">
            Visar demomaterial. Kör supabase/resursbibliotek.sql så blir
            biblioteket ditt eget och går att redigera.
          </p>
        )}

        {hyllor.map((hylla) => (
          <Hylla
            key={hylla.id}
            hylla={hylla}
            valdId={valdId}
            redigerbar={redigerar}
            onValj={(r) => setValdId(r.id)}
            onHylla={(delar) => andraHylla(hylla.id, delar)}
            onTaBort={() => void kor(() => taBortHylla(hylla.id))}
            onFlytta={(steg) => void kor(() => flyttaHylla(hylla.id, steg))}
            onNyResurs={() =>
              void kor(async () => {
                const svar = await skapaResurs(hylla.id, "larobok");
                if (svar.ok && svar.id) setValdId(svar.id);
                return svar;
              })
            }
          />
        ))}

        {redigerar && (
          <div className="flex gap-1.5">
            <Knapp titel="Lägg till hylla" onClick={() => void kor(() => skapaHylla())}>
              + hylla
            </Knapp>
          </div>
        )}

        {visaKammare && (
          <Skriftkammare
            skrifter={skrifter}
            valdId={valdId}
            oppenId={oppenId}
            redigerbar={redigerar}
            onValj={(r) => setValdId(r.id)}
            onLas={(r) => {
              setValdId(r.id);
              setOppenId(oppenId === r.id ? null : r.id);
            }}
            onNy={() =>
              void kor(async () => {
                const svar = await skapaResurs(null, "skrift");
                if (svar.ok && svar.id) setValdId(svar.id);
                return svar;
              })
            }
          />
        )}

        {oppen && (
          <SkriftLasare
            resurs={oppen}
            redigerbar={redigerar}
            onChange={(delar) => andraResurs(oppen.id, delar)}
            onStang={() => setOppenId(null)}
          />
        )}
      </div>

      <div className="resurspanel-halla" ref={panel}>
        <ResursPanel
          resurs={vald}
          redigerbar={redigerar}
          antal={antal}
          onChange={(delar) => vald && andraResurs(vald.id, delar)}
          onTaBort={() =>
            vald &&
            void kor(async () => {
              const svar = await taBortResurs(vald.id);
              if (svar.ok) {
                setValdId(null);
                if (oppenId === vald.id) setOppenId(null);
              }
              return svar;
            })
          }
          onFlytta={(steg) => vald && void kor(() => flyttaResurs(vald.id, steg))}
          onLas={
            vald?.typ === "skrift"
              ? () => setOppenId(oppenId === vald.id ? null : vald.id)
              : undefined
          }
        />
      </div>
    </div>
  );
}
