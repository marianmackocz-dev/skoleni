import { createHash } from 'node:crypto';
import { Pool } from 'pg';
import { canTransition } from '../../packages/domain/workflow.js';
import { DomainError, type Ticket, type Status, type Priority } from '../../packages/domain/model.js';
export interface Repository {
  list(priority?: Priority): Promise<Ticket[]>; get(id: number): Promise<Ticket | undefined>;
  transition(id: number, version: number, target: Status, key: string): Promise<Ticket>;
}
const digest=(id:number,version:number,target:Status)=>createHash('sha256').update(JSON.stringify([id,version,target])).digest('hex');
export class MemoryRepository implements Repository {
  rows: Ticket[] = [{id:1,title:'Refactor validation',status:'NEW',version:1,estimateCents:12550,priority:'NORMAL'},{id:2,title:'Priority review',status:'NEW',version:1,estimateCents:0,priority:'HIGH'}];
  keys = new Map<string,{hash:string;ticket:Ticket}>();
  async list(priority?:Priority){ return structuredClone(this.rows.filter(t=>!priority||t.priority===priority)); }
  async get(id:number){return structuredClone(this.rows.find(x=>x.id===id));}
  async transition(id:number,version:number,target:Status,key:string){
    const hash=digest(id,version,target), prior=this.keys.get(key);
    if(prior){if(prior.hash!==hash)throw new DomainError('IDEMPOTENCY_CONFLICT',409);return structuredClone(prior.ticket);}
    const item=this.rows.find(x=>x.id===id);
    if(!item)throw new DomainError('NOT_FOUND',404);
    if(item.version!==version)throw new DomainError('VERSION_CONFLICT',409);
    if(!canTransition(item.status,target))throw new DomainError('INVALID_TRANSITION',422);
    item.status=target;item.version++;
    this.keys.set(key,{hash,ticket:structuredClone(item)});return structuredClone(item);
  }
}
function map(row:Record<string,unknown>):Ticket {
  return {id:Number(row['id']),title:String(row['title']),status:row['status'] as Status,version:Number(row['version']),estimateCents:Number(row['estimate_cents']),priority:(row['priority']??'NORMAL') as Priority};
}
export class PostgresRepository implements Repository {
  constructor(public pool:Pool){}
  async list(priority?:Priority){const r=await this.pool.query('SELECT * FROM ticket WHERE ($1::text IS NULL OR priority=$1) ORDER BY id LIMIT 100',[priority??null]);return r.rows.map(map);}
  async get(id:number){const r=await this.pool.query('SELECT * FROM ticket WHERE id=$1',[id]);return r.rows[0]?map(r.rows[0]):undefined;}
  async transition(id:number,version:number,target:Status,key:string){
    const c=await this.pool.connect();
    try{
      await c.query('BEGIN');
      const hash=digest(id,version,target);
      const claim=await c.query('INSERT INTO request_dedup (key, request_hash) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING key',[key,hash]);
      if(!claim.rowCount){
        const p=(await c.query('SELECT request_hash,response FROM request_dedup WHERE key=$1',[key])).rows[0];
        if(!p || p.request_hash!==hash)throw new DomainError('IDEMPOTENCY_CONFLICT',409);
        await c.query('COMMIT'); return p.response as Ticket;
      }
      const row=(await c.query('SELECT * FROM ticket WHERE id=$1 FOR UPDATE',[id])).rows[0];
      if(!row)throw new DomainError('NOT_FOUND',404);
      const item=map(row);
      if(item.version!==version)throw new DomainError('VERSION_CONFLICT',409);
      if(!canTransition(item.status,target))throw new DomainError('INVALID_TRANSITION',422);
      const changed=map((await c.query('UPDATE ticket SET status=$1,version=version+1 WHERE id=$2 RETURNING *',[target,id])).rows[0]);
      await c.query('UPDATE request_dedup SET response=$1::jsonb WHERE key=$2',[JSON.stringify(changed),key]);
      await c.query('COMMIT');return changed;
    }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
  }
}
