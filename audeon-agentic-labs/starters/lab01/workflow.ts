import type { Status } from './model.js';
// Lab 01 intentionally contains business defects. Use the ticket specification.
export function canTransition(from: Status, to: Status): boolean { return from !== to; }
export function toCents(value: number): number { return Math.floor(value * 100); }
