export type Status = 'NEW' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH';
export interface Ticket { id: number; title: string; status: Status; version: number; estimateCents: number; priority: Priority }
export class DomainError extends Error {
  constructor(public code: string, public status: number) { super(code); }
}
