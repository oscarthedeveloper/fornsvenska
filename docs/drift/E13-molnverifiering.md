# E13: Verifiera på Netlify och förbered återställning

Datum: 2026-10-25  
Status: **Förberedd och redo för körning vid molnkvotens nollställning / unblock**

---

## 1. Bakgrund och grindnot

Netlify-kontot uppvisade 25 oktober:
- 146 418 av 125 000 serverfunktionsanrop för perioden 1 okt – 1 nov 2026.
- Netlify Functions-gränssnittet varnar att projekt pausas eller inte driftsätts förrän perioden återställs eller kontot uppgraderas.

I enlighet med beslutsgrinden i [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md) genomfördes alla etapper E01–E12 lokalt mot ett strikt produktionsbygge med 100 % pass-rate på 158 tester och 100 % minskning av serverfunktionsanrop för anonyma besökare. Detta dokument definierar hur E13 genomförs och verifieras så fort kontot är upplåst.

---

## 2. Återställningstidpunkt och förutsättningar

- **Automatisk nollställning:** 1 november 2026 kl. 00:00 UTC.
- **Alternativ tidig upplåsning:** Manuell planuppgradering (Pro) eller kvotutökning via [Netlify Billing Dashboard](https://app.netlify.com/projects/fornsvenska/functions?tab=usage).

---

## 3. Förberett automatiserat testprotokoll

Mätverktyget [`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts) har uppdaterats med stöd för miljövariabeln `MEASURE_BASE_URL` och fångar automatiskt Netlifys edge-specifika responsheaders:
- `x-nf-request-id` (unikt begärande-ID från Netlifys nätverk)
- `age` (sekunder i edge-cache; `> 0` indikerar serveringsfri edge-cacheträff)
- `cache-control` (`public, s-maxage=...`)
- `x-nextjs-cache` (`HIT`, `STALE`, `PRERENDER`)

### Körning mot Netlify Preview / Staging
```bash
export PATH="/usr/local/bin:$PATH"
MEASURE_BASE_URL="https://deploy-preview-<PR-NUMMER>--fornsvenska.netlify.app" npx tsx scripts/measure-journeys.ts
```
Mätresultaten sparas automatiskt i `docs/drift/E13-matvardens-moln.json`.

---

## 4. Kritiska kontrollpunkter i molnet

| Resa / Funktion | Förväntat Netlify Edge-beteende | Verifiering i Netlify-loggen |
|---|---|---|
| **Startsida (`/`)** | Varma anrop returnerar `age > 0`, servas från CDN Edge. | Inga anrop till `___netlify-server-handler`. |
| **Texter (`/texter/vastgotalagen/...`)** | Förgenererad SSG; HTML och RSC (`RSC: 1`) servas direkt från CDN. | Inga anrop till serverfunktionen. |
| **Grammatik (`/grammatik/...`)** | 232 förgenererade sidor servas från CDN med `s-maxage=604800`. | Inga anrop till serverfunktionen. |
| **Resurser & PDF (`/bocker/.../*.pdf`)** | HTTP `Range: bytes=0-1023` returnerar `206 Partial Content`. | Servas som statisk fil från Netlify CDN utan funktion. |
| **Ordboksuppslag (`/api/ordbok/uppslag?ord=land`)** | Varma anrop returnerar `s-maxage=86400` och `age > 0`. | 1 initialt anrop (kallstart), därefter 0 anrop från CDN. |
| **Ordbokssida (`/ordbok`)** | Inga felmeddelanden om saknad `poster.json`. 200 OK. | Ordboksindex laddat via `outputFileTracingIncludes`. |
| **Admin (`/admin`)** | Strikt dynamisk och privat, kräver autentisering. | Endast inloggade administratörsåtgärder kör funktion. |

---

## 5. Beredskap och återställningsplan (Rollback)

Om oväntade fel uppstår vid publicering:
1. **Senaste bekräftade stabila commit:**
   - Commit: `dfa2f18` (`Keep source materials and local copies out of Git`)
   - Alternativ rollback i Netlify UI: Under fliken **Deploys** klickas *Publish deploy* på föregående gröna driftsättning.
2. **CLI-rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```
3. **Efter rollback:**
   - Verifiera att läsartillgången är återställd på `https://www.fornsvenska.se`.
   - Kontrollera konsollfel och Netlify-funktionsloggen.
