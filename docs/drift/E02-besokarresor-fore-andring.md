# E02 – Mätrapport: Besökarresor före optimering

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Rådata: [`docs/drift/E02-matvardens-data.json`](./E02-matvardens-data.json)  
Testskript: [`scripts/measure-journeys.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/scripts/measure-journeys.ts)

---

## 1. Testmiljö och metodik

- **Server:** Next.js `14.2.5` i produktionsläge (`NODE_ENV=production`, `next start -p 3123 -H 127.0.0.1`).
- **Nätverksprofil:** Lokal HTTP/1.1-mätning via Node.js fetch med fullständiga headers.
- **Körningar:** 5 kalla körningar (initial laddning / färsk anslutning) och 5 varma körningar (återkommande besök) per resa.
- **Förfrågningstyper:**
  - **HTML:** Första dokumentladdningen (`Accept: text/html,...`).
  - **RSC:** Next.js klientnavigering och länkförhandsladdning (`Accept: text/x-component`, `RSC: 1`, `Next-Url: ...`).
  - **API:** HTTP GET mot JSON-ändpunkter.
- **Netlify-analogi:** Alla förfrågningar som resulterar i `DYNAMIC` (`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` utan träff i Next-cachen) exekverar Netlifys produktionsserverfunktion `___netlify-server-handler`.

---

## 2. Sammanfattning av mätresultat per besökarresa

### Resa 1: Startsida → Textmapp → Text → Ordboksuppslag → Nästa text
*Representerar den vanligaste publika studieresan.*

| Steg | Typ | Mediantid (min–max) | Storlek | Serverstatus | Cache-Control |
|---|---|---|---|---|---|
| **1. Startsida (`/`)** | HTML | 10.5 ms (8.5–26.2 ms) | 17.0 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 1. Startsida (Prefetch) | RSC | 4.7 ms (3.3–7.9 ms) | 4.1 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **2. Textmapp (`/texter/...`)** | HTML | 13.0 ms (10.8–24.4 ms) | 31.1 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 2. Textmapp (Prefetch) | RSC | 6.8 ms (5.7–13.5 ms) | 12.2 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **3. Text (Kristnu balkær I)** | HTML | 16.7 ms (10.7–21.8 ms) | 176.2 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 3. Text (Prefetch) | RSC | 7.3 ms (4.1–13.9 ms) | 41.1 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **4. Ordboksuppslag (`ord=fyrst`)** | API | 3.5 ms (1.9–1316.9 ms) | 26.7 kB | **API (DYNAMIC)** | *(saknas / ingen)* |
| **5. Nästa text (Kristnu balkær II)** | HTML | 15.8 ms (10.6–30.0 ms) | 146.5 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 5. Nästa text (Prefetch) | RSC | 6.6 ms (5.3–13.3 ms) | 38.8 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |

> **Netlify-funktionskostnad för Resa 1:**  
> **9 serverfunktionsanrop** för en enda lässession (4 HTML + 4 RSC-prefetch + 1 API-uppslag). Ingen del av svaren återanvänds mellan besökare.

---

### Resa 2: Grammatiksida → Hänvisning
*Representerar student som läser en grammatikartikel och klickar vidare till ett relaterat avsnitt.*

| Steg | Typ | Mediantid (min–max) | Storlek | Serverstatus | Cache-Control |
|---|---|---|---|---|---|
| **1. Vad är fornsvenska** | HTML | 28.0 ms (17.9–371.3 ms) | 232.4 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 1. Vad är fornsvenska (Prefetch) | RSC | 9.3 ms (7.4–13.4 ms) | 129.2 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **2. Omljud (Hänvisningsartikel)** | HTML | 24.7 ms (17.8–35.9 ms) | 230.7 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 2. Omljud (Prefetch) | RSC | 8.4 ms (6.8–17.1 ms) | 127.9 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |

> **Netlify-funktionskostnad för Resa 2:**  
> **4 serverfunktionsanrop** (2 HTML + 2 RSC). Notera den ansenliga RSC-datamängden (~128 kB per navigation) som genereras på servern vid varje sidbesök.

---

### Resa 3: Resurssökning → Bok/PDF-visning
*Representerar användare som utforskar litteratur och öppnar en faksimilutgåva.*

| Steg | Typ | Mediantid (min–max) | Storlek | Serverstatus | Cache-Control |
|---|---|---|---|---|---|
| **1. Resursbibliotek (`/resurser`)** | HTML | 21.7 ms (19.7–43.4 ms) | 176.5 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 1. Resursbibliotek (Prefetch) | RSC | 15.1 ms (14.1–18.5 ms) | 123.6 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **2. Västgötalagen PDF-läsare** | HTML | 2.4 ms (1.8–61.6 ms) | 18.1 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |
| 2. Västgötalagen (Prefetch) | RSC | 1.6 ms (1.3–3.5 ms) | 7.5 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |

> **Netlify-funktionskostnad för Resa 3:**  
> **2 serverfunktionsanrop** för `/resurser` (HTML + RSC). Västgötalagens PDF-sida är redan statiskt förgenererad och förbrukar 0 funktionsanrop vid varma besök.

---

### Resa 4: Runsida → Filter → Detalj → Tillbaka
*Representerar besökare i runinskrifternas atlas och katalog.*

| Steg | Typ | Mediantid (min–max) | Storlek | Serverstatus | Cache-Control |
|---|---|---|---|---|---|
| **1. Runsida (`/runor`)** | HTML | 6.6 ms (5.7–21.9 ms) | 200.6 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |
| 1. Runsida (Prefetch) | RSC | 3.6 ms (3.2–4.1 ms) | 111.3 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |
| **2. API-filter (`province=Ög`)** | API | 1.6 ms (1.3–5.4 ms) | 10.2 kB | **API (CACHED)** | `public, s-maxage=3600, stale-while-revalidate=86400` |
| **3. Runkatalog detalj (`Öl 1`)** | HTML | 2.8 ms (2.2–8.7 ms) | 44.2 kB | **CACHED (SSG)** | `s-maxage=31536000, stale-while-revalidate` |
| 3. Runkatalog detalj (Prefetch) | RSC | 1.6 ms (1.3–2.5 ms) | 18.1 kB | **CACHED (SSG)** | `s-maxage=31536000, stale-while-revalidate` |
| **4. Tillbaka till `/runor`** | HTML | 5.3 ms (4.8–5.4 ms) | 200.6 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |
| 4. Tillbaka (Prefetch) | RSC | 3.1 ms (2.8–3.7 ms) | 111.3 kB | **CACHED (STATIC)** | `s-maxage=31536000, stale-while-revalidate` |

> **Netlify-funktionskostnad för Resa 4:**  
> **0 serverfunktionsanrop vid varma besök!**  
> Denna resa är ett referensexempel på hur förgenererade SSG-sidor och välnycklad CDN-cache (`s-maxage`) eliminerar onödig serverkörning.

---

### Resa 5: Inloggning → Adminvyer → Anonym kontroll
*Representerar redaktionellt arbete och efterföljande verifiering.*

| Steg | Typ | Mediantid (min–max) | Storlek | Serverstatus | Cache-Control |
|---|---|---|---|---|---|
| **1. Admin inloggning (`/admin`)** | HTML | 10.4 ms (8.3–16.4 ms) | 17.5 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 1. Admin inloggning (Prefetch) | RSC | 4.9 ms (3.3–6.4 ms) | 8.7 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **2. Admin runor (`/admin/runor`)** | HTML | 8.8 ms (6.0–13.8 ms) | 17.5 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 2. Admin runor (Prefetch) | RSC | 4.4 ms (2.9–5.3 ms) | 9.1 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| **3. Anonym kontroll (`/`)** | HTML | 7.9 ms (5.3–15.1 ms) | 17.0 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |
| 3. Anonym kontroll (Prefetch) | RSC | 4.2 ms (3.7–5.6 ms) | 4.1 kB | **DYNAMIC** | `private, no-cache, no-store, max-age=0, must-revalidate` |

> **Netlify-funktionskostnad för Resa 5:**  
> **6 serverfunktionsanrop**. Adminvyerna *ska* vara strikt dynamiska och privata. Däremot ska den anonyma kontrollen av startsidan i framtiden kunna servas från cache utan att trigga serverfunktion.

---

## 3. Slutsatser och insikter inför E03–E04

1. **Förhandsladdning (`RSC: 1`) är den dolda volymdrivaren:**  
   Varje länk som visas eller hovras skickar en separat RSC-förfrågan. Eftersom sidorna saknar publik cacheheaders körs serverfunktionen två gånger per sidbesök (en gång för prefetch och en gång för själva sidladdningen).
2. **Ordboksuppslag (`/api/ordbok/uppslag`) saknar helt cache:**  
   Vid läsning av medeltidstext görs ett färskt API-anrop per klickat ord, trots att Söderwalls ordboksartiklar är oföränderliga historiska källor.
3. **Mönstret från Runsidan bevisar lösningen:**  
   Runsidan (Resa 4) har redan visat att SSG och `s-maxage=31536000` minskar funktionsanropen till 0 vid varma besök. Genom att tillämpa samma princip på Texter, Grammatik, Resurser och Startsida kan vi eliminera mer än 80 % av de onödiga serverfunktionsanropen på Netlify.
