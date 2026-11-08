import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";

export const metadata = {
  title: "Sidan hittades inte (404) | Fornsvenska.se",
  description: "Den begärda sidan eller resursen kunde inte hittas på Fornsvenska.se.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <SiteFrame centre="404 — Sidan hittades inte">
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 text-center max-w-2xl mx-auto">
        <span className="text-rust font-mono text-xs uppercase tracking-widest mb-3">
          Felkod 404
        </span>
        <h1 className="font-display text-3xl md:text-5xl text-ink mb-4 font-normal">
          Sidan hittades inte
        </h1>
        <p className="text-sm md:text-base text-stone-700 leading-relaxed mb-8">
          Sidan du söker finns inte, har flyttats eller så har länken blivit inaktuell.
          Om du letade efter ett specifikt ord kan du söka direkt i ordboken eller
          bläddra bland källtexterna och grammatiken.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full text-xs font-mono">
          <Link
            href="/"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Startsida
          </Link>
          <Link
            href="/ordbok"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Ordbok
          </Link>
          <Link
            href="/grammatik"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Grammatik
          </Link>
          <Link
            href="/texter"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Textarkiv
          </Link>
          <Link
            href="/runor"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Runinskrifter
          </Link>
          <Link
            href="/resurser"
            className="border border-line bg-panel p-3 text-ink hover:border-ink transition-colors"
          >
            Resursbibliotek
          </Link>
        </div>
      </div>
    </SiteFrame>
  );
}
