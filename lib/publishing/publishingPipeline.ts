/** Test model only. Runtime publication uses cf_release_jobs and the GitHub/Pages adapters. */
/**
 * CF05: Publiceringspipeline och behörighetsstyrning för Fornsvenska
 *
 * Ansvarar för:
 * - Behörighetskontroll mot administratörsroll (RLS / admin).
 * - Idempotens mot dubbelklick och parallella förfrågningar.
 * - Kvotkontroll mot månatlig gratisbudget.
 * - Atomär driftsättning: tidigare statisk release förblir aktiv och intakt
 *   om ett bygge eller deploy avbryts eller kastar fel.
 */

import type {
  PublishingJob,
  PublishingState,
  PublishRequestResult,
} from './types';

export class PublishingPipeline {
  private state: PublishingState;
  private jobs: Map<string, PublishingJob> = new Map();

  constructor(initialActiveRelease = 'cf-rel-20261026-initial') {
    this.state = {
      activeReleaseId: initialActiveRelease,
      activeReleaseDate: '2026-10-26T20:00:00Z',
      activeSnapshotHash: '302f5d71fd7b8cadc7637fc4b803f6a39fa846cf2f746ca77295d702b9eac4d7',
      monthlyBuildCount: 0,
      monthlyBuildQuota: 28, // 28 kompletta releasevarv enligt CF01-kalkylen
    };
  }

  public getActiveState(): PublishingState {
    return { ...this.state };
  }

  public setMonthlyBuildCount(count: number): void {
    this.state.monthlyBuildCount = count;
  }

  public getJob(jobId: string): PublishingJob | null {
    const job = this.jobs.get(jobId);
    return job ? JSON.parse(JSON.stringify(job)) : null;
  }

  /**
   * Begär ett nytt publiceringsjobb.
   */
  public async requestPublish(options: {
    userId?: string | null;
    isAdmin: boolean;
    idempotencyKey?: string;
    newSnapshotHash?: string;
    simulateFailure?: boolean;
    failureReason?: string;
  }): Promise<PublishRequestResult> {
    // 1. Autentiseringskontroll
    if (!options.userId) {
      return {
        ok: false,
        error: 'Oautentiserad användare. Inloggning krävs.',
        httpStatus: 401,
      };
    }

    // 2. Behörighetskontroll mot administratörsroll
    if (!options.isAdmin) {
      return {
        ok: false,
        error: 'Åtkomst nekad. Endast administratörer med verifierad adminroll har behörighet att publicera.',
        httpStatus: 403,
      };
    }

    // 3. Kvotkontroll mot månatlig byggbudget
    if (this.state.monthlyBuildCount >= this.state.monthlyBuildQuota) {
      return {
        ok: false,
        error: `Månadens publiceringskvot är förbrukad (${this.state.monthlyBuildCount}/${this.state.monthlyBuildQuota} körningar).`,
        httpStatus: 429,
      };
    }

    // 4. Idempotenskontroll: Har vi redan ett jobb med samma idempotencyKey eller ett som pågår?
    const idempotencyKey =
      options.idempotencyKey || `req-${options.userId}-${new Date().toISOString().slice(0, 16)}`;

    for (const job of this.jobs.values()) {
      if (job.idempotencyKey === idempotencyKey) {
        return {
          ok: job.status !== 'failed',
          jobId: job.jobId,
          status: job.status,
          activeReleaseId: this.state.activeReleaseId,
          message: 'Återanvänder befintlig jobbinstans för samma idempotensnyckel.',
          httpStatus: 200,
        };
      }
      if (job.status === 'running' || job.status === 'pending') {
        return {
          ok: true,
          jobId: job.jobId,
          status: job.status,
          activeReleaseId: this.state.activeReleaseId,
          message: 'Ett publiceringsjobb pågår redan. Parallell körning förhindras.',
          httpStatus: 200,
        };
      }
    }

    // 5. Skapa nytt publiceringsjobb
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const snapshotReleaseId = `cf-rel-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${jobId.slice(-5)}`;

    const newJob: PublishingJob = {
      jobId,
      idempotencyKey,
      requestedBy: options.userId,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      snapshotReleaseId,
      projects: {
        'huvudsajt': { projectId: 'huvudsajt', projectName: 'www.fornsvenska.se', status: 'pending' },
        'ord-01': { projectId: 'ord-01', projectName: 'ord-01.fornsvenska.se', status: 'pending' },
        'ord-02': { projectId: 'ord-02', projectName: 'ord-02.fornsvenska.se', status: 'pending' },
        'ord-03': { projectId: 'ord-03', projectName: 'ord-03.fornsvenska.se', status: 'pending' },
        'ord-04': { projectId: 'ord-04', projectName: 'ord-04.fornsvenska.se', status: 'pending' },
        'ord-05': { projectId: 'ord-05', projectName: 'ord-05.fornsvenska.se', status: 'pending' },
        'ord-06': { projectId: 'ord-06', projectName: 'ord-06.fornsvenska.se', status: 'pending' },
        'ord-07': { projectId: 'ord-07', projectName: 'ord-07.fornsvenska.se', status: 'pending' },
      },
    };

    this.jobs.set(jobId, newJob);
    this.state.currentRunningJobId = jobId;

    // 6. Exekvera byggfasen (med atomär felisolering)
    newJob.status = 'running';
    newJob.startedAt = new Date().toISOString();

    // Simulera eller exekvera delbyggena
    if (options.simulateFailure) {
      // Byggfel inträffar i t.ex. ord-04
      newJob.projects['ord-01'].status = 'deployed';
      newJob.projects['ord-02'].status = 'deployed';
      newJob.projects['ord-04'].status = 'failed';
      newJob.projects['ord-04'].error = options.failureReason || 'Byggfel i artikelrendering';

      newJob.status = 'failed';
      newJob.completedAt = new Date().toISOString();
      newJob.error = `Bygget misslyckades: ${options.failureReason || 'Kritiskt fel i delbygge'}`;
      this.state.currentRunningJobId = undefined;

      // ATOMÄR GARANTI: Huvudsajten aktiveras INTE och activeReleaseId ändras INTE!
      return {
        ok: false,
        jobId,
        status: 'failed',
        activeReleaseId: this.state.activeReleaseId,
        error: newJob.error,
        message: 'Publicering avbröts. Tidigare aktiv version är 100 % intakt och läsbar.',
        httpStatus: 500,
      };
    }

    // Framgångsrikt bygge: Alla delar byggs och deployas först, huvudsajten sist
    for (const p of Object.values(newJob.projects)) {
      p.status = 'deployed';
      p.deployedAt = new Date().toISOString();
    }

    newJob.status = 'succeeded';
    newJob.completedAt = new Date().toISOString();

    // Skifta aktiv release först när hela byggkedjan är komplett verifierad
    this.state.activeReleaseId = snapshotReleaseId;
    this.state.activeReleaseDate = newJob.completedAt;
    if (options.newSnapshotHash) {
      this.state.activeSnapshotHash = options.newSnapshotHash;
    }
    this.state.monthlyBuildCount++;
    this.state.currentRunningJobId = undefined;

    return {
      ok: true,
      jobId,
      status: 'succeeded',
      activeReleaseId: snapshotReleaseId,
      message: 'Ny release publicerad och aktiverad över samtliga delprojekt.',
      httpStatus: 200,
    };
  }
}
