import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";
import OrdbokKlient from "@/components/ordbok/OrdbokKlient";
import {
  hamtaBokstavsStatistik,
  hamtaOrdbokPost,
  hamtaRelateradeUppslagsord,
  sokOrdbok,
} from "@/lib/ordbok/ordbokServer";
import {
  ORDBOK_LAS_FRAN_SUPABASE,
  hamtaBokstavsStatistikDb,
  hamtaOrdbokPostDb,
  sokOrdbokDb,
} from "@/lib/ordbok/ordbokDb";
import type { OrdbokKallfilter, OrdbokSoklage } from "@/lib/ordbok/typer";

export const metadata: Metadata = {
  title: "Ordbok — Söderwalls fornsvenska ordbok · Fornsvenska Studielabbet",
  description:
    "Sökbar utgåva av K. F. Söderwalls Ordbok öfver svenska medeltids-språket (1884–1918) och Supplementet (1925–1973) baserad på Språkbankens digitala LMF-resurser (CC BY 4.0).",
};

export default async function OrdbokPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    mode?: string;
    letter?: string;
    dataset?: string;
    page?: string;
    entry?: string;
  };
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const mode: OrdbokSoklage =
    searchParams?.mode === "artikeltext" ? "artikeltext" : "uppslagsord";
  const dataset: OrdbokKallfilter =
    searchParams?.dataset === "soederwall" ||
    searchParams?.dataset === "soederwall-supp"
      ? searchParams.dataset
      : "alla";
  const page = searchParams?.page ? Number.parseInt(searchParams.page, 10) || 1 : 1;
  const letter =
    typeof searchParams?.letter === "string"
      ? searchParams.letter
      : q.trim()
        ? undefined
        : "A";

  let felmeddelande: string | null = null;
  let sokResultat = null;
  let bokstavsStatistik = null;
  let valdPost = null;
  let relaterade = null;
  let mobilVisarArtikel = false;

  try {
    if (ORDBOK_LAS_FRAN_SUPABASE) {
      bokstavsStatistik = await hamtaBokstavsStatistikDb();
      sokResultat = await sokOrdbokDb({
        q,
        mode,
        letter,
        dataset,
        page,
        pageSize: 40,
      });

      const explicitEntryId =
        typeof searchParams?.entry === "string" && searchParams.entry.trim()
          ? searchParams.entry.trim()
          : null;

      if (explicitEntryId) {
        valdPost = await hamtaOrdbokPostDb(explicitEntryId);
        if (valdPost) {
          mobilVisarArtikel = true;
        }
      }

      if (!valdPost && sokResultat.hits.length > 0) {
        valdPost = await hamtaOrdbokPostDb(sokResultat.hits[0].id);
      }

      if (valdPost) {
        relaterade = hamtaRelateradeUppslagsord(valdPost);
      }
    } else {
      bokstavsStatistik = hamtaBokstavsStatistik();
      sokResultat = sokOrdbok({
        q,
        mode,
        letter,
        dataset,
        page,
        pageSize: 40,
      });

      const explicitEntryId =
        typeof searchParams?.entry === "string" && searchParams.entry.trim()
          ? searchParams.entry.trim()
          : null;

      if (explicitEntryId) {
        valdPost = hamtaOrdbokPost(explicitEntryId);
        if (valdPost) {
          mobilVisarArtikel = true;
        }
      }

      if (!valdPost && sokResultat.hits.length > 0) {
        valdPost = hamtaOrdbokPost(sokResultat.hits[0].id);
      }

      if (valdPost) {
        relaterade = hamtaRelateradeUppslagsord(valdPost);
      }
    }
  } catch (err) {
    felmeddelande =
      err instanceof Error
        ? err.message
        : "Ett oväntat fel uppstod vid läsning av ordboksdata.";
  }

  return (
    <SiteFrame
      centre="ORDBOK · K. F. SÖDERWALL (1884–1973)"
      active="/ordbok"
    >
      {felmeddelande || !sokResultat || !bokstavsStatistik ? (
        <div className="p-8 max-w-2xl mx-auto my-8 border border-ink bg-panel flex flex-col gap-3">
          <h1 className="display text-[1.6rem]">Ordboken kunde inte laddas</h1>
          <p className="micro opacity-80">{felmeddelande}</p>
          <p className="micro opacity-65">
            Kontrollera att <code>Källor/soederwall.xml</code> och{" "}
            <code>Källor/soederwall-supp.xml</code> finns på plats och kör{" "}
            <code>npm run import:ordbok</code>.
          </p>
        </div>
      ) : (
        <OrdbokKlient
          sokResultat={sokResultat}
          bokstavsStatistik={bokstavsStatistik}
          valdPost={valdPost}
          relaterade={relaterade}
          mobilVisarArtikel={mobilVisarArtikel}
        />
      )}
    </SiteFrame>
  );
}
