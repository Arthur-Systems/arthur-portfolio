'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export const CustomScrollbar = () => {
  const trackRef   = useRef<HTMLDivElement>(null);
  const thumbRef   = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);
  const [progress, setProgress] = useState(0); // 0‒1
  const [isVisible, setIsVisible] = useState(false);

  /** sync thumb to scroll position */
  const syncThumb = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    setProgress(pct);
    
    // Show scrollbar only when content is scrollable
    const isScrollable = max > 0;
    setIsVisible(isScrollable);
  };

  /** scroll the page when user drags the thumb */
  const onDrag = (e: MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect  = trackRef.current.getBoundingClientRect();
    const y     = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    const pct   = y / rect.height;
    window.scrollTo({ top: pct * (document.documentElement.scrollHeight - window.innerHeight) });
  };

  useEffect(() => {
    syncThumb();                       // initial
    window.addEventListener('scroll', syncThumb, { passive: true });
    window.addEventListener('resize', syncThumb, { passive: true });

    /* mouse listeners for dragging */
    const up   = () => (dragging.current = false);
    const move = (e: MouseEvent) => onDrag(e);
    window.addEventListener('mouseup',   up);
    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('scroll', syncThumb);
      window.removeEventListener('resize', syncThumb);
      window.removeEventListener('mouseup',   up);
      window.removeEventListener('mousemove', move);
    };
  }, []);

  /* animate thumb height / position each react-state change */
  useEffect(() => {
    if (!thumbRef.current || !trackRef.current) return;
    const h = Math.max(window.innerHeight / document.documentElement.scrollHeight, 0.1);
    gsap.to(thumbRef.current, {
      yPercent: progress * 100,
      height:   `${h * 100}%`,
      duration: 0.15,
      ease: 'power2.out',
    });
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      ref={trackRef}
      className="fixed top-0 right-0 w-4 h-full z-50 select-none"
      style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(2px)',
      }}
      onMouseDown={(e) => {
        dragging.current = true;
        onDrag(e.nativeEvent);          // jump immediately where clicked
      }}
    >
      <div
        ref={thumbRef}
        className="w-full bg-white/20 rounded-none cursor-pointer hover:bg-white/30 transition-all duration-200 hover:scale-110"
        style={{ height: '20%' }}
      />
    </div>
  );
};
