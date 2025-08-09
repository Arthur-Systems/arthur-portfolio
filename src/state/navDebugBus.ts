'use client';

export type NavEvent =
  | { type: 'click'; href: string; ts: number }
  | { type: 'router-change'; pathname: string; search: string; ts: number }
  | { type: 'router-push'; href: string; ts: number }
  | { type: 'router-replace'; href: string; ts: number }
  | { type: 'router-prefetch'; href: string; ts: number }
  | { type: 'transition-start'; ts: number }
  | { type: 'transition-finish'; ts: number; durationMs: number }
  | { type: 'error'; message: string; stack?: string; ts: number }
  | { type: 'warning'; message: string; ts: number };

type Listener = (e: NavEvent) => void;
const listeners = new Set<Listener>();
const buffer: NavEvent[] = [];
const MAX = 200;

export const NavDebugBus = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  emit(evt: NavEvent) {
    buffer.push(evt);
    while (buffer.length > MAX) buffer.shift();
    listeners.forEach((l) => l(evt));
  },
  getBuffer() {
    return buffer.slice();
  },
};



