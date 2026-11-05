// Provider-neutral classroom contract. TypeScript types alone do not validate JSON.
export interface AiReply { requestId: string; summary: string; checks: string[]; mode: 'simulated' }
export type AiChunk = { delta: string; done?: boolean };
export function parseReply(value: unknown): AiReply {
  if (!value || typeof value !== 'object') throw new Error('INVALID_AI_RESPONSE');
  const v = value as Record<string, unknown>;
  if (typeof v['requestId'] !== 'string' || typeof v['summary'] !== 'string' ||
      v['summary'].length > 4000 || v['mode'] !== 'simulated' ||
      !Array.isArray(v['checks']) || v['checks'].length > 12 ||
      !v['checks'].every(x => typeof x === 'string' && x.length <= 300)) {
    throw new Error('INVALID_AI_RESPONSE');
  }
  return v as unknown as AiReply;
}
export function parseChunk(value: unknown): AiChunk {
  if (!value || typeof value !== 'object') throw new Error('INVALID_STREAM_CHUNK');
  const v = value as Record<string, unknown>;
  if (typeof v['delta'] !== 'string' || v['delta'].length > 4000 ||
      (v['done'] !== undefined && typeof v['done'] !== 'boolean')) throw new Error('INVALID_STREAM_CHUNK');
  return v as AiChunk;
}
