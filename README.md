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

### 🎭 **Animation & 3D**
- **Three.js 0.179.1** - Latest 3D graphics library
- **React Three Fiber 9.3.0** - React renderer for Three.js
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