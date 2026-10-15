import SiteFrame from "@/components/SiteFrame";
import { KALLOR } from "@/data/kallor";
import { grammatikartiklarForKalla } from "@/lib/kallindex";

export const metadata = {
  title: "Källregister — Fornsvenska Studielabbet",
  description: "Kanoniskt och källkritiskt register över grammatikkorpusen.",
};

const NIVANAMN = {
  primar: "Primärkälla",
  "vetenskaplig-sekundar": "Vetenskaplig sekundärkälla",
  handbok: "Handbok",
  arbetsunderlag: "Arbetsunderlag",
  perifer: "Perifert material",
} as const;

export default function KallregisterPage() {
  const filer = KALLOR.reduce((summa, kalla) => summa + kalla.filer.length, 0);

  return (
    <SiteFrame centre="Källregister — proveniens" active="/kallor">
      <div className="mx-auto w-full max-w-[1100px] p-[1.2rem] sm:p-[2.6rem] flex flex-col gap-8">
        <header className="border border-ink p-5 sm:p-8 flex flex-col gap-3">
          <p className="nano opacity-55">KÄLLKORPUS / REVISION 1</p>
          <h1 className="display text-[clamp(2rem,4vw,3.4rem)] leading-none">Källregister</h1>
          <p className="doc-body max-w-[75ch]">
            Registret skiljer mellan verk och filer. Dubbletter räknas därför aldrig som
            oberoende stöd. Publicerade grammatikartiklar ska hänvisa till ett stabilt
            käll-ID och en exakt sida, paragraf, tabell eller annan lokalisering.
          </p>
          <p className="micro opacity-65">{KALLOR.length} verk · {filer} registrerade filer</p>
        </header>

        <ol className="grid gap-4">
          {KALLOR.map((kalla) => (
            <li key={kalla.id} id={kalla.id} className="border border-ink p-4 sm:p-6 scroll-mt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="display text-[1.35rem] leading-tight">{kalla.titel}</h2>
                <span className="micro border border-ink px-2 py-1">{kalla.id}</span>
              </div>
              <p className="micro mt-2 opacity-70">{kalla.bibliografi}</p>
              <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[9rem_1fr] micro">
                <dt className="opacity-50">Källnivå</dt>
                <dd>{NIVANAMN[kalla.niva]}</dd>
                <dt className="opacity-50">Användning</dt>
                <dd>{kalla.anvandning}</dd>
                <dt className="opacity-50">Ämnen</dt>
                <dd>{kalla.amnen.join(" · ")}</dd>
                <dt className="opacity-50">Period</dt>
                <dd>{kalla.perioder.join(" · ")}</dd>
                <dt className="opacity-50">Filer</dt>
                <dd>
                  <ul className="flex flex-col gap-1">
                    {kalla.filer.map((fil) => (
                      <li key={fil.sokvag}>
                        <span>{fil.sokvag.replace(/^Källor\//, "")}</span>{" "}
                        <span className="opacity-50">[{fil.relation}]</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
              {kalla.anmarkning && (
                <p className="micro mt-4 border-t border-ink/30 pt-3">{kalla.anmarkning}</p>
              )}
              {grammatikartiklarForKalla(kalla.id).length > 0 && (
                <div className="micro mt-4 border-t border-ink/30 pt-3 flex flex-wrap gap-2">
                  <span className="opacity-50">Används i</span>
                  {grammatikartiklarForKalla(kalla.id).map((artikel) => (
                    <a key={artikel.sokvag} href={artikel.href} className="underline underline-offset-2">
                      {artikel.titel}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </SiteFrame>
  );
}

