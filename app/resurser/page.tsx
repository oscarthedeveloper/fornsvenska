import SiteFrame from "@/components/SiteFrame";
import ResursBibliotek from "@/components/resurser/ResursBibliotek";
import { hamtaBibliotek } from "@/lib/resurser";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resursbibliotek — Fornsvenska Studielabbet",
  description:
    "Läroböcker, examensarbeten, avhandlingar och medeltida skrifter om fornsvenska, med besked om hur tillgängligt varje material är.",
};

export default async function ResursPage() {
  const bibliotek = await hamtaBibliotek();

  return (
    <SiteFrame centre="Resursbibliotek — katalog" active="/resurser">
      <ResursBibliotek initial={bibliotek} />
    </SiteFrame>
  );
}
