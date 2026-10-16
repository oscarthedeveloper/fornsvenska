import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";

export default function OrdbokNotFound() {
  return (
    <SiteFrame centre="ORDBOK · POSTEN HITTADES INTE" active="/ordbok">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="doc-sheet border border-ink max-w-xl w-full p-8 flex flex-col gap-4">
          <span className="nano opacity-55">404 · Ordbokspost saknas</span>
          <h1 className="display text-[1.9rem] leading-[1.1]">
            Ordboksartikeln kunde inte hittas
          </h1>
          <p className="doc-body opacity-80">
            Det begärda post-ID:t finns inte i Söderwalls huvudverk eller supplement.
            Kontrollera länken eller sök efter uppslagsordet i ordboken.
          </p>
          <div className="pt-2">
            <Link
              href="/ordbok"
              className="inline-block border border-ink bg-ink text-paper px-4 py-2 micro hover:bg-accent hover:text-ink transition-colors"
            >
              ← Till ordbokens söksida
            </Link>
          </div>
        </div>
      </div>
    </SiteFrame>
  );
}
