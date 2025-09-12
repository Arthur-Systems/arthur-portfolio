import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'Furry',
  description: 'Private area',
};

// Access gating for this route is handled in middleware.

export default function FurryPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background/20" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">Furry</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            This page is available only via the furry subdomain.
          </p>
        </div>
      </section>
    </div>
  );
}

