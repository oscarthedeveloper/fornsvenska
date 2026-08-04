import ColophonStrip from "@/components/ColophonStrip";
import LeftPanel from "@/components/LeftPanel";
import InstrumentPanel from "@/components/InstrumentPanel";

export default function Home() {
  return (
    <main className="viewport-lock p-[3.5vw]">
      {/* lg:min-h-[660px] är en golvhöjd: under den rullar sidan hellre än att
          panelernas innehåll klipps eller lägger sig över varandra. */}
      <div className="border border-ink flex flex-col min-h-[calc(100vh-7vw)] lg:h-[calc(100vh-7vw)] lg:min-h-[660px] overflow-hidden">
        <ColophonStrip
          left="Konfidentiellt — textkritisk bearbetning pågår"
          centre="Fornsvenska Studielabbet"
          right=">>> Äldre och yngre fornsvenska"
        />

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          <LeftPanel />
          <InstrumentPanel />
        </div>

        <ColophonStrip
          left="Allt material följer Noreens grammatik"
          centre="1225—1526 / Svenska medeltiden"
          right="Handskriftsarkiv — Svenskt diplomatarium"
        />
      </div>
    </main>
  );
}
