# 🚀 Cutting-Edge Next.js Portfolio

A modern, high-performance portfolio built with the latest web technologies and frameworks.

## ✨ Cutting-Edge Technologies

### 🎯 **Core Framework**
- **Next.js 15.4.6** - Latest version with App Router
- **React 19** - Just released with concurrent features
- **TypeScript 5.9.2** - Latest version with strict type checking

### 🎨 **Styling & CSS**
- **Tailwind CSS 4** - Latest major version with significant improvements
- **PostCSS** with advanced plugins:
  - `postcss-preset-env` - Future CSS features
  - `postcss-nesting` - CSS nesting support
  - `autoprefixer` - Automatic vendor prefixes
  - `cssnano` - CSS minification (production)

### 🔧 **Development Tools**
- **ESLint 9** - Latest flat config format
- **Prettier** - Code formatting
- **SWC** - Ultra-fast JavaScript/TypeScript compiler
- **Bundle Analyzer** - Webpack bundle analysis

### 🗄️ **Database & ORM**
- **Prisma 6.11.1** - Latest version with type-safe database access
- **SQLite** - Lightweight database

### 🎭 **Animation**
- **GSAP 3.13.0** - Professional animation library
- **Framer Motion 12.23.2** - Production-ready motion library

### 🎪 **UI Components**
- **Radix UI** - Unstyled, accessible components
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Beautiful icons

### 📊 **State Management & Data**
- **Zustand 5.0.7** - Lightweight state management
- **TanStack Query 5.84.1** - Powerful data fetching
- **Zod 4.0.15** - TypeScript-first schema validation

### 🚀 **Performance & Optimization**
- **Next.js Bundle Analyzer** - Analyze bundle size
- **Terser** - JavaScript minification
- **Compression** - Gzip compression
- **Image Optimization** - WebP/AVIF support
- **Code Splitting** - Automatic chunk splitting

### 🔒 **Security & Headers**
- **Security Headers** - XSS protection, HSTS, etc.
- **CORS Configuration** - Cross-origin resource sharing
- **Content Security Policy** - XSS protection

## 🛠️ **Advanced Features**

### ⚡ **Performance Optimizations**
- **Partial Prerendering (PPR)** - Next.js 15 feature
- **React Server Components** - Server-side rendering
- **Turbo** - Incremental compilation
- **Optimized Imports** - Tree-shaking for large libraries

### 🎨 **Modern CSS Features**
- **CSS Nesting** - Native CSS nesting support
- **Custom Properties** - CSS variables
- **Color Mix** - Advanced color manipulation
- **Logical Properties** - Modern layout properties

### 🔧 **Development Experience**
- **Hot Module Replacement** - Fast development
- **Type Checking** - Strict TypeScript configuration
- **Code Formatting** - Prettier integration
- **Linting** - ESLint with custom rules

## 📦 **Available Scripts**

```bash
# Development
npm run dev                    # Start development server
npm run dev:custom            # Custom development with nodemon

# Building
npm run build                 # Production build
npm run build:analyze        # Build with bundle analysis

# Code Quality
npm run lint                  # Run ESLint
npm run lint:fix             # Fix ESLint issues
npm run format               # Format code with Prettier
npm run format:check         # Check code formatting
npm run type-check           # TypeScript type checking

# Database
npm run db:push              # Push schema to database
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Run database migrations
npm run db:reset             # Reset database
npm run db:studio            # Open Prisma Studio

# Production
npm run start                # Start production server
```

## 🎞️ Scroll Reveal Transitions

- `ScrollReveal` provides a curtain-style reveal between sections using CSS `clip-path` driven by GSAP ScrollTrigger scrub. The next section emerges while the current recedes; no jump cuts.
- Reduced motion: minimal ≤150ms fade/slide via IntersectionObserver, no pin/pin-spacer.
- `killAllScrollFx()` utility kills all ScrollTriggers/timelines and removes pin spacers; wired before route transitions.

Usage:

```tsx
import ScrollReveal from '@/components/ScrollReveal';

<ScrollReveal direction="up">
  <SectionTop>...</SectionTop>
  <SectionBottom>...</SectionBottom>
</ScrollReveal>
```

Props:
- direction: 'up' | 'down' | 'left' | 'right' (default 'up')
- ease: GSAP ease string (default 'none')
- accentClass: optional className for theming the incoming layer

## 🧭 Hero FX

- New hero is DOM-only with a blade-reveal highlight and parallax lines. No WebGL.
- Tweak strength/colors via CSS variables in `globals.css` and component inline styles.
- API in `src/lib/heroFx.ts`:
  - `initHeroFx(el)` initializes load, pointer, and scroll effects.
  - `killHeroFx()` kills timelines, ScrollTriggers, and listeners.

## 🧠 Company-Facing Hero Prompt (for Cursor/Agentic AI)

```
You are a senior Next.js + Tailwind + GSAP (DOM-only) engineer and brand designer.

Objective
Redesign my HERO so it’s company-facing (not freelancer-y), fast, and reliable. Lead with:
  H1: “Hi, I’m Arthur Wei”
  Tagline: “Backend-focused Software Engineer — AI • Cloud • Real-time Systems”
Use my details below. Do NOT include any “open to roles / available for work” language.

My details (use verbatim where appropriate)
- Name: Arthur Wei
- Role/tagline: Backend-focused Software Engineer — AI • Cloud • Real-time Systems
- One-liner: Building scalable AI and cloud systems that empower human progress.
- Location: SF Bay Area
- Credential: AWS Solutions Architect (SAA-C03)
- Focus chips:
  • AI pipelines & computer vision
  • High-performance & distributed systems
  • Secure, reliable cloud services
  • Human-centered innovation

Constraints
- Stack: Next.js (App Router), TypeScript, Tailwind. Animations: GSAP for DOM only (no Three.js/WebGL; no ScrollTrigger pinning).
- Keep it lightweight, accessible, and SEO-friendly. Respect prefers-reduced-motion.

What to build
1) Hero layout
   - Top row: small “AW” brand mark (left), compact nav (About • Work • Services • Contact • Resume). NO status pill.
   - Headline block (centered):
     • H1: “Hi, I’m Arthur Wei”
     • H2 (strong tagline): the Role/tagline above
     • Supporting sentence: the One-liner above
     • Chips row: the 4 focus areas as soft capsules
   - CTAs (company-oriented): “View Work” (primary), “Resume”, “Email”.
   - Optional small metadata row: “SF Bay Area” and “AWS Certified” pills.

2) “Wow” effect (safe and subtle)
   - Choose ONE:
     A) Diagonal **blade highlight** sweeping across the H1 using CSS mask/clip-path and a throttled GSAP tween on mousemove.
     B) **Layered SVG wave lines** behind the hero with gentle parallax (±8px) on scroll; no pinning.
   - Keep motion elegant; no particle spam; must run 60fps on desktop/mobile.

3) Visual system
   - Dark-first gradient background (teal → indigo → violet) with light noise/vignette for depth.
   - Typography via `next/font`: Inter for headings/UI; JetBrains Mono for numbers if needed.
   - Rounded-xl components, subtle shadows, 200–250ms transitions, AA contrast minimum.

4) Implementation
   - Update/replace `HeroSection.tsx`.
   - Add `components/hero/HeroBackground.tsx` (SVG lines/gradient).
   - Add `lib/heroFx.ts` exporting `initHeroFx(root)` and `killHeroFx()`.
   - No global pinning. On unmount or route change, **kill all timelines**, remove masks, and clean listeners (nav can call `killHeroFx()` before navigation).

5) Performance & a11y
   - Reserve space: `min-h-[88vh]` to keep CLS ≤ 0.03.
   - Keyboard focus states visible; semantic H1/H2 order.
   - Reduced motion: disable parallax/sweep; keep a ≤120ms fade/slide.

Copy blocks (use exactly)
- H1: Hi, I’m Arthur Wei
- H2: Backend-focused Software Engineer — AI • Cloud • Real-time Systems
- Body: Building scalable AI and cloud systems that empower human progress.
- Chips: (list the 4 focus areas above)
- CTAs: View Work • Resume • Email
- Meta pills: SF Bay Area • AWS Certified

Acceptance criteria
- Immediate brand clarity; no freelancer language or “open to roles.”
- Smooth, premium motion; zero console errors; no GSAP leaks after navigating away.
- Lighthouse (mobile): Performance ≥ 85, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Visual layout unchanged across reloads; no layout shift; responsive from 360px to 1920px.

Deliverables
- Implemented `HeroSection.tsx`, `HeroBackground.tsx`, and `lib/heroFx.ts`.
- Hooked teardown (`killHeroFx()`) into route transition cleanup.
- Brief notes on how to tweak color intensity and disable motion.
```

## 🚀 **Getting Started**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

## 🌐 **Subdomain Setup**

### **Development (Local)**
For local development, you can access subdomains by modifying your `/etc/hosts` file:

```bash
# Add these lines to /etc/hosts
127.0.0.1 photo.localhost
127.0.0.1 video.localhost  
127.0.0.1 tech.localhost
```

Then access:
- **Photography**: `http://photo.localhost:3000`
- **Video**: `http://video.localhost:3000`
- **Technology**: `http://tech.localhost:3000`

### **Production**
For production deployment, set up DNS records:

```
# DNS Records
photo.yourdomain.com  →  CNAME  →  yourdomain.com
video.yourdomain.com  →  CNAME  →  yourdomain.com
tech.yourdomain.com   →  CNAME  →  yourdomain.com
```

### **Vercel Deployment**
If using Vercel, add custom domains in your project settings:
- `photo.yourdomain.com`
- `video.yourdomain.com`
- `tech.yourdomain.com`

## 📊 **Performance Monitoring**

- **Bundle Analysis:** Run `npm run build:analyze` to analyze bundle size
- **Lighthouse:** Built-in performance auditing
- **Core Web Vitals:** Optimized for all metrics

## 🔧 **Configuration Files**

- `next.config.ts` - Next.js configuration with optimizations
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS plugins
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc` - Prettier formatting rules

## 🌟 **Cutting-Edge Features**

### **Next.js 15 Features**
- App Router with Server Components
- Partial Prerendering (PPR)
- Turbo for faster builds
- Optimized package imports

### **React 19 Features**
- Concurrent features
- Automatic batching
- Improved suspense
- Better error boundaries

### **TypeScript 5 Features**
- Latest ECMAScript target (ES2022)
- Strict type checking
- Advanced type features
- Bundler module resolution

### **Tailwind CSS 4 Features**
- Improved performance
- Better tree-shaking
- Enhanced JIT compiler
- Modern CSS features

## 📈 **Performance Metrics**

This project is optimized for:
- **First Contentful Paint (FCP)** < 1.5s
- **Largest Contentful Paint (LCP)** < 2.5s
- **Cumulative Layout Shift (CLS)** < 0.1
- **First Input Delay (FID)** < 100ms

## 🔮 **Future-Proof Architecture**

Built with modern web standards and designed to evolve with the ecosystem:
- **ES2022** JavaScript features
- **CSS Nesting** and modern CSS
- **Web Components** ready
- **PWA** capabilities
- **Micro-frontend** architecture support

---

Built with ❤️ using the latest cutting-edge technologies