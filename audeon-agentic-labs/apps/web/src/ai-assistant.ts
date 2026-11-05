import { Component,computed,linkedSignal,resource,signal,type ResourceStreamItem } from '@angular/core';
import { parseReply,type AiReply } from '../../../packages/domain/ai.js';
import { consumeNdjson } from './ai-stream.js';
interface Submission {prompt:string;requestId:string}
@Component({selector:'app-ai-assistant',standalone:true,template:`
 <section aria-labelledby="ai-title"><h2 id="ai-title">AI pattern laboratory</h2>
 <p>Deterministic simulator. No model call and no generated factual claims.</p>
 <label for="prompt">Review prompt</label>
 <textarea id="prompt" #input maxlength="1000" [value]="draft()" (input)="draft.set(input.value)"></textarea>
 <button (click)="submit()" [disabled]="!draft().trim()">Generate review</button>
 <button (click)="startStream()" [disabled]="!draft().trim()">Stream review</button>
 <button (click)="cancel()">Cancel requests</button>
 @if(reply.isLoading()){<p role="status">Generating review</p>}
 @if(reply.error()){<p role="alert">Review failed. Retry the submitted prompt.</p><button (click)="reply.reload()">Retry review</button>}
 @if(reply.hasValue()){
  <p>{{reply.value().summary}}</p><p>Mode {{reply.value().mode}}</p>
  <p>{{checkCount()}} checks</p><ul>@for(c of reply.value().checks;track $index){<li>{{c}}</li>}</ul>
 }
 @if(streamed.isLoading()){<p role="status">Connecting stream</p>}
 @if(streamed.error()){<p role="alert">Stream failed. Partial output is incomplete.</p><button (click)="streamed.reload()">Retry stream</button>}
 @if(streamed.hasValue()){<p aria-live="polite">{{streamed.value()}}</p>}
 <h3>Completed review history</h3><ul>@for(h of history();track h.requestId){<li>{{h.summary}}</li>}</ul>
 </section>`})
export class AiAssistant {
 draft=signal('Review ticket 1');
 submitted=signal<Submission|undefined>(undefined);
 streamInput=signal<Submission|undefined>(undefined);
 reply=resource({params:()=>this.submitted(),loader:async({params,abortSignal})=>{
  const response=await fetch('/api/ai/summary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params),signal:abortSignal});
  if(!response.ok)throw new Error('AI_HTTP_'+response.status);
  const reply=parseReply(await response.json());
  if(reply.requestId!==params.requestId)throw new Error('REQUEST_ID_MISMATCH');
  return reply;
 }});
 checkCount=computed(()=>this.reply.hasValue()?this.reply.value().checks.length:0);
 history=linkedSignal<AiReply|undefined,AiReply[]>({
  source:()=>this.reply.hasValue()?this.reply.value():undefined,
  computation:(next,previous)=>{
   const old=previous?.value??[];
   return next&&!old.some(x=>x.requestId===next.requestId)?[...old,next].slice(-20):old;
  }
 });
 streamed=resource({params:()=>this.streamInput(),stream:async({params,abortSignal})=>{
  const response=await fetch('/api/ai/stream',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params),signal:abortSignal});
  if(!response.ok||!response.body)throw new Error('STREAM_HTTP_'+response.status);
  const updates=signal<ResourceStreamItem<string>>({value:''});
  void consumeNdjson(response.body,abortSignal,text=>{if(!abortSignal.aborted)updates.set({value:text});})
   .catch(error=>{if(!abortSignal.aborted)updates.set({error:error instanceof Error?error:new Error(String(error))});});
  return updates;
 }});
 submit(){const prompt=this.draft().trim();if(prompt)this.submitted.set({prompt,requestId:crypto.randomUUID()});}
 startStream(){const prompt=this.draft().trim();if(prompt)this.streamInput.set({prompt,requestId:crypto.randomUUID()});}
 cancel(){this.submitted.set(undefined);this.streamInput.set(undefined);}
}
