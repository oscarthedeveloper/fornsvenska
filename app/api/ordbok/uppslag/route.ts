import { NextResponse } from "next/server";
import { slaUppTextOrd } from "@/lib/ordbok/ordbokServer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ord = searchParams.get("ord") ?? "";

  if (!ord.trim()) {
    return NextResponse.json(
      { klickatOrd: "", rensatOrd: "", executionTimeMs: 0, traffar: [] },
      { status: 400 }
    );
  }

  const resultat = slaUppTextOrd(ord);
  return NextResponse.json(resultat);
}
