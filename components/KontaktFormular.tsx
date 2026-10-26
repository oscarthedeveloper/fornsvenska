'use client';

import React, { useState, type FormEvent } from 'react';

interface KontaktFormularProps {
  defaultAmne?: string;
  rubrik?: string;
  beskrivning?: string;
  kompakt?: boolean;
}

export default function KontaktFormular({
  defaultAmne = '',
  rubrik,
  beskrivning,
  kompakt = false,
}: KontaktFormularProps) {
  const [namn, setNamn] = useState('');
  const [epost, setEpost] = useState('');
  const [amne, setAmne] = useState(defaultAmne);
  const [meddelande, setMeddelande] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [felmeddelande, setFelmeddelande] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setFelmeddelande('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namn,
          epost,
          amne,
          meddelande,
          'bot-field': (form.elements.namedItem('bot-field') as HTMLInputElement)?.value || '',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setStatus('success');
        setNamn('');
        setEpost('');
        setAmne(defaultAmne);
        setMeddelande('');
      } else {
        setStatus('error');
        setFelmeddelande(data?.error || 'Kunde inte skicka meddelandet. Kontrollera uppgifterna och försök igen.');
      }
    } catch {
      setStatus('error');
      setFelmeddelande('Ett oväntat anslutningsfel uppstod. Försök gärna igen.');
    }
  }

  return (
    <div
      style={{
        background: kompakt ? 'var(--paper-light, #fbf8f3)' : 'var(--paper, #fffdfa)',
        border: '1px solid var(--line, #e2ded7)',
        borderRadius: '6px',
        padding: kompakt ? '1rem 1.25rem' : '1.75rem 2rem',
        marginTop: '0.75rem',
      }}
    >
      {rubrik && (
        <h4
          style={{
            margin: '0 0 0.5rem',
            font: '500 1.15rem/1.2 var(--font-display), serif',
            color: 'var(--ink, #1a1614)',
          }}
        >
          {rubrik}
        </h4>
      )}
      {beskrivning && (
        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: 'var(--text-muted, #555)',
          }}
        >
          {beskrivning}
        </p>
      )}

      {status === 'success' ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '1rem',
            background: 'rgba(40, 167, 69, 0.08)',
            border: '1px solid rgba(40, 167, 69, 0.3)',
            borderRadius: '4px',
            color: '#155724',
            fontSize: '0.85rem',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
            ✓ Meddelandet har skickats!
          </strong>
          Tack för ditt bidrag eller din anmärkning. Redaktionen granskar inkomna rättelser löpande.
          <div style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              style={{
                background: 'transparent',
                border: '1px solid currentColor',
                borderRadius: '3px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono), monospace',
                color: 'inherit',
              }}
            >
              Skicka ytterligare ett meddelande
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          {/* Dold honeypot för bot-bekämpning */}
          <p style={{ display: 'none' }}>
            <label>
              Fyll inte i detta fält om du är människa: <input name="bot-field" />
            </label>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: kompakt ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label
                htmlFor="kontakt-namn"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono), monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.25rem',
                  color: 'var(--ink, #1a1614)',
                }}
              >
                Namn / Avsändare
              </label>
              <input
                id="kontakt-namn"
                type="text"
                name="namn"
                value={namn}
                onChange={(e) => setNamn(e.target.value)}
                placeholder="Frivilligt"
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  border: '1px solid var(--line, #ccc)',
                  borderRadius: '3px',
                  background: 'var(--paper, #fff)',
                  color: 'var(--ink, #1a1614)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="kontakt-epost"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono), monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.25rem',
                  color: 'var(--ink, #1a1614)',
                }}
              >
                E-postadress <span style={{ color: 'var(--rust, #8b1e0f)' }}>*</span>
              </label>
              <input
                id="kontakt-epost"
                type="email"
                name="epost"
                required
                value={epost}
                onChange={(e) => setEpost(e.target.value)}
                placeholder="din.epost@exempel.se"
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  border: '1px solid var(--line, #ccc)',
                  borderRadius: '3px',
                  background: 'var(--paper, #fff)',
                  color: 'var(--ink, #1a1614)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="kontakt-amne"
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono), monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.25rem',
                color: 'var(--ink, #1a1614)',
              }}
            >
              Ämne / Inskrift / Sida
            </label>
            <input
              id="kontakt-amne"
              type="text"
              name="amne"
              value={amne}
              onChange={(e) => setAmne(e.target.value)}
              placeholder="T.ex. Rättelse till Öl 1 Karlevistenen, källhänvisning etc."
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem',
                fontSize: '0.82rem',
                border: '1px solid var(--line, #ccc)',
                borderRadius: '3px',
                background: 'var(--paper, #fff)',
                color: 'var(--ink, #1a1614)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="kontakt-meddelande"
              style={{
                display: 'block',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono), monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.25rem',
                color: 'var(--ink, #1a1614)',
              }}
            >
              Meddelande <span style={{ color: 'var(--rust, #8b1e0f)' }}>*</span>
            </label>
            <textarea
              id="kontakt-meddelande"
              name="meddelande"
              required
              rows={kompakt ? 3 : 5}
              value={meddelande}
              onChange={(e) => setMeddelande(e.target.value)}
              placeholder="Beskriv vad du vill påpeka, komplettera eller fråga..."
              style={{
                width: '100%',
                padding: '0.5rem 0.6rem',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                border: '1px solid var(--line, #ccc)',
                borderRadius: '3px',
                background: 'var(--paper, #fff)',
                color: 'var(--ink, #1a1614)',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {status === 'error' && (
            <div
              role="alert"
              style={{
                padding: '0.5rem 0.75rem',
                background: 'rgba(139, 30, 15, 0.08)',
                border: '1px solid rgba(139, 30, 15, 0.3)',
                borderRadius: '4px',
                color: 'var(--rust, #8b1e0f)',
                fontSize: '0.78rem',
              }}
            >
              {felmeddelande}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #777)' }}>
              Skickas direkt till redaktionen.
            </span>
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                background: 'var(--ink, #1a1614)',
                color: 'var(--paper, #fffdfa)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1.15rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono), monospace',
                letterSpacing: '0.03em',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
                opacity: status === 'submitting' ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'submitting' ? 'Skickar...' : 'Skicka meddelande'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
