import {test} from 'node:test';import assert from 'node:assert/strict';import type {AddressInfo} from 'node:net';
import {createApp} from '../apps/api/app.js';import {MemoryRepository} from '../apps/api/repository.js';
test('HTTP priority filtering validates input and preserves unfiltered calls',async()=>{
 const server=createApp(new MemoryRepository()).listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${(server.address() as AddressInfo).port}/api/tickets`;
 try{assert.equal((await(await fetch(base)).json()).length,2);const high=await(await fetch(base+'?priority=HIGH')).json();assert.equal(high.length,1);assert.equal(high[0].priority,'HIGH');assert.equal((await fetch(base+'?priority=URGENT')).status,400);}
 finally{await new Promise<void>((r,j)=>server.close(e=>e?j(e):r()));}
});
