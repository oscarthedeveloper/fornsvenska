# Cloudflare Pages via Git

## Bygginställningar

I varje Git-anslutet Pages-projekt, välj **Settings → Build → Build configurations**:

- Framework preset: **None**.
- Production branch: `main`.
- Root directory: repots rot (lämna tomt).
- Build command: `npm run build:cloudflare`.
- Node-version: `20` (miljövariabeln `NODE_VERSION`).
- Build output directory enligt tabellen:

| Pages-projekt | Build output directory |
| --- | --- |
| `fornsvenska-www` | `dist/www` |
| `fornsvenska-ord-01` | `dist/ord-01` |
| `fornsvenska-ord-02` | `dist/ord-02` |
| `fornsvenska-ord-03` | `dist/ord-03` |
| `fornsvenska-ord-04` | `dist/ord-04` |
| `fornsvenska-ord-05` | `dist/ord-05` |
| `fornsvenska-ord-06` | `dist/ord-06` |
| `fornsvenska-ord-07` | `dist/ord-07` |

Kör en ny deploy efter att ändringarna har pushats och inställningarna sparats.
Git-anslutna projekt bygger och publicerar oberoende av varandra. Den samordnade
publiceringen av en fryst redaktionsversion med återställning hanteras i stället
av befintlig GitHub Actions-publicering (`workflow_dispatch`). En vanlig Git-deploy
bygger innehållet i repot och hämtar inte redaktionella utkast från databasen.

Bygget genererar sökindex och run-API, bygger Next.js, paketerar huvudsajtens
HTML och API-worker, genererar samtliga 41 744 ordboksartiklar och kontrollerar
filstorlek, filantal och artikelinnehåll i alla åtta mapparna. Ett fel stoppar bygget.

## Felet 2026-11-08: poster.json är 40,1 MiB

Loggens `No build command specified` tillsammans med uppladdning av
`data/ordbok/poster.json` visar att källfiler publicerades utan byggsteget.
Cloudflare tillåter högst **25 MiB per fil**. `poster.json` är byggindata och
ska ligga kvar i repot; den kopieras inte till distributionen. Besökarna får
kompakta sökindex och separata HTML-artiklar.

Publicera endast mappen för respektive projekt. Repots rot, `.next` och hela
`dist` är fel som output directory. Hela `dist` överskrider även filbudgeten
för ett enskilt Pages-projekt.

## Miljö och funktioner

Behåll projektets befintliga miljövariabler och hemligheter. De publika
byggvariablerna `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
och `NEXT_PUBLIC_TURNSTILE_SITE_KEY` behövs för inloggning och kontaktformulär.
Huvudsajtens `_worker.js` och `_routes.json` skapas av byggkommandot och
hanterar API-rutterna; en rotmapp `functions/` behövs därför inte.

Lokala `.env.local` följer inte med Git. Kontrollera även att eventuella lokala,
Git-ignorerade resurser i `public/bocker/` finns tillgängliga i byggmiljön om
de ska ingå i leveransen.

Inställningarna för byggkommando och output directory sparas i Cloudflares
dashboard. Ingen gemensam Wrangler-konfiguration läggs i repots rot eftersom
de åtta projekten har olika output-mappar och egna befintliga bindings.

Källor: [Bygginställningar](https://developers.cloudflare.com/pages/configuration/build-configuration/),
[Pages-gränser](https://developers.cloudflare.com/pages/platform/limits/),
[_worker.js i Advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/).
