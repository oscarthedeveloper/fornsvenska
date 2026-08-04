/**
 * Runhjulet — dekorativt instrument, inte en måltavla.
 * Fyra streckade cirklar som medvetet ligger något förskjutna mot varandra.
 * Runraden är MEDELTIDSRUNOR (inkl. stungna runor), inte urnordisk futhark:
 * den äldre futharken föregår fornsvenskan med omkring tusen år.
 *
 * viewBox är beskuren tätt runt ytterringen — annars slösas ~13 % av
 * ritytan på tom marginal och hjulet krymper i onödan.
 */

const RUNES = [
  "ᚠ", "ᚢ", "ᚦ", "ᚮ", "ᚱ", "ᚴ", "ᚼ", "ᚿ", "ᛁ", "ᛆ",
  "ᛌ", "ᛐ", "ᛒ", "ᛘ", "ᛚ", "ᛦ", "ᚧ", "ᚵ", "ᛂ", "ᛔ",
];

const CX = 230;
const CY = 230;
const RUNE_RADIUS = 190;

export default function RunicWheel() {
  return (
    <svg
      viewBox="22 22 416 416"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className="w-full h-full max-h-full"
    >
      {/* Innerst: azurblå ring */}
      <circle
        className="ring ring-ccw"
        cx="244"
        cy="216"
        r="52"
        fill="none"
        stroke="var(--azure)"
        strokeWidth="1.2"
        strokeDasharray="5 7"
      />

      {/* Två svarta mellanringar — döljs under 768px */}
      <circle
        className="ring ring-cw ring-optional"
        cx="222"
        cy="240"
        r="92"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeDasharray="5 7"
      />
      <circle
        className="ring ring-ccw ring-optional"
        cx="243"
        cy="223"
        r="130"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeDasharray="5 7"
      />

      {/* Ytterst: accentring */}
      <circle
        className="ring ring-cw"
        cx={CX}
        cy={CY}
        r="166"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeDasharray="5 7"
      />

      {/* Medeltidsrunorna, tangentiellt roterade kring ytterringen */}
      <g className="rune" fill="var(--ink)">
        {RUNES.map((glyph, i) => {
          const deg = -90 + i * (360 / RUNES.length);
          const rad = (deg * Math.PI) / 180;
          const x = CX + RUNE_RADIUS * Math.cos(rad);
          const y = CY + RUNE_RADIUS * Math.sin(rad);
          return (
            <text
              key={`${glyph}-${i}`}
              x={x}
              y={y}
              fontSize="17"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${deg + 90} ${x} ${y})`}
              className={i % 2 === 1 ? "rune-alt" : undefined}
            >
              {glyph}
            </text>
          );
        })}
      </g>

      {/* Centrum: stor ᚦ bakom ett tunt hårkors */}
      <text
        className="rune"
        x={CX}
        y={CY}
        fontSize="72"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--ink)"
        opacity="0.12"
      >
        ᚦ
      </text>
      <line
        x1={CX - 20}
        y1={CY}
        x2={CX + 20}
        y2={CY}
        stroke="var(--ink)"
        strokeWidth="1.2"
      />
      <line
        x1={CX}
        y1={CY - 20}
        x2={CX}
        y2={CY + 20}
        stroke="var(--ink)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
