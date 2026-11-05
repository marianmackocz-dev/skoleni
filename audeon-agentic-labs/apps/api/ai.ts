import { Router } from 'express';
import * as z from 'zod/v4';
import { setTimeout as wait } from 'node:timers/promises';
import type { AiReply } from '../../packages/domain/ai.js';

// Deterministic fixture, explicitly not an LLM. No keys or inference in the browser.
const input = z.object({prompt:z.string().trim().min(1).max(1000),requestId:z.string().min(1).max(80)}).strict();
export function aiRoutes() {
 const router = Router();
 router.post('/summary', async (req,res) => {
  const v = input.parse(req.body);
  await wait(250);
  if (v.prompt === '[fail]') {res.status(503).json({error:'SIMULATED_UPSTREAM_FAILURE'});return;}
  const reply:AiReply = {requestId:v.requestId,mode:'simulated',summary:`Review request: ${v.prompt}`,checks:['Keep the public contract','Run regression tests','Review the diff']};
  res.json(reply);
 });
 router.post('/stream', async(req,res) => {
  const v=input.parse(req.body);
  res.setHeader('Content-Type','application/x-ndjson');res.setHeader('Cache-Control','no-store');
  res.flushHeaders();
  const controller=new AbortController();
  const abort=()=>controller.abort();res.on('close',abort);
  try {
   const deltas=['Review ',v.prompt,'. ','Keep the contract. ','Run regression tests.'];
   for(const [index,delta] of deltas.entries()) {
    await wait(120,undefined,{signal:controller.signal});
    if(v.prompt==='[broken]'&&index===2){res.end('{broken-json}\n');return;}
    res.write(JSON.stringify({delta})+'\n');
   }
   res.end(JSON.stringify({delta:'',done:true})+'\n');
  } catch(e) {if(!controller.signal.aborted)res.destroy(e instanceof Error?e:undefined);}
  finally {res.off('close',abort);}
 });
 return router;
}
