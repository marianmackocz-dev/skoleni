import { Pool } from 'pg';
import { createApp } from './app.js';
import { MemoryRepository,PostgresRepository } from './repository.js';
const memory=process.env['APP_STORE']==='memory';
if(!memory&&!process.env['DATABASE_URL'])throw new Error('Set DATABASE_URL or explicitly use APP_STORE=memory');
const pool=memory?undefined:new Pool({connectionString:process.env['DATABASE_URL'],max:5,connectionTimeoutMillis:3000});
const repo=pool?new PostgresRepository(pool):new MemoryRepository();
const server=createApp(repo).listen(3000,'127.0.0.1',()=>console.log(`API http://127.0.0.1:3000 store=${memory?'ephemeral memory':'PostgreSQL'}`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{void pool?.end();}));
