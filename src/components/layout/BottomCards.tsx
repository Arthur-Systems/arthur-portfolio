'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutoReveal } from '@/hooks/useAutoReveal';
import { useRef } from 'react';

export default function BottomCards() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useAutoReveal({ root: rootRef.current });

  return (
    <div ref={rootRef} className="px-[var(--space-24)] py-[var(--space-32)] md:py-[var(--space-40)]">
      <div className="mx-auto w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-12 gap-[24px]">
        {/* About */}
        <Card className="md:col-span-4" data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl" aria-hidden></span>
              <span>👥 Why Me?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[15px] leading-6 text-[hsl(var(--text-2))]">
            I’m an AI and full-stack engineer who turns ideas into dependable, human-centered products. I bring pragmatic execution, clean design, and a habit of turning ambiguous problems into measurable wins.
            </p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="md:col-span-4" data-reveal>
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
                  className="chip"
                  data-interactive
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Projects */}
        <Card className="md:col-span-4" data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl" aria-hidden>💡</span>
              <span>Current Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-5 text-[15px] leading-6 text-[hsl(var(--text-2))]">
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


