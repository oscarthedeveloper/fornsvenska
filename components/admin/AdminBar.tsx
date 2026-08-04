"use client";

import Link from "next/link";
import { useAdmin } from "./AdminContext";

const TEXT: Record<string, string> = {
  vilande: "",
  sparar: "Sparar …",
  sparat: "Sparat",
  fel: "Kunde inte spara",
};

/** Fast list längst ned till höger. Syns bara för inloggad administratör. */
export default function AdminBar({ anvandarnamn }: { anvandarnamn: string | null }) {
  const { arAdmin, redigerar, setRedigerar, status, felmeddelande } = useAdmin();

  if (!arAdmin) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex items-stretch border-t border-l border-ink bg-panel">
      {felmeddelande && (
        <span className="nano px-3 flex items-center bg-accent text-ink max-w-[280px] truncate">
          {felmeddelande}
        </span>
      )}

      {status !== "vilande" && !felmeddelande && (
        <span className="nano px-3 flex items-center opacity-60">{TEXT[status]}</span>
      )}

      <span className="nano px-3 flex items-center opacity-50 border-l border-ink">
        {anvandarnamn}
      </span>

      <button
        type="button"
        onClick={() => setRedigerar(!redigerar)}
        aria-pressed={redigerar}
        className={`nano px-4 py-2.5 border-l border-ink transition-opacity duration-[140ms] hover:opacity-70 ${
          redigerar ? "bg-accent text-ink" : "bg-panel text-ink"
        }`}
      >
        {redigerar ? "Redigerar" : "Redigera"}
      </button>

      <Link
        href="/admin"
        className="nano px-3 flex items-center border-l border-ink transition-opacity duration-[140ms] hover:opacity-60"
      >
        Konto
      </Link>
    </div>
  );
}
