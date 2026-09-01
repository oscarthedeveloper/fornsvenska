import Image from "next/image";
import { Runlager, StenPunkter, Transkribering } from "./Runsten";

/**
 * En lätt CSS-3D-kropp kring den högupplösta stenbilden. Tre mörka kopior
 * ligger bakom fronten på z-axeln; när kroppen vrids läses de som faktisk
 * tjocklek, medan frontbilden behåller fotografisk detalj.
 */
const ANTAL_LAGER = 3;

export default function Runsten3D() {
  return (
    <div className="sten-rymd">
      <div className="sten-vandning">
        <div className="sten-kropp">
          {Array.from({ length: ANTAL_LAGER }).map((_, i) => (
            <span
              key={i}
              className="sten-lager"
              style={{ "--i": i } as React.CSSProperties}
              aria-hidden="true"
            />
          ))}

          <div
            className="sten-front"
            style={{ "--i": ANTAL_LAGER } as React.CSSProperties}
          >
            <Image
              src="/runsten-hero.png"
              alt="En vittrad medeltida runsten med huggen slinga"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 92vw"
              className="sten-bild"
            />
            <Runlager />
            <StenPunkter />
            <span className="sten-linje" aria-hidden="true" />
          </div>

          <Transkribering />
        </div>
      </div>
    </div>
  );
}
