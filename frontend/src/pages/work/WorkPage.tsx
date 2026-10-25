import { WorkEditor } from '@/components/sections/WorkEditor';
import { ClosingCta } from '@/components/sections/ClosingCta';

/** Work page: every project laid out as an editing timeline. */
export function WorkPage() {
  return (
    <>
      <WorkEditor />
      <ClosingCta />
    </>
  );
}
