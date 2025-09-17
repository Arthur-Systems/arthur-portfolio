import { HeroSection } from '@/components/layout/HeroSection';
// import { InfoPanels } from '@/components/layout/InfoPanels';
// Removed 3D orb visual
import ScrollReveal from '@/components/ScrollReveal';
import BottomCards from '@/components/layout/BottomCards';
import SkillsMarquee from '@/components/layout/SkillsMarquee';
import Capabilities from '@/components/layout/Capabilities';
import ProofRow from '@/components/layout/ProofRow';
import ContactForm from '@/components/layout/ContactForm';
import WhyWorkWithMe from '@/components/layout/WhyWorkWithMe';
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
      {/* Intro Strip */}
      <BottomCards />
      {/* Scrolling skills */}
      <SkillsMarquee />
      {/* Capabilities */}
      <Capabilities />
      {/* Creds & Impact */}
      <ProofRow />
      {/* Why Work With Me */}
      <WhyWorkWithMe />
      {/* Contact */}
      <ContactForm />
    </div>
  );
}