import {readFile,writeFile,mkdir,copyFile,unlink} from 'node:fs/promises';import path from 'node:path';
const files=JSON.parse(await readFile('solutions/lab08/manifest.json','utf8'));const restore=process.argv.includes('--restore');
for(const file of files){const backup='artifacts/lab08-before/'+file;await mkdir(path.dirname(backup),{recursive:true});await mkdir(path.dirname(file),{recursive:true});
 if(restore){try{const prior=await readFile(backup);if(prior.toString()==='__ABSENT__')await unlink(file).catch(()=>{});else await writeFile(file,prior);await unlink(backup);}catch{throw new Error('No backup for '+file);}}
 else{let old;try{old=await readFile(file);}catch{old=Buffer.from('__ABSENT__');}try{await writeFile(backup,old,{flag:'wx'});}catch{throw new Error('Existing backup. Restore first or inspect artifacts/lab08-before');}await copyFile('solutions/lab08/files/'+file,file);}}
console.log(restore?'Restored capstone inputs':'Applied capstone reference. Run db:migrate and verification.');
