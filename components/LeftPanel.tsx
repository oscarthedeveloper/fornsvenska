import Link from "next/link";
import Mark from "./Mark";

const NAV = [
  { label: "Grammatik", href: "/grammatik" },
  { label: "Texter", href: "/texter" },
  { label: "Ordbok", href: "/ordbok" },
  { label: "Övningar", href: "/ovningar" },
];

/**
 * Typskalan är avsiktligt både bredd- och höjdmedveten: rubriken har bara
 * halva viewportens bredd att breda ut sig på, och panelens vertikala budget
 * är fast. min(vw, vh) håller därför hero-blocket inom sitt utrymme i stället
 * för att låta det spilla över navigeringen på låga fönster.
 */
export default function LeftPanel() {
  return (
    <section className="w-full lg:w-1/2 bg-panel flex flex-col min-h-0 overflow-hidden">
      {/* a) NAVIGERING */}
      <nav className="h-[58px] shrink-0 bg-azure border-b border-ink flex items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="display text-ink text-[1.4rem] leading-none">
            Fornsvenska
          </span>
        </Link>
        <ul className="flex items-center gap-4 sm:gap-5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="nav-link text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* b) ÖGONBRYNSRAD */}
      <div className="shrink-0 border-b border-ink px-[1.2rem] py-[clamp(0.5rem,1.7vh,0.9rem)] grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <span className="micro">Språkhistorisk studieplattform</span>
        <span className="micro">/</span>
        <span className="micro text-right">1225—1526</span>
      </div>

      {/* c) HERO */}
      <div className="flex-1 min-h-0 overflow-hidden border-b border-ink px-[clamp(1.2rem,2.6vw,2.5rem)] py-[clamp(1rem,3.2vh,2.2rem)] flex flex-col justify-center gap-[clamp(0.8rem,2.4vh,1.5rem)]">
        <h1 className="display text-ink leading-[1.05] tracking-[-0.01em] text-[clamp(1.8rem,8vw,2.6rem)] md:text-[clamp(2.2rem,min(5.2vw,7.5vh),4.2rem)]">
          Läs fornsvenska
          <br />
          som en samtida
        </h1>

        <p className="body-mono text-ink">
          Plattformen bygger på Noreens grammatik och ett annoterat korpus av
          laghandskrifter, urkunder och religiös prosa — med paradigm, ljudlagar
          och parallelltexter i samma vy.
        </p>

        <div>
          <span
            className="cf inline-block"
            style={{ "--cf": "8px" } as React.CSSProperties}
          >
            <span className="cf-in" aria-hidden="true" />
            <Link
              href="/grammatik"
              className="block bg-accent text-ink uppercase font-mono text-[0.78rem] font-medium tracking-[0.08em] px-[1.8rem] py-[clamp(0.65rem,1.9vh,0.9rem)] transition-opacity duration-[140ms] hover:opacity-80"
            >
              Börja läsa
            </Link>
          </span>
        </div>
      </div>

      {/* d) TAGLINE */}
      <div className="shrink-0 border-b border-ink px-[1.2rem] py-[clamp(0.5rem,1.7vh,0.9rem)] flex items-center justify-between gap-4">
        <span className="micro">Paradigm &amp; ljudlagar</span>
        <span className="micro text-right">Byggd på handskrifter</span>
      </div>

      {/* e) STATISTIK */}
      <div className="shrink-0 flex items-stretch">
        <div className="w-[38%] bg-ink text-paper flex items-center justify-center px-3 py-[clamp(0.7rem,2.2vh,1.1rem)]">
          <span className="display text-[clamp(2.8rem,min(5vw,7.5vh),4.2rem)] leading-none">
            1526
          </span>
        </div>
        <div className="stat-note flex-1 border-l border-ink px-[1rem] py-[clamp(0.7rem,2.2vh,1.1rem)] flex flex-col justify-center gap-2">
          <span className="stat-label">Sista året för fornsvenskan</span>
          <hr className="border-0 border-t border-dashed border-ink" />
          <p className="stat-lines">
            Gustav Vasas bibel 1526 markerar övergången
            <br />
            till nysvenska i den språkhistoriska indelningen
          </p>
        </div>
      </div>
    </section>
  );
}
