# E05 – Inför säker offentlig dataläsning

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md), [`E02`](./E02-besokarresor-fore-andring.md), [`E03`](./E03-routematris-och-cachehinder.md), [`E04`](./E04-separation-av-session-och-layout.md)

---

## 1. Problem och arkitektur

### Problemet före ändringen:
När databaskällan var aktiv (`NEXT_PUBLIC_DATA_SOURCE=supabase` eller `HAR_SUPABASE`) använde alla dataläsare funktionen `skapaServerKlient()`.  
`skapaServerKlient()` anropar `cookies()` från `next/headers` för att läsa eventuella användarkakor.  
Detta innebar att:
1. Även rent offentlig läsning (startsida, textkatalog, grammatikartiklar, resurskatalog och ordboksposter) läste webbläsarens kakor.
2. Next.js tolkade varje dataläsning som användarspecifik och stängde av full route caching / statisk generering.
3. Eventuell cachning av svar hämtade med administratörskaka riskerade att läcka data eller spara behörighetsberoende utkast i en delad cache.

### Lösning:
Införande av [`skapaPublikServerKlient()`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/supabase/server.ts):
- Använder enbart anonym nyckel (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Läser **aldrig** `cookies()`.
- Sätter `auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }`.
- Säkerställer att Next.js Server Components kan läsa från databasen utan att markera renderingsresultatet som användar- eller kakberoende.
- Filtrerar explicit bort opublicerade utkast (`.eq("utkast", false)`) vid publika dataläsningar.

---

## 2. Genomförda ändringar

1. **[`lib/supabase/server.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/supabase/server.ts):**
   - Skapade `skapaPublikServerKlient()` som returnerar en ren `@supabase/supabase-js`-klient utan kakor.
2. **[`lib/sidor.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/sidor.ts):**
   - Ersatte `skapaServerKlient()` med `skapaPublikServerKlient()` i `hamtaStartinnehall()`.
3. **[`lib/archive.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/archive.ts):**
   - Ersatte `skapaServerKlient()` med `skapaPublikServerKlient()` i `getRoot()` och `hamtaInnehall()`.
4. **[`lib/resurser.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/resurser.ts):**
   - Ersatte `skapaServerKlient()` med `skapaPublikServerKlient()` i `hamtaBibliotek()`.
   - Lade till explicit filtrering `.eq("utkast", false)` vid resursfrågan så att interna utkast aldrig når publika användare.
5. **[`lib/ordbok/ordbokDb.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/ordbok/ordbokDb.ts):**
   - Ersatte `skapaServerKlient()` med `skapaPublikServerKlient()` i `hamtaOrdbokPostDb()`, `sokOrdbokDb()` och `hamtaBokstavsStatistikDb()`.
6. **[`lib/runor/server.ts`](file:///Users/oscarpagerup/Desktop/Git%20Repo/fornsvenska/lib/runor/server.ts):**
   - Använder `skapaPublikServerKlient()` för den publika läsningen av `svenska_runor_editions`.

---

## 3. Grindverifiering (E05)

- **Säker behörighetsseparation:** Två olika webbläsarsessioner och en anonym klient får identiskt och korrekt publikt innehåll. Inga sessionscookies skickas med publika frågor.
- **Skydd för utkast:** Publika läsningar exkluderar strikt opublicerade rader (`utkast: false` / `published: true`).
- **Skrivskydd och admin förblir oförändrat:** Alla mutationer i Server Actions (`lib/actions.ts`, etc.) och administrationssidor (`/admin`, `/admin/runor`) fortsätter använda `skapaServerKlient()` och verifierar `arAdmin` på servern.
- **Kvalitets- och byggkontroll:** `npm run validate:kallor`, `npm run validate:texter`, samtliga runtester och `npm run build` passerade utan anmärkning.
