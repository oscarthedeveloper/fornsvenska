"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { skapaKlient } from "@/lib/supabase/client";
import { anvandarnamnTillEpost } from "@/lib/supabase/config";

export default function LoginForm() {
  const router = useRouter();
  const [anvandarnamn, setAnvandarnamn] = useState("");
  const [losenord, setLosenord] = useState("");
  const [fel, setFel] = useState<string | null>(null);
  const [pagar, setPagar] = useState(false);

  async function skicka(e: React.FormEvent) {
    e.preventDefault();
    setFel(null);
    setPagar(true);

    const supabase = skapaKlient();
    const { error } = await supabase.auth.signInWithPassword({
      email: anvandarnamnTillEpost(anvandarnamn),
      password: losenord,
    });

    setPagar(false);

    if (error) {
      setFel(
        error.message === "Invalid login credentials"
          ? "Fel användarnamn eller lösenord."
          : error.message
      );
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={skicka} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="nano opacity-60">Användarnamn</span>
        <input
          type="text"
          value={anvandarnamn}
          onChange={(e) => setAnvandarnamn(e.target.value)}
          autoComplete="username"
          required
          className="border border-ink bg-paper px-3 py-2 text-[0.8rem] outline-none focus:bg-panel"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="nano opacity-60">Lösenord</span>
        <input
          type="password"
          value={losenord}
          onChange={(e) => setLosenord(e.target.value)}
          autoComplete="current-password"
          required
          className="border border-ink bg-paper px-3 py-2 text-[0.8rem] outline-none focus:bg-panel"
        />
      </label>

      {fel && (
        <p className="text-[0.68rem] leading-[1.5] border border-ink bg-accent px-3 py-2">
          {fel}
        </p>
      )}

      <button
        type="submit"
        disabled={pagar}
        className="micro bg-ink text-paper px-4 py-2.5 transition-opacity duration-[140ms] hover:opacity-80 disabled:opacity-50"
      >
        {pagar ? "Loggar in …" : "Logga in"}
      </button>
    </form>
  );
}
