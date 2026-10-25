import { hamtaAntalOrdbokSitemaps } from "@/lib/sitemapData";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * Sitemap Index för Fornsvenska.se (S07).
 *
 * Google Search Console och sökmotorer läser /sitemap.xml som indexfil,
 * vilken pekar ut delkartorna genererade av Next.js:
 * - /sitemap/0.xml: Redaktionella sidor (startsida, texter, grammatik, resurser, ordbok)
 * - /sitemap/1.xml..N: Ordbokens 41 744 poster
 */
export async function GET() {
  const antalOrdbok = hamtaAntalOrdbokSitemaps();
  const basUrl = "https://www.fornsvenska.se";

  let sitemapsXml = `  <sitemap>\n    <loc>${basUrl}/sitemap/0.xml</loc>\n  </sitemap>\n`;
  for (let i = 0; i < antalOrdbok; i++) {
    sitemapsXml += `  <sitemap>\n    <loc>${basUrl}/sitemap/${i + 1}.xml</loc>\n  </sitemap>\n`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
