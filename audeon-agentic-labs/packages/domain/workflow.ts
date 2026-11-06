import type { Status } from './model.js';
// Tickets move NEW -> IN_PROGRESS -> DONE only.
const NEXT: Record<Status, Status | null> = { NEW: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: null };
export function canTransition(from: Status, to: Status): boolean { return NEXT[from] === to; }
export function toCents(value: number): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('Amount must be a finite non-negative number');
  // toPrecision(15) removes binary float noise (12.345*100 = 1234.4999999999998) before rounding.
  return Math.round(Number((value * 100).toPrecision(15)));
}
