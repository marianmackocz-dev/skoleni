import {test} from 'node:test';import assert from 'node:assert/strict';
import {createApp} from '../apps/api/app.js';import {MemoryRepository} from '../apps/api/repository.js';
import type {AddressInfo} from 'node:net';
import {consumeNdjson} from '../apps/web/src/ai-stream.js';
import {parseReply} from '../packages/domain/ai.js';

test('AI fixture validates input and returns an explicitly simulated structured reply',async()=>{
 const server=createApp(new MemoryRepository()).listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r));
 const url=`http://127.0.0.1:${(server.address() as AddressInfo).port}/api/ai/summary`;
 const post=(prompt:string)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,requestId:'test-1'})});
 try{assert.equal((await post('')).status,400);assert.equal((await post('[fail]')).status,503);
  const reply=parseReply(await(await post('Review ticket 1')).json());assert.equal(reply.mode,'simulated');assert.equal(reply.checks.length,3);
  assert.throws(()=>parseReply({summary:'untrusted'}),/INVALID_AI_RESPONSE/);
 }finally{await new Promise<void>(r=>server.close(()=>r()));}
});
const bytes=(text:string)=>new TextEncoder().encode(text);
test('Stream decoder handles split UTF-8 and messages, with a completion marker',async()=>{
 const all=bytes('{"delta":"Příliš žluťoučký"}\n{"delta":" kůň"}\n{"delta":"","done":true}\n');
 const stream=new ReadableStream<Uint8Array>({start(c){for(const b of all)c.enqueue(new Uint8Array([b]));c.close();}});
 let out='';await consumeNdjson(stream,new AbortController().signal,t=>{out=t;});assert.equal(out,'Příliš žluťoučký kůň');
});
test('Stream decoder rejects malformed or prematurely ended responses',async()=>{
 for(const content of ['{broken}\n','{"delta":"partial"}\n']){
  const stream=new ReadableStream<Uint8Array>({start(c){c.enqueue(bytes(content));c.close();}});
  await assert.rejects(()=>consumeNdjson(stream,new AbortController().signal,()=>{}));
 }
});
test('Stream cancellation closes a pending reader',async()=>{
 let cancelled=false;const controller=new AbortController();
 const stream=new ReadableStream<Uint8Array>({cancel(){cancelled=true;}});
 const result=consumeNdjson(stream,controller.signal,()=>{});controller.abort();
 await assert.rejects(()=>result);assert.ok(cancelled);
});
