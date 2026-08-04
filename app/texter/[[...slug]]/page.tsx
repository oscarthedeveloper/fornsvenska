import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import ArkivSida from "@/components/arkiv/ArkivSida";
import TextShell from "@/components/text/TextShell";
import DocSidebar from "@/components/dokument/DocSidebar";
import {
  getBreadcrumbs,
  getNode,
  getRoot,
  getRootTitle,
  getSiblings,
  getTextDocument,
} from "@/lib/archive";

const ROOT = "texter";

export const dynamic = "force-dynamic";

export default async function TexterPage({
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
      getTextDocument(ROOT, path),
      getRoot(ROOT),
      getSiblings(ROOT, path),
      getBreadcrumbs(ROOT, path),
    ]);

    return (
      <SiteFrame centre={`Texter — ${node.title}`} active="/texter">
        <TextShell
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
      centre={path.length ? `Texter — ${title}` : "Texter — arkiv"}
      active="/texter"
    >
      <ArkivSida root={ROOT} path={path} title={title} />
    </SiteFrame>
  );
}
