import { hamtaKalla } from "@/data/kallor";
import type { Kallhanvisning } from "@/lib/kallor";

export function formateraKallhanvisning(hanvisning: Kallhanvisning): string {
  if (!hanvisning.kallaId) return hanvisning.text ?? "Ofullständig källhänvisning";

  const kalla = hamtaKalla(hanvisning.kallaId);
  if (!kalla) {
    return `${hanvisning.kallaId}${hanvisning.lokalisering ? `, ${hanvisning.lokalisering}` : ""}`;
  }

  return [
    kalla.bibliografi,
    hanvisning.lokalisering,
    hanvisning.kommentar,
  ]
    .filter(Boolean)
    .join(" ");
}

export function kortKallhanvisning(hanvisning: Kallhanvisning): string {
  if (!hanvisning.kallaId) return hanvisning.text ?? `Källa ${hanvisning.id}`;
  const kalla = hamtaKalla(hanvisning.kallaId);
  const namn = kalla?.forfattare[0]?.split(" ").at(-1) ?? hanvisning.kallaId;
  const ar = kalla?.ar ? ` ${kalla.ar}` : "";
  const plats = hanvisning.lokalisering ? `, ${hanvisning.lokalisering}` : "";
  return `${namn}${ar}${plats}`;
}

