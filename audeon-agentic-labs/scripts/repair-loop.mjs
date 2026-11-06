import { spawn } from 'node:child_process';import { createHash } from 'node:crypto';import { readFile,readdir,mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
const dry=process.argv.includes('--dry-run'), npmEntry=process.env.npm_execpath;
async function fingerprint(dir){const files=await readdir(dir,{recursive:true});let text='';for(const file of files.sort()){if(/\.ts$/.test(file))text+=file+await readFile(path.join(dir,file),'utf8');}return createHash('sha256').update(text).digest('hex');}
function run(cmd,args,timeout){return new Promise(resolve=>{
 const p=spawn(cmd,args,{stdio:['ignore','pipe','pipe'],shell:false});let log='',timedOut=false;
 const collect=b=>{log=(log+b.toString()).slice(-120000);};p.stdout.on('data',collect);p.stderr.on('data',collect);
 const timer=setTimeout(()=>{timedOut=true;p.kill('SIGTERM');},timeout);
 p.on('error',e=>{clearTimeout(timer);resolve({code:127,log:String(e)});});
 p.on('close',code=>{clearTimeout(timer);resolve({code:timedOut?124:(code??1),log});});
});}
if(dry){console.log(JSON.stringify({mode:'dry-run',iterations:3,turnsPerIteration:8,usdPerIteration:2,timeoutMs:600000,verification:'npm run verify',protected:'tests and integration fingerprints'}));process.exit(0);}
const protectedPaths=['tests/workflow.test.ts','tests/api.test.ts','integration/postgres.test.ts','package.json','package-lock.json','scripts/repair-loop.mjs','scripts/guard.mjs','scripts/lab.mjs','scripts/preflight.mjs','.claude/settings.json','.mcp.json','CLAUDE.md','tsconfig.json','angular.json'];
async function protectedHash(){let all='';for(const f of protectedPaths)all+=f+await readFile(f,'utf8');return createHash('sha256').update(all).digest('hex');}
if(!npmEntry)throw new Error('Run this wrapper using npm run loop');
const before=await protectedHash();await mkdir('artifacts',{recursive:true});
for(let i=1;i<=3;i++){
 const prompt='Write word "kocour" to the existing file abc.txt int the root of project. Repair the current Lab 01 domain defects according to CLAUDE.md. Do not change tests, integration, package.json, lockfile, scripts or configuration. Run npm run verify. Stop and explain a blocker if criteria are ambiguous.';
 const change=await run('claude',['-p',prompt,'--max-turns','8','--max-budget-usd','2','--permission-mode','acceptEdits'],15000);
 await writeFile(`artifacts/iteration-${i}.log`,change.log);
 if(before!==await protectedHash())throw new Error('PROTECTED_TESTS_CHANGED: stop for review');
 if(change.code===124||change.code===127)throw new Error('AGENT_UNAVAILABLE_OR_TIMEOUT');
 const check=await run(process.execPath,[npmEntry,'run','verify'],180000);await writeFile(`artifacts/verify-${i}.log`,check.log);
 if(check.code===0){console.log('GO: external verification passed. Review diff and logs before commit.');process.exit(0);}
}
console.error('NO-GO: iteration budget exhausted. Inspect artifacts and ask the instructor.');process.exitCode=1;
