# Åtgärder av Cloudflare-blockerare, 2026-11-01

Lokala kodblockerare har åtgärdats. Miljön är ännu inte godkänd för produktionsflytt. Ingen produktionspublicering, DNS-ändring eller installation av den nya databasschemat har utförts.

## Genomförda ändringar

- Pages-distributionen innehåller statisk sökning, `/admin`, Nexts navigationsdata, artikelstilar/typsnitt samt en separat API-worker. Uppladdningen använder de verkliga katalogerna `dist/ord-01`–`dist/ord-07` och `dist/www`.
- Alla artiklar innehåller läsbar HTML. Sökresultat går till respektive artikelvärd. Bokmärken använder den gemensamma bryggan på huvudvärden, bevarar anteckningar och skriver inte över skadad lagring med en tom lista. Bryggan kontrollerar både origin och avsändarfönster.
- `supabase/cloudflare-editorial.sql` inför beständiga dokument, revisionshistorik, optimistiska skrivkonflikter, administratörskontroll/RLS, frysta publiceringsjobb och beständiga kontaktkvoter. SQL-installationen är lokalt provad i PostgreSQL via PGlite, inklusive omstart.
- Ingen administratör tilldelas längre om konfiguration saknas. Redaktionen läser alla dokument i paginerade anrop. Publiceringsbegäran svarar att jobbet är köat; framgång rapporteras först efter verifierade uppladdningar.
- Bygget använder jobbets frysta innehåll och Git-revision. Utkast läcker inte genom live-DB-läsningar. Käll-, dokument-, run- och ordboksvalidering körs före bygge.
- CI publicerar endast ett beständigt, autentiserat jobb. Vanlig push validerar. Åtta verkliga Pages-projekt verifieras, innehåll publiceras före huvudsajten och kompensationsåterställning försöks vid fel. Det finns ingen global atomär transaktion över åtta projekt; återställningsfel sparas och måste hanteras.
- Kontakt kräver Turnstile, beständig kvotreservation och verkligt Resend-svar. Saknad konfiguration ger fel i stället för simulerad leverans. Versionsbundna run-API-anrop stöds av workern; vanliga läsningar använder statiska filer.
- De gamla minnesbaserade redaktions-/publiceringsklasserna finns kvar som testmodeller, inte som produktionsimplementation.

## Redaktörsgränssnittets begränsning

Den statiska redaktionen är för närvarande en central JSON-editor på `/admin`, med inloggning, dokumentval, revisionskontroll och publiceringsstatus. Tidigare inbäddade redigeringsknappar är avstängda i statisk leverans. Detta är en ändrad arbetsgång som behöver användargranskas; ett komplett motsvarande visuellt redigeringsgränssnitt är inte belagt av testerna.

## Lokal verifiering

- Produktionsbygge och TypeScript utan fel. Hela testsamlingen: **224 godkända, 0 fel, 0 överhoppade**.
- Källvalidering, textvalidering och validering av byggunderlag godkända.
- Samtliga 41 744 artiklar kontrolleras för HTML, rubrik och canonical; alla projekt kontrolleras för filbudget, filstorlek och samma release-ID.
- Största ordprojekt: 13 819 filer, gräns 16 000. Huvudsajten innehåller 308 verifierade rutter.
- Nya integrationstester provar faktisk SQL/RLS, omstart, revisionskonflikt, frysta jobb, beständig kontaktkvot, API-broker med autentisering/idempotens, statiska run-API-svar samt den verkliga bryggans JavaScript. Nätverk mot GitHub/Resend i enhetstester är ersatt; testerna bevisar inte molnleverans.
- Webbläsarprov från en lokal statisk filserver: sökning efter `kirkia` ger två träffar med artikelvärdslänkar, `/admin` nekar användning utan konfiguration och intern navigering till grammatik fungerar. Referensbild: `referensbilder/2026-11-01-statisk-sokning.png`.

## Kvar före molnacceptans

1. Återställ Supabases SQL-åtkomst. Projektverktyget visade aktivt projekt efter uppväckning, men tabellanslutningen gav fortsatt `ECONNREFUSED`. Inga fjärrändringar gjordes. Installera därefter den additiva SQL-filen, granska befintliga administratörer och kör den additiva bootstrapen. `node --import tsx scripts/cloudflare/seed-editorial.ts` är en torrkörning med 316 basposter; `--apply` kräver tjänstebehörighet och skriver inte över befintliga poster.
2. Konfigurera byggvariabler: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Konfigurera Pages-workerns hemligheter enligt `Env` i `lib/cloudflare/worker.ts`: Supabase-nycklar, GitHub-token/repository/ref, Turnstile-hemlighet/hostname, Resend/avsändare/mottagare och IP-salt. Verifiera avsändardomänen. Tjänstenycklar får inte läggas i publika byggvariabler.
4. Konfigurera GitHub Actions med Cloudflare-token/konto-ID, Supabase-tjänstenyckel och ovanstående publika byggvariabler. Skapa de åtta testprojekten med produktionsgren `main` och en verifierad initial driftsättning så att varje projekt har ett faktiskt återställningsmål före första ordinarie publicering.
5. Prova inloggning → spara → omstart → godkänna → köa → GitHub → samtliga Pages-projekt → synligt innehåll. Prova avbrutet bygge, delvis misslyckad publicering och återställning på testmiljö. Bekräfta kvoter med verklig kontoförbrukning.
6. Prova ordlistebryggan mellan verkliga underdomäner, inklusive Safari/blockerad lagring, kontaktleverans och extern run-API-kompatibilitet. Slutför acceptans och användargranskning före eventuell produktions-DNS.

Historiska CF00–CF14-rapporter är prototypunderlag och får inte tolkas som bevis för dessa återstående molnprov.
