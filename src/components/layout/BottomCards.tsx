'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutoReveal } from '@/hooks/useAutoReveal';
import { useRef } from 'react';

export default function BottomCards() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useAutoReveal({ root: rootRef.current });

  return (
    <div ref={rootRef} className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* About */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/60" data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>👋</span>
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Passionate engineer focused on end-to-end AI systems — from on-device
              inference to cloud APIs. I love crafting performant, resilient
              experiences that feel alive.
            </p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/60" data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>🚀</span>
              <span>Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'Full‑stack (Next.js/React)',
                'AI Systems (Python/YOLO/PyTorch)',
                'Cloud (AWS S3/Lambda/API GW)',
                'Realtime & WebSockets',
                '3D & Motion',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  data-interactive
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Projects */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/60" data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>💡</span>
              <span>Current Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>YOLOv8 tablet inference toolkit with on-device optimization</li>
              <li>Serverless grading automation for Canvas with secure APIs</li>
              <li>Realtime collaboration bot + dashboard for Discord</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


