import Link from "next/link";
import SiteFrame from "@/components/SiteFrame";
import LoginForm from "@/components/admin/LoginForm";
import { hamtaSession } from "@/lib/session";
import { HAR_SUPABASE } from "@/lib/supabase/config";
import { loggaUt } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { arAdmin, anvandarnamn } = await hamtaSession();

  return (
    <SiteFrame centre="Administration" active="/admin">
      <div className="flex-1 flex items-center justify-center px-[1.6rem] py-[3rem]">
        <div className="w-full max-w-[420px] border border-ink bg-panel p-[2rem] flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="nano opacity-50">Redigeringsläge</span>
            <h1 className="display text-[2rem] leading-none">Administration</h1>
          </div>

          <hr className="border-0 border-t border-ink" />

          {!HAR_SUPABASE ? (
            <p className="body-mono">
              Supabase är inte konfigurerat. Lägg in nycklarna i .env.local och
              starta om utvecklingsservern.
            </p>
          ) : arAdmin ? (
            <div className="flex flex-col gap-4">
              <p className="body-mono">
                Inloggad som <strong>{anvandarnamn}</strong>. Gå in i ett
                dokument eller ett arkiv och slå på redigeringsläget i listen
                längst ned till höger.
              </p>
              <div className="flex gap-2 flex-wrap">
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
      </div>
    </SiteFrame>
  );
}
