'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Server, LayoutDashboard } from 'lucide-react';
import React from 'react';

const CAPABILITIES = [
  {
    icon: BrainCircuit,
    title: 'Reliable AI Systems',
    body: 'On-device to cloud. Reproducible results and guardrails.',
    chips: ['YOLOv8', 'TFLite', 'PyTorch'],
  },
  {
    icon: Server,
    title: 'Distributed Backends',
    body: 'Observable services with strong SLOs and graceful degradation.',
    chips: ['FastAPI', 'Lambda/API GW', 'Cloud Run'],
  },
  {
    icon: LayoutDashboard,
    title: 'Human-Centered Tools',
    body: 'Dashboards that explain model behavior and outcomes.',
    chips: ['Next.js', 'Tailwind', 'Shadcn'],
  },
];

export default function Capabilities() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!rootRef.current) return;
    import('@/lib/animateSections').then(({ animateWhatIDo, attachCardHoverMotion }) => {
      animateWhatIDo(rootRef.current!);
      attachCardHoverMotion(rootRef.current!);
    });
  }, []);
  return (
    <section ref={rootRef as any} aria-label="Capabilities" className="whatido py-24">
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)]">
        <header className="mb-8">
          <h2 className="text-[32px] font-semibold tracking-tight">What I Do</h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((c) => (
            <Card key={c.title} className="cap-card h-full will-change-transform">
              <CardHeader className="px-6">
                <CardTitle className="flex items-center gap-3">
                  <c.icon className="cap-icon h-5 w-5 text-[color:#49D0C1]" />
                  <span className="cap-title text-[20px] font-semibold">{c.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="cap-body text-[16px] leading-6 text-[hsl(var(--text-2))] max-w-[68ch]">{c.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.chips.map((chip) => (
                    <span key={chip} className="cap-chip chip" data-interactive>{chip}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


