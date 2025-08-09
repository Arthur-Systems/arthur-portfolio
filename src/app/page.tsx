import EngineerHero from '@/components/hero/EngineerHero';
import { InfoPanels } from '@/components/layout/InfoPanels';
import HeroScene from '@/components/hero/HeroScene';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Lightweight DOM visual in place of prior WebGL hero */}
      <HeroScene />
      <EngineerHero />
      <InfoPanels />
    </div>
  );
}