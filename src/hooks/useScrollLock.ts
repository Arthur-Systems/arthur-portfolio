'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Simple document-level scroll lock.
 * Locks on mount (if lockOnMount = true) and provides imperative lock/unlock.
 * Restores previous overflow styles on unlock.
 */
export function useScrollLock(lockOnMount: boolean = false) {
  const lockedRef = useRef(false);
  const previousOverflowRef = useRef<string | null>(null);
  const previousPaddingRightRef = useRef<string | null>(null);

  const lock = useCallback(() => {
    if (typeof document === 'undefined' || lockedRef.current) return;
    const docEl = document.documentElement;
    const body = document.body;

    previousOverflowRef.current = docEl.style.overflow || '';
    previousPaddingRightRef.current = body.style.paddingRight || '';

    const scrollbarWidth = window.innerWidth - docEl.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    docEl.style.overflow = 'hidden';
    lockedRef.current = true;
  }, []);

  const unlock = useCallback(() => {
    if (typeof document === 'undefined' || !lockedRef.current) return;
    const docEl = document.documentElement;
    const body = document.body;

    docEl.style.overflow = previousOverflowRef.current ?? '';
    body.style.paddingRight = previousPaddingRightRef.current ?? '';
    lockedRef.current = false;
  }, []);

  useEffect(() => {
    if (!lockOnMount) return;
    lock();
    return () => unlock();
  }, [lockOnMount, lock, unlock]);

  return { lock, unlock };
}






