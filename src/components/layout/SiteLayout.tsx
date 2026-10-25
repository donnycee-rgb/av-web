import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { IntroCurtain } from './IntroCurtain';
import { ViewfinderCursor } from './ViewfinderCursor';
import { Spotlight } from './Spotlight';

/** Shell shared by every page: header, page content, footer. */
export function SiteLayout() {
  const { pathname, hash } = useLocation();

  // Start each new page at the top — or at the section a link points to (/studio#services) —
  // instantly, overriding the site's smooth scrolling (meant for in-page links). Layout effect so
  // it happens before the iris transition captures the new page; a normal effect would let it
  // open on the old scroll position.
  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <IntroCurtain />
      <ViewfinderCursor />
      <Spotlight />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
