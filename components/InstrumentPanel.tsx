import RunicWheel from "./RunicWheel";

const LOGG = [
  "[ KORPUSLOGG ]",
  "# HANDSKRIFTER... 412",
  "# PARADIGM... FULLSTÄNDIGA",
  "# LJUDLAGAR... INDEXERADE",
  "# PARALLELLTEXT... AKTIV",
  "# ORDBOK... ONLINE",
];

function SideBar({ side }: { side: "left" | "right" }) {
  return (
    <div className="hidden md:flex w-[20px] lg:w-[26px] shrink-0 bg-ink overflow-hidden items-center justify-center">
      <span
        className="nano text-paper whitespace-nowrap"
        style={{
          transform: `rotate(${side === "left" ? "-90deg" : "90deg"})`,
        }}
      >
        Språkperiod: 1225 — 1526
      </span>
    </div>
  );
}

export default function InstrumentPanel() {
  return (
    <section className="w-full lg:w-1/2 bg-paper border-t lg:border-t-0 lg:border-l border-ink flex flex-col items-center justify-center min-h-0 px-[1.4rem] py-[1.6rem] gap-6">
      <p className="micro text-center">Systemläge: runraden kalibreras</p>

      <div className="flex items-stretch justify-center gap-5 lg:gap-7 w-full flex-1 min-h-0">
        <SideBar side="left" />

        <div
          className="cf flex-1 max-w-[430px] min-h-0"
          style={{ "--cf": "18px" } as React.CSSProperties}
        >
          <span className="cf-in" aria-hidden="true" />
          <div className="h-full bg-panel border border-ink flex flex-col p-[0.8rem] gap-1.5">
            {/* Övre rad: korpuslogg + avläsningsruta */}
            <div className="flex items-start justify-between gap-3 shrink-0">
              <div className="text-ink">
                {LOGG.map((line) => (
                  <div key={line} className="log-line whitespace-pre">
                    {line}
                  </div>
                ))}
              </div>
              <div className="border border-ink px-2 py-1.5 text-right shrink-0">
                <div className="nano">Aktuell period:</div>
                <div className="text-[1.1rem] leading-tight tracking-tight">
                  1375—1526
                </div>
                <div className="nano">Yngre fsv</div>
              </div>
            </div>

            {/* Runhjulet */}
            <div className="flex-1 min-h-[140px] flex items-center justify-center py-1">
              <RunicWheel />
            </div>
            <p className="sr-only">
              Dekorativ illustration: ett instrumenthjul med fyra streckade
              ringar och medeltidsrunraden fördelad längs ytterringen, med runan
              thorn i mitten.
            </p>

            {/* Sidfot i kortet */}
            <div className="shrink-0 flex items-end justify-between gap-3 text-[0.58rem] leading-[1.5] tracking-[0.04em]">
              <div className="whitespace-pre">
                {"> SYSTEMLÄGE: RUNRADEN KALIBRERAS\n> HANDSKRIFTSGRUPP: SDHK-4512"}
              </div>
              <div className="text-right whitespace-pre">
                {"NOREEN-512 /\nALTSCHWEDISCHE GRAMMATIK"}
              </div>
            </div>
          </div>
        </div>

        <SideBar side="right" />
      </div>

      <p className="nano text-center">
        © 2026 Fornsvenska Studielabbet &nbsp;|&nbsp; Experimentell språkhistoria
      </p>
    </section>
  );
}
