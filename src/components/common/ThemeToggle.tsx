'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

function ThemeToggleComponent() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (buttonRef.current && iconRef.current) {
      // Animate icon rotation on theme change
      gsap.to(iconRef.current, {
        rotation: theme === 'dark' ? 180 : 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [theme]);

  const handleClick = () => {
    if (buttonRef.current) {
      // Scale animation on click
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: toggleTheme,
      });
    } else {
      toggleTheme();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="fixed top-4 left-4 z-50 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-card/80 transition-all duration-300 shadow-lg"
      data-interactive
      aria-label="Toggle theme"
    >
      <span ref={iconRef} className="text-xl">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeToggleComponent />;
};