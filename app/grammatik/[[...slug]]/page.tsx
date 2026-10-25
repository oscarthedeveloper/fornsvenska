import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import ArkivSida from "@/components/arkiv/ArkivSida";
import DocShell from "@/components/dokument/DocShell";
import DocSidebar from "@/components/dokument/DocSidebar";
import {
  getAllPaths,
  getBreadcrumbs,
  getDocument,
  getNode,
  getRoot,
  getRootTitle,
  getSiblings,
} from "@/lib/archive";
import { genereraBreadcrumbJsonLd } from "@/lib/seo";

const ROOT = "grammatik";

export const revalidate = 604800; // 7 dagar ISR med on-demand revalidering vid redigering
export const dynamicParams = true; // Tillåt nya noder skapade i databasen att renderas och cachas on-demand

export async function generateStaticParams() {
  const paths = await getAllPaths(ROOT);
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const path = params.slug ?? [];

  if (path.length === 0) {
    return {
      title: "Fornsvensk grammatik — ljudlära, böjningslära och syntax",
      description:
        "Systematisk grammatik över fornsvenskan i 193 artiklar och 38 mappar. Ljudlagar, fyrkasussystemet, starka och svaga verb, ordföljd och historisk språkutveckling.",
      alternates: {
        canonical: "/grammatik",
      },
      openGraph: {
        title: "Fornsvensk grammatik — ljudlära, böjningslära och syntax | Fornsvenska.se",
        description:
          "Systematisk grammatik över fornsvenskan i 193 artiklar och 38 mappar. Ljudlagar, fyrkasussystemet, starka och svaga verb, ordföljd och historisk språkutveckling.",
        url: "https://www.fornsvenska.se/grammatik",
        siteName: "Fornsvenska.se",
        type: "website",
      },
    };
  }

  const node = await getNode(ROOT, path);
  if (!node) {
    return {
      title: "Sidan hittades inte",
      robots: { index: false, follow: false },
    };
  }

  const kanoniskUrl = `/grammatik/${path.join("/")}`;

  if (node.kind === "folder") {
    const titel = `${node.title} — Grammatik`;
    const beskrivning = node.note
      ? `${node.note}. Översikt och grammatiska artiklar inom ämnesområdet ${node.title.toLowerCase()}.`
      : `Grammatisk ämnesöversikt och artiklar för ${node.title} i fornsvenskan.`;

    return {
      title: titel,
      description: beskrivning.slice(0, 160),
      alternates: {
        canonical: kanoniskUrl,
      },
      openGraph: {
        title: `${titel} | Fornsvenska.se`,
        description: beskrivning.slice(0, 160),
        url: `https://www.fornsvenska.se${kanoniskUrl}`,
        siteName: "Fornsvenska.se",
        type: "website",
      },
    };
  }

  const dokument = await getDocument(ROOT, path);
  const artikelTitel = dokument?.titel || node.title;
  const artikelUnderrubrik = dokument?.underrubrik ? ` – ${dokument.underrubrik}` : "";
  const titel = `${artikelTitel}${artikelUnderrubrik}`;

  let beskrivning = "";
  if (dokument?.ingress) {
    const renad = dokument.ingress.replace(/\s+/g, " ").trim();
    beskrivning =
      renad.length > 150
        ? renad.slice(0, 147).replace(/\s+\S*$/, "") + "…"
        : renad;
  } else if (node.note) {
    beskrivning = `${node.note}. Artikel i fornsvensk grammatik med språkhistorisk analys.`;
  } else {
    beskrivning = `Grammatisk artikel om ${artikelTitel.toLowerCase()} i fornsvenskan med paradigm och källbelägg.`;
  }

  return {
    title: titel,
    description: beskrivning.slice(0, 160),
    alternates: {
      canonical: kanoniskUrl,
    },
    openGraph: {
      title: `${titel} | Fornsvenska.se`,
      description: beskrivning.slice(0, 160),
      url: `https://www.fornsvenska.se${kanoniskUrl}`,
      siteName: "Fornsvenska.se",
      type: "article",
    },
  };
}


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

    const breadcrumbJsonLd = genereraBreadcrumbJsonLd(crumbs);

    return (
      <SiteFrame centre={`Grammatik — ${node.title}`} active="/grammatik">
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd),
            }}
          />
        )}
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
