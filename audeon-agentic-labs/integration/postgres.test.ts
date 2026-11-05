import { test } from 'node:test';import assert from 'node:assert/strict';import { Pool } from 'pg';import { readFile } from 'node:fs/promises';
import { PostgresRepository } from '../apps/api/repository.js';
test('PostgreSQL serialises concurrent replay and optimistic conflicts',{skip:!process.env['TEST_DATABASE_URL']},async()=>{
 const pool=new Pool({connectionString:process.env['TEST_DATABASE_URL'],max:4});
 try{
  await pool.query(await readFile('db/001_init.sql','utf8'));
  const id=Number((await pool.query("INSERT INTO ticket(title) VALUES('Integration isolated row') RETURNING id")).rows[0].id);
  const repo=new PostgresRepository(pool), key=crypto.randomUUID();
  const [a,b]=await Promise.all([repo.transition(id,1,'IN_PROGRESS',key),repo.transition(id,1,'IN_PROGRESS',key)]);
  assert.deepEqual(a,b);assert.equal(a.version,2);
  await assert.rejects(()=>repo.transition(id,1,'IN_PROGRESS',crypto.randomUUID()),/VERSION_CONFLICT/);
  await pool.query('DELETE FROM request_dedup WHERE key=$1',[key]);await pool.query('DELETE FROM ticket WHERE id=$1',[id]);
 }finally{await pool.end();}
});
