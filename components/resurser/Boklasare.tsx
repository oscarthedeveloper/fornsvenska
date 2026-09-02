"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ANTAL_SIDOR = 25;
const PDF = "/bocker/vastgotalagen/vastgotalagen-maskintext.pdf";

const KAPITEL = [
  { sida: 1, nummer: "01", titel: "Kyrkobalken", kalla: "Kirkiu Bolkær" },
  { sida: 3, nummer: "02", titel: "Mandråpsbalken", kalla: "Af mandrapi" },
  { sida: 6, nummer: "03", titel: "Sårsmålsbalken", kalla: "Af særæ malum" },
  { sida: 6, nummer: "04", titel: "Vådasår", kalla: "Af vaþæ sarum" },
  { sida: 7, nummer: "05", titel: "Slagsmål", kalla: "Bardaghæ" },
  { sida: 8, nummer: "06", titel: "Urbota mål", kalla: "Orbotæ mal" },
  { sida: 8, nummer: "07", titel: "Ärvdabalken", kalla: "Ærfþær bolkær" },
  { sida: 11, nummer: "08", titel: "Giftermålsbalken", kalla: "Giptar bolker" },
  { sida: 13, nummer: "09", titel: "Rättlösabalken", kalla: "Rætlosæ bolkær" },
  { sida: 15, nummer: "10", titel: "Jordabalken", kalla: "Iorþær bolkær" },
  { sida: 18, nummer: "11", titel: "Om kvarnbygge", kalla: "Huru mylnu skal gæræ" },
  { sida: 18, nummer: "12", titel: "Tjuvabalken", kalla: "Þiuuæ bolkær" },
  { sida: 22, nummer: "13", titel: "Fornämessaker", kalla: "Fornæmix sakir" },
  { sida: 24, nummer: "14", titel: "Lekarerätten", kalla: "Lecara rætar" },
  { sida: 24, nummer: "15", titel: "Konungsbalken", kalla: "Conongs bolkær" },
  { sida: 24, nummer: "16", titel: "Tinglottens delning", kalla: "Horo þing lot skal skiptæ" },
] as const;

function sidbild(sida: number) {
  return `/bocker/vastgotalagen/sidor/sida-${String(sida).padStart(2, "0")}.png`;
}

function uppslagsstart(sida: number) {
  if (sida <= 1) return 1;
  return sida % 2 === 0 ? sida : sida - 1;
}

export default function Boklasare() {
  const [sida, setSida] = useState(1);
  const [enkelsida, setEnkelsida] = useState(false);
  const [skala, setSkala] = useState(1);
  const [fullskarm, setFullskarm] = useState(false);
  const lasare = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const uppdatera = () => setEnkelsida(media.matches);
    uppdatera();
    media.addEventListener("change", uppdatera);
    return () => media.removeEventListener("change", uppdatera);
  }, []);

  const hoppaTill = useCallback(
    (mal: number) => {
      const inomBoken = Math.min(ANTAL_SIDOR, Math.max(1, Math.round(mal)));
      setSida(enkelsida ? inomBoken : uppslagsstart(inomBoken));
    },
    [enkelsida]
  );

  const forra = useCallback(() => {
    setSida((nu) => {
      if (enkelsida) return Math.max(1, nu - 1);
      if (nu <= 2) return 1;
      return Math.max(2, uppslagsstart(nu) - 2);
    });
  }, [enkelsida]);

  const nasta = useCallback(() => {
    setSida((nu) => {
      if (enkelsida) return Math.min(ANTAL_SIDOR, nu + 1);
      if (nu === 1) return 2;
      return Math.min(ANTAL_SIDOR - 1, uppslagsstart(nu) + 2);
    });
  }, [enkelsida]);

  useEffect(() => {
    const tangenter = (event: KeyboardEvent) => {
      const mal = event.target as HTMLElement | null;
      if (mal?.matches("input, select, textarea, button, a, [contenteditable='true']")) return;

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        forra();
      }
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        nasta();
      }
      if (event.key === "Home") {
        event.preventDefault();
        hoppaTill(1);
      }
      if (event.key === "End") {
        event.preventDefault();
        hoppaTill(ANTAL_SIDOR);
      }
    };

    window.addEventListener("keydown", tangenter);
    return () => window.removeEventListener("keydown", tangenter);
  }, [forra, hoppaTill, nasta]);

  useEffect(() => {
    const lyssna = () => setFullskarm(document.fullscreenElement === lasare.current);
    document.addEventListener("fullscreenchange", lyssna);
    return () => document.removeEventListener("fullscreenchange", lyssna);
  }, []);

  const synligaSidor = useMemo(() => {
    if (enkelsida || sida === 1) return [sida];
    const start = uppslagsstart(sida);
    return [start, start + 1].filter((nummer) => nummer <= ANTAL_SIDOR);
  }, [enkelsida, sida]);

  /* Nästa uppslag hämtas diskret i förväg. Det gör sidbytet omedelbart utan
     att alla 25 högupplösta sidor behöver laddas när läsaren öppnas. */
  useEffect(() => {
    const nastaSida = enkelsida ? sida + 1 : sida === 1 ? 2 : uppslagsstart(sida) + 2;
    const sistaAttHamta = enkelsida ? nastaSida : nastaSida + 1;
    for (let nummer = nastaSida; nummer <= Math.min(ANTAL_SIDOR, sistaAttHamta); nummer++) {
      const bild = new Image();
      bild.src = sidbild(nummer);
    }
  }, [enkelsida, sida]);

  const aktivtKapitel = [...KAPITEL].reverse().find((kapitel) => kapitel.sida <= sida) ?? KAPITEL[0];
  const arForst = sida === 1;
  const arSist = enkelsida ? sida === ANTAL_SIDOR : sida >= ANTAL_SIDOR - 1;
  const sidtext = synligaSidor.length === 2
    ? `Sida ${synligaSidor[0]}–${synligaSidor[1]} av ${ANTAL_SIDOR}`
    : `Sida ${synligaSidor[0]} av ${ANTAL_SIDOR}`;

  const vaxlaFullskarm = async () => {
    if (!document.fullscreenElement) await lasare.current?.requestFullscreen();
    else await document.exitFullscreen();
  };

  return (
    <section ref={lasare} className="boklasare" aria-label="Bokläsare för Äldre Västgötalagen">
      <header className="bokhuvud">
        <div className="bokhuvud-identitet">
          <Link href="/resurser" className="bokverktygsknapp" aria-label="Tillbaka till resursbiblioteket">
            ← <span>Till biblioteket</span>
          </Link>
          <span className="bokhuvud-streck" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="display">Äldre Västgötalagen</h1>
            <p className="nano">Maskintext · Cod. Holm. B 59 · 25 sidor</p>
          </div>
        </div>

        <div className="bokverktyg" aria-label="Visningsverktyg">
          <button
            type="button"
            className="bokverktygsknapp"
            onClick={() => setSkala((varde) => Math.max(0.8, +(varde - 0.1).toFixed(1)))}
            disabled={skala <= 0.8}
            aria-label="Minska sidorna"
          >
            −
          </button>
          <span className="nano bokzoom" aria-live="polite">{Math.round(skala * 100)}%</span>
          <button
            type="button"
            className="bokverktygsknapp"
            onClick={() => setSkala((varde) => Math.min(1.3, +(varde + 0.1).toFixed(1)))}
            disabled={skala >= 1.3}
            aria-label="Förstora sidorna"
          >
            +
          </button>
          <button type="button" className="bokverktygsknapp bokfullskarm" onClick={() => void vaxlaFullskarm()}>
            {fullskarm ? "Avsluta helskärm" : "Helskärm"}
          </button>
          <a className="bokverktygsknapp" href={PDF} target="_blank" rel="noreferrer">
            PDF ↗
          </a>
        </div>
      </header>

      <div className="bokarbetsyta">
        <aside className="bokindex">
          <div className="bokindex-intro">
            <span className="nano">Innehåll / 16 balkar</span>
            <p className="display">{aktivtKapitel.titel}</p>
            <span className="nano opacity-55">{aktivtKapitel.kalla}</span>
          </div>

          <nav aria-label="Bokens innehållsförteckning">
            {KAPITEL.map((kapitel) => (
              <button
                key={`${kapitel.nummer}-${kapitel.titel}`}
                type="button"
                data-aktiv={kapitel === aktivtKapitel ? "1" : undefined}
                onClick={() => hoppaTill(kapitel.sida)}
              >
                <span>{kapitel.nummer}</span>
                <span>{kapitel.titel}</span>
                <span>s. {kapitel.sida}</span>
              </button>
            ))}
          </nav>

          <p className="nano bokkalla">
            Inskriven efter Collin/Schlyters utgåva (SSGL I) av Lars-Olof Delsing,
            Institutionen för nordiska språk i Lund.
          </p>
        </aside>

        <div className="bokbord">
          <button
            type="button"
            className="bokkant bokkant-vanster"
            onClick={forra}
            disabled={arForst}
            aria-label="Föregående sida eller uppslag"
          >
            ‹
          </button>

          <div
            key={synligaSidor.join("-")}
            className="bokuppslag"
            data-enkelt={synligaSidor.length === 1 ? "1" : undefined}
            style={{
              width: `${skala * 100}%`,
              maxWidth: `${(synligaSidor.length === 1 ? 455 : 920) * skala}px`,
            }}
          >
            {synligaSidor.map((nummer) => (
              <figure key={nummer} className="boksida">
                {/* Sidbilderna är den visuella bokvyn; original-PDF:en ovan
                    behåller markerbar text, utskrift och hjälpmedelsstöd. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sidbild(nummer)}
                  alt={`Äldre Västgötalagen, sida ${nummer}`}
                  width={1191}
                  height={1684}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                <figcaption className="sr-only">Sida {nummer}</figcaption>
              </figure>
            ))}
          </div>

          <button
            type="button"
            className="bokkant bokkant-hoger"
            onClick={nasta}
            disabled={arSist}
            aria-label="Nästa sida eller uppslag"
          >
            ›
          </button>
        </div>
      </div>

      <footer className="bokfot">
        <button type="button" className="bokfot-knapp" onClick={forra} disabled={arForst}>
          <span aria-hidden="true">←</span><span className="bokfot-etikett">Föregående</span>
        </button>
        <label className="bokframsteg">
          <span className="sr-only">Gå till sida</span>
          <input
            type="range"
            min="1"
            max={ANTAL_SIDOR}
            value={sida}
            onChange={(event) => hoppaTill(Number(event.target.value))}
          />
          <span className="nano" aria-live="polite">{sidtext}</span>
        </label>
        <button type="button" className="bokfot-knapp" onClick={nasta} disabled={arSist}>
          <span className="bokfot-etikett">Nästa</span><span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}
