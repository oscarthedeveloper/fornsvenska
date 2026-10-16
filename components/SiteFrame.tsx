import ColophonStrip from "./ColophonStrip";
import Toppnav from "./Toppnav";

/**
 * Delad sidram för undersidorna: samma kolofonremsor och navigering som
 * startsidan, men ramen växer med innehållet i stället för att låsas till
 * en skärmhöjd.
 */
export default function SiteFrame({
  children,
  centre,
  active,
}: {
  children: React.ReactNode;
  centre: string;
  active?: string;
}) {
  return (
    <main className="p-[3.5vw]">
      <div className="border border-ink flex flex-col min-h-[calc(100vh-7vw)]">
        <ColophonStrip
          left=""
          centre={centre}
          right=""
        />

        {/* Hårlinje under navigeringen: på undersidorna behövs en gräns mot
            innehållet, på startsidan gör den bara sidan tyngre. */}
        <div className="border-b border-ink shrink-0">
          <Toppnav active={active} />
        </div>

        <div className="flex-1 bg-paper flex flex-col">{children}</div>

        <footer className="h-[34px] shrink-0 bg-ink text-paper flex items-center justify-between gap-4 px-3">
          <span className="micro whitespace-nowrap">
            Fornsvenska.se
          </span>
          <a
            href="https://oscarohrn.com"
            target="_blank"
            rel="noreferrer"
            className="micro whitespace-nowrap underline decoration-paper/45 underline-offset-[3px] transition-opacity duration-[140ms] hover:opacity-65"
          >
            oscarohrn.com ↗
          </a>
        </footer>
      </div>
    </main>
  );
}
