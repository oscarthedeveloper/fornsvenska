import Link from "next/link";
import type { Node } from "@/lib/typer";

/**
 * Den kompakta sidebaren.
 *
 * Den syns ENDAST inne i ett dokument, och finns där för att visa var man
 * är — inte som huvudsakligt sätt att navigera. Arkivet är fortfarande
 * vägen in i materialet.
 */
function Rows({
  nodes,
  root,
  parents,
  depth,
  current,
}: {
  nodes: Node[];
  root: string;
  parents: string[];
  depth: number;
  current: string;
}) {
  return (
    <>
      {nodes.map((node) => {
        const path = [...parents, node.slug];
        const key = path.join("/");
        const href = `/${[root, ...path].join("/")}`;
        const arCurrent = key === current;

        return (
          <div key={key}>
            <Link
              href={href}
              className="doc-tree-row"
              data-kind={node.kind}
              data-current={arCurrent ? "1" : undefined}
              aria-current={arCurrent ? "page" : undefined}
            >
              {Array.from({ length: depth }).map((_, i) => (
                <span key={i} className="doc-tree-guide" aria-hidden="true" />
              ))}
              <span aria-hidden="true">{node.kind === "folder" ? "▸" : "·"}</span>
              <span className="overflow-hidden text-ellipsis">
                {node.title}
                {node.kind === "folder" ? "/" : ""}
              </span>
            </Link>
            {node.children?.length ? (
              <Rows
                nodes={node.children}
                root={root}
                parents={path}
                depth={depth + 1}
                current={current}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default function DocSidebar({
  tree,
  root,
  currentPath,
  rootTitle,
}: {
  tree: Node[];
  root: string;
  currentPath: string[];
  rootTitle: string;
}) {
  return (
    <aside className="doc-sidebar hidden lg:flex flex-col w-[236px] shrink-0 border-r border-ink self-stretch">
      <div className="sticky top-0 max-h-screen overflow-y-auto">
        <div className="bg-accent text-ink flex items-center justify-between px-2 h-[26px] sticky top-0">
          <span className="nano">{rootTitle}</span>
          <span className="nano opacity-70">Dokument</span>
        </div>
        <nav aria-label="Dokumentträd" className="py-2 pl-2">
          <Rows
            nodes={tree}
            root={root}
            parents={[]}
            depth={0}
            current={currentPath.join("/")}
          />
        </nav>
      </div>
    </aside>
  );
}
