import {test} from 'node:test';import assert from 'node:assert/strict';
import {MemoryRepository} from '../apps/api/repository.js';
test('priority defaults and filtered reads preserve original behaviour',async()=>{
 const r=new MemoryRepository();assert.equal((await r.get(1))?.priority,'NORMAL');
 assert.equal((await r.list()).length,2);assert.equal((await r.list('HIGH')).length,1);
 assert.equal((await r.list('LOW')).length,0);
});
