# Metadata-matris för Fornsvenska.se (S05, S06, S08, S09, S10)

Datum: 2026-10-25  
Status: Implementerad och lokalt verifierad mot produktionsbygge  
Referens: [`docs/seo/GOOGLE_GENOMFORANDEPLAN.md`](./GOOGLE_GENOMFORANDEPLAN.md)

---

## 1. Systemöversikt

All metadata styrs centralt via Next.js 14 Metadata API med `metadataBase: new URL("https://www.fornsvenska.se")` i `app/layout.tsx`. Layout-templaten `%s | Fornsvenska.se` säkerställer enhetlig domänsignatur utan duplicering. Varje route har en explicit självpekande canonical länk och meningsfull sammanfattning.

---

## 2. Fullständig matris över sidfamiljer

| Sidfamilj | Exempel-route | Titelskapande | Beskrivning | Kanonisk URL | Indexeringspolicy |
|---|---|---|---|---|---|
| **Startsida** | `/` | `Fornsvenska – texter, ordbok och grammatik \| Fornsvenska.se` | Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov. | `https://www.fornsvenska.se/` | `index, follow` |
| **Grammatik: rot** | `/grammatik` | `Fornsvensk grammatik — ljudlära, böjningslära och syntax` (layout ger `\| Fornsvenska.se`) | Systematisk grammatik över fornsvenskan i 193 artiklar och 38 mappar. Ljudlagar, fyrkasussystemet, starka och svaga verb, ordföljd och historisk språkutveckling. | `https://www.fornsvenska.se/grammatik` | `index, follow` |
| **Grammatik: mapp** | `/grammatik/substantiv` | `${node.title} — Grammatik` | `${node.note}. Översikt och grammatiska artiklar inom ämnesområdet ${node.title.toLowerCase()}.` | `https://www.fornsvenska.se/grammatik/substantiv` | `index, follow` |
| **Grammatik: artikel** | `/grammatik/substantiv/fyrkasussystemet/nominativ` | `${dokument.titel}${underrubrik}` | Utdrag ur artikelns faktiska ingress (max 150–160 tecken vid ordgräns). | `https://www.fornsvenska.se/grammatik/substantiv/fyrkasussystemet/nominativ` | `index, follow` |
| **Texter: rot** | `/texter` | `Fornsvenska textarkivet — lagar, urkunder och runinskrifter` | Källkritiska utgåvor av fornsvenska texter med diplomatisk text, normaliserad fornsvenska, modern översättning och filologiska kommentarer. | `https://www.fornsvenska.se/texter` | `index, follow` |
| **Texter: mapp/verk** | `/texter/lagar/aldre-vastgotalagen` | `${node.title} — Texter` | `${node.note}. Källkritiska fornsvenska utgåvor och handskriftsmaterial.` | `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen` | `index, follow` |
| **Texter: utgåva** | `/texter/lagar/aldre-vastgotalagen/kristnu-balker-i` | `${textTitel}${textUnderrubrik}` | Utdrag ur textens faktiska ingress (balkens innehåll, handskrift, språkdrag). | `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen/kristnu-balker-i` | `index, follow` |
| **Resurser: bibliotek** | `/resurser` | `Resursbibliotek — litteratur och skrifter` | Läroböcker, examensarbeten, avhandlingar och medeltida skrifter om fornsvenska, med besked om hur tillgängligt varje material är. | `https://www.fornsvenska.se/resurser` | `index, follow` |
| **Resurser: bokläsare** | `/resurser/vastgotalagen` | `Äldre Västgötalagen — bokvy` | Läs hela Äldre Västgötalagen i maskintext, uppslag för uppslag, efter Cod. Holm. B 59. | `https://www.fornsvenska.se/resurser/vastgotalagen` | `index, follow` |
| **Ordbok: huvudsida** | `/ordbok` | `Ordbok — Söderwalls fornsvenska ordbok` | Sökbar utgåva av K. F. Söderwalls Ordbok öfver svenska medeltids-språket (1884–1918) och Supplementet (1925–1973) med 41 744 uppslagsord baserad på Språkbankens digitala LMF-resurser. | `https://www.fornsvenska.se/ordbok` | `index, follow` |
| **Ordbok: artikel** | `/ordbok/soederwall--bonde-nn.1` | `${post.headwordDisplay}${homonym} — ${band}` | Kurerad förklaring eller renad ordbokstext + uppslagsord, band och ordklass. | `https://www.fornsvenska.se/ordbok/soederwall--bonde-nn.1` | `index, follow` |
| **Källor: alias** | `/kallor` | Omdirigering (308/301 -> `/resurser`) | - | - | Exkluderas ur sitemap |
| **Administration** | `/admin` och `/admin/runor` | `Administration` | - | `https://www.fornsvenska.se/` | `noindex, nofollow` |
| **Runor (pågående)** | `/runor` och `/runor/[slug]` | `Sveriges runinskrifter` | Digital textutgåva och källkatalog baserad på SRI och Samnordisk runtextdatabas. | `https://www.fornsvenska.se/runor` | Lokalt arbete, exkluderas ur sitemap tills driftsatt |

---

## 3. Faktiskt verifierade testresultat (lokalt produktionsbygge)

Verifierat genom anonyma HTTP-anrop mot `http://localhost:3009` (Next.js 14.2.5 production build):

### Startsida (`/`)
- **Titel:** `Fornsvenska – texter, ordbok och grammatik | Fornsvenska.se`
- **Beskrivning:** `Språkhistorisk studieplattform för fornsvenska. Källkritiska textutgåvor, Söderwalls ordbok och systematisk grammatik med historiska språkprov.`
- **Canonical:** `https://www.fornsvenska.se`

### Grammatikartikel (`/grammatik/substantiv/fyrkasussystemet/nominativ`)
- **Titel:** `Nominativ – Subjekt, subjektivt predikativ och tilltalsform | Fornsvenska.se`
- **Beskrivning:** `Nominativ är det grammatiska grundkasuset i fornsvenskan och bär framför allt satsens subjekt och subjektiva predikativ. I stark maskulin böjning…`
- **Canonical:** `https://www.fornsvenska.se/grammatik/substantiv/fyrkasussystemet/nominativ`

### Textutgåva (`/texter/lagar/aldre-vastgotalagen/kristnu-balker-i`)
- **Titel:** `Kristnu balkær, del I – Äldre Västgötalagen, inledningen och dopet (Cod. Holm. B 59) | Fornsvenska.se`
- **Beskrivning:** `Balkens inledning fastslår den kristna trons och kyrkans primat i det västgötska lagsamhället. Texten är skriven på arkaisk äldre fornsvenska med…`
- **Canonical:** `https://www.fornsvenska.se/texter/lagar/aldre-vastgotalagen/kristnu-balker-i`

### Ordboksartikel (`/ordbok/soederwall--bonde-nn.1`)
- **Titel:** `bonde (1) — Söderwalls huvudverk | Fornsvenska.se`
- **Beskrivning:** `Fri jordbrukare och hemmansägare med fulla medborgerliga rättigheter och tingsrätt i medeltidssamhället. Fornsvenskt uppslagsord i Söderwalls huvudverk (nn).`
- **Canonical:** `https://www.fornsvenska.se/ordbok/soederwall--bonde-nn.1`

### Administration (`/admin`)
- **Titel:** `Administration | Fornsvenska.se`
- **Robots:** `noindex, nofollow`
- **Canonical:** `https://www.fornsvenska.se`
