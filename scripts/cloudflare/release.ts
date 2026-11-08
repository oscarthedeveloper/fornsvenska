/** Live publishing requires a claimed persistent job; no simulated releases or rollbacks. */
import {validateDistribution} from './validate-distribution';
async function main(){
 if(process.argv.includes('--check')||process.argv.length===2){console.log(JSON.stringify(await validateDistribution(),null,2));return;}
 throw Error('Use a real persistent publication job and deploy-pages.ts. In-memory release/rollback is disabled.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
