"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
  sparadRevision: number | null;
  setSparadRevision: (r: number | null) => void;
  publiceradRevision: number | null;
  setPubliceradRevision: (r: number | null) => void;
  harOpubliceradeAndringar: boolean;
  setHarOpubliceradeAndringar: (b: boolean) => void;
  forhandsgranskning: boolean;
  setForhandsgranskning: (b: boolean) => void;
  konfliktVarning: string | null;
  setKonfliktVarning: (k: string | null) => void;
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
  sparadRevision: null,
  setSparadRevision: () => {},
  publiceradRevision: null,
  setPubliceradRevision: () => {},
  harOpubliceradeAndringar: false,
  setHarOpubliceradeAndringar: () => {},
  forhandsgranskning: false,
  setForhandsgranskning: () => {},
  konfliktVarning: null,
  setKonfliktVarning: () => {},
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
  const pathname = usePathname();
  const [arAdmin, setArAdmin] = useState(initialArAdmin);
  const [anvandarnamn, setAnvandarnamn] = useState<string | null>(initialAnvandarnamn);
  const [redigerar, setRedigerar] = useState(false);
  const [status, setStatus] = useState<Sparstatus>("vilande");
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);
  const [sparadRevision, setSparadRevision] = useState<number | null>(null);
  const [publiceradRevision, setPubliceradRevision] = useState<number | null>(null);
  const [harOpubliceradeAndringar, setHarOpubliceradeAndringar] = useState(false);
  const [forhandsgranskning, setForhandsgranskning] = useState(false);
  const [konfliktVarning, setKonfliktVarning] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STATIC_DELIVERY !== '0' && !pathname.startsWith('/admin')) {
      setArAdmin(false); setRedigerar(false);
      return;
    }
    if (!HAR_SUPABASE) return;

    // Snabbkontroll: gör endast nätverksanrop om klienten har auth-kaka/token
    // eller befinner sig på administrativ yta (admin.* eller /admin).
    // Förhindrar 100 % av anonyma läsarförfrågningar till Supabase.
    if (typeof window !== "undefined") {
      const isAdminHostOrPath =
        window.location.hostname.startsWith("admin.") ||
        window.location.pathname.startsWith("/admin");
      const harAuthKaka = document.cookie.includes("sb-");
      let harStorageToken = false;
      try {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase.auth"))) {
            harStorageToken = true;
            break;
          }
        }
      } catch {
        // Ignorera localStorage-fel i strikt läge
      }

      if (!isAdminHostOrPath && !harAuthKaka && !harStorageToken) {
        return;
      }
    }

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
  }, [pathname]);

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
      sparadRevision,
      setSparadRevision,
      publiceradRevision,
      setPubliceradRevision,
      harOpubliceradeAndringar,
      setHarOpubliceradeAndringar,
      forhandsgranskning,
      setForhandsgranskning,
      konfliktVarning,
      setKonfliktVarning,
    }),
    [
      arAdmin,
      anvandarnamn,
      redigerar,
      status,
      felmeddelande,
      sparadRevision,
      publiceradRevision,
      harOpubliceradeAndringar,
      forhandsgranskning,
      konfliktVarning,
    ]
  );

  return <Kontext.Provider value={varde}>{children}</Kontext.Provider>;
}
