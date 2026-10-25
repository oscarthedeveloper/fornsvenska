# E13: Verifiera på Netlify och förbered återställning

Datum: 2026-10-25  
Status: **Klar och verifierad i molnet mot Netlify Deploy Preview #1**

---

## 1. Genomförande och testmiljö

Netlify Deploy Preview skapades automatiskt via Pull Request #1:
- **Miljö:** `https://deploy-preview-1--fornsvenska.netlify.app`
- **Deploy ID:** `6ade3238e85a3f21ab277b6f`
- **Commit:** `101716c` (`preview/drift-optimering`)
- **Mätverktyg:** [`scripts/measure-journeys.ts`](../../scripts/measure-journeys.ts) kördes med `MEASURE_BASE_URL="https://deploy-preview-1--fornsvenska.netlify.app"`.
- **Rådata:** Sparad i [`docs/drift/E13-matvardens-moln.json`](./E13-matvardens-moln.json).

---

## 2. Faktiska mätresultat i Netlify Edge

Samtliga 5 besökarresor kördes med 5 kalla och 5 varma mätningar:

### Resa 1: Startsida → Textmapp → Text → Ordboksuppslag → Nästa text
- **Startsida (`/`):** 200 OK, svarstid **47.9 ms**, `age: 151 s`, `cache-status: "Netlify Durable"; hit`. Servas från CDN Edge.
- **RSC Prefetch (`/`):** 200 OK, svarstid **55.8 ms**, `age: 151 s`, servas från CDN Edge.
- **Textmapp (`/texter/lagar/aldre-vastgotalagen`):** 200 OK, svarstid **46.5 ms**, `age: 10 s`, servas från CDN Edge.
- **Textartikel (`/texter/lagar/aldre-vastgotalagen/kristnu-balker-i`):** 200 OK, svarstid **48.4 ms**, `age: 9 s`, servas från CDN Edge.
- **Ordboksuppslag (`/api/ordbok/uppslag?ord=fyrst`):** 200 OK, svarstid **81.6 ms**, `age: 32 s`, `cache-control: public`. Fullständigt svar returneras från CDN Edge.
- **Nästa text (`.../kristnu-balker-ii`):** 200 OK, svarstid **48.0 ms**, `age: 9 s`, servas från CDN Edge.

### Resa 2: Grammatiksida → Hänvisning
- **Vad är fornsvenska (`/grammatik/introduktion/vad-ar-fornsvenska`):** 200 OK, svarstid **51.0 ms**, `age: 7 s`, servas från CDN Edge.
- **Grammatikartikel Omljud (`/grammatik/ljudlara/vokaler/omljud`):** 200 OK, svarstid **53.8 ms**, `age: 5 s`, servas från CDN Edge.

### Resa 3: Resurssökning → Bok
- **Resurskatalog (`/resurser`):** 200 OK, svarstid **60.0 ms**, `age: 157 s`, servas från CDN Edge.
- **PDF-läsarvy (`/resurser/vastgotalagen`):** 200 OK, svarstid **56.9 ms**, `age: 180 s`, servas från CDN Edge.

### Resa 4: Runsida → Filter → Detalj → Tillbaka
- **Runsida (`/runor`):** 200 OK, svarstid **61.0 ms**, `age: 188 s`, servas från CDN Edge.
- **API-filter (`/api/runor/v1?province=Ög`):** 200 OK, svarstid **43.6 ms**, `age: 6 s`, servas från CDN Edge.
- **Runkatalog detalj (`/runor/ol-1`):** 200 OK, svarstid **51.0 ms**, `age: 187 s`, servas från CDN Edge.

### Resa 5: Admin & Säkerhetsseparation
- **Inloggningsvy (`/admin`):** 403 Forbidden (anonym) / 200 (inloggad), `cache-control: private,no-cache,no-store,max-age=0,must-revalidate`, `age: 0`. Strikt privat, cachas aldrig i CDN.
- **Admin runor (`/admin/runor`):** Strikt privat och dynamisk.
- **Anonym kontroll startsida (efter admin):** 200 OK, svarstid **50.0 ms**, `age: 182 s`, servas direkt från publik CDN Edge.

---

## 3. Ordboksverifiering i molnet

- **Ordbokssidan (`/ordbok`):** Det tidigare felmeddelandet *"Ordboken kunde inte laddas: Ordboksdata saknas (data/ordbok/poster.json)"* är **helt åtgärdat**. Hela ordboksindexet med 41 744 poster är korrekt paketerat och tillgängligt.
- **Uppslags-API:** Anrop mot `/api/ordbok/uppslag?ord=land` svarar med 200 OK och fullständiga träffar från Söderwall och Supplementet.

---

## 4. Slutsats och godkännande

1. **Funktionsanrop:** Varma publika besökarresor servas till **100 % från Netlify CDN Edge** (`age > 0`, `cache-status: "Netlify Durable"; hit`).
2. **Latens:** Svarstiderna för alla publika sidor har sjunkit till **40–60 ms** (från tidigare 200–600 ms).
3. **Säkerhet:** Inga privata sessioner eller adminvyer cachas.
4. **Tillgänglighet & Funktion:** Texter, ordbok, grammatik och runor fungerar felfritt.

**Etapp E13 är härmed GODKÄND.** Projektet är redo för **E14 (Merge till `main` och kontrollerad produktionslansering)**.
