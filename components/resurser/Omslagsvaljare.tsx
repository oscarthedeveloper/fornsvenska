"use client";

import { useRef, useState } from "react";
import { skapaKlient } from "@/lib/supabase/client";
import Knapp from "@/components/admin/Knapp";

const MAX_BYTE = 4 * 1024 * 1024;

/**
 * Laddar upp en omslagsbild till Supabase storage och lämnar tillbaka den
 * publika adressen. Filen får bara skrivas av administratörer — det avgörs
 * av policyerna i resursbibliotek.sql, inte här.
 */
export default function Omslagsvaljare({
  resursId,
  harOmslag,
  onKlar,
}: {
  resursId: string;
  harOmslag: boolean;
  onKlar: (url: string | null) => void;
}) {
  const input = useRef<HTMLInputElement | null>(null);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);

  const ladda = async (fil: File) => {
    setFel(null);

    if (!fil.type.startsWith("image/")) {
      setFel("Bara bildfiler går att använda som omslag.");
      return;
    }
    if (fil.size > MAX_BYTE) {
      setFel("Bilden är större än 4 MB. Krymp den först.");
      return;
    }

    setLaddar(true);
    try {
      const supabase = skapaKlient();
      const andelse = fil.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const vag = `omslag/${resursId}-${Date.now()}.${andelse}`;

      const { error } = await supabase.storage
        .from("resurser")
        .upload(vag, fil, { upsert: true, cacheControl: "3600" });

      if (error) throw error;

      const { data } = supabase.storage.from("resurser").getPublicUrl(vag);
      onKlar(data.publicUrl);
    } catch (e) {
      setFel(e instanceof Error ? e.message : "Uppladdningen misslyckades.");
    } finally {
      setLaddar(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5 flex-wrap">
        <Knapp
          titel="Välj en omslagsbild"
          onClick={() => input.current?.click()}
        >
          {laddar ? "Laddar upp …" : harOmslag ? "Byt omslag" : "+ omslag"}
        </Knapp>
        {harOmslag && (
          <Knapp titel="Ta bort omslaget" fara onClick={() => onKlar(null)}>
            ✕ omslag
          </Knapp>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const fil = e.target.files?.[0];
          if (fil) void ladda(fil);
        }}
      />

      {fel && <span className="nano text-[0.55rem] leading-[1.5]">{fel}</span>}
    </div>
  );
}
