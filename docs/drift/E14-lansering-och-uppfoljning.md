# E14: Kontrollerad lansering och uppföljning

Datum: 2026-10-25  
Status: **Driftsatt till produktion och verifierad mot www.fornsvenska.se**

---

## 1. Syfte

Säkerställa att produktionssättningen av den optimerade arkitekturen på `https://www.fornsvenska.se` sker kontrollerat, utan avbrott eller funktionsförlust, samt följa upp att månadsprognosen för Netlify serverfunktionsanrop håller sig stabilt under **25 000 anrop per månad** (väl inom gratiskvoten på 125 000).

---

## 2. Lanseringsstatus (Genomförd 25 okt 2026)

- [x] Alla 158 automatiserade tester passerar lokalt (`npx tsx --test tests/*.test.mjs`).
- [x] `validate:kallor` och `validate:texter` godkända med 0 fel.
- [x] TypeScript typkontroll utan anmärkning (`npx tsc --noEmit`).
- [x] Produktionsbygge utan varningar (`npm run build`).
- [x] E13 molnverifiering godkänd på förhandsmiljö (Netlify preview #1).
- [x] Merge till `main` genomförd och pushad till GitHub.
- [x] Skarp produktion byggd och aktiv på `https://www.fornsvenska.se`.
- [x] Ordboksuppslag och artiklar testade i produktion: 200 OK, fullständiga poster laddade utan fel.
- [x] Runic Atlas (karta, filter, guidningar) aktiverad och verifierad i produktion.
- [x] Mätning av samtliga 5 besökarresor körd live mot `https://www.fornsvenska.se`: 100 % cache-träffar vid varma besök (`age > 0`), svarstider 45–60 ms.

---

## 3. Uppföljningsschema

| Tidpunkt | Fokusområde | Metod / Verktyg | Acceptanskriterium |
|---|---|---|---|
| **+1 timme** | Byggframgång, initial edge-uppvärmning, felkontroll | Netlify Deploys & Function logs | 0 500-fel, alla sidor svarar med 200 OK. |
| **+24 timmar** | Funktionsräknare och CDN-cacheträffar | Netlify Usage Dashboard | Antal anrop ökar linjärt med högst 500–800 anrop/dygn vid normal trafik. |
| **+7 dagar** | Veckotrend, ordboksuppslag, redaktionell invalidation | Netlify Analytics / Supabase logs | Total veckoförbrukning < 6 000 anrop. Redaktörsändringar uppdateras inom 10 s. |
| **+14 dagar** | Månadsprognos och stabilitet | Netlify Billing tab | Prognosticerad månadsförbrukning < 25 000 anrop (80 % marginal till kvottak). |

---

## 4. Larmgränser och beredskapsåtgärder

| Scenario | Observation | Åtgärd |
|---|---|---|
| **Oväntad funktionsstegring (> 2 000 anrop/dygn)** | Netlify dashboard varnar för hög takt. | Granska accesslogg för robotangrepp mot dynamiska API:er. Överväg att aktivera robotskydd eller utöka CDN-cachen på `/api/ordbok/uppslag`. |
| **Ordboksproblem i molnet** | Sidan `/ordbok` visar att poster saknas. | Kontrollera `outputFileTracingIncludes` i Netlify bygglogg; verifiera att `data/ordbok/poster.json` är uppladdad och intakt. |
| **Allvarlig regressionsincident** | Innehållsvisning eller sparfunktion slutar fungera. | Utför omedelbar rollback till `dfa2f18` via Netlify Deploys. |

---

## 5. Förvaltningsanvisning för redaktionen

1. **Redigera text och grammatik:**
   - Inloggade ändringar via `/admin` eller inline-redigering slår igenom omedelbart för redaktören.
   - Anonyma besökare ser ändringen inom högst 10 sekunder via målstyrd invalidation av den berörda roten (`/texter` respektive `/grammatik`).
   - Övriga delar av sajten (startsida, resurser, ordbok, runor) behåller sin CDN-cache och belastar inte serverkvoten.
2. **Uppdatera ordbok:**
   - Redaktionella rättelser och definitioner sparas i databasen och slår igenom direkt.
   - Vid fullständig omimport av ordboken körs `npm run import:ordbok` lokalt följt av versionsinvalidering.
