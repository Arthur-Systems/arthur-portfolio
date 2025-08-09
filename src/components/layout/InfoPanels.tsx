'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Card, CardContent } from '@/components/ui/card';
import { useTiltCard } from '@/hooks/useTiltCard';

interface PanelData {
  title: string;
  description: string;
  icon: string;
}

const panels: PanelData[] = [
  {
    title: 'About',
    description: 'Passionate engineer with a keen eye for design and a love for creating immersive digital experiences.',
    icon: '👨‍💻',
  },
  {
    title: 'Skills',
    description: 'Full-stack development, 3D graphics, motion design, and creative problem-solving.',
    icon: '🚀',
  },
  {
    title: 'Current Projects',
    description: 'Building innovative solutions at the intersection of technology and creativity.',
    icon: '💡',
  },
];

const techLogos = [
  'React', 'Next.js', 'TypeScript', 'GSAP', 'Node.js',
  'Python', 'PostgreSQL', 'Docker', 'AWS', 'Figma', 'Blender'
];

export const InfoPanels = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate panels (select from container to avoid stale refs)
    const container = containerRef.current;
    const panelsEls = container
      ? (Array.from(container.querySelectorAll('[data-panel]')) as HTMLElement[])
      : [];

    panelsEls.forEach((panel, index) => {
      gsap.from(panel, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Animate marquee
    if (marqueeRef.current) {
      gsap.from(marqueeRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }
    return () => {
      // Cleanup created triggers on unmount
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {panels.map((panel) => (
            <TiltCard
              key={panel.title}
              title={panel.title}
              description={panel.description}
              icon={panel.icon}
            />
          ))}
        </div>

        {/* Tech Logos Marquee */}
        <div ref={marqueeRef} className="overflow-hidden">
          <div className="flex space-x-8 animate-marquee whitespace-nowrap">
            {techLogos.map((logo, index) => (
              <div
                key={index}
                className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2"
              >
                {logo}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {techLogos.map((logo, index) => (
              <div
                key={`dup-${index}`}
                className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface TiltCardProps {
  title: string;
  description: string;
  icon: string;
}

function TiltCard({ title, description, icon }: TiltCardProps) {
  const cardRef = useTiltCard({
    maxTilt: 10,
    scale: 1.02,
    speed: 0.6,
  });

  return (
    <Card
      ref={cardRef}
      className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300 cursor-pointer"
      data-interactive
      data-panel
    >
      <CardContent className="space-y-4">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}