import type { Kalla } from "@/lib/kallor";

const NIVANAMN = {
  primar: "Primärkälla",
  "vetenskaplig-sekundar": "Vetenskaplig sekundärkälla",
  handbok: "Handbok",
  arbetsunderlag: "Arbetsunderlag",
  perifer: "Perifert material",
} as const;

export default function Kalluppgifter({ kalla, artiklar = [] }: {
  kalla: Kalla;
  artiklar?: { href: string; titel: string }[];
}) {
  return <section id={kalla.id} className="border-t border-ink pt-4 break-words">
    <h2 className="micro">Källuppgifter · {kalla.id}</h2>
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
              {artiklar.length > 0 && (
                <div className="micro mt-4 border-t border-ink/30 pt-3 flex flex-wrap gap-2">
                  <span className="opacity-50">Används i</span>
                  {artiklar.map((artikel) => (
                    <a key={artikel.href} href={artikel.href} className="underline underline-offset-2">
                      {artikel.titel}
                    </a>
                  ))}
                </div>
              )}
  </section>;
}
