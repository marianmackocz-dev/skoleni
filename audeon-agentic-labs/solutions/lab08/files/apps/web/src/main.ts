import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AiAssistant } from './ai-assistant.js';
interface Ticket{id:number;title:string;status:'NEW'|'IN_PROGRESS'|'DONE';version:number;estimateCents:number;priority:'LOW'|'NORMAL'|'HIGH'}
@Component({selector:'app-root',standalone:true,imports:[AiAssistant],template:`
 <main><p class="brand">AudeON s.r.o. · DeliveryDesk</p><h1>Work queue</h1>
 <p>Agentic development classroom application</p>
 <button (click)="load()">Reload tickets</button>
 <label for="priority">Priority</label><select id="priority" #prioritySelect (change)="priority.set(prioritySelect.value);load()"><option value="">All priorities</option><option>LOW</option><option>NORMAL</option><option>HIGH</option></select>
 <label><input type="checkbox" (change)="openOnly.set(!openOnly())"> Open tickets only</label>
 @if(error()){<p role="alert">{{error()}}</p>}
 <ul>@for(t of visible();track t.id){<li><h2>{{t.title}}</h2><p>{{t.priority}}</p><p>{{t.status}} · v{{t.version}}</p>
 @if(t.status!=='DONE'){<button [disabled]="busy()" (click)="advance(t)">Advance {{t.id}}</button>}</li>}</ul>
 <app-ai-assistant /></main>`})
export class App {
 private http=inject(HttpClient);tickets=signal<Ticket[]>([]);error=signal('');busy=signal(false);openOnly=signal(false);priority=signal('');
 visible=computed(()=>this.tickets().filter(t=>!this.openOnly()||t.status!=='DONE'));
 constructor(){this.load();}
 load(){this.error.set('');this.http.get<Ticket[]>('/api/tickets'+(this.priority()?'?priority='+encodeURIComponent(this.priority()):'')).subscribe({next:rows=>this.tickets.set(rows),error:()=>this.error.set('Cannot load tickets. Check API and database.')});}
 advance(t:Ticket){this.busy.set(true);this.error.set('');this.http.post<Ticket>(`/api/tickets/${t.id}/transition`,{version:t.version,target:t.status==='NEW'?'IN_PROGRESS':'DONE'},{headers:{'Idempotency-Key':crypto.randomUUID()}}).subscribe({next:()=>{this.busy.set(false);this.load();},error:()=>{this.busy.set(false);this.error.set('Transition rejected. Reload and inspect the API response.');}});}
}
bootstrapApplication(App,{providers:[provideHttpClient()]}).catch(console.error);
