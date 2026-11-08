/** Offline CF01 planning calculator. Reads no credentials and performs no deployment. */
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export function calculateBudget(c) {
  if (c.schemaVersion !== 1) throw new Error('Unsupported budget schema');
  const integer = (n, label, min = 0) => {
    if (!Number.isSafeInteger(n) || n < min) throw new Error(`Invalid ${label}`);
    return n;
  };
  const projects = integer(c.projectsPerFullRelease, 'projects', 1);
  const attempts = ['production', 'preview', 'failedOrRetry', 'setup'].reduce((sum, key) => sum + integer(c.monthlyAttempts[key], key), 0);
  const deployments = attempts * projects;
  const pagesAvailable = integer(c.pages.monthlyLimit, 'Pages limit') - integer(c.pages.reservedForOtherUsage, 'Pages reserve');
  const ciMinutes = attempts * integer(c.ci.minutesPerAttemptCeiling, 'CI time', 1);
  const snapshotBytes = integer(c.export.snapshotBytesPerAttemptCeiling, 'export snapshot');
  const assetBytes = integer(c.export.assetBytesPerAttemptCeiling, 'export assets');
  const monthlyEgress = attempts * (snapshotBytes + assetBytes) + integer(c.export.otherMonthlyEgressCeiling, 'other egress');
  const retainedStorage = integer(c.storage.retainedSnapshots, 'snapshot retention') * integer(c.storage.snapshotBytesCeiling, 'stored snapshot') + integer(c.storage.sourceAssetBytesCeiling, 'source assets') + integer(c.storage.otherBytesCeiling, 'other storage');
  integer(c.ci.persistentArtifactBytes, 'artifacts');
  integer(c.ci.persistentCacheBytes, 'cache');
  if (!Array.isArray(c.unverified)) throw new Error('Missing verification list');
  const checks = {
    pagesWithinReservedBudget: deployments <= pagesAvailable,
    egressWithinInternalLimit: monthlyEgress <= integer(c.export.monthlyEgressInternalLimit, 'egress limit'),
    storageWithinInternalLimit: retainedStorage <= integer(c.storage.internalLimit, 'storage limit'),
    noPersistentCIArtifactsOrCache: c.ci.persistentArtifactBytes === 0 && c.ci.persistentCacheBytes === 0
  };
  return {
    schemaVersion: 1, monthlyAttempts: attempts, projectsPerAttempt: projects,
    conservativeMonthlyPagesOperations: deployments,
    remainingPagesOperationsAfterReserve: pagesAvailable - deployments,
    ciMinutesAtPlanningCeiling: ciMinutes,
    supabaseMonthlyEgressBytesAtCeiling: monthlyEgress,
    supabaseRetainedStorageBytesAtCeiling: retainedStorage,
    checks, numericalBudgetFits: Object.values(checks).every(Boolean),
    cloudReadiness: 'not-assessed-by-offline-calculator',
    unverified: c.unverified,
    notice: 'Planning only. Numerical fit never proves free account configuration or grants publication approval.'
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = JSON.parse(await readFile(process.argv[2] ?? 'docs/drift/cloudflare/CF01-budgetantaganden.json', 'utf8'));
  const result = calculateBudget(config);
  console.log(JSON.stringify(result, null, 2));
  if (!result.numericalBudgetFits) process.exitCode = 1;
}
