import type { Metadata } from "next";
import SiteFrame from "@/components/SiteFrame";
import Boklasare from "@/components/resurser/Boklasare";

export const metadata: Metadata = {
  title: "Äldre Västgötalagen — bokvy | Fornsvenska.se",
  description:
    "Läs hela Äldre Västgötalagen i maskintext, uppslag för uppslag, efter Cod. Holm. B 59.",
};

export default function VastgotalagenPage() {
  return (
    <SiteFrame centre="Resursbibliotek — bokvy" active="/resurser">
      <Boklasare />
    </SiteFrame>
  );
}
