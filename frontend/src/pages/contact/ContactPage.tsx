import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ContactScene } from '@/components/sections/ContactScene';
import { FaqSection } from '@/components/sections/FaqSection';

/** Contact: a fill-in-the-script message with a live clapperboard, then FAQs. */
export function ContactPage() {
  useDocumentTitle('Contact');
  return (
    <>
      <ContactScene />
      <FaqSection />
    </>
  );
}
