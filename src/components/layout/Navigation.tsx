'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { NavDebugBus } from '@/state/navDebugBus';
import { getSubdomain, getSubdomainLabel } from '@/lib/utils';
import { useRouteTransition } from '@/state/RouteTransitionContext';
import { fullGsapTeardown } from '@/lib/gsapCleanup';
import { killHeroFx } from '@/lib/heroFx';
import { killAllScrollFx } from '@/lib/scrollFx';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/photography', label: 'Photography', icon: '📸' },
  { href: '/tech', label: 'Software Dev', icon: '💻' },
  { href: '/video', label: 'Film', icon: '🎬' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isMountedRef = useRef(true);
  const targetHrefRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { startTransition, finishTransition, abortAll } = useRouteTransition();

  useEffect(() => {
    // Detect subdomain on client side
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      // ✅ Wrap animations in useLayoutEffect + gsap.context()
      const ctx = gsap.context(() => {
        gsap.from(menuRef.current!.children, {
          opacity: 0,
          x: -50,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        });
      });

      // Cleanup function
      return () => ctx.revert();
    }
  }, [isOpen]);

  // Guard against setState after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };
  }, []);

  /**
   * Prepare a hard navigation for a given href.
   * This intentionally allows the browser's default anchor navigation
   * to proceed (full document load), while performing quick teardowns
   * and closing any open UI (e.g., mobile drawer) beforehand.
   */
  const onNavigate = useCallback(
    (href: string) => {
      // Ignore if already at this pathname
      if (!href || href === pathname) {
        return;
      }

      // Ignore if pending to prevent double-clicks
      if (isPending) {
        return;
      }

      targetHrefRef.current = href;
      if (isMountedRef.current) setIsPending(true);

      // Begin transition and teardown previous route artifacts
      try {
        startTransition?.('Navigating…');
      } catch {}
      try {
        abortAll?.();
      } catch {}
      try { fullGsapTeardown(); } catch {}
      try { killAllScrollFx(); } catch {}
      try { killHeroFx(); } catch {}

      // Emit debug signal
      try {
        NavDebugBus.emit({ type: 'click', href, ts: performance.now() });
      } catch {}

      // Close mobile drawer immediately
      if (isMountedRef.current && isOpen) {
        setIsOpen(false);
      }

      // Fallback: clear pending if nothing happens soon
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsPending(false);
      }, 500);
    },
    [abortAll, isOpen, isPending, pathname, startTransition]
  );

  // Detect route completion and restore UI/pointers/scroll
  useEffect(() => {
    if (!targetHrefRef.current) return;
    // Path actually changed → complete transition
    if (pathname === targetHrefRef.current || pathname !== targetHrefRef.current) {
      // Clear pending and timer
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      if (isMountedRef.current) setIsPending(false);

      // Stop any loader and restore scroll (no hash → jump to top)
      try {
        finishTransition?.();
      } catch {}
      try {
        const hasHash = typeof window !== 'undefined' && window.location.hash && window.location.hash.length > 1;
        if (!hasHash) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      } catch {
        try {
          window.scrollTo({ top: 0, left: 0 });
        } catch {}
      }

      // Reset expected target
      targetHrefRef.current = null;
    }
  }, [finishTransition, pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-20 z-50 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-card/80 transition-all duration-300 shadow-lg md:hidden"
        data-interactive
        aria-label="Toggle navigation"
      >
        <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 hidden md:block"
        data-fixed-nav
      >
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 shadow-lg">
          {/* Subdomain Indicator */}
          {subdomain && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
              {getSubdomainLabel(subdomain)}
            </div>
          )}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
                isPending={isPending}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div
            ref={menuRef}
            className="absolute left-0 top-0 h-full w-80 bg-card border-r border-border shadow-2xl p-6"
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={pathname === item.href}
                  isPending={isPending}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface CommonNavItemProps {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}

interface NavItemProps extends CommonNavItemProps {
  isPending: boolean;
  onNavigate: (href: string) => void;
}

function NavItem({ href, label, icon, isActive, isPending, onNavigate }: NavItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (itemRef.current && isActive) {
      // ✅ Wrap animations in useLayoutEffect + gsap.context()
      const ctx = gsap.context(() => {
        gsap.to(itemRef.current!, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      // Cleanup function
      return () => ctx.revert();
    }
  }, [isActive]);

  return (
    <a
      ref={itemRef}
      href={href}
      onClick={() => onNavigate(href)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      data-interactive
      aria-disabled={isPending || undefined}
      style={isPending ? { pointerEvents: 'none' } : undefined}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}

interface MobileNavItemProps extends CommonNavItemProps {
  isPending: boolean;
  onNavigate: (href: string) => void;
}

function MobileNavItem({ href, label, icon, isActive, isPending, onNavigate }: MobileNavItemProps) {
  return (
    <a
      href={href}
      onClick={() => onNavigate(href)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      data-interactive
      aria-disabled={isPending || undefined}
      style={isPending ? { pointerEvents: 'none' } : undefined}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-lg">{label}</span>
    </a>
  );
}