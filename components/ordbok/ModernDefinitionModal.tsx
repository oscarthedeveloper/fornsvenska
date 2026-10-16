"use client";

import { useEffect } from "react";
import type { ModerniseradDefinition, OrdbokPost } from "@/lib/ordbok/typer";
import ModernDefinitionForm from "./ModernDefinitionForm";

export default function ModernDefinitionModal({
  post,
  befintligDefinition,
  arOppen,
  onStang,
}: {
  post: OrdbokPost;
  befintligDefinition?: ModerniseradDefinition;
  arOppen: boolean;
  onStang: () => void;
}) {
  useEffect(() => {
    function hanteraTangent(e: KeyboardEvent) {
      if (e.key === "Escape" && arOppen) {
        onStang();
      }
    }
    window.addEventListener("keydown", hanteraTangent);
    return () => window.removeEventListener("keydown", hanteraTangent);
  }, [arOppen, onStang]);

  if (!arOppen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modern-def-modal-rubrik"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/50 p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onStang();
      }}
    >
      <div className="w-full max-w-[620px] bg-panel border border-ink p-5 sm:p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
        <ModernDefinitionForm
          post={post}
          befintligDefinition={befintligDefinition}
          onAvbryt={onStang}
        />
      </div>
    </div>
  );
}
