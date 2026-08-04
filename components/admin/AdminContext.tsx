"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Sparstatus = "vilande" | "sparar" | "sparat" | "fel";

interface AdminLage {
  arAdmin: boolean;
  redigerar: boolean;
  setRedigerar: (v: boolean) => void;
  status: Sparstatus;
  setStatus: (s: Sparstatus) => void;
  felmeddelande: string | null;
  setFelmeddelande: (f: string | null) => void;
}

const Kontext = createContext<AdminLage>({
  arAdmin: false,
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
  arAdmin,
  children,
}: {
  arAdmin: boolean;
  children: React.ReactNode;
}) {
  const [redigerar, setRedigerar] = useState(false);
  const [status, setStatus] = useState<Sparstatus>("vilande");
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);

  const varde = useMemo(
    () => ({
      arAdmin,
      redigerar: arAdmin && redigerar,
      setRedigerar,
      status,
      setStatus,
      felmeddelande,
      setFelmeddelande,
    }),
    [arAdmin, redigerar, status, felmeddelande]
  );

  return <Kontext.Provider value={varde}>{children}</Kontext.Provider>;
}
