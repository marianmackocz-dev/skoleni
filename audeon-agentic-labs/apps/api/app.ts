import express from 'express';
import * as z from 'zod/v4';
import type { Repository } from './repository.js';
import { DomainError } from '../../packages/domain/model.js';
import { aiRoutes } from './ai.js';
const bodySchema=z.object({version:z.number().int().positive(),target:z.enum(['NEW','IN_PROGRESS','DONE'])}).strict();
const idSchema=z.coerce.number().int().positive();
export function createApp(repo:Repository){
 const app=express();app.disable('x-powered-by');app.use(express.json({limit:'16kb'}));
 app.use('/api/ai',aiRoutes());
 app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
 app.get('/api/tickets',async(_req,res)=>res.json(await repo.list()));
 app.get('/api/tickets/:id',async(req,res)=>{
  const id=idSchema.parse(req.params.id);const item=await repo.get(id);
  if(!item)throw new DomainError('NOT_FOUND',404);res.json(item);
 });
 app.post('/api/tickets/:id/transition',async(req,res)=>{
  const id=idSchema.parse(req.params.id), data=bodySchema.parse(req.body);
  const key=z.string().min(8).max(128).parse(req.header('Idempotency-Key'));
  res.json(await repo.transition(id,data.version,data.target,key));
 });
 app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  if(error instanceof z.ZodError){res.status(400).json({error:'INVALID_INPUT'});return;}
  if(error instanceof DomainError){res.status(error.status).json({error:error.code});return;}
  console.error(error instanceof Error?error.message:'Unexpected error');res.status(500).json({error:'INTERNAL_ERROR'});
 });return app;
}
