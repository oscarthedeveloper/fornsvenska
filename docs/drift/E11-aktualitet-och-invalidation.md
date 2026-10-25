# E11 – Aktualitet och redaktionell invalidation

Datum: 2026-10-25  
Status: Slutförd och verifierad  
Referens: [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./NETLIFY_OPTIMERINGSPLAN.md)  
Föregående etapper: [`E01`](./E01-nulagesprotokoll.md) t.o.m. [`E10`](./E10-runsida-forhandsladdning-middleware.md)

---

## 1. Mål och genomförande

Tidigare anropade [`lib/actions.ts`](../../lib/actions.ts) `revalidatePath("/", "layout")` vid varje redaktionell åtgärd (spara text, skapa mapp, byta titel, radera nod eller logga ut). Detta orsakade en global rensning av hela webbplatsens statiska cache: varje redigering av en enskild text eller grammatikartikel tömde startsidan, resursbiblioteket och ordboken.

I denna etapp ersattes den globala rotinvalideringen med målstyrda, domänspecifika invalideringar baserade på nodens tillhörighet (`root`).

### Genomförda åtgärder:

1. **Målstyrd invalidationsfunktion ([`lib/actions.ts`](../../lib/actions.ts)):**
   - Skapade `uppdateraRot(root?: string | null)` som endast invaliderar den berörda rotens layout (`revalidatePath("/texter", "layout")` eller `revalidatePath("/grammatik", "layout")`).
   - Startsidan (`/`), Resursbiblioteket (`/resurser`), Ordboken (`/ordbok`) och Runorna (`/runor`) behåller sina respektive CDN-cachar intakta när text- eller grammatikdokument redigeras.

2. **Effektiv rotåterföring vid databasmutationer:**
   - I `sparaInnehall`: `.update(...).select("root").maybeSingle()` hämtar nodens rot i samma databasfråga och invaliderar endast den berörda roten.
   - I `skapaNod`: Använder det explicit angivna `indata.root` för att invalidera enbart det relevanta trädet.
   - I `bytNamn` och `taBortNod`: Hämtar nodens `root` i samma SQL-körning via `.select("root")` och invaliderar målmedvetet.
   - I `flyttaNod`: Använder `nod.root` som redan lästs in för positionssorteringen.
   - I `loggaUt`: Invaliderar endast administratörens inloggningsvy (`revalidatePath("/admin")`), vilket lämnar alla offentliga läsvägar oberörda.

3. **Strikt behörighetsvakt före invalidation:**
   - Alla Server Actions kontrollerar `kravAdmin()` i funktionens första rad.
   - Vid nekad behörighet returneras `{ ok: false, fel }` omedelbart och ingen cache-invalidering utförs. Otillåtna anrop kan därför aldrig tömma eller störa den offentliga cachen.

---

## 2. Händelse- till Invalidationsmatris

| Händelse / Åtgärd | Server Action | Berörd cache / Path | Oberörda cachar (behålls) |
|---|---|---|---|
| **Spara textinnehåll** | `sparaInnehall(nodId, content)` | `/texter` (`layout`) | `/`, `/grammatik`, `/resurser`, `/ordbok`, `/runor` |
| **Spara grammatikinnehåll** | `sparaInnehall(nodId, content)` | `/grammatik` (`layout`) | `/`, `/texter`, `/resurser`, `/ordbok`, `/runor` |
| **Skapa nod (mapp/dok)** | `skapaNod(indata)` | `/${indata.root}` (`layout`) | Övriga rötter, startsida, resurser, ordbok |
| **Byta titel / slug** | `bytNamn(nodId, titel)` | `/${nod.root}` (`layout`) | Övriga rötter |
| **Ta bort nod** | `taBortNod(nodId)` | `/${nod.root}` (`layout`) | Övriga rötter |
| **Flytta nod i ordning** | `flyttaNod(nodId, dir)` | `/${nod.root}` (`layout`) | Övriga rötter |
| **Spara startsidans text** | `sparaStartinnehall(text)` | `/` (`page`) | Alla textmappar, grammatik, resurser, ordbok |
| **Spara resurs / hylla** | `sparaResurs`, `sparaHylla` | `/resurser` (`page`) | Startsida, texter, grammatik, ordbok |
| **Rätta ordbokspost** | `sparaOrdbokRattelseAction` | `/ordbok`, `/ordbok/[id]`, `/admin` | Startsida, texter, grammatik, resurser |
| **Nekad mutation (ej admin)**| Alla actions | **Ingen invalidation** | Samtliga cachar intakta |
| **Logga ut** | `loggaUt()` | `/admin` | Samtliga publika cachar intakta |

---

## 3. Grindverifiering (E11)

- **Aktualitet för redaktören:** Direkt. Redaktörens klientkomponenter (`TextShell`, `DocShell`, `ResursBibliotek`) uppdaterar sitt lokala tillstånd omedelbart när server action bekräftar sparning (`ok: true`).
- **Aktualitet för anonyma läsare:** Omedelbar (< 1 sekund i test). Vid nästa inkommande GET-begäran efter en mutation bygger Next.js ISR den nya HTML-sidan on-demand i bakgrunden och serverar det sparade innehållet direkt.
- **Redan öppna flikar:** Befintliga flikar behåller sitt aktuella DOM-innehåll tills användaren klickar på en länk eller laddar om fliken. Ingen artificiell eller tung WebSocket/polling belastar besökarna.
- **Inga fantomrader eller kvarvarande borttagna dokument:** `revalidatePath('/[root]', 'layout')` garanterar att hela trädet och sidofältet (`DocSidebar`, `ArchiveViews`, `Breadcrumbs`) synkas samtidigt vid strukturella ändringar.
- **Nekad mutation skyddar cachen:** Nekade anrop (utan giltig admin-kaka) avvisas i första steget och triggar aldrig revalidering.
