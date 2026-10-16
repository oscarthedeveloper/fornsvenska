import type { OrdbokKallfilter, OrdbokSoklage } from "./typer";

export function byggOrdbokQueryString(params: {
  q?: string;
  mode?: OrdbokSoklage;
  letter?: string | null;
  dataset?: OrdbokKallfilter;
  page?: number;
  entry?: string | null;
}): string {
  const sp = new URLSearchParams();
  if (params.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params.mode && params.mode !== "uppslagsord") sp.set("mode", params.mode);
  if (params.letter && !params.q?.trim()) sp.set("letter", params.letter);
  else if (params.letter && params.q?.trim()) sp.set("letter", params.letter);
  if (params.dataset && params.dataset !== "alla") sp.set("dataset", params.dataset);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  if (params.entry) sp.set("entry", params.entry);

  const str = sp.toString();
  return str ? `?${str}` : "";
}
