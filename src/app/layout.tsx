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
import { CustomCursor } from "@/components/common/CustomCursor";
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

export const metadata: Metadata = {
  /** 👇 absolute origin for OG + Twitter cards */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? // e.g. https://arthurwei.dev
      `http://localhost:${process.env.PORT ?? 3000}`
  ),
  
  title: {
    default: "Haichuan (Arthur) Wei • Engineer • Photographer • Storyteller",
    template: "%s | Haichuan Wei",
  },
  description: "Personal portfolio of Haichuan (Arthur) Wei — Engineer, Photographer, and Storyteller. Creating immersive digital experiences at the intersection of technology and creativity.",
  keywords: ["Haichuan Wei", "Arthur Wei", "Engineer", "Photographer", "Storyteller", "Full-stack Developer", "3D Graphics", "Motion Design", "Creative Technology"],
  authors: [{ name: "Haichuan Wei" }, { name: "Arthur Wei" }],
  openGraph: {
    title: "Haichuan Wei • Engineer • Photographer • Storyteller",
    description: "Creating immersive digital experiences at the intersection of technology and creativity.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      `http://localhost:${process.env.PORT ?? 3000}`,
    siteName: "Haichuan Wei",
    type: "website",
    images: [
      {
        url: "/api/og?title=Haichuan%20Wei&subtitle=Engineer%20•%20Photographer%20•%20Storyteller",
        width: 1200,
        height: 630,
        alt: "Haichuan Wei Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haichuan Wei • Engineer • Photographer • Storyteller",
    description: "Creating immersive digital experiences at the intersection of technology and creativity.",
    images: ["/api/og?title=Haichuan%20Wei&subtitle=Engineer%20•%20Photographer%20•%20Storyteller"],
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
      <body className={`font-sans antialiased bg-background text-foreground dark:bg-arthur-dark-bg dark:text-arthur-dark-text`}>
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
                  <ThemeToggle />
                  {/* Page-wide gradient background to avoid black band behind fixed nav or pin spacers */}
                  <div className="min-h-screen bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.30)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.30)_0%,transparent_50%),linear-gradient(135deg,#0f172a_0%,#000000_50%,#0f172a_100%)]">
                    <Navigation />
                    <main aria-busy={false} suppressHydrationWarning>
                      <ErrorBoundary>
                        {children}
                      </ErrorBoundary>
                    </main>
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
