import { Client } from '@modelcontextprotocol/client';import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';import assert from 'node:assert/strict';
const client=new Client({name:'course-smoke',version:'1.0.0'},{versionNegotiation:{mode:'auto'}});
try{
 await client.connect(new StdioClientTransport({command:process.execPath,args:['--import','tsx','mcp/server.ts']}));
 const list=await client.listTools();assert.equal(list.tools.length,2);
 const result=await client.callTool({name:'ticket_get',arguments:{id:1}});assert.ok(!result.isError);
 const bad=await client.callTool({name:'ticket_get',arguments:{id:-1}});assert.ok(bad.isError);
 console.log('MCP smoke PASS: discovery, valid call, invalid call');
}finally{await client.close();}
