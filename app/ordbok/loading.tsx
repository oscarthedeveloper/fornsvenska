export default function OrdbokLoading() {
  return (
    <div
      className="flex-1 p-8 max-w-4xl mx-auto flex flex-col gap-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="border border-ink bg-panel p-6 flex items-center justify-between gap-4">
        <span className="micro">Laddar Söderwalls fornsvenska ordbok…</span>
        <span className="nano opacity-55">41 744 källartiklar</span>
      </div>
    </div>
  );
}
