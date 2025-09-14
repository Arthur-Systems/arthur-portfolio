# My Portfolio

A modern, accessible, and fast personal site powered by Next.js 15 with a clean design system, subtle motion, and strong SEO/A11y defaults.

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Scripts](#scripts)
* [Environment Variables](#environment-variables)
* [Project Structure](#project-structure)
* [UI & Motion](#ui--motion)
* [Subdomain Setup](#subdomain-setup)
* [Deploying to Vercel](#deploying-to-vercel)
* [Performance & Monitoring](#performance--monitoring)
* [Security](#security)
* [Roadmap](#roadmap)

---

## Features

* **App Router + React Server Components** with **Partial Prerendering (PPR)** for top-tier performance.
* **Design system** with Tailwind, Radix primitives, shadcn/ui, and Lucide icons.
* **Elegant motion** using GSAP and Framer Motion with full reduced-motion support.
* **Company-facing hero** with subtle parallax/blade highlight (DOM-only).
* **SEO & social**: metadata, sitemap, robots, and OG image routes.
* **Subdomain-based sections** (photo/video/tech) locally and in production.

## Tech Stack

**Core**

* Next.js **15.4.6** (App Router), React **19**, TypeScript **5.9.2**

**Styling**

* Tailwind CSS **4**, PostCSS (`postcss-preset-env`, `postcss-nesting`, `autoprefixer`, `cssnano`)

**Data & State**

* TanStack Query **5.84.1**, Zustand **5.0.7**, Zod **4.0.15**

**UI & Motion**

* Radix UI, shadcn/ui, Lucide React
* GSAP **3.13.0**, Framer Motion **12.23.2**

**Tooling & Perf**

* ESLint **9** (flat config), Prettier, SWC, Next.js Bundle Analyzer, Terser

> Versions shown are the versions this repo is tested with.

---

## Getting Started

```bash
# 1) Install
npm install

# 2) Run dev server
npm run dev

# 4) Production build
npm run build
npm run start
```

## Scripts

```bash
# Development
npm run dev             # Start dev server
npm run dev:custom      # Custom dev (nodemon)

# Build
npm run build           # Production build
npm run build:analyze   # Build + bundle analysis

# Quality
npm run lint            # ESLint
npm run lint:fix        # ESLint (fix)
npm run format          # Prettier write
npm run format:check    # Prettier check
npm run type-check      # TS type-check

```

## Project Structure

```
src/
  app/
    (routes)/
    api/
      og/               # runtime='edge' example
  components/
    hero/
      HeroBackground.tsx
    ScrollReveal.tsx
  lib/
    heroFx.ts           # initHeroFx / killHeroFx
    utils/
  styles/
    globals.css
public/
```

---

## UI & Motion

### Scroll Reveal Transitions

Curtain-style reveals driven by GSAP ScrollTrigger (scrub), with a reduced-motion fallback (≤150ms fade/slide via IntersectionObserver).

**Usage**

```tsx
import ScrollReveal from '@/components/ScrollReveal';

<ScrollReveal direction="up">
  <SectionTop>...</SectionTop>
  <SectionBottom>...</SectionBottom>
</ScrollReveal>
```

**Props**

* `direction`: `'up' | 'down' | 'left' | 'right'` (default `'up'`)
* `ease`: GSAP ease string (default `'none'`)
* `accentClass`: optional class for theming the incoming layer

**Utilities**

* `killAllScrollFx()` tears down ScrollTriggers, timelines, and pin spacers (call before route transitions).

### Hero FX (DOM-only)

* Blade-reveal highlight and gentle parallax lines (no WebGL).
* Tuned with CSS variables in `globals.css`.
* `lib/heroFx.ts`: `initHeroFx(el)`, `killHeroFx()` to cleanly start/stop effects.

<details>
<summary>Company-Facing Hero Prompt (for Cursor/Agentic AI)</summary>

Use the prompt in `/docs/company-hero-prompt.md` to generate a recruiter-friendly hero with:

* H1: “Hi, I’m Arthur Wei”
* H2: “Backend-focused Software Engineer — AI • Cloud • Real-time Systems”
* Body: “Building scalable AI and cloud systems that empower human progress.”
* Chips: AI pipelines & CV • High-performance & distributed systems • Secure, reliable cloud services • Human-centered innovation
* CTAs: View Work • Resume • Email
* Meta: SF Bay Area • AWS Certified

</details>

---

## Subdomain Setup

### Local (hosts file)

```bash
# /etc/hosts
127.0.0.1 photo.localhost
127.0.0.1 video.localhost
127.0.0.1 tech.localhost
```

Then visit:

* `http://photo.localhost:3000`
* `http://video.localhost:3000`
* `http://tech.localhost:3000`

### Production (DNS)

```
photo.yourdomain.com  CNAME  yourdomain.com
video.yourdomain.com  CNAME  yourdomain.com
tech.yourdomain.com   CNAME  yourdomain.com
```

---

## Deploying to Vercel

* Set **Environment Variables** (Project → Settings → Environment Variables):

  * `NEXT_PUBLIC_SITE_URL` → e.g., `https://yourdomain.com`
* API routes under `src/app/api/*` run serverless or edge (e.g., `/api/og` is `runtime='edge'`).
* **Realtime**: `server.ts` (Socket.IO) isn’t used on Vercel. For realtime, use Edge WebSockets or a provider (Ably/Pusher) or host Socket.IO separately.

---

## Performance & Monitoring

* **Bundle analysis**: `npm run build:analyze`
* **Core Web Vitals targets**: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, FID < 100ms
* **Lighthouse goals (mobile)**: Performance ≥ 85, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95

**Platform techniques**

* Image optimization (WebP/AVIF), code splitting, tree-shaken imports, SWC transforms, Terser minification.

---

## Security

* Sensible security headers (HSTS, X-Content-Type-Options, Referrer-Policy, etc.)
* CORS as needed for APIs
* Content Security Policy (CSP) tuned for fonts, images, and OG routes

---

## Roadmap

* Optional PWA (offline & install prompts)
* Web-components friendly slots for embeds
* Edge-native realtime (WebSockets) for live counters/typing indicators

---

