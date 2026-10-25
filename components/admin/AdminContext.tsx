"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaKlient } from "@/lib/supabase/client";

export type Sparstatus = "vilande" | "sparar" | "sparat" | "fel";

interface AdminLage {
  arAdmin: boolean;
  anvandarnamn: string | null;
  redigerar: boolean;
  setRedigerar: (v: boolean) => void;
  status: Sparstatus;
  setStatus: (s: Sparstatus) => void;
  felmeddelande: string | null;
  setFelmeddelande: (f: string | null) => void;
}

const Kontext = createContext<AdminLage>({
  arAdmin: false,
  anvandarnamn: null,
  redigerar: false,
  setRedigerar: () => {},
  status: "vilande",
  setStatus: () => {},
  felmeddelande: null,
  setFelmeddelande: () => {},
});

export function useAdmin() {
  return useContext(Kontext);
}

export default function AdminProvider({
  children,
  arAdmin: initialArAdmin = false,
  anvandarnamn: initialAnvandarnamn = null,
}: {
  children: React.ReactNode;
  arAdmin?: boolean;
  anvandarnamn?: string | null;
}) {
  const [arAdmin, setArAdmin] = useState(initialArAdmin);
  const [anvandarnamn, setAnvandarnamn] = useState<string | null>(initialAnvandarnamn);
  const [redigerar, setRedigerar] = useState(false);
  const [status, setStatus] = useState<Sparstatus>("vilande");
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);

  useEffect(() => {
    if (!HAR_SUPABASE) return;

    let avbruten = false;
    const supabase = skapaKlient();

    async function synkaSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (!avbruten) {
            setArAdmin(false);
            setAnvandarnamn(null);
          }
          return;
        }

        const { data: adminRad } = await supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!avbruten) {
          const ar = Boolean(adminRad);
          setArAdmin(ar);
          setAnvandarnamn(ar ? session.user.email?.split("@")[0] ?? null : null);
        }
      } catch {
        if (!avbruten) {
          setArAdmin(false);
          setAnvandarnamn(null);
        }
      }
    }

    synkaSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setArAdmin(false);
        setAnvandarnamn(null);
        setRedigerar(false);
      } else {
        synkaSession();
      }
    });

    return () => {
      avbruten = true;
      subscription.unsubscribe();
    };
  }, []);

  const varde = useMemo(
    () => ({
      arAdmin,
      anvandarnamn,
      redigerar: arAdmin && redigerar,
      setRedigerar,
      status,
      setStatus,
      felmeddelande,
      setFelmeddelande,
    }),
    [arAdmin, anvandarnamn, redigerar, status, felmeddelande]
  );

  return <Kontext.Provider value={varde}>{children}</Kontext.Provider>;
}
