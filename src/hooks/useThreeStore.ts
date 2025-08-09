// Removed: Three.js store; keep a minimal placeholder for any consumers during transition
'use client';

import { create } from 'zustand';

interface MinimalVisualState {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

export const useThreeStore = create<MinimalVisualState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));