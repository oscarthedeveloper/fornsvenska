import Link from "next/link";
import Mark from "./Mark";

/**
 * Sajtens navigering — samma på alla sidor.
 *
 * Märket i mitten, länkarna delade åt vardera hållet. Ingen färgad list:
 * navigeringen ska höra ihop med pappret, inte ligga som ett band ovanpå det.
 */

const VANSTER = [
  { label: "Grammatik", href: "/grammatik" },
  { label: "Texter", href: "/texter" },
  { label: "Resursbibliotek", href: "/resurser" },
];

const HOGER = [
  { label: "Ordbok", href: "/ordbok" },
  { label: "Övningar", href: "/ovningar" },
];

export default function Toppnav({ active }: { active?: string }) {
  return (
    <header className="start-nav">
      <nav className="start-lankar" aria-label="Huvudnavigering">
        {VANSTER.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${active === l.href ? "underline underline-offset-4" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <Link href="/" className="start-marke" aria-label="Fornsvenska Studielabbet">
        <Mark />
        <span className="display">Fornsvenska</span>
      </Link>

      <nav className="start-lankar start-lankar-hoger" aria-label="Övrigt">
        {HOGER.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link ${active === l.href ? "underline underline-offset-4" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
