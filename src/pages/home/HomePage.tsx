import { StackPanels } from '@/components/layout/StackPanels';
import { HeroSection } from '@/components/sections/HeroSection';
import { PlaceSection } from '@/components/sections/PlaceSection';
import { StudioSection } from '@/components/sections/StudioSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { CtaSection } from '@/components/sections/CtaSection';

/** Homepage: full-screen sections that stack over each other as you scroll. */
export function HomePage() {
  return (
    <StackPanels>
      <HeroSection />
      <PlaceSection />
      <StudioSection />
      <WorkSection />
      <ServicesSection />
      <ClientsSection />
      <CtaSection />
    </StackPanels>
  );
}
