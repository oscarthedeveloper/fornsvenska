import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";
import ResursBibliotek from "@/components/resurser/ResursBibliotek";
import { hamtaBibliotek } from "@/lib/resurser";

export const revalidate = 86400; // 24 timmar ISR med omedelbar on-demand revalidering vid redigering

export const metadata: Metadata = {
  title: "Resursbibliotek — litteratur och skrifter",
  description:
    "Läroböcker, examensarbeten, avhandlingar och medeltida skrifter om fornsvenska, med besked om hur tillgängligt varje material är.",
  alternates: {
    canonical: "/resurser",
  },
};

export default async function ResursPage() {
  const bibliotek = await hamtaBibliotek();

  return (
    <SiteFrame centre="Resursbibliotek — katalog" active="/resurser">
      <ResursBibliotek initial={bibliotek} />
    </SiteFrame>
  );
}
