import { useEffect } from 'react';
import { site } from '@/content/site';

/** Sets the browser tab title to "<title> — AV Productions" while the page is open. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} — ${site.name}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
