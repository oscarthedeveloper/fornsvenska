/**
 * CF03: Deterministisk gruppägare och routing för Fornsvenska på Cloudflare Pages
 *
 * Mappar varje ordboks-ID till en teknisk ordboksgrupp (01–07) baserat på
 * första tecknet efter '--' i postens ID (inte alfabetisk visningssektion).
 */

export interface GroupConfig {
  group: string;
  subdomain: string;
  host: string;
  initials: string[];
}

export const ORDBOK_GROUPS: Record<string, GroupConfig> = {
  '01': {
    group: '01',
    subdomain: 'ord-01',
    host: 'ord-01.fornsvenska.se',
    initials: ['a', 'b', 'c', 'd', 'e'],
  },
  '02': {
    group: '02',
    subdomain: 'ord-02',
    host: 'ord-02.fornsvenska.se',
    initials: ['f', 'g'],
  },
  '03': {
    group: '03',
    subdomain: 'ord-03',
    host: 'ord-03.fornsvenska.se',
    initials: ['h', 'i', 'j', 'k'],
  },
  '04': {
    group: '04',
    subdomain: 'ord-04',
    host: 'ord-04.fornsvenska.se',
    initials: ['l', 'm', 'n', 'o'],
  },
  '05': {
    group: '05',
    subdomain: 'ord-05',
    host: 'ord-05.fornsvenska.se',
    initials: ['p', 'q', 'r', 'ö', 'þ', '-', '_'],
  },
  '06': {
    group: '06',
    subdomain: 'ord-06',
    host: 'ord-06.fornsvenska.se',
    initials: ['s'],
  },
  '07': {
    group: '07',
    subdomain: 'ord-07',
    host: 'ord-07.fornsvenska.se',
    initials: ['t', 'u', 'v', 'y', 'ä'],
  },
};

// Skapa en snabb uppslagstabell från initialtecken till grupp
const INITIAL_TO_GROUP: Record<string, GroupConfig> = {};
for (const conf of Object.values(ORDBOK_GROUPS)) {
  for (const init of conf.initials) {
    INITIAL_TO_GROUP[init.toLowerCase()] = conf;
  }
}

/**
 * Extraherar första tecknet efter '--' i ett ordboks-ID.
 */
export function extractIdInitial(id: string): string {
  const parts = id.split('--');
  if (parts.length < 2) {
    throw new Error(`Ogiltigt ordboks-ID utan '--': ${id}`);
  }
  if (!parts[1]) {
    throw new Error(`Tomt huvudordssegment efter '--': ${id}`);
  }
  const first = parts[1][0]?.toLowerCase();
  return first;
}

/**
 * Returnerar gruppägaren för ett givet artikel-ID.
 */
export function getArticleOwner(id: string): GroupConfig {
  const initial = extractIdInitial(id);
  const conf = INITIAL_TO_GROUP[initial];
  if (!conf) {
    throw new Error(`Ingen grupp konfigurerad för initial '${initial}' i ID: ${id}`);
  }
  return conf;
}

/**
 * Kontrollerar om aktuell byggkontext är en förhandsgranskning/testmiljö.
 */
export function isPreviewEnvironment(): boolean {
  if (process.env.CF_PAGES_ENVIRONMENT === 'preview') return true;
  if (
    process.env.CF_PAGES_BRANCH &&
    process.env.CF_PAGES_BRANCH !== 'main' &&
    process.env.CF_PAGES_BRANCH !== 'master'
  ) {
    return true;
  }
  if (process.env.CONTEXT && process.env.CONTEXT !== 'production') return true;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return true;
  return false;
}

/**
 * Genererar canonical URL för en artikel.
 * I test/preview-miljö pekar canonical till testvärden, aldrig till skarp produktion.
 */
export function getArticleCanonicalUrl(id: string): string {
  if (isPreviewEnvironment()) {
    const previewHost = process.env.CF_PAGES_URL
      ? new URL(process.env.CF_PAGES_URL).host
      : 'preview.fornsvenska.se';
    return `https://${previewHost}/ordbok/${encodeURIComponent(id)}`;
  }

  const owner = getArticleOwner(id);
  return `https://${owner.host}/ordbok/${encodeURIComponent(id)}`;
}

/**
 * Genererar Cloudflare Pages _redirects-regler för huvudsajten (www.fornsvenska.se).
 *
 * Mappar gamla adresser /ordbok/<id> med 301 till rätt underdomän.
 * Använder prefixregler med splats för att minimera antalet regler och
 * rymmas med god marginal inom Cloudflares gräns på max 100 dynamiska regler.
 */
export function generateCloudflareRedirects(): string[] {
  const rules: string[] = [];
  rules.push('# Cloudflare Pages _redirects för www.fornsvenska.se');
  rules.push('# Genererad för CF03: Omdirigering av gamla ordbokslänkar till respektive ordboksdel');
  rules.push('');

  const datasets = ['soederwall', 'soederwall-supp'];

  // Lägg först specifika regler för specialtecken och URL-kodade varianter
  const specialEncodings: { char: string; encodings: string[]; group: string }[] = [
    { char: 'ö', encodings: ['%C3%B6', '%c3%b6'], group: '05' },
    { char: 'þ', encodings: ['%C3%BE', '%c3%be'], group: '05' },
    { char: 'ä', encodings: ['%C3%A4', '%c3%a4'], group: '07' },
  ];

  rules.push('# URL-kodade varianter för specialtecken (ö, þ, ä)');
  for (const item of specialEncodings) {
    const targetHost = ORDBOK_GROUPS[item.group].host;
    for (const ds of datasets) {
      for (const enc of item.encodings) {
        rules.push(`/ordbok/${ds}--${enc}* https://${targetHost}/ordbok/${ds}--${enc}:splat 301`);
      }
    }
  }
  rules.push('');

  // Generera prefixregler för varje initialtecken
  rules.push('# Standard prefixregler per dataset och initialtecken');
  for (const group of ['01', '02', '03', '04', '05', '06', '07']) {
    const conf = ORDBOK_GROUPS[group];
    rules.push(`# Grupp ${conf.group} (${conf.host}): initialer ${conf.initials.join(', ')}`);
    for (const init of conf.initials) {
      for (const ds of datasets) {
        // Exempel: /ordbok/soederwall--a* https://ord-01.fornsvenska.se/ordbok/soederwall--a:splat 301
        rules.push(`/ordbok/${ds}--${init}* https://${conf.host}/ordbok/${ds}--${init}:splat 301`);
      }
    }
    rules.push('');
  }

  return rules;
}

/**
 * Simulerar Cloudflares redirect-matchning för ett inkommande request path.
 * Används för maskinell verifiering av alla 41 744 ID:n.
 */
export function matchRedirect(requestPath: string, rules: string[]): { target: string; status: number } | null {
  for (const line of rules) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 3) continue;

    const [pattern, targetTemplate, statusStr] = parts;
    const status = parseInt(statusStr, 10);

    // Splat matchning
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (requestPath.startsWith(prefix)) {
        const splat = requestPath.slice(prefix.length);
        const target = targetTemplate.replace(':splat', splat);
        return { target, status };
      }
    } else if (requestPath === pattern) {
      return { target: targetTemplate, status };
    }
  }

  return null;
}
