import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import ArkivSida from "@/components/arkiv/ArkivSida";
import TextShell from "@/components/text/TextShell";
import DocSidebar from "@/components/dokument/DocSidebar";
import {
  getAllPaths,
  getBreadcrumbs,
  getNode,
  getRoot,
  getRootTitle,
  getSiblings,
  getTextDocument,
} from "@/lib/archive";
import { genereraBreadcrumbJsonLd } from "@/lib/seo";

const ROOT = "texter";

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
      title: "Fornsvenska textarkivet — lagar, urkunder och runinskrifter",
      description:
        "Källkritiska utgåvor av fornsvenska texter med diplomatisk text, normaliserad fornsvenska, modern översättning och filologiska kommentarer.",
      alternates: {
        canonical: "/texter",
      },
      openGraph: {
        title: "Fornsvenska textarkivet — lagar, urkunder och runinskrifter | Fornsvenska.se",
        description:
          "Källkritiska utgåvor av fornsvenska texter med diplomatisk text, normaliserad fornsvenska, modern översättning och filologiska kommentarer.",
        url: "https://www.fornsvenska.se/texter",
        siteName: "Fornsvenska.se",
        type: "website",
      },
    };
  }

  const node = await getNode(ROOT, path);
  if (!node) {
    return {
      title: "Texten hittades inte",
      robots: { index: false, follow: false },
    };
  }

  const kanoniskUrl = `/texter/${path.join("/")}`;

  if (node.kind === "folder") {
    const titel = `${node.title} — Texter`;
    const beskrivning = node.note
      ? `${node.note}. Källkritiska fornsvenska utgåvor och handskriftsmaterial.`
      : `Fornsvenska källtexter och utgåvor inom kategorin ${node.title.toLowerCase()}.`;

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

  const dokument = await getTextDocument(ROOT, path);
  const textTitel = dokument?.titel || node.title;
  const textUnderrubrik = dokument?.underrubrik ? ` – ${dokument.underrubrik}` : "";
  const titel = `${textTitel}${textUnderrubrik}`;

  let beskrivning = "";
  if (dokument?.ingress) {
    const renad = dokument.ingress.replace(/\s+/g, " ").trim();
    beskrivning =
      renad.length > 150
        ? renad.slice(0, 147).replace(/\s+\S*$/, "") + "…"
        : renad;
  } else if (node.note) {
    beskrivning = `${node.note}. Källkritisk fornsvensk textutgåva med översättning och analys.`;
  } else {
    beskrivning = `Källkritisk utgåva av ${textTitel} med diplomatisk transkribering, normalisering och svensk översättning.`;
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

    const breadcrumbJsonLd = genereraBreadcrumbJsonLd(crumbs);

    return (
      <SiteFrame centre={`Texter — ${node.title}`} active="/texter">
        {breadcrumbJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd),
            }}
          />
        )}
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
