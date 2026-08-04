/** Rena typer utan serverberoenden — kan importeras även av klientkomponenter. */

export type NodeKind = "folder" | "doc";

export interface Node {
  /** Databas-id. Saknas när innehållet läses från filerna i data/. */
  id?: string;
  slug: string;
  title: string;
  kind: NodeKind;
  /** Kort beskrivning, visas som kommentar i trädvyn. */
  note?: string;
  children?: Node[];
}

export interface Crumb {
  title: string;
  href: string;
}

export const ROTNAMN: Record<string, string> = {
  grammatik: "Grammatik",
  texter: "Texter",
};
