import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
export function releaseMetadata(){return {releaseId:process.env.CF_RELEASE_JOB_ID||'local-unpublished',gitSha:process.env.CF_RELEASE_GIT_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()};}
export async function writeReleaseMetadata(dir:string){await writeFile(path.join(dir,'release.json'),JSON.stringify(releaseMetadata())+'\n');}
