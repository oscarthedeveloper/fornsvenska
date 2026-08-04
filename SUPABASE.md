# Koppla in Supabase

Fyra steg. Ta dem i ordning — schemat måste finnas innan seed-skriptet körs.

## 1. Installera de nya paketen

```bash
npm install
```

Detta hämtar `@supabase/supabase-js`, `@supabase/ssr` och `tsx` (för
seed-skriptet). Utan det startar inte utvecklingsservern.

## 2. Kör schemat

Öppna Supabase → **SQL Editor** → klistra in hela `supabase/schema.sql` och kör.
Den skapar två tabeller:

- `nodes` — mappar och dokument i samma tabell, dokumentinnehållet som JSONB
- `admins` — vilka användare som får skriva

Radsäkerhet är påslagen: **alla får läsa, bara administratörer får skriva.**

## 3. Skapa ditt konto

1. **Authentication → Users → Add user.**
   E-post: `oscar@fornsvenska.local` (byt `oscar` mot det användarnamn du vill
   logga in med). Kryssa i **Auto Confirm User**.
2. Kör i SQL Editor:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'oscar@fornsvenska.local'
   on conflict do nothing;
   ```

3. **Authentication → Providers → Email:** slå **av** "Enable sign ups", så att
   ingen annan kan registrera sig.

Inloggningen på `/admin` frågar efter användarnamn, inte e-post. Appen lägger
till `@fornsvenska.local` åt dig — domänen styrs av `NEXT_PUBLIC_ADMIN_EPOSTDOMAN`
i `.env.local`.

## 4. Importera innehållet

Hämta servicenyckeln i **Project Settings → API → service_role** och lägg in den
i `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

Kör sedan:

```bash
npm run seed
```

Skriptet lägger in hela mappstrukturen och de tre skrivna dokumenten. Det
vägrar skriva över en rot som redan har innehåll — kör `SEED_FORCE=1 npm run seed`
om du vill ersätta allt.

Servicenyckeln behövs bara här. Den går förbi alla säkerhetsregler, så dela den
aldrig och lägg aldrig ett `NEXT_PUBLIC_`-prefix på den. `.env.local` ligger
redan i `.gitignore`.

---

## Så fungerar redigeringen

Logga in på `/admin`. Därefter syns en list längst ned till höger på alla sidor
med knappen **Redigera**. Slår du på den:

**I arkivet** kan du byta namn på mappar och dokument direkt på flikarna,
flytta dem upp och ned med pilarna, ta bort dem med krysset, och skapa nya med
**+ Mapp** och **+ Dokument**. Pilen → öppnar posten (i redigeringsläget är
flikarna inte längre klickbara i sin helhet, eftersom knappar inte får ligga
inuti en länk).

**I ett dokument** klickar du rakt i texten och skriver. Mellan blocken finns
tunna infogningsrader — håll musen där så dyker knapparna upp för rubrik,
stycke, tvåspalt, tabell, OBS-ruta och nyckelvärden. Varje block har pilar och
kryss till vänster. Tabeller får rader och kolumner med knapparna under dem, och
den runda knappen i varje rad markerar den raden.

**I ett textdokument** redigeras varje mening för sig, och du lägger till
meningar och sektioner med knapparna. Färgerna följer meningens ordningsnummer
automatiskt.

Allt sparas automatiskt drygt en halv sekund efter att du slutat skriva.
Listen längst ned visar *Sparar…*, *Sparat* eller ett felmeddelande.

## Om något går fel

- **"Du är inte inloggad som administratör"** — du är inloggad men saknas i
  tabellen `admins`. Kör insert-satsen i steg 3.
- **Innehållet ser ut som förut trots seed** — Next cachar; starta om
  `npm run dev`.
- **Ingen sparknapp syns** — sajten läser fortfarande från filerna. Det händer
  om `.env.local` saknar nycklar eller om databasen är tom; då används
  `data/`-filerna som reserv och redigering är avstängd.
