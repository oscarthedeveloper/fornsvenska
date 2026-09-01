/**
 * Det som ligger på bordet framför stenen.
 *
 * Ett enda kort numera: kurvan över kasusformernas fall i diplomen. Det är
 * sajtens ämne i en bild, och ensamt läser det som en anteckning bredvid
 * föremålet i stället för som ett dukat bord.
 *
 * --r är kortets vilovinkel, --fordrojning dess plats i inanimationen och
 * --djup dess parallax: ju längre fram, desto mer rör det sig när pekaren
 * flyttar sig. Se .kollagedel i globals.css.
 */

const STIL = {
  "--r": "5deg",
  "--fordrojning": "260ms",
  "--djup": 13,
} as React.CSSProperties;

export default function Kollage() {
  return (
    <div className="kollage">
      <div className="kollagedel del-diagram" style={STIL} aria-hidden="true">
        <span className="nano">Fig. 21 · Kasusformer i diplom</span>
        <svg viewBox="0 0 180 96" className="diagram-yta">
          <g stroke="var(--ink)" strokeWidth="0.5" opacity="0.25">
            <path d="M14 78 H172 M14 54 H172 M14 30 H172" />
          </g>
          <path d="M14 8 V78 H172" fill="none" stroke="var(--ink)" strokeWidth="1" />
          <path
            d="M14 20 C46 26 62 34 84 50 C104 64 132 72 172 74"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <path
            d="M14 62 C48 60 70 58 96 56 C124 54 146 52 172 50"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1"
            strokeDasharray="4 3"
            opacity="0.7"
          />
        </svg>
        <span className="nano opacity-55">1350 — 1500</span>
      </div>
    </div>
  );
}
