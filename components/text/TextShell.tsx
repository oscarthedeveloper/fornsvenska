"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Crumb } from "@/lib/typer";
import type { Textdokument } from "@/lib/text";
import { bytNamn, sparaInnehall } from "@/lib/actions";
import { useAdmin } from "@/components/admin/AdminContext";
import TextView from "./TextView";

export default function TextShell({
  nodId,
  initial,
  sidebar,
  crumbs,
  syskon,
  titel,
  note,
}: {
  nodId?: string;
  initial: Textdokument | null;
  sidebar: React.ReactNode;
  crumbs: Crumb[];
  syskon: {
    prev: { title: string; href: string } | null;
    next: { title: string; href: string } | null;
  };
  titel: string;
  note?: string;
}) {
  const { redigerar, setStatus, setFelmeddelande } = useAdmin();
  const [dok, setDok] = useState<Textdokument | null>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDok(initial);
  }, [nodId, initial]);

  const spara = useCallback(
    async (nytt: Textdokument) => {
      if (!nodId) {
        setStatus("fel");
        setFelmeddelande("Dokumentet saknar id — kör seed-skriptet först.");
        return;
      }
      setStatus("sparar");
      const svar = await sparaInnehall(nodId, nytt);
      if (svar.ok) {
        setStatus("sparat");
        setFelmeddelande(null);
      } else {
        setStatus("fel");
        setFelmeddelande(svar.fel ?? "Okänt fel");
      }
    },
    [nodId, setStatus, setFelmeddelande]
  );

  const andra = useCallback(
    (nytt: Textdokument) => {
      setDok(nytt);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void spara(nytt), 800);
    },
    [spara]
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <TextView
      dokument={dok}
      sidebar={sidebar}
      crumbs={crumbs}
      syskon={syskon}
      titel={titel}
      note={note}
      redigerbar={redigerar}
      onChange={andra}
      onTitel={(t) => {
        if (nodId) void bytNamn(nodId, t);
      }}
      onSkapa={() => {
        const nytt: Textdokument = {
          titel,
          underrubrik: note ?? "",
          meta: [],
          sektioner: [{ meningar: [{ fsv: "", tolkning: "" }] }],
          fotnoter: [],
          utkast: true,
        };
        setDok(nytt);
        void spara(nytt);
      }}
    />
  );
}
