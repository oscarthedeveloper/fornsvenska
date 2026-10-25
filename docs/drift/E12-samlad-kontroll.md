# E12 – Samlad funktions-, säkerhets- och tillgänglighetskontroll

Datum: 2026-10-25  
Status: Slutförd och godkänd  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md) t.o.m. [`E11`](./E11-aktualitet-och-invalidation.md)

---

## 1. Sammanfattning av optimeringsresultat

Optimeringen enligt `NETLIFY_OPTIMERINGSPLAN.md` hade som mål att **minska antalet Netlify-serverfunktionsanrop (`___netlify-server-handler`) med minst 80 %** utan att kompromissa med källkritik, navigationshastighet, ordboksuppslag, runor eller redaktörens arbetsflöde.

### Slutgiltigt utfall mot målet:
- **Offentliga besökarresor (Resor 1–4):** Minskning med **100 % vid varma besök** (från 15 serverfunktionsanrop ned till **0 anrop**).
- **Målet på minst 80 % reduktion är därmed överträffat.**

---

## 2. Evidens: Besökarresor (Före vs Efter)

Mätningar utförda mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`) med automatiserade mätskriptet ([`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts)):

| Resa | Beskrivning | Anrop Före (E02) | Anrop Efter (E12) | Förbättring | Sammanlagd medianlatens |
|---|---|---|---|---|---|
| **Resa 1** | Startsida → Textmapp → Text → Ordboksuppslag → Nästa text | 9 anrop | **0 anrop** | **-100 %** | 28.6 ms |
| **Resa 2** | Grammatiksida → Hänvisning | 4 anrop | **0 anrop** | **-100 %** | 22.6 ms |
| **Resa 3** | Resurssökning → Bok/PDF-visning | 2 anrop | **0 anrop** | **-100 %** | 15.3 ms |
| **Resa 4** | Runsida → Filter → Detalj → Tillbaka | 0 anrop | **0 anrop** | **Referens (0)** | 26.2 ms |
| **Resa 5** | Inloggning → Adminvyer → Anonym kontroll | 6 anrop | **4 anrop** | **-33 %** (Endast admin privat) | 30.0 ms |

---

## 3. Testprotokoll och svitresultat

Samtliga testsviter kördes samlat och passerade utan fel:

```bash
npx tsx --test tests/drift-optimering.test.mjs tests/validate-texter.test.mjs tests/runor-contract.test.mjs tests/seo-contract.test.mjs
```

### Resultat:
- **`tests/drift-optimering.test.mjs` (9/9 tester godkända):**
  - `D01`: RootLayout är helt statisk och fri från kakor.
  - `D02`: Startsidan är befriad från `force-dynamic` och har `revalidate = 86400`.
  - `D03`: Texter har `generateStaticParams` (44 sökvägar) och `revalidate = 604800`.
  - `D04`: Grammatik har `generateStaticParams` (232 sökvägar) och `revalidate = 604800`.
  - `D05`: Resurser är befriad från `force-dynamic` och har `revalidate = 86400`.
  - `D06`: Ordboksuppslag returnerar `public, s-maxage=86400` vid lyckade anrop och `no-store` vid fel/tomma ord.
  - `D07`: `OrdbokUppslagPanel` har klientsidig minnescache och `AbortController`.
  - `D08`: `middleware.ts` har auth-kakevakt och exkluderar `.pdf`, `.xml`, `.txt`, `.json`.
  - `D09`: `lib/actions.ts` har målstyrd invalidation utan global rotinvalidation.
- **`tests/validate-texter.test.mjs` (6/6 tester godkända):**
  - Textvalidatorn godkänner aktuell giltig korpus och fångar negativa fall (saknade dokument, dubbel primärkoppling, oregistrerade källor, otillåtna platshållare, osynkad generator).
- **`tests/runor-contract.test.mjs` (8/8 tester godkända):**
  - Publiceringskontraktet för runor returnerar samtliga 20 inskrifter, slug-uppslag och avvisar strikt utkast, arkiverade poster och ogiltiga koordinater.
- **`tests/seo-contract.test.mjs` (4/4 tester godkända):**
  - Redaktionell sitemap (280 sidor), ordbokens delkartor (41 744 poster), WebSite JSON-LD och BreadcrumbList JSON-LD.
- **Käll- och textvalidering:**
  - `npm run validate:kallor`: Godkänd (39 verk, 54 filer, 193 artiklar, 0 fel).
  - `npm run validate:texter`: Godkänd (35 dokument, 159 sektioner, 377 meningar, 285 segment-ID:n, 0 fel).
- **Typkontroll & Bygge:**
  - `npx tsc --noEmit`: 0 fel.
  - `npm run build`: Genererade **315 statiska sidor (`● SSG`)** felfritt.

---

## 4. Grindverifiering (E12)

| Grindkrav | Utfall | Verifieringsmetod |
|---|---|---|
| **Inga förlorade redigeringar** | Godkänd | `sparaInnehall` och redaktörens lokala state bekräftar sparning direkt med `ok: true`. |
| **Inga oavsiktligt publika data** | Godkänd | Utkast (`utkast: true`) filtreras strikt på databasnivå (`.eq("utkast", false)`). Adminvyer kräver aktiv session via `kravAdmin()`. |
| **Inga trasiga URL:er** | Godkänd | Samtliga 44 text- och 232 grammatikadresser förgenereras med SSG. 404 returneras korrekt för felaktiga adresser. |
| **Specialtecken bevarade** | Godkänd | `þ`, `ð`, `æ`, `ø` renderas korrekt i initial HTML och ordboksuppslag. |
| **PDF och Range Requests** | Godkänd | `206 Partial Content` fungerar med `Accept-Ranges: bytes` för `vastgotalagen-maskintext.pdf`. |
| **Runor och Karta** | Godkänd | Filter, tidslinje och kartvy fungerar 100 % på klientsidan med delbara URL:er och `history.pushState`. |
| **Inga nya bestående JS-fel** | Godkänd | Ren webbläsarkonsol vid genomkörning av samtliga besökarresor. |

---

## 5. Slutsats inför driftsättning

Alla tekniska och arkitektoniska etapper (E01–E12) i optimeringsplanen är nu helt genomförda och rigoröst verifierade lokalt mot produktionsbygget. 

Så snart Netlifys månadskvot återställs (1 november 2026) eller kontot uppgraderas kan ändringarna driftsättas till molnet och slutverifieras i enlighet med **E13 (Molnverifiering)** och **E14 (Lansering)**.
