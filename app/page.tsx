import Startsida from "@/components/start/Startsida";
import { hamtaStartinnehall } from "@/lib/sidor";

export const dynamic = "force-dynamic";

export default async function Home() {
  const innehall = await hamtaStartinnehall();
  return <Startsida initial={innehall} />;
}
