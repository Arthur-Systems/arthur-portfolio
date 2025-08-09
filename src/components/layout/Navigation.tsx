'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { NavDebugBus } from '@/state/navDebugBus';
import { getSubdomain, getSubdomainLabel } from '@/lib/utils';
import { useRouteTransition } from '@/state/RouteTransitionContext';
import { fullGsapTeardown } from '@/lib/gsapCleanup';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/photography', label: 'Photography', icon: '📸' },
  { href: '/tech', label: 'Software Dev', icon: '💻' },
  { href: '/video', label: 'Film', icon: '🎬' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
                  onClick={closeMenu}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const { startTransition, abortAll } = useRouteTransition();

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
    <Link
      ref={itemRef}
      href={href}
      onClick={() => {
        // Proactively begin transition and teardown scroll/gsap artifacts
        try {
          startTransition('Navigating…');
          abortAll();
          fullGsapTeardown();
        } catch {}
        NavDebugBus.emit({ type: 'click', href, ts: performance.now() });
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      data-interactive
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

interface MobileNavItemProps extends NavItemProps {
  onClick: () => void;
}

function MobileNavItem({ href, label, icon, isActive, onClick }: MobileNavItemProps) {
  const { startTransition, abortAll } = useRouteTransition();
  return (
    <Link
      href={href}
      onClick={() => {
        try {
          startTransition('Navigating…');
          abortAll();
          fullGsapTeardown();
        } catch {}
        NavDebugBus.emit({ type: 'click', href, ts: performance.now() });
        onClick();
      }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      data-interactive
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-lg">{label}</span>
    </Link>
  );
}