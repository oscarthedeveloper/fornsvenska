"use client";

import { useEffect, useRef } from "react";

/**
 * Rörelsen på startsidan.
 *
 * Pekaren väcker en kort rAF-slinga som skriver CSS-variabler direkt på
 * scenen. När stenen nått sitt målvärde stannar slingan helt, så en orörd
 * startsida inte kostar CPU/GPU efter entrén. Vid reduced motion startar den
 * aldrig.
 */

const MAX_Y = 10; // stenbilden är redan i trekvartsvy — små rörelser räcker
const MAX_X = 5;
const TROGHET = 0.065;
const NORMALBILDRUTA = 1000 / 60;

export function useTilt() {
  const scen = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scen.current;
    if (!el) return;

    const sten = el.querySelector<HTMLElement>(".sten-kropp");
    if (!sten) return;

    const stillsam = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (stillsam.matches) return;

    let malX = 0;
    let malY = 0;
    let ar_X = 0;
    let ar_Y = 0;
    let snurr = 0; // extra vridning från dragning
    let fart = 0;
    let drar = false;
    let sistX = 0;
    let levande = true;
    let ram = 0;
    let lagerTimer = 0;
    let foregaendeTid = 0;
    let ramRect = el.getBoundingClientRect();

    const starta = () => {
      if (!ram && levande && !document.hidden) {
        window.clearTimeout(lagerTimer);
        sten.classList.add("sten-rorelse");
        foregaendeTid = 0;
        ram = requestAnimationFrame(steg);
      }
    };

    const peka = (e: PointerEvent) => {
      const samplade = e.getCoalescedEvents?.() ?? [];
      const punkt = samplade.length ? samplade[samplade.length - 1] : e;
      const relativX =
        (punkt.clientX - (ramRect.left + ramRect.width / 2)) /
        (ramRect.width / 2);
      const relativY =
        (punkt.clientY - (ramRect.top + ramRect.height / 2)) /
        (ramRect.height / 2);

      malY = Math.max(-MAX_Y, Math.min(MAX_Y, relativX * MAX_Y));
      malX = Math.max(-MAX_X, Math.min(MAX_X, -relativY * MAX_X));

      if (drar) {
        fart += (punkt.clientX - sistX) * 0.14;
        sistX = punkt.clientX;
      }
      starta();
    };

    const ned = (e: PointerEvent) => {
      drar = true;
      sistX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
      el.dataset.drar = "1";
      starta();
    };

    const upp = () => {
      drar = false;
      delete el.dataset.drar;
      starta();
    };

    const lamna = () => {
      malX = 0;
      malY = 0;
      starta();
    };

    const mata = () => {
      ramRect = el.getBoundingClientRect();
    };

    /* Pilfunktion och inte funktionsdeklaration: en deklaration hissas upp
       ovanför nollkontrollen av el, och då tappar typkontrollen den. */
    const steg = (nu: number): void => {
      const bildrutor = foregaendeTid
        ? Math.min((nu - foregaendeTid) / NORMALBILDRUTA, 2)
        : 1;
      foregaendeTid = nu;

      snurr += fart * bildrutor;
      fart *= Math.pow(0.9, bildrutor);
      snurr *= Math.pow(0.965, bildrutor); // söker sig tillbaka till mitten

      const utjamning = 1 - Math.pow(1 - TROGHET, bildrutor);
      const malRotationY = Math.max(-18, Math.min(18, malY + snurr));
      ar_Y += (malRotationY - ar_Y) * utjamning;
      ar_X += (malX - ar_X) * utjamning;

      sten.style.transform = `translate3d(0, 0, 0) rotateX(${ar_X.toFixed(2)}deg) rotateY(${ar_Y.toFixed(2)}deg)`;

      const fardig =
        Math.abs(malRotationY - ar_Y) < 0.015 &&
        Math.abs(malX - ar_X) < 0.015 &&
        Math.abs(fart) < 0.015 &&
        Math.abs(snurr) < 0.015;

      if (fardig) {
        ram = 0;
        lagerTimer = window.setTimeout(() => {
          sten.classList.remove("sten-rorelse");
        }, 140);
      } else {
        ram = requestAnimationFrame(steg);
      }
    };

    const synlighet = () => {
      if (document.hidden) {
        cancelAnimationFrame(ram);
        ram = 0;
        sten.classList.remove("sten-rorelse");
      } else if (levande) {
        mata();
        starta();
      }
    };

    el.addEventListener("pointerenter", mata);
    el.addEventListener("pointermove", peka, { passive: true });
    el.addEventListener("pointerdown", ned);
    window.addEventListener("pointerup", upp);
    window.addEventListener("pointercancel", upp);
    window.addEventListener("blur", lamna);
    window.addEventListener("resize", mata, { passive: true });
    document.addEventListener("visibilitychange", synlighet);
    starta();

    return () => {
      levande = false;
      cancelAnimationFrame(ram);
      window.clearTimeout(lagerTimer);
      sten.classList.remove("sten-rorelse");
      el.removeEventListener("pointerenter", mata);
      el.removeEventListener("pointermove", peka);
      el.removeEventListener("pointerdown", ned);
      window.removeEventListener("pointerup", upp);
      window.removeEventListener("pointercancel", upp);
      window.removeEventListener("blur", lamna);
      window.removeEventListener("resize", mata);
      document.removeEventListener("visibilitychange", synlighet);
    };
  }, []);

  return { scen };
}
