/** Build the eight Pages outputs from Git; never publish the repository root. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const steps = [
  ['--import', 'tsx', 'scripts/cloudflare/validate-release-input.ts'],
  ['--import', 'tsx', 'scripts/cloudflare/build-ordbok-indexes.ts'],
  ['--import', 'tsx', 'scripts/cloudflare/build-search-worker.ts'],
  ['--import', 'tsx', 'scripts/cloudflare/build-runic-api-exports.ts'],
  ['node_modules/next/dist/bin/next', 'build'],
  ['--import', 'tsx', 'scripts/cloudflare/build-main-site.ts'],
  ['--import', 'tsx', 'scripts/cloudflare/build-ordbok-groups.ts'],
  ['--import', 'tsx', 'scripts/cloudflare/release.ts', '--check'],
];

for (const args of steps) {
  console.log(`[Cloudflare] node ${args.join(' ')}`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('[Cloudflare] Klart. Publicera dist/www respektive dist/ord-01..07 i separata Pages-projekt.');
