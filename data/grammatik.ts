import type { Node } from "@/lib/typer";

const doc = (slug: string, title: string, note?: string): Node => ({ slug, title, kind: "doc", note });
const folder = (slug: string, title: string, note: string, children: Node[]): Node => ({
  slug, title, kind: "folder", note, children,
});

/**
 * Fullständig innehållsarkitektur och studieordning. Befintliga sökvägar till
 * dativ och nominativ är bevarade.
 */
export const GRAMMATIK: Node[] = [
  folder("introduktion", "Att studera fornsvenska", "Avgränsning, källor och arbetssätt", [
    doc("vad-ar-fornsvenska", "Vad är fornsvenska?", "Period, område och språkstadium"),
    doc("periodisering", "Periodisering", "Runsvenska, äldre och yngre fornsvenska"),
    doc("kallor-och-texttyper", "Källor och texttyper", "Lagar, diplom, handskrifter och runinskrifter"),
    doc("variation", "Variation i materialet", "Tid, ort, genre och skrivare"),
    doc("notation", "Notation och normalisering", "Originalform, normaliserad form och rekonstruktion"),
    doc("grammatiska-termer", "Grammatiska termer", "Referens för språkvetenskapliga begrepp"),
    doc("sa-anvands-grammatiken", "Så används grammatiken", "Regler, paradigm, belägg och övningar"),
  ]),

  folder("ljudlara", "Ljudlära", "Ljudsystemet som förklaring till böjningsformerna", [
    doc("ljud-och-skrift", "Ljud och skrift", "Vad stavningen kan säga om uttalet"),
    folder("vokaler", "Vokaler", "Kvalitet, kvantitet och växling", [
      doc("vokalsystemet", "Vokalsystemet", "Korta och långa vokaler"),
      doc("kvantitet", "Kvantitet och stavelselängd", "Ljudlängd och böjningsmönster"),
      doc("diftonger", "Diftonger", "Runsvenska och fornsvenska utvecklingar"),
      doc("omljud", "Omljud", "i-, u- och a-omljud i böjningen"),
      doc("brytning", "Brytning", "Vokalväxlingar av typen e > ia, iæ"),
      doc("vokalbalans", "Vokalbalans och vokalharmoni", "Ändelsevokaler efter stamstavelsen"),
      doc("reduktion", "Ändelsevokalernas reduktion", "Sammanfall mellan a, i, u och e"),
    ]),
    folder("konsonanter", "Konsonanter", "System och morfologiskt viktiga förändringar", [
      doc("konsonantsystemet", "Konsonantsystemet", "Klusiler, frikativor, nasaler och likvidor"),
      doc("thorn-och-t", "Från þ till t", "Fonologisk och ortografisk förändring"),
      doc("palatalt-r", "Palatalt r och nominativändelsen", "Variation mellan -r, -er och noll"),
      doc("inskottskonsonanter", "Inskottskonsonanter", "b, p, t och d i böjda former"),
      doc("assimilation", "Assimilation och konsonantmöten", "Formväxling vid morfemgränser"),
    ]),
  ]),

  folder("ortografi", "Ortografi och textläsning", "Skrivsystem, handskrifter och utgåvor", [
    doc("runor-och-latinskrift", "Runor och latinsk skrift", "Två skriftsystem och deras räckvidd"),
    doc("alfabet-och-grafem", "Alfabet och grafem", "þ, ð, æ, ø och andra tecken"),
    doc("handskriftsbruk", "Handskriftsbruk", "Variation mellan skrivare och texter"),
    doc("forkortningar", "Förkortningstecken", "Abbreviaturer och suspensioner"),
    doc("interpunktion", "Ordgränser och interpunktion", "Hur texten segmenteras"),
    doc("diplomatisk-normaliserad", "Diplomatisk och normaliserad text", "Vad en utgåva förändrar"),
    doc("textkritik", "Textkritik och handskriftsvarianter", "Original, avskrift och edition"),
  ]),

  folder("morfologins-grunder", "Morfologins grunder", "Begreppen som används i all böjningslära", [
    doc("morfem-stam-andelse", "Morfem, stam och ändelse", "Hur en böjd form delas upp"),
    doc("bojning-och-ordbildning", "Böjning och ordbildning", "Två typer av morfologisk struktur"),
    doc("grammatiska-kategorier", "Grammatiska kategorier", "Kasus, genus, numerus, species, tempus och modus"),
    doc("stark-och-svag", "Stark och svag böjning", "Vad termerna betyder i olika ordklasser"),
    doc("allomorfi", "Allomorfi och stamväxling", "Omljud, avljud och konkurrerande ändelser"),
    doc("kongruens", "Kongruens", "Hur ord i samma fras får samstämmiga former"),
    doc("paradigm", "Att läsa ett paradigm", "Form, funktion och tomma ändelser"),
  ]),

  folder("substantiv", "Substantiv", "Genus, numerus, kasus, species och stamklasser", [
    doc("oversikt", "Substantivens böjningssystem", "Den samlade nominalmorfologin"),
    folder("genus", "Genus", "Maskulinum, femininum och neutrum", [
      doc("maskulinum", "Maskulinum", "Formella kännetecken och kongruens"),
      doc("femininum", "Femininum", "Formella kännetecken och kongruens"),
      doc("neutrum", "Neutrum", "Formella kännetecken och kongruens"),
      doc("genusvariation", "Genusvariation", "Osäkra och föränderliga genus"),
    ]),
    doc("numerus", "Numerus", "Singularis och pluralis"),
    folder("fyrkasussystemet", "Fyrkasussystemet", "Kasusens former, funktioner och växelbruk", [
      doc("oversikt", "Kasussystemets uppbyggnad", "Strukturellt, semantiskt och lexikalt kasus"),
      doc("nominativ", "Nominativ", "Subjekt och subjektivt predikativ"),
      doc("genitiv", "Genitiv", "Attribut, partitiv och rektion"),
      doc("dativ", "Dativ", "Indirekt objekt, rektion och semantiska funktioner"),
      doc("ackusativ", "Ackusativ", "Direkt objekt, predikativ, riktning och tid"),
      doc("kasussynkretism", "Kasussynkretism", "Former där flera kasus sammanfaller"),
    ]),
    folder("starka", "Starka substantiv", "Vokalstammar och rotnomina", [
      doc("a-stammar-maskulinum", "Maskulina a-stammar", "Typ fisker"),
      doc("a-stammar-neutrum", "Neutrala a-stammar", "Typ skip"),
      doc("ja-wa-stammar", "ja- och wa-stammar", "Stammar med halvokal"),
      doc("i-stammar", "i-stammar", "Maskulina och feminina mönster"),
      doc("u-stammar", "u-stammar", "Maskulina och feminina mönster"),
      doc("o-stammar", "ō-stammar", "Feminina vokalstammar"),
      doc("rotstammar", "Rotstammar", "Omljud och ändelselös stam"),
      doc("r-stammar", "r-stammar", "Släktskapsord"),
      doc("nd-stammar", "nd-stammar", "Personbeteckningar på -nd-"),
    ]),
    folder("svaga", "Svaga substantiv", "Konsonantstammar med enhetlig oblik böjning", [
      doc("an-stammar", "an-stammar", "Maskulina och neutrala mönster"),
      doc("on-stammar", "ōn-stammar", "Feminina mönster"),
      doc("in-stammar", "īn-stammar", "Feminina abstrakter"),
      doc("svaga-maskuliner-e-a", "Svaga maskuliner på -e och -a", "Variation och förändring"),
    ]),
    folder("bestamd-form", "Bestämd form", "Slutartikel och dubbel böjning", [
      doc("slutartikelns-ursprung", "Slutartikelns ursprung", "Från demonstrativ till böjningsmorfem"),
      doc("slutartikelns-bojning", "Slutartikelns böjning", "Genus, numerus och kasus"),
      doc("fullstandig-bestamd-form", "Fullständig bestämd form", "Substantiv och artikel i samma paradigm"),
      doc("artikelvariation", "Variation i artikelbruket", "Nakna, enkla och dubbelt bestämda nominalfraser"),
    ]),
    doc("oregelbundna", "Oregelbundna substantiv", "Högfrekventa och avvikande paradigm"),
    doc("runsvenska-former", "Substantiv i runsvenskan", "Feminina paradigm och övergången till fornsvenska"),
    doc("medeltida-runinskrifter", "Substantiv i medeltida runinskrifter", "Belagda stammar och tidiga sammanfall"),
    doc("substantivens-forandring", "Substantivböjningens förändring", "Från stamklass och kasus till modern deklination"),
  ]),

  folder("adjektiv", "Adjektiv", "Kongruens, stark och svag böjning samt komparation", [
    doc("oversikt", "Adjektivens böjningssystem", "Genus, numerus, kasus och species"),
    doc("stark-bojning", "Stark böjning", "Obestämd och självständig användning"),
    doc("svag-bojning", "Svag böjning", "Bestämd användning"),
    doc("kongruens", "Adjektivkongruens", "Samstämmighet med huvudordet"),
    doc("attributiv-predikativ", "Attributiv och predikativ böjning", "Adjektivets syntaktiska ställning"),
    doc("komparation", "Komparation", "Positiv, komparativ och superlativ"),
    doc("oregelbunden-komparation", "Oregelbunden komparation", "Suppletiva och stamväxlande former"),
    doc("adjektiviska-particip", "Particip som adjektiv", "Kongruens och bestämdhet"),
    doc("adjektivens-forandring", "Adjektivböjningens förändring", "Kasussammanfall och förenklad kongruens"),
  ]),

  folder("pronomen", "Pronomen och determinativer", "Referens, deixis och nominal böjning", [
    doc("oversikt", "Pronomensystemet", "Huvudgrupper och böjningskategorier"),
    doc("personliga", "Personliga pronomen", "Person, numerus och kasus"),
    doc("dualis", "Dualis", "Former för två referenter"),
    doc("reflexiva", "Reflexiva pronomen", "sik, sær och reflexiv betydelse"),
    doc("possessiva", "Possessiva pronomen", "Kongruens och reflexiv possessivitet"),
    doc("demonstrativa", "Demonstrativa pronomen", "Deixis och bestämdhet"),
    doc("interrogativa", "Interrogativa pronomen", "Frågeordens former"),
    doc("relativa", "Relativa pronomen och partiklar", "Relativ anknytning"),
    doc("indefinita", "Indefinita pronomen", "Någon, ingen, annan och kvantifierande former"),
    doc("reciproka", "Reciproka uttryck", "Ömsesidig referens"),
    doc("personreferens", "Personreferens i text", "Egennamn, nominalfras och pronominalisering"),
    doc("pronomensystemets-forandring", "Pronomensystemets förändring", "Kasusbortfall och nya referensmönster"),
  ]),

  folder("rakneord", "Räkneord", "Böjning och syntaktiskt bruk", [
    doc("grundtal", "Grundtal", "Former och böjning"),
    doc("ordningstal", "Ordningstal", "Bildning och böjning"),
    doc("en-tva-tre-fyra", "En, två, tre och fyra", "Särskilda genus- och kasusformer"),
    doc("bada-och-andra", "Båda och andra kvantifierande former", "Gränsen mot pronomen och adjektiv"),
    doc("rakneord-i-fras", "Räkneord i nominalfrasen", "Kongruens och kasus"),
  ]),

  folder("verb", "Verb", "Konjugation, tempus, modus, diates och kongruens", [
    doc("oversikt", "Verbens böjningssystem", "Stamformer och grammatiska kategorier"),
    folder("person-och-numerus", "Person och numerus", "Finita verbformer och subjektkongruens", [
      doc("personandelse", "Personändelser", "Första, andra och tredje person"),
      doc("numerusandelse", "Numerusändelser", "Singularis och pluralis"),
      doc("personkongruens", "Personkongruens", "Kongruens mellan subjekt och verb"),
      doc("kongruensbortfall", "Kongruensbortfallet", "Vilka former överlever och varför"),
    ]),
    folder("tempus", "Tempus", "Presens, preteritum och sammansatta tidsformer", [
      doc("presens", "Presens", "Bildning och användning"),
      doc("preteritum", "Preteritum", "Starkt och svagt preteritum"),
      doc("perfekt-och-pluskvamperfekt", "Perfekt och pluskvamperfekt", "Hjälpverb och particip"),
      doc("framtid", "Framtidsuttryck", "Presens och modala konstruktioner"),
    ]),
    folder("modus", "Modus", "Indikativ, konjunktiv och imperativ", [
      doc("indikativ", "Indikativ", "Omarkerad framställning"),
      doc("konjunktiv", "Konjunktiv", "Former och huvudfunktioner"),
      doc("konjunktiv-at-satser", "Konjunktiv i at-satser", "Icke-faktiva predikat och diakron förändring"),
      doc("imperativ", "Imperativ", "Person- och numerusformer"),
    ]),
    folder("infinita-former", "Infinita former", "Infinitiv, particip och verbalsubstantiv", [
      doc("infinitiv", "Infinitiv", "Form och syntaktiskt bruk"),
      doc("presens-particip", "Presens particip", "Bildning på -ande/-ænde"),
      doc("preteritum-particip", "Preteritum particip", "Stark och svag bildning"),
      doc("participkongruens", "Participkongruens", "Genus, numerus, kasus och passiv betydelse"),
    ]),
    folder("starka-verb", "Starka verb", "Avljud och sju huvudklasser", [
      doc("avljud", "Avljudssystemet", "Stamvokalernas funktion"),
      ...[1, 2, 3, 4, 5, 6, 7].map((n) => doc(`klass-${n}`, `Starka verb: klass ${["I", "II", "III", "IV", "V", "VI", "VII"][n - 1]}`, n === 7 ? "Reduplicerande och ombildade verb" : `Avljudsklass ${n}`)),
    ]),
    folder("svaga-verb", "Svaga verb", "Dentalsuffix och konjugationsklasser", [
      doc("svag-klass-1", "Svaga verb: klass I", "Verb av typen kalla"),
      doc("svag-klass-2", "Svaga verb: klass II", "Verb med j och stamväxling"),
      doc("svag-klass-3", "Svaga verb: klass III", "Långstaviga verb och tre dentalmönster"),
      doc("svag-klass-4", "Svaga verb: klass IV", "Restklassen med bland annat liva"),
      doc("dentalsuffix", "Dentalsuffixets former", "ð, d, t och assimilation"),
    ]),
    doc("preteritopresentia", "Preteritopresentiska verb", "skulu, mughu, vita och närstående verb"),
    folder("oregelbundna", "Oregelbundna verb", "Suppletion och särskilda paradigm", [
      doc("vara", "vara", "Verbet vara/vera/vesa"),
      doc("hava", "hava", "Former och hjälpverbsbruk"),
      doc("gora", "göra", "Stamvariation och böjning"),
      doc("ga-och-sta", "gå och stå", "Särskilda stamformer"),
    ]),
    folder("diates-och-reflexivitet", "Diates och reflexivitet", "Aktiv, passiv och reflexiva former", [
      doc("s-passiv", "s-passiv", "Från reflexivt pronomen till verbändelse"),
      doc("perifrastisk-passiv", "Perifrastisk passiv", "varda, bliva och particip"),
      doc("reflexiva-verbformer", "Reflexiva verbformer", "sik/sær och enklitiska former"),
    ]),
    folder("hjalpverb", "Hjälpverb och verbkedjor", "Modalitet, tempus och passiv", [
      doc("modala-hjalpverb", "Modala hjälpverb", "skula, mugha, vilja och kunna"),
      doc("varda", "varda", "Kopula, förändring och passiv"),
      doc("bliva", "bliva", "Från ‘förbli’ till förändringsverb och hjälpverb"),
    ]),
    doc("verbbojningens-forandring", "Verbböjningens förändring", "Utjämning av person, numerus och modus"),
  ]),

  folder("adverb", "Adverb", "Bildning, böjning och grammatikalisering", [
    doc("adverbens-bildning", "Adverbens bildning", "Kasusformer, avledning och lexikalisering"),
    doc("adverbial-kasusformer", "Kasusformer som adverb", "Genitiv och dativ i fasta uttryck"),
    doc("komparation", "Adverbens komparation", "Komparativ och superlativ"),
    doc("lagom", "lagom", "Från dativform till adverb, adjektiv och substantiv"),
  ]),

  folder("prepositioner", "Prepositioner", "Rektion, betydelse och kasusväxling", [
    doc("oversikt", "Prepositionernas kasusstyrning", "Genitiv, dativ och ackusativ"),
    doc("med-genitiv", "Prepositioner med genitiv", "Bland annat til och fasta uttryck"),
    doc("med-dativ", "Prepositioner med dativ", "Bland annat af, mæþ och at"),
    doc("med-ackusativ", "Prepositioner med ackusativ", "Riktning, mål och um"),
    doc("dativ-ackusativ", "Dativ–ackusativ-växling", "Befintlighet och riktning"),
    doc("rektionens-forandring", "Rektionens förändring", "Ackusativens expansion och kasusförlust"),
  ]),

  folder("konjunktioner", "Konjunktioner och subjunktioner", "Samordning och underordning", [
    doc("samordnande", "Samordnande konjunktioner", "ok, æn och andra förbindare"),
    doc("underordnande", "Subjunktioner", "at, æn, um och bisatsinledning"),
    doc("at", "at", "Infinitivmärke, subjunktion och grammatiskt bruk"),
  ]),

  folder("negation", "Negation", "Negationsordens former och syntaktiska utveckling", [
    doc("ei", "ei och eigi", "Fristående och klitisk negation"),
    doc("akke", "äkke", "Från nominalt uttryck till satsnegation"),
    doc("enkte", "enkte", "Distribution och grammatikalisering"),
    doc("negationscykel", "Negationens förändring", "Konkurrens mellan negationsorden"),
  ]),

  folder("ordbildning", "Ordbildning", "Avledning, sammansättning och ordklassväxling", [
    doc("sammansattning", "Sammansättning", "Förleder, efterleder och fogning"),
    doc("substantivavledning", "Substantivavledning", "Produktiva avledningsmönster"),
    doc("adjektivavledning", "Adjektivavledning", "Bildning av egenskapsord"),
    doc("verbavledning", "Verbavledning", "Kausativa och andra verbbildningar"),
    doc("ordklassvaxling", "Ordklassväxling", "Lexikalisering och grammatikalisering"),
    doc("namnbildning", "Namn och binamn", "Sammansättning och semantisk motivation"),
  ]),

  folder("syntax", "Syntax", "Sats, fras, ordföljd och argumentstruktur", [
    folder("nominalfras", "Nominalfrasen", "Huvudord, attribut och bestämdhet", [
      doc("attribut", "Attribut", "Adjektiv, genitiv, possessiv och apposition"),
      doc("attributens-ordfoljd", "Attributens ordföljd", "Framför- och efterställning"),
      doc("definitmarkering", "Definitmarkering", "Slutartikel, fristående artikel och dubbel bestämdhet"),
    ]),
    folder("satsdelar", "Satsdelar och kasus", "Subjekt, objekt, predikativ och adverbial", [
      doc("subjekt", "Subjekt", "Nominativa och subjektliknande led"),
      doc("objekt", "Objekt", "Ackusativ, dativ och genitiv"),
      doc("predikativ", "Predikativ", "Kasus och kongruens"),
      doc("oblika-subjekt", "Oblika subjektliknande led", "Konstruktioner av typen mik hungrar"),
    ]),
    folder("ordfoljd", "Ordföljd", "Huvudsats, bisats och verbplacering", [
      doc("grundmonster", "Grundläggande ordföljdsmönster", "Variation och informationsstruktur"),
      doc("v2", "V2 och finit verb", "Fundament och verbplacering"),
      doc("ov-vo", "OV- och VO-ledföljd", "Objektets placering kring det infinita verbet"),
      doc("inversion", "Inversion", "Verb före subjekt i olika miljöer"),
      doc("kilkonstruktion", "Kilkonstruktionen", "Framflyttning i satser utan synligt subjekt"),
    ]),
    folder("subjektsloshet", "Subjektslöshet", "Satser utan utsatt subjekt", [
      doc("referentiella-subjekt", "Utelämnade referentiella subjekt", "Kontextuellt återställbara subjekt"),
      doc("expletiva-subjekt", "Expletiva subjekt", "Framväxten av formellt det"),
      doc("subjektsloshetens-forandring", "Subjektslöshetens förändring", "Variation och tillbakagång"),
    ]),
    folder("bisatser", "Bisatser", "Underordning och modus", [
      doc("at-satser", "at-satser", "Deklarativa och kompletterande bisatser"),
      doc("relativsatser", "Relativsatser", "Relativ anknytning och korrelat"),
      doc("villkorssatser", "Villkorssatser", "Konditionalitet och konjunktiv"),
    ]),
    doc("paratax-hypotax", "Paratax och hypotax", "Samordnade och underordnade strukturer"),
    doc("informationsstruktur", "Informationsstruktur", "Referens, tyngd och placering"),
  ]),

  folder("forandring-och-variation", "Förändring och variation", "Tvärgående diakrona studier", [
    doc("kasussammanfallet", "Kasussammanfallet", "Förlopp, ordklasser och konkurrerande former"),
    doc("kasus-i-diplom", "Kasus i diplom", "Brev från 1400-talets Mälardalen"),
    doc("kasus-i-lagsprak", "Kasus i lagspråk", "Landskapslagar och landslag"),
    doc("kasus-i-religios-prosa", "Kasus i religiös prosa", "Tungulus och andra handskrifter"),
    doc("geografisk-variation", "Geografisk variation", "Innovationsområden och konservativa områden"),
    doc("genrevariation", "Genrevariation", "Lag, kansli, religion och berättande text"),
    doc("personkongruensens-avveckling", "Personkongruensens avveckling", "Nordiskt och typologiskt perspektiv"),
    doc("bestamdhetens-grammatikalisering", "Bestämdhetens grammatikalisering", "Bestämd och obestämd artikel"),
    doc("tyskt-inflytande", "Lågtyskt inflytande", "Lån, kontakt och konkurrerande förklaringar"),
    doc("morfologisk-datering", "Morfologi som dateringsstöd", "Möjligheter och begränsningar"),
  ]),

  folder("studieverktyg", "Studieverktyg", "Systematisk inlärning och analys", [
    doc("paradigmtraning", "Paradigmträning", "Att lära och jämföra böjningsmönster"),
    doc("formanalys", "Formanalys steg för steg", "Ordklass, stam, ändelse och funktion"),
    doc("kasusanalys", "Kasusanalys steg för steg", "Morfologi, syntax och tvetydighet"),
    doc("textlasning", "Textläsning steg för steg", "Från utgåva till grammatisk tolkning"),
    doc("facitprinciper", "Facit och osäkra svar", "Hur variation och tvetydighet redovisas"),
  ]),
];
