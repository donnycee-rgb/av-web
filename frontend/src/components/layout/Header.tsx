import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/ui/TransitionLink';
import { navigation } from '@/content/site';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { MobileMenu } from './MobileMenu';

/** Floating rounded navigation bar, pinned to the top of every page. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* Own view-transition layer: stays still during the iris page transition */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4" style={{ viewTransitionName: 'site-header' }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl bg-ink/85 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-md sm:px-6">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-brand' : 'text-white/80 hover:text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapper controls visibility; Button's own display class would override `hidden` */}
            <div className="hidden sm:block">
              <Button to="/contact" className="!px-5 !py-2.5">
                Book a production
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-0.5 w-4 bg-current transition-all ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-4 bg-current transition-all ${menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5'}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} />
    </>
  );
}
