# S03 – URL Inspection och Search Console-granskning

Datum för baslinje: 2026-10-25  
Domän / Egendom: `sc-domain:fornsvenska.se`  
Status: Baslinjedata dokumenterad; detaljerad URL-inspektion via inloggat gränssnitt kvarstår att mata in vid nästa inloggning.

---

## 1. Fastställd Google-status ur Search Console (2026-10-25)

Baserat på den manuella avläsningen i Search Console 2026-10-25:

| URL / Sida | Status i SC | Senaste crawl | Indexeringsorsak | Deklarerad canonical | Google-vald canonical |
|---|---|---|---|---|---|
| `https://www.fornsvenska.se/` | **Indexerad** | 16–23 okt 2026 (aktiv i sök) | Indexerad | Saknas i HTML | Fastställd av Google som huvudsida |
| `http://fornsvenska.se/` | **Ej indexerad** | 17 okt 2026 | Sida med omdirigering (301) | - | - |
| `https://fornsvenska.se/` | **Ej indexerad** | 17 okt 2026 | Sida med omdirigering (301) | - | - |
| Inskickade sitemaps | Inga inskickade | - | 0 rader | - | - |

---

## 2. Representativ granskningsmatris för Google URL Inspection

Följande 8 representativa adresser har definierats för URL Inspection i Googles Search Console-gränssnitt:

| Typ | URL | Syfte med kontrollen | Lokal/Produktion status (S02) | Kvarstående kontroll i SC UI |
|---|---|---|---|---|
| **Startsida** | `https://www.fornsvenska.se/` | Bekräfta Google-vald canonical och renderad HTML | HTTP 200, komplett | Kontrollera Google-vald canonical |
| **Samling Texter** | `https://www.fornsvenska.se/texter` | Kontrollera om Google känner till samlingssidan | HTTP 200, saknar specifik meta | Känd / Okänd för Google? |
| **Textartikel** | `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen/kristnu-balker-i` | Kontrollera om enskilda lagtexter har upptäckts | HTTP 200, rik text & noter | Känd / Okänd för Google? |
| **Samling Grammatik** | `https://www.fornsvenska.se/grammatik` | Kontrollera om 193-artikelsarkivet upptäckts | HTTP 200, 38 mappar / 193 artiklar | Känd / Okänd för Google? |
| **Grammatikartikel** | `https://www.fornsvenska.se/grammatik/substantiv/fyrkasussystemet/nominativ` | Kontrollera djupindexering i grammatiken | HTTP 200, komplett artikel | Känd / Okänd för Google? |
| **Ordbok startsida** | `https://www.fornsvenska.se/ordbok` | Kontrollera indexering av ordboksöversikt | HTTP 200, specifik meta finns | Känd / Okänd för Google? |
| **Ordboksartikel** | `https://www.fornsvenska.se/ordbok/soederwall--bonde-nn.1` | Kontrollera om ordbokens 41 744 poster upptäcks | HTTP 200, specifik meta finns | Känd / Okänd för Google? |
| **Resursbibliotek** | `https://www.fornsvenska.se/resurser` | Kontrollera bibliotekssidan och litteraturförteckning | HTTP 200, specifik meta finns | Känd / Okänd för Google? |

---

## 3. Isolering av orsakshypoteser

Granskningen skiljer strikt mellan fyra olika problemområden:

1. **Upptäckt (Discovery):**  
   Google har inga inskickade sitemaps (`sitemaps.xml` svarade 404 vid S02-test). Undersidor kan därför endast upptäckas via länkföljning från startsidan eller externa länkar.
2. **Rendering:**  
   Alla sidor levererar fullständigt serverrenderat HTML-innehåll (Next.js SSR/SSG), vilket verifierats i S02. Rendering kräver alltså inte tung klientkörning för att Google ska se texten.
3. **Canonical:**  
   Inga sidor i produktionen har hittills haft en deklarerad `<link rel="canonical">`. Detta lämnar kanoniseringsbeslutet helt åt Googles heuristik.
4. **Kvalitet och metadata:**  
   Texter och Grammatik saknar unika titlar och beskrivningar i produktion (`<title>Fornsvenska Studielabbet</title>` på alla sidor), vilket gör att Google inte kan utläsa sidans specifika ämne ur HTML-headern.
