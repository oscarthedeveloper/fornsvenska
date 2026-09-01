"use client";

import { useEffect, useState } from "react";

const LAGRINGSNYCKEL = "fornsvenska-konstruktionsbadge-stangd-v1";

/** Tillfälligt globalt meddelande. Avfärdningen sparas bara i besökarens webbläsare. */
export default function ConstructionBadge() {
  const [synlig, setSynlig] = useState(false);

  useEffect(() => {
    try {
      setSynlig(localStorage.getItem(LAGRINGSNYCKEL) !== "1");
    } catch {
      setSynlig(true);
    }
  }, []);

  const stang = () => {
    try {
      localStorage.setItem(LAGRINGSNYCKEL, "1");
    } catch {
      /* Privat läge kan neka lagring — badgen ska ändå gå att stänga. */
    }
    setSynlig(false);
  };

  if (!synlig) return null;

  return (
    <aside
      className="konstruktionsbadge"
      role="status"
      aria-label="Information om pågående hemsidearbete"
    >
      <div className="konstruktionsbadge-status">
        <span className="konstruktionsbadge-signal" aria-hidden="true" />
        <span>Tillfälligt meddelande</span>
        <button type="button" onClick={stang} aria-label="Stäng meddelandet">
          Stäng <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="konstruktionsbadge-innehall">
        <p className="display">Hemsidearbete pågår</p>
        <p>
          Observera att hemsidan är under konstruktion och att innehållet
          därmed är ofullständigt.
        </p>
      </div>
    </aside>
  );
}
