import { NextResponse } from 'next/server';
import { skickaKontaktMeddelande } from '@/lib/kontakt/kontaktService';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  try {
    let namn = '';
    let epost = '';
    let amne = '';
    let meddelande = '';
    let botField = '';
    let tidsstampelFormular: number | undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await request.json();
      namn = data.namn?.trim() || '';
      epost = data.epost?.trim() || '';
      amne = data.amne?.trim() || '';
      meddelande = data.meddelande?.trim() || '';
      botField = data['bot-field'] || data.botField || '';
      tidsstampelFormular = data.tidsstampelFormular ? Number(data.tidsstampelFormular) : undefined;
    } else {
      const formData = await request.formData();
      namn = formData.get('namn')?.toString().trim() || '';
      epost = formData.get('epost')?.toString().trim() || '';
      amne = formData.get('amne')?.toString().trim() || '';
      meddelande = formData.get('meddelande')?.toString().trim() || '';
      botField = formData.get('bot-field')?.toString() || '';
      const ts = formData.get('tidsstampelFormular');
      tidsstampelFormular = ts ? Number(ts) : undefined;
    }

    const klientIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      '127.0.0.1';

    const resultat = await skickaKontaktMeddelande({
      namn,
      epost,
      amne,
      meddelande,
      botField,
      tidsstampelFormular,
      klientIp,
    });

    if (!resultat.ok) {
      return NextResponse.json(
        { error: resultat.error },
        {
          status: resultat.httpStatus,
          headers: CORS_HEADERS,
        }
      );
    }

    return NextResponse.json(
      { ok: true, id: resultat.meddelandeId, leverans: resultat.leveranssatt },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Oväntat fel i /api/kontakt:', error);
    return NextResponse.json(
      { error: error?.message || 'Ett oväntat fel uppstod.' },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
