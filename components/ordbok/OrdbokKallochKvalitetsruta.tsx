import Link from "next/link";

/**
 * Redovisar verkets utgåvor, datakällor, licenser (CC BY 4.0), egen bearbetning
 * och kända kvalitetsbegränsningar i Språkbankens LMF-filer (Etapp 5).
 */
export default function OrdbokKallochKvalitetsruta() {
  return (
    <details className="border border-ink bg-panel">
      <summary className="cursor-pointer select-none px-3.5 py-2.5 flex items-center justify-between gap-4 hover:bg-paper transition-colors">
        <span className="micro">
          Om ordboken: Källor, kvalitet, licens (CC BY 4.0) och kända källbegränsningar
        </span>
        <span className="nano opacity-60">Visa / dölj ▾</span>
      </summary>

      <div className="border-t border-ink px-4 py-4 bg-paper flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-ink/40 bg-panel p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="nano bg-ink text-paper px-2 py-0.5">
                Huvudverket · SOD1884
              </span>
              <span className="nano opacity-60">22 572 poster</span>
            </div>
            <p className="doc-body text-[0.94rem]">
              K. F. Söderwall, <em>Ordbok öfver svenska medeltids-språket</em>, Band I–II
              (Lund: Svenska fornskriftsällskapet, 1884–1918).
            </p>
            <p className="micro opacity-80">
              <strong>Kvalitetsstatus hos Språkbanken:</strong> Uppslagsorden är kontrollästa
              efter manuell inkodning, men övriga delar av artiklarna är inte korrekturlästa.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://sprakbanken.se/resurser/soederwall"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                Språkbanken ↗
              </a>
              <a
                href="https://doi.org/10.23695/0gf3-5042"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                DOI: 10.23695/0gf3-5042 ↗
              </a>
              <a
                href="https://runeberg.org/svmtsprk/"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                Projekt Runeberg (faksimilöversikt) ↗
              </a>
            </div>
          </div>

          <div className="border border-ink/40 bg-panel p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="nano border border-ink bg-paper px-2 py-0.5">
                Supplementet · SOD-SUPP
              </span>
              <span className="nano opacity-60">19 172 poster</span>
            </div>
            <p className="doc-body text-[0.94rem]">
              K. F. Söderwall, W. Åkerlund, K. G. Ljunggren &amp; E. Wessén,{" "}
              <em>Ordbok öfver svenska medeltids-språket. Supplement</em> (Lund: Svenska
              fornskriftsällskapet, 1925–1973).
            </p>
            <p className="micro opacity-80">
              <strong>Kvalitetsstatus hos Språkbanken:</strong> Varken uppslagsord eller övrig
              artikeltext är kontrollästa efter manuell inkodning.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://spraakbanken.gu.se/resurser/soederwall-supp"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                Språkbanken ↗
              </a>
              <a
                href="https://doi.org/10.23695/vp9e-pg93"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                DOI: 10.23695/vp9e-pg93 ↗
              </a>
              <a
                href="https://runeberg.org/svmtsprk/4/"
                target="_blank"
                rel="noopener noreferrer"
                className="nano underline underline-offset-2"
              >
                Projekt Runeberg (Supplementet) ↗
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 micro">
          <div className="flex flex-col gap-1.5">
            <h3 className="nano">Licens och egen bearbetning</h3>
            <p className="opacity-80">
              Båda digitala datamängderna tillhandahålls av Språkbanken Text (Göteborgs
              universitet) under{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Creative Commons Erkännande 4.0 Internationell (CC BY 4.0) ↗
              </a>
              . Fornsvenska Studielabbet har indexerat LMF/XML-filerna med bibehållen
              källtext, kompletterat med normaliserade söknycklar och dokumenterade
              teckenalias (<code>þ/th/dh</code>, <code>æ/ä</code>, <code>ø/ö</code>) samt
              sammanlänkat enkla korshänvisningar. Inga nya betydelser eller moderniserade
              definitioner har lagts till.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="nano">Kända egenheter i källfilerna &amp; principer</h3>
            <ul className="list-disc pl-4 flex flex-col gap-1 opacity-80">
              <li>
                <strong>Bokstaven Þ (TH):</strong> I Söderwalls ordbok bildar <code>Þ</code>{" "}
                (inklusive uppslagsord på <code>th-</code>) ett eget kapitel allra sist i
                alfabetet, efter <code>Ö</code>.
              </li>
              <li>
                <strong>Kapitlet Ä och V i LMF-utgåvan:</strong> I Språkbankens filer ligger
                både huvudverkets (332 poster) och supplementets (285 poster) <code>Ä</code>
                -kapitel i <code>soederwall-supp.xml</code>, medan supplementets <code>V</code>
                -kapitel saknas i XML-underlaget.
              </li>
              <li>
                <strong>Ingen fabricerad sidlänkning:</strong> XML-filerna innehåller inga
                tryckta sidnummer i Söderwall. Länkar till Projekt Runeberg går därför alltid
                ärligt till rätt bandöversikt. Se även{" "}
                <Link href="/resurser#SOD1884" className="underline underline-offset-2">
                  Resursbiblioteket
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </div>
    </details>
  );
}
