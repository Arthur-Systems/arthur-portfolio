'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import React from 'react';

export default function ProofRow() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!rootRef.current) return;
    import('@/lib/animateSections').then(({ animateCreds, attachCardHoverMotion }) => {
      animateCreds(rootRef.current!);
      attachCardHoverMotion(rootRef.current!);
    });
  }, []);
  return (
    <section ref={rootRef as any} aria-label="Creds & Impact" className="creds py-16">
      <div className="mx-auto w-full max-w-[1200px] px-[var(--space-24)] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AWS Certified Card */}
        <Card aria-labelledby="aws-title" className="creds-card will-change-transform">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="aws-title" className="text-[20px] font-semibold">AWS Certified (SAA-C03)</CardTitle>
              <span className="badge-verified chip chip--active inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" />Verified</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[16px] leading-6 text-[hsl(var(--text-2))]">
              {[
                'Cut p95 cold starts 25–35% via provisioned concurrency.',
                'API Gateway + Lambdas handle ~3–4k req/min bursts.',
                'CloudWatch + X-Ray reduced MTTR by ~65%.',
              ].map((item) => (
                <li key={item} className="cred-line flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-[color:#49D0C1]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Wins Card */}
        <Card aria-labelledby="wins-title" className="wins-card will-change-transform">
          <CardHeader>
            <CardTitle id="wins-title" className="text-[20px] font-semibold">Recent Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[16px] leading-6 text-[hsl(var(--text-2))]">
              {[
                'Tablet YOLOv8 tuned; +18% mAP@50 with faster startup.',
                'Streaming eval API 2.4× faster, zero timeouts at peak.',
                'Audit console shipped; <24h PR cycle, 0 broken links.',
              ].map((item) => (
                <li key={item} className="win-line flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-[color:#49D0C1]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


