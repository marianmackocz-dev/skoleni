import express from 'express';import { timingSafeEqual } from 'node:crypto';
const app=express();app.use(express.json({limit:'64kb'}));
const key=process.env['GATEWAY_KEY'];if(!key||key.length<16)throw new Error('GATEWAY_KEY must have at least 16 characters');
const upstream=process.env['OLLAMA_URL']??'http://127.0.0.1:11434';
const model=process.env['LLM_MODEL']??'qwen3:8b';
app.post('/v1/chat/completions',async(req,res)=>{
 const got=Buffer.from(req.header('Authorization')??''),expected=Buffer.from('Bearer '+key);
 if(got.length!==expected.length||!timingSafeEqual(got,expected)){res.status(401).json({error:'UNAUTHORISED'});return;}
 if(req.body.model!==model||req.body.stream===true){res.status(400).json({error:'MODEL_OR_STREAM_NOT_ALLOWED'});return;}
 const start=Date.now();
 try{const result=await fetch(upstream+'/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(req.body),signal:AbortSignal.timeout(90000)});res.status(result.status).json(await result.json());console.log(JSON.stringify({event:'inference',model,status:result.status,elapsedMs:Date.now()-start}));}
 catch{res.status(502).json({error:'UPSTREAM_UNAVAILABLE'});}
});
app.listen(4000,process.env['GATEWAY_BIND']??'127.0.0.1',()=>console.log('Classroom gateway ready on :4000'));
