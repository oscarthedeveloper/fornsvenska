# Projektstatus: Fornsvenska.se

Datum: 2026-10-25  
Projektrot: `/Users/oscarpagerup/Desktop/Git Repo/fornsvenska`  
Git HEAD: `08d53a5` (`origin/main`)

Det pågår två samordnade förbättringsspår i projektet:

1. **Google-sök & SEO-optimering:**
   - **Genomförandeplan:** [`docs/seo/GOOGLE_GENOMFORANDEPLAN.md`](./docs/seo/GOOGLE_GENOMFORANDEPLAN.md)
   - **Aktuell status:** [`docs/seo/STATUS.md`](./docs/seo/STATUS.md)
   - **Leveranser:**
     - [`docs/seo/url-inventering.json`](./docs/seo/url-inventering.json) – 280 redaktionella sidor + 41 744 ordboksposter klassificerade
     - [`docs/seo/domanpolicy.md`](./docs/seo/domanpolicy.md) – Fastställd kanonisk huvudadress (`https://www.fornsvenska.se`) och kanoniseringsregler
     - [`docs/seo/metadata-matris.md`](./docs/seo/metadata-matris.md) – Fullständig matris över titlar, beskrivningar och canonicals
     - [`docs/seo/testprotokoll.md`](./docs/seo/testprotokoll.md) – Verifiering av produktionsbygge, sitemaps och 315 SSG-sidor
     - [`docs/seo/uppfoljning.md`](./docs/seo/uppfoljning.md) – Inlämningsrutin för Search Console och uppföljning +7, +14, +28 dagar
     - [`tests/seo-contract.test.mjs`](./tests/seo-contract.test.mjs) – Automatiskt testkontrakt för SEO och sitemaps

2. **Drift- & Netlify-optimering (Minskade serverfunktionsanrop):**
   - **Genomförandeplan:** [`docs/drift/NETLIFY_OPTIMERINGSPLAN.md`](./docs/drift/NETLIFY_OPTIMERINGSPLAN.md)
   - **Aktuell status:** [`docs/drift/STATUS.md`](./docs/drift/STATUS.md) (E01–E12 genomförda: 100 % minskning av serverfunktionsanrop för anonyma läsare, 158/158 automatiserade tester godkända, redo för molnverifiering E13)
