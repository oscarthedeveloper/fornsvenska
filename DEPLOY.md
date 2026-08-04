# Deploy till Netlify

Repot är initierat, allt är committat och fjärradressen pekar på
`github.com/oscarthedeveloper/fornsvenska`. Kvar är push och koppling.

## 1. Push till GitHub

Skapa repot på GitHub först om det inte finns — **privat**, och **utan** att
kryssa i README, .gitignore eller licens. Ett tomt repo, annars krockar
historiken.

Sedan, i terminalen i projektmappen:

```bash
git push -u origin main
```

VS Code frågar efter inloggning första gången. Har du GitHub-tillägget kan du
lika gärna använda **Source Control → Publish Branch**.

## 2. Koppla Netlify

1. Netlify → **Add new site → Import an existing project → GitHub**
2. Välj `fornsvenska`. Ge Netlify åtkomst till just det repot.
3. Bygginställningarna läses från `netlify.toml` och ska redan stämma:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node: 20

   Rör dem inte. Netlify känner igen Next.js och lägger till sin runtime själv.

## 3. Miljövariabler i Netlify

**Site configuration → Environment variables.** Lägg in exakt tre:

| Nyckel | Värde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://woezrcirqbickpqoduck.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon-nyckeln, samma som i din `.env.local` |
| `NEXT_PUBLIC_ADMIN_EPOSTDOMAN` | `fornsvenska.local` |

**Lägg INTE in `SUPABASE_SERVICE_ROLE_KEY`.** Den behövs bara av seed-skriptet
på din egen dator och går förbi alla säkerhetsregler i databasen. Den har
ingenting på en webbserver att göra.

Utan de här tre variablerna byggs sajten ändå — men den läser då från filerna i
`data/` och redigeringsläget är avstängt. Det är ett medvetet reservläge, inte
ett fel.

## 4. Kontrollera efter första bygget

- Startsidan fyller en skärm utan att rulla
- `/grammatik` visar hängmapparna med det innehåll du lagt in via admin, inte
  filinnehållet — syns tydligast om du bytt namn på något
- `/admin` går att logga in på med användarnamn och lösenord
- Redigeringslisten dyker upp längst ned till höger efter inloggning

Blir det gammalt filinnehåll som visas: miljövariablerna saknas eller är
felstavade. Netlify bygger om automatiskt när du ändrar dem.

## 5. Domänen, när du har den

Netlify ger dig en adress i stil med `fornsvenska.netlify.app` direkt. När du
köpt `fornsvenska.se`:

1. Netlify → **Domain management → Add a domain** → `www.fornsvenska.se`
2. Netlify visar vilka poster som ska sättas hos den du köpt domänen av:
   - `www` som **CNAME** till din Netlify-adress
   - roten `fornsvenska.se` som **A** till Netlifys IP, eller ALIAS/ANAME om
     din leverantör stödjer det
3. Certifikatet (HTTPS) ordnar Netlify själv när posterna slagit igenom, oftast
   inom en timme.

Ingenting i Supabase behöver ändras för att byta domän — inloggningen använder
lösenord, inte e-postlänkar, så det finns inga omdirigeringsadresser att hålla
uppdaterade.

## Löpande arbete

```bash
git add -A
git commit -m "Beskrivning av ändringen"
git push
```

Netlify bygger om vid varje push till `main`. Innehåll du skriver via admin
ligger i Supabase och påverkas inte av deployer — texterna försvinner alltså
inte när du bygger om.

## Det som inte följer med i repot

`.env.local`, `node_modules`, `.next`, samt `_instruktioner.pdf` och `_sidor/`
(din PDF och mina renderingar av den). De två sista ligger kvar på din dator
men hör inte till sajten — ta bort dem när du vill.
