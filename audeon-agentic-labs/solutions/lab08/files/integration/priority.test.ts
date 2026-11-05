import {test} from 'node:test';import assert from 'node:assert/strict';import {Pool} from 'pg';import {readFile} from 'node:fs/promises';
import {PostgresRepository} from '../apps/api/repository.js';
test('priority migration preserves rows and enforces allowed values',{skip:!process.env['TEST_DATABASE_URL']},async()=>{
 const p=new Pool({connectionString:process.env['TEST_DATABASE_URL']});
 try{await p.query(await readFile('db/001_init.sql','utf8'));await p.query(await readFile('db/002_priority.sql','utf8'));
 const id=Number((await p.query("INSERT INTO ticket(title,priority) VALUES('Priority integration','HIGH') RETURNING id")).rows[0].id);
 const repo=new PostgresRepository(p);assert.ok((await repo.list('HIGH')).some(t=>t.id===id));
 await assert.rejects(()=>p.query("INSERT INTO ticket(title,priority) VALUES('Invalid','URGENT')"));
 await p.query('DELETE FROM ticket WHERE id=$1',[id]);
 }finally{await p.end();}
});
