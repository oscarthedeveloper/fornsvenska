"use client";

import Link from "next/link";
import type { Node } from "@/lib/typer";

interface Row {
  node: Node;
  depth: number;
  href: string;
}

function flatten(
  nodes: Node[],
  hrefFor: (path: string[]) => string,
  parents: string[] = [],
  depth = 0
): Row[] {
  return nodes.flatMap((node) => {
    const path = [...parents, node.slug];
    const row: Row = { node, depth, href: hrefFor(path) };
    return node.children?.length
      ? [row, ...flatten(node.children, hrefFor, path, depth + 1)]
      : [row];
  });
}

function NodeIcon({ kind }: { kind: Node["kind"] }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true" className="shrink-0">
      <rect
        x="0.5"
        y="0.5"
        width="8"
        height="8"
        fill={kind === "folder" ? "var(--ink)" : "none"}
        stroke="var(--ink)"
      />
    </svg>
  );
}

/**
 * Alternativvyn: hela hierarkin som ett träd, med noterna i en egen
 * kolumn till höger. Aldrig förvald — arkivvyn är utgångspunkten.
 */
export default function TreeView({
  items,
  hrefFor,
  title,
}: {
  items: Node[];
  hrefFor: (path: string[]) => string;
  title: string;
}) {
  const rows = flatten(items, hrefFor);

  return (
    <div className="w-full max-w-[960px] mx-auto border border-ink bg-panel p-[1.4rem]">
      <div className="tree-row border-b border-dashed border-ink pb-2 mb-2">
        <span className="micro">{title}/</span>
        <span className="nano text-right opacity-50">Innehåll</span>
      </div>

      {rows.map((row) => (
        <Link key={row.href} href={row.href} className="tree-row">
          <span className="flex items-center gap-2 min-w-0">
            {Array.from({ length: row.depth }).map((_, i) => (
              <span key={i} className="tree-guide" aria-hidden="true" />
            ))}
            <NodeIcon kind={row.node.kind} />
            <span className="tree-name truncate">
              {row.node.title}
              {row.node.kind === "folder" ? "/" : ""}
            </span>
          </span>
          <span className="tree-note text-right truncate">
            {row.node.note ? `# ${row.node.note}` : ""}
          </span>
        </Link>
      ))}
    </div>
  );
}
