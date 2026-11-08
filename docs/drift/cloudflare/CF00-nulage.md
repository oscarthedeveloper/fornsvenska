# CF00 – nuläge och återställningsbar baslinje

Datum: 2026-10-30. Status: **lokalt verifierad baslinje**. Moln och fullständig interaktionsacceptans är inte verifierade.

## Omfattning och utgångspunkt

Användarens uppdrag är att starta ombyggnaden etappvis. Underlagen används som planeringsunderlag; deras historiska formuleringar om användarbeslut är inte nya tillstånd att ändra konton eller produktion.

Arbetsgren: `codex/cloudflare-ombyggnad`. HEAD vid start: `4237cd31f49bcf7fd12b52b4855b7eed9c647b96`, samma som inventeringen. Endast de tre Cloudflare-underlagen var ospårade före arbetet. De har bevarats oförändrade. Inga tillämpliga AGENTS.md hittades i repositoryt eller de kontrollerade föräldrakatalogerna. Ingen applikationskod eller innehållsdata ändrad i denna etapp.

Maskinresultat finns i [CF00-baslinje.json](./CF00-baslinje.json). Miljö: macOS arm64, Node 24.21.0, npm 11.19.0. Låsfil: Next 14.2.5, React 18.3.1, TypeScript 5.9.3, Supabase JS 2.112.0. Versionsintervall i package.json är inte installerade versioner.

## Återställning

En lokal backup finns i `/private/tmp/fornsvenska-cf00-20261030/`: `content.tar.gz` och `manifest.json`. 126 filer från `data/`, `public/`, `lib/runor/` och de tre underlagen; 25 398 485 byte komprimerat. Varje arkivmedlems SHA-256 kontrollerades mot manifestet. Inga miljöfiler, sessionsuppgifter eller DB-backuper ingår. Detta är lokal innehållsbackup, inte produktionsbackup. Temporärkatalogen kan rensas av operativsystemet; kopiera backupen till beständig privat lagring före migrering.

Återskapa koden i en separat katalog med `git clone --no-hardlinks <lokalt-repository> <ny-katalog>` och `git checkout 4237cd31f49bcf7fd12b52b4855b7eed9c647b96`. Kör `npm ci` från oförändrad låsfil. Packa upp innehållsbackupen i den nya katalogen, aldrig över pågående arbete. Kontrollera filernas SHA-256 mot manifestet. Backupen innehåller även ignorerade offentliga boktillgångar som Git ensam inte återställer. Produktionsdata kräver separat CF02-export innan migrering.

## Verifiering

| Kontroll | Resultat |
|---|---|
| `node scripts/cloudflare/baseline.mjs` | Samma ordbokschecksumma, 41 744 unika ID:n och 67 publika filer som inventeringen |
| `npx tsc --noEmit` | Godkänd, exit 0 |
| `node --import tsx --test tests/*.test.mjs` | 158 godkända, 0 fel, 0 överhoppade; cirka 3,0 s |
| `node --import tsx scripts/validate-kallor.ts` | Godkänd: 193 grammatikdokument, 38 mappar; inga blockerande fel |
| `node --import tsx scripts/validate-texter.ts` | Godkänd: 377 meningar, 285 explicit registrerade segment-ID:n |
| `npm run build` | Godkänd, exit 0; 316 genererade sidor enligt byggloggen |
| `npm run start -- --hostname 127.0.0.1 --port 3123` | Lokalt produktionsbygge startat och öppnat i webbläsaren |

De vanliga npm-valideringskommandona misslyckades först på tsx:s IPC-socket med EPERM i sandboxen. Direkt `node --import tsx` körde samma skript utan socketbehov och passerade. Detta var ett miljöhinder, inget konstaterat valideringsfel. Lokal HTTP-server och skapande av Git-gren krävde utökad sandboxåtkomst och godkändes. Bygget varnar om stor sträng i webpack-cache. Ingen kodändring gjordes för att dölja varningen.

Råloggar finns lokalt som `/tmp/fornsvenska-cf00-{types,build,tests,kallor,texter,server}.log`. De kopieras inte okontrollerat till Git. Det befintliga `scripts/test-ordbok-search.ts` innehåller skrivprov för rättelser/definitioner och kördes inte mot arbetskopians innehåll. Det bör senare köras i isolerad kopia.

## Datakällor och begränsningar

`lib/archive.ts`, `lib/sidor.ts`, `lib/resurser.ts` och `lib/ordbok/ordbokDb.ts` väljer Supabase först när publik URL/nyckel finns och `NEXT_PUBLIC_DATA_SOURCE=supabase`. Arkivet har dessutom filreserv vid tomt DB-svar/fel. Runor har separat DB-/filreserv och möjlighet till administrativ utkastläsning. Därför kan lyckad rendering inte bevisa produktionsparitet.

Den testade processens `/admin` anger att publik Supabase-URL och anonym nyckel saknas. Lokal läsning sker från filunderlag; inloggning, RLS, beständig webbredigering och DB-export kan inte verifieras här. Ordredaktionens rättelser och moderna definitioner har lokala filskrivningar. Personlig ordlista använder `fornsvenska_sparade_ord_v1` i localStorage. Full ombyggnad måste bevara dessa data och ersätta filskrivningen med verifierad beständig lagring.

## Leverans och nästa startpunkt

Nya filer: denna rapport, STATUS.md, CF00-baslinje.json, FUNKTIONSMATRIS.md, `referensbilder/*.png` och `scripts/cloudflare/baseline.mjs`. Referensbilderna är lokala vyer i in-app-webbläsaren, cirka 667 px bred bildyta; inga mobil- eller nätprestandapåståenden görs.

Nästa etapp är CF01: kontrollera aktuella officiella gränser och faktisk kontoåtkomst; dokumentera byggbudget för hela releasekedjan. CF02 kan därefter förberedas lokalt men får inte godkännas som produktionsparitet utan aktuell DB-export. CF03–CF05 och arkitekturlåsning CF06 får inte betraktas som verifierade utifrån denna baslinje.
