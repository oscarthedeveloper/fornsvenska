import test from "node:test";
import assert from "node:assert/strict";
import {
  hamtaRedaktionellaSitemapPoster,
  hamtaAntalOrdbokSitemaps,
  hamtaOrdbokSitemapPoster,
} from "../lib/sitemapData.ts";
import {
  genereraWebSiteJsonLd,
  genereraBreadcrumbJsonLd,
} from "../lib/seo.ts";

test("SEO S07: Redaktionell sitemap innehåller exakt 280 kanoniska sidor", () => {
  const poster = hamtaRedaktionellaSitemapPoster();
  assert.equal(poster.length, 280, "Ska innehålla exakt 280 kanoniska sidor");

  const unikaUrls = new Set(poster.map((p) => p.url));
  assert.equal(unikaUrls.size, 280, "Inga duplicerade URL:er får finnas");

  for (const p of poster) {
    assert.ok(
      p.url.startsWith("https://www.fornsvenska.se"),
      `URL ${p.url} måste använda fastställd domän https://www.fornsvenska.se`
    );
    assert.ok(!p.url.includes("/admin"), `Admin-sidor får inte finnas i sitemap: ${p.url}`);
    assert.ok(!p.url.endsWith("/kallor"), `Alias /kallor får inte finnas i sitemap: ${p.url}`);
    assert.ok(
      p.url !== "https://www.fornsvenska.se/runor" &&
        !p.url.startsWith("https://www.fornsvenska.se/runor/"),
      `Ej driftsatta runor får inte finnas i sitemap: ${p.url}`
    );
  }
});

test("SEO S07: Ordbokens sitemap-delkartor delar upp 41 744 poster under 25 000 gränsen", () => {
  const antal = hamtaAntalOrdbokSitemaps();
  assert.equal(antal, 2, "41 744 poster ska delas upp i 2 delkartor");

  const chunk0 = hamtaOrdbokSitemapPoster(0);
  assert.equal(chunk0.length, 25000, "Första delkartan ska innehålla 25 000 poster");

  const chunk1 = hamtaOrdbokSitemapPoster(1);
  assert.equal(chunk1.length, 16744, "Andra delkartan ska innehålla resterande 16 744 poster");
  assert.equal(chunk0.length + chunk1.length, 41744, "Totalt ska alla 41 744 poster täckas");

  for (const p of chunk0.slice(0, 10)) {
    assert.ok(p.url.startsWith("https://www.fornsvenska.se/ordbok/"));
  }
});

test("SEO S14: WebSite JSON-LD producerar giltig strukturerad data", () => {
  const json = genereraWebSiteJsonLd();
  assert.equal(json["@context"], "https://schema.org");
  assert.equal(json["@type"], "WebSite");
  assert.equal(json.url, "https://www.fornsvenska.se");
  assert.equal(json.name, "Fornsvenska.se");
  assert.ok(json.description.length > 20);
});

test("SEO S14: BreadcrumbList JSON-LD producerar korrekta positioner och absoluta URL:er", () => {
  const crumbs = [
    { label: "Grammatik", href: "/grammatik" },
    { label: "Substantiv", href: "/grammatik/substantiv" },
    { label: "Nominativ", href: "/grammatik/substantiv/fyrkasussystemet/nominativ" },
  ];

  const json = genereraBreadcrumbJsonLd(crumbs);
  assert.ok(json);
  assert.equal(json["@type"], "BreadcrumbList");
  assert.equal(json.itemListElement.length, 3);
  assert.equal(json.itemListElement[0].position, 1);
  assert.equal(json.itemListElement[0].name, "Grammatik");
  assert.equal(json.itemListElement[0].item, "https://www.fornsvenska.se/grammatik");

  assert.equal(json.itemListElement[2].position, 3);
  assert.equal(json.itemListElement[2].name, "Nominativ");
  assert.equal(json.itemListElement[2].item, "https://www.fornsvenska.se/grammatik/substantiv/fyrkasussystemet/nominativ");
});
