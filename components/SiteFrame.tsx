import Link from "next/link";
import ColophonStrip from "./ColophonStrip";
import Mark from "./Mark";

const NAV = [
  { label: "Grammatik", href: "/grammatik" },
  { label: "Texter", href: "/texter" },
  { label: "Resursbibliotek", href: "/resurser" },
  { label: "Ordbok", href: "/ordbok" },
  { label: "Övningar", href: "/ovningar" },
];

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
          left="Konfidentiellt — textkritisk bearbetning pågår"
          centre={centre}
          right=">>> Äldre och yngre fornsvenska"
        />

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
                <Link
                  href={item.href}
                  className={`nav-link text-ink ${
                    active === item.href ? "underline underline-offset-4" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 bg-paper flex flex-col">{children}</div>

        <ColophonStrip
          left="Allt material följer Noreens grammatik"
          centre="1225—1526 / Svenska medeltiden"
          right="Handskriftsarkiv — Svenskt diplomatarium"
        />
      </div>
    </main>
  );
}
