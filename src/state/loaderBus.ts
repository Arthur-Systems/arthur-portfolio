export type LoaderEvent = {
  type: 'start' | 'step' | 'finish';
  delta?: number;
  label?: string;
};

type Listener = (payload: LoaderEvent) => void;
const listeners = new Set<Listener>();

export const LoaderBus = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(evt: LoaderEvent) {
    listeners.forEach((l) => l(evt));
  },
};

export const Loader = {
  start(label?: string) {
    LoaderBus.emit({ type: 'start', ...(label !== undefined ? { label } : {}) });
  },
  step(delta: number, label?: string) {
    LoaderBus.emit({ type: 'step', delta, ...(label !== undefined ? { label } : {}) });
  },
  finish() {
    LoaderBus.emit({ type: 'finish' });
  },
};



