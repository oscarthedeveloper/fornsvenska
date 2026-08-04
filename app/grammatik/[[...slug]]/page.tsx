import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import ArkivSida from "@/components/arkiv/ArkivSida";
import DocShell from "@/components/dokument/DocShell";
import DocSidebar from "@/components/dokument/DocSidebar";
import {
  getBreadcrumbs,
  getDocument,
  getNode,
  getRoot,
  getRootTitle,
  getSiblings,
} from "@/lib/archive";

const ROOT = "grammatik";

export const dynamic = "force-dynamic";

export default async function GrammatikPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const path = params.slug ?? [];
  const node = path.length ? await getNode(ROOT, path) : null;

  if (path.length && !node) notFound();

  const rootTitle = await getRootTitle(ROOT);
  const title = node ? node.title : rootTitle;

  if (node?.kind === "doc") {
    const [dokument, tree, syskon, crumbs] = await Promise.all([
      getDocument(ROOT, path),
      getRoot(ROOT),
      getSiblings(ROOT, path),
      getBreadcrumbs(ROOT, path),
    ]);

    return (
      <SiteFrame centre={`Grammatik — ${node.title}`} active="/grammatik">
        <DocShell
          nodId={node.id}
          initial={dokument}
          sidebar={
            <DocSidebar
              tree={tree}
              root={ROOT}
              rootTitle={rootTitle}
              currentPath={path}
            />
          }
          crumbs={crumbs}
          syskon={syskon}
          titel={node.title}
          note={node.note}
        />
      </SiteFrame>
    );
  }

  return (
    <SiteFrame
      centre={path.length ? `Grammatik — ${title}` : "Grammatik — arkiv"}
      active="/grammatik"
    >
      <ArkivSida root={ROOT} path={path} title={title} />
    </SiteFrame>
  );
}
