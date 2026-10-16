/**
 * Typer och datamodell för Fornsvenska Studielabbets ordbok (/ordbok).
 *
 * Källunderlag: K. F. Söderwall, Ordbok öfver svenska medeltids-språket (SOD1884)
 * samt Supplementet (SOD-SUPP) i Språkbankens LMF/XML-utgåvor (CC BY 4.0).
 */

export type OrdbokDataset = "soederwall" | "soederwall-supp";

export type OrdbokKallaId = "SOD1884" | "SOD-SUPP";

export type OrdbokGranskningsstatus =
  | "oandrad_kallimport"
  | "redaktionellt_verifierad"
  | "rattad_med_kallstod";

/**
 * En rad ur XML-elementet <WordForm> i LMF-källan.
 * Bevaras i exakt ordning för källtrogen återgivning av artikelhuvudets parentesblock.
 */
export interface OrdbokFormRad {
  /** Attributnamn i XML (t.ex. "writtenForm", "gram", eller MSD-kod som "V0IPA**"). */
  att: string;
  /** Eventuellt orth-attribut om det fanns inbäddat i käll-XML:n. */
  orth?: string;
  /** Textvärde (avkodat från XML-entiteter men i övrigt oförändrat). */
  val: string;
}

/**
 * Ett betydelsemoment (<Sense>) i en ordboksartikel.
 */
export interface OrdbokBetydelse {
  /** Källans Sense-ID (t.ex. "soederwall--a..4"). */
  id: string;
  /** Eventuell inledande betydelsenumrering eller direkt text på <Sense> (t.ex. "1) "). */
  etikett?: string;
  /** Eventuell grammatisk markering på <Sense>. */
  gram?: string;
  /** Eventuell skriven form på <Sense>. */
  writtenForm?: string;
  /** Själva definitionstexten (konkatenerad om flera <feat att="text"> förekommer i <Definition>). */
  text: string;
}

/**
 * Korshänvisning som påträffats i artikeln (t.ex. "se ädhla", "jfr ...").
 */
export interface OrdbokHanvisning {
  /** Rå hänvisningstext i källan. */
  rawText: string;
  /** Extraherat målord (uppslagsord), om det säkert kan identifieras. */
  targetHeadword?: string;
  /** Löst post-ID om målordet finns i ordboken (tomt om olöst eller flertydigt). */
  targetEntryId?: string;
}

/**
 * Extern länk till källutgåva eller faksimilband (aldrig en gissad sidlänk).
 */
export interface OrdbokKalllank {
  label: string;
  url: string;
  kind: "sprakbanken" | "doi" | "runeberg_band" | "licens";
  note: string;
}

/**
 * Fullständig logisk postmodell för en ordboksartikel.
 */
export interface OrdbokPost {
  /** Stabilt globalt ID: `${sourceDataset}--${lemgramUtanFsvmPrefix}` (t.ex. "soederwall--a-nn.1"). */
  id: string;
  /** Datamängd: "soederwall" (Huvudverket) eller "soederwall-supp" (Supplementet). */
  sourceDataset: OrdbokDataset;
  /** Käll-ID i projektets källregister ("SOD1884" eller "SOD-SUPP"). */
  kallaId: OrdbokKallaId;
  /** Källans eget post-ID (<feat att="lemgram" />), t.ex. "fsvm--a..nn.1". */
  sourceEntryId: string;
  /** Ordningsnummer (0-baserat) i original-XML-filen. */
  sourceIndex: number;
  /** Eventuellt oldlemma-attribut (<feat att="oldlemma" />), t.ex. "fsvm--*abo..nn.1". */
  oldLemma?: string;
  /** Sant om posten i supplementet är markerad med asterisk i oldlemma (nytt uppslagsord). */
  isNewInSupplement?: boolean;
  /**
   * Sant för de 332 poster under Ä (index 17988–18319) i soederwall-supp.xml
   * som i själva verket utgör Huvudverkets Ä-kapitel i Språkbankens leverans.
   */
  isMainWorkAeInSuppFile?: boolean;

  /** Exakt uppslagsord som i källans <feat att="writtenForm" />. */
  headwordOriginal: string;
  /** Trimmad visningsform av uppslagsordet. */
  headwordDisplay: string;
  /** Homonymnummer ur lemgrammet (om > 1 eller när flera poster delar uppslagsord). */
  homonymNumber?: number;

  /** Källans ordklasskoder (<feat att="partOfSpeech" />), t.ex. ["nn"] eller ["pp", "ab"]. */
  partOfSpeech: string[];
  /** Källans tryckta grammatiketikett (<feat att="gram" />), t.ex. "prep. adv." eller "v.". */
  gramOriginal?: string;
  /** Källans utökade grammatikinformation (<feat att="information" />). */
  informationOriginal?: string;
  /** Källans oldForm (<feat att="oldForm" />), om angiven. */
  oldFormOriginal?: string;

  /** Källbelagda stavningsvarianter, böjda former och sammansättningar ur <WordForm>. */
  variantsOriginal: string[];
  /** Samtliga råa <WordForm>-rader i källans ordning för artikelhuvudets visning. */
  wordFormRows: OrdbokFormRad[];

  /** Betydelsemoment (<Sense>). Kan vara tom för de 1 025 poster som enbart har <WordForm>. */
  senses: OrdbokBetydelse[];

  /** Bevarat XML-utdrag för posten (eller rå källtextrepresentation). */
  articleOriginal: string;
  /** Säkert renderbar klartextsammanfattning av artikeln (för listor och fritextsökning). */
  articlePlainText: string;

  /** Normaliserade söknycklar för exakt- och prefixsökning (lowercase NFC). */
  searchKeys: string[];
  /** Alternativa sökalias (t.ex. th <-> þ, dh <-> þ, w -> v, æ -> ä, ø -> ö). */
  aliasKeys: string[];
  /** Dokumenterad sorteringsnyckel enligt Söderwalls alfabet (A–Ö, därefter Þ/TH). */
  sortKey: string;
  /** Bokstavssektion i den alfabetiska bläddringen (A–Ö samt Þ). */
  letterSection: string;

  /** Identifierade korshänvisningar i artikeln. */
  references: OrdbokHanvisning[];
  /** Verifierade länkar till Språkbanken, DOI och Projekt Runebergs bandöversikt. */
  externalLinks: OrdbokKalllank[];

  /** Spårbarhet till importen. */
  importVersion: string;
  sourceChecksum: string;

  /** Egen granskningsstatus, strikt skild från Språkbankens kvalitetsmärkning. */
  reviewStatus: OrdbokGranskningsstatus;
  /** Leverantörens (Språkbankens) kvalitetsdeklaration för datamängden. */
  supplierQualityNote: string;
  /** Redaktionell rättelse eller verifiering, om sådan har registrerats. */
  rattelse?: OrdbokRattelse;
  /** Moderniserat förklaringsstöd och snabbglosa (kurerat eller extraherat). */
  modernDefinition?: ModerniseradDefinition;
}

/**
 * Moderniserad pedagogisk förklaring eller snabbglosa till en ordboksartikel.
 * Används som modernt lässtöd vid sidan av Söderwalls historiska ordbokstext.
 */
export interface ModerniseradDefinition {
  /** Postens unika ID (t.ex. "soederwall--konunger-nn.1"). */
  id: string;
  /** Uppslagsord som definitionen avser. */
  headwordDisplay?: string;
  /** Korta moderna snabbglosor (t.ex. ["kung", "monark", "härskare"]). */
  modernGlos: string[];
  /** Lättfattlig sammanfattande förklaring på modern svenska. */
  kortForklaring: string;
  /** Eventuell pedagogisk not om fornsvensk formlära eller användning. */
  pedagogiskNot?: string;
  /** Nutida standardsvensk motsvarighet (t.ex. "kung"). */
  modernMotsvarighet?: string;
  /** Ursprung för definitionen: kurerad redaktionell text eller automatisk ordboksextraktion. */
  kalla: "kurerad_redaktionell" | "automatisk_extraktion";
  /** Om förklaringen har manuellt granskats av redaktionen. */
  granskad: boolean;
  /** Tidpunkt för senaste uppdatering (ISO 8601). */
  uppdaterad?: string;
}

/**
 * Redaktionell rättelse eller faksimilverifiering av en ordbokspost.
 */
export interface OrdbokRattelse {
  /** Postens unika ID (t.ex. "soederwall--a-nn.1"). */
  id: string;
  /** Eventuellt korrigerat visningsuppslagsord (t.ex. vid OCR-fel eller teckenfel). */
  headwordDisplayOverride?: string;
  /** Redaktionell status ("redaktionellt_verifierad" eller "rattad_med_kallstod"). */
  reviewStatus: OrdbokGranskningsstatus;
  /** Motivering och redaktionell kommentar om ändringen. */
  note: string;
  /** Dokumenterat källstöd (t.ex. "Söderwall Bd 1 s. 42, faksimil Runeberg"). */
  kallstod: string;
  /** Tidpunkt då rättelsen skapades (ISO 8601). */
  skapad: string;
  /** Tidpunkt för senaste ändring (ISO 8601). */
  andrad: string;
  /** Signatur eller ID för administratören som utfört rättelsen. */
  skapadAv?: string;
}

/**
 * Kompakt listpost för träfflistor, alfabetisk bläddring och relaterade poster.
 */
export interface OrdbokListPost {
  id: string;
  sourceDataset: OrdbokDataset;
  kallaId: OrdbokKallaId;
  sourceEntryId: string;
  headwordDisplay: string;
  homonymNumber?: number;
  partOfSpeech: string[];
  gramOriginal?: string;
  variantsPreview: string[];
  snippet: string;
  letterSection: string;
  isNewInSupplement?: boolean;
  isMainWorkAeInSuppFile?: boolean;
  /** Eventuell redaktionell rättelse kopplad till posten. */
  rattelse?: OrdbokRattelse;
  /** Moderniserat förklaringsstöd och snabbglosa. */
  modernDefinition?: ModerniseradDefinition;
  /** Hur träffen matchade vid sökning. */
  matchType?:
    | "exact_headword"
    | "exact_variant"
    | "prefix_headword"
    | "prefix_variant"
    | "alias_headword"
    | "alias_variant"
    | "ortho_candidate"
    | "inflected_candidate"
    | "article_text";
  /** Vilken specifik variant eller aliasform som gav träff (om ej exakt uppslagsord). */
  matchedForm?: string;
  /** Dokumenterad morfologisk eller ortografisk förklaring när träffen nåtts via böjnings-/stavningsanalys. */
  matchExplanation?: string;
}

export type OrdbokSoklage = "uppslagsord" | "artikeltext";

export type OrdbokKallfilter = "alla" | "soederwall" | "soederwall-supp";

export interface OrdbokSokParametrar {
  q?: string;
  mode?: OrdbokSoklage;
  letter?: string;
  dataset?: OrdbokKallfilter;
  page?: number;
  pageSize?: number;
}

export interface OrdbokBokstavsStatistik {
  letter: string;
  label: string;
  total: number;
  mainCount: number;
  suppCount: number;
}

export interface OrdbokMorfologiskKandidat {
  grundform: string;
  kategori: "ortho" | "inflected";
  forklaring: string;
  antalTraffar: number;
}

export interface OrdbokSokResultat {
  query: string;
  mode: OrdbokSoklage;
  letter: string | null;
  dataset: OrdbokKallfilter;
  page: number;
  pageSize: number;
  totalHits: number;
  totalPages: number;
  hits: OrdbokListPost[];
  morfologiskaKandidater?: OrdbokMorfologiskKandidat[];
  executionTimeMs: number;
}

/**
 * Resultat vid klicka-på-ord-uppslagning från en fornsvensk lästext (/texter).
 */
export interface OrdbokTextUppslagTräff {
  listPost: OrdbokListPost;
  post: OrdbokPost;
  matchKategori: "exact_headword" | "exact_variant" | "ortho_candidate" | "inflected_candidate";
  kandidatForm: string;
  forklaring?: string;
}

export interface OrdbokTextUppslagResultat {
  klickatOrd: string;
  rensatOrd: string;
  executionTimeMs: number;
  traffar: OrdbokTextUppslagTräff[];
}

