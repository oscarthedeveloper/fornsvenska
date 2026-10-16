# Etapp 2 — Datamodell och reproducerbar import

Datum: 2026-10-16  
Importversion: `2026-10-16.v1`

---

## 1. Leverabler i Etapp 2

- [`lib/ordbok/typer.ts`](../../lib/ordbok/typer.ts): Fullständig postmodell (`OrdbokPost`), listpost (`OrdbokListPost`), söklägen och parametrar.
- [`lib/ordbok/normalisering.ts`](../../lib/ordbok/normalisering.ts): Normalisering, ortografiska alias (`th` ↔ `þ`, `dh` ↔ `þ`, `æ` → `ä`, `ø` → `ö`, `w` → `v`) samt Söderwalls lexikografiska sorteringsnyckel.
- [`lib/ordbok/proveniens.ts`](../../lib/ordbok/proveniens.ts): Provenienskonstanter, kontrollsummor, leverantörskvalitetsnoter, verifierade externa länkar och hydreringsfunktion (`hydreraOrdbokPost`).
- [`scripts/import-ordbok.ts`](../../scripts/import-ordbok.ts): Reproducerbart importskript (`npm run import:ordbok`).
- [`supabase/ordbok.sql`](../../supabase/ordbok.sql): Idempotent SQL-schema med separata tabeller för `ordbok_poster` och `ordbok_rattelser`.
- `data/ordbok-rattelser.json`: Separat fil för eventuella framtida redaktionella rättelser med källstöd, så att en omimport av XML-filerna aldrig skriver över rättelser.

---

## 2. Stabil identitet och proveniens

- Varje post får ett deterministiskt, beständigt ID: `${sourceDataset}--${lemgramUtanFsvmPrefix}` (t.ex. `soederwall--a-nn.1` eller `soederwall-supp--a-nn.1`).
- Eftersom huvudverket och supplementet ibland har exakt samma `lemgram` (t.ex. `fsvm--a..nn.1`), garanterar prefixet `soederwall--` respektive `soederwall-supp--` att huvudverk och supplement hålls strikt åtskilda som separata poster.
- Vid importen verifierades **41 744 unika ID:n** och **0 dubletter**.

---

## 3. Validering och avstämning mot källfilerna

| Mätpunkt | Huvudverket (`soederwall`) | Supplementet (`soederwall-supp`) | Totalt |
| --- | --- | --- | --- |
| Källfilens `<LexicalEntry>` | 22 572 | 19 172 | **41 744** |
| Importerade poster | 22 572 | 19 172 | **41 744** |
| Bortfall / förlorade poster | 0 | 0 | **0** |
| Poster utan `<Sense>` (endast `<WordForm>`) | 432 | 593 | **1 025** |
| `<Sense>` utan inre `<Definition>` (text direkt på `<Sense>`) | 38 | 98 | **136** |
| `<Definition>` med flera `<feat att="text">` (konkatenerade) | 878 | 558 | **1 436** |
| Poster med reparerade `orth='...'`-attribut i `<WordForm>` | 7 | 0 | **7** |
| Lösta interna korshänvisningar (`se ...`) | — | — | **2 298** |
| Olösta korshänvisningar (visas som text utan gissad länk) | — | — | **2 249** |

---

## 4. Verifiering av idempotens (två på varandra följande importer)

`npm run import:ordbok` kördes två gånger i följd:
1. Körning 1: 41 744 poster, SHA-256 för `data/ordbok/poster.json`: `302f5d71fd7b8cadc7637fc4b803f6a39fa846cf2f746ca77295d702b9eac4d7`
2. Körning 2: 41 744 poster, SHA-256 för `data/ordbok/poster.json`: `302f5d71fd7b8cadc7637fc4b803f6a39fa846cf2f746ca77295d702b9eac4d7`

Samtliga 43 poster i provurvalet från Etapp 1 (inklusive poster utan `<Sense>`, poster med trasiga `orth=`-attribut och poster med flera `<feat att="text">` i `<Definition>`) återges utan innehållsförlust.
