import { parseChunk } from '../../../packages/domain/ai.js';

// A network chunk is not a JSON message. Preserve UTF-8 and newline boundaries.
export async function consumeNdjson(
 stream: ReadableStream<Uint8Array>, signal: AbortSignal, emit: (text:string)=>void
):Promise<void> {
 const reader=stream.getReader(),decoder=new TextDecoder();
 let buffer='',text='',complete=false;
 const abort=()=>{void reader.cancel().catch(()=>{});};
 signal.addEventListener('abort',abort,{once:true});
 const line=(raw:string)=>{
  if(!raw.trim())return;
  if(complete)throw new Error('DATA_AFTER_COMPLETION');
  const item=parseChunk(JSON.parse(raw));text+=item.delta;
  if(text.length>16000)throw new Error('STREAM_LIMIT');
  emit(text);if(item.done)complete=true;
 };
 try {
  while(true){
   signal.throwIfAborted();const part=await reader.read();if(part.done)break;
   buffer+=decoder.decode(part.value,{stream:true});
   if(buffer.length>32000)throw new Error('FRAME_LIMIT');
   let newline;while((newline=buffer.indexOf('\n'))>=0){line(buffer.slice(0,newline));buffer=buffer.slice(newline+1);}
  }
  signal.throwIfAborted();buffer+=decoder.decode();if(buffer.trim())line(buffer);
  if(!complete)throw new Error('INCOMPLETE_STREAM');
 }finally{signal.removeEventListener('abort',abort);await reader.cancel().catch(()=>{});reader.releaseLock();}
}
