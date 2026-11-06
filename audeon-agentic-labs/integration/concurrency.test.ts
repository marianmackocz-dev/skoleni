import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';
import { PostgresRepository } from '../apps/api/repository.js';

// Added as a new file; the protected integration/postgres.test.ts is untouched.
// Uses only TEST_DATABASE_URL from the environment and cleans up the rows it creates.
test('PostgreSQL: concurrent transitions with DIFFERENT keys yield exactly one winner', { skip: !process.env['TEST_DATABASE_URL'] }, async () => {
  const pool = new Pool({ connectionString: process.env['TEST_DATABASE_URL'], max: 10 });
  const keys: string[] = [];
  let id = 0;
  try {
    await pool.query(await readFile('db/001_init.sql', 'utf8'));
    id = Number((await pool.query("INSERT INTO ticket(title) VALUES('Concurrency review row') RETURNING id")).rows[0].id);
    const repo = new PostgresRepository(pool);

    // 8 clients race with the same expected version but unique idempotency keys.
    const attempts = Array.from({ length: 8 }, () => { const k = crypto.randomUUID(); keys.push(k); return repo.transition(id, 1, 'IN_PROGRESS', k); });
    const results = await Promise.allSettled(attempts);
    const ok = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    assert.equal(ok.length, 1, 'exactly one writer may win');
    assert.equal(failed.length, 7);
    for (const f of failed) assert.match(String(f.reason?.message ?? f.reason?.code ?? f.reason), /VERSION_CONFLICT/);

    const row = (await pool.query('SELECT status, version FROM ticket WHERE id=$1', [id])).rows[0];
    assert.equal(row.status, 'IN_PROGRESS');
    assert.equal(row.version, 2, 'version incremented once, no lost update');

    // Failed attempts rolled back their dedup claims; only the winner's key persists.
    const dedup = await pool.query('SELECT count(*)::int AS n FROM request_dedup WHERE key = ANY($1)', [keys]);
    assert.equal(dedup.rows[0].n, 1);
  } finally {
    if (keys.length) await pool.query('DELETE FROM request_dedup WHERE key = ANY($1)', [keys]);
    if (id) await pool.query('DELETE FROM ticket WHERE id=$1', [id]);
    await pool.end();
  }
});

test('PostgreSQL: same key with a different payload is rejected, concurrent identical replays agree', { skip: !process.env['TEST_DATABASE_URL'] }, async () => {
  const pool = new Pool({ connectionString: process.env['TEST_DATABASE_URL'], max: 10 });
  const key = crypto.randomUUID();
  let id = 0;
  try {
    await pool.query(await readFile('db/001_init.sql', 'utf8'));
    id = Number((await pool.query("INSERT INTO ticket(title) VALUES('Concurrency replay row') RETURNING id")).rows[0].id);
    const repo = new PostgresRepository(pool);

    const replays = await Promise.all(Array.from({ length: 6 }, () => repo.transition(id, 1, 'IN_PROGRESS', key)));
    for (const r of replays) assert.deepEqual(r, replays[0]);
    assert.equal(replays[0]!.version, 2);

    await assert.rejects(() => repo.transition(id, 2, 'DONE', key), /IDEMPOTENCY_CONFLICT/);
    const row = (await pool.query('SELECT status, version FROM ticket WHERE id=$1', [id])).rows[0];
    assert.deepEqual({ status: row.status, version: row.version }, { status: 'IN_PROGRESS', version: 2 });
  } finally {
    await pool.query('DELETE FROM request_dedup WHERE key=$1', [key]);
    if (id) await pool.query('DELETE FROM ticket WHERE id=$1', [id]);
    await pool.end();
  }
});
