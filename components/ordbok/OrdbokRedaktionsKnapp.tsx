"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import type { OrdbokPost } from "@/lib/ordbok/typer";
import OrdbokRattelseModal from "./OrdbokRattelseModal";

export default function OrdbokRedaktionsKnapp({
  post,
}: {
  post: OrdbokPost;
}) {
  const { arAdmin, redigerar } = useAdmin();
  const [modalOppen, setModalOppen] = useState(false);

  // Visas om användaren är administratör (eller har slagit på redigeringsläget)
  // I lokalt läge utan Supabase kan utvecklare också granska/rätta via denna knapp
  const harBehorighet = arAdmin || redigerar;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOppen(true)}
        className={`nano px-2.5 py-1 border transition-colors flex items-center gap-1.5 ${
          post.rattelse
            ? "border-accent bg-accent/15 text-ink hover:bg-accent hover:text-ink font-semibold"
            : harBehorighet
              ? "border-ink bg-panel text-ink hover:bg-ink hover:text-paper"
              : "border-ink/40 bg-panel text-ink/70 hover:border-ink hover:text-ink"
        }`}
        title="Öppna redaktionellt rättelsegränssnitt för denna post"
      >
        <span aria-hidden="true">✎</span>
        <span>{post.rattelse ? "Redaktionell rättelse (redigera)" : "Föreslå/granska rättelse"}</span>
      </button>

      <OrdbokRattelseModal
        post={post}
        befintligRattelse={post.rattelse}
        arOppen={modalOppen}
        onStang={() => setModalOppen(false)}
      />
    </>
  );
}
