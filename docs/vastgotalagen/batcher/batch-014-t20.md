# Batchprotokoll: B11-T20 (Huru mylnu skal gæræ, hela Balk 11)

- **Batch-ID:** `B11-T20`
- **Etapp:** T20 (Huru mylnu skal gæræ, PDF-sida 18)
- **Datum:** 2026-10-22
- **Källa:** `AVG-MASKIN` (Cod. Holm. B 59, Delsing / SSGL I)
- **Källfilens SHA-256:** `b1065ce2871bf49afa9f3bb046f0a1d053632bd48bffb110f13204cdf48f4f5b`
- **Källintervall:** Huru mylnu skal gæræ (B11), Inledning t.o.m. § 8
- **PDF-sida:** 18 (rad 26 t.o.m. rad 44)
- **Startankare:** `# 11 Huru mylnu skal gæræ Uill maþær mylnu gæræ...`
- **Slutankare:** `Iorþ ma eigh at mutu takæ.`
- **Antal segment i batchen:** 3 segment (3 sektioner i 1 dokument)
- **Berörd rutt:**
  - `/texter/lagar/aldre-vastgotalagen/mylnu-balker`

---

## 1. Segmentförteckning

| Segment-ID | Källställe | Fornsvensk text (fsv) | Svensk tolkning | Status |
| :--- | :--- | :--- | :--- | :--- |
| `avg-b11-punkt01-seg001` | s. 18, Inledn–§ 1 | Uill maþær mylnu gæræ han ma eig sua gæræ at topt annærs manss spillis eig akri. eig æng eig væghum mannæ. eig forta grannæ... §.1. fiskigarþi ma ok eig sua gæræ... | Vill en man bygga en kvarn, må han icke göra det så att en annans tomt skadas, ej åker, ej äng, ej människors vägar, ej grannars forta... | Slutgranskad |
| `avg-b11-punkt01-seg002` | s. 18, § 2–§ 3 | §.2. Mylnu staþer ligær öþe. þrea uettær allær þrim vættrum længær æru fang af roten... viti mæþ tvænni tylptum at stiborþ. stoþu ok stulpær... §.3. Delæ mæn vm mylnu stad... | § 2. Ligger ett kvarnställe öde i tre vintrar eller längre än tre vintrar och äro virket och anläggningen bortmultnade... § 3. Tvista män om ett kvarnställe... | Slutgranskad |
| `avg-b11-punkt01-seg003` | s. 18, § 4–§ 8 | §.4. Gær maþær mylnu i almænnisz vattni... þridiungær löss faræ af vattni... §.5. Takæ grænnær almænnig in firi mylnu dörom... §.6. Maþer gær myulnu... §.7. Vatn skal eigh vændæ af fornu fari... §.8. Iorþ ma eigh at mutu takæ. | § 4. Bygger man kvarn i allmänt vatten... då skall en tredjedel av vattnet löpa fritt (kungsådran)... § 7. Vatten skall man icke vända ur sin gamla fåra... § 8. Jord må man icke taga med mutor. | Slutgranskad |

---

## 2. Tvåpassgranskning

### Pass 1: Källtrohet och ortografi
1. **Diplomatarisk textkontroll:** Samtliga rader i Balk 11 (sida 18 rad 26 t.o.m. rad 44) har granskats ord för ord mot `AVG-MASKIN`. Alla ordformer, arkaiska stavningar och skiljetecken stämmer exakt.
2. **Källavgränsning och övergång:** Texten inleds omedelbart efter Punkt 20 i Jordabalken och avslutas exakt före rubriken `# 12 ?ætta ær. þiuuæ bollkær` på rad 46. Inga frågetecken förekommer i B11.

### Pass 2: Tolkning och sakrättslig analys
1. **Grannelagsrätt och översvämningsskydd:** Förbud mot att dämma så att tomt, åker, äng, vägar, forta (byallmänning), äldre kvarnar eller fiskeverk skadas (*spillis*). Ensamrätt för dammägaren att fiska i kvarndammen.
2. **Ödekvarnar och preskription:** Treårig förfallotid (*þrea uettær*); bevarande av timmerverk (stigbord/dammluckor, stolpar, trösklar, ränna/hjulhus) bryter preskriptionen med två tolfter. Företrädesrätt för den som först uppför verk på allmänning.
3. **Kungsådran i fornnordisk rätt:** Den äldsta svenska kodifieringen av kungsådrans princip (*þridiungær löss faræ af vattni*): en tredjedel av strömfåran i allmänt vatten skall lämnas öppen medan två tredjedelar må dämmas.
4. **Landfäste och kvarndörr:** Krav på laga köp av landfäste på motstående strandbrink (*landfæstu mæþ fæst ok vmfærþ*); rätt till tillfartsväg framför kvarndörr vid intaga på allmänning.
5. **Naturflödesskydd:** Förbud mot att avleda vatten ur dess naturliga fåra (*fornu fari*) till grannars men, samt förbud mot mutor vid jordförvärv.

---

## 3. Valideringsresultat
- `npm run validate:texter`: Godkänd (0 fel, 213 segment-ID i storen, varav 200 i AVG).
- `npm run validate:kallor`: Godkänd (0 fel).
- `npx tsx --test tests/validate-texter.test.mjs`: Godkänd (6/6 tester).
- `npx tsc --noEmit`: Godkänd (0 fel).
- `npm run build`: Godkänd (34/34 statiska sidor genererade felfritt).
