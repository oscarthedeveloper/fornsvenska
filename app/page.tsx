import type { Metadata } from "next";
import Startsida from "@/components/start/Startsida";
import { hamtaStartinnehall } from "@/lib/sidor";
import { genereraWebSiteJsonLd } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    absolute: "Fornsvenska – texter, ordbok och grammatik | Fornsvenska.se",
  },
  description:
    "Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const innehall = await hamtaStartinnehall();
  const websiteJsonLd = genereraWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Startsida initial={innehall} />
    </>
  );
}
