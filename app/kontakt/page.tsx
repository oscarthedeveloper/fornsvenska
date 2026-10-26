import type { Metadata } from 'next';
import Toppnav from '@/components/Toppnav';
import ColophonStrip from '@/components/ColophonStrip';
import KontaktFormular from '@/components/KontaktFormular';

export const metadata: Metadata = {
  title: 'Kontakt och rättelser',
  description:
    'Kontakta redaktionen för Fornsvenska.se med synpunkter, källkritiska rättelser, runologiska anmärkningar eller allmänna frågor.',
  alternates: {
    canonical: '/kontakt',
  },
};

export default function KontaktSida() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Toppnav active="/kontakt" />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 border-b border-line pb-6">
          <div className="micro text-rust uppercase tracking-wider mb-2 font-mono">
            Redaktion & Källrespons
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-3 font-normal">
            Kontakt och rättelser
          </h1>
          <p className="text-sm md:text-base leading-relaxed text-stone-700 max-w-2xl">
            Fornsvenska.se är en språkhistorisk studieplattform och digital edition baserad på vetenskapliga källor.
            Har du funnit en felaktighet i en text, en föråldrad tolkning av en runinskrift, ett fel i ordboken
            eller vill bidra med källkritiska anmärkningar? Skicka ditt meddelande direkt till redaktionen via formuläret nedan.
          </p>
        </header>

        <section aria-labelledby="formular-rubrik">
          <h2 id="formular-rubrik" className="sr-only">
            Kontaktformulär
          </h2>
          <KontaktFormular
            rubrik="Skicka meddelande till redaktionen"
            beskrivning="Fyll i dina uppgifter och vad ärendet gäller. Vi granskar alla inkomna synpunkter gentemot gällande källupplagor."
          />
        </section>

        <section className="mt-12 pt-8 border-t border-line text-xs text-stone-600 leading-relaxed font-mono">
          <h3 className="font-bold text-ink uppercase tracking-wider mb-2">
            Riktlinjer för källrättelser
          </h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Ange gärna specifik inskrifts- eller textbeteckning (t.ex. <em>Öl 1</em>, <em>U 112A</em>, eller kapitel i <em>Äldre Västgötalagen</em>).
            </li>
            <li>
              Hänvisa om möjligt till källpublikation (t.ex. <em>Sveriges runinskrifter</em>, <em>Samnordisk runtextdatabas</em>, <em>Söderwall</em> eller vetenskaplig artikel).
            </li>
            <li>
              Formuläret behandlas av redaktionen och skickas direkt via e-post utan krav på särskild e-postklient.
            </li>
          </ul>
        </section>
      </main>

      <ColophonStrip
        left="Fornsvenska.se"
        centre="Kontakt & Rättelser"
        right="Kontakt"
      />
    </div>
  );
}
