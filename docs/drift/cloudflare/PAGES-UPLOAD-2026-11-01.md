# Initial uppladdning till Cloudflare Pages

Användaren begärde uppladdning till konto `56623d142691aa2621a7d8503db9304e` och medgav uttryckligen Wrangler-behörigheterna Pages Write, Account Read, User Read och Background Access. Övriga breda Wrangler-standardbehörigheter beviljades inte.

Åtta Direct Upload-projekt skapades med produktionsgren `main`: `fornsvenska-www` och `fornsvenska-ord-01`–`fornsvenska-ord-07`.

Detta är en initial granskningsleverans på `pages.dev`, separat från den ordinarie publiceringskedjans beständiga redaktionsjobb. Produktions-DNS är inte ändrad och leveransen innebär inte att CF12–CF14 är godkända.

## Byggunderlag

Den tidigare validerade distributionen innehåller 41 744 artiklar och 308 huvudrutter. Ny distributionskontroll kördes före uppladdning. `scripts/cloudflare/prepare-pages-preview.py` gör en isolerad kopia i `/private/tmp/fornsvenska-cloudflare-upload`, byter sajtens värdnamn till de åtta Pages-adresserna och lägger till `X-Robots-Tag: noindex`. Kanonisk `dist` ändras inte. Uppladdningen görs med Wrangler 4.45.0 och explicit projektnamn/konto/gren.

Huvudadress: https://fornsvenska-www.pages.dev

## Begränsningar

- Kontakt kräver fortfarande Turnstile, verifierad Resend-avsändare, hemligheter och beständigt kvotlager. Leverans är inte verifierad.
- Webbredaktionen kräver Supabase-konfiguration, installerat schema och verifierad administratör. Den centrala JSON-editorns arbetsgång kräver användargranskning.
- `pages.dev`-projekten är separata webbläsarsajter. Ett bokmärkesprov här ersätter därför inte same-site-prov på de verkliga underdomänerna. Befintliga användarordlistor på `www.fornsvenska.se` överförs inte till granskningsadressen.
- Återställning, hela CI-kedjan, faktisk månadsförbrukning och produktions-DNS är inte godkända genom denna uppladdning.

Se `PAGES-UPLOAD-2026-11-01-verifiering.json` för genomförda HTTP-kontroller efter leverans och `BLOCKERARE-2026-11-01.md` för återstående driftarbete.

## Verifierat resultat

Alla åtta uppladdningar slutfördes. Tolv HTTP-kontroller godkändes, inklusive artikel från varje grupp och noindex-header. Startsida och intern navigering verifierades i webbläsaren; sökning efter `kirkia` gav två träffar och rätt artikel kunde öppnas. Run-API svarade 200, saknad sida 404 och okonfigurerad kontakt 503 utan att påstå leverans. Referensbild: `referensbilder/2026-11-01-pages-startsida.png`.
