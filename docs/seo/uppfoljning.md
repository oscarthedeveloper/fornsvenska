# Uppföljningsprotokoll och förvaltningsrutin (S17, S18, S19, S20)

Datum för etablering: 2026-10-25  
Referens: [`docs/seo/GOOGLE_GENOMFORANDEPLAN.md`](./GOOGLE_GENOMFORANDEPLAN.md)

---

## 1. Aktuell genomförandestatus

För att hålla isär olika ansvarsnivåer och driftfaser redovisas statusen i fyra tydliga kategorier:

| Nivå | Status | Beskrivning |
|---|---|---|
| **1. Lokalt implementerat & verifierat** | **100 % Klart** | S01–S16 genomförda. Automatisk sitemap index, robots.txt, metadataBase, canonicals, unika metadata för Texter/Grammatik/Ordbok och tester verifierade i produktionsbygge. |
| **2. Driftsatt på Netlify** | **Inväntar driftsättning** | Netlify-kontot har kvotvarning (146k/125k serveranrop). Ändringarna är redo att checkas in och driftsättas så snart användaren auktoriserar eller ny period inträder. |
| **3. Inskickat till Search Console** | **Ej utfört** | Sitemapen `https://www.fornsvenska.se/sitemap.xml` ska skickas in via Search Console-gränssnittet efter driftsättning. |
| **4. Faktiskt observerat i Google** | **Baslinje från 2026-10-25** | 1 indexerad sida (`https://www.fornsvenska.se/`), 54 exponeringar, 1 klick, CTR 1,9 %, position 12,9. |

---

## 2. Inlämningsrutin vid driftsättning (S17)

När koden är driftsatt på Netlify ska följande steg utföras:

1. **Produktionsverifiering:**
   - Kontrollera att `curl -sI https://www.fornsvenska.se/robots.txt` svarar 200 OK och listar sitemaps.
   - Kontrollera att `curl -sI https://www.fornsvenska.se/sitemap.xml` svarar 200 OK med `<sitemapindex>`.
   - Kontrollera att `curl -sI https://www.fornsvenska.se/sitemap/0.xml` svarar 200 OK och innehåller 280 URL:er.
2. **Search Console Sitemap-inlämning:**
   - Logga in på [Google Search Console – Webbplatskartor](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Afornsvenska.se).
   - Lägg till ny webbplatskarta: `sitemap.xml`.
   - Bekräfta status: Status ska visa "Lyckades" (Success).
3. **URL Inspection av nyckeladresser (stickprov):**
   - Inspektera `https://www.fornsvenska.se/grammatik`.
   - Inspektera `https://www.fornsvenska.se/texter`.
   - Inspektera `https://www.fornsvenska.se/ordbok/soederwall--bonde-nn.1`.
   - Begär indexering (Request Indexing) för samlingssidorna `/grammatik` och `/texter` för att påskynda Googles upptäckt av undersidorna.

> [!IMPORTANT]
> **Undvik massinlämning av ordboksposter i URL Inspection:**  
> Begär inte manuell indexering för enskilda ordboksord en och en. Låt Googlebot arbeta igenom delkartorna `/sitemap/1.xml` och `/sitemap/2.xml` i sin egen takt.

---

## 3. Uppföljningsschema (S18 & S19)

### Kontrollpunkt 1: Dag +7 (ca 1 nov 2026)
- **Sitemap-status:** Kontrollera att Google har bearbetat `sitemap.xml` och läst in delkartorna utan XML-valideringsfel.
- **Antal upptäckta sidor:** Notera om antalet upptäckta sidor i indexeringsrapporten har ökat från 1 till > 200.
- **Serverfel / Crawl:** Kontrollera att inga 5xx-fel eller brutna omdirigeringar rapporterats.

### Kontrollpunkt 2: Dag +14 (ca 8 nov 2026)
- **Indexering:** Följ upp antalet gröna "Indexerade" sidor för `/grammatik/...` och `/texter/...`.
- **Google-vald canonical:** Inspektera en textartikel och en grammatikartikel för att bekräfta att Google respekterar den deklarerade canonical-adressen på `https://www.fornsvenska.se/...`.

### Kontrollpunkt 3: Dag +28 (ca 22 nov 2026)
- **Resultatrapport (Prestanda):**
  - Jämför exponeringar och klick mot baslinjen (54 exp, 1 klick).
  - Identifiera vilka nya sökfrågor som börjat generera exponeringar (t.ex. specifika fornsvenska grammatikbegrepp, landskapslagar, fornsvenska ord).
  - Skilj sid- och frågespecifik CTR från den globala genomsnittssiffran.

---

## 4. Förvaltningsrutin för framtida artiklar (S20)

När en redaktör eller utvecklare lägger till nya artiklar i projektet:
1. **Grammatik:** Läggs till i `data/grammatik.ts` och `data/dokument.ts`. Sidan inkluderas automatiskt i `/sitemap/0.xml` och får omedelbart unik titel, beskrivning och canonical.
2. **Texter:** Läggs till i `data/texter.ts` och `data/textdokument.ts`. Sidan inkluderas automatiskt i `/sitemap/0.xml`.
3. **Ordbok:** Uppdateringar i `data/ordbok/poster.json` genererar automatiskt rätt sitemap-delkarta och unika metadata.
