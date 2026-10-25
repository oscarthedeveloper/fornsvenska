/**
 * Datalagret för arkivet.
 *
 * Två källor: Supabase när nycklarna finns i miljön, annars filerna i data/.
 * Vyerna vet inget om vilken som används. Trädet hämtas i en enda fråga och
 * byggs i minnet — det är litet, och slipper då en fråga per nivå.
 */
import { cache } from "react";
import { GRAMMATIK } from "@/data/grammatik";
import { TEXTER } from "@/data/texter";
import { GRAMMATIK_DOKUMENT } from "@/data/dokument";
import { TEXTER_DOKUMENT } from "@/data/textdokument";
import type { Dokument } from "@/lib/dokument";
import type { Textdokument } from "@/lib/text";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { skapaPublikServerKlient } from "@/lib/supabase/server";
import { ROTNAMN, type Crumb, type Node, type NodeKind } from "@/lib/typer";

export type { Crumb, Node, NodeKind };

const FILTRAD: Record<string, Node[]> = {
  grammatik: GRAMMATIK,
  texter: TEXTER,
};

interface Rad {
  id: string;
  parent_id: string | null;
  slug: string;
  title: string;
  kind: NodeKind;
  note: string | null;
  position: number;
}

function byggTrad(rader: Rad[]): Node[] {
  const noder = new Map<string, Node>();
  const barn = new Map<string | null, Node[]>();

  for (const rad of rader) {
    noder.set(rad.id, {
      id: rad.id,
      slug: rad.slug,
      title: rad.title,
      kind: rad.kind,
      note: rad.note ?? undefined,
    });
  }

  for (const rad of rader) {
    const lista = barn.get(rad.parent_id) ?? [];
    lista.push(noder.get(rad.id)!);
    barn.set(rad.parent_id, lista);
  }

  for (const rad of rader) {
    const nod = noder.get(rad.id)!;
    const mina = barn.get(rad.id);
    if (mina?.length) nod.children = mina;
  }

  return barn.get(null) ?? [];
}

/**
 * Avgör om arkivträdet och dokumentinnehållet ska hämtas från Supabase eller
 * från de kanoniska filerna i data/.
 *
 * Som standard läses arkivet från filerna i data/ (data/grammatik.ts,
 * data/dokument.ts, data/texter.ts, data/textdokument.ts) så att alla commits och
 * etapper som pushas till GitHub omedelbart publiceras på Netlify.
 *
 * Vill man tvinga läsning från Supabase sätter man NEXT_PUBLIC_DATA_SOURCE=supabase.
 */
const ANVAND_SUPABASE_ARKIV =
  HAR_SUPABASE && process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase";

/** Hela trädet för en rot. Cachas per förfrågan. */
export const getRoot = cache(async (root: string): Promise<Node[]> => {
  if (!ANVAND_SUPABASE_ARKIV) return FILTRAD[root] ?? [];

  try {
    const supabase = skapaPublikServerKlient();
    const { data, error } = await supabase
      .from("nodes")
      .select("id, parent_id, slug, title, kind, note, position")
      .eq("root", root)
      .order("position", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return FILTRAD[root] ?? [];

    return byggTrad(data as Rad[]);
  } catch (fel) {
    console.warn(`[arkiv] kunde inte läsa ${root} från Supabase, använder filerna:`, fel);
    return FILTRAD[root] ?? [];
  }
});

export async function getRootTitle(root: string): Promise<string> {
  return ROTNAMN[root] ?? root;
}

/** Hämtar noden på en sökväg, t.ex. ["substantiv", "fyrkasussystemet"]. */
export async function getNode(root: string, path: string[]): Promise<Node | null> {
  let nodes = await getRoot(root);
  let found: Node | null = null;

  for (const segment of path) {
    const next: Node | undefined = nodes.find((n) => n.slug === segment);
    if (!next) return null;
    found = next;
    nodes = next.children ?? [];
  }

  return found;
}

/** Innehållet i en mapp — eller rotens innehåll när sökvägen är tom. */
export async function getChildren(root: string, path: string[]): Promise<Node[]> {
  if (path.length === 0) return getRoot(root);
  const node = await getNode(root, path);
  return node?.children ?? [];
}

export async function getBreadcrumbs(root: string, path: string[]): Promise<Crumb[]> {
  const crumbs: Crumb[] = [{ title: await getRootTitle(root), href: `/${root}` }];
  let nodes = await getRoot(root);

  path.forEach((segment, i) => {
    const node = nodes.find((n) => n.slug === segment);
    if (!node) return;
    crumbs.push({ title: node.title, href: `/${root}/${path.slice(0, i + 1).join("/")}` });
    nodes = node.children ?? [];
  });

  return crumbs;
}

/** Räknar mappar och dokument på alla nivåer under en nodlista. */
export function countTree(nodes: Node[]): { folders: number; docs: number } {
  return nodes.reduce(
    (acc, node) => {
      if (node.kind === "folder") {
        acc.folders += 1;
        const inner = countTree(node.children ?? []);
        acc.folders += inner.folders;
        acc.docs += inner.docs;
      } else {
        acc.docs += 1;
      }
      return acc;
    },
    { folders: 0, docs: 0 }
  );
}

/**
 * Samlar alla befintliga sökvägar (mappar och dokument) för en given rot,
 * inklusive den tomma roten [] för arkivets rotvy.
 */
export async function getAllPaths(root: string): Promise<string[][]> {
  const tree = await getRoot(root);
  const paths: string[][] = [[]];

  function samla(nodes: Node[], prefix: string[]) {
    for (const node of nodes) {
      const current = [...prefix, node.slug];
      paths.push(current);
      if (node.children && node.children.length > 0) {
        samla(node.children, current);
      }
    }
  }

  samla(tree, []);
  return paths;
}


/** Innehåll (JSONB) för ett dokument, oavsett rot. */
async function hamtaInnehall<T>(
  root: string,
  path: string[],
  filkalla: Record<string, T>
): Promise<T | null> {
  if (ANVAND_SUPABASE_ARKIV) {
    const nod = await getNode(root, path);
    if (nod?.id) {
      try {
        const supabase = skapaPublikServerKlient();
        const { data, error } = await supabase
          .from("nodes")
          .select("content")
          .eq("id", nod.id)
          .maybeSingle();

        if (error) throw error;
        if (data?.content) return data.content as T;
      } catch (fel) {
        console.warn("[arkiv] kunde inte läsa dokumentinnehåll:", fel);
      }
    }
  }

  return filkalla[path.join("/")] ?? null;
}

export async function getDocument(root: string, path: string[]): Promise<Dokument | null> {
  if (root !== "grammatik") return null;
  return hamtaInnehall<Dokument>(root, path, GRAMMATIK_DOKUMENT);
}

export async function getTextDocument(
  root: string,
  path: string[]
): Promise<Textdokument | null> {
  if (root !== "texter") return null;
  return hamtaInnehall<Textdokument>(root, path, TEXTER_DOKUMENT);
}

/** Syskonnoder till en sökväg — används för föregående/nästa i dokumentfoten. */
export async function getSiblings(
  root: string,
  path: string[]
): Promise<{
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
}> {
  if (path.length === 0) return { prev: null, next: null };

  const parentPath = path.slice(0, -1);
  const syskon = await getChildren(root, parentPath);
  const i = syskon.findIndex((n) => n.slug === path[path.length - 1]);

  const href = (slug: string) => `/${[root, ...parentPath, slug].join("/")}`;

  return {
    prev: i > 0 ? { title: syskon[i - 1].title, href: href(syskon[i - 1].slug) } : null,
    next:
      i >= 0 && i < syskon.length - 1
        ? { title: syskon[i + 1].title, href: href(syskon[i + 1].slug) }
        : null,
  };
}
