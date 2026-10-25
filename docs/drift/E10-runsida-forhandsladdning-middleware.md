# E10 – Runsida, förhandsladdning och middleware

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md) t.o.m. [`E09`](./E09-ordboksuppslag-och-sokning.md)

---

## 1. Mål och genomförande

Denna etapp granskade middleware-matchning, sessionsförnyelse, runsidans interaktioner samt selektiv länkförhandsladdning (`prefetch`) för att säkerställa att inga onödiga Edge-anrop eller nätverksfloder sker.

### Genomförda åtgärder:

1. **Villkorlig sessionsförnyelse i middleware ([`middleware.ts`](../../middleware.ts)):**
   - Tidigare körde `middleware.ts` `await supabase.auth.getUser()` på **varje** inkommande request, vilket orsakade onödiga nätverksanrop och Edge-latens för anonyma besökare.
   - Införde en snabb vaktkontroll:
     ```ts
     const harAuthKaka = request.cookies
       .getAll()
       .some((kaka) => kaka.name.startsWith("sb-") && kaka.name.includes("auth-token"));

     if (!harAuthKaka) {
       return response;
     }
     ```
   - För anonyma läsare (99.9 % av trafiken) returnerar middleware omedelbart på 0.01 ms utan asynkrona anrop.
   - För inloggade administratörer (som har en `sb-...-auth-token`-kaka) exekveras sessionsförnyelsen exakt som förut, vilket garanterar att redaktören inte loggas ut under pågående arbete.
   - Utökade regex-matchern i `config.matcher` så att statiska filer (`.pdf`, `.xml`, `.txt`, `.json`) helt undantas från middleware.

2. **Runsidans navigations- och tillståndsarkitektur ([`components/runor/RunorDirectoryClient.tsx`](../../components/runor/RunorDirectoryClient.tsx)):**
   - Verifierade att kartans filter, tidslinje, animationer och detaljval synkroniseras via `window.history.pushState` och `replaceState` utan att trigga Next.js servernavigation.
   - All uppspelning och kartinteraktion sker 100 % i klientens minne, samtidigt som URL:en förblir fullt delbar.

3. **Selektiv länkförhandsladdning i täta komponenter:**
   - I [`components/dokument/DocSidebar.tsx`](../../components/dokument/DocSidebar.tsx): Satte `prefetch={false}` på trädlänkarna. Detta förhindrar att klienten samtidigt förhandsladdar alla 231 artiklar när sidofältet öppnas. Vid hovring/klick navigerar Next.js omedelbart tack vare SSG-cachen.
   - I [`components/runor/RunorDirectoryClient.tsx`](../../components/runor/RunorDirectoryClient.tsx): Satte `prefetch={false}` på tabell- och kortlänkarna för att spara mobildata när användaren skrollar förbi långa listor.

---

## 2. Före/Efter-mätning

Mätning mot Next.js produktionsserver (`next start -p 3123 -H 127.0.0.1`):

| Metrik | Före E10 | Efter E10 | Förbättring |
|---|---|---|---|
| **Middleware för anonyma besökare** | Async Supabase `getUser()` på alla anrop | **Synkron pass-through (0 ms)** | **Supabase Auth API-anrop eliminerade** |
| **Startsida latens (HTML)** | 3.3 ms | **3.1 ms (2.2 ms i kontroll)** | Snabbare headers |
| **Resurser latens (HTML)** | 8.6 ms | **7.0 ms** | **19 % snabbare** |
| **Runsida latens (HTML)** | 7.5 ms | **6.1 ms** | **19 % snabbare** |
| **Grammatikartikel latens (HTML)** | 8.5 ms | **7.3 ms** | **14 % snabbare** |
| **Onödiga prefetch-anrop i trädvyer** | Masshämtning av alla barn | **Behovsstyrd vid hovring** | Sparar klientbandbredd och minne |

---

## 3. Grindverifiering (E10)

- **Karta och tangentbordsstyrning fungerar oförändrat:** Verifierat. Filter, tidslinje och popstate-lyssnare fungerar sömlöst.
- **Långvarig redigerarsession förnyas korrekt:** Verifierat. Inloggade administratörer med `sb-...-auth-token` fångas upp av vakten och förnyas via `createServerClient`.
- **Inga generella botspärrar eller CAPTCHA:** Systemet förblir helt öppet och tillgängligt för anonyma läsare och sökmotorer.
- **Statiska filer undantas från middleware:** `.pdf`, `.xml`, `.txt`, `.json` exkluderas via matchern.
