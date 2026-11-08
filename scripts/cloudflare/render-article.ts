import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import NavigationContent from '../../components/NavigationContent';

/**
 * CF03: Statisk artikel-HTML-generator för Fornsvenska på Cloudflare Pages
 *
 * Genererar en fullständig, semantisk och självständig HTML-sida för en ordbokspost,
 * med all artikeltext, källhänvisningar, metadata och tillgänglighet direkt i initial HTML.
 * Kräver noll JavaScript för full läsning och sökmotorindexering.
 */

import type { OrdbokPost, OrdbokHanvisning } from '../../lib/ordbok/typer';
import { getArticleCanonicalUrl, isPreviewEnvironment } from './routing';

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str: string): string {
  return escapeHtml(str);
}

export function generateArticleMetadata(post: OrdbokPost) {
  const band =
    post.sourceDataset === 'soederwall'
      ? 'Söderwalls huvudverk'
      : 'Söderwalls supplement';

  let sammanfattning = '';
  if (post.modernDefinition?.kortForklaring) {
    sammanfattning = post.modernDefinition.kortForklaring;
  } else if (post.modernDefinition?.modernGlos?.length) {
    sammanfattning = `Betydelse: ${post.modernDefinition.modernGlos.join(', ')}.`;
  } else if (post.articlePlainText) {
    const renad = post.articlePlainText
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
    sammanfattning =
      renad.length > 130
        ? renad.slice(0, 127).replace(/\s+\S*$/, '') + '…'
        : renad;
  }

  const ordklasser =
    post.partOfSpeech && post.partOfSpeech.length > 0
      ? ` (${post.partOfSpeech.join(', ')})`
      : '';

  const titelText = `${post.headwordDisplay}${
    post.homonymNumber ? ` (${post.homonymNumber})` : ''
  } — ${band} | Fornsvenska.se`;

  const beskrivning = sammanfattning
    ? `${sammanfattning} Fornsvenskt uppslagsord i ${band}${ordklasser}.`
    : `Uppslagsordet ${post.headwordDisplay} i ${band}${ordklasser}. Källbelägg och fornsvensk ordbokstext.`;

  const canonicalUrl = getArticleCanonicalUrl(post.id);

  return {
    titelText,
    beskrivning: beskrivning.slice(0, 160),
    canonicalUrl,
    band,
  };
}

/**
 * Formaterar artikeltext med typografiska citat och verifierade korshänvisningar.
 */
function renderArticleBodyText(
  text: string,
  references: OrdbokHanvisning[] = []
): string {
  if (!text) return '';

  const lostaMap = new Map<string, OrdbokHanvisning>();
  for (const ref of references) {
    if (ref.targetEntryId && ref.rawText) {
      lostaMap.set(ref.rawText.toLowerCase(), ref);
    }
  }

  // Dela upp på citat inom "..."
  const delar = text.split(/("[^"]{2,260}")/g);
  let html = '';

  for (const del of delar) {
    if (del.startsWith('"') && del.endsWith('"') && del.length >= 3) {
      html += `<span class="ordbok-citat">${escapeHtml(del)}</span>`;
      continue;
    }

    if (lostaMap.size === 0) {
      html += `<span>${escapeHtml(del)}</span>`;
      continue;
    }

    // Länka verifierade "se <ord>"
    const re = /\b(se\s+[a-zåäöæøþ]{2,}(?:\s+[a-zåäöæøþ]+)?)\b/gi;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(del)) !== null) {
      const hittad = match[1];
      const ref = lostaMap.get(hittad.toLowerCase());
      if (!ref || !ref.targetEntryId) continue;

      if (match.index > lastIdx) {
        html += escapeHtml(del.slice(lastIdx, match.index));
      }

      const href = `/ordbok/${encodeURIComponent(ref.targetEntryId)}`;
      const targetLabel = ref.targetHeadword ?? hittad.replace(/^se\s+/i, '');
      html += `<span>se <a href="${escapeAttr(href)}" class="underline decoration-ink/60 underline-offset-[3px] hover:text-accent">${escapeHtml(targetLabel)}</a></span>`;
      lastIdx = match.index + hittad.length;
    }

    if (lastIdx < del.length) {
      html += escapeHtml(del.slice(lastIdx));
    }
  }

  return html;
}

/**
 * Renderar hela den statiska HTML-sidan för en ordbokspost.
 */
export function renderArticleHtml(
  post: OrdbokPost,
  relaterade?: {
    sammaUppslagsordHuvudverk?: Array<{ id: string; headwordDisplay: string; homonymNumber?: number }>;
    sammaUppslagsordSupplement?: Array<{ id: string; headwordDisplay: string; homonymNumber?: number }>;
    grannarISektion?: {
      prev: { id: string; headwordDisplay: string } | null;
      next: { id: string; headwordDisplay: string } | null;
    };
  },
  options: { htmlClassName?: string; styleVersion?: string } = {}
): string {
  const meta = generateArticleMetadata(post);
  const bodyTextHtml = renderArticleBodyText(post.articlePlainText || '', post.references || []);

  const partOfSpeechHtml = (post.partOfSpeech || [])
    .map((pos) => `<span class="inline-block px-1.5 py-0.5 border border-ink/30 text-xs">${escapeHtml(pos)}</span>`)
    .join(' ');

  const modernDefHtml = post.modernDefinition
    ? `<div class="p-3 border border-dashed border-ink/40 bg-paper/50 rounded text-sm my-3">
        <div class="font-bold text-xs uppercase tracking-wider mb-1 text-ink/70">Modernt förklaringsstöd</div>
        ${post.modernDefinition.kortForklaring ? `<p class="font-medium">${escapeHtml(post.modernDefinition.kortForklaring)}</p>` : ''}
        ${post.modernDefinition.modernGlos?.length ? `<p class="text-ink/80 text-xs mt-1">Synonymer: ${escapeHtml(post.modernDefinition.modernGlos.join(', '))}</p>` : ''}
      </div>`
    : '';

  const rattelseHtml = post.rattelse
    ? `<div class="p-3 border border-amber-500/40 bg-amber-500/10 rounded text-sm my-3">
        <div class="font-bold text-xs uppercase tracking-wider text-amber-800">Redaktionell rättelse (${escapeHtml(post.rattelse.reviewStatus)})</div>
        <p class="text-xs text-ink/80 mt-1">${escapeHtml(post.rattelse.note || '')}</p>
      </div>`
    : '';

  const relatedHtml: string[] = [];
  if (relaterade?.sammaUppslagsordHuvudverk?.length) {
    const links = relaterade.sammaUppslagsordHuvudverk
      .map((r) => `<a href="/ordbok/${encodeURIComponent(r.id)}" class="underline">${escapeHtml(r.headwordDisplay)}${r.homonymNumber ? ` (${r.homonymNumber})` : ''}</a>`)
      .join(', ');
    relatedHtml.push(`<div><span class="text-xs text-ink/70">I huvudverket:</span> ${links}</div>`);
  }
  if (relaterade?.sammaUppslagsordSupplement?.length) {
    const links = relaterade.sammaUppslagsordSupplement
      .map((r) => `<a href="/ordbok/${encodeURIComponent(r.id)}" class="underline">${escapeHtml(r.headwordDisplay)}${r.homonymNumber ? ` (${r.homonymNumber})` : ''}</a>`)
      .join(', ');
    relatedHtml.push(`<div><span class="text-xs text-ink/70">I supplementet:</span> ${links}</div>`);
  }

  const grannarHtml: string[] = [];
  if (relaterade?.grannarISektion?.prev) {
    grannarHtml.push(
      `<a href="/ordbok/${encodeURIComponent(relaterade.grannarISektion.prev.id)}" class="text-xs border border-ink/20 px-2 py-1 hover:border-ink">← ${escapeHtml(relaterade.grannarISektion.prev.headwordDisplay)}</a>`
    );
  }
  if (relaterade?.grannarISektion?.next) {
    grannarHtml.push(
      `<a href="/ordbok/${encodeURIComponent(relaterade.grannarISektion.next.id)}" class="text-xs border border-ink/20 px-2 py-1 hover:border-ink">${escapeHtml(relaterade.grannarISektion.next.headwordDisplay)} →</a>`
    );
  }

  // Kompakt post-data för lokal bokmärkning
  const bookmarkDataJson = escapeAttr(JSON.stringify({
    id: post.id,
    headwordDisplay: post.headwordDisplay,
    sourceDataset: post.sourceDataset,
    kallaId: post.kallaId,
    partOfSpeech: post.partOfSpeech || [],
    gramOriginal: post.gramOriginal || '',
    homonymNumber: post.homonymNumber,
    snippet: (post.articlePlainText || '').slice(0, 150),
  }));

  const isPreview = isPreviewEnvironment();
  const robotsMeta = isPreview ? '  <meta name="robots" content="noindex, nofollow">\n' : '';

  return `<!DOCTYPE html>
<html lang="sv"${options.htmlClassName ? ` class="${escapeAttr(options.htmlClassName)}"` : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.titelText)}</title>
  <meta name="description" content="${escapeAttr(meta.beskrivning)}">
${robotsMeta}  <link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}">
  <meta property="og:title" content="${escapeAttr(meta.titelText)}">
  <meta property="og:description" content="${escapeAttr(meta.beskrivning)}">
  <meta property="og:url" content="${escapeAttr(meta.canonicalUrl)}">
  <meta property="og:site_name" content="Fornsvenska.se">
  <meta property="og:type" content="article">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": ${JSON.stringify(post.headwordDisplay)},
    "description": ${JSON.stringify(meta.beskrivning)},
    "inDefinedTermSet": "https://fornsvenska.se/ordbok",
    "url": ${JSON.stringify(meta.canonicalUrl)}
  }
  </script>
  <link rel="stylesheet" href="/assets/style.css${options.styleVersion ? `?v=${escapeAttr(options.styleVersion)}` : ''}">
  <style>
    .article-site-frame { margin: 3.5vw; border: 1px solid var(--ink); min-height: calc(100vh - 7vw); }
    .article-site-frame > .start-nav { border-bottom: 1px solid var(--ink); }
    .article-colophon { height: 34px; display:flex; align-items:center; justify-content:center; background:var(--ink); color:var(--paper); }
    .article-entry, .article-provenance { font-family:var(--font-display), Georgia, serif; }
    .site-container { box-sizing:border-box; width:100%; }
    .ordbok-citat {
      font-style: italic;
      color: #2c2c28;
    }
    .site-container {
      max-width: 1040px;
      margin: 0 auto;
      padding: 1.2rem;
    }
    @media (min-width: 640px) {
      .site-container { padding: 2rem; }
    }
  </style>
</head>
<body>
  <div class="article-site-frame">
  <div class="article-colophon micro">Ordbok · K. F. Söderwall (1884–1973)</div>
  ${renderToStaticMarkup(React.createElement(NavigationContent, { active: '/ordbok', homeOrigin: 'https://fornsvenska.se' }))}

  <main class="site-container">
    <nav aria-label="Brödsmulor och återgång" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
        <a href="https://fornsvenska.se/ordbok?letter=${encodeURIComponent(post.letterSection)}" style="border:1px solid var(--ink);background:var(--panel);padding:0.4rem 0.8rem;text-decoration:none;color:inherit;font-size:0.85rem;">
          ← Tillbaka till ordboken (bokstav ${escapeHtml(post.letterSection)})
        </a>
        <span style="opacity:0.5;">/</span>
        <span style="opacity:0.75;font-size:0.85rem;">${escapeHtml(meta.band)}</span>
        <span style="opacity:0.5;">/</span>
        <span style="font-weight:600;font-size:0.85rem;">${escapeHtml(post.headwordDisplay)}</span>
      </div>
      <span style="font-size:0.8rem;opacity:0.6;">
        Beständig adress: <code>/ordbok/${escapeHtml(post.id)}</code>
      </span>
    </nav>

    <article class="article-entry" style="background:var(--panel);border:1px solid rgba(26,26,24,0.15);padding:1.5rem 2rem;margin-bottom:2rem;">
      <header style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;border-bottom:1px solid rgba(26,26,24,0.1);padding-bottom:1rem;margin-bottom:1.5rem;">
        <div>
          <h1 style="margin:0 0 0.5rem 0;font-size:2rem;font-weight:normal;">
            ${escapeHtml(post.headwordDisplay)}${post.homonymNumber ? ` <span style="font-size:1.2rem;opacity:0.7;">(${post.homonymNumber})</span>` : ''}
          </h1>
          <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
            <span style="background:var(--paper);border:1px solid rgba(26,26,24,0.2);padding:0.2rem 0.5rem;font-size:0.75rem;">
              ${escapeHtml(post.kallaId)} · ${escapeHtml(meta.band)}
            </span>
            ${partOfSpeechHtml}
            ${post.gramOriginal ? `<span style="font-style:italic;font-size:0.85rem;color:rgba(26,26,24,0.7);">${escapeHtml(post.gramOriginal)}</span>` : ''}
          </div>
        </div>

        <div>
          <button id="bokmarke-knapp" data-post="${bookmarkDataJson}" style="background:var(--paper);border:1px solid var(--ink);padding:0.4rem 0.8rem;cursor:pointer;font-size:0.85rem;display:flex;align-items:center;gap:0.4rem;">
            <span id="bokmarke-ikon">☆</span>
            <span id="bokmarke-text">Spara ord</span>
          </button>
        </div>
      </header>

      ${modernDefHtml}
      ${rattelseHtml}

      <div class="artikel-text" style="font-size:1.05rem;line-height:1.75;margin:1.5rem 0;">
        ${bodyTextHtml}
      </div>

      ${relatedHtml.length ? `<div style="margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(26,26,24,0.1);font-size:0.9rem;display:flex;flex-direction:column;gap:0.5rem;">${relatedHtml.join('')}</div>` : ''}

      ${grannarHtml.length ? `<div style="display:flex;justify-content:space-between;margin-top:1.5rem;padding-top:1rem;border-top:1px dashed rgba(26,26,24,0.15);">${grannarHtml.join('')}</div>` : ''}
    </article>

    <footer class="article-provenance" style="margin:2rem 0;padding:1rem 1.5rem;border:1px solid rgba(26,26,24,0.15);background:var(--panel);font-size:0.8rem;color:rgba(26,26,24,0.75);">
      <h2 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.5rem 0;color:var(--ink);">Källa och proveniens</h2>
      <p style="margin:0 0 0.5rem 0;">K. F. Söderwall: <em>Ordbok öfver svenska medeltids-språket</em>. ${escapeHtml(post.supplierQualityNote || 'Digitaliserad ordbokstext via Språkbanken Text.')}</p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="https://sprakbanken.se" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Språkbanken Text</a>
        <a href="https://runeberg.org/svmtsprk/" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Faksimil hos Projekt Runeberg</a>
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Licens: CC BY 4.0</a>
      </div>
    </footer>
  </main>
  </div>

  <script src="/assets/article-bookmarks.js" defer></script>
</body>
</html>`;
}
