import { GRAMMATIK_DOKUMENT } from "@/data/dokument";
import type { Block, Dokument } from "@/lib/dokument";

function blockreferenser(block: Block[]): number[] {
  return block.flatMap((del) => [
    ...(del.kallor ?? []),
    ...(del.typ === "flikar"
      ? del.flikar.flatMap((flik) => blockreferenser(flik.block))
      : []),
  ]);
}

export function dokumentetsKallID(dokument: Dokument): string[] {
  const anvandaNummer = new Set([
    ...(dokument.ingressKallor ?? []),
    ...(dokument.citat?.kallor ?? []),
    ...blockreferenser(dokument.block),
  ]);

  return [
    ...new Set(
      dokument.fotnoter
        .filter((not) => anvandaNummer.has(not.id) && not.kallaId)
        .map((not) => not.kallaId as string)
    ),
  ];
}

export function grammatikartiklarForKalla(kallaId: string) {
  return Object.entries(GRAMMATIK_DOKUMENT)
    .filter(([, dokument]) => dokumentetsKallID(dokument).includes(kallaId))
    .map(([sokvag, dokument]) => ({
      sokvag,
      titel: dokument.titel,
      href: `/grammatik/${sokvag}`,
    }));
}

