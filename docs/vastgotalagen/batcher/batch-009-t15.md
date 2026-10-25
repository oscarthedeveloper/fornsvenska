# Batchprotokoll: B06-T15 (Orbotæ mal, hela Balk 6, Inledning t.o.m. § 10)

- **Batch-ID:** `B06-T15`
- **Etapp:** T15 (Orbotæ mal, PDF-sida 8)
- **Datum:** 2026-10-22
- **Källa:** `AVG-MASKIN` (Cod. Holm. B 59, Delsing / SSGL I)
- **Källfilens SHA-256:** `b1065ce2871bf49afa9f3bb046f0a1d053632bd48bffb110f13204cdf48f4f5b`
- **Källintervall:** Orbotæ mal (B06), Inledningen t.o.m. § 10
- **PDF-sida:** 8 (rad 16 t.o.m. rad 31 på s. 8)
- **Startankare:** `# 6 Orbotæ mal. Dræpær maþær man i kirkiu.`
- **Slutankare:** `maþær standær a halsi ok a höfþi ok hæriær man. þæt ær niþingsværk.`
- **Antal segment i batchen:** 4 segment (2 sektioner)
- **Berörd rutt:**
  - `/texter/lagar/aldre-vastgotalagen/orbota-mal`

---

## 1. Segmentförteckning

| Segment-ID | Källställe | Fornsvensk text (fsv) | Svensk tolkning | Status |
| :--- | :--- | :--- | :--- | :--- |
| `avg-b06-punkt01-seg001` | s. 8, Inledn–§ 2 | Dræpær maþær man i kirkiu. þæt ær niþingsværk. orbötæ mal. §.1. Dræpær maþær man i þingi... §.2. Gangær maþær a griþ... | Dräper en man en man i kyrkan, det är nidingsverk och orbötesmål. § 1. Dräper en man en man på tinget... § 2. Bryter man lejd och ingången förlikning... | Slutgranskad |
| `avg-b06-punkt01-seg002` | s. 8, § 3–§ 5 | §.3. Hugger maþær baþær hændær af manni. Dræpær maþær souen man... §.4. [Þ]æt ær niþingsværk at bæræ sculd iuir þangbréccu... §.5. Bindær maþær man i skoghæ... | § 3. Hugger man båda händerna av en man; dräper man en sovande man... § 4. Det är nidingsverk att bära sköld över tångbräckan... § 5. Binder man en man i skogen... | Slutgranskad |
| `avg-b06-punkt01-seg003` | s. 8, § 6 | §.6. Skytær maþær in at lyuræ ok dræpær man. Dræpær .i. löghu. ællær i. bastughu. dræpær. þa han nöte þarwa sinæ. Stingir vt bæþin öghun... Skiær tungu... Hoggær af baþa fötær... Dræpær maþær kono... | § 6. Skjuter man in genom rökluckan och dräper en man; dräper i badet eller i bastun; dräper då någon förrättar sina naturbehov; sticker ut båda ögonen... skär tungan... hugger fötterna... dräper man en kvinna... | Slutgranskad |
| `avg-b06-punkt01-seg004` | s. 8, § 7–§ 10 | §.7. Dræpær maþær lönær droten sin... §.8. Dræpærmaþær man i ölbenk mæþ knivi. sitir vm knif ok kötsticki... §.9. Huggær man bu mans niþær gærs at goruarghær... §.10. Lopær maþær a harskip ok gyærs bunkabitær... | § 7. Dräper man i lönndom sin herre... § 8. Dräper man en man vid ölbänken med kniv medan man delar kniv och köttstycke... § 9. Hugger man ned en mans boskap och gör sig till gorvarg... § 10. Löper man ombord på härskepp och gör sig till bunkabit... | Slutgranskad |

---

## 2. Tvåpassgranskning

### Pass 1: Källtrohet och ortografi
1. **Diplomatarisk textkontroll:** Källtexten på sida 8 rad 16–31 har kontrollerats ord för ord mot `AVG-MASKIN`. Fullständig överensstämmelse uppnådd.
2. **Källfrågetecken:** Initialt `?æt` i § 4 har återgivits som `[Þ]æt` med textkritisk anmärkning i fältet `avvikelser`.
3. **Arkaiska termer:** Former såsom `orbötæ mal`, `niþingsværk`, `þangbréccu`, `lyuræ`, `löghu`, `kötsticki`, `goruarghær` och `bunkabitær` har bevarats oförvanskade i `fsv` och förklarats i kommentarerna.

### Pass 2: Tolkning och sakrättslig analys
1. **Orbötesmål och påföljd:** Katalogen omfattar de brott som ej kunde försonas med böter, utan ledde till livstids fredlöshet samt konfiskation av fast egendom, landsvist och lösöre (*firigiort landi ok lössum öræ*).
2. **Platsfrid och lejd:** Brott mot kyrkofrid, tingsfrid och svuren förlikningsfred.
3. **Landsförräderi:** "Att bära sköld över tångbräckan" (härja sitt eget landskap) utgör tidig svensk högförräderilagstiftning.
4. **Värnlöshet och kvinnofrid:** Förbud mot överfall på sovande, personer i bad/bastu eller toalettbesök, absolut skydd för kvinnor på väg till mässa eller ting, samt förbud mot svek vid delad mat och dryck.

---

## 3. Valideringsresultat
- `npm run validate:texter`: Godkänd (0 fel, 123 segment-ID i storen, varav 112 i AVG).
- `npm run validate:kallor`: Godkänd (0 fel).
- `npx tsx --test tests/validate-texter.test.mjs`: Godkänd (6/6 tester).
- `npx tsc --noEmit`: Godkänd (0 fel).
- `npm run build`: Godkänd (34/34 statiska sidor genererade felfritt).
