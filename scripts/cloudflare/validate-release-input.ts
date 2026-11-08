import {readFileSync} from 'node:fs';
import {publicationRecords,publishedOverride,withRunicOverrides} from '../../lib/editorial/publication-input';
import {GRAMMATIK} from '../../data/grammatik';
import {TEXTER} from '../../data/texter';
import {GRAMMATIK_DOKUMENT} from '../../data/dokument';
import {TEXTER_DOKUMENT} from '../../data/textdokument';
import {KALLOR} from '../../data/kallor';
import {RUNIC_PILOT_INSCRIPTIONS} from '../../lib/runor/pilot-data';
import {RUNIC_COMBINED_CORPUS_50} from '../../lib/runor/batch1-data';
import {validateRunicCorpus} from '../../lib/runor/validation';
import {validateGrammarDocument} from '../../lib/validateGrammarDocument';
import {valideraTexter} from '../validate-texter';
import {validateArchive} from './snapshot-core';
import type {Node} from '../../lib/typer';
export function validateReleaseInput(){
 const records=publicationRecords();
 const dictionaryIds=new Set(JSON.parse(readFileSync('data/ordbok/poster.json','utf8')).map((r:any)=>r.id));
 for(const r of records.filter(r=>r.domain==='ordbok'))if(!dictionaryIds.has(r.id))throw Error('Unknown dictionary correction target');
const grammar={...GRAMMATIK_DOKUMENT},texts={...TEXTER_DOKUMENT};
 for(const r of records.filter(r=>r.domain==='texter')){
  const slash=r.id.indexOf('/'),root=r.id.slice(0,slash),id=r.id.slice(slash+1);
  (root==='grammatik'?grammar:texts)[id]=r.content;
 }
 const grammarTree=publishedOverride<Node[]>('trad_och_block','grammatik')??GRAMMATIK;
 const textTree=publishedOverride<Node[]>('trad_och_block','texter')??TEXTER;
 validateArchive(grammarTree,grammar);validateArchive(textTree,texts);
 const ids=new Set(KALLOR.map(k=>k.id));
 const errors=Object.entries(grammar).flatMap(([id,d])=>validateGrammarDocument(id,d,ids).fel);
 errors.push(...valideraTexter({overrideDokument:texts,overrideTrad:textTree,ignoreraGeneratorSynk:true}).fel);
 for(const [version,items] of [['2026.1-pilot',RUNIC_PILOT_INSCRIPTIONS],['2026.2-batch1',RUNIC_COMBINED_CORPUS_50]] as const){const result=validateRunicCorpus(withRunicOverrides(items,version));errors.push(...result.errors);}
 if(errors.length)throw Error(`Publication input validation failed: ${errors.slice(0,10).join('; ')}`);
 return {records:records.length,grammarDocuments:Object.keys(grammar).length,textDocuments:Object.keys(texts).length};
}
if(process.argv[1]?.endsWith('validate-release-input.ts'))try{console.log(JSON.stringify(validateReleaseInput()));}catch(e){console.error(e instanceof Error?e.message:e);process.exitCode=1;}
