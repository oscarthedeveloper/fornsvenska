# CF09 – Komplett webbredaktion

Datum: 2026-11-01. Status: **lokalt verifierad samlad webbredaktion över alla 6 innehållsdomäner; RLS, optimistisk samtidighetskontroll, reversibilitet och publiceringsisolering bekräftade**.

---

## Sammanfattning och resultat

Etapp CF09 bygger vidare på prototypen i CF05 och etablerar en komplett webbredaktion och publiceringscentral för Fornsvenska över samtliga 6 innehållstyper:

1. **Startsida** (`startsida` / `sidor`)
2. **Träd & mappar** (`trad_och_block` / `nodes` med `kind: 'folder'`)
3. **Dokumentblock & texter** (`texter` / `nodes` med `kind: 'doc'`, parallelltexter och segment)
4. **Resurser, hyllor & omslag** (`resurser` / `hyllor`, `resurser`)
5. **Ordboksrättelser & moderna definitioner** (`ordbok` / `ordbok_rattelser`, `ordbok_modernisering`)
6. **Runsidan & granskningsflöde** (`runor` / `svenska_runor_drafts`, `svenska_runor_audit_log`)

Alla 6 domäner hanteras med strikt separation mellan **autosparade utkast** och **manuell releasepublicering**. Opublicerade utkast exponeras aldrig för publika läsare, och publika läsningar gör **0 anrop** mot Supabase DB eller Cloudflare Workers.

---

## 1. Behörighets- och lagringsmatris

| Innehållsdomän | Primär datakälla (Publik) | Redaktionellt lager (Utkast) | RLS / Behörighet | Publiceringsmål (Snapshot) | Reversibilitet & Historik |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Startsida** | Statisk HTML / `dist/huvudsajt/index.html` | `sidor`-tabell (`slug='start'`) via `EditorialManager` | Kräver Supabase Auth + `admins`-roll (`arAdmin === true`). Obehöriga nekas med 401/403. | `snapshot.startsida` infryst i release-byggkedjan | Revisionshistorik per sparning med versionsstegring och rollback. |
| **2. Träd & mappar** | Statiska index & navigeringsträd | `nodes`-tabell (`kind='folder'`) | Admin-skyddad via Server Actions (`kravAdmin()`) och RLS. | `snapshot.trad_och_block` genererar arkivrötter | Fullständig revisionskedja med föräldra-/positionsspårning. |
| **3. Dokumentblock & texter** | Statisk HTML för textläsare | `nodes`-tabell (`kind='doc'`) med JSONB-block | Admin-skyddad (`sparaInnehall`), endast publicerade block exporteras. | `dist/huvudsajt/texter/**` och `dist/huvudsajt/grammatik/**` | Revisionshistorik med diff-stöd per textsegment. |
| **4. Resurser, hyllor & omslag** | Statiska biblioteksfiler & JSON-katalog | `hyllor`- och `resurser`-tabeller (`utkast: boolean`) | Admin-skyddad (`sparaHylla`, `sparaResurs`). | `dist/huvudsajt/resurser/**` (filtrerat på `utkast = false`) | Reversibel positions- och hyllordning. |
| **5. Ordboksrättelser & definitioner** | Statiska artiklar `dist/ord-01..07` & versionsindex | `ordbok_rattelser` och `data/ordbok-rattelser.json` | Admin-skyddad. Kräver obligatoriskt källstöd (`kallstod`) och motivering (`note`). | Byggda artikel-HTML och `index-headwords.json` / `index-fulltext.json` | Permanent auditlogg och JSON-säkerhetskopia bevaras vid alla omimporter. |
| **6. Runredaktion** | Statiska runartiklar & `RUNIC_PILOT_INSCRIPTIONS` | `svenska_runor_drafts` och `svenska_runor_audit_log` | Admin-skyddad. Statuskrav: `kandidat -> under_granskning -> godkand_for_publicering / avvisad`. | `dist/huvudsajt/runor/**` (endast `godkand_for_publicering`) | Oföränderlig `svenska_runor_audit_log` med granskare, motivering och rollback. |

---

## 2. Arkitektur: Autosave vs Manuell publicering

```text
[ Redaktör i webbläsaren ]
          │
          ▼ Autosparning (debounce 800 ms)
   [ sparaUtkastAction ]
          │
          ├── 1. Autentiserings- och admin-kontroll (401 / 403)
          ├── 2. Optimistisk samtidighetslåsning (expectedRevision)
          │      └── Konflikt detekterad? -> Returnera HTTP 409 + Varna redaktören
          ├── 3. Domänspecifik käll- och kvalitetsvalidering
          │      ├── Ordbok: Källstöd och motivering krävs (400 vid saknad)
          │      └── Runor: Tillåten statusövergång + Tilldelad granskare (400 vid saknad)
          └── 4. Spara till EditorialDraftRecord
                 ├── draftRevision++
                 ├── dirty = true
                 ├── status = 'utkast' | 'under_granskning' | 'godkand_for_publicering'
                 └── Lägg till i historikkedjan
          │
          ▼
   [ Opublicerat Utkast ] ───────────┐
          │                          │ (100 % isolering från publika läsare)
          │                          ▼
          │                   [ Publik besökare ]
          │                          │
          │                          ▼
          │                   Ser uteslutande aktiv release (publishedContent)
          │                   0 anrop till Supabase DB / Cloudflare Workers
          │
[ Klicka "Publicera webbplatsen" ]
          │
          ▼
   [ begarPubliceringAction ]
          │
          ├── 1. Kontrollera idempotensnyckel (förhindra dubbelklick)
          ├── 2. Kontrollera månadskvot (max 28 releasebyggen)
          ├── 3. Bygg alla 8 delprojekt (ord-01..07 + huvudsajt)
          │      └── Vid delbyggsfel: avbryt atomärt, behåll aktiv release intakt
          ├── 4. Vid godkänt bygge: aktivera release atomärt
          └── 5. Uppdatera redaktionslagret:
                 ├── publishedContent = draft.content
                 ├── publishedRevision = draftRevision
                 ├── dirty = false
                 └── status = 'publicerad'
```

---

## 3. Optimistisk samtidighetslåsning (Conflict Detection)

För att eliminera risken för tyst överskrivning när flera redaktörer arbetar samtidigt:
* Varje redigeringssession läser in en specifik basrevision (`expectedRevision`).
* Vid sparning verifieras att `existing.draftRevision === options.expectedRevision`.
* Om en annan redaktör hunnit spara en revision emellan avvisas begäran med **HTTP 409 Conflict**:
  * Redaktören informeras tydligt: *»Konflikt vid sparning: Posten har ändrats av [kollega] (revision X) sedan du började redigera (revision Y). Ladda om för att sammanfoga ändringarna.«*
  * Konflikten registreras i `auditLog` med status `conflict_detected` och referens till båda versionerna.
  * Tidigare sparning förblir 100 % orörd och skrivs aldrig över tyst.

---

## 4. Reversibilitet och revisionshistorik

* Varje sparat utkast tilldelas en inkrementell revision och sparas i postens interna `history`-array.
* Administratören kan när som helst via administratörsgränssnittet eller `aterstallUtkastAction` återställa en post till en valfri tidigare revision.
* Återställningen skapar en ny revision med fullständig proveniens:
  * Revisionsnummer räknas upp (t.ex. rev 3 återställd till rev 1 blir rev 4).
  * Motivering för återställningen registreras i både postens historik och redaktionsövergripande revisionslogg.
  * Inga historiska revisioner raderas.

---

## 5. Genomförda kontroller och testresultat

Samtliga redaktionella mekanismer har verifierats med automatiserade tester i [`tests/cloudflare-cf09.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf09.test.mjs):

1. **Samlad redaktionsmodell:** Samtliga 6 domäner (Startsida, Träd/block, Texter, Resurser, Ordbok, Runor) ändrades, verifierades mot publik isolering, publicerades koordinerat och verifierades för aktivering.
2. **Behörighetskontroll:** Oautentiserad användare nekas med HTTP 401; icke-administratör och återkallad roll nekas med HTTP 403.
3. **Optimistisk samtidighetslåsning:** Dubbelredigering med gammal basrevision avvisas med HTTP 409 utan dataförlust, och konflikten loggas.
4. **Reversibilitet & Rollback:** Återställning från rev 3 till rev 2 skapar ny rev 4 och bevarar historikkedjan.
5. **Källkritiska krav:** Ordboksrättelse utan källstöd avvisas med HTTP 400; ogiltiga runstatusövergångar samt godkännande utan tilldelad granskare avvisas med HTTP 400.
6. **Vattentät snapshot-isolering:** Kontrollerat maskinellt att 0 opublicerade utkast förekommer i `exportPublicSnapshot()`.
7. **Regressionsprov:** Samtliga **196 tester** i repositoryt passerar utan anmärkning (`node --import tsx --test tests/*.test.mjs`).
8. **Typkontroll:** `npx tsc --noEmit` passerar felfritt med exit-kod 0.

---

## 6. Slutsats och nästa etapp

Etapp CF09 är **fullständigt implementerad och lokalt verifierad**.

* **Klar:** Samlad webbredaktion över alla 6 innehållsdomäner, administratörsgränssnitt med revisionsvisning, publiceringscentral och samtidighetskontroll.
* **Nästa etapp:** **CF10 – Kontakt, run-API, kartor och externa tillgångar**.
