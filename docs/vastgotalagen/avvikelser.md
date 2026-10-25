# Avvikelserapport och Källkartläggning: Äldre Västgötalagen

Datum: 2026-10-22  
Etapp: **T03 – Kartlägg befintliga utdrag mot källan**  
Referenskälla: `Källor/Västgötalagen i maskintext.pdf` (AVG-MASKIN, 25 sidor, SHA-256 `b1065ce2871bf49afa9f3bb046f0a1d053632bd48bffb110f13204cdf48f4f5b`)  
Befintliga filer: `data/textdokument.ts` (3 dokument, 32 `Mening`-poster)

---

## 1. Sammanfattning av kartläggningen

De tre befintliga dokumenten under `lagar/aldre-vastgotalagen/` är **pedagogiska urval och antologiutdrag**, inte kompletta balkar:
1. `kristnu-balker-i` (11 meningar) återger endast delar av **B01 Punkt 1** på PDF-sida 1.
2. `kristnu-balker-ii` (11 meningar) återger spridda utdrag ur **B01 Punkterna 2, 3, 5, 6 och 7** i **icke-kronologisk källordning** (Punkt 2 → 5 → 6 → 3 → 7).
3. `arfda-balker` (10 meningar) återger **B07 Punkt 1** samt **Punkt 12**, där Punkt 12 felaktigt betecknats som "§2" i sektionshänvisningen.

Av källans totalt **165 inventerade punkter** berör de befintliga utdragen endast delar av **7 punkter**. Återstående **158 punkter** saknas helt i dagens webbplats.

---

## 2. Detaljerad täckningsmatris för de 32 befintliga posterna

| Ref-ID | Befintlig källa & hänvisning | Faktiskt källställe | PDF-sida | Källstatus & avvikelse |
|:---|:---|:---|:---:|:---|
| `kristnu-i-s1-m1` | Kirkiu §1 (Inledning) | B01 pt 1 | s. 1 | Inledningsraden `1. Her byriarz laghbok væsgöta` saknas före meningen |
| `kristnu-i-s1-m2` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar; interpunktion avskalad |
| `kristnu-i-s1-m3` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar; interpunktion avskalad |
| `kristnu-i-s2-m1` | Kirkiu §1 (Dopet) | B01 pt 1 | s. 1 | Matchar |
| `kristnu-i-s2-m2` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar; källan har `guðfæþur oc guðmoþor` |
| `kristnu-i-s2-m3` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar |
| `kristnu-i-s2-m4` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar; källan har `kirkiu. dyr.` |
| `kristnu-i-s3-m1` | Kirkiu §1 (Nöddop) | B01 pt 1 | s. 1 | Matchar; interpunktion mellan satser saknas |
| `kristnu-i-s3-m2` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar |
| `kristnu-i-s3-m3` | Kirkiu §1 | B01 pt 1 | s. 1 | Matchar |
| `kristnu-i-s3-m4` | Kirkiu §1 | B01 pt 1 | s. 1 | Slutar före källans fysiska lakun `{oc arf...}` som kapats |
| `kristnu-ii-s1-m1` | Kirkiu §2 & §5 | B01 pt 2 | s. 1 | Inleds efter källans lakun `{...ræ æn}`; matchar källan |
| `kristnu-ii-s1-m2` | Kirkiu §2 & §5 | B01 pt 2 | s. 1 | Matchar |
| `kristnu-ii-s1-m3` | Kirkiu §2 & §5 | B01 pt 5 | s. 1 | Hopp från punkt 2 till punkt 5 (punkterna 3 och 4 hoppas över) |
| `kristnu-ii-s2-m1` | Kirkiu §6 | B01 pt 6 | s. 2 | Matchar; hopp från s. 1 till s. 2 |
| `kristnu-ii-s2-m2` | Kirkiu §6 | B01 pt 6 | s. 2 | Matchar |
| `kristnu-ii-s2-m3` | Kirkiu §6 | B01 pt 6 | s. 2 | Matchar |
| `kristnu-ii-s2-m4` | Kirkiu §6 | B01 pt 6 | s. 2 | Matchar |
| `kristnu-ii-s3-m1` | Kirkiu §3 & §7 | B01 pt 3 | s. 1 | Hopp tillbaka till punkt 3 på s. 1; texten är anakronistiskt placerad |
| `kristnu-ii-s3-m2` | Kirkiu §3 & §7 | B01 pt 7 | s. 2 | Hopp fram till punkt 7 på s. 2 |
| `kristnu-ii-s3-m3` | Kirkiu §3 & §7 | B01 pt 7 | s. 2 | Matchar |
| `kristnu-ii-s3-m4` | Kirkiu §3 & §7 | B01 pt 7 | s. 2 | Matchar |
| `arfda-s1-m1` | Ærfþa §1 (Arvsföljd) | B07 pt 1 | s. 8 | Matchar källans punkt 1 |
| `arfda-s1-m2` | Ærfþa §1 | B07 pt 1 | s. 8 | Matchar |
| `arfda-s1-m3` | Ærfþa §1 | B07 pt 1 | s. 8 | Matchar; flera satser sammanfogade |
| `arfda-s1-m4` | Ærfþa §1 | B07 pt 1 | s. 8 | Matchar |
| `arfda-s1-m5` | Ærfþa §1 | B07 pt 1 | s. 8 | Matchar slutet på punkt 1 |
| `arfda-s2-m1` | Anges som "§2" | B07 pt 12 | s. 9 | **Felaktig hänvisning**: Källan har Punkt 12 (Romresan), ej §2 |
| `arfda-s2-m2` | Anges som "§2" | B07 pt 12 | s. 9 | Matchar punkt 12 |
| `arfda-s2-m3` | Anges som "§2" | B07 pt 12 | s. 9 | Matchar punkt 12 |
| `arfda-s2-m4` | Anges som "§2" | B07 pt 12 | s. 9 | Matchar punkt 12 |
| `arfda-s2-m5` | Anges som "§2" | B07 pt 12 | s. 10 | Matchar punkt 12; fortsätter över till s. 10 |

---

## 3. Systematiska avvikelser och åtgärdspunkter

### AVV-01: Uteslutning av lagens inledande rubrik (Prioritet: Hög)
- **Beskrivning:** Källans första punkt inleds med `1. Her byriarz laghbok væsgöta`. Denna rad har utelämnats i `kristnu-balker-i`, vilket gör att lagens självdeklarerade titel försvunnit.
- **Åtgärd i T08:** Raden återförs i den sammanhängande källutgåvan som punktens inledning, med pedagogisk förklaring.

### AVV-02: Källans lakuner `{oc arf...}` och `{...ræ æn}` har klippts bort (Prioritet: Hög)
- **Beskrivning:** Dopavsnittet i källan avslutas med `{oc arf...}` där handskriften skadats. I `kristnu-balker-i` klipptes meningen av före lakunen. I `kristnu-balker-ii` börjar nästa sektion mitt i den avbrutna meningen utan att visa `{...ræ æn}`.
- **Åtgärd i T08:** Återge källans faktiska tecken och förklara lakunen sakligt i källnoten.

### AVV-03: Felaktig paragrafhänvisning i Ærfþa balkær (Prioritet: Medel)
- **Beskrivning:** Sektion 02 i `arfda-balker` anger hänvisningen *"Cod. Holm. B 59, Ærfþa balkær §2 (Romresan och Greklandsfararen)"*. I källan är detta i själva verket **Punkt 12** på sida 9. Mellan punkt 1 och punkt 12 finns tio andra paragrafer (punkterna 2–11) som helt saknas i urvalet.
- **Åtgärd i T16:** Hänvisningen korrigeras till källans faktiska punktnummer (Punkt 12) och luckan (punkterna 2–11) fylls i den sammanhängande utgåvan.

### AVV-04: Icke-kronologisk ordning i Kristnu balkær, del II (Prioritet: Medel)
- **Beskrivning:** Utdraget i `kristnu-balker-ii` hoppar fram och tillbaka i källan: Punkt 2 (s. 1) → Punkt 5 (s. 1) → Punkt 6 (s. 2) → Punkt 3 (s. 1) → Punkt 7 (s. 2).
- **Åtgärd i T08–T10:** Den befintliga URL:en `/texter/lagar/aldre-vastgotalagen/kristnu-balker-ii` bevaras för bakåtkompatibilitet, men den nya sammanhängande läsningen av Kirkiu Bolkær presenteras i strikt källordning (Punkterna 1–22).

### AVV-05: Förlust av källans interpunktion och skiljetecken (Prioritet: Låg)
- **Beskrivning:** Källans punkter och skiljetecken har på flera ställen städats bort i `fsv` för att ge ett renare modernt intryck.
- **Åtgärd i T04:** Fastställa transkriptionsregler som bevarar källans skiljetecken i grundtexten `fsv` och förlägger normalisering till tolkningen.
