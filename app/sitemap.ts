import type { MetadataRoute } from "next";
import {
  hamtaAntalOrdbokSitemaps,
  hamtaOrdbokSitemapPoster,
  hamtaRedaktionellaSitemapPoster,
} from "@/lib/sitemapData";

/**
 * Dynamiskt/statiskt genererad Sitemap Index för Fornsvenska.se (S07).
 *
 * id: 0 -> Samtliga 280 kanoniska redaktionella URL:er (startsida, texter, grammatik, resurser, ordbok)
 * id: 1..N -> Ordbokens 41 744 poster uppdelade i hanterbara delkartor (< 25 000 URL:er per delkarta).
 */
export async function generateSitemaps() {
  const antalOrdbok = hamtaAntalOrdbokSitemaps();
  const sitemaps: Array<{ id: number }> = [{ id: 0 }];
  for (let i = 0; i < antalOrdbok; i++) {
    sitemaps.push({ id: i + 1 });
  }
  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  if (id === 0) {
    return hamtaRedaktionellaSitemapPoster();
  }

  const chunkIndex = id - 1;
  return hamtaOrdbokSitemapPoster(chunkIndex);
}
