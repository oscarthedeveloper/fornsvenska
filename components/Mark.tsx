/** Geometriskt märke — tre staplade trianglar som bildar en större triangel. */
export default function Mark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <polygon points="13,0.5 19.6,12 6.4,12" fill="var(--ink)" />
      <polygon points="6.4,13 13,24.5 -0.2,24.5" fill="var(--ink)" />
      <polygon points="19.6,13 26.2,24.5 13,24.5" fill="var(--ink)" />
    </svg>
  );
}
