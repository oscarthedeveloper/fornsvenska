/**
 * Kolofonremsa — heltäckande svart list, papperfärgad mikrotext i tre zoner.
 * Under 768px kollapsar remsan till en enda centrerad rad.
 */
export default function ColophonStrip({
  left,
  centre,
  right,
}: {
  left: string;
  centre: string;
  right: string;
}) {
  return (
    <div className="h-[34px] shrink-0 bg-ink text-paper flex items-center px-3">
      <span className="micro mx-auto md:hidden">{centre}</span>
      <div className="hidden md:grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
        <span className="micro whitespace-nowrap">{left}</span>
        <span className="micro text-center whitespace-nowrap">{centre}</span>
        <span className="micro text-right whitespace-nowrap">{right}</span>
      </div>
    </div>
  );
}
