import type { MetadataRoute } from "next";

/**
 * Robots.txt-konfiguration för Fornsvenska.se.
 *
 * Principiella regler (S06):
 * - Tillåter Google och andra sökmotorer att genomsöka publika sidor.
 * - Spärrar /api/ för onödig indexering.
 * - Administrativa sidor (/admin, /admin/runor) styrs via noindex-meta i HTML,
 *   så att Google kan läsa noindex-direktivet och avindexera sidorna.
 * - På förhandsgranskningar (Netlify deploy-preview / branch-deploy) spärras
 *   all genomsökning för att förhindra duplicerad indexering av testmiljöer.
 */
export default function robots(): MetadataRoute.Robots {
  const isNetlifyPreview =
    Boolean(process.env.CONTEXT && process.env.CONTEXT !== "production");

  if (isNetlifyPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      "https://www.fornsvenska.se/sitemap.xml",
      "https://www.fornsvenska.se/sitemap/0.xml",
      "https://www.fornsvenska.se/sitemap/1.xml",
      "https://www.fornsvenska.se/sitemap/2.xml",
    ],
  };
}
