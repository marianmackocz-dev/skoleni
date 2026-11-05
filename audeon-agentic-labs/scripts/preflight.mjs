import { spawnSync } from 'node:child_process';import fs from 'node:fs';
const major=Number(process.versions.node.split('.')[0]);if(major!==24){console.error('Use Node 24 LTS >=24.15.0');process.exitCode=1;}
for(const [cmd,args] of [['git',['--version']],['docker',['compose','version']],['claude',['--version']]]){
 const r=spawnSync(cmd,args,{encoding:'utf8'});console.log(cmd,r.error?'NOT AVAILABLE':(r.stdout||r.stderr).trim());
}
console.log('lockfile',fs.existsSync('package-lock.json')?'present':'missing');
console.log('Do not publish this output if it contains environment-specific data.');
