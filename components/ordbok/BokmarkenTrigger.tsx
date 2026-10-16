"use client";

import { useEffect, useState } from "react";
import {
  BOKMARKEN_HANDELSE,
  hamtaSparadeOrd,
} from "@/lib/ordbok/bokmarken";
import BokmarkenPanel from "./BokmarkenPanel";

export default function BokmarkenTrigger({
  label = "Min ordlista",
  visaNoll = false,
  className = "",
}: {
  label?: string;
  visaNoll?: boolean;
  className?: string;
}) {
  const [antal, setAntal] = useState(0);
  const [panelOppen, setPanelOppen] = useState(false);

  useEffect(() => {
    setAntal(hamtaSparadeOrd().length);

    const onAndring = () => {
      setAntal(hamtaSparadeOrd().length);
    };

    window.addEventListener(BOKMARKEN_HANDELSE, onAndring);
    return () => window.removeEventListener(BOKMARKEN_HANDELSE, onAndring);
  }, []);

  if (antal === 0 && !visaNoll) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setPanelOppen(true)}
        title="Öppna min sparade ordlista och glosor"
        className={`nano inline-flex items-center gap-1.5 px-2.5 py-1 border border-ink transition-colors ${
          antal > 0
            ? "bg-paper text-ink hover:bg-ink hover:text-paper"
            : "bg-panel text-ink/70 hover:bg-paper"
        } ${className}`}
      >
        <span
          className={`leading-none ${antal > 0 ? "text-accent" : "opacity-40"}`}
          aria-hidden="true"
        >
          ★
        </span>
        <span>{label}</span>
        {antal > 0 && (
          <span className="bg-ink text-paper text-[0.54rem] px-1 py-0.2 rounded-[1px] ml-0.5">
            {antal}
          </span>
        )}
      </button>

      <BokmarkenPanel oppen={panelOppen} onStang={() => setPanelOppen(false)} />
    </>
  );
}
