import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
export async function buildApiWorker(){
 await mkdir('dist/www',{recursive:true});
 await build({entryPoints:['lib/cloudflare/worker.ts'],outfile:'dist/www/_worker.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
 await writeFile('dist/www/_routes.json',JSON.stringify({version:1,include:['/api/kontakt','/api/publicera','/api/runor/v1','/api/runor/v1/*'],exclude:['/api/runor/v1/*.json','/api/runor/v1/versions/*','/api/runor/v1/inscriptions/*']}));
}
if(process.argv[1]?.endsWith('build-api-worker.ts'))buildApiWorker().catch(e=>{console.error(e);process.exitCode=1;});
