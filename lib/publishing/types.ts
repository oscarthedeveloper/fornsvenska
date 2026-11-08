/**
 * CF05: Typdefinitioner för publiceringspipelinen och redaktionslagret
 */

export type PublishingJobStatus = 'pending' | 'running' | 'succeeded' | 'failed';

export interface ProjectDeployStatus {
  projectId: string;
  projectName: string;
  status: 'pending' | 'building' | 'deployed' | 'failed';
  fileCount?: number;
  deployedAt?: string;
  error?: string;
}

export interface PublishingJob {
  jobId: string;
  idempotencyKey: string;
  requestedBy: string;
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
  status: PublishingJobStatus;
  snapshotReleaseId: string;
  error?: string;
  projects: Record<string, ProjectDeployStatus>;
}

export interface PublishingState {
  activeReleaseId: string;
  activeReleaseDate: string;
  activeSnapshotHash: string;
  currentRunningJobId?: string;
  monthlyBuildCount: number;
  monthlyBuildQuota: number;
}

export interface PublishRequestResult {
  ok: boolean;
  jobId?: string;
  status?: PublishingJobStatus;
  activeReleaseId?: string;
  message?: string;
  error?: string;
  httpStatus: number;
}
