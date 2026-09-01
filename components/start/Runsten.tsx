/**
 * Skarpa, animerbara lager ovanpå den fotograferade stenen.
 * Bilden står för materialet; SVG står för läsbar runrad, mätpunkter och
 * transkribering. På så vis kan skanningen följa exakt samma geometri.
 */

export const INSKRIFT =
  "ᚴᚢᚾᛅᚱ ᛬ ᛚᛁᛏ ᛬ ᚱᛅᛁᛋᛅ ᛬ ᛋᛏᛅᛁᚾ ᛬ ᚦᛁᚾᛋᛅ ᛬ ᛅᚠᛏᛁᛦ ᛬ ᛒᚱᚢᚦᚢᚱ ᛬ ᛋᛁᚾ ᛬ ᛅᚢᚴ ᛬ ᛅᛏ ᛬ ᛘᚢᚦᚢᚱ";

export const TRANSLITTERERING =
  "kunar · lit · raisa · stain · þinsa · aftiʀ · bruþur · sin · auk · at · muþur";

/* Runraden följer ytterkanten: upp längs vänstersidan, över hjässan och ned
   längs högersidan. Mittfältet lämnas fritt, som på en verklig runsten. */
const RUNBANA =
  "M320 1392 C250 1110 252 720 330 430 C370 282 454 190 560 160 C682 146 752 236 764 412 C792 740 770 1090 654 1368";

/* Transkriberingen ligger avsiktligt utanför stenens siluett. */
const YTTERBANA =
  "M154 1450 C58 1126 74 640 196 326 C260 152 400 48 558 28 C762 8 920 166 950 388 C1004 746 982 1182 844 1450";

export function Runlager() {
  return (
    <svg
      className="sten-grafik"
      viewBox="0 0 1024 1536"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <path id="runbana" d={RUNBANA} fill="none" />
        <pattern
          id="pigmentslitage"
          width="89"
          height="71"
          patternUnits="userSpaceOnUse"
        >
          <rect width="89" height="71" fill="#ededed" />
          <circle cx="10" cy="14" r="3.6" fill="#202020" />
          <circle cx="48" cy="9" r="2.2" fill="#606060" />
          <circle cx="76" cy="38" r="4.8" fill="#303030" />
          <circle cx="31" cy="58" r="2.9" fill="#505050" />
          <ellipse cx="57" cy="54" rx="7" ry="2.2" fill="#222" />
          <path
            d="M17 35l13-4M55 24l9 3M5 65l10-5"
            stroke="#303030"
            strokeWidth="2.2"
          />
        </pattern>
        <mask
          id="runpigmentmask"
          x="0"
          y="0"
          width="1024"
          height="1536"
          maskUnits="userSpaceOnUse"
        >
          <rect width="1024" height="1536" fill="url(#pigmentslitage)" />
        </mask>
      </defs>

      <path className="runfara-skugga" d={RUNBANA} />
      <path className="runfara" d={RUNBANA} pathLength="1" />
      <path className="runfara-ljus" d={RUNBANA} />

      <text
        className="runsten-runor runsten-runor-skugga"
        dy="-8"
        transform="translate(-1.1 -1.1)"
      >
        <textPath
          href="#runbana"
          startOffset="1.5%"
          textLength="2860"
          lengthAdjust="spacingAndGlyphs"
        >
          {INSKRIFT}
        </textPath>
      </text>
      <text
        className="runsten-runor runsten-runor-ljus"
        dy="-8"
        transform="translate(1.2 1.4)"
      >
        <textPath
          href="#runbana"
          startOffset="1.5%"
          textLength="2860"
          lengthAdjust="spacingAndGlyphs"
        >
          {INSKRIFT}
        </textPath>
      </text>
      <text
        className="runsten-runor runsten-runor-pigment"
        dy="-8"
        mask="url(#runpigmentmask)"
      >
        <textPath
          href="#runbana"
          startOffset="1.5%"
          textLength="2860"
          lengthAdjust="spacingAndGlyphs"
        >
          {INSKRIFT}
        </textPath>
      </text>
    </svg>
  );
}

export function StenPunkter() {
  const matpunkter = [
    [430, 292, 3.5],
    [516, 244, 2.4],
    [622, 266, 3],
    [690, 348, 2.2],
    [367, 424, 2.6],
    [475, 454, 2],
    [592, 432, 3.2],
    [704, 494, 2.5],
    [330, 584, 3.1],
    [446, 618, 2.3],
    [567, 566, 2.8],
    [690, 652, 3.5],
    [318, 754, 2.4],
    [420, 798, 3.2],
    [548, 742, 2.1],
    [702, 822, 2.7],
    [312, 936, 3.4],
    [430, 902, 2.2],
    [566, 968, 3],
    [676, 1018, 2.4],
    [338, 1110, 2.8],
    [456, 1084, 3.6],
    [574, 1162, 2.2],
    [650, 1270, 3.1],
    [386, 1304, 2.5],
    [500, 1374, 3.3],
  ] as const;

  return (
    <svg
      className="sten-punktmoln"
      viewBox="0 0 1024 1536"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g className="punktmoln-linjer" fill="none" strokeLinecap="round">
        <path d={RUNBANA} />
        <path d="M326 488 C430 424 616 414 722 508" />
        <path d="M300 712 C438 646 632 656 742 750" />
        <path d="M292 932 C426 866 630 884 720 982" />
        <path d="M310 1150 C426 1088 594 1110 680 1210" />
        <path d="M392 402 C570 344 722 448 692 610 C664 744 470 748 370 664" />
        <path d="M372 838 C488 754 676 826 676 974 C672 1094 506 1140 408 1048" />
      </g>
      <g className="punktmoln-punkter">
        {matpunkter.map(([cx, cy, r], index) => (
          <circle key={index} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  );
}

export function Transkribering() {
  const text = `${TRANSLITTERERING} · ${TRANSLITTERERING}`;

  return (
    <svg
      className="sten-transkript"
      viewBox="-140 -120 1304 1776"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Live transkribering: ${TRANSLITTERERING}`}
    >
      <defs>
        <path id="ytterbana" d={YTTERBANA} fill="none" />
        <mask id="transkriptmask">
          <path
            className="transkript-masklinje"
            d={YTTERBANA}
            pathLength="1"
            fill="none"
            stroke="white"
            strokeWidth="96"
          />
        </mask>
      </defs>

      <path className="transkript-ledlinje" d={YTTERBANA} />
      <g mask="url(#transkriptmask)">
        <text className="transkript-text" dy="-17">
          <textPath
            href="#ytterbana"
            startOffset="1%"
            textLength="4200"
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}
