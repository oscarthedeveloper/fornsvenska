import { NextResponse } from "next/server";
import { slaUppTextOrd } from "@/lib/ordbok/ordbokServer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ord = searchParams.get("ord") ?? "";

  if (!ord.trim()) {
    return NextResponse.json(
      { klickatOrd: "", rensatOrd: "", executionTimeMs: 0, traffar: [] },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  try {
    const resultat = slaUppTextOrd(ord);
    return NextResponse.json(resultat, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[ordbok/uppslag] Fel vid uppslag:", error);
    return NextResponse.json(
      { fel: "Kunde inte slå upp ordet" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}


