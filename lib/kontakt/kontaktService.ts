/**
 * CF10: Kontakttjänst, spamskydd, frekvensbegränsning och Resend-kvothantering
 *
 * Ansvarar för:
 * 1. Serverhemlig nyckelhantering (RESEND_API_KEY exponeras aldrig).
 * 2. Flernivåspamskydd:
 *    - Dold honeypot (bot-field)
 *    - Indatabegränsning (namn <= 100, epost <= 150, amne <= 200, meddelande <= 5 000)
 *    - Tidsspärr mot automatiserade skript (minimum 1,5 sekunder före inskickning)
 *    - Frekvensbegränsning (rate limiting: max 5 inskick per IP per timme)
 * 3. Månads- och dagskvotkontroll mot Resends gratisgräns (100 mejl/dag).
 * 4. Mockad e-postadapter för tester och lokal utveckling: inga oavsiktliga mejl skickas.
 * 5. Total felisolering: fel i kontaktfunktionen kan aldrig påverka andra delar av sajten.
 */

import { Resend } from 'resend';

export interface KontaktMeddelande {
  namn?: string;
  epost: string;
  amne?: string;
  meddelande: string;
  botField?: string;
  tidsstampelFormular?: number; // Millisekunder när formuläret laddades
  klientIp?: string;
}

export interface KontaktResultat {
  ok: boolean;
  meddelandeId?: string;
  error?: string;
  httpStatus: number;
  leveranssatt: 'resend_live' | 'mock_test';
}

// In-memory frekvensbegränsning per klient (IP)
interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

// Daglig kvotkontroll (Resend Free: max 100 mejl/dag)
interface DailyQuotaTracker {
  datum: string; // YYYY-MM-DD
  count: number;
  maxPerDag: number;
}

const dagligKvot: DailyQuotaTracker = {
  datum: new Date().toISOString().slice(0, 10),
  count: 0,
  maxPerDag: 100, // Resend gratisgräns
};

/** Återställer räknare i tester */
export function nollstallRateLimitOchKvot() {
  rateLimitMap.clear();
  dagligKvot.datum = new Date().toISOString().slice(0, 10);
  dagligKvot.count = 0;
}

export function hamtaKontaktKvotStatus() {
  const idag = new Date().toISOString().slice(0, 10);
  if (dagligKvot.datum !== idag) {
    dagligKvot.datum = idag;
    dagligKvot.count = 0;
  }
  return {
    datum: dagligKvot.datum,
    anvantIdag: dagligKvot.count,
    maxPerDag: dagligKvot.maxPerDag,
    kvarIdag: Math.max(0, dagligKvot.maxPerDag - dagligKvot.count),
  };
}

/**
 * Validerar och skickar kontaktmeddelande med skydd mot missbruk.
 */
export async function skickaKontaktMeddelande(
  indata: KontaktMeddelande,
  alternativ: {
    tvingaMock?: boolean;
    nu?: number;
  } = {}
): Promise<KontaktResultat> {
  const nu = alternativ.nu || Date.now();
  const klientIp = indata.klientIp || '127.0.0.1';

  // 1. Spamskydd: Honeypot-kontroll
  if (indata.botField && indata.botField.trim().length > 0) {
    // Returnera tyst framgång för att lura botar utan att skicka mejl
    return {
      ok: true,
      meddelandeId: 'silent-bot-discard',
      httpStatus: 200,
      leveranssatt: 'mock_test',
    };
  }

  // 2. Tidsspärr mot blixtsnabba skript (kräver minst 1 500 ms mellan rendering och submit om tidsstämpel finns)
  if (indata.tidsstampelFormular && indata.tidsstampelFormular > 0) {
    const forflutenTidMs = nu - indata.tidsstampelFormular;
    if (forflutenTidMs < 1500) {
      return {
        ok: false,
        error: 'Formuläret skickades in för snabbt. Vänligen försök igen.',
        httpStatus: 400,
        leveranssatt: 'mock_test',
      };
    }
  }

  // 3. Frekvensbegränsning (Rate limit: max 5 meddelanden per timme per IP)
  const bucket = rateLimitMap.get(klientIp);
  const EN_TIMME_MS = 60 * 60 * 1000;

  if (bucket) {
    if (nu < bucket.resetAt) {
      if (bucket.count >= 5) {
        return {
          ok: false,
          error: 'För många kontaktförfrågningar från denna adress. Vänligen vänta en stund innan du skickar igen.',
          httpStatus: 429,
          leveranssatt: 'mock_test',
        };
      }
      bucket.count++;
    } else {
      bucket.count = 1;
      bucket.resetAt = nu + EN_TIMME_MS;
    }
  } else {
    rateLimitMap.set(klientIp, { count: 1, resetAt: nu + EN_TIMME_MS });
  }

  // 4. Obligatoriska fält och formatkontroll
  const epost = (indata.epost || '').trim();
  const meddelande = (indata.meddelande || '').trim();
  const namn = (indata.namn || '').trim();
  const amne = (indata.amne || '').trim();

  if (!epost || !meddelande) {
    return {
      ok: false,
      error: 'Både e-postadress och meddelande måste fyllas i.',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(epost)) {
    return {
      ok: false,
      error: 'Vänligen ange en giltig e-postadress.',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  // 5. Indatabegränsning (längdkontroller)
  if (namn.length > 100) {
    return {
      ok: false,
      error: 'Namnfältet överskrider tillåten maxlängd (100 tecken).',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  if (epost.length > 150) {
    return {
      ok: false,
      error: 'E-postadressen överskrider tillåten maxlängd (150 tecken).',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  if (amne.length > 200) {
    return {
      ok: false,
      error: 'Ämnesraden överskrider tillåten maxlängd (200 tecken).',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  if (meddelande.length > 5000) {
    return {
      ok: false,
      error: 'Meddelandet överskrider tillåten maxlängd (5 000 tecken).',
      httpStatus: 400,
      leveranssatt: 'mock_test',
    };
  }

  // 6. Dagskvotkontroll mot gratisgräns (max 100 mejl/dag)
  const idag = new Date(nu).toISOString().slice(0, 10);
  if (dagligKvot.datum !== idag) {
    dagligKvot.datum = idag;
    dagligKvot.count = 0;
  }

  if (dagligKvot.count >= dagligKvot.maxPerDag) {
    return {
      ok: false,
      error: 'Dagens utskickskvot för kontaktformuläret har uppnåtts (100/100). Kontakta redaktionen direkt via e-post.',
      httpStatus: 429,
      leveranssatt: 'mock_test',
    };
  }

  // 7. Val av e-posttransport (Resend live vs Mock-adapter)
  const apiKey = process.env.RESEND_API_KEY;
  const arMockMiljo =
    alternativ.tvingaMock ||
    process.env.NODE_ENV === 'test' ||
    process.env.KONTAKT_TRANSPORT === 'mock';

  if (arMockMiljo) {
    dagligKvot.count++;
    const mockId = `mock-msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return {
      ok: true,
      meddelandeId: mockId,
      httpStatus: 200,
      leveranssatt: 'mock_test',
    };
  }

  if (!apiKey) return { ok: false, error: "Kontaktfunktionen är inte konfigurerad.", httpStatus: 503, leveranssatt: "resend_live" };

  // 8. Skarp Resend-sändning (kräver konfigurerad nyckel och mottagare)
  const mottagare = process.env.KONTAKT_MOTTAGARE_EPOST || process.env.RESEND_TO_EMAIL;
  if (!mottagare) {
    return {
      ok: false,
      error: 'Mottagaradress för meddelanden är inte konfigurerad.',
      httpStatus: 503,
      leveranssatt: 'resend_live',
    };
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Fornsvenska.se <onboarding@resend.dev>';
  const rubrik = amne ? `[Fornsvenska.se] ${amne}` : '[Fornsvenska.se] Nytt meddelande från webbplatsen';

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromAddress,
      to: [mottagare],
      replyTo: epost,
      subject: rubrik,
      text: `Nytt meddelande via Fornsvenska.se\n\nFrån: ${namn || 'Ej angivet'}\nE-post: ${epost}\nÄmne: ${amne}\n\nMeddelande:\n${meddelande}`,
    });

    if (result.error) {
      return {
        ok: false,
        error: `Kunde inte leverera meddelandet: ${result.error.message}`,
        httpStatus: 502,
        leveranssatt: 'resend_live',
      };
    }

    dagligKvot.count++;
    return {
      ok: true,
      meddelandeId: result.data?.id,
      httpStatus: 200,
      leveranssatt: 'resend_live',
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Ett tekniskt fel uppstod vid leverans.',
      httpStatus: 500,
      leveranssatt: 'resend_live',
    };
  }
}
