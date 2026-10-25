import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import OrdbokArtikelVy from "@/components/ordbok/OrdbokArtikelVy";
import OrdbokKallochKvalitetsruta from "@/components/ordbok/OrdbokKallochKvalitetsruta";
import { byggOrdbokQueryString } from "@/lib/ordbok/url";
import {
  hamtaOrdbokPost,
  hamtaRelateradeUppslagsord,
} from "@/lib/ordbok/ordbokServer";
import {
  ORDBOK_LAS_FRAN_SUPABASE,
  hamtaOrdbokPostDb,
} from "@/lib/ordbok/ordbokDb";
import type { OrdbokKallfilter, OrdbokSoklage } from "@/lib/ordbok/typer";

export const revalidate = 86400; // 24 timmar ISR för ordboksartiklar

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const post = ORDBOK_LAS_FRAN_SUPABASE
      ? await hamtaOrdbokPostDb(params.id)
      : hamtaOrdbokPost(params.id);
    if (!post) {
      return {
        title: "Ordbokspost hittades inte | Fornsvenska.se",
        robots: { index: false, follow: false },
      };
    }
    const band =
      post.sourceDataset === "soederwall"
        ? "Söderwalls huvudverk"
        : "Söderwalls supplement";

    let sammanfattning = "";
    if (post.modernDefinition?.kortForklaring) {
      sammanfattning = post.modernDefinition.kortForklaring;
    } else if (post.modernDefinition?.modernGlos?.length) {
      sammanfattning = `Betydelse: ${post.modernDefinition.modernGlos.join(", ")}.`;
    } else if (post.articlePlainText) {
      const renad = post.articlePlainText.replace(/\s+/g, " ").trim();
      sammanfattning =
        renad.length > 130
          ? renad.slice(0, 127).replace(/\s+\S*$/, "") + "…"
          : renad;
    }

    const ordklasser =
      post.partOfSpeech && post.partOfSpeech.length > 0
        ? ` (${post.partOfSpeech.join(", ")})`
        : "";

    const titelText = `${post.headwordDisplay}${
      post.homonymNumber ? ` (${post.homonymNumber})` : ""
    } — ${band}`;

    const beskrivning = sammanfattning
      ? `${sammanfattning} Fornsvenskt uppslagsord i ${band}${ordklasser}.`
      : `Uppslagsordet ${post.headwordDisplay} i ${band}${ordklasser}. Källbelägg och fornsvensk ordbokstext.`;

    const kanoniskUrl = `/ordbok/${encodeURIComponent(params.id)}`;

    return {
      title: titelText,
      description: beskrivning.slice(0, 160),
      alternates: {
        canonical: kanoniskUrl,
      },
      openGraph: {
        title: `${titelText} | Fornsvenska.se`,
        description: beskrivning.slice(0, 160),
        url: `https://www.fornsvenska.se${kanoniskUrl}`,
        siteName: "Fornsvenska.se",
        type: "article",
      },
    };
  } catch {
    return { title: "Ordbok | Fornsvenska.se" };
  }
}

export default async function OrdbokArtikelPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    q?: string;
    mode?: string;
    letter?: string;
    dataset?: string;
    page?: string;
  };
}) {
  const post = ORDBOK_LAS_FRAN_SUPABASE
    ? await hamtaOrdbokPostDb(params.id)
    : hamtaOrdbokPost(params.id);
  if (!post) {
    notFound();
  }

  const relaterade = hamtaRelateradeUppslagsord(post);

  const q = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const mode: OrdbokSoklage | undefined =
    searchParams?.mode === "artikeltext" ? "artikeltext" : undefined;
  const dataset: OrdbokKallfilter | undefined =
    searchParams?.dataset === "soederwall" ||
    searchParams?.dataset === "soederwall-supp"
      ? searchParams.dataset
      : undefined;
  const page = searchParams?.page ? Number.parseInt(searchParams.page, 10) || 1 : undefined;
  const letter =
    typeof searchParams?.letter === "string"
      ? searchParams.letter
      : !q
        ? post.letterSection
        : undefined;

  const sokKontextQuery = byggOrdbokQueryString({
    q,
    mode,
    letter,
    dataset,
    page,
  });

  const tillbakaHref = `/ordbok${ byggOrdbokQueryString({
    q,
    mode,
    letter,
    dataset,
    page,
    entry: post.id,
  }) }`;

  return (
    <SiteFrame
      centre={`ORDBOK · ${post.headwordDisplay.toUpperCase()} (${post.kallaId})`}
      active="/ordbok"
    >
      <div className="flex-1 flex flex-col p-[1.2rem] sm:p-[2rem] lg:p-[2.6rem] max-w-[1040px] w-full mx-auto gap-5">
        <nav
          aria-label="Brödsmulor och återgång till ordbokssökning"
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={tillbakaHref}
              className="border border-ink bg-panel px-3 py-1.5 micro hover:bg-ink hover:text-paper transition-colors"
            >
              ← Tillbaka till ordboken
              {q ? ` (sökning »${q}»)` : ` (bokstav ${post.letterSection})`}
            </Link>
            <span className="nano opacity-45">/</span>
            <span className="nano opacity-75">
              {post.sourceDataset === "soederwall" ? "Huvudverket" : "Supplementet"}
            </span>
            <span className="nano opacity-45">/</span>
            <span className="nano font-semibold">{post.headwordDisplay}</span>
          </div>

          <span className="nano opacity-60">
            Beständig adress: <code>/ordbok/{post.id}</code>
          </span>
        </nav>

        <OrdbokArtikelVy
          post={post}
          sammaUppslagsordHuvudverk={relaterade.sammaUppslagsordHuvudverk}
          sammaUppslagsordSupplement={relaterade.sammaUppslagsordSupplement}
          grannarISektion={relaterade.grannarISektion}
          sokKontextQuery={sokKontextQuery}
          standalone
        />

        <OrdbokKallochKvalitetsruta />
      </div>
    </SiteFrame>
  );
}
