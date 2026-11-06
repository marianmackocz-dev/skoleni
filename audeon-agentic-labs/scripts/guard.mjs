// Teaching hook. This detects selected examples, not all equivalent shell syntax.
import path from 'node:path';
let raw='';for await(const chunk of process.stdin)raw+=chunk;
let deny=false,reason='';
try{
 const input=JSON.parse(raw),t=input.tool_input??{};
 if(input.tool_name==='Write'||input.tool_name==='Edit'){
  const root=path.resolve(process.cwd()),file=path.resolve(root,String(t.file_path??''));
  const rel=path.relative(root,file).replaceAll('\\','/');
  const protectedTests=['tests/workflow.test.ts','tests/api.test.ts','integration/postgres.test.ts'];
  const isSecretOrGit=r=>r.split('/').some(s=>s.startsWith('.env'))||r==='.git'||r.startsWith('.git/');
  // Worktrees deliverydesk-api and deliverydesk-ui (sibling of the repo or inside it) are writable.
  const worktrees=['deliverydesk-api','deliverydesk-ui'].flatMap(n=>[path.resolve(root,'..',n),path.resolve(root,n)]);
  const wt=worktrees.find(w=>{const r=path.relative(w,file);return r!==''&&!r.startsWith('..')&&!path.isAbsolute(r);});
  if(wt){
   const wrel=path.relative(wt,file).replaceAll('\\','/');
   // Secrets, .git metadata and protected tests stay blocked inside worktrees as well.
   deny=isSecretOrGit(wrel)||protectedTests.includes(wrel);
  }else{
   deny=rel.startsWith('../')||path.isAbsolute(rel)||rel.startsWith('.env')||rel.startsWith('.git/')||protectedTests.includes(rel);
  }
  reason='Protected path. Ask the instructor to review the change.';
 }
 if(input.tool_name==='Bash'){
  deny=/\brm\s+-rf\b|\bgit\s+reset\s+--hard\b|\bcurl\b.*\|.*\b(sh|bash)\b/.test(String(t.command??''));
  reason='Destructive or remote-shell example blocked.';
 }
}catch{deny=true;reason='Invalid hook input';}
if(deny)console.log(JSON.stringify({hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:'deny',permissionDecisionReason:reason}}));
