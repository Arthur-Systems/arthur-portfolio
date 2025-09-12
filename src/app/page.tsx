import { HeroSection } from '@/components/layout/HeroSection';
import { InfoPanels } from '@/components/layout/InfoPanels';
import AboutSection from '@/components/about/AboutSection';
// Removed 3D orb visual
import ScrollReveal from '@/components/ScrollReveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Portfolio of Haichuan (Arthur) Wei — engineer, photographer, and storyteller building immersive digital experiences.',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ScrollReveal direction="up">
        <section>
          <InfoPanels />
        </section>
      </ScrollReveal>
    </div>
  );
}