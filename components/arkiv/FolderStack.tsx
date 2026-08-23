"use client";

import Link from "next/link";
import type { Node } from "@/lib/typer";
import Redigerbar from "@/components/admin/Redigerbar";
import Knapp from "@/components/admin/Knapp";

/**
 * Hängmappsstapeln. Flikarna växlar sida varannan rad och överlappar
 * uppåt, så att man ser hela raden av flikar på en gång — som när man
 * bläddrar i ett arkivskåp. Fickan längst fram bär mappens namn.
 *
 * I redigeringsläget är raden inte längre en länk: titeln redigeras på plats
 * och navigeringen flyttas till en egen pilknapp. Annars hade knapparna
 * legat inuti en länk, vilket varken fungerar för mus eller skärmläsare.
 */
export default function FolderStack({
  items,
  hrefFor,
  title,
  counts,
  redigerbar = false,
  onNamn,
  onFlytta,
  onTaBort,
}: {
  items: Node[];
  hrefFor: (node: Node) => string;
  title: string;
  counts: { folders: number; docs: number };
  redigerbar?: boolean;
  onNamn?: (node: Node, titel: string) => void;
  onFlytta?: (node: Node, riktning: -1 | 1) => void;
  onTaBort?: (node: Node) => void;
}) {
  return (
    <div className="folder-stack w-full max-w-[960px] mx-auto">
      {items.map((item, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        const href = hrefFor(item);

        const insida = (
          <>
            <span className="folder-shell" data-side={side} aria-hidden="true">
              <span className="folder-face" data-side={side} />
            </span>
            <span className="folder-label" data-side={side}>
              <span className="folder-num">{String(i + 1).padStart(3, "0")}</span>
              {redigerbar ? (
                <Redigerbar
                  varde={item.title}
                  redigerbar
                  formatering={false}
                  platshallare="Namn"
                  onChange={(titel) => onNamn?.(item, titel)}
                  className="folder-title"
                />
              ) : (
                <span className="folder-title">{item.title}</span>
              )}
              <span className="folder-kind">
                {item.kind === "folder" ? "Mapp" : "Dok"}
              </span>

              {redigerbar && (
                <span className="flex items-center gap-1">
                  <Link
                    href={href}
                    title="Öppna"
                    className="nano border border-ink px-1.5 py-1 leading-none bg-panel transition-opacity duration-[140ms] hover:opacity-60"
                  >
                    →
                  </Link>
                  <Knapp titel="Flytta upp" onClick={() => onFlytta?.(item, -1)}>
                    ↑
                  </Knapp>
                  <Knapp titel="Flytta ned" onClick={() => onFlytta?.(item, 1)}>
                    ↓
                  </Knapp>
                  <Knapp titel="Ta bort" fara onClick={() => onTaBort?.(item)}>
                    ✕
                  </Knapp>
                </span>
              )}
            </span>
          </>
        );

        return redigerbar ? (
          <div key={item.slug} className="folder-row" style={{ zIndex: i + 1 }} data-tone={i % 6}>
            {insida}
          </div>
        ) : (
          <Link
            key={item.slug}
            href={href}
            className="folder-row"
            data-tone={i % 6}
            style={{ zIndex: i + 1 }}
          >
            {insida}
          </Link>
        );
      })}

      <div className="pocket" style={{ zIndex: items.length + 1 }}>
        <span className="nano absolute top-0 right-[1.6rem] h-[38px] flex items-center">
          Arkiv
        </span>
        <h1 className="display text-[clamp(2rem,4vw,3.2rem)] leading-none">
          {title}
        </h1>
        <p className="micro mt-3 opacity-70">
          {counts.folders} mappar / {counts.docs} dokument
        </p>
      </div>
    </div>
  );
}
