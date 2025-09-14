# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: Next.js (App Router) + TypeScript + Tailwind + Vitest. A custom Node server (server.ts) integrates Socket.IO in dev/prod when needed.

Key commands (pwsh-friendly)
- Install deps
  ```bash path=null start=null
  npm install
  ```
- Development (choose one)
  - Standard Next dev server (fastest loop)
    ```bash path=null start=null
    npm run dev
    ```
  - Custom dev server with Socket.IO (use if you need websockets under /api/socketio)
    ```bash path=null start=null
    npm run dev:custom
    ```
- Build and run
  ```bash path=null start=null
  npm run build
  npm run start
  ```
- Bundle analysis
  - PowerShell
    ```bash path=null start=null
    $env:ANALYZE='true'; npm run build
    ```
  - POSIX shells
    ```bash path=null start=null
    ANALYZE=true npm run build
    ```
- Lint/format/type-check
  ```bash path=null start=null
  npm run lint
  npm run lint:fix
  npm run format
  npm run format:check
  npm run type-check
  ```
- Tests (Vitest, jsdom)
  - Run all (CI mode)
    ```bash path=null start=null
    npm run test
    ```
  - Watch mode (local loop)
    ```bash path=null start=null
    npx vitest
    ```
  - Single file
    ```bash path=null start=null
    npm run test -- src/components/LoadingOverlay.test.tsx
    ```
  - Filter by test name pattern
    ```bash path=null start=null
    npm run test -- -t "Calibrating ranges"
    # or interactively: npx vitest -t "pattern"
    ```

URLs and local subdomains
- App: http://localhost:3000
- Optional subdomains for sectioned experiences (from README):
  - photo.localhost:3000 → /photography
  - video.localhost:3000 → /video
  - tech.localhost:3000 → /tech
- For local subdomains, add entries to your hosts file.
  - Windows: C:\Windows\System32\drivers\etc\hosts
  - POSIX: /etc/hosts
  Example lines:
  ```bash path=null start=null
  127.0.0.1 photo.localhost
  127.0.0.1 video.localhost
  127.0.0.1 tech.localhost
  ```

Architecture (big picture)
- App shell and providers
  - Next.js App Router in src/app. Root layout wires global providers and UI: ThemeProvider, LoaderProvider, UIReadyProvider, RouteTransitionProvider, NavigationObserver, LoadingOverlay, global background, nav, and ErrorBoundary.
  - Metadata/OG handled via src/app/layout.tsx and edge route src/app/api/og/route.tsx.
- Navigation and route transitions
  - components/layout/Navigation coordinates navigations and pre-teardown: on link click it starts a transition, aborts in-flight work, and calls teardown utilities.
  - state/RouteTransitionContext centralizes transitions: starts/stops loader, aborts AbortControllers, does multi-frame GSAP cleanup, then restores scroll and focus. NavigationObserver logs route events and window errors via a NavDebugBus and can render a debug overlay with ?debugNav=1.
- Animation system (GSAP, DOM-only)
  - lib/heroFx implements the hero entrance (with robust prefers-reduced-motion path). It returns nothing and exposes killHeroFx() for teardown.
  - lib/gsapCleanup and lib/scrollFx provide hard-kill utilities for ScrollTrigger/Smoother, remove pin spacers, clear inline styles, and refresh triggers. These are invoked before/after navigations.
  - lib/gsap/config registers GSAP plugins and defines shared presets.
- Reusable UI/state
  - Loader overlay is driven by state/LoaderContext and an imperative loaderBus (Loader.start/step/finish) used by transitions and tests. The overlay is accessible (aria-busy, focus trap) and respects reduced motion.
  - Tailwind + shadcn/ui components live under src/components/ui and common layout/hero modules under src/components/layout and src/components/hero.
- Server and APIs
  - server.ts boots Next and attaches Socket.IO at path /api/socketio (dev via npm run dev:custom, prod via npm run start). Socket handlers live in src/lib/socket.ts.
  - API routes include /api/health (simple JSON) and the edge /api/og image generator.
- Data access
  - Application data is managed through client-side state using TanStack Query and Zustand.

Notes and constraints
- ESLint flat config enables Next/TypeScript rules but intentionally disables many strictness checks for developer ergonomics; CI guard blocks imports of three/@react-three/* (WebGL stack removed).
- next.config.ts sets reactStrictMode: true and ignores type/lint errors during builds; be mindful when treating build green as correctness.
- Vitest setup (vitest.setup.ts) polyfills matchMedia and silences noisy canvas errors for jsdom.
- The “Company-Facing Hero” prompt and acceptance criteria in README detail expectations for HeroSection, motion budgets, accessibility, teardown discipline, and Lighthouse targets. Consult that section if you work on the hero.

Troubleshooting (high-signal)
- Bundle analysis on Windows: prefer `$env:ANALYZE='true'; npm run build` rather than `npm run build:analyze` if the latter fails in your shell.
- Websockets during development: use `npm run dev:custom` so the Socket.IO server at /api/socketio is active.
