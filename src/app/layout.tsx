import type { Metadata } from "next";
import "./globals.css";
// Self-host variable fonts via Fontsource (no manual /public/fonts needed)
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import { Toaster } from "@/components/ui/toaster";
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

export const metadata: Metadata = {
  /** 👇 absolute origin for OG + Twitter cards */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? // e.g. https://arthurwei.dev
      `http://localhost:${process.env.PORT ?? 3000}`
  ),
  
  title: {
    default: "Arthur Wei • Engineer • Photographer • Storyteller",
    template: "%s | Arthur Wei",
  },
  description: "Personal portfolio of Arthur Wei - Engineer, Photographer, and Storyteller. Creating immersive digital experiences at the intersection of technology and creativity.",
  keywords: ["Arthur Wei", "Engineer", "Photographer", "Storyteller", "Full-stack Developer", "3D Graphics", "Motion Design", "Creative Technology"],
  authors: [{ name: "Arthur Wei" }],
  openGraph: {
    title: "Arthur Wei • Engineer • Photographer • Storyteller",
    description: "Creating immersive digital experiences at the intersection of technology and creativity.",
    url: "https://arthurwei.com",
    siteName: "Arthur Wei",
    type: "website",
    images: [
      {
        url: "/api/og?title=Arthur Wei&subtitle=Engineer • Photographer • Storyteller",
        width: 1200,
        height: 630,
        alt: "Arthur Wei Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arthur Wei • Engineer • Photographer • Storyteller",
    description: "Creating immersive digital experiences at the intersection of technology and creativity.",
    images: ["/api/og?title=Arthur Wei&subtitle=Engineer • Photographer • Storyteller"],
  },
  robots: "index, follow",
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
              <RouteTransitionProvider>
                <LoadingOverlay />
                <NavigationObserver />
                <ClientGate>
                  <ScrollFixer />
                  <CustomScrollbar />
                  <CustomCursor />
                  <ThemeToggle />
                  <Navigation />
                  <main>
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </main>
                  <Toaster />
                </ClientGate>
                <NavigationDiagnosticsOverlay />
              </RouteTransitionProvider>
            </UIReadyProvider>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
