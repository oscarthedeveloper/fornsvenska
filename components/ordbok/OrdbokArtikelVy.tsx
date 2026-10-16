import Link from "next/link";
import type { OrdbokHanvisning, OrdbokPost } from "@/lib/ordbok/typer";
import { ORDKLASS_ETIKETTER } from "./ordklasser";
import BokmarkeKnapp from "./BokmarkeKnapp";
import BokmarkenTrigger from "./BokmarkenTrigger";
import OrdbokRattelseDiff from "./OrdbokRattelseDiff";
import OrdbokRedaktionsKnapp from "./OrdbokRedaktionsKnapp";
import ModerntForklaringsstod from "./ModerntForklaringsstod";

/**
 * Säkert renderingslager för Söderwalls ordboksartiklar (Etapp 4 & 5).
 *
 * Principer:
 * - Ingen rå HTML/XML eller dangerouslySetInnerHTML exekveras någonsin.
 * - All text renderas via React-textnoder med vitlistade inline-element (<span>, <q>, <Link>).
 * - Citat inom "..." framhävs typografiskt utan att ändra tecken eller stavning.
 * - Verifierade korshänvisningar ("se X") länkas till målordet; olösta hänvisningar
 *   visas ärligt som ren text utan gissad länk.
 */

function renderaTextMedCitatOchHanvisningar(
  text: string,
  references: OrdbokHanvisning[],
  sokKontextQuery: string
): React.ReactNode[] {
  if (!text) return [];

  // Bygg karta över lösta hänvisningar för exakt utbyte av "se <målord>"
  const lostaMap = new Map<string, OrdbokHanvisning>();
  for (const ref of references) {
    if (ref.targetEntryId && ref.rawText) {
      lostaMap.set(ref.rawText.toLowerCase(), ref);
    }
  }

  // Dela upp texten på citat ("...") så att citat i medeltidstexten får tydlig läsbarhet
  const delar = text.split(/("[^"]{2,260}")/g);
  const noder: React.ReactNode[] = [];

  delar.forEach((del, i) => {
    if (del.startsWith('"') && del.endsWith('"') && del.length >= 3) {
      noder.push(
        <span key={`q-${i}`} className="ordbok-citat">
          {del}
        </span>
      );
      return;
    }

    if (lostaMap.size === 0) {
      noder.push(<span key={`t-${i}`}>{del}</span>);
      return;
    }

    // Länka verifierade "se <ord>" i icke-citerad text
    const re = /\b(se\s+[a-zåäöæøþ]{2,}(?:\s+[a-zåäöæøþ]+)?)\b/gi;
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    const undernoder: React.ReactNode[] = [];

    while ((match = re.exec(del)) !== null) {
      const hittad = match[1];
      const ref = lostaMap.get(hittad.toLowerCase());
      if (!ref || !ref.targetEntryId) continue;

      if (match.index > lastIdx) {
        undernoder.push(del.slice(lastIdx, match.index));
      }

      const href = `/ordbok/${encodeURIComponent(ref.targetEntryId)}${sokKontextQuery}`;
      undernoder.push(
        <span key={`ref-${i}-${match.index}`}>
          se{" "}
          <Link
            href={href}
            className="underline decoration-ink/60 underline-offset-[3px] hover:text-accent"
          >
            {ref.targetHeadword ?? hittad.replace(/^se\s+/i, "")}
          </Link>
        </span>
      );
      lastIdx = match.index + hittad.length;
    }

    if (undernoder.length === 0) {
      noder.push(<span key={`t-${i}`}>{del}</span>);
    } else {
      if (lastIdx < del.length) {
        undernoder.push(del.slice(lastIdx));
      }
      noder.push(<span key={`t-${i}`}>{undernoder}</span>);
    }
  });

  return noder;
}

export default function OrdbokArtikelVy({
  post,
  sammaUppslagsordHuvudverk,
  sammaUppslagsordSupplement,
  grannarISektion,
  sokKontextQuery,
  standalone = false,
}: {
  post: OrdbokPost;
  sammaUppslagsordHuvudverk: {
    id: string;
    headwordDisplay: string;
    homonymNumber?: number;
    gramOriginal?: string;
    partOfSpeech: string[];
  }[];
  sammaUppslagsordSupplement: {
    id: string;
    headwordDisplay: string;
    homonymNumber?: number;
    gramOriginal?: string;
    partOfSpeech: string[];
  }[];
  grannarISektion: {
    prev: { id: string; headwordDisplay: string; homonymNumber?: number } | null;
    next: { id: string; headwordDisplay: string; homonymNumber?: number } | null;
  };
  sokKontextQuery: string;
  standalone?: boolean;
}) {
  const arHuvudverk = post.sourceDataset === "soederwall";
  const ordklassNamn = post.partOfSpeech
    .map((kod) => ORDKLASS_ETIKETTER[kod] ?? kod)
    .join(" · ");

  const permalank = `/ordbok/${encodeURIComponent(post.id)}`;

  return (
    <article
      className="doc-sheet border border-ink px-[1.3rem] py-[1.6rem] sm:px-[2.4rem] sm:py-[2.4rem] flex flex-col gap-6"
      aria-labelledby="ordbok-artikel-rubrik"
    >
      {/* Övre verktygs- och källrad */}
      <header className="flex flex-col gap-3 border-b border-ink pb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`nano px-2 py-0.5 border border-ink ${
                arHuvudverk ? "bg-ink text-paper" : "bg-paper text-ink"
              }`}
            >
              {arHuvudverk
                ? "Huvudverket · Söderwall (1884–1918)"
                : "Supplementet · Söderwall m.fl. (1925–1973)"}
            </span>

            <span className="nano border border-ink/40 px-2 py-0.5 opacity-80">
              Käll-ID: {post.kallaId}
            </span>

            {post.isNewInSupplement && (
              <span
                className="nano border border-ink bg-panel px-2 py-0.5"
                title="Markerat med asterisk (*) i supplementets källkod som nytillkommet uppslagsord"
              >
                * Nytt uppslagsord i supplementet
              </span>
            )}

            {post.isMainWorkAeInSuppFile && (
              <span
                className="nano border border-ink bg-panel px-2 py-0.5"
                title="I Språkbankens digitala leverans ligger Huvudverkets Ä-kapitel (index 17988–18319) i supplementets XML-fil"
              >
                Huvudverkets Ä-svit i källfilen
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <OrdbokRedaktionsKnapp post={post} />

            <BokmarkeKnapp
              post={{
                id: post.id,
                headwordDisplay: post.headwordDisplay,
                sourceDataset: post.sourceDataset,
                kallaId: post.kallaId,
                partOfSpeech: post.partOfSpeech,
                gramOriginal: post.gramOriginal,
                snippet: post.articlePlainText || (post.senses[0]?.text ?? ""),
                homonymNumber: post.homonymNumber,
              }}
            />

            {!standalone && (
              <Link
                href={`${permalank}${sokKontextQuery}`}
                className="nano underline underline-offset-4 hover:opacity-65"
                title="Öppna beständig direktlänk till denna ordbokspost"
              >
                Beständig länk (/ordbok/{post.id}) ↗
              </Link>
            )}
          </div>
        </div>

        {/* Uppslagsord, homonymnummer och grammatiketikett */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap pt-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1
              id="ordbok-artikel-rubrik"
              className="display text-[clamp(2rem,3.6vw,2.85rem)] leading-[1.08]"
            >
              {post.headwordDisplay}
              {post.homonymNumber !== undefined && (
                <sup className="mono text-[0.42em] ml-1 opacity-75">
                  {post.homonymNumber}
                </sup>
              )}
            </h1>

            {(post.gramOriginal || post.informationOriginal) && (
              <span className="doc-term">
                {[post.gramOriginal, post.informationOriginal]
                  .filter(
                    (v, idx, arr) =>
                      Boolean(v) && arr.indexOf(v) === idx
                  )
                  .join(" · ")}
              </span>
            )}

            {ordklassNamn && (
              <span className="micro opacity-65">({ordklassNamn})</span>
            )}
          </div>

          <span className="nano opacity-55">
            Lemgram: <code>{post.sourceEntryId}</code>
          </span>
        </div>

        {post.oldFormOriginal && (
          <p className="micro opacity-75">
            Äldre/alternativ källform i lemma:{" "}
            <span className="doc-term">{post.oldFormOriginal}</span>
          </p>
        )}

        {/* Relaterade poster med samma uppslagsord (Huvudverk & Supplement hålls isär) */}
        {(sammaUppslagsordHuvudverk.length > 0 ||
          sammaUppslagsordSupplement.length > 0) && (
          <div className="mt-1 border border-ink/35 bg-paper px-3 py-2.5 flex flex-col gap-1.5">
            <span className="nano opacity-65">
              Andra poster med uppslagsordet »{post.headwordDisplay}» (homonymer och kompletterande band):
            </span>
            <div className="flex flex-wrap gap-2">
              {sammaUppslagsordHuvudverk.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/ordbok/${encodeURIComponent(rel.id)}${sokKontextQuery}`}
                  className="nano border border-ink bg-panel px-2 py-1 hover:bg-ink hover:text-paper transition-colors"
                >
                  Huvudverk: {rel.headwordDisplay}
                  {rel.homonymNumber ? ` (${rel.homonymNumber})` : ""}
                  {rel.gramOriginal
                    ? ` · ${rel.gramOriginal}`
                    : rel.partOfSpeech.length > 0
                      ? ` · ${rel.partOfSpeech.join("/")}`
                      : ""}
                </Link>
              ))}
              {sammaUppslagsordSupplement.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/ordbok/${encodeURIComponent(rel.id)}${sokKontextQuery}`}
                  className="nano border border-ink bg-panel px-2 py-1 hover:bg-ink hover:text-paper transition-colors"
                >
                  Supplement: {rel.headwordDisplay}
                  {rel.homonymNumber ? ` (${rel.homonymNumber})` : ""}
                  {rel.gramOriginal
                    ? ` · ${rel.gramOriginal}`
                    : rel.partOfSpeech.length > 0
                      ? ` · ${rel.partOfSpeech.join("/")}`
                      : ""}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Källbelagda stavningsvarianter och sammansättningar (om extraherade) */}
      {post.variantsOriginal.length > 0 && (
        <section
          aria-label="Källbelagda stavningsvarianter och ordformer"
          className="flex flex-col gap-2"
        >
          <h2 className="nano opacity-55">
            Källbelagda stavningsvarianter, böjningsformer och sammansättningar ({post.variantsOriginal.length})
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {post.variantsOriginal.map((v, i) => (
              <span key={`${v}-${i}`} className="doc-term text-[0.78rem]">
                {v}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Redaktionell differentiering om posten har en registrerad rättelse */}
      {post.rattelse && (
        <section aria-label="Redaktionell rättelse och differentiering">
          <OrdbokRattelseDiff post={post} rattelse={post.rattelse} />
        </section>
      )}

      {/* Modernt förklaringsstöd och pedagogiska snabbglosor */}
      <ModerntForklaringsstod post={post} />

      {/* Källans fullständiga formhuvud (<WordForm>) */}
      {post.wordFormRows.length > 0 && (
        <section
          aria-label="Artikelhuvudets form- och böjningsuppgifter i källan"
          className="border-l-2 border-ink pl-3.5 py-0.5 flex flex-col gap-1"
        >
          <h2 className="nano opacity-55">
            Form- och beläggshuvud i källan (WordForm)
          </h2>
          <p className="doc-body text-[0.96rem] leading-[1.6] text-ink/90">
            {post.wordFormRows.map((rad, i) => (
              <span key={i}>
                {rad.att === "gram" ? (
                  <em className="mr-1">{rad.val.trim()}</em>
                ) : rad.orth ? (
                  <span>
                    <strong className="font-semibold">{rad.orth}</strong>{" "}
                    <span>({rad.val.trim()})</span>
                  </span>
                ) : (
                  <span>{rad.val}</span>
                )}{" "}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Betydelsemoment (<Sense>) */}
      <section aria-label="Artikeltext och betydelsemoment" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="nano opacity-55">
            Källans artikeltext ({post.senses.length}{" "}
            {post.senses.length === 1 ? "betydelsemoment" : "betydelsemoment"})
          </h2>
          <span className="nano opacity-50">
            Historisk källstavning bevarad · ingen automatisk modernisering
          </span>
        </div>

        {post.senses.length === 0 ? (
          <div className="border border-dashed border-ink/45 bg-paper p-3.5">
            <p className="micro opacity-80">
              Denna post saknar separat <code>&lt;Sense&gt;</code>-element i Språkbankens XML-fil.
              Hela det bevarade källinnehållet återges i form- och beläggshuvudet ovan.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-4">
            {post.senses.map((sense, index) => (
              <li
                key={sense.id || index}
                id={sense.id}
                className="border-t border-ink/20 pt-3.5 first:border-t-0 first:pt-0"
              >
                <div className="doc-body text-[1.03rem] leading-[1.68] break-words">
                  {sense.etikett && (
                    <strong className="mono text-[0.84rem] mr-2 px-1.5 py-0.5 bg-paper border border-ink/40">
                      {sense.etikett}
                    </strong>
                  )}
                  {sense.gram && (
                    <em className="mr-2 opacity-80">{sense.gram}</em>
                  )}
                  {sense.writtenForm && (
                    <span className="doc-term mr-2">{sense.writtenForm}</span>
                  )}
                  {renderaTextMedCitatOchHanvisningar(
                    sense.text,
                    post.references,
                    sokKontextQuery
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Korshänvisningar sammanställda (både lösta och olösta redovisas ärligt) */}
      {post.references.length > 0 && (
        <section
          aria-label="Korshänvisningar i artikeln"
          className="border-t border-ink/30 pt-4 flex flex-col gap-2"
        >
          <h2 className="nano opacity-55">Hänvisningar i artikeln</h2>
          <div className="flex flex-wrap gap-2">
            {post.references.map((ref, idx) =>
              ref.targetEntryId ? (
                <Link
                  key={`${ref.rawText}-${idx}`}
                  href={`/ordbok/${encodeURIComponent(ref.targetEntryId)}${sokKontextQuery}`}
                  className="nano border border-ink bg-paper px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
                >
                  {ref.rawText} →
                </Link>
              ) : (
                <span
                  key={`${ref.rawText}-${idx}`}
                  className="nano border border-dashed border-ink/45 px-2.5 py-1 opacity-70"
                  title="Hänvisningens målord kunde inte entydigt matchas mot ett eget uppslagsord i XML-källan"
                >
                  {ref.rawText} (ej länkad i XML-källan)
                </span>
              )
            )}
          </div>
        </section>
      )}

      {/* Proveniens, kvalitetsstatus och externa länkar (Etapp 5) */}
      <footer className="border-t border-ink pt-4 mt-2 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="nano">Proveniens, kvalitet och licens</span>
          <span className="nano opacity-60">
            Importversion: {post.importVersion} · SHA-256: {post.sourceChecksum.slice(0, 12)}…
          </span>
        </div>

        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[11rem_1fr] micro">
          <dt className="opacity-55">Verk och utgåva</dt>
          <dd>
            {arHuvudverk
              ? "K. F. Söderwall, Ordbok öfver svenska medeltids-språket, Bd I–II (Lund 1884–1918)."
              : "K. F. Söderwall, W. Åkerlund, K. G. Ljunggren & E. Wessén, Ordbok öfver svenska medeltids-språket. Supplement (Lund 1925–1973)."}
          </dd>

          <dt className="opacity-55">Leverantörskvalitet</dt>
          <dd>{post.supplierQualityNote}</dd>

          <dt className="opacity-55">Redaktionell status</dt>
          <dd>
            {post.reviewStatus === "oandrad_kallimport"
              ? "Oändrad källimport (ej separat korrekturläst av Fornsvenska Studielabbet)"
              : post.reviewStatus === "redaktionellt_verifierad"
                ? "Redaktionellt kontrollerad mot faksimil"
                : "Rättad med dokumenterat källstöd"}
          </dd>

          {post.rattelse?.kallstod && (
            <>
              <dt className="opacity-55">Dokumenterat källstöd</dt>
              <dd className="font-mono text-[0.75rem]">{post.rattelse.kallstod}</dd>
            </>
          )}

          <dt className="opacity-55">Egen bearbetning</dt>
          <dd>
            Strukturerad visning av LMF/XML, normaliserade söknycklar och dokumenterade teckenalias (<code>þ/th/dh</code>, <code>æ/ä</code>, <code>ø/ö</code>) utan ändring av källans artikeltext.
          </dd>
        </dl>

        <div className="flex flex-wrap gap-2 pt-1">
          {post.externalLinks.map((lank) => (
            <a
              key={lank.url}
              href={lank.url}
              target="_blank"
              rel="noopener noreferrer"
              title={lank.note}
              className="nano border border-ink bg-paper px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
            >
              {lank.label} ↗
            </a>
          ))}
          <Link
            href={`/resurser#${post.kallaId}`}
            className="nano border border-ink bg-panel px-2.5 py-1 hover:bg-ink hover:text-paper transition-colors"
          >
            Källpost i Resursbiblioteket ({post.kallaId}) →
          </Link>
        </div>

        {/* Föregående / nästa uppslagsord i samma bokstavssektion */}
        {(grannarISektion.prev || grannarISektion.next) && (
          <nav
            aria-label="Bläddra till föregående eller nästa artikel i bokstavssektionen"
            className="border-t border-dashed border-ink/40 pt-3 mt-1 flex items-center justify-between gap-4 flex-wrap"
          >
            {grannarISektion.prev ? (
              <Link
                href={`/ordbok/${encodeURIComponent(grannarISektion.prev.id)}${sokKontextQuery}`}
                className="micro hover:underline underline-offset-4"
              >
                ← {grannarISektion.prev.headwordDisplay}
                {grannarISektion.prev.homonymNumber
                  ? ` (${grannarISektion.prev.homonymNumber})`
                  : ""}
              </Link>
            ) : (
              <span />
            )}

            <span className="nano opacity-50">
              Bokstavssektion {post.letterSection}
            </span>

            {grannarISektion.next ? (
              <Link
                href={`/ordbok/${encodeURIComponent(grannarISektion.next.id)}${sokKontextQuery}`}
                className="micro hover:underline underline-offset-4"
              >
                {grannarISektion.next.headwordDisplay}
                {grannarISektion.next.homonymNumber
                  ? ` (${grannarISektion.next.homonymNumber})`
                  : ""}{" "}
                →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </footer>
    </article>
  );
}
