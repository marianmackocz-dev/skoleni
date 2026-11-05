import type { Status } from './model.js';
export function canTransition(from: Status, to: Status): boolean {
  return (from === 'NEW' && to === 'IN_PROGRESS') || (from === 'IN_PROGRESS' && to === 'DONE');
}
export function toCents(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > 1_000_000) throw new RangeError('INVALID_AMOUNT');
  return Math.round((value + Number.EPSILON) * 100);
}
