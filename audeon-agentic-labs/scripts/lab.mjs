import { copyFile } from 'node:fs/promises';
const mode=process.argv[2];
if(!['starter01','solution01'].includes(mode))throw new Error('Usage: npm run lab -- starter01|solution01');
await copyFile((mode==='starter01'?'starters':'solutions')+'/lab01/workflow.ts','packages/domain/workflow.ts');
console.log('Copied '+mode+'. Inspect git diff before continuing.');
