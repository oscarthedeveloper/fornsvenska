/**
 * SEO- och strukturerad data-hjälpare för Fornsvenska.se (S14).
 *
 * Principer:
 * - Endast faktabaserad, synlig information märks upp (WebSite, BreadcrumbList).
 * - Inga fabricerade recensioner, betyg eller fiktiva publiceringsdatum.
 * - Korrekta absoluta URL:er med fastställd domän (https://www.fornsvenska.se).
 */

const BASE_URL = "https://www.fornsvenska.se";

export function genereraWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fornsvenska.se",
    alternateName: "Fornsvenska Studielabbet",
    url: BASE_URL,
    description:
      "Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov.",
    inLanguage: "sv",
    publisher: {
      "@type": "Organization",
      name: "Fornsvenska Studielabbet",
      url: BASE_URL,
    },
  };
}

export interface BreadcrumbItem {
  label?: string;
  title?: string;
  href: string;
}

export function genereraBreadcrumbJsonLd(crumbs: BreadcrumbItem[]) {
  if (!crumbs || crumbs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => {
      const fullUrl = crumb.href.startsWith("http")
        ? crumb.href
        : `${BASE_URL}${crumb.href.startsWith("/") ? "" : "/"}${crumb.href}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label || crumb.title || "",
        item: fullUrl,
      };
    }),
  };
}

