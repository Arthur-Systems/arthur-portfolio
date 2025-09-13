import { HeroSection } from '@/components/layout/HeroSection';
// import { InfoPanels } from '@/components/layout/InfoPanels';
import AboutSection from '@/components/about/AboutSection';
// Removed 3D orb visual
import ScrollReveal from '@/components/ScrollReveal';
import BottomCards from '@/components/layout/BottomCards';
import SkillsMarquee from '@/components/layout/SkillsMarquee';
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
          <BottomCards />
        </section>
      </ScrollReveal>
      <SkillsMarquee />
      {/* Contact anchor for in-page nav */}
      <div id="contact" className="h-0" />
    </div>
  );
}