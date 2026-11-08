# CF04 – gemensam personlig ordlista över underdomäner

Datum: 2026-10-30. Status: **lokalt verifierad prototyp för cross-origin-lagringsbrygga, felisolering och dataåterställning; molnprov på samma registrerade domän återstår**.

## Sammanfattning och resultat

När ordboksartiklar fördelas på underdomäner (`ord-01.fornsvenska.se` till `ord-07.fornsvenska.se`) isoleras webbläsarens `localStorage` per origin. Utan samordning skulle en besökare få åtta separata, osynkroniserade ordlistor.

Etapp CF04 har utformat, implementerat och testat lösningen:
1. **Bevarad auktoritativ datanyckel:** Användarens sparade ord och anteckningar förblir lagrade under `fornsvenska_sparade_ord_v1` på den kanoniska huvudsajten `https://www.fornsvenska.se`. Ingen databasmigrering och inga användarkonton krävs för personlig studiedata.
2. **Säker Storage Bridge via postMessage:** En minimalistisk hjälpsida [`public/ordbok/storage-bridge.html`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/public/ordbok/storage-bridge.html) bäddas in i en osynlig iframe på underdomänerna. Kommunikationen sker via det strikta protokollet i [`lib/ordbok/bridgeProtocol.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/bridgeProtocol.ts) med vitlistade origins, korrelations-ID och timeout. Inga sessions- eller autentiseringstokens förmedlas.
3. **Robust skydd mot datatapp vid blockerad inbäddad lagring:** I webbläsare med strikt integritetsskydd (t.ex. Safari ITP eller Firefox Total Cookie Protection) där tredjeparts-iframes nekas lagringsåtkomst kastar bryggan ett kontrollerat fel (`BLOCKED`). **Klienten tolkar aldrig ett fel som en tom ordlista och kan därmed aldrig skriva över användarens befintliga ord med `[]`.**
4. **Verifierad reserv och dataåterställning:** Om bryggan blockeras aktiveras lokal sessionslagring med direkt länk till den centrala ordlistevyn på `https://www.fornsvenska.se/ordbok`. Fullständig export och import av JSON finns implementerad i [`lib/ordbok/bokmarken.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/bokmarken.ts) så att användare alltid kan säkerhetskopiera och återställa sina ord utan dataförlust.

---

## 1. Protokoll och meddelandestruktur

### Vitlistade origins
Bryggan tillåter endast anrop från de 9 definierade projektadresserna:
* `https://www.fornsvenska.se`
* `https://fornsvenska.se`
* `https://ord-01.fornsvenska.se` t.o.m. `https://ord-07.fornsvenska.se`
*(samt `http://localhost:*` och `http://127.0.0.1:*` i lokal testmiljö).*

Alla andra origins ignoreras tyst utan svar för att förhindra informationsläckage.

### Meddelandeformat och åtgärder
Varje förfrågan innehåller en unik `requestId` (korrelations-ID):
```typescript
interface BridgeRequestMessage {
  channel: 'fornsvenska:ordlista-v1';
  requestId: string;
  action: 'GET' | 'SAVE' | 'REMOVE' | 'NOTE' | 'CLEAR' | 'IMPORT';
  payload?: { post?: SparatOrdbokOrd; id?: string; anteckning?: string; importeradLista?: SparatOrdbokOrd[] };
}
```

Svaret returneras med samma `requestId`:
```typescript
interface BridgeResponseMessage {
  channel: 'fornsvenska:ordlista-v1';
  requestId: string;
  success: boolean;
  data?: SparatOrdbokOrd[];
  error?: { code: 'BLOCKED' | 'TIMEOUT' | 'FORBIDDEN_ORIGIN' | 'INVALID_PAYLOAD' | 'STORAGE_ERROR'; message: string };
}
```

### Innehållssanitering
Funktionen `sanitizeSavedPost` validerar postens struktur:
* Endast tillåtna ordboksfält (`id`, `headwordDisplay`, `sourceDataset`, `kallaId`, `partOfSpeech`, `snippet`, `sparadDatum`, `anteckning`, `kallText`) accepteras.
* Eventuella otillåtna egenskaper (som cookies, auth-tokens eller externa skript) filtreras bort automatiskt.

---

## 2. Skydd mot överskrivning vid blockerad lagring

En central risk i cross-origin-lagring är webbläsare som blockerar inbäddade iframes från att läsa toplevel-originens data:
1. **Problemet:** Om klienten tolkar ett uteblivet svar eller en tom catch-block som att användaren har noll sparade ord och därefter sparar ett nytt ord, raderas alla tidigare sparade ord (`[] + nytt ord`).
2. **Lösningen i Fornsvenska:**
   * Hjälpsidan i iframen testar lagringsåtkomst (`testStorageAccess()`). Om `localStorage.setItem()` kastar ett `SecurityError` skickas omedelbart felkoden `BLOCKED`.
   * Klienten ([`lib/ordbok/bridgeClient.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/bridgeClient.ts)) fångar `BLOCKED` och sätter flaggan `isBlocked = true`.
   * Klientens ordlistetillstånd lämnas orört – ingen tom array returneras och ingen rensning sker i huvudlagringen.
   * Gränssnittet instruerar användaren att hantera sin ordlista på huvudsajten `https://www.fornsvenska.se/ordbok`.

---

## 3. Dataåterställning och backup via export/import

För att ge användaren fullständig kontroll och skydd mot webbläsarens lokala datacache-rensning finns funktioner för export och import i [`lib/ordbok/bokmarken.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/bokmarken.ts):
* **Export:**
  * **JSON:** Fullständig maskinläsbar säkerhetskopia med alla ID:n, anteckningar, källtexter och datum.
  * **Anki TSV:** Direkt importklara flashcards för språkinlärning.
  * **CSV:** Semikolonavgränsad med UTF-8 BOM för full kompatibilitet med Excel och Numbers.
  * **Klartext:** Printvänlig sammanställning.
* **Import:**
  * Funktionen `importeraSparadeOrdFromJson(jsonStr)` validerar och slår samman importerade poster med befintliga poster.
  * Sorterar automatiskt efter datum fallande.
  * Skriver aldrig över existerande anteckningar om det inte rör samma ord-ID.

---

## 4. Genomförda kontroller

1. **Enhetstester:** 5 av 5 godkända i [`tests/cloudflare-cf04.test.mjs`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/tests/cloudflare-cf04.test.mjs):
   * Godkännande av samtliga 9 tillåtna origins och strikt avvisande av otillåtna origins.
   * Strikt fältsanitering och filtrering av otillåtna attribut/tokens.
   * Fullständigt CRUD-flöde (GET, SAVE, REMOVE, NOTE, CLEAR, IMPORT) över origins.
   * Negativt säkerhetsprov: Blockerad lagring signalerar `BLOCKED` och skriver aldrig över befintlig data med en tom lista.
   * Dataåterställning: Exportera till JSON och återimportera/slå samman utan dataförlust.
2. **Regressionsprov:** Samtliga 171 tester i repot passerar utan anmärkning (`node --import tsx --test tests/*.test.mjs`).
3. **Typkontroll:** `npx tsc --noEmit` passerar felfritt med exit-kod 0.

---

## 5. Kvarstående hinder och nästa startpunkt

* **Molnprov:** Bryggans beteende under verkliga underdomäner på samma domän (`fornsvenska.se`) testas under acceptansfasen när produktionsliknande underdomäner aktiverats.
* **Nästa etapp:** **CF05 – Prova beständig redigering och publicering**. CF05 ska genomföra ett vertikalt prov: logga in i webbläsaren, redigera ett innehållsobjekt, spara beständigt i databasen med RLS, begära publicering och verifiera att publicerad statisk version förblir orörd fram till godkänt bygge.
