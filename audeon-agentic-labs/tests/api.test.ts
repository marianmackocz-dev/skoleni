import { test } from 'node:test';import assert from 'node:assert/strict';import type { AddressInfo } from 'node:net';
import { createApp } from '../apps/api/app.js';import { MemoryRepository } from '../apps/api/repository.js';
test('API validates, rejects missing and replays idempotent results',async()=>{
 const server=createApp(new MemoryRepository()).listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
 const post=(payload:unknown,key='example-key-01')=>fetch(base+'/api/tickets/1/transition',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify(payload)});
 try{
  assert.equal((await fetch(base+'/api/tickets/999')).status,404);
  assert.equal((await post({version:'1',target:'DONE'})).status,400);
  assert.equal((await post({version:1,target:'DONE'})).status,422);
  const payload={version:1,target:'IN_PROGRESS'};
  const a=await post(payload);assert.equal(a.status,200);const first=await a.json();
  assert.deepEqual(await(await post(payload)).json(),first);
  assert.equal((await post({version:2,target:'DONE'})).status,409);
  assert.equal((await post(payload,'different-key-01')).status,409);
 }finally{await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
