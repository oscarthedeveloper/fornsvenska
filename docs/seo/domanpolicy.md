# S05 – Domänpolicy och Kanonisering (Fornsvenska.se)

Datum: 2026-10-25  
Status: Fastställd och verifierad  
Referens: [`docs/seo/GOOGLE_GENOMFORANDEPLAN.md`](./GOOGLE_GENOMFORANDEPLAN.md)

---

## 1. Fastställd kanonisk huvudadress

**Primär domän och protokoll:**  
`https://www.fornsvenska.se`

### Beslutsunderlag och motivering
1. **Empirisk konvergens (S02):**  
   - `http://fornsvenska.se/` -> 301 Permanent Redirect -> `https://fornsvenska.se/` -> 301 Permanent Redirect -> `https://www.fornsvenska.se/`
   - `https://fornsvenska.se/` -> 301 Permanent Redirect -> `https://www.fornsvenska.se/`
   - `https://www.fornsvenska.se/` -> 200 OK (Netlify Edge).
2. **Search Console-historik (S01):**  
   - `https://www.fornsvenska.se/` är den enda adressen med rapporterad synlighet och indexering i Google Search Console (54 exponeringar, 1 klick).
   - Varianten utan www (`https://fornsvenska.se/` och `http://fornsvenska.se/`) har korrekt rapporterats som ”Sida med omdirigering” och ska **inte** indexeras.
3. **Slutsats:**  
   Ingen ändring av primär domän görs. `https://www.fornsvenska.se` förblir den enda kanoniska adressen.

---

## 2. Kanoniseringsregler för applikationen

1. **`metadataBase` i `app/layout.tsx`:**  
   Sätts explicit till:
   ```ts
   metadataBase: new URL("https://www.fornsvenska.se")
   ```
2. **Självpekande canonical på alla unika sidor:**  
   Varje unik sida ska ange sin egen kanoniska sökväg:
   - Startsida: `canonical: "/"` (löses till `https://www.fornsvenska.se/`)
   - Grammatikartikel: `canonical: "/grammatik/substantiv/fyrkasussystemet/nominativ"`
   - Textartikel: `canonical: "/texter/lagar/aldre-vastgotalagen/kristnu-balker-i"`
   - Ordboksartikel: `canonical: "/ordbok/soederwall--bonde-nn.1"`
   - Resurser: `canonical: "/resurser"`
   - Bokläsare: `canonical: "/resurser/vastgotalagen"`
3. **Ingen felaktig kanonisering till startsidan:**  
   Undersidor får **aldrig** peka på startsidan som canonical.
4. **Filtrering och sökparametrar (`searchParams`):**  
   - Sök- och filtreringssidor (t.ex. `/ordbok?q=bonde&mode=uppslagsord`) ska peka på den rena basadressen (`canonical: "/ordbok"`) om sökresultatet inte utgör en egen permanent kanonisk artikel.
   - Enskilda ordboksartiklar (`/ordbok/[id]`) är självständiga permanenta artiklar och har sin egen unika canonical (`/ordbok/[id]`).
5. **Korrektion av avvikande kod:**  
   - `app/runor/page.tsx` som tidigare hade `canonical: 'https://fornsvenska.se/runor'` ska använda `https://www.fornsvenska.se/runor` (eller relativ sökväg `/runor`).
