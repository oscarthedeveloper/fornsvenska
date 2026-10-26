import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let namn = '';
    let epost = '';
    let amne = '';
    let meddelande = '';
    let botField = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await request.json();
      namn = data.namn?.trim() || '';
      epost = data.epost?.trim() || '';
      amne = data.amne?.trim() || '';
      meddelande = data.meddelande?.trim() || '';
      botField = data['bot-field'] || data.botField || '';
    } else {
      const formData = await request.formData();
      namn = formData.get('namn')?.toString().trim() || '';
      epost = formData.get('epost')?.toString().trim() || '';
      amne = formData.get('amne')?.toString().trim() || '';
      meddelande = formData.get('meddelande')?.toString().trim() || '';
      botField = formData.get('bot-field')?.toString() || '';
    }

    // Spamskydd: avvisa tyst om dolda honeypot-fältet fyllts i
    if (botField) {
      return NextResponse.json({ ok: true });
    }

    // Validering
    if (!epost || !meddelande) {
      return NextResponse.json(
        { error: 'Både e-postadress och meddelande måste fyllas i.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(epost)) {
      return NextResponse.json(
        { error: 'Vänligen ange en giltig e-postadress.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY är inte konfigurerad i miljövariablerna.');
      return NextResponse.json(
        { error: 'E-posttjänsten är inte färdigkonfigurerad ännu (RESEND_API_KEY saknas).' },
        { status: 503 }
      );
    }

    const mottagare =
      process.env.KONTAKT_MOTTAGARE_EPOST ||
      process.env.RESEND_TO_EMAIL;

    if (!mottagare) {
      console.error('Mottagareadress (KONTAKT_MOTTAGARE_EPOST) är inte konfigurerad.');
      return NextResponse.json(
        { error: 'Mottagaradress för meddelanden är inte konfigurerad.' },
        { status: 503 }
      );
    }

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'Fornsvenska.se <onboarding@resend.dev>';

    const resend = new Resend(apiKey);
    const rubrik = amne ? `[Fornsvenska.se] ${amne}` : '[Fornsvenska.se] Nytt meddelande från webbplatsen';

    const textInnehall = `Nytt meddelande mottaget via Fornsvenska.se

Avsändare: ${namn || 'Ej angivet'}
E-post: ${epost}
Ämne: ${amne || 'Allmänt'}
Tidpunkt: ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}

Meddelande:
--------------------------------------------------
${meddelande}
--------------------------------------------------

Tips: Du kan svara direkt på detta e-postmeddelande för att kontakta avsändaren (${epost}).
`;

    const htmlInnehall = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1614; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2ded7; border-radius: 8px; background-color: #fbf8f3;">
        <h2 style="margin-top: 0; color: #8b1e0f; border-bottom: 2px solid #8b1e0f; padding-bottom: 8px; font-size: 20px;">
          Nytt meddelande från Fornsvenska.se
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #666; width: 120px;"><strong>Avsändare:</strong></td>
            <td style="padding: 6px 0;">${namn || '<em>Ej angivet</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;"><strong>E-post:</strong></td>
            <td style="padding: 6px 0;"><a href="mailto:${epost}" style="color: #8b1e0f; text-decoration: underline;">${epost}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;"><strong>Ämne:</strong></td>
            <td style="padding: 6px 0;">${amne || '<em>Allmänt</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;"><strong>Tidpunkt:</strong></td>
            <td style="padding: 6px 0;">${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}</td>
          </tr>
        </table>

        <div style="background: #ffffff; padding: 16px; border: 1px solid #e2ded7; border-radius: 6px; font-size: 15px; white-space: pre-wrap; margin-bottom: 20px;">${meddelande}</div>

        <p style="font-size: 12px; color: #777; margin-bottom: 0; border-top: 1px solid #e2ded7; padding-top: 12px;">
          Du kan klicka på <strong>Svara</strong> i ditt e-postprogram för att svara direkt till ${epost}.
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from: fromAddress,
      to: [mottagare],
      replyTo: epost,
      subject: rubrik,
      text: textInnehall,
      html: htmlInnehall,
    });

    if (result.error) {
      console.error('Fel från Resend API:', result.error);
      return NextResponse.json(
        { error: `Kunde inte skicka meddelandet: ${result.error.message}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (error: any) {
    console.error('Oväntat fel i /api/kontakt:', error);
    return NextResponse.json(
      { error: error?.message || 'Ett oväntat fel uppstod.' },
      { status: 500 }
    );
  }
}
