import type { Metadata } from "next";
import "./globals.css";
// Self-host variable fonts via Fontsource (no manual /public/fonts needed)
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Navigation } from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { CustomCursor } from "@/components/common/CustomCursor";
import MicroEffects from "@/components/common/MicroEffects";
import { StructuredData } from "@/components/common/StructuredData";
import { ScrollFixer } from "@/components/common/ScrollFixer";
import { CustomScrollbar } from "@/components/hero/CustomScrollbar";
import ClientGate from "@/components/layout/ClientGate";
import LoadingOverlay from "@/components/LoadingOverlay";
import { UIReadyProvider } from "@/hooks/useUIReady";
import { LoaderProvider } from "@/state/LoaderContext";
import { RouteTransitionProvider } from "@/state/RouteTransitionContext";
import NavigationObserver, { NavigationDiagnosticsOverlay } from "@/components/NavigationObserver";
import ErrorBoundary from "@/components/ErrorBoundary";
import Head from "./head";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { getDesignVars } from "@/lib/designVars";

export const metadata: Metadata = {
  /** 👇 absolute origin for OG + Twitter cards */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? // e.g. https://arthurwei.dev
      `http://localhost:${process.env.PORT ?? 3000}`
  ),
  
  title: {
    default: "Arthur Wei • AI Engineer • Machine Learning • Software Developer",
    template: "%s | Arthur Wei",
  },
  description: "Arthur Wei - AI Engineer and Machine Learning specialist. Building intelligent systems, optimizing models, and creating scalable AI solutions for real-world applications.",
  keywords: ["Arthur Wei", "AI Engineer", "Machine Learning", "Artificial Intelligence", "ML Engineer", "Software Developer", "Python", "Deep Learning", "Computer Vision", "NLP"],
  authors: [{ name: "Haichuan Wei" }, { name: "Arthur Wei" }],
  openGraph: {
    title: "Arthur Wei • AI Engineer • Machine Learning • Software Developer",
    description: "AI Engineer and Machine Learning specialist building intelligent systems and scalable AI solutions.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`,
    siteName: "Haichuan Wei",
    type: "website",
    images: [
      {
        url: "/api/og?title=Arthur%20Wei&subtitle=AI%20Engineer%20•%20Machine%20Learning%20•%20Software%20Developer",
        width: 1200,
        height: 630,
        alt: "Haichuan Wei Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arthur Wei • AI Engineer • Machine Learning • Software Developer",
    description: "AI Engineer and Machine Learning specialist building intelligent systems and scalable AI solutions.",
    images: ["/api/og?title=Arthur%20Wei&subtitle=AI%20Engineer%20•%20Machine%20Learning%20•%20Software%20Developer"],
  },
  robots: "index, follow",
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-space-grotesk dark">
      <head>
        <Head />
        <StructuredData type="Person" data={{}} />
        <StructuredData type="WebSite" data={{}} />
      </head>
      <body className={`font-sans antialiased text-foreground`}>
        <ThemeProvider>
          <LoaderProvider>
            <UIReadyProvider>
              <Suspense fallback={null}>
                <RouteTransitionProvider>
                  <LoadingOverlay />
                  <NavigationObserver />
                  <ClientGate>
                  <ScrollFixer />
                  <CustomScrollbar />
                  <CustomCursor />
                  <MicroEffects />
                  <ThemeToggle />
                  {/* Page-wide single Night Gradient background */}
                  <div
                    style={getDesignVars()}
                    className="min-h-screen"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none fixed inset-0 -z-10"
                      style={{
                        background:
                          "linear-gradient(135deg, #0b1324 0%, #04070f 60%, #0b1324 100%)",
                      }}
                    />
                    <Navigation />
                    <main aria-busy={false} suppressHydrationWarning className="pb-[var(--space-40)]">
                      <ErrorBoundary>
                        {children}
                      </ErrorBoundary>
                    </main>
                    <Footer />
                    <Toaster />
                  </div>
                  </ClientGate>
                  <NavigationDiagnosticsOverlay />
                  <SpeedInsights />
                  <Analytics />
                </RouteTransitionProvider>
              </Suspense>
            </UIReadyProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
