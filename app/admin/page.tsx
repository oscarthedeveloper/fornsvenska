import type { Metadata } from "next";
import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";
import LoginForm from "@/components/admin/LoginForm";
import OrdbokRattelserAdmin from "@/components/admin/OrdbokRattelserAdmin";
import { hamtaSession } from "@/lib/session";
import { HAR_SUPABASE, saknadeVariabler } from "@/lib/supabase/config";
import { loggaUt } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const { arAdmin, anvandarnamn } = await hamtaSession();

  return (
    <SiteFrame centre="Administration" active="/admin">
      <div className="flex-1 flex flex-col items-center px-[1.6rem] py-[3rem] gap-8 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-[480px] border border-ink bg-panel p-[2rem] flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="nano opacity-50">Redigeringsläge</span>
            <h1 className="display text-[2rem] leading-none">Administration</h1>
          </div>

          <hr className="border-0 border-t border-ink" />

          {!HAR_SUPABASE ? (
            <div className="flex flex-col gap-3">
              <p className="body-mono">
                Supabase är inte konfigurerat i den här processen.
              </p>
              <p className="text-[0.68rem] leading-[1.7]">
                Saknas:{" "}
                {saknadeVariabler().map((v) => (
                  <code key={v} className="border border-ink px-1 mr-1">
                    {v}
                  </code>
                ))}
              </p>
              <p className="text-[0.68rem] leading-[1.7] opacity-70">
                Ligger de redan i .env.local läses de först vid uppstart — stoppa
                servern med Ctrl+C och kör npm run dev igen. Ordboksrättelser kan
                fortfarande redigeras och exporteras lokalt via data/ordbok-rattelser.json nedan.
              </p>
            </div>
          ) : arAdmin ? (
            <div className="flex flex-col gap-4">
              <p className="body-mono">
                Inloggad som <strong>{anvandarnamn}</strong>. Gå in i ett
                dokument eller ett arkiv och slå på redigeringsläget i listen
                längst ned till höger.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href="/ordbok"
                  className="micro border border-ink px-3 py-1.5 transition-opacity duration-[140ms] hover:opacity-60 bg-paper"
                >
                  Till Ordbok
                </Link>
                <Link
                  href="/grammatik"
                  className="micro border border-ink px-3 py-1.5 transition-opacity duration-[140ms] hover:opacity-60"
                >
                  Till Grammatik
                </Link>
                <Link
                  href="/texter"
                  className="micro border border-ink px-3 py-1.5 transition-opacity duration-[140ms] hover:opacity-60"
                >
                  Till Texter
                </Link>
                <form action={loggaUt}>
                  <button
                    type="submit"
                    className="micro border border-ink px-3 py-1.5 bg-ink text-paper transition-opacity duration-[140ms] hover:opacity-70"
                  >
                    Logga ut
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>

        {/* Administrationspanel för ordbokens redaktionella rättelser */}
        <div className="w-full">
          <OrdbokRattelserAdmin />
        </div>
      </div>
    </SiteFrame>
  );
}
