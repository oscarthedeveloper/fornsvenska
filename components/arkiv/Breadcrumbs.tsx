import Link from "next/link";
import type { Crumb } from "@/lib/typer";

export default function Breadcrumbs({
  crumbs,
  backHref,
}: {
  crumbs: Crumb[];
  backHref: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <nav aria-label="Brödsmulor" className="flex items-center gap-2 flex-wrap">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span className="micro opacity-40">/</span>}
              {last ? (
                <span className="micro">{crumb.title}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="micro opacity-60 transition-opacity duration-[140ms] hover:opacity-100"
                >
                  {crumb.title}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      {backHref && (
        <Link
          href={backHref}
          className="micro border border-ink px-3 py-1.5 transition-opacity duration-[140ms] hover:opacity-60"
        >
          &lt;&lt; Tillbaka
        </Link>
      )}
    </div>
  );
}
