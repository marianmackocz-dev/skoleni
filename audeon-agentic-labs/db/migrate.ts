import { Pool } from 'pg';import { readFile } from 'node:fs/promises';
if(!process.env['DATABASE_URL'])throw new Error('DATABASE_URL is required');
const p=new Pool({connectionString:process.env['DATABASE_URL']});
try{await p.query(await readFile('db/001_init.sql','utf8'));console.log('Migration complete');}finally{await p.end();}
