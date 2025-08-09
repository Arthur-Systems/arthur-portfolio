import '@testing-library/jest-dom';

// Polyfill Next.js dynamic
;(global as any).next = (global as any).next || {};

// Quiet some noisy errors from animations during tests
const originalError = console.error;
console.error = (...args: any[]) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('Not implemented: HTMLCanvasElement.prototype.getContext')) return;
  return (originalError as any)(...args);
};

// matchMedia polyfill for useReducedMotion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});


