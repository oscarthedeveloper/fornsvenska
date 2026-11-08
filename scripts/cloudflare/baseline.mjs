/** CF00: read-only, reproducible local inventory. Never reads environment files. */
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(file));
    else if (entry.isFile()) result.push(file);
  }
  return result.sort();
}
const raw = await readFile('data/ordbok/poster.json');
const records = JSON.parse(raw);
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const assets = await files('public');
const inventory = JSON.parse(await readFile('docs/drift/CLOUDFLARE_INVENTERING.json', 'utf8'));
const actual = { records: records.length, unique_ids: new Set(records.map(r => r.id)).size, bytes: raw.length, sha256: sha256(raw) };
const matches = Object.keys(actual).every(key => actual[key] === inventory.dictionary[key]);
const result = {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  runtime: { node: process.version, platform: process.platform, arch: process.arch },
  versions: Object.fromEntries(['next', 'react', 'typescript', '@supabase/supabase-js'].map(name => [name, lock.packages[`node_modules/${name}`].version])),
  lockSha256: sha256(await readFile('package-lock.json')),
  dictionary: actual, matchesPreviousInventory: matches,
  publicAssets: { files: assets.length, bytes: (await Promise.all(assets.map(async f => (await stat(f)).size))).reduce((a,b) => a+b,0) },
  scope: 'Local files only; no production parity or cloud verification.'
};
console.log(JSON.stringify(result, null, 2));
if (!matches) process.exitCode = 1;
