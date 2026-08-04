import Breadcrumbs from "./Breadcrumbs";
import ArchiveViews from "./ArchiveViews";
import { countTree, getBreadcrumbs, getChildren, getNode } from "@/lib/archive";

/** Arkivkroppen — delas av Grammatik och Texter. */
export default async function ArkivSida({
  root,
  path,
  title,
}: {
  root: string;
  path: string[];
  title: string;
}) {
  const crumbs = await getBreadcrumbs(root, path);
  const backHref = crumbs.length > 1 ? crumbs[crumbs.length - 2].href : null;
  const items = await getChildren(root, path);
  const counts = countTree(items);
  const nuvarande = path.length ? await getNode(root, path) : null;

  return (
    <div className="px-[1.6rem] py-[2rem] flex flex-col gap-8">
      <Breadcrumbs crumbs={crumbs} backHref={backHref} />
      <ArchiveViews
        items={items}
        title={title}
        basePath={[root, ...path]}
        counts={counts}
        root={root}
        parentId={nuvarande?.id ?? null}
      />
      <p className="nano text-center opacity-45 w-full max-w-[960px] mx-auto">
        Informationen kan inte garanteras vara fullständig — fornsvenskan var
        aldrig ett standardiserat språk
      </p>
    </div>
  );
}
