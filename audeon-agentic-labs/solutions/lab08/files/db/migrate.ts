import { Pool } from 'pg';import { readFile,readdir } from 'node:fs/promises';
if(!process.env['DATABASE_URL'])throw new Error('DATABASE_URL is required');
const p=new Pool({connectionString:process.env['DATABASE_URL']});
try{for(const file of (await readdir('db')).filter(x=>/^\d+.*\.sql$/.test(x)).sort())await p.query(await readFile('db/'+file,'utf8'));console.log('Migration complete');}finally{await p.end();}
