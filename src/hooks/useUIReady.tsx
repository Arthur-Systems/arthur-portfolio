'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface UIReadyContextValue {
  isReady: boolean;
  setReady: (ready: boolean) => void;
  setStep: (step: string) => void;
  step: string;
}

const UIReadyContext = createContext<UIReadyContextValue | null>(null);

export function UIReadyProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [step, setStepState] = useState('Initializing…');

  const setStep = useCallback((s: string) => setStepState(s), []);
  const setReady = useCallback((r: boolean) => setIsReady(r), []);

  const value = useMemo(() => ({ isReady, setReady, step, setStep }), [isReady, setReady, step, setStep]);

  return <UIReadyContext.Provider value={value}>{children}</UIReadyContext.Provider>;
}

export function useUIReady() {
  const ctx = useContext(UIReadyContext);
  if (!ctx) throw new Error('useUIReady must be used within UIReadyProvider');
  return ctx;
}



