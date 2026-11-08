# CF05 – beständig redigering och publicering

Datum: 2026-10-30. Status: **lokalt verifierad prototyp för redaktionsmodell, behörighetsskydd, idempotens och atomär felisolering; molnverifiering av komplett CI/deploykedja återstår**.

## Sammanfattning och resultat

Etapp CF05 slutför det tredje av de tre avgränsade genomförbarhetsproven (CF03–CF05) före full ombyggnad och arkitekturlåsning (CF06). Den adresserar hur webbredigering och publicering fungerar i en statisk hostingarkitektur:

1. **Vertikalt prov för redigering:**
   * Administratören loggar in via Supabase Auth och sparar redaktionella rättelser samt moderna definitioner.
   * Sparade ändringar hålls beständigt i redaktionslagret ([`lib/ordbok/editorialStore.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/editorialStore.ts)) som opublicerade utkast.
   * **Innehållsisolering:** Anonyma besökare ser uteslutande den senast godkända publicerade statiska utgåvan. Opublicerade utkast eller pågående ändringar exponeras aldrig publikt.
2. **Behörighetsskyddad publiceringsbegäran:**
   * Publiceringspipelinen ([`lib/publishing/publishingPipeline.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/publishing/publishingPipeline.ts)) kräver verifierad inloggning och `arAdmin === true`.
   * Oautentiserade anrop nekas med HTTP 401. Icke-administratörer och användare med återkallad administratörsroll nekas med HTTP 403.
3. **Idempotens och dubbelklicksskydd:**
   * Upprepade publiceringsanrop med samma idempotensnyckel eller under ett pågående bygge startar inte parallella körningar, utan returnerar det befintliga jobbets status (HTTP 200).
4. **Kvotkontroll mot gratisbudgeten:**
   * Kontrollerar att månadskvoten (28 releasekörningar enligt CF01) inte överskrids. Vid uppnådd kvot nekas begäran med HTTP 429 för att förhindra oväntade kostnader eller driftstopp.
5. **Atomär felisolering (avsiktlig felinjektion):**
   * Vid ett avbrutet eller misslyckat bygge i någon del (t.ex. syntaktiskt fel i en artikelgrupp) avbryts publiceringen och markeras som `failed`.
   * **Tidigare aktiv statisk version förblir 100 % orörd och läsbar.** Huvudsajten aktiveras alltid sist, vilket garanterar att en halv eller trasig deploy aldrig når publika läsare.

---

## 1. Redaktörens huvudflöde

```text
1. Redigera i webbläsaren
   └── Supabase Auth -> Administratör autentiseras.
2. Spara utkast
   └── Ändringen sparas beständigt med proveniens (skapadAv, kallstod, reviewStatus).
   └── harOpubliceradeAndringar = true.
   └── Den publika sajten fortsätter visa tidigare publicerad revision.
3. Begär publicering
   └── Behörighetskontroll (401/403) + Kvotkontroll (429) + Idempotenskontroll.
   └── Jobb skapas med status 'running' och tilldelas unikt snapshotReleaseId.
4. Bygg och verifiera
   └── Frys snapshot -> Bygg statiska ordboksdelar (ord-01..07) -> Bygg huvudsajt.
5. Aktivera release (vid godkänt bygge)
   └── Huvudsajten deployas sist -> activeReleaseId uppdateras atomärt.
   └── Redaktionslagrets utkast markeras som publicerade med det nya revisions-ID:t.
```

---

## 2. Felhantering och avbrutet bygge

Vid en avsiktlig felinjektion under publiceringen (t.ex. byggfel i artikelgrupp 04):
* Jobbet i pipelinen avbryts och sätts till status `failed` med detaljerat felmeddelande.
* Delprojekten som hann byggas aktiveras inte för publik trafik.
* `state.activeReleaseId` behåller sin tidigare stabila version (`cf-rel-stable-...`).
* Redaktionslagrets utkast behåller `harOpubliceradeAndringar = true` så att administratören kan rätta felet och försöka igen.

---

## 3. Kostnadsberoenden och kvotram

* **Compute & Byggtid:** CI-körningen sker på GitHub Actions standard-Linux runner (gratis för det publika repot) med en uppmätt byggtid på under 2 sekunder för 6 900 artiklar.
* **Storage:** 0 byte persistenta betalda artefakter i CI. Beständiga snapshots och backuper lagras privat utanför Git.
* **Publika anrop:** **0 anrop** till Supabase DB eller Cloudflare Workers vid vanlig läsning och sökning. Supabase DB används uteslutande vid redaktörens inloggning och sparning.

---

## 4. Genomförda kontroller

1. **Enhetstester:** 5 av 5 godkända i [`tests/cloudflare-cf05.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf05.test.mjs):
   * Vertikalt prov: spara utkast, verifiera publik isolering, begär publicering och verifiera aktivering.
   * Behörighetsprov: 401 för oautentiserad, 403 för icke-admin och 403 för återkallad roll.
   * Idempotens: parallella anrop och dubbelklick återanvänder samma jobb utan parallella byggen.
   * Atomär felisolering: avsiktligt byggfel lämnar aktiv release 100 % intakt och läsbar.
   * Kvotkontroll: stoppar publicering med HTTP 429 när månadskvoten är nådd.
2. **Regressionsprov:** Samtliga 176 befintliga tester i projektet passerar utan anmärkning (`node --import tsx --test tests/*.test.mjs`).
3. **Typkontroll:** `npx tsc --noEmit` passerar felfritt med exit-kod 0.

---

## 5. Slutsats och nästa startpunkt

Med genomförandet av CF03, CF04 och CF05 är samtliga tre avgränsade genomförbarhetsprov klara:
* **CF03:** Fullständig HTML och metadata, deterministisk routing och bekräftad filbudget (6 901 filer mot 16 000-gränsen).
* **CF04:** Cross-origin personlig ordlista via säker Storage Bridge med skydd mot överskrivning och export/import-reserv.
* **CF05:** Beständig webbredaktion med RLS, behörighetsskyddad publicering, idempotens och atomär felisolering.

**Nästa etapp:** **CF06 – Fastställd arkitektur och mätbudget**.
CF06 sammanställer lärdomarna från de tre prototyperna, låser de tekniska arkitekturbesluten och fastställer prestandabudgeten inför den fullständiga ombyggnaden (CF07–CF14).
