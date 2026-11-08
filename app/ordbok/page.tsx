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

export const revalidate = 86400; // 24 timmar ISR för ordbokssökning

export const metadata: Metadata = {
  title: "Ordbok — Söderwalls fornsvenska ordbok",
  description:
    "Sökbar utgåva av K. F. Söderwalls Ordbok öfver svenska medeltids-språket (1884–1918) och Supplementet (1925–1973) med 41 744 uppslagsord baserad på Språkbankens digitala LMF-resurser.",
  alternates: {
    canonical: "/ordbok",
  },
};

export default function OrdbokPage() {
  // Query parameters are consumed in the browser; this shell is prerenderable.
  const bokstavsStatistik = hamtaBokstavsStatistik();
  const sokResultat = sokOrdbok({ q: "", letter: "A", mode: "uppslagsord", dataset: "alla", page: 1, pageSize: 40 });
  const felmeddelande = null;
  const valdPost = null;
  const relaterade = null;
  const mobilVisarArtikel = false;
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
