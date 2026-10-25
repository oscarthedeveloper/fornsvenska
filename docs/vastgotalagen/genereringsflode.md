# Datamodell och genereringsflöde för Äldre Västgötalagen

Dokumentet fastställer arkitekturen för den kanoniska redigeringskällan och hur `data/textdokument.ts` genereras reproducerbart enligt etapp **T05**.

---

## 1. Principer för en enda redigeringskälla (Single Source of Truth)

1. **Kanonisk källa:**
   - Varje balk/del i Äldre Västgötalagen redigeras som en självständig, versionshanterad JSON-fil i katalogen:
     `data/texter-kallor/vastgotalagen/`
   - Befintliga urval:
     - `kristnu-balker-i.json`
     - `kristnu-balker-ii.json`
     - `arfda-balker.json`
   - Kommande kompletta balkar (t.ex. `b01-kirkiu-bolkaer.json` etc.) placeras i samma katalog.
2. **Genererat gränssnitt:**
   - `data/textdokument.ts` är en **kompilerad artefakt**. Den redigeras aldrig för hand.
   - Körkommando:
     ```bash
     python3 scripts/build_textdokument.py
     ```
   - Skriptet läser alla JSON-filer i `data/texter-kallor/vastgotalagen/`, kombinerar dem med de övriga 11 fornsvenska verken i kanonisk ordning, och genererar TypeScript-modulen `data/textdokument.ts`.
3. **Oförändrade övriga texter:**
   - Inga andra texter i korpusen påverkas eller omformateras vid regenerering.

---

## 2. Utökad datamodell (`lib/text.ts`)

Datamodellen har utökats med bakåtkompatibla, valfria fält för strikt källspårbarhet:

### Mening
```typescript
export interface Mening {
  /** Meningen på fornsvenska, som den står i utgåvan. */
  fsv: string;
  /** Översättning och tolkning. */
  tolkning: string;
  /** Valfri grammatisk anmärkning under tolkningen. */
  kommentar?: string;
  /** Unikt segment-ID för källspårbarhet (t.ex. "avg-b01-punkt01-seg001"). */
  segmentId?: string;
  /** Detaljerad källreferens (t.ex. "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"). */
  kallreferens?: string;
  /** Flaggade avvikelser eller textkritiska anmärkningar för segmentet. */
  avvikelser?: string[];
}
```

### Sektion
```typescript
export interface Sektion {
  rubrik?: string;
  /** Hänvisning till handskrift, blad eller utgåva. */
  hanvisning?: string;
  meningar: Mening[];
  /** Balk- eller avsnitts-identifikator (t.ex. "B01"). */
  balkId?: string;
  /** Sidor i primärkällan (1-baserade, t.ex. [1] eller [1, 2]). */
  pdfSidor?: number[];
  /** Primärkällans punktnummer (t.ex. "1", "2", "§.1."). */
  kallpunkt?: string;
}
```

### Textdokument
```typescript
export interface Textdokument {
  titel: string;
  underrubrik?: string;
  meta?: Nyckelvarde[];
  ingress?: string;
  sektioner: Sektion[];
  fotnoter: Fotnot[];
  /** Markerar innehåll som ännu inte är genomarbetat. */
  utkast?: boolean;
  /** Källidentifikator för utgåvan (t.ex. "AVG-MASKIN"). */
  kallaId?: string;
}
```

---

## 3. Teknisk provpost (Pilotpost för T05)

I `data/texter-kallor/vastgotalagen/kristnu-balker-i.json` har en teknisk provpost applicerats på Sektion 01, Mening 1:
- **Dokument:** `"kallaId": "AVG-MASKIN"`
- **Sektion:**
  - `"balkId": "B01"`
  - `"pdfSidor": [1]`
  - `"kallpunkt": "1"`
- **Mening:**
  - `"segmentId": "avg-b01-punkt01-seg001"`
  - `"kallreferens": "AVG-MASKIN s. 1, Kirkiu Bolkær Punkt 1"`

### Admin- och lagringsskydd
- `components/text/Sektion.tsx` och `components/text/TextView.tsx` använder objekt-spread (`...m, ...delar`), vilket garanterar att nya fält (`segmentId`, `kallreferens`, etc.) inte trunkeras vid administratörsredigering.
- `lib/actions.ts:sparaInnehall` persisterar hela JSON-strukturen till Supabase JSONB-kolumn `content` utan filtrering.
